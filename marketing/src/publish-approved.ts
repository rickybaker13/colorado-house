#!/usr/bin/env tsx
// ============================================================
// Social Media Publisher
// ============================================================
// Fetches approved posts from Supabase and publishes them
// to all platforms via Upload-Post's unified API.
//
// Usage: npm run publish
// Cron:  Runs twice daily via GitHub Actions (10am + 4pm MT)
// ============================================================

import {
  getApprovedPosts,
  markPublished,
  type SocialPost,
} from "./supabase.js";
import { PROPERTY } from "./config.js";

const UPLOAD_POST_API_KEY = process.env.UPLOAD_POST_API_KEY || "";
const UPLOAD_POST_PROFILE = process.env.UPLOAD_POST_PROFILE || "";

if (!UPLOAD_POST_API_KEY) {
  throw new Error("Missing UPLOAD_POST_API_KEY environment variable");
}

if (!UPLOAD_POST_PROFILE) {
  throw new Error(
    "Missing UPLOAD_POST_PROFILE environment variable (your Upload-Post profile name)"
  );
}

const API_BASE = "https://api.upload-post.com/api";

// Map our platform names to Upload-Post platform identifiers
const PLATFORM_MAP: Record<string, string> = {
  instagram: "instagram",
  facebook: "facebook",
  pinterest: "pinterest",
  x: "x",
};

// Build the full post text with hashtags appended
function buildPostText(post: SocialPost): string {
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

// Make an authenticated request to Upload-Post API
async function uploadPostRequest(
  endpoint: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Apikey ${UPLOAD_POST_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload-Post API error (${response.status}): ${errorText}`);
  }

  return (await response.json()) as Record<string, unknown>;
}

// Publish a single post via Upload-Post
async function publishPost(post: SocialPost): Promise<string> {
  const platform = PLATFORM_MAP[post.platform];
  if (!platform) {
    throw new Error(`Unknown platform: ${post.platform}`);
  }

  const postText = buildPostText(post);
  const imageUrl =
    post.image_url || `${PROPERTY.website}/images/${post.image_filename}`;

  console.log(`Publishing to ${post.platform}...`);
  console.log(`  Text: ${postText.slice(0, 100)}...`);
  console.log(`  Image: ${imageUrl}`);

  try {
    // Upload-Post uses /upload_photos for image posts
    const response = await uploadPostRequest("/upload_photos", {
      user: UPLOAD_POST_PROFILE,
      "platform[]": [platform],
      title: postText,
      media_url: imageUrl,
      // Pinterest-specific: set the destination link
      ...(post.platform === "pinterest" && {
        pinterest_board: PROPERTY.name,
        pinterest_link: PROPERTY.bookingUrl,
      }),
    });

    const requestId = String(
      response.request_id || response.id || "unknown"
    );
    console.log(`  Published! Upload-Post ID: ${requestId}`);
    return requestId;
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
      const postId = await publishPost(post);
      await markPublished(post.id!, postId);
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
