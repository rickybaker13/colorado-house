-- ============================================================
-- Supabase Migration: Admin Dashboard Tables
-- ============================================================
-- Run this in your Supabase SQL Editor after the initial
-- marketing migration (supabase-migration.sql).
-- ============================================================

-- Agent instructions table (directives from admin to AI agents)
CREATE TABLE IF NOT EXISTS agent_instructions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'directive'
    CHECK (type IN ('directive', 'one-time')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ  -- NULL = no expiry; one-time instructions deactivate after use
);

CREATE INDEX IF NOT EXISTS idx_agent_instructions_active
  ON agent_instructions (is_active, created_at);

ALTER TABLE agent_instructions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on agent_instructions"
  ON agent_instructions
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can manage agent_instructions"
  ON agent_instructions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add performance notes column to social_posts (for admin history tracking)
ALTER TABLE social_posts
  ADD COLUMN IF NOT EXISTS performance_notes TEXT;

-- Allow authenticated users (admin session) to read social_posts and blog_posts
CREATE POLICY "Authenticated users can read social_posts"
  ON social_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read blog_posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (true);
