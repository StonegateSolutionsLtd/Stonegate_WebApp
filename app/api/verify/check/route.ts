import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  let email: string, code: string
  try {
    const body = await request.json()
    email = body.email?.trim().toLowerCase()
    code = body.code?.trim()
    if (!email || !code) throw new Error()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data } = await supabase
    .from('verification_codes')
    .select('id, expires_at, used')
    .eq('email', email)
    .eq('code', code)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  if (data.used) {
    return NextResponse.json({ error: 'Code has already been used' }, { status: 400 })
  }

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Code has expired' }, { status: 400 })
  }

  await supabase
    .from('verification_codes')
    .update({ used: true })
    .eq('id', data.id)

  return NextResponse.json({ ok: true })
}
