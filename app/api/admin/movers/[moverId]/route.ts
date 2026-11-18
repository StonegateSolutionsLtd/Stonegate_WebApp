import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { mondayOf } from '@/lib/mover-rates'
import { syncCurrentRate } from '@/lib/mover-rates-server'
import { nowInBusinessZone } from '@/lib/scheduling'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ moverId: string }> }
) {
  const { moverId } = await params
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 })
    }
    update.name = body.name.trim()
  }
  if (body.phone !== undefined) update.phone = body.phone || null
  // A new rate applies from the Monday of rate_effective_from (default: this week); earlier weeks keep their rate
  let newRate: { rate: number; from: string } | null = null
  if (body.hourly_rate !== undefined) {
    const rate = Number(body.hourly_rate)
    if (!Number.isFinite(rate) || rate < 0) {
      return NextResponse.json({ error: 'Invalid hourly rate' }, { status: 400 })
    }
    const from = typeof body.rate_effective_from === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.rate_effective_from)
      ? body.rate_effective_from
      : nowInBusinessZone().date
    newRate = { rate, from: mondayOf(from) }
  }
  if (body.active !== undefined) update.active = !!body.active
  if (body.notes !== undefined) update.notes = body.notes || null

  const supabase = createServiceClient()
  if (Object.keys(update).length) {
    const { error } = await supabase.from('movers').update(update).eq('id', moverId)
    if (error) {
      console.error('Mover update error:', error)
      return NextResponse.json({ error: 'Failed to update mover' }, { status: 500 })
    }
  }

  if (newRate) {
    const { error } = await supabase
      .from('mover_rates')
      .upsert({ mover_id: moverId, hourly_rate: newRate.rate, effective_from: newRate.from }, { onConflict: 'mover_id,effective_from' })
    if (error) {
      console.error('Mover rate update error:', error)
      return NextResponse.json({ error: 'Failed to save the new rate' }, { status: 500 })
    }
    await syncCurrentRate(supabase, moverId)
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ moverId: string }> }
) {
  const { moverId } = await params
  const supabase = createServiceClient()

  const { error } = await supabase.from('movers').delete().eq('id', moverId)

  if (error) {
    console.error('Mover delete error:', error)
    return NextResponse.json({ error: 'Failed to delete mover' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
