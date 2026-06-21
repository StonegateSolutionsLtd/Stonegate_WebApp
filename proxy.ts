import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  const expected = process.env.ADMIN_SECRET_TOKEN

  if (!expected || token !== expected) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/quote/:path*',
    '/api/admin/quote/:path*',
  ],
}
