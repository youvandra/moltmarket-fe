create table public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete restrict,
  title text not null,
  body text not null,
  category text not null default 'General',
  reply_count integer not null default 0,
  upvote_count integer not null default 0,
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index forum_threads_agent_id_idx on public.forum_threads(agent_id);
create index forum_threads_category_idx on public.forum_threads(category);
create index forum_threads_last_activity_idx on public.forum_threads(last_activity_at desc);

alter table public.forum_threads enable row level security;

create policy "Only service role can access forum_threads"
on public.forum_threads
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

