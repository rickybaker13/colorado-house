# Design: Web Search, Image Search & Photo Library Expansion

**Date:** 2026-03-03
**Status:** Approved

## Problem

The content generation agent currently:
1. Has a static photo library (~40 categorized images, ~25 uncategorized)
2. Cannot access real-time information (snow reports, trail conditions, events)
3. Cannot source supplementary images when the local library lacks the right shot

## Solution

Three changes to the marketing automation system:

### 1. Photo Library Expansion

Categorize ~25 existing `file_XX-*.jpg` photos in `public/images/` and add them to:
- `marketing/src/config.ts` PHOTO_LIBRARY (used by content generation agent)
- `app/admin/queue/QueueClient.tsx` IMAGE_LIBRARY (used by admin image picker)

Process for future photos: drop files in `public/images/`, add entries to both config files.

### 2. Claude tool_use for Web Search & Image Search

Convert `generate-content.ts` from a single `messages.create()` call to a tool_use agentic loop.

**Tools defined:**

#### `web_search`
- Backend: Brave Search API (free tier: 2,000 queries/mo)
- Input: `{ query: string }`
- Returns: top 5 results with title, URL, snippet
- Use cases: snow reports, trail conditions, local events, weather, current news

#### `search_images`
- Backend: Pexels API (free tier: 200 req/hr, royalty-free for social media)
- Input: `{ query: string }`
- Returns: top 5 images with URL, photographer, alt description
- Use cases: supplementary photos when local library doesn't match theme/directive

**Agentic loop flow:**
1. Send initial message with tools defined
2. If Claude returns `tool_use` stop reason, execute the requested tool
3. Return tool result to Claude
4. Repeat until Claude produces final `end_turn` with content JSON
5. Max 5 tool-call rounds to prevent runaway loops

**Image storage strategy:**
- Local photos: `image_filename` = filename, `image_url` = `{website}/images/{filename}`
- Web-sourced photos: `image_filename` = null, `image_url` = Pexels direct URL
- Upload-Post receives `media_url` which works with any URL

**New environment variables:**
- `BRAVE_SEARCH_API_KEY` — free at https://brave.com/search/api/
- `PEXELS_API_KEY` — free at https://www.pexels.com/api/

**New GitHub secrets:** Same two keys.

### 3. Admin Dashboard Updates

- Card image display: use `image_url` when available, fall back to `/images/{image_filename}`
- Edit modal: keep local image picker gallery, add text input for external image URL
- API route: add `image_url` to PATCH allowlist for social_posts

## Files Modified

- `marketing/src/generate-content.ts` — tool_use loop, tool definitions, tool execution
- `marketing/src/config.ts` — expanded PHOTO_LIBRARY with categorized file_XX photos
- `marketing/.env.example` — new BRAVE_SEARCH_API_KEY, PEXELS_API_KEY
- `.github/workflows/generate-content.yml` — new env vars from secrets
- `app/admin/queue/QueueClient.tsx` — external image support, expanded IMAGE_LIBRARY
- `app/api/admin/posts/[id]/route.ts` — add image_url to allowlist

## Cost Impact

- Brave Search API: $0 (free tier, ~30 queries/mo usage)
- Pexels API: $0 (free tier, ~30 queries/mo usage)
- Claude API: marginal increase from tool_use rounds (~10-20% more tokens per run)
- Total additional cost: ~$0-1/mo
