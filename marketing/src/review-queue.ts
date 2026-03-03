#!/usr/bin/env tsx
// ============================================================
// Content Review Queue — CLI Tool
// ============================================================
// Lists draft posts and lets you approve/reject them from
// the command line. Run: npm run review
// ============================================================

import { getDraftPosts, updatePostStatus, type SocialPost } from "./supabase.js";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function displayPost(post: SocialPost, index: number) {
  const divider = "─".repeat(60);
  console.log(divider);
  console.log(`[${index + 1}] ${post.platform.toUpperCase()} | Theme: ${post.content_theme}`);
  console.log(`    Image: ${post.image_filename}`);
  console.log(`    Created: ${post.created_at}`);
  console.log(divider);
  console.log(post.content);
  if (post.hashtags) {
    console.log("");
    console.log(`Hashtags: ${post.hashtags}`);
  }
  console.log("");
}

async function main() {
  console.log("=== Purgatory Townhouse — Content Review Queue ===");
  console.log("");

  const drafts = await getDraftPosts();

  if (drafts.length === 0) {
    console.log("No drafts to review. Queue is empty.");
    rl.close();
    return;
  }

  console.log(`${drafts.length} draft(s) pending review.\n`);

  for (let i = 0; i < drafts.length; i++) {
    const post = drafts[i];
    displayPost(post, i);

    const action = await ask("  [a]pprove / [r]eject / [s]kip / [q]uit? ");

    switch (action.toLowerCase().trim()) {
      case "a":
        await updatePostStatus(post.id!, "approved");
        console.log("  -> Approved! Will be published on next publish run.\n");
        break;
      case "r":
        await updatePostStatus(post.id!, "rejected");
        console.log("  -> Rejected.\n");
        break;
      case "s":
        console.log("  -> Skipped.\n");
        break;
      case "q":
        console.log("\nExiting review.");
        rl.close();
        return;
      default:
        console.log("  -> Skipped (unrecognized input).\n");
    }
  }

  console.log("All drafts reviewed!");
  rl.close();
}

main().catch((err) => {
  console.error("Review failed:", err);
  rl.close();
  process.exit(1);
});
