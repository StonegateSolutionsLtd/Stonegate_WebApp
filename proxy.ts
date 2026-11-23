import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAdminEmail } from '@/lib/admin-auth'

/**
 * Retired junk-removal URLs. The service is discontinued and no page replaces it, so these answer 410 Gone
 * (Google's signal for "permanently removed, drop it from the index") instead of redirecting somewhere unrelated.
 * They must stay crawlable: do not block them in robots.txt.
 */
const RETIRED = /^\/(junk-removal|book-service)(\/.*)?$|^\/(burnaby-junk-removal|pricing\/junk-removal)\/?$/

function gone() {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page removed · Stonegate Moving Solutions</title></head>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 24px;color:#1A1714;line-height:1.5">
<h1 style="font-size:1.6rem">This page has been removed</h1>
<p>Stonegate no longer offers junk removal. We are a moving company serving Metro Vancouver.</p>
<p><a href="/" style="color:#014421;font-weight:700">See our moving services</a></p>
</body></html>`
  return new NextResponse(html, { status: 410, headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' } })
}

export async function proxy(request: NextRequest) {
  if (RETIRED.test(request.nextUrl.pathname)) return gone()

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // getUser() (not getSession()) revalidates against Supabase Auth on every request,
  // so a revoked/expired session is rejected here rather than trusting a local cookie.
  const { data: { user } } = await supabase.auth.getUser()

  if (isAdminEmail(user?.email)) {
    return response
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.redirect(new URL('/admin', request.url))
}

export const config = {
  matcher: [
    // Retired junk-removal URLs (answered with 410 Gone above)
    '/junk-removal',
    '/junk-removal/:path*',
    '/book-service',
    '/book-service/:path*',
    '/burnaby-junk-removal',
    '/pricing/junk-removal',
    // Everything under /admin/* requires login, except the bare /admin login page itself.
    '/admin/:path+',
    // Everything under /api/admin/* requires login, except login/logout (which issue/clear the session).
    '/api/admin/((?!login|logout).*)',
  ],
}
