#!/usr/bin/env tsx
// ============================================================
// Instagram post generator (photo-first)
// ============================================================
// 1. Picks one of the owner's photos that fits the season and
//    hasn't been used recently.
// 2. Claude looks at that photo and writes the caption about
//    what is actually in it.
// 3. Saves a draft and sends it to the owners' Telegram group
//    with Post / Skip buttons. Nothing publishes without "Post".
//
// Usage: npm run generate
// Cron:  Mon / Wed / Fri mornings via GitHub Actions
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import { BRAND_VOICE, HASHTAGS, PROPERTY, TARGET_MARKETS } from "./config.js";
import { downloadPhoto, previewForModel, type PhotoRow } from "./photos.js";
import { getActiveInstructions, deactivateInstruction, supabase } from "./supabase.js";
import { sendDraftForApproval } from "./telegram.js";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const anthropic = new Anthropic();

type Season = "winter" | "spring" | "summer" | "fall";
const SEASON_ORDER: Season[] = ["winter", "spring", "summer", "fall"];

export function seasonFor(date: Date): Season {
  const m = date.getUTCMonth() + 1;
  // Matches the marketing calendar: winter (ski season) is November–March.
  if (m >= 11 || m <= 3) return "winter";
  if (m <= 5) return "spring";
  if (m <= 8) return "summer";
  return "fall";
}

/**
 * Chooses a photo. Photos used in the last 60 days are skipped. In-season
 * photos (current or next season, or season-neutral) are preferred; if there
 * are none, any season is allowed and the caption frames it as a look ahead.
 * Among candidates, higher quality and never-used photos are favored, with
 * some randomness for variety.
 */
export function choosePhoto(photos: PhotoRow[], now: Date, rand = Math.random): PhotoRow | null {
  const season = seasonFor(now);
  const next = SEASON_ORDER[(SEASON_ORDER.indexOf(season) + 1) % 4];
  const cutoff = now.getTime() - 60 * 86_400_000;
  const fresh = photos.filter(
    (p) => p.status === "ready" && (!p.last_used_at || Date.parse(p.last_used_at) < cutoff),
  );
  const inSeason = fresh.filter((p) => p.season === season || p.season === next || p.season === "any");
  const candidates = inSeason.length ? inSeason : fresh;
  if (!candidates.length) return null;
  const scored = candidates
    .map((p) => ({
      p,
      score: (p.quality ?? 5) + (p.times_used === 0 ? 2 : 0) + (p.season === season ? 1 : 0) + rand() * 4,
    }))
    .sort((a, b) => b.score - a.score);
  return scored[0].p;
}

const CAPTION_TOOL: Anthropic.Tool = {
  name: "write_post",
  description: "Write one Instagram post about the attached photo.",
  input_schema: {
    type: "object",
    properties: {
      caption: {
        type: "string",
        description: "The caption, 60-180 words, no hashtags. It must be about what is visible in this photo.",
      },
      hashtags: {
        type: "array",
        items: { type: "string" },
        description: "5-8 hashtags including the leading #.",
      },
      theme: { type: "string", description: "One or two words naming the angle, e.g. 'trail guide', 'cozy evening'." },
    },
    required: ["caption", "hashtags", "theme"],
  },
};

async function writeCaption(photo: PhotoRow, recentCaptions: string[], directives: string[]) {
  const now = new Date();
  const season = seasonFor(now);
  const b64 = await previewForModel(await downloadPhoto(photo.storage_path));
  const isProperty = photo.setting === "property_interior" || photo.setting === "property_exterior";
  const seasonNote =
    photo.season && photo.season !== "any" && photo.season !== season
      ? `The photo is from ${photo.season}, while it is currently ${season}: frame it as a look ahead ("coming up", "start planning"), never as today.`
      : `It is currently ${season}.`;

  const prompt = [
    `Write an Instagram post for ${PROPERTY.name}, a ${PROPERTY.bedrooms}-bedroom vacation rental townhouse (sleeps ${PROPERTY.maxGuests}) steps from Purgatory Resort near Durango, Colorado. Book direct at skipurgatoryhouse.com (link in bio).`,
    ``,
    `THE PHOTO (attached) is the owner's own. A description from when it was catalogued: "${photo.description}"`,
    photo.location_guess ? `Identified location: ${photo.location_guess}.` : `The exact location is not known: do not name a specific trail, lake, or peak unless it is unmistakable in the photo.`,
    isProperty
      ? `This photo shows the townhouse itself.`
      : `This photo shows the surrounding area, not the townhouse. Do not imply guests can see this view from the house; connect it to staying nearby instead.`,
    seasonNote,
    photo.caption_angles?.length ? `Possible angles: ${photo.caption_angles.join("; ")}.` : ``,
    ``,
    `VOICE: ${BRAND_VOICE.tone.join(" ")}`,
    `AVOID: ${BRAND_VOICE.doNot.join(" ")}`,
    `Audience: ${TARGET_MARKETS.demographics}; many come from ${TARGET_MARKETS.primary.join(", ")}.`,
    `End with a light call to action such as one of: ${BRAND_VOICE.callToAction.join(" | ")}.`,
    `Facts you may use: ${PROPERTY.highlights.join("; ")}. Do not invent prices, dates, events, or amenities.`,
    `Hashtags: always include ${HASHTAGS.instagram.always.join(" ")}, then a few relevant ones.`,
    directives.length ? `\nOWNER INSTRUCTIONS (follow these where they fit this photo; the caption must still be about what is in the photo):\n- ${directives.join("\n- ")}` : ``,
    recentCaptions.length
      ? `\nRecent captions, so you don't repeat their openings or ideas:\n${recentCaptions.map((c) => `- ${c.slice(0, 140)}`).join("\n")}`
      : ``,
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1200,
    tools: [CAPTION_TOOL],
    tool_choice: { type: "auto" },
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
          { type: "text", text: `${prompt}\n\nRespond by calling the write_post tool.` },
        ],
      },
    ],
  });
  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error("Model returned no post");
  return block.input as { caption: string; hashtags: string[]; theme: string };
}

async function main() {
  console.log("=== Instagram post generator ===");

  const { data: photos, error } = await supabase.from("photo_library").select("*").eq("status", "ready");
  if (error) throw new Error(`Reading photo library failed: ${error.message}`);
  const photo = choosePhoto((photos ?? []) as PhotoRow[], new Date());
  if (!photo) {
    console.log("No photo available: every ready photo was used in the last 60 days. Add more photos to the Drive folder.");
    return;
  }
  console.log(`Photo: ${photo.drive_name} (${photo.subject}, ${photo.season}, q${photo.quality})`);

  const { data: recent } = await supabase
    .from("social_posts")
    .select("content")
    .eq("platform", "instagram")
    .order("created_at", { ascending: false })
    .limit(6);
  const instructions = await getActiveInstructions();

  const post = await writeCaption(
    photo,
    (recent ?? []).map((r) => r.content),
    instructions.map((i) => i.content),
  );
  const hashtags = post.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ");

  const { data: draft, error: insErr } = await supabase
    .from("social_posts")
    .insert({
      platform: "instagram",
      content: post.caption,
      hashtags,
      image_filename: "",
      content_theme: post.theme,
      status: "draft",
      photo_id: photo.id,
    })
    .select("id")
    .single();
  if (insErr || !draft) throw new Error(`Saving draft failed: ${insErr?.message}`);

  // Reserve the photo so the next run picks a different one even if this is skipped.
  await supabase.from("photo_library").update({ last_used_at: new Date().toISOString() }).eq("id", photo.id);

  // One-time owner instructions are used up once applied.
  for (const i of instructions) if (i.type === "one-time") await deactivateInstruction(i.id);

  const messageId = await sendDraftForApproval(
    draft.id,
    await downloadPhoto(photo.storage_path),
    `${post.caption}\n\n${hashtags}`,
    `Theme: ${post.theme}`,
  );
  await supabase.from("social_posts").update({ telegram_message_id: messageId }).eq("id", draft.id);

  console.log(`Draft ${draft.id} sent to Telegram for approval.`);
}

// Only run when executed directly (not when imported by tests).
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("Generation failed:", err);
    process.exit(1);
  });
}
