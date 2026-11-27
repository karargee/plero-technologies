-- ===========================================================================
-- Plero Technologies — step 2: editable site content + testimonials
-- Run ONCE in Supabase: SQL Editor → New query → paste ALL → Run.
-- Safe to run again.
-- ===========================================================================

-- ---------- Site content (every text block the admin can edit) ----------
-- One row per section, e.g. key = 'home', 'settings', 'faqs'. `data` holds the JSON.
create table if not exists public.content (
  key text primary key check (char_length(key) <= 60),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists content_touch on public.content;
create trigger content_touch before update on public.content
  for each row execute function public.touch_updated_at();

-- ---------- Testimonials (visitors submit → admin approves) ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 80),
  location text not null default '' check (char_length(location) <= 80),
  service text not null default '' check (char_length(service) <= 60),
  quote text not null check (char_length(quote) between 10 and 1000),
  rating int not null default 5 check (rating between 1 and 5),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  source text not null default 'visitor' check (source in ('visitor', 'admin')),
  featured boolean not null default false
);

-- ---------- Image uploads (Supabase Storage) ----------
-- Public bucket: anyone can VIEW images; only admins can upload / replace / delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site images public read" on storage.objects;
create policy "site images public read" on storage.objects
  for select using (bucket_id = 'site-images');
drop policy if exists "site images admin insert" on storage.objects;
create policy "site images admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "site images admin update" on storage.objects;
create policy "site images admin update" on storage.objects
  for update to authenticated using (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "site images admin delete" on storage.objects;
create policy "site images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'site-images' and public.is_admin());

-- ---------- Access (security rules below still apply) ----------
grant select on public.content to anon, authenticated;
grant insert, update, delete on public.content to authenticated;
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;
grant all on public.content, public.testimonials to service_role;

alter table public.content enable row level security;
alter table public.testimonials enable row level security;

-- Content: everyone can read (the website shows it); only admins can change.
drop policy if exists "content public read" on public.content;
create policy "content public read" on public.content for select using (true);
drop policy if exists "content admin write" on public.content;
create policy "content admin write" on public.content for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Testimonials: the public sees only APPROVED ones; admins see and manage all.
-- Visitors submit through the website's server (service key), never directly.
drop policy if exists "testimonials public read approved" on public.testimonials;
create policy "testimonials public read approved" on public.testimonials
  for select using (status = 'approved' or public.is_admin());
drop policy if exists "testimonials admin write" on public.testimonials;
create policy "testimonials admin write" on public.testimonials for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
