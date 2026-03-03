'use client'

import { useState, useRef } from 'react'
import { Instagram, Twitter } from 'lucide-react'

interface SocialPost {
  id: string
  platform: string
  content: string
  published_at: string | null
  ayrshare_id?: string | null
  performance_notes?: string | null
}

interface BlogPost {
  id: string
  title: string
  content?: string
  published_at: string | null
}

interface Props {
  socialPosts: SocialPost[]
  blogPosts: BlogPost[]
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function wordCount(text?: string) {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

function PlatformBadge({ platform }: { platform: string }) {
  const p = platform?.toLowerCase()

  if (p === 'instagram') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 7px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 500,
        backgroundColor: 'rgba(225,48,108,0.12)',
        color: '#e1306c',
      }}>
        <Instagram size={10} />
        Instagram
      </span>
    )
  }
  if (p === 'facebook') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 7px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 500,
        backgroundColor: 'rgba(24,119,242,0.12)',
        color: '#1877F2',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 700, lineHeight: 1 }}>f</span>
        Facebook
      </span>
    )
  }
  if (p === 'pinterest') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 7px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 500,
        backgroundColor: 'rgba(230,0,35,0.12)',
        color: '#E60023',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 700, lineHeight: 1 }}>P</span>
        Pinterest
      </span>
    )
  }
  if (p === 'x' || p === 'twitter') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 7px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 500,
        backgroundColor: 'rgba(255,255,255,0.08)',
        color: '#ffffff',
      }}>
        <Twitter size={10} />
        X
      </span>
    )
  }
  return (
    <span style={{
      display: 'inline-flex',
      padding: '2px 7px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 500,
      backgroundColor: 'rgba(196,149,106,0.12)',
      color: '#c4956a',
    }}>
      {platform}
    </span>
  )
}

function PerformanceNotesCell({
  postId,
  initialValue,
}: {
  postId: string
  initialValue: string | null
}) {
  const [value, setValue] = useState(initialValue ?? '')
  const [saving, setSaving] = useState(false)
  const savedRef = useRef(initialValue ?? '')

  async function handleBlur() {
    if (value === savedRef.current) return
    setSaving(true)
    try {
      await fetch(`/api/admin/posts/${postId}?table=social_posts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ performance_notes: value }),
      })
      savedRef.current = value
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }

  return (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={handleBlur}
      placeholder="Add notes..."
      style={{
        width: '100%',
        padding: '4px 8px',
        borderRadius: '5px',
        backgroundColor: saving ? 'rgba(196,149,106,0.08)' : 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        color: value ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.25)',
        fontSize: '12px',
        outline: 'none',
        transition: 'border-color 0.15s, background-color 0.15s',
        boxSizing: 'border-box',
      }}
      onFocus={e => { e.target.style.borderColor = 'rgba(196,149,106,0.3)' }}
    />
  )
}

export default function HistoryClient({ socialPosts, blogPosts }: Props) {
  const [activeTab, setActiveTab] = useState<'social' | 'blog'>('social')

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 20px',
    borderRadius: '7px',
    fontSize: '14px',
    fontWeight: 500,
    border: active ? '1px solid rgba(196,149,106,0.4)' : '1px solid transparent',
    backgroundColor: active ? 'rgba(196,149,106,0.12)' : 'transparent',
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
        Published History
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>
        Archive of all published content
      </p>

      {/* Tab Bar */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '24px',
        padding: '4px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '9px',
        border: '1px solid rgba(255,255,255,0.06)',
        width: 'fit-content',
      }}>
        <button style={tabStyle(activeTab === 'social')} onClick={() => setActiveTab('social')}>
          Social Posts ({socialPosts.length})
        </button>
        <button style={tabStyle(activeTab === 'blog')} onClick={() => setActiveTab('blog')}>
          Blog Posts ({blogPosts.length})
        </button>
      </div>

      {/* Social Posts Tab */}
      {activeTab === 'social' && (
        <div>
          {socialPosts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '14px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.08)',
              borderRadius: '10px',
            }}>
              No published social posts yet
            </div>
          ) : (
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(196,149,106,0.12)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 130px 160px 200px',
                gap: '0',
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                backgroundColor: 'rgba(0,0,0,0.15)',
              }}
                className="history-table-header"
              >
                {['Platform', 'Content', 'Published', 'Ayrshare ID', 'Performance Notes'].map(col => (
                  <span key={col} style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>
                    {col}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {socialPosts.map((post, i) => (
                <div
                  key={post.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 130px 160px 200px',
                    gap: '0',
                    padding: '12px 16px',
                    alignItems: 'center',
                    borderBottom: i < socialPosts.length - 1
                      ? '1px solid rgba(255,255,255,0.04)'
                      : 'none',
                  }}
                  className="history-table-row"
                >
                  <div>
                    <PlatformBadge platform={post.platform} />
                  </div>
                  <div style={{
                    paddingRight: '12px',
                    overflow: 'hidden',
                  }}>
                    <p style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.65)',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {post.content?.slice(0, 100) ?? ''}
                      {(post.content?.length ?? 0) > 100 ? '…' : ''}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                      {formatDate(post.published_at)}
                    </span>
                  </div>
                  <div style={{ paddingRight: '12px' }}>
                    {post.ayrshare_id ? (
                      <span style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.25)',
                        fontFamily: 'ui-monospace, monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                      }}>
                        {post.ayrshare_id}
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>—</span>
                    )}
                  </div>
                  <div>
                    <PerformanceNotesCell
                      postId={post.id}
                      initialValue={post.performance_notes ?? null}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blog Posts Tab */}
      {activeTab === 'blog' && (
        <div>
          {blogPosts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '14px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.08)',
              borderRadius: '10px',
            }}>
              No published blog posts yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {blogPosts.map(post => (
                <div key={post.id} style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(196,149,106,0.12)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: '#fafaf8',
                      margin: '0 0 4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {post.title || 'Untitled'}
                    </h3>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                      {wordCount(post.content).toLocaleString()} words
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                      {formatDate(post.published_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .history-table-header,
          .history-table-row {
            grid-template-columns: 100px 1fr 110px !important;
          }
          .history-table-header > span:nth-child(4),
          .history-table-header > span:nth-child(5),
          .history-table-row > div:nth-child(4),
          .history-table-row > div:nth-child(5) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
