'use client'

import { useState, useMemo } from 'react'
import { Instagram, Twitter, CheckCircle, XCircle, Pencil, X, ImageIcon, Search, Upload } from 'lucide-react'

interface SocialPost {
  id: string
  platform: string
  content: string
  hashtags?: string
  content_theme?: string
  image_filename?: string
  image_url?: string
  status: string
  created_at: string
}

interface Props {
  initialPosts: SocialPost[]
}

const IMAGE_LIBRARY: Record<string, string[]> = {
  'Mountain Views': [
    'hero-mountain.jpg', 'alpenglow-sunset.jpg', 'engineer-mountain.jpg',
    'alpine-valley.jpg', 'views-1.jpg', 'views-2.jpg',
  ],
  'Exterior': [
    'exterior-1.jpg', 'exterior-2.jpg', 'exterior-3.jpg', 'hero-front-page.jpg',
  ],
  'Lakes & Water': [
    'ice-lake-basin-wide.jpg', 'ice-lake-closeup.jpg', 'ice-lake-panoramic.jpg',
    'ice-lake-shore.jpg', 'upper-ice-lake.jpg', 'island-lake-panoramic.jpg',
    'columbine-lake.jpg', 'bullion-king-lake.jpg', 'kayak-mountain-lake.jpg',
  ],
  'Wildflowers & Nature': [
    'wildflower-meadow-peaks.jpg', 'wildflowers-pass.jpg', 'sunflowers-mountain-valley.jpg',
  ],
  'Trails & Hiking': [
    'ice-lakes-trail.jpg', 'ice-lakes-trail-alpine.jpg', 'waterfall.jpg', 'waterfall-gorge.jpg',
  ],
  'Interior': [
    'living-room-1.jpg', 'living-room-2.jpg', 'kitchen-1.jpg', 'kitchen-2.jpg',
    'kitchen-3.jpg', 'bedroom-master-1.jpg', 'bedroom-guest-1.jpg', 'bedroom-guest-2.jpg',
    'bathroom-1.jpg', 'bathroom-2.jpg', 'dining-1.jpg', 'detail-1.jpg',
    'detail-2.jpg', 'detail-3.jpg', 'laundry.jpg',
    'file_35---8442826e-0583-4f7c-8519-ddf80feb638a.jpg',
    'file_36---0040c3ea-93a5-4919-8017-c6349fa8f70d.jpg',
    'file_37---99ef673a-f1cd-450c-8e00-2fac70252c2c.jpg',
    'file_38---159a7a4b-5b0e-4282-8223-ef152a20542c.jpg',
    'file_39---83886c87-e830-474b-bcc7-f810d9e19bf2.jpg',
    'file_40---2402f62f-b03c-4a90-892d-2689435e9ac4.jpg',
    'file_41---abcefd98-23fb-43a9-91a3-e43ed9b30e63.jpg',
    'file_42---4c9e886f-4807-486a-acf3-5e0d1c74b5da.jpg',
    'file_43---5eae66d5-bfbe-41da-a496-c720416e2eed.jpg',
  ],
  'Durango & Attractions': [
    'durango-downtown-main.jpg', 'durango-downtown-winter.jpg',
    'mesa-verde-cliff-dwelling.jpg', 'mesa-verde-cliff-palace.jpg',
  ],
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
    instagram: { label: 'Instagram', color: '#e1306c', bg: 'rgba(225,48,108,0.12)', icon: <Instagram size={12} /> },
    facebook: { label: 'Facebook', color: '#1877F2', bg: 'rgba(24,119,242,0.12)', icon: <span style={{ fontSize: '12px', fontWeight: 700 }}>f</span> },
    pinterest: { label: 'Pinterest', color: '#E60023', bg: 'rgba(230,0,35,0.12)', icon: <span style={{ fontSize: '12px', fontWeight: 700 }}>P</span> },
    x: { label: 'X', color: '#ffffff', bg: 'rgba(255,255,255,0.08)', icon: <Twitter size={12} /> },
    twitter: { label: 'X', color: '#ffffff', bg: 'rgba(255,255,255,0.08)', icon: <Twitter size={12} /> },
  }
  const cfg = configs[p] ?? { label: platform ?? 'Unknown', color: '#c4956a', bg: 'rgba(196,149,106,0.12)' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 500, color: cfg.color, backgroundColor: cfg.bg }}>
      {cfg.icon}{cfg.label}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, React.CSSProperties> = {
    draft: { backgroundColor: 'rgba(196,149,106,0.15)', color: '#c4956a', border: '1px solid rgba(196,149,106,0.25)' },
    approved: { backgroundColor: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' },
  }
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, textTransform: 'capitalize', ...(styles[status] ?? styles.draft) }}>
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
  const [editImage, setEditImage] = useState('')
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [editImageUrl, setEditImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [imageTab, setImageTab] = useState<'library' | 'pexels' | 'upload'>('library')
  const [pexelsQuery, setPexelsQuery] = useState('')
  const [pexelsResults, setPexelsResults] = useState<Array<{ id: number; alt: string; photographer: string; src: { medium: string; large2x: string } }>>([])
  const [pexelsLoading, setPexelsLoading] = useState(false)
  const [pexelsError, setPexelsError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchPlatform = platformFilter === 'All' || p.platform?.toLowerCase() === platformFilter.toLowerCase() || (platformFilter === 'X' && p.platform?.toLowerCase() === 'twitter')
      const matchStatus = statusFilter === 'All' || p.status === statusFilter
      return matchPlatform && matchStatus
    })
  }, [posts, platformFilter, statusFilter])

  async function patchPost(id: string, updates: Record<string, unknown>) {
    const prevPosts = posts
    setPosts(curr => curr.map(p => p.id === id ? { ...p, ...updates } : p))
    try {
      const res = await fetch(`/api/admin/posts/${id}?table=social_posts`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) })
      if (!res.ok) throw new Error('Failed')
    } catch { setPosts(prevPosts) }
  }

  function toggleSelect(id: string) {
    setSelected(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next })
  }

  function openEdit(post: SocialPost) {
    setEditingId(post.id)
    setEditContent(post.content ?? '')
    setEditHashtags(post.hashtags ?? '')
    setEditImage(post.image_filename ?? '')
    setShowImagePicker(false)
    setEditImageUrl(post.image_url ?? '')
    setImageTab('library')
    setPexelsQuery('')
    setPexelsResults([])
    setPexelsError('')
    setUploadError('')
    setShowUrlInput(false)
  }

  async function saveEdit() {
    if (!editingId) return
    setSaving(true)
    await patchPost(editingId, { content: editContent, hashtags: editHashtags, image_filename: editImage, image_url: editImageUrl || undefined })
    setSaving(false)
    setEditingId(null)
  }

  async function bulkAction(status: string) {
    const ids = Array.from(selected)
    await Promise.all(ids.map(id => patchPost(id, { status })))
    setSelected(new Set())
  }

  async function searchPexels() {
    if (!pexelsQuery.trim()) return
    setPexelsLoading(true)
    setPexelsError('')
    try {
      const res = await fetch(`/api/admin/images/search?q=${encodeURIComponent(pexelsQuery)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setPexelsResults(data.photos || [])
    } catch {
      setPexelsError('Failed to search Pexels. Check API key configuration.')
    } finally {
      setPexelsLoading(false)
    }
  }

  function selectPexelsImage(photo: typeof pexelsResults[0]) {
    setEditImageUrl(photo.src.large2x)
    setEditImage('')
    setShowImagePicker(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/images/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }
      const data = await res.json()
      setEditImageUrl(data.url)
      setEditImage('')
      setShowImagePicker(false)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
    border: active ? '1px solid rgba(196,149,106,0.4)' : '1px solid rgba(255,255,255,0.08)',
    backgroundColor: active ? 'rgba(196,149,106,0.15)' : 'transparent',
    color: active ? '#c4956a' : 'rgba(255,255,255,0.45)', cursor: 'pointer', transition: 'all 0.15s',
  })

  const actionBtn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
    padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
  }

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: '32px', fontWeight: 300, color: '#fafaf8', margin: '0 0 8px' }}>Social Queue</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>{filtered.length} post{filtered.length !== 1 ? 's' : ''} pending</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {PLATFORMS.map(p => (<button key={p} style={tabBtnStyle(platformFilter === p)} onClick={() => setPlatformFilter(p)}>{p}</button>))}
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        <div style={{ display: 'flex', gap: '4px' }}>
          {STATUSES.map(s => (<button key={s} style={tabBtnStyle(statusFilter === s)} onClick={() => setStatusFilter(s)}>{s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</button>))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: selected.size > 0 ? '80px' : '0' }} className="queue-grid">
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>No posts match the current filters</div>
        )}

        {filtered.map(post => (
          <div key={post.id} style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: selected.has(post.id) ? '1px solid rgba(196,149,106,0.45)' : '1px solid rgba(196,149,106,0.12)',
            borderRadius: '10px', padding: '16px', position: 'relative', transition: 'border-color 0.15s',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0,
          }}>
            <input type="checkbox" checked={selected.has(post.id)} onChange={() => toggleSelect(post.id)}
              style={{ position: 'absolute', top: '14px', right: '14px', accentColor: '#c4956a', width: '15px', height: '15px', cursor: 'pointer' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingRight: '24px' }}>
              <PlatformBadge platform={post.platform} />
              <StatusBadge status={post.status} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {(post.image_filename || post.image_url) && (
                <img src={post.image_url || `/images/${post.image_filename}`} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.05)' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', margin: '0 0 8px', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.content}</p>
                {post.hashtags && (<p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.hashtags}</p>)}
                {post.content_theme && (<span style={{ display: 'inline-block', padding: '1px 7px', borderRadius: '4px', fontSize: '11px', backgroundColor: 'rgba(196,149,106,0.08)', color: 'rgba(196,149,106,0.7)', border: '1px solid rgba(196,149,106,0.15)', marginBottom: '6px' }}>{post.content_theme}</span>)}
              </div>
            </div>

            {/* Action buttons - always visible */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{timeAgo(post.created_at)}</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button onClick={() => patchPost(post.id, { status: 'approved' })} title="Approve"
                  style={{ ...actionBtn, backgroundColor: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle size={12} /> Approve
                </button>
                <button onClick={() => patchPost(post.id, { status: 'rejected' })} title="Reject"
                  style={{ ...actionBtn, backgroundColor: 'rgba(220,60,60,0.1)', color: '#f87171', border: '1px solid rgba(220,60,60,0.2)' }}>
                  <XCircle size={12} /> Reject
                </button>
                <button onClick={() => openEdit(post)} title="Edit"
                  style={{ ...actionBtn, backgroundColor: 'transparent', color: '#c4956a', border: '1px solid rgba(196,149,106,0.35)' }}>
                  <Pencil size={12} /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 50, display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', backgroundColor: '#0f0f1a', border: '1px solid rgba(196,149,106,0.3)', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{selected.size} selected</span>
          <button onClick={() => bulkAction('approved')} style={{ padding: '7px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, backgroundColor: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)', cursor: 'pointer' }}>Approve All</button>
          <button onClick={() => bulkAction('rejected')} style={{ padding: '7px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, backgroundColor: 'rgba(220,60,60,0.1)', color: '#f87171', border: '1px solid rgba(220,60,60,0.25)', cursor: 'pointer' }}>Reject All</button>
          <button onClick={() => setSelected(new Set())} style={{ display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}><X size={16} /></button>
        </div>
      )}

      {/* Edit Modal with Image Picker */}
      {editingId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={() => setEditingId(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: showImagePicker ? '800px' : '560px', maxHeight: '90vh', overflow: 'auto', backgroundColor: '#14142a', border: '1px solid rgba(196,149,106,0.2)', borderRadius: '12px', padding: '24px', transition: 'max-width 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#fafaf8', margin: 0 }}>Edit Post</h3>
              <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}><X size={18} /></button>
            </div>

            {/* Image selector */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {(editImage || editImageUrl) && (<img src={editImageUrl || `/images/${editImage}`} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.05)' }} />)}
                <div>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{editImageUrl ? 'External image' : editImage || 'No image'}</p>
                  <button onClick={() => setShowImagePicker(!showImagePicker)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, backgroundColor: 'rgba(196,149,106,0.1)', color: '#c4956a', border: '1px solid rgba(196,149,106,0.3)', cursor: 'pointer' }}>
                    <ImageIcon size={12} /> {showImagePicker ? 'Hide' : 'Change Image'}
                  </button>
                </div>
              </div>

              {showImagePicker && (
                <div style={{ marginTop: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  {/* Tab bar */}
                  <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {([['library', 'Library', ImageIcon], ['pexels', 'Pexels', Search], ['upload', 'Upload', Upload]] as const).map(([tab, label, Icon]) => (
                      <button key={tab} onClick={() => setImageTab(tab as 'library' | 'pexels' | 'upload')}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 12px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', background: 'none', border: 'none', borderBottom: imageTab === tab ? '2px solid #c4956a' : '2px solid transparent', color: imageTab === tab ? '#c4956a' : 'rgba(255,255,255,0.4)' }}>
                        <Icon size={13} /> {label}
                      </button>
                    ))}
                  </div>

                  {/* Library tab */}
                  {imageTab === 'library' && (
                    <div style={{ padding: '12px', maxHeight: '280px', overflow: 'auto' }}>
                      {Object.entries(IMAGE_LIBRARY).map(([category, images]) => (
                        <div key={category} style={{ marginBottom: '12px' }}>
                          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>{category}</p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: '6px' }}>
                            {images.map(img => (
                              <img key={img} src={`/images/${img}`} alt={img} title={img}
                                onClick={() => { setEditImage(img); setEditImageUrl(''); setShowImagePicker(false) }}
                                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '5px', cursor: 'pointer', border: editImage === img ? '2px solid #c4956a' : '2px solid transparent', opacity: editImage === img ? 1 : 0.7, transition: 'all 0.15s' }} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pexels search tab */}
                  {imageTab === 'pexels' && (
                    <div style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input type="text" value={pexelsQuery} onChange={e => setPexelsQuery(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && searchPexels()}
                          placeholder="Search Pexels (e.g. mountain winter snow)"
                          style={{ flex: 1, padding: '8px 12px', borderRadius: '7px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,149,106,0.25)', color: '#fafaf8', fontSize: '13px', outline: 'none' }} />
                        <button onClick={searchPexels} disabled={pexelsLoading}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: 500, backgroundColor: '#c4956a', color: '#1a1a2e', border: 'none', cursor: pexelsLoading ? 'wait' : 'pointer', opacity: pexelsLoading ? 0.6 : 1 }}>
                          <Search size={13} /> {pexelsLoading ? 'Searching...' : 'Search'}
                        </button>
                      </div>
                      {pexelsError && <p style={{ fontSize: '12px', color: '#f87171', margin: '0 0 8px' }}>{pexelsError}</p>}
                      {pexelsResults.length > 0 && (
                        <div style={{ maxHeight: '260px', overflow: 'auto' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                            {pexelsResults.map(photo => (
                              <div key={photo.id} onClick={() => selectPexelsImage(photo)}
                                style={{ cursor: 'pointer', borderRadius: '6px', overflow: 'hidden', border: editImageUrl === photo.src.large2x ? '2px solid #c4956a' : '2px solid transparent', transition: 'all 0.15s' }}>
                                <img src={photo.src.medium} alt={photo.alt} style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block' }} />
                                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', padding: '4px 6px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  Photo by {photo.photographer}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {pexelsResults.length === 0 && !pexelsLoading && !pexelsError && (
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '24px 0' }}>
                          Search for free stock photos from Pexels
                        </p>
                      )}
                    </div>
                  )}

                  {/* Upload tab */}
                  {imageTab === 'upload' && (
                    <div style={{ padding: '12px' }}>
                      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '32px 16px', borderRadius: '8px', border: '2px dashed rgba(196,149,106,0.3)', cursor: uploading ? 'wait' : 'pointer', transition: 'all 0.15s', backgroundColor: 'rgba(196,149,106,0.04)' }}>
                        <Upload size={24} style={{ color: 'rgba(196,149,106,0.5)' }} />
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                          {uploading ? 'Uploading...' : 'Click to choose a photo'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>JPEG, PNG, WebP, GIF up to 4 MB</span>
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileUpload}
                          disabled={uploading} style={{ display: 'none' }} />
                      </label>
                      {uploadError && <p style={{ fontSize: '12px', color: '#f87171', margin: '8px 0 0' }}>{uploadError}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '14px' }}>
              <button onClick={() => setShowUrlInput(!showUrlInput)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: showUrlInput ? '6px' : 0 }}>
                {showUrlInput ? '▾' : '▸'} Paste URL manually
              </button>
              {showUrlInput && (
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={e => { setEditImageUrl(e.target.value); if (e.target.value) setEditImage('') }}
                  placeholder="https://images.pexels.com/..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,149,106,0.25)', color: '#fafaf8', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              )}
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Content</label>
              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={6}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '7px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,149,106,0.25)', color: '#fafaf8', fontSize: '13px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.55 }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Hashtags</label>
              <input type="text" value={editHashtags} onChange={e => setEditHashtags(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,149,106,0.25)', color: '#fafaf8', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingId(null)} style={{ padding: '8px 18px', borderRadius: '7px', fontSize: '13px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveEdit} disabled={saving}
                style={{ padding: '8px 18px', borderRadius: '7px', fontSize: '13px', fontWeight: 500, backgroundColor: saving ? 'rgba(196,149,106,0.5)' : '#c4956a', color: '#1a1a2e', border: 'none', cursor: saving ? 'wait' : 'pointer' }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .queue-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
