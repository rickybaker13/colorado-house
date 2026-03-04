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

// Extract a short title for Pinterest (max 100 chars)
// Uses the first sentence of the content, truncated if needed
function buildPinterestTitle(post: SocialPost): string {
  const content = post.content.trim();
  // Try first sentence (period, exclamation, or question mark)
  const sentenceEnd = content.search(/[.!?]/);
  let title = sentenceEnd > 0 && sentenceEnd < 95
    ? content.slice(0, sentenceEnd + 1)
    : content.slice(0, 97);

  // If we had to slice mid-word, back up to the last space
  if (title.length >= 97) {
    const lastSpace = title.lastIndexOf(" ");
    if (lastSpace > 50) {
      title = title.slice(0, lastSpace) + "...";
    } else {
      title = title.slice(0, 97) + "...";
    }
  }

  return title;
}

// Download an image from a URL and return it as a Blob with filename
async function downloadImage(url: string): Promise<{ blob: Blob; filename: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: HTTP ${response.status} from ${url}`);
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const blob = await response.blob();
  const filename = `post-image.${ext}`;

  return { blob, filename };
}

// Publish a single post via Upload-Post using multipart/form-data
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
    // Download the image first (Upload-Post requires binary file upload)
    console.log(`  Downloading image...`);
    const { blob, filename } = await downloadImage(imageUrl);
    console.log(`  Downloaded ${(blob.size / 1024).toFixed(0)} KB`);

    // Build multipart form data
    const formData = new FormData();
    formData.append("user", UPLOAD_POST_PROFILE);
    formData.append("platform[]", platform);
    formData.append("photos[]", blob, filename);

    if (post.platform === "pinterest") {
      // Pinterest has a 100-char title limit — use short title + full description
      const pinTitle = buildPinterestTitle(post);
      formData.append("title", pinTitle);
      formData.append("pinterest_title", pinTitle);
      formData.append("pinterest_description", postText);
      formData.append("pinterest_board_id", PROPERTY.name);
      formData.append("pinterest_link", PROPERTY.bookingUrl);
      console.log(`  Pinterest title (${pinTitle.length} chars): ${pinTitle}`);
    } else {
      formData.append("title", postText);
    }

    const response = await fetch(`${API_BASE}/upload_photos`, {
      method: "POST",
      headers: {
        Authorization: `Apikey ${UPLOAD_POST_API_KEY}`,
        // No Content-Type header — fetch sets it automatically for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload-Post API error (${response.status}): ${errorText}`);
    }

    const result = (await response.json()) as Record<string, unknown>;
    const requestId = String(result.request_id || result.id || "unknown");
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
