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
    let pricingTemplates: Array<{ label: string; nightly_rate: number }> = []
    if (configRows) {
      for (const row of configRows) {
        if (row.key === 'pricing_templates') {
          try { pricingTemplates = JSON.parse(row.value) } catch { /* ignore */ }
        } else {
          config[row.key] = isNaN(Number(row.value)) ? row.value : Number(row.value)
        }
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
      pricingTemplates,
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

    // Handle template operations
    if (body.action === 'save_template') {
      const { label, nightly_rate } = body
      if (!label || !nightly_rate) {
        return NextResponse.json({ error: 'Missing label or rate' }, { status: 400 })
      }
      // Get existing templates
      const { data: existing } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'pricing_templates')
        .single()
      let templates: Array<{ label: string; nightly_rate: number }> = []
      if (existing?.value) {
        try { templates = JSON.parse(existing.value) } catch { /* ignore */ }
      }
      // Add new template (avoid duplicates by label)
      templates = templates.filter(t => t.label !== label)
      templates.push({ label, nightly_rate: Number(nightly_rate) })
      await supabase
        .from('site_config')
        .upsert({ key: 'pricing_templates', value: JSON.stringify(templates), updated_at: new Date().toISOString() }, { onConflict: 'key' })
      return NextResponse.json({ success: true, templates })
    }

    if (body.action === 'delete_template') {
      const { label } = body
      const { data: existing } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'pricing_templates')
        .single()
      let templates: Array<{ label: string; nightly_rate: number }> = []
      if (existing?.value) {
        try { templates = JSON.parse(existing.value) } catch { /* ignore */ }
      }
      templates = templates.filter(t => t.label !== label)
      await supabase
        .from('site_config')
        .upsert({ key: 'pricing_templates', value: JSON.stringify(templates), updated_at: new Date().toISOString() }, { onConflict: 'key' })
      return NextResponse.json({ success: true, templates })
    }

    if (body.action === 'clear_all_templates') {
      await supabase
        .from('site_config')
        .upsert({ key: 'pricing_templates', value: JSON.stringify([]), updated_at: new Date().toISOString() }, { onConflict: 'key' })
      return NextResponse.json({ success: true, templates: [] })
    }

    if (body.action === 'clear_all_rates') {
      const { error } = await supabase.from('pricing').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    const { id, start_date, end_date, nightly_rate, label, save_as_template } = body

    if (!start_date || !end_date || !nightly_rate || !label) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let rateData
    if (id) {
      // Update existing
      const { data, error } = await supabase
        .from('pricing')
        .update({ start_date, end_date, nightly_rate, label })
        .eq('id', id)
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      rateData = data
    } else {
      // Create new
      const { data, error } = await supabase
        .from('pricing')
        .insert({ start_date, end_date, nightly_rate, label })
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      rateData = data
    }

    // Also save as reusable template if requested
    if (save_as_template) {
      const { data: existing } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'pricing_templates')
        .single()
      let templates: Array<{ label: string; nightly_rate: number }> = []
      if (existing?.value) {
        try { templates = JSON.parse(existing.value) } catch { /* ignore */ }
      }
      templates = templates.filter(t => t.label !== label)
      templates.push({ label, nightly_rate: Number(nightly_rate) })
      await supabase
        .from('site_config')
        .upsert({ key: 'pricing_templates', value: JSON.stringify(templates), updated_at: new Date().toISOString() }, { onConflict: 'key' })
    }

    return NextResponse.json(rateData)
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
