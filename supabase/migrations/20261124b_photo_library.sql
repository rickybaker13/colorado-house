-- Photo library for Instagram posts: the owner's own photos, synced from a
-- Google Drive folder, stripped of GPS/EXIF, and described once by Claude.
create table if not exists public.photo_library (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  drive_file_id text not null unique,
  drive_name text,
  storage_path text not null,          -- in the private "photo-library" bucket
  width integer,
  height integer,
  taken_at timestamptz,                -- from the original EXIF date, before stripping
  status text not null default 'pending'
    check (status in ('pending', 'ready', 'excluded', 'error')),
  description text,                    -- what is actually in the photo
  setting text check (setting in ('property_interior', 'property_exterior', 'area', 'other')),
  subject text,                        -- e.g. "alpine lake", "trail", "great room"
  location_guess text,                 -- only when the model is confident
  season text check (season in ('winter', 'spring', 'summer', 'fall', 'any')),
  recognizable_people boolean,
  quality integer check (quality between 1 and 10),
  caption_angles text[],
  exclude_reason text,
  times_used integer not null default 0,
  last_used_at timestamptz
);

create index if not exists photo_library_status_idx on public.photo_library (status);
alter table public.photo_library enable row level security;

-- Link each post to the photo it was written about, and track its Telegram preview.
alter table public.social_posts add column if not exists photo_id uuid references public.photo_library (id);
alter table public.social_posts add column if not exists telegram_message_id bigint;

-- Private bucket: photos are read with the service role, never by public URL.
insert into storage.buckets (id, name, public)
values ('photo-library', 'photo-library', false)
on conflict (id) do nothing;
