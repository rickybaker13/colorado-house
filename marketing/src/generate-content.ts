#!/usr/bin/env tsx
// ============================================================
// Social Media Content Generator
// ============================================================
// Calls Claude API to generate platform-specific social media
// posts, then saves them to Supabase as drafts for review.
//
// Usage: npm run generate
// Cron:  Runs daily via GitHub Actions
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import {
  PROPERTY,
  BRAND_VOICE,
  TARGET_MARKETS,
  CONTENT_THEMES,
  HASHTAGS,
  PHOTO_LIBRARY,
  getCurrentSeason,
  getCurrentMonth,
} from "./config.js";
import {
  insertPost,
  getActiveInstructions,
  deactivateInstruction,
  type SocialPost,
  type AgentInstruction,
} from "./supabase.js";

const anthropic = new Anthropic();

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

// Pick a random content theme, avoiding recently used ones
function pickTheme(): string {
  const themes = CONTENT_THEMES.categories;
  return themes[Math.floor(Math.random() * themes.length)];
}

// Pick random photos for a given category
function pickPhotos(theme: string, count: number = 1): string[] {
  const categoryMap: Record<string, keyof typeof PHOTO_LIBRARY> = {
    property_showcase: "interior",
    mountain_views: "mountains",
    trail_guide: "trails",
    local_attraction: "durango",
    seasonal_escape: "mountains",
    guest_experience: "interior",
    behind_the_scenes: "exterior",
    educational: "exterior",
  };

  const category = categoryMap[theme] || "mountains";
  const photos = [...PHOTO_LIBRARY[category]];

  // Shuffle and pick
  for (let i = photos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photos[i], photos[j]] = [photos[j], photos[i]];
  }

  return photos.slice(0, count);
}

// Build the system prompt with full brand context + admin directives
function buildSystemPrompt(instructions: AgentInstruction[] = []): string {
  const season = getCurrentSeason();
  const month = getCurrentMonth();
  const seasonData = PROPERTY.seasons[season];

  let prompt = `You are the social media content creator for ${PROPERTY.name}, a luxury vacation rental property in Durango, Colorado.

## Property Details
${JSON.stringify(PROPERTY, null, 2)}

## Current Context
- Current month: ${month}
- Current season: ${season} (${seasonData.months})
- Key selling points this season: ${seasonData.selling_points.join("; ")}

## Brand Voice Guidelines
Tone: ${BRAND_VOICE.tone.join(". ")}

DO NOT: ${BRAND_VOICE.doNot.join(". ")}

## Target Markets
Primary: ${TARGET_MARKETS.primary.join(", ")}
Secondary: ${TARGET_MARKETS.secondary.join(", ")}
Demographics: ${TARGET_MARKETS.demographics}

## Call to Action Options (use one per post, vary them)
${BRAND_VOICE.callToAction.join("\n")}

You generate social media posts that are authentic, engaging, and drive bookings without being salesy.`;

  // Inject admin directives if any are active
  if (instructions.length > 0) {
    prompt += `\n\n## Current Admin Directives (HIGH PRIORITY — incorporate these into today's content)\n`;
    instructions.forEach((instr, i) => {
      const typeLabel = instr.type === "one-time" ? "[ONE-TIME]" : "[ONGOING]";
      prompt += `${i + 1}. ${typeLabel} ${instr.content}\n`;
    });
  }

  return prompt;
}

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
    const textBlock = response.content.find((b: { type: string }) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Claude returned no text in final response");
    }

    // Parse the JSON response — Claude sometimes includes preamble text before JSON
    try {
      let cleaned = textBlock.text
        .replace(/```json?\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // Extract JSON object if there's preamble text before it
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart > 0 && jsonEnd > jsonStart) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
      }

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

// Main execution
async function main() {
  console.log("=== Purgatory Townhouse Content Generator ===");
  console.log(`Season: ${getCurrentSeason()} | Month: ${getCurrentMonth()}`);
  console.log("");

  // Pick today's theme and photos
  const theme = pickTheme();
  const photos = pickPhotos(theme, 1);

  console.log(`Theme: ${theme}`);
  console.log(`Photo: ${photos[0]}`);
  console.log("");

  // Fetch active admin instructions
  const instructions = await getActiveInstructions();
  if (instructions.length > 0) {
    console.log(`Active instructions: ${instructions.length}`);
    instructions.forEach((instr) => {
      console.log(`  [${instr.type}] ${instr.content.slice(0, 80)}`);
    });
    console.log("");
  }

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

  console.log("");
  console.log("Done! 4 posts saved as drafts. Review them at:");
  console.log("  https://supabase.com/dashboard → social_posts table");
  console.log("  Or run: npm run review");
}

main().catch((err) => {
  console.error("Content generation failed:", err);
  process.exit(1);
});
