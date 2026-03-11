'use client'

import { useState, useEffect } from 'react'
import { Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

interface Booking {
  id: string
  guest_name: string
  guest_email: string
  guest_phone: string | null
  guest_message: string | null
  check_in: string
  check_out: string
  num_guests: number
  num_pets: number
  nightly_total: number
  cleaning_fee: number
  pet_fee: number
  final_total: number
  payment_method: string
  status: string
  payment_status: string
  square_payment_id: string | null
  deposit_amount: number
  created_at: string
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    pending_approval: {
      bg: 'rgba(234,179,8,0.12)',
      text: '#facc15',
      border: 'rgba(234,179,8,0.25)',
    },
    confirmed: {
      bg: 'rgba(34,197,94,0.12)',
      text: '#4ade80',
      border: 'rgba(34,197,94,0.2)',
    },
    denied: {
      bg: 'rgba(220,60,60,0.12)',
      text: '#f87171',
      border: 'rgba(220,60,60,0.2)',
    },
    cancelled: {
      bg: 'rgba(255,255,255,0.06)',
      text: 'rgba(255,255,255,0.4)',
      border: 'rgba(255,255,255,0.1)',
    },
  }

  const c = colors[status] ?? colors.pending_approval

  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.04em',
      backgroundColor: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {status.replace('_', ' ')}
    </span>
  )
}

function nights(checkIn: string, checkOut: string) {
  return Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

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
  transition: 'opacity 0.15s',
}

export default function BookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  async function fetchBookings() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  async function updateStatus(id: string, status: string) {
    setActionLoading(id)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
      }
    } finally {
      setActionLoading(null)
    }
  }

  async function deleteBooking(id: string) {
    if (!confirm('Delete this booking permanently?')) return
    setActionLoading(id)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setBookings(prev => prev.filter(b => b.id !== id))
      }
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter)

  const statusCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
        <h1
          className="font-display"
          style={{ fontSize: '32px', fontWeight: 300, color: '#fafaf8', margin: 0 }}
        >
          Bookings
        </h1>
        <button
          onClick={fetchBookings}
          style={{
            ...btnBase,
            backgroundColor: 'rgba(196,149,106,0.15)',
            color: '#c4956a',
          }}
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>
        Manage guest booking requests
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'pending_approval', 'confirmed', 'denied', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              ...btnBase,
              backgroundColor: filter === s ? 'rgba(196,149,106,0.2)' : 'rgba(255,255,255,0.04)',
              color: filter === s ? '#c4956a' : 'rgba(255,255,255,0.5)',
              border: filter === s ? '1px solid rgba(196,149,106,0.3)' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
            {s === 'all' ? ` (${bookings.length})` : statusCounts[s] ? ` (${statusCounts[s]})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '48px 0' }}>
          Loading bookings...
        </p>
      ) : filtered.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            {filter === 'all' ? 'No bookings yet' : `No ${filter.replace('_', ' ')} bookings`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(booking => (
            <div key={booking.id} style={cardStyle}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                flexWrap: 'wrap',
              }}>
                {/* Left: guest info */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 500, color: '#fafaf8' }}>
                      {booking.guest_name}
                    </span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
                    <div>{booking.guest_email}</div>
                    {booking.guest_phone && <div>{booking.guest_phone}</div>}
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ color: '#c4956a' }}>{formatDate(booking.check_in)}</span>
                      {' — '}
                      <span style={{ color: '#c4956a' }}>{formatDate(booking.check_out)}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '8px' }}>
                        ({nights(booking.check_in, booking.check_out)} nights)
                      </span>
                    </div>
                    <div>
                      {booking.num_guests} guest{booking.num_guests !== 1 ? 's' : ''}
                      {booking.num_pets > 0 && `, ${booking.num_pets} pet${booking.num_pets !== 1 ? 's' : ''}`}
                    </div>
                    {booking.guest_message && (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        borderLeft: '2px solid rgba(196,149,106,0.3)',
                        fontStyle: 'italic',
                        color: 'rgba(255,255,255,0.4)',
                      }}>
                        &ldquo;{booking.guest_message}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: financials */}
                <div style={{
                  textAlign: 'right',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.8,
                  minWidth: '140px',
                }}>
                  <div style={{ fontSize: '22px', fontWeight: 300, color: '#c4956a', marginBottom: '4px' }}>
                    ${booking.final_total}
                  </div>
                  <div>Nightly: ${booking.nightly_total}</div>
                  <div>Cleaning: ${booking.cleaning_fee}</div>
                  {booking.pet_fee > 0 && <div>Pet fee: ${booking.pet_fee}</div>}
                  <div style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {booking.payment_method}
                  </div>
                  {booking.deposit_amount > 0 && (
                    <div style={{ color: '#4ade80' }}>
                      Deposit: ${booking.deposit_amount}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                flexWrap: 'wrap',
              }}>
                {booking.status === 'pending_approval' && (
                  <>
                    <button
                      onClick={() => updateStatus(booking.id, 'confirmed')}
                      disabled={actionLoading === booking.id}
                      style={{
                        ...btnBase,
                        backgroundColor: 'rgba(34,197,94,0.15)',
                        color: '#4ade80',
                      }}
                    >
                      <CheckCircle size={13} />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, 'denied')}
                      disabled={actionLoading === booking.id}
                      style={{
                        ...btnBase,
                        backgroundColor: 'rgba(220,60,60,0.12)',
                        color: '#f87171',
                      }}
                    >
                      <XCircle size={13} />
                      Deny
                    </button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(booking.id, 'cancelled')}
                    disabled={actionLoading === booking.id}
                    style={{
                      ...btnBase,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    <XCircle size={13} />
                    Cancel
                  </button>
                )}
                {(booking.status === 'denied' || booking.status === 'cancelled') && (
                  <button
                    onClick={() => updateStatus(booking.id, 'pending_approval')}
                    disabled={actionLoading === booking.id}
                    style={{
                      ...btnBase,
                      backgroundColor: 'rgba(234,179,8,0.12)',
                      color: '#facc15',
                    }}
                  >
                    <RefreshCw size={13} />
                    Reopen
                  </button>
                )}
                <button
                  onClick={() => deleteBooking(booking.id)}
                  disabled={actionLoading === booking.id}
                  style={{
                    ...btnBase,
                    backgroundColor: 'rgba(220,60,60,0.08)',
                    color: '#f87171',
                    marginLeft: 'auto',
                  }}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
