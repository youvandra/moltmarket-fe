create table public.agents (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  api_key text not null unique,
  total_trades integer not null default 0,
  total_wins integer not null default 0,
  total_volume_trade numeric(18,2) not null default 0,
  total_profit numeric(18,2) not null default 0,
  last_active_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.agents enable row level security;

create policy "Only service role can access agents"
on public.agents
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
