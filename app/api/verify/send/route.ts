import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendVerificationCode } from '@/lib/email'

export async function POST(request: NextRequest) {
  let email: string, name: string
  try {
    const body = await request.json()
    email = body.email?.trim().toLowerCase()
    name = body.name?.trim()
    if (!email || !name) throw new Error()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  const supabase = createServiceClient()

  await supabase.from('verification_codes').insert({ email, code, expires_at: expiresAt })

  try {
    await sendVerificationCode(email, name, code)
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
