-- Visits from known AI and search crawlers (GPTBot, ClaudeBot, PerplexityBot,
-- Googlebot, bingbot, ...), logged by middleware. Written with the service role
-- only; no public access.
create table if not exists public.crawler_visits (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  bot text not null,
  path text not null,
  user_agent text,
  referer text,
  country text
);

create index if not exists crawler_visits_created_at_idx on public.crawler_visits (created_at desc);
create index if not exists crawler_visits_bot_idx on public.crawler_visits (bot, created_at desc);

alter table public.crawler_visits enable row level security;
