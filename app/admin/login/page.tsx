'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useSearchParams } from 'next/navigation'
import { Mountain, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const unauthorized = searchParams.get('error') === 'unauthorized'

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Mountain size={36} style={{ color: '#c4956a', margin: '0 auto 16px' }} />
          <h1
            className="font-display"
            style={{ fontSize: '32px', fontWeight: 300, color: '#fafaf8', margin: 0 }}
          >
            Admin Access
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.35)',
            marginTop: '8px',
          }}>
            Purgatory Townhouse
          </p>
        </div>

        {/* Unauthorized error */}
        {unauthorized && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(220,60,60,0.1)',
            border: '1px solid rgba(220,60,60,0.25)',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#f87171',
          }}>
            <AlertCircle size={16} />
            This email is not authorized for admin access.
          </div>
        )}

        {/* Auth error */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(220,60,60,0.1)',
            border: '1px solid rgba(220,60,60,0.25)',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#f87171',
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={48} style={{ color: '#c4956a', margin: '0 auto 20px' }} />
            <h2 style={{
              fontSize: '20px',
              fontWeight: 500,
              color: '#fafaf8',
              margin: '0 0 12px',
            }}>
              Check your email
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              We sent a magic link to <strong style={{ color: '#c4956a' }}>{email}</strong>.
              Click the link in your email to sign in.
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              style={{
                marginTop: '24px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.4)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Try a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.3)',
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: '100%',
                  padding: '13px 16px 13px 40px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(196,149,106,0.25)',
                  color: '#fafaf8',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(196,149,106,0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(196,149,106,0.25)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '8px',
                backgroundColor: loading ? 'rgba(196,149,106,0.5)' : '#c4956a',
                color: '#1a1a2e',
                fontSize: '15px',
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
              }}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
