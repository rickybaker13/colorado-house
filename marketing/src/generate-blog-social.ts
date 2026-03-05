#!/usr/bin/env tsx
// ============================================================
// Blog-to-Social Promotion Generator
// ============================================================
// Generates social media posts that promote published blog posts
// and drive traffic to skipurgatoryhouse.com/blog/[slug].
//
// Runs twice per week (Wednesday & Saturday) via GitHub Actions.
// Each blog post gets two rounds of promotion:
//   Round 1: "New post" announcement (first run after publish)
//   Round 2: Different angle / deeper teaser (second run)
//
// Usage: npm run promote-blog
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import {
  PROPERTY,
  BRAND_VOICE,
  TARGET_MARKETS,
  HASHTAGS,
  PHOTO_LIBRARY,
  getCurrentSeason,
  getCurrentMonth,
} from "./config.js";
import {
  insertPost,
  getActiveInstructions,
  getRecentPublishedBlogPosts,
  hasBlogBeenPromoted,
  type BlogPost,
} from "./supabase.js";

const anthropic = new Anthropic();

// Tool definitions — same as content generator
const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_images",
    description:
      "Search for royalty-free stock photos on Pexels. Use this ONLY if the blog's featured image or local photos don't fit the social post angle well.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Descriptive search query for the image (e.g., 'Colorado alpine lake turquoise', 'mountain highway cliff road')",
        },
      },
      required: ["query"],
    },
  },
];

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

    const data = (await response.json()) as {
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

function buildSystemPrompt(): string {
  const season = getCurrentSeason();
  const month = getCurrentMonth();
  const seasonData = PROPERTY.seasons[season];

  return `You are the social media content creator for ${PROPERTY.name}, a luxury vacation rental at Purgatory Resort near Durango, Colorado.

## Your Task
You are creating social media posts that PROMOTE A BLOG POST on the property's website. The goal is to tease the blog content compellingly enough that viewers click through to read the full article at skipurgatoryhouse.com.

## Property Context
- Location: ${PROPERTY.location}
- Website: ${PROPERTY.website}
- Current season: ${season} (${month})
- Season selling points: ${seasonData.selling_points.join("; ")}

## Brand Voice
${BRAND_VOICE.tone.join(". ")}
DO NOT: ${BRAND_VOICE.doNot.join(". ")}

## Target Markets
Primary: ${TARGET_MARKETS.primary.join(", ")}
Secondary: ${TARGET_MARKETS.secondary.join(", ")}

## Blog Promotion Strategy
- The blog post is the HOOK. Tease the most compelling detail, stat, or revelation from it.
- Every post MUST include the blog URL (skipurgatoryhouse.com/blog/[slug]) or "link in bio" reference.
- Don't summarize the whole post — leave them wanting more.
- Pull a specific surprising detail, practical tip, or vivid image from the blog content.
- Make it feel like sharing a great article with a friend, not advertising.
- Each platform should use a DIFFERENT angle from the blog content.`;
}

interface PromotionResult {
  posts: Record<string, { content: string; hashtags: string }>;
  image_url?: string;
}

async function generateBlogPromotion(
  blogPost: BlogPost,
  round: number
): Promise<PromotionResult> {
  const blogUrl = `${PROPERTY.website}/blog/${blogPost.slug}`;
  const featuredImageUrl = blogPost.featured_image.startsWith("http")
    ? blogPost.featured_image
    : `${PROPERTY.website}/images/${blogPost.featured_image}`;

  // Truncate blog content to ~2000 chars for the prompt (enough for Claude to pull details)
  const contentPreview =
    blogPost.content.length > 3000
      ? blogPost.content.slice(0, 3000) + "\n\n[... article continues ...]"
      : blogPost.content;

  const roundContext =
    round === 1
      ? `This is the FIRST promotion (announcement). Lead with the most compelling hook — a surprising detail, vivid image, or provocative question from the blog. Frame it as "we just published this" energy.`
      : `This is the SECOND promotion (deeper teaser). Pick a DIFFERENT angle than the first round. Dig into a specific section — a practical tip, a lesser-known detail, or a particular location mentioned in the blog. Frame it as "in case you missed this" or "one more thing from our latest article."`;

  const userMessage = `Generate social media posts promoting this blog post:

**Blog Title:** "${blogPost.title}"
**Blog URL:** ${blogUrl}
**Blog Excerpt:** ${blogPost.excerpt}
**Featured Image:** ${featuredImageUrl}
**SEO Keywords:** ${blogPost.seo_keywords}

**Blog Content (preview):**
${contentPreview}

**Promotion Round:** ${round} of 2
${roundContext}

## Available Tools
- **search_images** — Use if you want a different image than the blog's featured image for variety.

## Output Format
Generate posts in this exact JSON format (no markdown, just raw JSON):
{
  "instagram": {
    "content": "Caption (2-4 sentences, tease the blog content, include call to read full article via 'link in bio')",
    "hashtags": "space-separated hashtags (18 total)"
  },
  "facebook": {
    "content": "Post (3-5 sentences, conversational, include the direct blog URL: ${blogUrl}, ask an engaging question)",
    "hashtags": "space-separated hashtags (3 total)"
  },
  "pinterest": {
    "content": "Pin description (2-3 sentences, keyword-rich, reference the article, include blog URL)",
    "hashtags": ""
  },
  "x": {
    "content": "Tweet (under 280 chars including the blog URL, punchy hook that makes people click)",
    "hashtags": "space-separated hashtags (3 total)"
  },
  "image_url": "ONLY include if you used search_images. Otherwise omit to use the blog's featured image."
}

Important:
- Instagram: Tease a vivid detail, direct to "link in bio" (don't put the URL in the caption)
- Facebook: Include the FULL blog URL (${blogUrl}) so it generates a link preview
- Pinterest: Keyword-rich, include the URL for click-through
- X: Keep it punchy with the shortened blog URL, make them curious
- Each platform MUST use a different angle/detail from the blog`;

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  const MAX_ROUNDS = 4;

  for (let i = 0; i < MAX_ROUNDS; i++) {
    console.log(`  Tool-use round ${i + 1}/${MAX_ROUNDS}...`);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: buildSystemPrompt(),
      tools: TOOLS,
      messages,
    });

    if (response.stop_reason === "tool_use") {
      messages.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type === "tool_use") {
          const input = block.input as { query: string };
          console.log(`  Searching images: "${input.query}"`);
          const result = await executeImageSearch(input.query);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        }
      }

      messages.push({ role: "user", content: toolResults });
      continue;
    }

    // Parse final response
    const textBlock = response.content.find(
      (b: { type: string }) => b.type === "text"
    );
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Claude returned no text in final response");
    }

    try {
      let cleaned = textBlock.text
        .replace(/```json?\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart > 0 && jsonEnd > jsonStart) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
      }

      const parsed = JSON.parse(cleaned) as Record<string, unknown>;
      const image_url =
        typeof parsed.image_url === "string" ? parsed.image_url : undefined;
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

  throw new Error(
    `Agent loop exceeded ${MAX_ROUNDS} rounds without producing content`
  );
}

async function main() {
  console.log("=== Blog-to-Social Promotion Generator ===");
  console.log(
    `Season: ${getCurrentSeason()} | Month: ${getCurrentMonth()}`
  );
  console.log("");

  // Fetch recently published blog posts
  const recentPosts = await getRecentPublishedBlogPosts();
  console.log(`Found ${recentPosts.length} recently published blog post(s)`);

  if (recentPosts.length === 0) {
    console.log("No recent blog posts to promote. Exiting.");
    return;
  }

  // Fetch admin instructions for brand context
  const instructions = await getActiveInstructions();

  // Try to find a blog post that still needs promotion
  let targetPost: BlogPost | null = null;
  let promotionRound = 1;

  for (const post of recentPosts) {
    const r1Done = await hasBlogBeenPromoted(post.slug, 1);
    const r2Done = await hasBlogBeenPromoted(post.slug, 2);

    if (!r1Done) {
      targetPost = post;
      promotionRound = 1;
      break;
    } else if (!r2Done) {
      targetPost = post;
      promotionRound = 2;
      break;
    }
  }

  if (!targetPost) {
    console.log(
      "All recent blog posts have been fully promoted (2 rounds each). Exiting."
    );
    return;
  }

  console.log(`Promoting: "${targetPost.title}"`);
  console.log(`Slug: ${targetPost.slug}`);
  console.log(`Round: ${promotionRound} of 2`);
  console.log("");

  // Generate social media promotion posts
  console.log("Generating blog promotion posts with Claude...");
  const result = await generateBlogPromotion(targetPost, promotionRound);

  // Save posts to Supabase as drafts
  const platforms = ["instagram", "facebook", "pinterest", "x"] as const;
  const contentTheme = `blog_promotion_${targetPost.slug}_r${promotionRound}`;

  // Use blog's featured image as default
  const defaultImageFilename = targetPost.featured_image.startsWith("http")
    ? ""
    : targetPost.featured_image;
  const defaultImageUrl = targetPost.featured_image.startsWith("http")
    ? targetPost.featured_image
    : `${PROPERTY.website}/images/${targetPost.featured_image}`;

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
      image_filename: result.image_url ? "" : defaultImageFilename,
      image_url: result.image_url || defaultImageUrl,
      content_theme: contentTheme,
      status: "draft",
    });

    console.log(
      `Saved ${platform} draft: ${(savedPost as { id: string }).id}`
    );
  }

  if (result.image_url) {
    console.log(`\nUsing web-sourced image: ${result.image_url}`);
  } else {
    console.log(`\nUsing blog featured image: ${defaultImageFilename || defaultImageUrl}`);
  }

  console.log("");
  console.log(
    `Done! 4 blog promotion posts (round ${promotionRound}) saved as drafts.`
  );
  console.log("Review and approve them in the admin dashboard.");
}

main().catch((err) => {
  console.error("Blog promotion generation failed:", err);
  process.exit(1);
});
