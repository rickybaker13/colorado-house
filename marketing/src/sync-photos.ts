#!/usr/bin/env tsx
// ============================================================
// Photo sync: Google Drive folder → cleaned copies in Supabase
// → one-time description by Claude (looking at the actual photo).
//
// Usage: npm run sync-photos
// Cron:  daily via GitHub Actions. Safe to re-run; only new
//        Drive files and undescribed photos are processed.
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "./supabase.js";
import {
  cleanImage,
  downloadDriveFile,
  downloadPhoto,
  listDriveImages,
  previewForModel,
  uploadPhoto,
  type PhotoRow,
} from "./photos.js";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const anthropic = new Anthropic();

// How many to handle per run, so one run never takes too long.
const MAX_IMPORTS = Number(process.env.MAX_IMPORTS || 250);
const MAX_DESCRIBE = Number(process.env.MAX_DESCRIBE || 250);

async function importNewPhotos() {
  const driveFiles = await listDriveImages();
  const { data: existing, error } = await supabase.from("photo_library").select("drive_file_id");
  if (error) throw new Error(`Reading photo_library failed: ${error.message}`);
  const known = new Set((existing ?? []).map((r) => r.drive_file_id));
  const fresh = driveFiles.filter((f) => !known.has(f.id)).slice(0, MAX_IMPORTS);
  console.log(`Drive: ${driveFiles.length} photos, ${fresh.length} new to import.`);

  for (const f of fresh) {
    try {
      const clean = await cleanImage(await downloadDriveFile(f.id));
      const path = `${f.id}.jpg`;
      await uploadPhoto(path, clean.data);
      const { error: insErr } = await supabase.from("photo_library").insert({
        drive_file_id: f.id,
        drive_name: f.name,
        storage_path: path,
        width: clean.width,
        height: clean.height,
        taken_at: clean.takenAt,
      });
      if (insErr) throw new Error(insErr.message);
      console.log(`  imported ${f.name}`);
    } catch (err) {
      console.error(`  failed to import ${f.name}:`, err);
    }
  }
}

const RECORD_TOOL: Anthropic.Tool = {
  name: "record_photo",
  description: "Record what this photo shows, for choosing and captioning Instagram posts.",
  input_schema: {
    type: "object",
    properties: {
      description: {
        type: "string",
        description:
          "2-3 plain sentences describing exactly what is visible: subject, light, weather, season cues. No guessing beyond what is in the frame.",
      },
      setting: {
        type: "string",
        enum: ["property_interior", "property_exterior", "area", "other"],
        description:
          "property_interior/exterior = the rental townhouse itself; area = mountains, trails, lakes, towns, resort; other = anything else.",
      },
      subject: { type: "string", description: "A few words, e.g. 'alpine lake', 'rocky jeep trail', 'great room fireplace'." },
      location_guess: {
        type: ["string", "null"],
        description: "A specific named place ONLY if clearly identifiable (signage, unmistakable landmark). Otherwise null.",
      },
      season: { type: "string", enum: ["winter", "spring", "summer", "fall", "any"] },
      recognizable_people: {
        type: "boolean",
        description: "True if any person's face is visible enough to recognize them.",
      },
      quality: {
        type: "integer",
        minimum: 1,
        maximum: 10,
        description: "Instagram-worthiness: composition, sharpness, light. 7+ is strong.",
      },
      instagram_ok: {
        type: "boolean",
        description:
          "False for blurry, dark, duplicate-looking, screenshots, documents, receipts, license plates or addresses readable, or anything private.",
      },
      exclude_reason: { type: ["string", "null"], description: "Short reason when instagram_ok is false." },
      caption_angles: {
        type: "array",
        items: { type: "string" },
        description: "2-3 short ideas for what a caption about this photo could focus on.",
      },
    },
    required: [
      "description",
      "setting",
      "subject",
      "location_guess",
      "season",
      "recognizable_people",
      "quality",
      "instagram_ok",
      "exclude_reason",
      "caption_angles",
    ],
  },
};

interface Recorded {
  description: string;
  setting: PhotoRow["setting"];
  subject: string;
  location_guess: string | null;
  season: PhotoRow["season"];
  recognizable_people: boolean;
  quality: number;
  instagram_ok: boolean;
  exclude_reason: string | null;
  caption_angles: string[];
}

async function describe(photo: PhotoRow): Promise<Recorded> {
  const b64 = await previewForModel(await downloadPhoto(photo.storage_path));
  const taken = photo.taken_at ? ` It was taken on ${photo.taken_at.slice(0, 10)}.` : "";
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 800,
    tools: [RECORD_TOOL],
    tool_choice: { type: "tool", name: "record_photo" },
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
          {
            type: "text",
            text:
              "This is the owner's own photo, from a vacation rental townhouse at Purgatory Resort near Durango, Colorado, or the surrounding San Juan Mountains." +
              taken +
              " Describe only what is actually in the photo.",
          },
        ],
      },
    ],
  });
  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error("Model returned no description");
  return block.input as Recorded;
}

async function describePending() {
  const { data: pending, error } = await supabase
    .from("photo_library")
    .select("*")
    .eq("status", "pending")
    .limit(MAX_DESCRIBE);
  if (error) throw new Error(`Reading pending photos failed: ${error.message}`);
  console.log(`Describing ${pending?.length ?? 0} photo(s).`);

  for (const photo of (pending ?? []) as PhotoRow[]) {
    try {
      const r = await describe(photo);
      // Photos with recognizable people stay out of rotation by default.
      const excludeReason = !r.instagram_ok
        ? r.exclude_reason || "not suitable"
        : r.recognizable_people
          ? "recognizable people"
          : null;
      const { error: upErr } = await supabase
        .from("photo_library")
        .update({
          status: excludeReason ? "excluded" : "ready",
          description: r.description,
          setting: r.setting,
          subject: r.subject,
          location_guess: r.location_guess,
          season: r.season,
          recognizable_people: r.recognizable_people,
          quality: r.quality,
          caption_angles: r.caption_angles,
          exclude_reason: excludeReason,
        })
        .eq("id", photo.id);
      if (upErr) throw new Error(upErr.message);
      console.log(`  ${photo.drive_name}: ${excludeReason ? `excluded (${excludeReason})` : `ready, ${r.subject}, q${r.quality}`}`);
    } catch (err) {
      console.error(`  failed to describe ${photo.drive_name}:`, err);
      await supabase.from("photo_library").update({ status: "error" }).eq("id", photo.id);
    }
  }
}

async function main() {
  console.log("=== Photo sync ===");
  await importNewPhotos();
  await describePending();
  const { data } = await supabase.from("photo_library").select("status");
  const counts: Record<string, number> = {};
  for (const r of data ?? []) counts[r.status] = (counts[r.status] ?? 0) + 1;
  console.log("Library:", counts);
}

main().catch((err) => {
  console.error("Photo sync failed:", err);
  process.exit(1);
});
