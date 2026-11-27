import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { releaseDamageOnCancel, settleDamage } from '@/lib/payments/stay'
import { cancelWithRefund, previewRefund } from '@/lib/payments/cancel'
import { sendTelegramText } from '@/lib/notify'

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

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin()
    const supabase = getServiceClient()

    // Refund preview for the Cancel button: ?refundPreview=<booking id>
    const previewId = request.nextUrl.searchParams.get('refundPreview')
    if (previewId) {
      const { data: booking } = await supabase.from('bookings').select('*').eq('id', previewId).single()
      if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      return NextResponse.json(previewRefund(booking))
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await verifyAdmin()
    const { id, status, damageClaim, refundAmount } = await request.json()

    // Damage deposit: keep `damageClaim` dollars (0 releases it all).
    if (id && damageClaim !== undefined) {
      const claim = Number(damageClaim)
      if (!Number.isFinite(claim) || claim < 0) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
      }
      const supabase = getServiceClient()
      const { data: booking } = await supabase.from('bookings').select('*').eq('id', id).single()
      if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      try {
        const note = await settleDamage(booking, claim, claim > 0 ? 'Damage at the property' : 'No damage reported')
        await sendTelegramText(`🛡️ DAMAGE DEPOSIT SETTLED (admin)\n${booking.guest_name}, ${booking.check_in} → ${booking.check_out}\n${note}`).catch(() => {})
        const { data } = await supabase.from('bookings').select('*').eq('id', id).single()
        return NextResponse.json({ ...data, note })
      } catch (err) {
        console.error('Damage settle failed:', err)
        return NextResponse.json({ error: 'Square could not process this. Check the Square dashboard.' }, { status: 502 })
      }
    }

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    }

    const validStatuses = ['pending_approval', 'confirmed', 'denied', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = getServiceClient()

    // Cancel with a refund under the cancellation policy (or the amount the owner chose).
    if (status === 'cancelled' && refundAmount !== undefined) {
      const amount = Number(refundAmount)
      if (!Number.isFinite(amount) || amount < 0) return NextResponse.json({ error: 'Invalid refund amount' }, { status: 400 })
      const { data: booking } = await supabase.from('bookings').select('*').eq('id', id).single()
      if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      if (booking.status === 'cancelled') return NextResponse.json({ error: 'Already cancelled' }, { status: 409 })
      const note = await cancelWithRefund(booking, amount)
      const { data } = await supabase.from('bookings').select('*').eq('id', id).single()
      return NextResponse.json({ ...data, note })
    }

    if (status === 'cancelled' || status === 'denied') {
      // Give back any damage deposit taken for this stay.
      const { data: before } = await supabase.from('bookings').select('*').eq('id', id).single()
      if (before) {
        const note = await releaseDamageOnCancel(before)
        if (note) await sendTelegramText(`${before.guest_name}, ${before.check_in} → ${before.check_out} ${status}.${note}`).catch(() => {})
      }
    }
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyAdmin()
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing booking id' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
