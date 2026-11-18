import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { syncCurrentRate } from '@/lib/mover-rates-server'

/** Removes one rate change (e.g. entered by mistake); the weeks it covered fall back to the rate before it */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ moverId: string; rateId: string }> }
) {
  const { moverId, rateId } = await params
  const supabase = createServiceClient()

  const { count } = await supabase.from('mover_rates').select('id', { count: 'exact', head: true }).eq('mover_id', moverId)
  if ((count ?? 0) <= 1) {
    return NextResponse.json({ error: 'A mover needs at least one rate' }, { status: 400 })
  }

  const { error } = await supabase.from('mover_rates').delete().eq('id', rateId).eq('mover_id', moverId)
  if (error) {
    console.error('Mover rate delete error:', error)
    return NextResponse.json({ error: 'Failed to remove the rate' }, { status: 500 })
  }
  await syncCurrentRate(supabase, moverId)
  return NextResponse.json({ ok: true })
}
