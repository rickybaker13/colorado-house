import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminShell from './AdminShell'

export const metadata = {
  title: 'Admin | Purgatory Townhouse',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Login page handles its own layout
  if (!user) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#1a1a2e',
        overflow: 'auto',
      }}>
        {children}
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: '#1a1a2e',
      overflow: 'hidden',
    }}>
      <AdminShell userEmail={user.email || ''}>{children}</AdminShell>
    </div>
  )
}
