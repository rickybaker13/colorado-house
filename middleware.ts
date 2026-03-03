import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Validate session server-side (getUser, not getSession, for security)
  const { data: { user } } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  // Restrict to owner email if ADMIN_EMAIL is set
  const adminEmail = process.env.ADMIN_EMAIL
  if (user && adminEmail && user.email !== adminEmail) {
    await supabase.auth.signOut()
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('error', 'unauthorized')
    return NextResponse.redirect(url)
  }

  // Not logged in → redirect to login (except if already on login page)
  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Already logged in → redirect away from login page
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
