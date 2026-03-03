'use client'

import { useState, useMemo } from 'react'
import { Instagram, Twitter, CheckCircle, XCircle, Pencil, X } from 'lucide-react'

interface SocialPost {
  id: string
  platform: string
  content: string
  hashtags?: string
  theme?: string
  image_filename?: string
  status: string
  created_at: string
}

interface Props {
  initialPosts: SocialPost[]
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function PlatformBadge({ platform }: { platform: string }) {
  const p = platform?.toLowerCase()

  const configs: Record<string, { label: string; color: string; bg: string; icon?: React.ReactNode }> = {
    instagram: {
      label: 'Instagram',
      color: '#e1306c',
      bg: 'rgba(225,48,108,0.12)',
      icon: <Instagram size={12} />,
    },
    facebook: {
      label: 'Facebook',
      color: '#1877F2',
      bg: 'rgba(24,119,242,0.12)',
      icon: <span style={{ fontSize: '12px', fontWeight: 700 }}>f</span>,
    },
    pinterest: {
      label: 'Pinterest',
      color: '#E60023',
      bg: 'rgba(230,0,35,0.12)',
      icon: <span style={{ fontSize: '12px', fontWeight: 700 }}>P</span>,
    },
    x: {
      label: 'X',
      color: '#ffffff',
      bg: 'rgba(255,255,255,0.08)',
      icon: <Twitter size={12} />,
    },
    twitter: {
      label: 'X',
      color: '#ffffff',
      bg: 'rgba(255,255,255,0.08)',
      icon: <Twitter size={12} />,
    },
  }

  const cfg = configs[p] ?? {
    label: platform ?? 'Unknown',
    color: '#c4956a',
    bg: 'rgba(196,149,106,0.12)',
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 8px',
      borderRadius: '5px',
      fontSize: '11px',
      fontWeight: 500,
      color: cfg.color,
      backgroundColor: cfg.bg,
    }}>
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, React.CSSProperties> = {
    draft: {
      backgroundColor: 'rgba(196,149,106,0.15)',
      color: '#c4956a',
      border: '1px solid rgba(196,149,106,0.25)',
    },
    approved: {
      backgroundColor: 'rgba(34,197,94,0.12)',
      color: '#4ade80',
      border: '1px solid rgba(34,197,94,0.2)',
    },
  }
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 500,
      textTransform: 'capitalize',
      ...(styles[status] ?? styles.draft),
    }}>
      {status}
    </span>
  )
}

const PLATFORMS = ['All', 'Instagram', 'Facebook', 'Pinterest', 'X']
const STATUSES = ['All', 'draft', 'approved']

export default function QueueClient({ initialPosts }: Props) {
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts)
  const [platformFilter, setPlatformFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editHashtags, setEditHashtags] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchPlatform =
        platformFilter === 'All' ||
        p.platform?.toLowerCase() === platformFilter.toLowerCase() ||
        (platformFilter === 'X' && p.platform?.toLowerCase() === 'twitter')
      const matchStatus =
        statusFilter === 'All' || p.status === statusFilter
      return matchPlatform && matchStatus
    })
  }, [posts, platformFilter, statusFilter])

  async function patchPost(id: string, updates: Record<string, unknown>) {
    const prevPosts = posts
    setPosts(curr =>
      curr.map(p => p.id === id ? { ...p, ...updates } : p)
    )
    try {
      const res = await fetch(`/api/admin/posts/${id}?table=social_posts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed')
    } catch {
      setPosts(prevPosts)
    }
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function openEdit(post: SocialPost) {
    setEditingId(post.id)
    setEditContent(post.content ?? '')
    setEditHashtags(post.hashtags ?? '')
  }

  async function saveEdit() {
    if (!editingId) return
    setSaving(true)
    await patchPost(editingId, { content: editContent, hashtags: editHashtags })
    setSaving(false)
    setEditingId(null)
  }

  async function bulkAction(status: string) {
    const ids = Array.from(selected)
    await Promise.all(ids.map(id => patchPost(id, { status })))
    setSelected(new Set())
  }

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    border: active ? '1px solid rgba(196,149,106,0.4)' : '1px solid rgba(255,255,255,0.08)',
    backgroundColor: active ? 'rgba(196,149,106,0.15)' : 'transparent',
    color: active ? '#c4956a' : 'rgba(255,255,255,0.45)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  })

  return (
    <div>
      <h1
        className="font-display"
        style={{ fontSize: '32px', fontWeight: 300, color: '#fafaf8', margin: '0 0 8px' }}
      >
        Social Queue
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>
        {filtered.length} post{filtered.length !== 1 ? 's' : ''} pending
      </p>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '24px',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {PLATFORMS.map(p => (
            <button key={p} style={tabBtnStyle(platformFilter === p)} onClick={() => setPlatformFilter(p)}>
              {p}
            </button>
          ))}
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        <div style={{ display: 'flex', gap: '4px' }}>
          {STATUSES.map(s => (
            <button key={s} style={tabBtnStyle(statusFilter === s)} onClick={() => setStatusFilter(s)}>
              {s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: selected.size > 0 ? '80px' : '0',
      }}
        className="queue-grid"
      >
        {filtered.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 0',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '14px',
          }}>
            No posts match the current filters
          </div>
        )}

        {filtered.map(post => (
          <div key={post.id} style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: selected.has(post.id)
              ? '1px solid rgba(196,149,106,0.45)'
              : '1px solid rgba(196,149,106,0.12)',
            borderRadius: '10px',
            padding: '16px',
            position: 'relative',
            transition: 'border-color 0.15s',
          }}>
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selected.has(post.id)}
              onChange={() => toggleSelect(post.id)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                accentColor: '#c4956a',
                width: '15px',
                height: '15px',
                cursor: 'pointer',
              }}
            />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingRight: '24px' }}>
              <PlatformBadge platform={post.platform} />
              <StatusBadge status={post.status} />
            </div>

            {/* Body */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Image thumbnail */}
              {post.image_filename && (
                <img
                  src={`/images/${post.image_filename}`}
                  alt=""
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    flexShrink: 0,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }}
                />
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Content preview */}
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.75)',
                  margin: '0 0 8px',
                  lineHeight: 1.55,
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {post.content}
                </p>

                {/* Hashtags */}
                {post.hashtags && (
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.35)',
                    margin: '0 0 6px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {post.hashtags}
                  </p>
                )}

                {/* Theme */}
                {post.theme && (
                  <span style={{
                    display: 'inline-block',
                    padding: '1px 7px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    backgroundColor: 'rgba(196,149,106,0.08)',
                    color: 'rgba(196,149,106,0.7)',
                    border: '1px solid rgba(196,149,106,0.15)',
                    marginBottom: '6px',
                  }}>
                    {post.theme}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                {timeAgo(post.created_at)}
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => patchPost(post.id, { status: 'approved' })}
                  title="Approve"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    color: '#4ade80',
                    border: '1px solid rgba(34,197,94,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  <CheckCircle size={12} />
                  Approve
                </button>
                <button
                  onClick={() => patchPost(post.id, { status: 'rejected' })}
                  title="Reject"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: 'rgba(220,60,60,0.1)',
                    color: '#f87171',
                    border: '1px solid rgba(220,60,60,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  <XCircle size={12} />
                  Reject
                </button>
                <button
                  onClick={() => openEdit(post)}
                  title="Edit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: 'transparent',
                    color: '#c4956a',
                    border: '1px solid rgba(196,149,106,0.35)',
                    cursor: 'pointer',
                  }}
                >
                  <Pencil size={12} />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          backgroundColor: '#0f0f1a',
          border: '1px solid rgba(196,149,106,0.3)',
          borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            {selected.size} selected
          </span>
          <button
            onClick={() => bulkAction('approved')}
            style={{
              padding: '7px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'rgba(34,197,94,0.1)',
              color: '#4ade80',
              border: '1px solid rgba(34,197,94,0.25)',
              cursor: 'pointer',
            }}
          >
            Approve All
          </button>
          <button
            onClick={() => bulkAction('rejected')}
            style={{
              padding: '7px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'rgba(220,60,60,0.1)',
              color: '#f87171',
              border: '1px solid rgba(220,60,60,0.25)',
              cursor: 'pointer',
            }}
          >
            Reject All
          </button>
          <button
            onClick={() => setSelected(new Set())}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div
            onClick={() => setEditingId(null)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}
          />
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '560px',
            backgroundColor: '#14142a',
            border: '1px solid rgba(196,149,106,0.2)',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#fafaf8', margin: 0 }}>
                Edit Post
              </h3>
              <button
                onClick={() => setEditingId(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                Content
              </label>
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={6}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '7px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(196,149,106,0.25)',
                  color: '#fafaf8',
                  fontSize: '13px',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                  lineHeight: 1.55,
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                Hashtags
              </label>
              <input
                type="text"
                value={editHashtags}
                onChange={e => setEditHashtags(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '7px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(196,149,106,0.25)',
                  color: '#fafaf8',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditingId(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '7px',
                  fontSize: '13px',
                  backgroundColor: 'transparent',
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                style={{
                  padding: '8px 18px',
                  borderRadius: '7px',
                  fontSize: '13px',
                  fontWeight: 500,
                  backgroundColor: saving ? 'rgba(196,149,106,0.5)' : '#c4956a',
                  color: '#1a1a2e',
                  border: 'none',
                  cursor: saving ? 'wait' : 'pointer',
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .queue-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
