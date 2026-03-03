-- ============================================================
-- Supabase Migration: Social Media Marketing Tables
-- ============================================================
-- Run this in your Supabase SQL Editor or apply as a migration.
--
-- Tables:
--   social_posts  — Content queue for social media posts
--   blog_posts    — Content queue for blog articles
-- ============================================================

-- Social media posts queue
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'pinterest', 'x')),
  content TEXT NOT NULL,
  hashtags TEXT DEFAULT '',
  image_filename TEXT NOT NULL,
  image_url TEXT,
  content_theme TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published', 'rejected')),
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  ayrshare_post_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups by status
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts (status);

-- Index for platform + status queries
CREATE INDEX IF NOT EXISTS idx_social_posts_platform_status ON social_posts (platform, status);

-- Blog posts queue
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  seo_keywords TEXT DEFAULT '',
  featured_image TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups by status
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts (status);

-- Index for slug lookups (for the website to render blog posts)
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);

-- Enable Row Level Security
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (used by the marketing scripts)
CREATE POLICY "Service role full access on social_posts"
  ON social_posts
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on blog_posts"
  ON blog_posts
  FOR ALL
  USING (auth.role() = 'service_role');

-- Public can read published blog posts (for the website)
CREATE POLICY "Public can read published blog posts"
  ON blog_posts
  FOR SELECT
  USING (status = 'published');
