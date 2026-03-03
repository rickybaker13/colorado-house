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

export async function GET(_request: NextRequest) {
  try {
    await verifyAdmin()

    const serviceClient = getServiceClient()
    const { data, error } = await serviceClient
      .from('agent_instructions')
      .select('*')
      .order('created_at', { ascending: false })

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

interface CreateInstructionBody {
  content: string
  type: 'directive' | 'one-time'
  expires_at?: string
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin()

    const body: CreateInstructionBody = await request.json()
    const { content, type, expires_at } = body

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    if (type !== 'directive' && type !== 'one-time') {
      return NextResponse.json({ error: 'type must be "directive" or "one-time"' }, { status: 400 })
    }

    const record: Record<string, unknown> = { content, type }
    if (expires_at) {
      record.expires_at = expires_at
    }

    const serviceClient = getServiceClient()
    const { data, error } = await serviceClient
      .from('agent_instructions')
      .insert(record)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
