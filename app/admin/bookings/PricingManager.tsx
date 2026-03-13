'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Save,
} from 'lucide-react'

interface SeasonalRate {
  id: string
  start_date: string
  end_date: string
  nightly_rate: number
  label: string
}

interface PricingConfig {
  defaultNightlyRate: number
  cleaningFee: number
  petFee: number
  maxGuests: number
  maxPets: number
  minNights: number
  btcDiscountPercent: number
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDateShort(s: string) {
  const d = parseDate(s)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Color palette for seasonal rate bands
const RATE_COLORS = [
  { bg: 'rgba(196,149,106,0.25)', border: 'rgba(196,149,106,0.5)', text: '#c4956a' },
  { bg: 'rgba(99,179,237,0.2)', border: 'rgba(99,179,237,0.4)', text: '#63b3ed' },
  { bg: 'rgba(154,230,180,0.2)', border: 'rgba(154,230,180,0.4)', text: '#9ae6b4' },
  { bg: 'rgba(246,173,85,0.2)', border: 'rgba(246,173,85,0.4)', text: '#f6ad55' },
  { bg: 'rgba(183,148,244,0.2)', border: 'rgba(183,148,244,0.4)', text: '#b794f4' },
  { bg: 'rgba(252,129,129,0.2)', border: 'rgba(252,129,129,0.4)', text: '#fc8181' },
]

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(196,149,106,0.12)',
  borderRadius: '10px',
  padding: '20px',
}

const btnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
}

const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  padding: '8px 12px',
  color: '#fafaf8',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(255,255,255,0.4)',
  display: 'block',
  marginBottom: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

export default function PricingManager() {
  const [config, setConfig] = useState<PricingConfig | null>(null)
  const [rates, setRates] = useState<SeasonalRate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Calendar state
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())

  // Selection state
  const [selectStart, setSelectStart] = useState<string | null>(null)
  const [selectEnd, setSelectEnd] = useState<string | null>(null)
  const [hoverDate, setHoverDate] = useState<string | null>(null)

  // Rate editing form
  const [editingRate, setEditingRate] = useState<SeasonalRate | null>(null)
  const [formLabel, setFormLabel] = useState('')
  const [formRate, setFormRate] = useState('')
  const [formStart, setFormStart] = useState('')
  const [formEnd, setFormEnd] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Config editing
  const [editConfig, setEditConfig] = useState<PricingConfig | null>(null)
  const [configSaving, setConfigSaving] = useState(false)


  async function fetchPricing() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/pricing')
      if (res.ok) {
        const data = await res.json()
        setConfig(data.config)
        setEditConfig(data.config)
        setRates(data.seasonalRates)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPricing() }, [])

  // Map date -> rate info for calendar coloring
  const dateRateMap = useMemo(() => {
    const map = new Map<string, { rate: SeasonalRate; colorIdx: number }>()
    rates.forEach((r, idx) => {
      const start = parseDate(r.start_date)
      const end = parseDate(r.end_date)
      const cur = new Date(start)
      while (cur <= end) {
        map.set(fmt(cur), { rate: r, colorIdx: idx % RATE_COLORS.length })
        cur.setDate(cur.getDate() + 1)
      }
    })
    return map
  }, [rates])

  // Selection range
  const selectionRange = useMemo(() => {
    if (!selectStart) return new Set<string>()
    const endDate = selectEnd || hoverDate
    if (!endDate) return new Set([selectStart])
    const s = selectStart < endDate ? selectStart : endDate
    const e = selectStart < endDate ? endDate : selectStart
    const set = new Set<string>()
    const cur = parseDate(s)
    const last = parseDate(e)
    while (cur <= last) {
      set.add(fmt(cur))
      cur.setDate(cur.getDate() + 1)
    }
    return set
  }, [selectStart, selectEnd, hoverDate])

  function openForm(start: string, end: string) {
    setFormStart(start)
    setFormEnd(end)
    // Check if there's an existing rate at this date to pre-fill
    const existing = dateRateMap.get(start)
    if (existing) {
      setFormRate(String(existing.rate.nightly_rate))
      setFormLabel(existing.rate.label)
      // If the selection exactly matches an existing entry, edit it in place
      if (existing.rate.start_date === start && existing.rate.end_date === end) {
        setEditingRate(existing.rate)
      } else {
        setEditingRate(null)
      }
    } else {
      setFormRate(String(config?.defaultNightlyRate || 500))
      setFormLabel('')
      setEditingRate(null)
    }
    setShowForm(true)
  }

  function handleDateClick(dateStr: string) {
    if (!selectStart || selectEnd) {
      // Start new selection
      setSelectStart(dateStr)
      setSelectEnd(null)
      setShowForm(false)
    } else {
      // Complete selection
      const s = selectStart < dateStr ? selectStart : dateStr
      const e = selectStart < dateStr ? dateStr : selectStart
      setSelectStart(s)
      setSelectEnd(e)
      openForm(s, e)
    }
  }

  function handleSingleDaySelect(dateStr: string) {
    setSelectStart(dateStr)
    setSelectEnd(dateStr)
    openForm(dateStr, dateStr)
  }

  async function saveRate() {
    if (!formStart || !formEnd || !formRate) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingRate?.id,
          start_date: formStart,
          end_date: formEnd,
          nightly_rate: Number(formRate),
          label: formLabel || `$${formRate}/night`,
        }),
      })
      if (res.ok) {
        await fetchPricing()
        setShowForm(false)
        setSelectStart(null)
        setSelectEnd(null)
        setEditingRate(null)
      }
    } finally {
      setSaving(false)
    }
  }

  async function deleteRate(id: string) {
    if (!confirm('Delete this rate period?')) return
    const res = await fetch('/api/admin/pricing', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      await fetchPricing()
      setShowForm(false)
      setSelectStart(null)
      setSelectEnd(null)
    }
  }

  async function saveConfig() {
    if (!editConfig) return
    setConfigSaving(true)
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          default_nightly_rate: editConfig.defaultNightlyRate,
          cleaning_fee: editConfig.cleaningFee,
          pet_fee: editConfig.petFee,
          max_guests: editConfig.maxGuests,
          max_pets: editConfig.maxPets,
          min_nights: editConfig.minNights,
          btc_discount_percent: editConfig.btcDiscountPercent,
        }),
      })
      if (res.ok) {
        setConfig(editConfig)
      }
    } finally {
      setConfigSaving(false)
    }
  }

  // Calendar rendering
  function renderCalendar() {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

    const cells: React.ReactNode[] = []

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day)
      const dateStr = fmt(d)
      const rateInfo = dateRateMap.get(dateStr)
      const isSelected = selectionRange.has(dateStr)
      const isToday = dateStr === fmt(today)

      const color = rateInfo ? RATE_COLORS[rateInfo.colorIdx] : null

      cells.push(
        <div
          key={day}
          onClick={() => handleDateClick(dateStr)}
          onDoubleClick={() => handleSingleDaySelect(dateStr)}
          onMouseEnter={() => setHoverDate(dateStr)}
          style={{
            position: 'relative',
            aspectRatio: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: isToday ? 600 : 400,
            backgroundColor: isSelected
              ? 'rgba(196,149,106,0.3)'
              : color
                ? color.bg
                : 'transparent',
            border: isSelected
              ? '1px solid rgba(196,149,106,0.6)'
              : isToday
                ? '1px solid rgba(196,149,106,0.3)'
                : '1px solid transparent',
            color: isSelected
              ? '#c4956a'
              : color
                ? color.text
                : 'rgba(255,255,255,0.6)',
            transition: 'all 0.1s ease',
          }}
        >
          <span>{day}</span>
          {rateInfo && (
            <span style={{
              fontSize: '9px',
              opacity: 0.7,
              marginTop: '1px',
            }}>
              ${rateInfo.rate.nightly_rate}
            </span>
          )}
        </div>
      )
    }

    return cells
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  if (loading) {
    return (
      <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '48px 0' }}>
        Loading pricing...
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Base Config */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#fafaf8', margin: '0 0 16px' }}>
          Base Pricing & Fees
        </h3>
        {editConfig && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '12px',
          }}>
            <div>
              <label style={labelStyle}>Default Nightly Rate</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>$</span>
                <input
                  type="number"
                  value={editConfig.defaultNightlyRate}
                  onChange={e => setEditConfig({ ...editConfig, defaultNightlyRate: Number(e.target.value) })}
                  style={{ ...inputStyle, paddingLeft: '24px' }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Cleaning Fee</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>$</span>
                <input
                  type="number"
                  value={editConfig.cleaningFee}
                  onChange={e => setEditConfig({ ...editConfig, cleaningFee: Number(e.target.value) })}
                  style={{ ...inputStyle, paddingLeft: '24px' }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Pet Fee</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>$</span>
                <input
                  type="number"
                  value={editConfig.petFee}
                  onChange={e => setEditConfig({ ...editConfig, petFee: Number(e.target.value) })}
                  style={{ ...inputStyle, paddingLeft: '24px' }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Min Nights</label>
              <input
                type="number"
                value={editConfig.minNights}
                onChange={e => setEditConfig({ ...editConfig, minNights: Number(e.target.value) })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Max Guests</label>
              <input
                type="number"
                value={editConfig.maxGuests}
                onChange={e => setEditConfig({ ...editConfig, maxGuests: Number(e.target.value) })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>BTC Discount %</label>
              <input
                type="number"
                value={editConfig.btcDiscountPercent}
                onChange={e => setEditConfig({ ...editConfig, btcDiscountPercent: Number(e.target.value) })}
                style={inputStyle}
              />
            </div>
          </div>
        )}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={saveConfig}
            disabled={configSaving}
            style={{
              ...btnBase,
              backgroundColor: 'rgba(196,149,106,0.2)',
              color: '#c4956a',
            }}
          >
            <Save size={13} />
            {configSaving ? 'Saving...' : 'Save Base Config'}
          </button>
        </div>
      </div>

      {/* Calendar + Rate Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}
        className="pricing-layout"
      >
        {/* Calendar */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <button onClick={prevMonth} style={{ ...btnBase, backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
              <ChevronLeft size={16} />
            </button>
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#fafaf8', margin: 0 }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h3>
            <button onClick={nextMonth} style={{ ...btnBase, backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
            Click two dates to select a range, or double-click for a single day.
          </p>

          {/* Day headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '4px',
          }}>
            {DAY_LABELS.map(d => (
              <div key={d} style={{
                textAlign: 'center',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 500,
                padding: '4px 0',
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
          }}>
            {renderCalendar()}
          </div>

          {/* Selection info */}
          {selectStart && !selectEnd && (
            <p style={{ fontSize: '12px', color: '#c4956a', marginTop: '12px', textAlign: 'center' }}>
              Selected: {formatDateShort(selectStart)} — click another date to complete range
            </p>
          )}
        </div>

        {/* Sidebar: Rate Form + Rate List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Rate Form - shows when dates are selected */}
          {showForm ? (
            <div style={{ ...cardStyle, border: '1px solid rgba(196,149,106,0.3)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#fafaf8', margin: '0 0 4px' }}>
                {editingRate ? 'Edit Rate' : 'Set Rate'}
              </h4>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: '0 0 12px' }}>
                {formatDateShort(formStart)}{formStart !== formEnd ? ` — ${formatDateShort(formEnd)}` : ''}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Nightly Rate</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>$</span>
                    <input
                      type="number"
                      value={formRate}
                      onChange={e => setFormRate(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '24px' }}
                      autoFocus
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Label (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Ski Season"
                    value={formLabel}
                    onChange={e => setFormLabel(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={labelStyle}>Start</label>
                    <input
                      type="date"
                      value={formStart}
                      onChange={e => {
                        setFormStart(e.target.value)
                        setSelectStart(e.target.value)
                      }}
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>End</label>
                    <input
                      type="date"
                      value={formEnd}
                      onChange={e => {
                        setFormEnd(e.target.value)
                        setSelectEnd(e.target.value)
                      }}
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    onClick={saveRate}
                    disabled={saving || !formRate || !formStart || !formEnd}
                    style={{
                      ...btnBase,
                      flex: 1,
                      justifyContent: 'center',
                      backgroundColor: 'rgba(34,197,94,0.15)',
                      color: '#4ade80',
                      opacity: (!formRate || !formStart || !formEnd) ? 0.5 : 1,
                    }}
                  >
                    <Save size={13} />
                    {saving ? 'Saving...' : 'Save Rate'}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setSelectStart(null)
                      setSelectEnd(null)
                      setEditingRate(null)
                    }}
                    style={{
                      ...btnBase,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              ...cardStyle,
              textAlign: 'center',
              padding: '24px 16px',
              border: '1px dashed rgba(196,149,106,0.2)',
            }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                Select dates on the calendar to set a rate
              </p>
            </div>
          )}

          {/* Legend */}
          <div style={{ padding: '0 4px' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '0 0 4px' }}>
              Uncolored dates use default rate: <span style={{ color: '#c4956a' }}>${config?.defaultNightlyRate}/night</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pricing-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
