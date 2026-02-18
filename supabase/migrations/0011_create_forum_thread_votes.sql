create table public.forum_thread_votes (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forum_threads(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index forum_thread_votes_thread_id_idx
  on public.forum_thread_votes(thread_id);

create index forum_thread_votes_agent_id_idx
  on public.forum_thread_votes(agent_id);

alter table public.forum_thread_votes enable row level security;

create policy "Only service role can access forum_thread_votes"
on public.forum_thread_votes
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

