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
import { HASHTAGS, PROPERTY } from "./config.js";
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

// Posts lead with the area's most striking scenery: big mountain views,
// alpine lakes, alpenglow, wildflower basins. Signs, storefronts, fish
// close-ups, pets, and the townhouse interior are left for other uses.
const NOT_SCENIC = /\b(sign|signpost|storefront|bar & grill|trout|landing net|saint bernard|dog|bedroom|bathroom|kitchen)\b/i;
const SCENIC_BOOST = /\b(peak|peaks|lake|lakes|alpenglow|basin|ridge|panorama|summit|sunset|sunrise|waterfall|valley|golden hour|reflection)\b/i;

export function isScenic(p: PhotoRow): boolean {
  return p.setting === "area" && (p.quality ?? 0) >= 8 && !NOT_SCENIC.test(`${p.subject ?? ""} ${p.description ?? ""}`);
}

/**
 * Chooses a photo. Photos used in the last 60 days are skipped. Only the
 * best scenic shots are eligible (see isScenic); if none are left, the best
 * remaining area photos are used. In-season photos are preferred; if there
 * are none, any season is allowed and the caption frames it as a look ahead.
 */
export function choosePhoto(photos: PhotoRow[], now: Date, rand = Math.random): PhotoRow | null {
  const season = seasonFor(now);
  const next = SEASON_ORDER[(SEASON_ORDER.indexOf(season) + 1) % 4];
  const cutoff = now.getTime() - 60 * 86_400_000;
  const fresh = photos.filter(
    (p) => p.status === "ready" && (!p.last_used_at || Date.parse(p.last_used_at) < cutoff),
  );
  const scenic = fresh.filter(isScenic);
  const pool = scenic.length ? scenic : fresh.filter((p) => p.setting === "area" && !NOT_SCENIC.test(p.subject ?? ""));
  const base = pool.length ? pool : fresh;
  const inSeason = base.filter((p) => p.season === season || p.season === next || p.season === "any");
  const candidates = inSeason.length ? inSeason : base;
  if (!candidates.length) return null;
  const scored = candidates
    .map((p) => ({
      p,
      score:
        (p.quality ?? 5) * 2 +
        (SCENIC_BOOST.test(p.subject ?? "") ? 2 : 0) +
        (p.times_used === 0 ? 2 : 0) +
        (p.season === season ? 1 : 0) +
        rand() * 3,
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
        description: "The caption: 1 to 4 short sentences (under 60 words), no hashtags, no emoji strings. About the scene in this photo, its beauty, and what there is to do nearby.",
      },
      hashtags: {
        type: "array",
        items: { type: "string" },
        description: "Exactly 5 hashtags including the leading #. Instagram allows no more than 5.",
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
    `Write a short Instagram caption for a photo of the mountains around ${PROPERTY.name}, a vacation rental at Purgatory Resort near Durango, Colorado. The goal is to stop people scrolling and make them want to come here.`,
    ``,
    `THE PHOTO (attached) is the owner's own. Catalogue description: "${photo.description}"`,
    photo.location_guess
      ? `Identified location: ${photo.location_guess}.`
      : `The exact location is not known: do not name a specific trail, lake, or peak unless it is unmistakable in the photo; "the San Juans" is always fine.`,
    isProperty
      ? `This photo shows the townhouse itself.`
      : `This photo shows the surrounding area, not the townhouse. Do not imply it is the view from the house.`,
    seasonNote,
    ``,
    `FORMAT (strict):`,
    `- 1 to 4 short sentences, under 60 words in total. No story, no "imagine...", no narration of a day, no first person.`,
    `- Lead with the scene and its beauty in plain, vivid words.`,
    `- Then, if it fits, one line on how much is within reach from here, picking what suits the photo: hiking trails, fly fishing, camping, off-roading and ATV/jeep roads like the Alpine Loop, the old mining towns of Silverton and Ouray, Durango, the narrow-gauge railroad and mining history, skiing at Purgatory.`,
    `- An optional closing nod like "Book direct, link in bio." counts toward the 4 sentences. No other calls to action.`,
    `- Do not invent facts: no prices, dates, events, distances, or amenities beyond what is stated here.`,
    ``,
    `HASHTAGS: exactly 5 (Instagram's limit). Always ${HASHTAGS.instagram.always.join(" and ")}, plus 3 that match this photo and will reach people browsing those tags, e.g. ${HASHTAGS.instagram.scenic.join(" ")}.`,
    directives.length ? `\nOWNER INSTRUCTIONS (follow these where they fit this photo and the format above):\n- ${directives.join("\n- ")}` : ``,
    recentCaptions.length
      ? `\nRecent captions, so you don't repeat their openings or wording:\n${recentCaptions.map((c) => `- ${c.slice(0, 140)}`).join("\n")}`
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

/** Exactly the brand's 2 fixed tags plus the model's picks, max 5, no duplicates. */
export function finalHashtags(picked: string[]): string {
  const norm = (h: string) => (h.trim().startsWith("#") ? h.trim() : `#${h.trim()}`).replace(/\s+/g, "");
  const out: string[] = [];
  for (const h of [...HASHTAGS.instagram.always, ...picked.map(norm)]) {
    if (h.length > 1 && !out.some((o) => o.toLowerCase() === h.toLowerCase())) out.push(h);
    if (out.length === 5) break;
  }
  return out.join(" ");
}

export function sentenceCount(caption: string): number {
  return (caption.trim().match(/[^.!?]+[.!?]+(\s|$)/g) ?? [caption]).length;
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

  const recentCaptions = (recent ?? []).map((r) => r.content);
  const directives = instructions.map((i) => i.content);
  let post = await writeCaption(photo, recentCaptions, directives);
  // One retry if the model ran long; the format is the point of the change.
  if (sentenceCount(post.caption) > 4 || post.caption.split(/\s+/).length > 70) {
    console.log("Caption too long, asking again.");
    post = await writeCaption(photo, recentCaptions, [...directives, "Your last caption was too long. 1 to 4 short sentences, under 60 words."]);
  }
  const hashtags = finalHashtags(post.hashtags);

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
