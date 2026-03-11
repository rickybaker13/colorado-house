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

export async function GET() {
  try {
    await verifyAdmin()
    const supabase = getServiceClient()

    const [{ data: configRows }, { data: pricing }] = await Promise.all([
      supabase.from('site_config').select('key, value'),
      supabase.from('pricing').select('*').order('start_date', { ascending: true }),
    ])

    const config: Record<string, string | number> = {}
    if (configRows) {
      for (const row of configRows) {
        config[row.key] = isNaN(Number(row.value)) ? row.value : Number(row.value)
      }
    }

    return NextResponse.json({
      config: {
        defaultNightlyRate: config.default_nightly_rate || 250,
        cleaningFee: config.cleaning_fee || 275,
        petFee: config.pet_fee || 200,
        maxGuests: config.max_guests || 10,
        maxPets: config.max_pets || 2,
        minNights: config.min_nights || 2,
        btcDiscountPercent: config.btc_discount_percent || 15,
      },
      seasonalRates: pricing || [],
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update site_config values
export async function PATCH(request: NextRequest) {
  try {
    await verifyAdmin()
    const body = await request.json()
    const supabase = getServiceClient()

    const allowedKeys = [
      'default_nightly_rate', 'cleaning_fee', 'pet_fee',
      'max_guests', 'max_pets', 'min_nights', 'btc_discount_percent',
    ]

    for (const [key, value] of Object.entries(body)) {
      if (!allowedKeys.includes(key)) continue
      await supabase
        .from('site_config')
        .upsert({ key, value: String(value), updated_at: new Date().toISOString() }, { onConflict: 'key' })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create or update seasonal rate
export async function POST(request: NextRequest) {
  try {
    await verifyAdmin()
    const body = await request.json()
    const supabase = getServiceClient()

    const { id, start_date, end_date, nightly_rate, label } = body

    if (!start_date || !end_date || !nightly_rate || !label) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (id) {
      // Update existing
      const { data, error } = await supabase
        .from('pricing')
        .update({ start_date, end_date, nightly_rate, label })
        .eq('id', id)
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json(data)
    } else {
      // Create new
      const { data, error } = await supabase
        .from('pricing')
        .insert({ start_date, end_date, nightly_rate, label })
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json(data)
    }
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
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const supabase = getServiceClient()
    const { error } = await supabase.from('pricing').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
