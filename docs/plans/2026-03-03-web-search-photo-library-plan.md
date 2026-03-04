# Web Search, Image Search & Photo Library — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Give the content generation agent web search, image search, and an expanded local photo library so posts are timely, visually varied, and informed by real-world conditions.

**Architecture:** Convert the single `messages.create()` call in `generate-content.ts` to a tool_use agentic loop with `web_search` (Brave) and `search_images` (Pexels) tools. Expand the local photo library with 9 newly categorized interior photos. Update the admin dashboard to display and edit external image URLs.

**Tech Stack:** Anthropic Claude tool_use API, Brave Search API (free tier), Pexels API (free tier), Next.js API routes, TypeScript

**Design Doc:** `docs/plans/2026-03-03-web-search-photo-library-design.md`

---

## Task 1: Expand Photo Library with Categorized Photos

The `public/images/` directory contains 22 `file_XX-*.jpg` photos not yet in the library. After visual inspection, they are **9 unique interior shots** (the rest are duplicates with different UUIDs). Add one from each unique group.

**Files:**
- Modify: `marketing/src/config.ts` (PHOTO_LIBRARY.interior array, lines 193-209)
- Modify: `app/admin/queue/QueueClient.tsx` (IMAGE_LIBRARY['Interior'] array, lines 40-45)

### Step 1: Add photos to PHOTO_LIBRARY in config.ts

In `marketing/src/config.ts`, append these 9 entries to the `interior` array (after line 208, before the closing `]`):

```typescript
  interior: [
    // ... existing 15 entries ...
    "file_35---8442826e-0583-4f7c-8519-ddf80feb638a.jpg",   // living room, fireplace, vaulted ceiling
    "file_36---0040c3ea-93a5-4919-8017-c6349fa8f70d.jpg",   // bunk room with Xbox, TV
    "file_37---99ef673a-f1cd-450c-8e00-2fac70252c2c.jpg",   // bunk room wide angle, couch
    "file_38---159a7a4b-5b0e-4282-8223-ef152a20542c.jpg",   // bunk room, two bunks overhead
    "file_39---83886c87-e830-474b-bcc7-f810d9e19bf2.jpg",   // bathroom, walk-in shower
    "file_40---2402f62f-b03c-4a90-892d-2689435e9ac4.jpg",   // smart lock keypad detail
    "file_41---abcefd98-23fb-43a9-91a3-e43ed9b30e63.jpg",   // half bathroom, powder room
    "file_42---4c9e886f-4807-486a-acf3-5e0d1c74b5da.jpg",   // room with patterned rug, deer art
    "file_43---5eae66d5-bfbe-41da-a496-c720416e2eed.jpg",   // loft balcony, resort view
  ],
```

### Step 2: Add photos to IMAGE_LIBRARY in QueueClient.tsx

In `app/admin/queue/QueueClient.tsx`, append the same 9 entries to the `'Interior'` array (after line 44, before the closing `]`):

```typescript
  'Interior': [
    // ... existing 15 entries ...
    'file_35---8442826e-0583-4f7c-8519-ddf80feb638a.jpg',
    'file_36---0040c3ea-93a5-4919-8017-c6349fa8f70d.jpg',
    'file_37---99ef673a-f1cd-450c-8e00-2fac70252c2c.jpg',
    'file_38---159a7a4b-5b0e-4282-8223-ef152a20542c.jpg',
    'file_39---83886c87-e830-474b-bcc7-f810d9e19bf2.jpg',
    'file_40---2402f62f-b03c-4a90-892d-2689435e9ac4.jpg',
    'file_41---abcefd98-23fb-43a9-91a3-e43ed9b30e63.jpg',
    'file_42---4c9e886f-4807-486a-acf3-5e0d1c74b5da.jpg',
    'file_43---5eae66d5-bfbe-41da-a496-c720416e2eed.jpg',
  ],
```

### Step 3: Verify build still works

Run: `cd /tmp/colorado-house-push && npm run build`
Expected: Build succeeds with no errors.

### Step 4: Commit

```bash
git add marketing/src/config.ts app/admin/queue/QueueClient.tsx
git commit -m "feat: expand photo library with 9 categorized interior photos"
```

---

## Task 2: Add Environment Variables

**Files:**
- Modify: `marketing/.env.example` (append 2 new vars)
- Modify: `.github/workflows/generate-content.yml` (add env vars to generate step)

### Step 1: Update .env.example

Append to `marketing/.env.example`:

```
# Brave Search API key (for web search tool — snow reports, events, conditions)
# Free tier: 2,000 queries/month. Sign up: https://brave.com/search/api/
BRAVE_SEARCH_API_KEY=BSA-xxxxx

# Pexels API key (for image search tool — royalty-free supplementary photos)
# Free tier: 200 requests/hour. Sign up: https://www.pexels.com/api/
PEXELS_API_KEY=xxxxx
```

### Step 2: Update GitHub Actions workflow

In `.github/workflows/generate-content.yml`, add to the `env:` block of the "Generate social media content" step (after line 41):

```yaml
          BRAVE_SEARCH_API_KEY: ${{ secrets.BRAVE_SEARCH_API_KEY }}
          PEXELS_API_KEY: ${{ secrets.PEXELS_API_KEY }}
```

### Step 3: Commit

```bash
git add marketing/.env.example .github/workflows/generate-content.yml
git commit -m "feat: add Brave Search and Pexels API env vars"
```

---

## Task 3: Convert generate-content.ts to Tool-Use Agentic Loop

This is the core change. Replace the single `messages.create()` call with a tool_use loop that lets Claude call `web_search` and `search_images`.

**Files:**
- Modify: `marketing/src/generate-content.ts` (complete rewrite of `generatePosts` function)

### Step 1: Add tool definitions

At the top of `generate-content.ts` (after the `anthropic` client initialization on line 31), add tool definitions:

```typescript
// Tool definitions for Claude's agentic loop
const TOOLS: Anthropic.Tool[] = [
  {
    name: "web_search",
    description:
      "Search the web for real-time information. Use this to find current snow reports, trail conditions, local events, weather forecasts, or any timely information that would make the social media post more authentic and relevant.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "The search query (e.g., 'Purgatory Resort snow report today', 'Durango events this week')",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "search_images",
    description:
      "Search for royalty-free stock photos on Pexels. Use this ONLY when the local photo library doesn't have a good match for the post theme. Prefer local photos when available — they show the actual property and area.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Descriptive search query for the image (e.g., 'Colorado mountain sunset', 'ski resort powder day')",
        },
      },
      required: ["query"],
    },
  },
];
```

### Step 2: Add tool execution functions

Below the tool definitions, add the execution functions:

```typescript
// Execute the web_search tool via Brave Search API
async function executeWebSearch(query: string): Promise<string> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    return "Web search unavailable: BRAVE_SEARCH_API_KEY not configured.";
  }

  try {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`;
    const response = await fetch(url, {
      headers: { "Accept": "application/json", "Accept-Encoding": "gzip", "X-Subscription-Token": apiKey },
    });

    if (!response.ok) {
      return `Web search failed: HTTP ${response.status}`;
    }

    const data = await response.json() as {
      web?: { results?: Array<{ title: string; url: string; description: string }> };
    };
    const results = data.web?.results || [];

    if (results.length === 0) return "No results found.";

    return results
      .map((r, i) => `${i + 1}. ${r.title}\n   ${r.url}\n   ${r.description}`)
      .join("\n\n");
  } catch (err) {
    return `Web search error: ${err instanceof Error ? err.message : "unknown"}`;
  }
}

// Execute the search_images tool via Pexels API
async function executeImageSearch(query: string): Promise<string> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return "Image search unavailable: PEXELS_API_KEY not configured.";
  }

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
    const response = await fetch(url, {
      headers: { Authorization: apiKey },
    });

    if (!response.ok) {
      return `Image search failed: HTTP ${response.status}`;
    }

    const data = await response.json() as {
      photos?: Array<{
        id: number;
        photographer: string;
        alt: string;
        src: { large2x: string; large: string };
      }>;
    };
    const photos = data.photos || [];

    if (photos.length === 0) return "No images found.";

    return photos
      .map(
        (p, i) =>
          `${i + 1}. "${p.alt || "Untitled"}" by ${p.photographer}\n   URL: ${p.src.large2x}\n   ID: ${p.id}`
      )
      .join("\n\n");
  } catch (err) {
    return `Image search error: ${err instanceof Error ? err.message : "unknown"}`;
  }
}
```

### Step 3: Rewrite generatePosts as agentic loop

Replace the existing `generatePosts` function (lines 108-177) with:

```typescript
// Result type from the agentic generation loop
interface GenerationResult {
  posts: Record<string, { content: string; hashtags: string }>;
  image_url?: string; // External image URL if agent chose a web-sourced photo
}

// Generate posts using an agentic tool_use loop
async function generatePosts(
  theme: string,
  photos: string[],
  instructions: AgentInstruction[] = []
): Promise<GenerationResult> {
  const season = getCurrentSeason();
  const month = getCurrentMonth();
  const photo = photos[0];

  const userMessage = `Generate social media posts for all 4 platforms about this theme: "${theme}"

Current season: ${season} (${month})
Local photo selected: ${photo} (describe what this likely shows based on the filename)

## Available Tools
You have two tools available:
1. **web_search** — Search the web for current, real-time information (snow reports, trail conditions, local events, weather). Use this when timely info would make the post more authentic.
2. **search_images** — Search Pexels for royalty-free stock photos. Use this ONLY if the local photo doesn't fit the theme well. Prefer local photos — they show the actual property.

Use tools if they would improve the posts. You don't have to use them every time.

## Output Format
When you're done researching, generate posts in this exact JSON format (no markdown, just raw JSON):
{
  "instagram": {
    "content": "The caption text (2-4 sentences, engaging, with a call to action)",
    "hashtags": "space-separated hashtags (18 total, mix of broad/specific/niche)"
  },
  "facebook": {
    "content": "Longer form post (3-5 sentences, conversational, include a question to drive engagement)",
    "hashtags": "space-separated hashtags (3 total)"
  },
  "pinterest": {
    "content": "Pin description (2-3 sentences, keyword-rich for Pinterest SEO, include destination link mention)",
    "hashtags": ""
  },
  "x": {
    "content": "Tweet (under 280 chars including hashtags, punchy and shareable)",
    "hashtags": "space-separated hashtags (4 total)"
  },
  "image_url": "ONLY include this field if you used search_images and want to use a web-sourced photo instead of the local one. Set to the direct image URL from Pexels. Omit this field entirely to use the local photo."
}

Important:
- Each platform should have a DIFFERENT angle on the same theme
- Instagram: visual and emotional
- Facebook: conversational, ask a question
- Pinterest: keyword-rich, practical/inspirational
- X: short, punchy, shareable
- Always include at least one seasonal reference
- Never use the same opening line across platforms
- Include a call to action in each post (vary them)
- If you used web_search and found useful real-time info, weave it naturally into the posts`;

  // Build messages array for the agentic loop
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: userMessage }];

  const MAX_ROUNDS = 5;

  for (let round = 0; round < MAX_ROUNDS; round++) {
    console.log(`  Tool-use round ${round + 1}/${MAX_ROUNDS}...`);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: buildSystemPrompt(instructions),
      tools: TOOLS,
      messages,
    });

    // Check if Claude wants to use a tool
    if (response.stop_reason === "tool_use") {
      // Add assistant's response to message history
      messages.push({ role: "assistant", content: response.content });

      // Process each tool call
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type === "tool_use") {
          const input = block.input as { query: string };
          console.log(`  Calling ${block.name}: "${input.query}"`);

          let result: string;
          if (block.name === "web_search") {
            result = await executeWebSearch(input.query);
          } else if (block.name === "search_images") {
            result = await executeImageSearch(input.query);
          } else {
            result = `Unknown tool: ${block.name}`;
          }

          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        }
      }

      // Send tool results back to Claude
      messages.push({ role: "user", content: toolResults });
      continue;
    }

    // Claude produced final response (end_turn)
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Claude returned no text in final response");
    }

    // Parse the JSON response
    try {
      const cleaned = textBlock.text
        .replace(/```json?\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleaned) as Record<string, unknown>;

      // Extract image_url if present
      const image_url = typeof parsed.image_url === "string" ? parsed.image_url : undefined;

      // Remove image_url from the posts object
      const { image_url: _, ...posts } = parsed;

      return {
        posts: posts as Record<string, { content: string; hashtags: string }>,
        image_url,
      };
    } catch {
      console.error("Failed to parse Claude response:", textBlock.text);
      throw new Error("Claude returned invalid JSON");
    }
  }

  throw new Error(`Agent loop exceeded ${MAX_ROUNDS} rounds without producing final content`);
}
```

### Step 4: Update main() to handle image_url

Replace the section in `main()` that saves posts (lines 214-236) to handle the new `GenerationResult` type:

```typescript
  // Generate content for all platforms
  console.log("Generating content with Claude...");
  const result = await generatePosts(theme, photos, instructions);

  // Deactivate one-time instructions after successful generation
  const oneTimeInstructions = instructions.filter((i) => i.type === "one-time");
  for (const instr of oneTimeInstructions) {
    await deactivateInstruction(instr.id);
    console.log(`Consumed one-time instruction: ${instr.id}`);
  }

  // Save each platform's post to Supabase as a draft
  const platforms = ["instagram", "facebook", "pinterest", "x"] as const;
  const localImageUrl = `${PROPERTY.website}/images/${photos[0]}`;

  for (const platform of platforms) {
    const post = result.posts[platform];
    if (!post) {
      console.warn(`No post generated for ${platform}, skipping`);
      continue;
    }

    const savedPost = await insertPost({
      platform,
      content: post.content,
      hashtags: post.hashtags,
      image_filename: result.image_url ? "" : photos[0],
      image_url: result.image_url || localImageUrl,
      content_theme: theme,
      status: "draft",
    });

    console.log(`Saved ${platform} draft: ${(savedPost as SocialPost).id}`);
  }

  if (result.image_url) {
    console.log(`\nUsing web-sourced image: ${result.image_url}`);
  } else {
    console.log(`\nUsing local photo: ${photos[0]}`);
  }
```

### Step 5: Verify TypeScript compiles

Run: `cd /tmp/colorado-house-push/marketing && npx tsc --noEmit`
Expected: No type errors.

### Step 6: Commit

```bash
git add marketing/src/generate-content.ts
git commit -m "feat: convert content generator to tool_use agentic loop with web search and image search"
```

---

## Task 4: Update Admin Dashboard for External Image URLs

The dashboard cards and edit modal need to support external image URLs (not just local filenames).

**Files:**
- Modify: `app/admin/queue/QueueClient.tsx` (card image display, edit modal, SocialPost interface)
- Modify: `app/api/admin/posts/[id]/route.ts` (add `image_url` to allowlist)

### Step 1: Update SocialPost interface in QueueClient.tsx

Add `image_url` to the interface (after line 12):

```typescript
interface SocialPost {
  id: string
  platform: string
  content: string
  hashtags?: string
  content_theme?: string
  image_filename?: string
  image_url?: string      // ← ADD THIS
  status: string
  created_at: string
}
```

### Step 2: Update card image display

Replace the card image element (line 197-199) to use `image_url` with fallback:

```typescript
{(post.image_filename || post.image_url) && (
  <img
    src={post.image_url || `/images/${post.image_filename}`}
    alt=""
    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.05)' }}
  />
)}
```

### Step 3: Add external URL input to edit modal

Add state for editImageUrl:

```typescript
const [editImageUrl, setEditImageUrl] = useState('')
```

Update `openEdit` to populate it:

```typescript
function openEdit(post: SocialPost) {
  setEditingId(post.id)
  setEditContent(post.content ?? '')
  setEditHashtags(post.hashtags ?? '')
  setEditImage(post.image_filename ?? '')
  setEditImageUrl(post.image_url ?? '')
  setShowImagePicker(false)
}
```

Update `saveEdit` to include `image_url`:

```typescript
async function saveEdit() {
  if (!editingId) return
  setSaving(true)
  await patchPost(editingId, {
    content: editContent,
    hashtags: editHashtags,
    image_filename: editImage,
    image_url: editImageUrl || undefined,
  })
  setSaving(false)
  setEditingId(null)
}
```

In the edit modal, add an "External Image URL" text input below the image picker section (after the image picker `</div>` closing tag around line 278):

```typescript
<div style={{ marginTop: '10px' }}>
  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>External Image URL (overrides local image)</label>
  <input
    type="text"
    value={editImageUrl}
    onChange={e => setEditImageUrl(e.target.value)}
    placeholder="https://images.pexels.com/..."
    style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,149,106,0.25)', color: '#fafaf8', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
  />
</div>
```

### Step 4: Add image_url to API route allowlist

In `app/api/admin/posts/[id]/route.ts`, add `'image_url'` to the social_posts allowlist (line 20):

```typescript
const ALLOWED_FIELDS: Record<string, string[]> = {
  social_posts: ['status', 'content', 'hashtags', 'image_filename', 'image_url', 'performance_notes'],
  blog_posts: ['status', 'content', 'title', 'excerpt'],
}
```

### Step 5: Verify build

Run: `cd /tmp/colorado-house-push && npm run build`
Expected: Build succeeds.

### Step 6: Commit

```bash
git add app/admin/queue/QueueClient.tsx app/api/admin/posts/[id]/route.ts
git commit -m "feat: support external image URLs in admin dashboard and API"
```

---

## Task 5: End-to-End Verification

### Step 1: Verify environment variables are documented

Check `marketing/.env.example` contains BRAVE_SEARCH_API_KEY and PEXELS_API_KEY.

### Step 2: Verify workflow has new env vars

Check `.github/workflows/generate-content.yml` passes the new secrets.

### Step 3: Run full build

Run: `cd /tmp/colorado-house-push && npm run build`
Expected: Clean build, no errors.

### Step 4: Test content generator locally (optional, requires API keys)

If API keys are available in `.env`:

Run: `cd /tmp/colorado-house-push/marketing && npm run generate`

Expected:
- Prints "Tool-use round 1/5..."
- May show tool calls like `Calling web_search: "Purgatory Resort snow conditions March 2026"`
- Produces 4 draft posts saved to Supabase
- Posts contain timely info if web search was used

### Step 5: Verify admin dashboard displays posts

1. Run `npm run dev` in project root
2. Navigate to `/admin/queue`
3. Confirm new posts appear with correct images
4. Edit a post → change the external image URL → save → confirm it persists

### Step 6: Push all changes

```bash
git push origin main
```

---

## Task 6: Set Up API Keys (Manual — Owner Action)

These are manual steps the owner needs to do:

### Brave Search API
1. Go to https://brave.com/search/api/
2. Sign up for the free tier (2,000 queries/month)
3. Copy the API key

### Pexels API
1. Go to https://www.pexels.com/api/
2. Create an account and request an API key
3. Copy the API key

### Add to GitHub Secrets
1. Go to https://github.com/rickybaker13/colorado-house/settings/secrets/actions
2. Add `BRAVE_SEARCH_API_KEY` with the Brave key
3. Add `PEXELS_API_KEY` with the Pexels key

### Add to local .env (for testing)
In `marketing/.env`, add both keys.

---

## Summary of Changes

| File | Change |
|------|--------|
| `marketing/src/config.ts` | +9 interior photos to PHOTO_LIBRARY |
| `app/admin/queue/QueueClient.tsx` | +9 photos to IMAGE_LIBRARY, external URL support in cards + edit modal |
| `marketing/src/generate-content.ts` | Tool definitions, tool execution functions, agentic loop, image_url handling |
| `marketing/.env.example` | +BRAVE_SEARCH_API_KEY, +PEXELS_API_KEY |
| `.github/workflows/generate-content.yml` | +2 env vars from secrets |
| `app/api/admin/posts/[id]/route.ts` | +image_url to ALLOWED_FIELDS |

**New dependencies:** None (uses native `fetch` for Brave and Pexels APIs).

**Cost impact:** ~$0-1/mo additional (free API tiers, marginal Claude token increase from tool_use rounds).
