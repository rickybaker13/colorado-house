'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Lightbulb,
  History,
  Menu,
  X,
  LogOut,
  Mountain,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/queue', label: 'Social Queue', icon: MessageSquare },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/instruct', label: 'Instructions', icon: Lightbulb },
  { href: '/admin/history', label: 'History', icon: History },
]

export default function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode
  userEmail: string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const sidebar = (
    <>
      {/* Logo */}
      <div style={{
        padding: '28px 24px 20px',
        borderBottom: '1px solid rgba(196,149,106,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mountain size={18} style={{ color: '#c4956a' }} />
          <span
            className="font-display"
            style={{ fontSize: '18px', fontWeight: 400, color: '#fafaf8' }}
          >
            Purgatory
          </span>
        </div>
        <p style={{
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.3)',
          marginTop: '4px',
          textTransform: 'uppercase',
        }}>
          Admin Dashboard
        </p>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '6px',
              marginBottom: '2px',
              fontSize: '14px',
              fontWeight: 400,
              backgroundColor: isActive(href) ? 'rgba(196,149,106,0.12)' : 'transparent',
              color: isActive(href) ? '#c4956a' : 'rgba(255,255,255,0.55)',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid rgba(196,149,106,0.1)',
      }}>
        <p style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: '10px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {userEmail}
        </p>
        <form action="/api/admin/auth/signout" method="POST">
          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.4)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <LogOut size={14} />
            Sign out
          </button>
        </form>
      </div>
    </>
  )

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: '240px',
          backgroundColor: '#0f0f1a',
          borderRight: '1px solid rgba(196,149,106,0.12)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          height: '100%',
          overflow: 'hidden',
        }}
        className="hidden md:flex"
      >
        {sidebar}
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        overflow: 'auto',
        padding: '32px',
        minHeight: '100%',
      }}>
        {/* Mobile header */}
        <div
          className="md:hidden"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mountain size={16} style={{ color: '#c4956a' }} />
            <span className="font-display" style={{ fontSize: '16px', color: '#fafaf8' }}>
              Admin
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Menu size={22} style={{ color: '#c4956a' }} />
          </button>
        </div>

        {children}
      </main>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{ position: 'fixed', inset: 0, zIndex: 100 }}
        >
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          />
          <aside
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '280px',
              backgroundColor: '#0f0f1a',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '12px 16px 0',
            }}>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}
    </div>
  )
}
