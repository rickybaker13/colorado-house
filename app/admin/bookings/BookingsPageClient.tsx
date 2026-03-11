'use client'

import { useState } from 'react'
import { CalendarCheck, DollarSign } from 'lucide-react'
import BookingsClient from './BookingsClient'
import PricingManager from './PricingManager'

const tabStyle = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
  backgroundColor: active ? 'rgba(196,149,106,0.2)' : 'transparent',
  color: active ? '#c4956a' : 'rgba(255,255,255,0.45)',
  transition: 'all 0.15s ease',
})

export default function BookingsPageClient() {
  const [tab, setTab] = useState<'bookings' | 'pricing'>('bookings')

  return (
    <div>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        padding: '4px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.06)',
        width: 'fit-content',
      }}>
        <button onClick={() => setTab('bookings')} style={tabStyle(tab === 'bookings')}>
          <CalendarCheck size={14} />
          Bookings
        </button>
        <button onClick={() => setTab('pricing')} style={tabStyle(tab === 'pricing')}>
          <DollarSign size={14} />
          Pricing
        </button>
      </div>

      {tab === 'bookings' ? <BookingsClient /> : <PricingManager />}
    </div>
  )
}
