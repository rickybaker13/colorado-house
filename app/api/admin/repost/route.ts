import { NextRequest, NextResponse } from 'next/server'
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

function buildPinterestTitle(post: SocialPost): string {
  const content = post.content.trim()
  const sentenceEnd = content.search(/[.!?]/)
  let title = sentenceEnd > 0 && sentenceEnd < 95
    ? content.slice(0, sentenceEnd + 1)
    : content.slice(0, 97)
  if (title.length >= 97) {
    const lastSpace = title.lastIndexOf(' ')
    if (lastSpace > 50) {
      title = title.slice(0, lastSpace) + '...'
    } else {
      title = title.slice(0, 97) + '...'
    }
  }
  return title
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

const PLATFORM_MAP: Record<string, string> = {
  instagram: 'instagram',
  facebook: 'facebook',
  pinterest: 'pinterest',
  x: 'x',
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin()

    if (!UPLOAD_POST_API_KEY || !UPLOAD_POST_PROFILE) {
      return NextResponse.json({
        error: 'Publishing not configured. Add UPLOAD_POST_API_KEY and UPLOAD_POST_PROFILE to environment variables.',
      }, { status: 500 })
    }

    const body = await request.json()
    const postId = body.postId as string
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 })
    }

    const serviceClient = getServiceClient()

    // Fetch the specific post
    const { data: post, error: fetchError } = await serviceClient
      .from('social_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (fetchError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const platform = PLATFORM_MAP[post.platform]
    if (!platform) {
      return NextResponse.json({ error: `Unknown platform: ${post.platform}` }, { status: 400 })
    }

    const postText = buildPostText(post)
    const imageUrl = post.image_url || `${WEBSITE}/images/${post.image_filename}`

    // Download image
    const { blob, filename } = await downloadImage(imageUrl)

    // Build multipart form data
    const formData = new FormData()
    formData.append('user', UPLOAD_POST_PROFILE)
    formData.append('platform[]', platform)
    formData.append('photos[]', blob, filename)

    if (post.platform === 'pinterest') {
      const pinTitle = buildPinterestTitle(post)
      formData.append('title', pinTitle)
      formData.append('pinterest_title', pinTitle)
      formData.append('pinterest_description', postText)
      formData.append('pinterest_board_id', 'Purgatory Townhouse')
      formData.append('pinterest_link', `${WEBSITE}/booking`)
    } else {
      formData.append('title', postText)
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
      return NextResponse.json({
        error: `Upload-Post error (${response.status}): ${errorText}`,
      }, { status: 502 })
    }

    const result = await response.json() as Record<string, unknown>
    const requestId = String(result.request_id || result.id || 'unknown')

    // Update the published_at timestamp to reflect the repost
    await serviceClient
      .from('social_posts')
      .update({
        published_at: new Date().toISOString(),
        ayrshare_post_id: requestId,
      })
      .eq('id', postId)

    return NextResponse.json({ success: true, requestId, platform: post.platform })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Internal server error',
    }, { status: 500 })
  }
}
