alter table public.markets
  add column if not exists onchain_market_id bigint;

create index if not exists markets_onchain_market_id_idx
  on public.markets (onchain_market_id);
