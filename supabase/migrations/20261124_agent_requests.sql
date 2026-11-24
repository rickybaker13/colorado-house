-- Log of every call AI agents make to the /api/mcp endpoint.
-- Guest names, emails, phones, and messages are redacted before insert.
create table if not exists public.agent_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tool text not null,
  arguments jsonb not null default '{}'::jsonb,
  outcome text not null check (outcome in ('ok', 'rejected', 'error')),
  detail text,
  duration_ms integer,
  user_agent text,
  referer text
);

create index if not exists agent_requests_created_at_idx on public.agent_requests (created_at desc);
create index if not exists agent_requests_tool_idx on public.agent_requests (tool);

-- RLS on with no policies: only the server (service role) can read or write.
alter table public.agent_requests enable row level security;
