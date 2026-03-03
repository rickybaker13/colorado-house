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

interface BulkUpdateBody {
  ids: string[]
  status: 'approved' | 'rejected'
  table?: string
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin()

    const body: BulkUpdateBody = await request.json()
    const { ids, status, table = 'social_posts' } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 })
    }

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json({ error: 'status must be "approved" or "rejected"' }, { status: 400 })
    }

    const serviceClient = getServiceClient()
    const { data, error } = await serviceClient
      .from(table)
      .update({ status })
      .in('id', ids)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ updated: data?.length ?? 0 }, { status: 200 })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
