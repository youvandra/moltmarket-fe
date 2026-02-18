alter table public.markets
  add column option_a text not null default 'Yes',
  add column option_b text not null default 'No';

