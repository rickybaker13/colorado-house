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
      // Remove any existing rates that overlap with this new date range.
      // This prevents duplicate entries from piling up.

      // 1) Fetch all existing rates that overlap the new range
      const { data: overlapping } = await supabase
        .from('pricing')
        .select('*')
        .lte('start_date', end_date)
        .gte('end_date', start_date)

      if (overlapping && overlapping.length > 0) {
        const toDelete: string[] = []
        const toInsert: { start_date: string; end_date: string; nightly_rate: number; label: string }[] = []

        for (const existing of overlapping) {
          // Fully covered by new range — delete it
          if (existing.start_date >= start_date && existing.end_date <= end_date) {
            toDelete.push(existing.id)
            continue
          }

          // Partially overlapping — trim or split
          toDelete.push(existing.id)

          // Part before the new range
          if (existing.start_date < start_date) {
            const dayBefore = new Date(start_date)
            dayBefore.setDate(dayBefore.getDate() - 1)
            const trimmedEnd = dayBefore.toISOString().split('T')[0]
            toInsert.push({
              start_date: existing.start_date,
              end_date: trimmedEnd,
              nightly_rate: existing.nightly_rate,
              label: existing.label,
            })
          }

          // Part after the new range
          if (existing.end_date > end_date) {
            const dayAfter = new Date(end_date)
            dayAfter.setDate(dayAfter.getDate() + 1)
            const trimmedStart = dayAfter.toISOString().split('T')[0]
            toInsert.push({
              start_date: trimmedStart,
              end_date: existing.end_date,
              nightly_rate: existing.nightly_rate,
              label: existing.label,
            })
          }
        }

        if (toDelete.length > 0) {
          await supabase.from('pricing').delete().in('id', toDelete)
        }
        if (toInsert.length > 0) {
          await supabase.from('pricing').insert(toInsert)
        }
      }

      // Insert the new rate
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
