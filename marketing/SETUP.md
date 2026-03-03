# Marketing Automation Setup Guide

Automated social media posting and blog generation for Purgatory Townhouse.

## Architecture

```
GitHub Actions (cron)
  ├── Daily 8am MT:  Generate 4 social posts (Claude API) → Supabase drafts
  ├── 2x daily:      Publish approved posts → Upload-Post → Instagram/FB/Pinterest/X
  └── Weekly Monday:  Generate blog post (Claude API) → Supabase draft
```

## Setup Steps

### Step 1: Create Social Media Accounts

You need business/creator accounts on each platform:

- [ ] **Instagram**: Convert to Business or Creator account (Settings → Account → Switch to Professional)
- [ ] **Facebook**: Create a Facebook Business Page for "Purgatory Townhouse"
- [ ] **Pinterest**: Create a Pinterest Business account at business.pinterest.com
- [ ] **X (Twitter)**: Create an account (standard account works)

### Step 2: Sign Up for Upload-Post

1. Go to [upload-post.com](https://www.upload-post.com) and create an account
2. Choose the **Basic** plan ($16/month) — unlimited uploads, 5 profiles
3. In the Upload-Post dashboard, create a **Profile** (e.g., "purgatory-townhouse")
4. Connect each social media account through the dashboard:
   - Authorize Instagram (requires your Facebook Page to be linked)
   - Authorize Facebook Page
   - Authorize Pinterest Business
   - Authorize X
5. Go to your dashboard and generate an **API Key**
6. Note your **Profile name** — you'll need it as `UPLOAD_POST_PROFILE`

### Step 3: Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Go to Settings → API Keys → Create Key
4. Copy the key (starts with `sk-ant-`)
5. Add credit (~$10 to start — each content generation run costs ~$0.02-0.05)

### Step 4: Run the Supabase Migration

1. Go to your Supabase dashboard → SQL Editor
2. Paste the contents of `supabase-migration.sql`
3. Click "Run"
4. Verify the `social_posts` and `blog_posts` tables were created

### Step 5: Add GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Add these 5 secrets:

| Secret Name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `UPLOAD_POST_API_KEY` | Your Upload-Post API key |
| `UPLOAD_POST_PROFILE` | Your Upload-Post profile name |

### Step 6: Test Locally

```bash
cd marketing
npm install

# Copy .env.example to .env and fill in your values
cp .env.example .env

# Generate test posts (saves as drafts to Supabase)
npm run generate

# Review drafts in your terminal
npm run review

# Publish approved posts
npm run publish

# Generate a blog post
npm run generate-blog
```

### Step 7: Enable GitHub Actions

Push your changes to the `main` branch. The cron jobs will start automatically:

- **Daily at 8am MT**: Generates 4 social media posts as drafts
- **10am + 4pm MT**: Publishes any posts you've approved
- **Mondays at 9am MT**: Generates a blog post draft

You can also trigger any workflow manually from the GitHub Actions tab.

## Daily Workflow

1. **Morning**: GitHub Actions generates 4 draft posts (Instagram, Facebook, Pinterest, X)
2. **You review**: Check the admin dashboard at skipurgatoryhouse.com/admin → Social Queue to approve/reject/edit posts
3. **Auto-publish**: The publish workflow picks up approved posts at 10am and 4pm MT

## Cost Breakdown

| Service | Monthly Cost |
|---|---|
| Upload-Post Basic | $16 |
| Anthropic API (~30 social runs + 4 blog posts) | ~$3-5 |
| GitHub Actions | Free |
| Supabase (existing project) | $0 |
| **Total** | **~$19-21/month** |

## File Reference

```
marketing/
├── src/
│   ├── config.ts              # Brand voice, property details, photo library
│   ├── supabase.ts            # Database helpers for content queue
│   ├── generate-content.ts    # Daily social media post generator
│   ├── generate-blog.ts       # Weekly blog post generator
│   ├── publish-approved.ts    # Upload-Post publisher for approved posts
│   └── review-queue.ts        # CLI tool to review/approve drafts
├── supabase-migration.sql     # Database tables for content queue
├── .env.example               # Environment variable template
├── package.json
├── tsconfig.json
└── SETUP.md                   # This file

.github/workflows/
├── generate-content.yml       # Daily cron: generate social posts
├── generate-blog.yml          # Weekly cron: generate blog post
└── publish-approved.yml       # 2x daily cron: publish approved posts
```
