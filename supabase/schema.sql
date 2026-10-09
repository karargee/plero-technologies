-- ── Plero Technologies — Supabase Schema ──────────────────────────────────

-- Stats (shown on StatsBand)
create table if not exists public.stats (
  id         serial primary key,
  value      text        not null,
  label      text        not null,
  sort_order integer     not null default 0,
  visible    boolean     not null default true
);

-- Testimonials
create table if not exists public.testimonials (
  id         serial primary key,
  quote      text        not null,
  name       text        not null,
  role       text        not null,
  initials   text        not null,
  visible    boolean     not null default true,
  sort_order integer     not null default 0
);

-- Cards / rates (admin-editable)
create table if not exists public.cards (
  id            text primary key,
  name          text        not null,
  short         text        not null,
  logo          text        not null,
  color         text        not null default '#ffffff',
  buy_rate      numeric     not null default 0.95,
  sell_rate     numeric     not null default 0.90,
  category      text        not null default 'Trading',
  denominations integer[]   not null default '{10,50,100}',
  eta           text        not null default '5-15 min',
  instant       boolean     not null default true,
  visible       boolean     not null default true,
  sort_order    integer     not null default 0
);

-- Orders
create table if not exists public.orders (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid,
  card_id     text        references public.cards(id),
  amount_usd  numeric     not null,
  payout_ngn  numeric,
  rate_used   numeric,
  status      text        not null default 'pending'
                          check (status in ('pending','processing','completed','failed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Row Level Security ─────────────────────────────────────────────────────

alter table public.stats        enable row level security;
alter table public.testimonials enable row level security;
alter table public.cards        enable row level security;
alter table public.orders       enable row level security;

-- Public can read visible stats, testimonials, cards
create policy "public read stats"
  on public.stats for select using (visible = true);

create policy "public read testimonials"
  on public.testimonials for select using (visible = true);

create policy "public read cards"
  on public.cards for select using (visible = true);

-- Orders: users see and create only their own rows
create policy "users read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "users insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);
