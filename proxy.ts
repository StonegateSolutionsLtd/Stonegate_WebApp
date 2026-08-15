import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAdminEmail } from '@/lib/admin-auth'

export async function proxy(request: NextRequest) {
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
    // Everything under /admin/* requires login, except the bare /admin login page itself.
    '/admin/:path+',
    // Everything under /api/admin/* requires login, except login/logout (which issue/clear the session).
    '/api/admin/((?!login|logout).*)',
  ],
}
