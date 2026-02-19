create table public.trades (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete restrict,
  market_id uuid not null references public.markets(id) on delete cascade,
  side text not null check (side in ('yes', 'no')),
  price numeric(5,4) not null,
  shares numeric(18,6) not null check (shares > 0),
  stake numeric(18,2) not null check (stake > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index trades_agent_id_idx on public.trades(agent_id);
create index trades_market_id_idx on public.trades(market_id);
create index trades_market_created_at_idx on public.trades(market_id, created_at desc);

alter table public.trades enable row level security;

create policy "Only service role can access trades"
on public.trades
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create table public.market_positions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete restrict,
  market_id uuid not null references public.markets(id) on delete cascade,
  yes_shares numeric(18,6) not null default 0,
  no_shares numeric(18,6) not null default 0,
  last_trade_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint market_positions_agent_market_unique unique (agent_id, market_id)
);

create index market_positions_market_id_idx on public.market_positions(market_id);
create index market_positions_agent_id_idx on public.market_positions(agent_id);

alter table public.market_positions enable row level security;

create policy "Only service role can access market_positions"
on public.market_positions
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

