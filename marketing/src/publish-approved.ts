#!/usr/bin/env tsx
// ============================================================
// Social Media Publisher
// ============================================================
// Fetches approved posts from Supabase and publishes them
// to all platforms via Ayrshare's unified API.
//
// Usage: npm run publish
// Cron:  Runs twice daily via GitHub Actions (10am + 4pm MT)
// ============================================================

import SocialPost from "social-post-api";
import {
  getApprovedPosts,
  markPublished,
  type SocialPost as SocialPostType,
} from "./supabase.js";
import { PROPERTY } from "./config.js";

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY || "";

if (!AYRSHARE_API_KEY) {
  throw new Error("Missing AYRSHARE_API_KEY environment variable");
}

const social = new SocialPost(AYRSHARE_API_KEY);

// Map our platform names to Ayrshare's platform identifiers
const PLATFORM_MAP: Record<string, string> = {
  instagram: "instagram",
  facebook: "facebook",
  pinterest: "pinterest",
  x: "twitter", // Ayrshare still uses "twitter" internally
};

// Build the full post text with hashtags appended
function buildPostText(post: SocialPostType): string {
  let text = post.content;

  if (post.hashtags && post.hashtags.trim()) {
    // Add line breaks before hashtags for Instagram/Facebook
    if (post.platform === "instagram" || post.platform === "facebook") {
      text += "\n\n" + post.hashtags;
    } else {
      // X and Pinterest: append inline
      text += " " + post.hashtags;
    }
  }

  return text;
}

// Publish a single post via Ayrshare
async function publishPost(post: SocialPostType): Promise<string> {
  const platform = PLATFORM_MAP[post.platform];
  if (!platform) {
    throw new Error(`Unknown platform: ${post.platform}`);
  }

  const postText = buildPostText(post);
  const imageUrl = post.image_url || `${PROPERTY.website}/images/${post.image_filename}`;

  console.log(`Publishing to ${post.platform}...`);
  console.log(`  Text: ${postText.slice(0, 100)}...`);
  console.log(`  Image: ${imageUrl}`);

  try {
    const response = await social.post({
      post: postText,
      platforms: [platform],
      mediaUrls: [imageUrl],
      // Pinterest-specific: set the destination link
      ...(post.platform === "pinterest" && {
        pinterestOptions: {
          link: PROPERTY.bookingUrl,
          title: postText.slice(0, 100),
        },
      }),
    });

    // Ayrshare returns an array of results, one per platform
    const result = Array.isArray(response) ? response[0] : response;
    const postId = result?.id || result?.postIds?.[0] || "unknown";

    console.log(`  Published! Ayrshare ID: ${postId}`);
    return String(postId);
  } catch (err) {
    console.error(`  Failed to publish to ${post.platform}:`, err);
    throw err;
  }
}

// Main execution
async function main() {
  console.log("=== Purgatory Townhouse Publisher ===");
  console.log("");

  // Fetch all approved posts
  const posts = await getApprovedPosts();

  if (posts.length === 0) {
    console.log("No approved posts to publish. Exiting.");
    return;
  }

  console.log(`Found ${posts.length} approved post(s) to publish.`);
  console.log("");

  let published = 0;
  let failed = 0;

  for (const post of posts) {
    try {
      const ayrshareId = await publishPost(post);
      await markPublished(post.id!, ayrshareId);
      published++;
    } catch {
      console.error(`Failed to publish post ${post.id} to ${post.platform}`);
      failed++;
    }

    // Small delay between posts to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("");
  console.log(`Done! Published: ${published}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error("Publishing failed:", err);
  process.exit(1);
});
