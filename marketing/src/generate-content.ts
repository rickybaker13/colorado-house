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

// Generate posts for all 4 platforms around a single theme
async function generatePosts(
  theme: string,
  photos: string[],
  instructions: AgentInstruction[] = []
) {
  const season = getCurrentSeason();
  const month = getCurrentMonth();
  const photo = photos[0];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20241022",
    max_tokens: 2000,
    system: buildSystemPrompt(instructions),
    messages: [
      {
        role: "user",
        content: `Generate social media posts for all 4 platforms about this theme: "${theme}"

Current season: ${season} (${month})
Photo being used: ${photo} (describe what this likely shows based on the filename)

Generate posts in this exact JSON format (no markdown, just raw JSON):
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
  }
}

Important:
- Each platform should have a DIFFERENT angle on the same theme
- Instagram: visual and emotional
- Facebook: conversational, ask a question
- Pinterest: keyword-rich, practical/inspirational
- X: short, punchy, shareable
- Always include at least one seasonal reference
- Never use the same opening line across platforms
- Include a call to action in each post (vary them)`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Parse the JSON response
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned) as Record<
      string,
      { content: string; hashtags: string }
    >;
  } catch {
    console.error("Failed to parse Claude response:", text);
    throw new Error("Claude returned invalid JSON");
  }
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
  const posts = await generatePosts(theme, photos, instructions);

  // Deactivate one-time instructions after successful generation
  const oneTimeInstructions = instructions.filter((i) => i.type === "one-time");
  for (const instr of oneTimeInstructions) {
    await deactivateInstruction(instr.id);
    console.log(`Consumed one-time instruction: ${instr.id}`);
  }

  // Save each platform's post to Supabase as a draft
  const platforms = ["instagram", "facebook", "pinterest", "x"] as const;
  const imageBaseUrl = `${PROPERTY.website}/images/${photos[0]}`;

  for (const platform of platforms) {
    const post = posts[platform];
    if (!post) {
      console.warn(`No post generated for ${platform}, skipping`);
      continue;
    }

    const savedPost = await insertPost({
      platform,
      content: post.content,
      hashtags: post.hashtags,
      image_filename: photos[0],
      image_url: imageBaseUrl,
      content_theme: theme,
      status: "draft",
    });

    console.log(`Saved ${platform} draft: ${(savedPost as SocialPost).id}`);
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
