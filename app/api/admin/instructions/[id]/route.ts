import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase-server'

async function verifyAdmin() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!user || (adminEmail && user.email !== adminEmail)) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdmin()

    const { id } = await params
    const body = await request.json()
    const { is_active } = body

    if (typeof is_active !== 'boolean') {
      return NextResponse.json({ error: 'is_active must be a boolean' }, { status: 400 })
    }

    const serviceClient = getServiceClient()
    const { data, error } = await serviceClient
      .from('agent_instructions')
      .update({ is_active })
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdmin()

    const { id } = await params

    const serviceClient = getServiceClient()
    const { error } = await serviceClient
      .from('agent_instructions')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
