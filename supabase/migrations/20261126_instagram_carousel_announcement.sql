-- Instagram carousels: every photo in a post, in order (photo_id stays the lead).
alter table public.social_posts add column if not exists photo_ids uuid[];

-- One-off announcement posts (used once by the generator, then deactivated).
alter table public.agent_instructions drop constraint if exists agent_instructions_type_check;
alter table public.agent_instructions
  add constraint agent_instructions_type_check check (type in ('directive', 'one-time', 'announcement'));
