import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  // Reject non-owner emails before ever touching Supabase Auth - keeps this a closed
  // allowlist even though the project's Auth also has customer-facing accounts.
  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
