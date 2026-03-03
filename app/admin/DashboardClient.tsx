'use client'

import { Clock, TrendingUp, FileText, Instagram, Twitter } from 'lucide-react'

interface RecentPost {
  id: string
  platform: string
  content: string
  status: string
  created_at: string
}

interface Props {
  draftSocialCount: number
  publishedThisWeekCount: number
  draftBlogCount: number
  recentPosts: RecentPost[]
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function PlatformIcon({ platform }: { platform: string }) {
  const p = platform?.toLowerCase()
  if (p === 'instagram') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        backgroundColor: 'rgba(225,48,108,0.15)',
        flexShrink: 0,
      }}>
        <Instagram size={14} style={{ color: '#e1306c' }} />
      </span>
    )
  }
  if (p === 'facebook') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        backgroundColor: 'rgba(24,119,242,0.15)',
        flexShrink: 0,
        fontSize: '13px',
        fontWeight: 700,
        color: '#1877F2',
      }}>
        f
      </span>
    )
  }
  if (p === 'pinterest') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        backgroundColor: 'rgba(230,0,35,0.15)',
        flexShrink: 0,
        fontSize: '13px',
        fontWeight: 700,
        color: '#E60023',
      }}>
        P
      </span>
    )
  }
  if (p === 'x' || p === 'twitter') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        backgroundColor: 'rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <Twitter size={13} style={{ color: '#ffffff' }} />
      </span>
    )
  }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      borderRadius: '6px',
      backgroundColor: 'rgba(196,149,106,0.15)',
      flexShrink: 0,
      fontSize: '12px',
      fontWeight: 600,
      color: '#c4956a',
    }}>
      {platform?.charAt(0)?.toUpperCase() ?? '?'}
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
    published: {
      backgroundColor: 'rgba(59,130,246,0.12)',
      color: '#60a5fa',
      border: '1px solid rgba(59,130,246,0.2)',
    },
    rejected: {
      backgroundColor: 'rgba(220,60,60,0.12)',
      color: '#f87171',
      border: '1px solid rgba(220,60,60,0.2)',
    },
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.04em',
      textTransform: 'capitalize',
      ...(styles[status] ?? styles.draft),
    }}>
      {status}
    </span>
  )
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(196,149,106,0.12)',
  borderRadius: '10px',
  padding: '20px',
}

export default function DashboardClient({
  draftSocialCount,
  publishedThisWeekCount,
  draftBlogCount,
  recentPosts,
}: Props) {
  return (
    <div>
      <h1
        className="font-display"
        style={{ fontSize: '32px', fontWeight: 300, color: '#fafaf8', margin: '0 0 8px' }}
      >
        Dashboard
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>
        Overview of your content pipeline
      </p>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '32px',
      }}
        className="stat-grid"
      >
        {/* Pending Review */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', margin: '0 0 10px' }}>
                Pending Review
              </p>
              <p style={{ fontSize: '42px', fontWeight: 300, color: '#c4956a', margin: '0 0 4px', lineHeight: 1 }}>
                {draftSocialCount}
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                social drafts awaiting review
              </p>
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(196,149,106,0.1)',
            }}>
              <Clock size={18} style={{ color: '#c4956a' }} />
            </span>
          </div>
        </div>

        {/* Published This Week */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>
                Published This Week
              </p>
              <p style={{ fontSize: '42px', fontWeight: 300, color: '#c4956a', margin: '0 0 4px', lineHeight: 1 }}>
                {publishedThisWeekCount}
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                posts in the last 7 days
              </p>
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(196,149,106,0.1)',
            }}>
              <TrendingUp size={18} style={{ color: '#c4956a' }} />
            </span>
          </div>
        </div>

        {/* Blog Drafts */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>
                Blog Drafts
              </p>
              <p style={{ fontSize: '42px', fontWeight: 300, color: '#c4956a', margin: '0 0 4px', lineHeight: 1 }}>
                {draftBlogCount}
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                blog posts awaiting review
              </p>
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(196,149,106,0.1)',
            }}>
              <FileText size={18} style={{ color: '#c4956a' }} />
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={cardStyle}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: 500,
          color: '#fafaf8',
          margin: '0 0 16px',
        }}>
          Recent Activity
        </h2>

        {recentPosts.length === 0 ? (
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '24px 0' }}>
            No recent posts
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {recentPosts.map((post, i) => (
              <div
                key={post.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: i < recentPosts.length - 1
                    ? '1px solid rgba(255,255,255,0.05)'
                    : 'none',
                }}
              >
                <PlatformIcon platform={post.platform} />
                <p style={{
                  flex: 1,
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.65)',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {post.content?.slice(0, 60) ?? ''}
                  {(post.content?.length ?? 0) > 60 ? '…' : ''}
                </p>
                <StatusBadge status={post.status} />
                <span style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.3)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  {timeAgo(post.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .stat-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
