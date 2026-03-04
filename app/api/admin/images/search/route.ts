import { NextRequest, NextResponse } from 'next/server'
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

interface PexelsPhoto {
  id: number
  alt: string
  photographer: string
  src: { medium: string; large2x: string; large: string }
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin()

    const query = request.nextUrl.searchParams.get('q')
    if (!query) {
      return NextResponse.json({ error: 'q parameter required' }, { status: 400 })
    }

    const apiKey = process.env.PEXELS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Pexels API not configured' }, { status: 500 })
    }

    const page = request.nextUrl.searchParams.get('page') || '1'
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape&page=${page}`
    const response = await fetch(url, {
      headers: { Authorization: apiKey },
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Pexels API error: ${response.status}` }, { status: 502 })
    }

    const data = await response.json()
    const photos = (data.photos || []).map((p: PexelsPhoto) => ({
      id: p.id,
      alt: p.alt || '',
      photographer: p.photographer,
      src: {
        medium: p.src.medium,
        large2x: p.src.large2x,
      },
    }))

    return NextResponse.json({
      photos,
      total_results: data.total_results,
      page: data.page,
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
