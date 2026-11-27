-- ===========================================================================
-- Plero Technologies — Supabase schema for the /admin page
-- Run this ONCE in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- It is safe to run again (it won't duplicate data).
-- ===========================================================================

-- ---------- Admins (who may sign in to /admin) ----------
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

-- True when the signed-in Supabase user's email is in public.admins.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------- Rates (Deriv, USDT, Airtm, China) ----------
create table if not exists public.rates (
  key text primary key,
  value numeric not null check (value >= 0),
  updated_at timestamptz not null default now()
);

-- ---------- Gift cards ----------
create table if not exists public.gift_cards (
  id text primary key,
  name text not null,
  color text not null default '#4c4fa6',
  rate numeric not null check (rate >= 0),
  change numeric not null default 0,
  min numeric not null default 0,
  max numeric not null default 0,
  active boolean not null default true,
  sort int not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------- Contact form messages ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) <= 100),
  email text not null check (char_length(email) <= 200),
  topic text not null default 'General' check (char_length(topic) <= 60),
  message text not null check (char_length(message) <= 5000),
  read boolean not null default false
);

-- Keep updated_at fresh on edits.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rates_touch on public.rates;
create trigger rates_touch before update on public.rates
  for each row execute function public.touch_updated_at();

drop trigger if exists gift_cards_touch on public.gift_cards;
create trigger gift_cards_touch before update on public.gift_cards
  for each row execute function public.touch_updated_at();

-- ---------- Row Level Security ----------
alter table public.admins enable row level security;
alter table public.rates enable row level security;
alter table public.gift_cards enable row level security;
alter table public.messages enable row level security;

-- Admins: a signed-in user can see only their own admin row (used to check access).
drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row" on public.admins
  for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Rates: everyone can read (the public site shows them); only admins can change.
drop policy if exists "rates public read" on public.rates;
create policy "rates public read" on public.rates for select using (true);
drop policy if exists "rates admin write" on public.rates;
create policy "rates admin write" on public.rates for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Gift cards: everyone can read; only admins can change.
drop policy if exists "gift cards public read" on public.gift_cards;
create policy "gift cards public read" on public.gift_cards for select using (true);
drop policy if exists "gift cards admin write" on public.gift_cards;
create policy "gift cards admin write" on public.gift_cards for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Messages: only admins can read/update/delete. The website inserts them from the
-- server using the service-role key (which bypasses RLS), so no public insert policy.
drop policy if exists "messages admin all" on public.messages;
create policy "messages admin all" on public.messages for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------- Starting values (same as the site's built-in defaults) ----------
insert into public.rates (key, value) values
  ('deriv_deposit', 1650), ('deriv_withdraw', 1580), ('deriv_min', 5), ('deriv_max', 2000),
  ('usdt_buy', 1665), ('usdt_sell', 1600), ('usdt_min', 10), ('usdt_max', 10000),
  ('airtm_buy', 1660), ('airtm_sell', 1590), ('airtm_min', 10), ('airtm_max', 5000),
  ('china_rate', 236), ('china_fee', 5000), ('china_min', 500), ('china_max', 500000)
on conflict (key) do nothing;

insert into public.gift_cards (id, name, color, rate, change, min, max, sort) values
  ('apple', 'Apple / iTunes', '#1d1d1f', 1180, 0.8, 25, 2000, 1),
  ('amazon', 'Amazon', '#ff9900', 1120, -0.4, 25, 1000, 2),
  ('steam', 'Steam', '#1b2838', 1210, 1.2, 20, 500, 3),
  ('google', 'Google Play', '#0f9d58', 1050, 0.3, 25, 500, 4),
  ('razer', 'Razer Gold', '#00c000', 1150, 0.6, 10, 500, 5),
  ('sephora', 'Sephora', '#000000', 980, -0.2, 50, 500, 6),
  ('ebay', 'eBay', '#e53238', 1010, 0.1, 25, 500, 7),
  ('nordstrom', 'Nordstrom', '#2c2c2c', 990, 0, 50, 500, 8),
  ('walmart', 'Walmart', '#0071ce', 1030, 0.5, 25, 500, 9),
  ('vanilla', 'Vanilla Visa', '#6a3fb5', 1080, -0.6, 25, 500, 10)
on conflict (id) do nothing;

-- ---------- Make yourself an admin ----------
-- 1) Supabase Dashboard → Authentication → Users → "Add user" → create your email + password.
-- 2) Then run (with YOUR email):
--    insert into public.admins (email) values ('you@example.com') on conflict do nothing;
