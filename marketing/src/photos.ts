// ============================================================
// Photo library helpers: Google Drive source, image cleaning,
// and the private Supabase Storage bucket.
// ============================================================

import { JWT } from "google-auth-library";
import sharp from "sharp";
import { supabase } from "./supabase.js";

export const DRIVE_FOLDER_ID =
  process.env.DRIVE_PHOTOS_FOLDER_ID || "1yAr8qLIm09pyGsQhR57BCDZykjwOge9x";
export const BUCKET = "photo-library";

export interface PhotoRow {
  id: string;
  drive_file_id: string;
  drive_name: string | null;
  storage_path: string;
  taken_at: string | null;
  status: "pending" | "ready" | "excluded" | "error";
  description: string | null;
  setting: "property_interior" | "property_exterior" | "area" | "other" | null;
  subject: string | null;
  location_guess: string | null;
  season: "winter" | "spring" | "summer" | "fall" | "any" | null;
  recognizable_people: boolean | null;
  quality: number | null;
  caption_angles: string[] | null;
  times_used: number;
  last_used_at: string | null;
}

// ---------- Google Drive (service account, read-only) ----------

let driveClient: JWT | null = null;
function drive(): JWT {
  if (driveClient) return driveClient;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON");
  const key = JSON.parse(raw) as { client_email: string; private_key: string };
  driveClient = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  return driveClient;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

export async function listDriveImages(): Promise<DriveFile[]> {
  const files: DriveFile[] = [];
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({
      q: `'${DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType)",
      pageSize: "1000",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const res = await drive().request<{ files: DriveFile[]; nextPageToken?: string }>({
      url: `https://www.googleapis.com/drive/v3/files?${params}`,
    });
    files.push(...res.data.files);
    pageToken = res.data.nextPageToken;
  } while (pageToken);
  return files;
}

export async function downloadDriveFile(id: string): Promise<Buffer> {
  const res = await drive().request<ArrayBuffer>({
    url: `https://www.googleapis.com/drive/v3/files/${id}?alt=media&supportsAllDrives=true`,
    responseType: "arraybuffer",
  });
  return Buffer.from(res.data);
}

// ---------- Image cleaning ----------

/** EXIF DateTimeOriginal ("2025:07:08 13:14:29") → ISO string, read before stripping. */
function takenAt(exif: Buffer | undefined): string | null {
  if (!exif) return null;
  const m = exif.toString("latin1").match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
  if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`;
  return Number.isNaN(Date.parse(iso)) ? null : iso;
}

/**
 * Rotates per EXIF orientation, resizes to at most 2048px, and re-encodes as
 * JPEG. sharp drops all metadata (GPS, camera, dates) unless asked to keep it.
 */
export async function cleanImage(original: Buffer) {
  const meta = await sharp(original).metadata();
  const { data, info } = await sharp(original)
    .rotate()
    .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, takenAt: takenAt(meta.exif) };
}

/** Smaller copy for the vision model (keeps cost down). */
export async function previewForModel(clean: Buffer): Promise<string> {
  const small = await sharp(clean)
    .resize({ width: 1024, height: 1024, fit: "inside" })
    .jpeg({ quality: 80 })
    .toBuffer();
  return small.toString("base64");
}

// ---------- Storage ----------

export async function uploadPhoto(path: string, data: Buffer) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, data, { contentType: "image/jpeg", upsert: true });
  if (error) throw new Error(`Storage upload failed for ${path}: ${error.message}`);
}

export async function downloadPhoto(path: string): Promise<Buffer> {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error || !data) throw new Error(`Storage download failed for ${path}: ${error?.message}`);
  return Buffer.from(await data.arrayBuffer());
}
