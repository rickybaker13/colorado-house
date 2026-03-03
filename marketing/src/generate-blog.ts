#!/usr/bin/env tsx
// ============================================================
// Blog Post Generator
// ============================================================
// Generates a long-form blog post using Claude API based on
// the editorial calendar from the marketing plan.
//
// Usage: npm run generate-blog
// Cron:  Runs weekly (Mondays) via GitHub Actions
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import {
  PROPERTY,
  BRAND_VOICE,
  TARGET_MARKETS,
  PHOTO_LIBRARY,
  getCurrentSeason,
  getCurrentMonth,
} from "./config.js";
import { insertBlogPost } from "./supabase.js";

const anthropic = new Anthropic();

// Editorial calendar — topics from the marketing plan
// The generator picks the next unwritten topic
const EDITORIAL_CALENDAR = [
  {
    title: "Escape the Texas Heat: A Summer Guide to Southwest Colorado",
    slug: "escape-texas-heat-summer-guide",
    keywords: "Texas to Colorado, summer mountain vacation, escape the heat, Durango summer",
    targetMarket: "Texas",
    featuredImage: "alpenglow-sunset.jpg",
  },
  {
    title: "The Drive from Albuquerque to Durango: A Road Trip Guide",
    slug: "albuquerque-to-durango-road-trip",
    keywords: "Albuquerque to Durango drive, New Mexico to Colorado road trip, Durango road trip",
    targetMarket: "New Mexico",
    featuredImage: "alpine-valley.jpg",
  },
  {
    title: "Phoenix to Durango: Your Mountain Escape Playbook",
    slug: "phoenix-to-durango-mountain-escape",
    keywords: "Phoenix to Durango, Arizona mountain vacation, escape Phoenix heat",
    targetMarket: "Arizona",
    featuredImage: "hero-mountain.jpg",
  },
  {
    title: "Why Texans Love Durango (And Keep Coming Back)",
    slug: "why-texans-love-durango",
    keywords: "Texans in Durango, Texas Colorado vacation, Durango family vacation",
    targetMarket: "Texas",
    featuredImage: "durango-downtown-main.jpg",
  },
  {
    title: "The 10 Best Hikes Near Purgatory Resort (By Difficulty)",
    slug: "best-hikes-near-purgatory-resort",
    keywords: "best hikes Purgatory, Durango hiking trails, hiking near Purgatory Resort",
    targetMarket: "General",
    featuredImage: "ice-lakes-trail-alpine.jpg",
  },
  {
    title: "Skiing Purgatory with Kids: Everything You Need to Know",
    slug: "skiing-purgatory-with-kids",
    keywords: "Purgatory Resort kids, family ski trip Durango, kids ski free Purgatory",
    targetMarket: "Families",
    featuredImage: "exterior-1.jpg",
  },
  {
    title: "A First-Timer's Guide to the Durango & Silverton Railroad",
    slug: "durango-silverton-railroad-guide",
    keywords: "Durango Silverton Railroad, narrow gauge railroad, Durango train ride",
    targetMarket: "General",
    featuredImage: "durango-downtown-main.jpg",
  },
  {
    title: "Ice Lakes Basin: The Most Beautiful Hike in Colorado?",
    slug: "ice-lakes-basin-hike-guide",
    keywords: "Ice Lakes Basin hike, Ice Lakes Colorado, most beautiful hike Colorado",
    targetMarket: "General",
    featuredImage: "ice-lake-panoramic.jpg",
  },
  {
    title: "What to Pack for a Mountain Vacation in Colorado (By Season)",
    slug: "what-to-pack-mountain-vacation-colorado",
    keywords: "packing list Colorado mountain, what to pack Durango, Colorado vacation essentials",
    targetMarket: "General",
    featuredImage: "wildflower-meadow-peaks.jpg",
  },
  {
    title: "Durango in Winter vs. Summer: When Should You Visit?",
    slug: "durango-winter-vs-summer",
    keywords: "Durango winter summer, best time visit Durango, Durango seasons",
    targetMarket: "General",
    featuredImage: "durango-downtown-winter.jpg",
  },
];

function buildBlogSystemPrompt(): string {
  return `You are a travel writer creating blog content for ${PROPERTY.name}, a luxury vacation rental at Purgatory Resort near Durango, Colorado.

## Property Details
- Location: ${PROPERTY.location}
- Elevation: ${PROPERTY.elevation}
- Specs: ${PROPERTY.bedrooms} bedrooms, ${PROPERTY.bathrooms} baths, sleeps ${PROPERTY.maxGuests}
- Website: ${PROPERTY.website}

## Writing Style
${BRAND_VOICE.tone.join(". ")}

DO NOT: ${BRAND_VOICE.doNot.join(". ")}

## Important Guidelines
- Write 1,000-1,500 words
- Use your own original voice — no generic travel writing
- Include specific details: trail names, distances, elevations, restaurant names
- End with a soft call-to-action mentioning the townhouse (not salesy)
- Use H2 and H3 headings for structure
- Write in markdown format
- Include suggestions for where to place images (as markdown comments)
- Focus on being genuinely useful — this should be a guide someone would bookmark
- Target the specific audience mentioned in the brief`;
}

async function generateBlogPost(topic: (typeof EDITORIAL_CALENDAR)[number]) {
  const season = getCurrentSeason();
  const month = getCurrentMonth();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20241022",
    max_tokens: 4000,
    system: buildBlogSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Write a blog post with this brief:

Title: "${topic.title}"
Target Keywords: ${topic.keywords}
Target Market: ${topic.targetMarket}
Current Season: ${season} (${month})

Target Markets Context:
${TARGET_MARKETS.primary.join(", ")} are our primary markets.
${TARGET_MARKETS.secondary.join(", ")} are secondary.

Available nearby attractions to reference:
${PROPERTY.nearbyAttractions.join(", ")}

Current season selling points:
${PROPERTY.seasons[season].selling_points.join(", ")}

Write the full blog post in markdown. Make it genuinely useful — the kind of post someone would share with friends planning a trip. Include specific actionable information.

After the post, output this JSON block on its own line:
EXCERPT_JSON: {"excerpt": "A 1-2 sentence excerpt for SEO meta description (under 160 chars)"}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Split the blog content from the excerpt JSON
  const excerptMatch = text.match(/EXCERPT_JSON:\s*({.*})/);
  let excerpt = `Read our guide: ${topic.title}`;
  if (excerptMatch) {
    try {
      const parsed = JSON.parse(excerptMatch[1]);
      excerpt = parsed.excerpt;
    } catch { /* use default */ }
  }

  const blogContent = text.replace(/EXCERPT_JSON:.*$/s, "").trim();

  return { content: blogContent, excerpt };
}

async function main() {
  console.log("=== Purgatory Townhouse Blog Generator ===");
  console.log(`Season: ${getCurrentSeason()} | Month: ${getCurrentMonth()}`);
  console.log("");

  // For now, pick a random topic from the calendar
  // In production, track which topics have been written
  const topic =
    EDITORIAL_CALENDAR[Math.floor(Math.random() * EDITORIAL_CALENDAR.length)];

  console.log(`Topic: ${topic.title}`);
  console.log(`Keywords: ${topic.keywords}`);
  console.log("");

  console.log("Generating blog post with Claude...");
  const { content, excerpt } = await generateBlogPost(topic);

  console.log(`Generated ${content.length} characters`);
  console.log(`Excerpt: ${excerpt}`);
  console.log("");

  // Save to Supabase as draft
  const saved = await insertBlogPost({
    title: topic.title,
    slug: topic.slug,
    content,
    excerpt,
    seo_keywords: topic.keywords,
    featured_image: topic.featuredImage,
    status: "draft",
  });

  console.log(`Saved blog draft: ${(saved as any).id}`);
  console.log("");
  console.log("Done! Blog post saved as draft. Review it at:");
  console.log("  https://supabase.com/dashboard → blog_posts table");
}

main().catch((err) => {
  console.error("Blog generation failed:", err);
  process.exit(1);
});
