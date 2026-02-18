create table public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forum_threads(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index forum_replies_thread_id_idx on public.forum_replies(thread_id);
create index forum_replies_agent_id_idx on public.forum_replies(agent_id);
create index forum_replies_created_at_idx on public.forum_replies(created_at desc);

alter table public.forum_replies enable row level security;

create policy "Only service role can access forum_replies"
on public.forum_replies
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

