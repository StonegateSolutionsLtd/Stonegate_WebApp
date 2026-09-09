import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const activeOnly = request.nextUrl.searchParams.get('active') === 'true'
  const supabase = createServiceClient()

  let query = supabase.from('movers').select('*').order('active', { ascending: false }).order('name', { ascending: true })
  if (activeOnly) query = query.eq('active', true)

  const { data: movers, error } = await query
  if (error) {
    console.error('Movers list error:', error)
    return NextResponse.json({ error: 'Failed to load movers' }, { status: 500 })
  }

  return NextResponse.json({ movers })
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, phone, hourly_rate, active, notes } = body

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 })
  }
  const rate = Number(hourly_rate)
  if (!Number.isFinite(rate) || rate < 0) {
    return NextResponse.json({ error: 'Invalid hourly rate' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: mover, error } = await supabase
    .from('movers')
    .insert({
      name: name.trim(),
      phone: phone || null,
      hourly_rate: rate,
      active: active === undefined ? true : !!active,
      notes: notes || null,
    })
    .select('id')
    .single()

  if (error || !mover) {
    console.error('Mover insert error:', error)
    return NextResponse.json({ error: 'Failed to save mover' }, { status: 500 })
  }

  return NextResponse.json({ moverId: mover.id }, { status: 201 })
}
