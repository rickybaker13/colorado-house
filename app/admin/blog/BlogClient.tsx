'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Pencil, X } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt?: string
  content?: string
  status: string
  created_at: string
}

interface Props {
  initialPosts: BlogPost[]
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function wordCount(text?: string) {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
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

export default function BlogClient({ initialPosts }: Props) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editExcerpt, setEditExcerpt] = useState('')
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function patchPost(id: string, updates: Record<string, unknown>) {
    const prevPosts = posts
    setPosts(curr =>
      curr.map(p => p.id === id ? { ...p, ...updates } : p)
    )
    try {
      const res = await fetch(`/api/admin/posts/${id}?table=blog_posts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed')
    } catch {
      setPosts(prevPosts)
    }
  }

  function startEdit(post: BlogPost) {
    setEditingId(post.id)
    setEditTitle(post.title ?? '')
    setEditExcerpt(post.excerpt ?? '')
    setEditContent(post.content ?? '')
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(post: BlogPost) {
    setSaving(true)
    await patchPost(post.id, {
      title: editTitle,
      excerpt: editExcerpt,
      content: editContent,
    })
    setSaving(false)
    setEditingId(null)
  }

  function toggleExpand(id: string) {
    if (editingId === id) return
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div>
      <h1
        className="font-display"
        style={{ fontSize: '32px', fontWeight: 300, color: '#fafaf8', margin: '0 0 8px' }}
      >
        Blog Posts
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>
        {posts.length} post{posts.length !== 1 ? 's' : ''} in review
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {posts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 0',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '14px',
          }}>
            No blog posts in review
          </div>
        )}

        {posts.map(post => {
          const isExpanded = expandedId === post.id
          const isEditing = editingId === post.id
          const wc = wordCount(post.content)

          return (
            <div
              key={post.id}
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: isExpanded
                  ? '1px solid rgba(196,149,106,0.3)'
                  : '1px solid rgba(196,149,106,0.12)',
                borderRadius: '10px',
                overflow: 'hidden',
                transition: 'border-color 0.15s',
              }}
            >
              {/* Card Header - always clickable to expand */}
              <div
                onClick={() => !isEditing && toggleExpand(post.id)}
                style={{
                  padding: '16px 20px',
                  cursor: isEditing ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: '#fafaf8',
                      margin: 0,
                      flex: 1,
                      minWidth: 0,
                    }}>
                      {post.title || 'Untitled'}
                    </h3>
                    <StatusBadge status={post.status} />
                  </div>

                  {post.excerpt && (
                    <p style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.5)',
                      margin: '0 0 8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {post.excerpt}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                      {wc.toLocaleString()} words
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                      {timeAgo(post.created_at)}
                    </span>
                  </div>
                </div>

                <div style={{ flexShrink: 0, color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ padding: '16px 20px 20px' }}>
                    {isEditing ? (
                      /* Edit mode */
                      <div>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '5px' }}>
                            Title
                          </label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(196,149,106,0.25)',
                              color: '#fafaf8',
                              fontSize: '14px',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '5px' }}>
                            Excerpt
                          </label>
                          <input
                            type="text"
                            value={editExcerpt}
                            onChange={e => setEditExcerpt(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(196,149,106,0.25)',
                              color: '#fafaf8',
                              fontSize: '13px',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '5px' }}>
                            Content (Markdown)
                          </label>
                          <textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            rows={16}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(196,149,106,0.25)',
                              color: '#fafaf8',
                              fontSize: '13px',
                              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                              resize: 'vertical',
                              outline: 'none',
                              boxSizing: 'border-box',
                              lineHeight: 1.6,
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={cancelEdit}
                            style={{
                              padding: '7px 16px',
                              borderRadius: '6px',
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
                            onClick={() => saveEdit(post)}
                            disabled={saving}
                            style={{
                              padding: '7px 16px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: 500,
                              backgroundColor: saving ? 'rgba(196,149,106,0.5)' : '#c4956a',
                              color: '#1a1a2e',
                              border: 'none',
                              cursor: saving ? 'wait' : 'pointer',
                            }}
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View mode */
                      <div>
                        <pre style={{
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.65)',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                          margin: '0 0 16px',
                          lineHeight: 1.65,
                          maxHeight: '400px',
                          overflow: 'auto',
                          padding: '12px',
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                          {post.content || '(no content)'}
                        </pre>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => patchPost(post.id, { status: 'approved' })}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '7px 14px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: 500,
                              backgroundColor: 'rgba(34,197,94,0.1)',
                              color: '#4ade80',
                              border: '1px solid rgba(34,197,94,0.2)',
                              cursor: 'pointer',
                            }}
                          >
                            <CheckCircle size={13} />
                            Approve
                          </button>
                          <button
                            onClick={() => patchPost(post.id, { status: 'rejected' })}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '7px 14px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: 500,
                              backgroundColor: 'rgba(220,60,60,0.1)',
                              color: '#f87171',
                              border: '1px solid rgba(220,60,60,0.2)',
                              cursor: 'pointer',
                            }}
                          >
                            <XCircle size={13} />
                            Reject
                          </button>
                          <button
                            onClick={() => startEdit(post)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '7px 14px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: 500,
                              backgroundColor: 'transparent',
                              color: '#c4956a',
                              border: '1px solid rgba(196,149,106,0.35)',
                              cursor: 'pointer',
                            }}
                          >
                            <Pencil size={13} />
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
