import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase-server'

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

const ALLOWED_FIELDS: Record<string, string[]> = {
  social_posts: ['status', 'content', 'hashtags', 'image_filename', 'image_url', 'performance_notes'],
  blog_posts: ['status', 'content', 'title', 'excerpt'],
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdmin()

    const { id } = await params
    const body = await request.json()
    const table = request.nextUrl.searchParams.get('table') ?? 'social_posts'

    const allowedFields = ALLOWED_FIELDS[table]
    if (!allowedFields) {
      return NextResponse.json({ error: `Unknown table: ${table}` }, { status: 400 })
    }

    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
    }

    // Blog posts: approving should publish immediately (sets status to
    // "published" and stamps published_at) so the post appears on the
    // website and becomes eligible for social promotion.
    if (table === 'blog_posts' && updates.status === 'approved') {
      updates.status = 'published'
      updates.published_at = new Date().toISOString()
    }

    const serviceClient = getServiceClient()
    const { data, error } = await serviceClient
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
