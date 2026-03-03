import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================
// Social Posts Queue
// ============================================================

export interface SocialPost {
  id?: string;
  platform: "instagram" | "facebook" | "pinterest" | "x";
  content: string;
  hashtags: string;
  image_filename: string;
  image_url?: string;
  content_theme: string;
  status: "draft" | "approved" | "published" | "rejected";
  scheduled_for?: string;
  published_at?: string;
  ayrshare_post_id?: string;
  created_at?: string;
}

export async function insertPost(post: Omit<SocialPost, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("social_posts")
    .insert(post)
    .select()
    .single();

  if (error) throw new Error(`Failed to insert post: ${error.message}`);
  return data;
}

export async function getApprovedPosts(): Promise<SocialPost[]> {
  const { data, error } = await supabase
    .from("social_posts")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to fetch approved posts: ${error.message}`);
  return data || [];
}

export async function markPublished(id: string, externalPostId: string) {
  const { error } = await supabase
    .from("social_posts")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      ayrshare_post_id: externalPostId, // column name kept for DB compat
    })
    .eq("id", id);

  if (error) throw new Error(`Failed to mark post published: ${error.message}`);
}

export async function getDraftPosts(): Promise<SocialPost[]> {
  const { data, error } = await supabase
    .from("social_posts")
    .select("*")
    .eq("status", "draft")
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to fetch draft posts: ${error.message}`);
  return data || [];
}

export async function updatePostStatus(id: string, status: SocialPost["status"]) {
  const { error } = await supabase
    .from("social_posts")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(`Failed to update post status: ${error.message}`);
}

// ============================================================
// Blog Posts Queue
// ============================================================

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seo_keywords: string;
  featured_image: string;
  status: "draft" | "approved" | "published";
  created_at?: string;
  published_at?: string;
}

// ============================================================
// Agent Instructions (from admin dashboard)
// ============================================================

export interface AgentInstruction {
  id: string;
  content: string;
  type: "directive" | "one-time";
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export async function getActiveInstructions(): Promise<AgentInstruction[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("agent_instructions")
    .select("*")
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("created_at", { ascending: true });

  if (error) {
    console.warn("Failed to fetch agent instructions:", error.message);
    return [];
  }
  return data || [];
}

export async function deactivateInstruction(id: string): Promise<void> {
  const { error } = await supabase
    .from("agent_instructions")
    .update({ is_active: false })
    .eq("id", id);

  if (error) {
    console.warn(`Failed to deactivate instruction ${id}:`, error.message);
  }
}

// ============================================================
// Blog Posts Queue
// ============================================================

export async function insertBlogPost(post: Omit<BlogPost, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(post)
    .select()
    .single();

  if (error) throw new Error(`Failed to insert blog post: ${error.message}`);
  return data;
}
