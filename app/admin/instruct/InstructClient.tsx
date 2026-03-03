'use client'

import { useState } from 'react'
import { Plus, ChevronDown, ChevronUp, RefreshCw, Repeat, Zap } from 'lucide-react'

interface Instruction {
  id: string
  content: string
  type: 'directive' | 'one-time'
  is_active: boolean
  expires_at?: string | null
  created_at: string
}

interface Props {
  initialInstructions: Instruction[]
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function TypeBadge({ type }: { type: string }) {
  const isDirective = type === 'directive'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 500,
      backgroundColor: isDirective ? 'rgba(59,130,246,0.12)' : 'rgba(196,149,106,0.12)',
      color: isDirective ? '#60a5fa' : '#c4956a',
      border: `1px solid ${isDirective ? 'rgba(59,130,246,0.2)' : 'rgba(196,149,106,0.2)'}`,
    }}>
      {isDirective ? <Repeat size={10} /> : <Zap size={10} />}
      {isDirective ? 'Ongoing Directive' : 'One-time'}
    </span>
  )
}

export default function InstructClient({ initialInstructions }: Props) {
  const [instructions, setInstructions] = useState<Instruction[]>(initialInstructions)
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState<'directive' | 'one-time'>('directive')
  const [newExpires, setNewExpires] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  const active = instructions.filter(i => i.is_active)
  const inactive = instructions.filter(i => !i.is_active)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newContent.trim()) return
    setSubmitting(true)
    setSubmitError('')

    try {
      const body: Record<string, unknown> = {
        content: newContent.trim(),
        type: newType,
      }
      if (newExpires) body.expires_at = newExpires

      const res = await fetch('/api/admin/instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to create instruction')
      }

      const created: Instruction = await res.json()
      setInstructions(prev => [created, ...prev])
      setNewContent('')
      setNewExpires('')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  async function deactivate(id: string) {
    const prev = instructions
    setInstructions(curr =>
      curr.map(i => i.id === id ? { ...i, is_active: false } : i)
    )
    try {
      const res = await fetch(`/api/admin/instructions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: false }),
      })
      if (!res.ok) throw new Error('Failed')
    } catch {
      setInstructions(prev)
    }
  }

  const typeBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    border: active ? '1px solid rgba(196,149,106,0.4)' : '1px solid rgba(255,255,255,0.08)',
    backgroundColor: active ? 'rgba(196,149,106,0.15)' : 'transparent',
    color: active ? '#c4956a' : 'rgba(255,255,255,0.45)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  })

  return (
    <div>
      <h1
        className="font-display"
        style={{ fontSize: '32px', fontWeight: 300, color: '#fafaf8', margin: '0 0 8px' }}
      >
        Agent Instructions
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '28px' }}>
        Guide the content generation agent with directives and one-time tasks
      </p>

      {/* New Instruction Form */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(196,149,106,0.12)',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '28px',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#fafaf8', margin: '0 0 16px' }}>
          New Instruction
        </h2>

        <form onSubmit={handleSubmit}>
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="e.g., Focus on summer hiking content targeting Texas families this week"
            rows={4}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '7px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(196,149,106,0.2)',
              color: '#fafaf8',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              lineHeight: 1.6,
              marginBottom: '12px',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(196,149,106,0.45)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(196,149,106,0.2)' }}
          />

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Type selector */}
            <div style={{ display: 'flex', gap: '6px', flex: '0 0 auto' }}>
              <button
                type="button"
                onClick={() => setNewType('directive')}
                style={typeBtnStyle(newType === 'directive')}
              >
                <Repeat size={13} />
                Ongoing Directive
              </button>
              <button
                type="button"
                onClick={() => setNewType('one-time')}
                style={typeBtnStyle(newType === 'one-time')}
              >
                <Zap size={13} />
                One-time
              </button>
            </div>

            {/* Expires at */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 0 auto' }}>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                Expires (optional):
              </label>
              <input
                type="date"
                value={newExpires}
                onChange={e => setNewExpires(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(196,149,106,0.2)',
                  color: '#fafaf8',
                  fontSize: '13px',
                  outline: 'none',
                  colorScheme: 'dark',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !newContent.trim()}
              style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 20px',
                borderRadius: '7px',
                fontSize: '14px',
                fontWeight: 500,
                backgroundColor: submitting || !newContent.trim() ? 'rgba(196,149,106,0.4)' : '#c4956a',
                color: '#1a1a2e',
                border: 'none',
                cursor: submitting || !newContent.trim() ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s',
              }}
            >
              <Plus size={14} />
              {submitting ? 'Adding...' : 'Add Instruction'}
            </button>
          </div>

          {submitError && (
            <p style={{ fontSize: '13px', color: '#f87171', marginTop: '10px' }}>
              {submitError}
            </p>
          )}
        </form>
      </div>

      {/* Active Instructions */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '15px',
          fontWeight: 500,
          color: '#fafaf8',
          margin: '0 0 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          Active Instructions
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(196,149,106,0.2)',
            fontSize: '11px',
            fontWeight: 600,
            color: '#c4956a',
          }}>
            {active.length}
          </span>
        </h2>

        {active.length === 0 ? (
          <div style={{
            padding: '32px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '14px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: '10px',
          }}>
            No active instructions. Add one above to guide the agent.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {active.map(instr => (
              <div key={instr.id} style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(196,149,106,0.12)',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#fafaf8',
                    margin: '0 0 10px',
                    lineHeight: 1.6,
                  }}>
                    {instr.content}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <TypeBadge type={instr.type} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                      Added {timeAgo(instr.created_at)}
                    </span>
                    {instr.expires_at && (
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                        Expires {new Date(instr.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deactivate(instr.id)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: 'rgba(220,60,60,0.1)',
                    color: '#f87171',
                    border: '1px solid rgba(220,60,60,0.2)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Deactivate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Instructions (collapsible) */}
      {inactive.length > 0 && (
        <div>
          <button
            onClick={() => setShowInactive(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '14px',
              fontWeight: 500,
              padding: '0 0 14px',
            }}
          >
            {showInactive ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            Inactive ({inactive.length})
          </button>

          {showInactive && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {inactive.map(instr => (
                <div key={instr.id} style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.35)',
                    margin: '0 0 8px',
                    lineHeight: 1.55,
                  }}>
                    {instr.content}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <TypeBadge type={instr.type} />
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
                      {timeAgo(instr.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
