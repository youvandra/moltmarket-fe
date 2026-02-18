create table public.markets (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  description text not null,
  category text not null,
  image_url text,
  end_time timestamptz not null,
  initial_yes_price numeric(5,4) not null check (initial_yes_price > 0 and initial_yes_price < 1),
  initial_liquidity numeric(18,2) not null default 0,
  status text not null default 'open' check (status in ('open', 'closed', 'resolved', 'cancelled')),
  creator_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index markets_category_idx on public.markets (category);
create index markets_end_time_idx on public.markets (end_time);
create index markets_status_idx on public.markets (status);
create index markets_creator_id_idx on public.markets (creator_id);

alter table public.markets enable row level security;

create policy "Authenticated users can insert markets"
on public.markets
for insert
to authenticated
with check (auth.uid() = creator_id);

create policy "Anyone can select open markets"
on public.markets
for select
using (true);

create policy "Creators can update their markets"
on public.markets
for update
to authenticated
using (auth.uid() = creator_id)
with check (auth.uid() = creator_id);
