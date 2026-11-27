import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { identifyCrawler, logCrawlerVisit } from '@/lib/crawlers'

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Record visits from known AI and search crawlers (in the background, never blocking the page).
  const userAgent = request.headers.get('user-agent')
  const bot = identifyCrawler(userAgent)
  if (bot) {
    event.waitUntil(
      logCrawlerVisit({
        bot,
        path: request.nextUrl.pathname,
        userAgent,
        referer: request.headers.get('referer'),
        country: request.headers.get('x-vercel-ip-country'),
      })
    )
  }

  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  return adminAuth(request)
}

async function adminAuth(request: NextRequest) {
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

  // Restrict to allowed admin emails (comma-separated list)
  const adminEmails = process.env.ADMIN_EMAIL
  if (user && adminEmails) {
    const allowed = adminEmails.split(',').map((e) => e.trim().toLowerCase())
    if (!allowed.includes(user.email?.toLowerCase() || '')) {
      await supabase.auth.signOut()
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }
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
  // Everything except build assets, images, fonts and API routes
  // (the MCP endpoint logs its own traffic).
  matcher: ['/((?!_next/static|_next/image|images/|fonts/|api/|favicon\\.ico|icon).*)'],
}
