import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getServiceClient } from '@/lib/supabase'

async function verifyAdmin() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmails = process.env.ADMIN_EMAIL
  if (!user) throw new Error('Unauthorized')
  if (adminEmails) {
    const allowed = adminEmails.split(',').map(e => e.trim().toLowerCase())
    if (!allowed.includes(user.email?.toLowerCase() || '')) {
      throw new Error('Unauthorized')
    }
  }
  return user
}

const UPLOAD_POST_API_KEY = process.env.UPLOAD_POST_API_KEY || ''
const UPLOAD_POST_PROFILE = process.env.UPLOAD_POST_PROFILE || ''
const API_BASE = 'https://api.upload-post.com/api'
const WEBSITE = 'https://colorado-house.vercel.app'

const PLATFORM_MAP: Record<string, string> = {
  instagram: 'instagram',
  facebook: 'facebook',
  pinterest: 'pinterest',
  x: 'x',
}

interface SocialPost {
  id: string
  platform: string
  content: string
  hashtags?: string
  image_filename?: string
  image_url?: string
}

function buildPostText(post: SocialPost): string {
  let text = post.content
  if (post.hashtags?.trim()) {
    if (post.platform === 'instagram' || post.platform === 'facebook') {
      text += '\n\n' + post.hashtags
    } else {
      text += ' ' + post.hashtags
    }
  }
  return text
}

async function downloadImage(url: string): Promise<{ blob: Blob; filename: string }> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download image: HTTP ${response.status}`)
  }
  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
  const blob = await response.blob()
  return { blob, filename: `post-image.${ext}` }
}

export async function POST() {
  try {
    await verifyAdmin()

    if (!UPLOAD_POST_API_KEY || !UPLOAD_POST_PROFILE) {
      return NextResponse.json({
        error: 'Publishing not configured. Add UPLOAD_POST_API_KEY and UPLOAD_POST_PROFILE to environment variables.',
      }, { status: 500 })
    }

    const serviceClient = getServiceClient()

    // Fetch approved posts
    const { data: posts, error: fetchError } = await serviceClient
      .from('social_posts')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: true })

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({ message: 'No approved posts to publish.', published: 0, failed: 0 })
    }

    let published = 0
    let failed = 0
    const results: Array<{ platform: string; success: boolean; error?: string }> = []

    for (const post of posts) {
      const platform = PLATFORM_MAP[post.platform]
      if (!platform) {
        results.push({ platform: post.platform, success: false, error: 'Unknown platform' })
        failed++
        continue
      }

      try {
        const postText = buildPostText(post)
        const imageUrl = post.image_url || `${WEBSITE}/images/${post.image_filename}`

        // Download image (Upload-Post requires binary file upload via multipart/form-data)
        const { blob, filename } = await downloadImage(imageUrl)

        // Build multipart form data
        const formData = new FormData()
        formData.append('user', UPLOAD_POST_PROFILE)
        formData.append('platform[]', platform)
        formData.append('title', postText)
        formData.append('photos[]', blob, filename)

        if (post.platform === 'pinterest') {
          formData.append('pinterest_board_id', 'Purgatory Townhouse')
          formData.append('pinterest_link', `${WEBSITE}/booking`)
        }

        const response = await fetch(`${API_BASE}/upload_photos`, {
          method: 'POST',
          headers: {
            Authorization: `Apikey ${UPLOAD_POST_API_KEY}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Upload-Post API error (${response.status}): ${errorText}`)
        }

        const result = await response.json() as Record<string, unknown>
        const requestId = String(result.request_id || result.id || 'unknown')

        // Mark published in Supabase
        await serviceClient
          .from('social_posts')
          .update({
            status: 'published',
            published_at: new Date().toISOString(),
            ayrshare_post_id: requestId,
          })
          .eq('id', post.id)

        results.push({ platform: post.platform, success: true })
        published++
      } catch (err) {
        results.push({ platform: post.platform, success: false, error: err instanceof Error ? err.message : 'Unknown error' })
        failed++
      }

      // Small delay between posts
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    return NextResponse.json({ published, failed, results })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
