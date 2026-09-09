import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(
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

  const { amount, period_start, period_end, paid_date, notes } = body

  const amt = Number(amount)
  if (!Number.isFinite(amt) || amt <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }
  if (!period_start || !period_end) {
    return NextResponse.json({ error: 'Missing pay period' }, { status: 400 })
  }
  if (!paid_date) {
    return NextResponse.json({ error: 'Missing paid date' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: payment, error } = await supabase
    .from('mover_payments')
    .insert({
      mover_id: moverId,
      amount: amt,
      period_start,
      period_end,
      paid_date,
      notes: notes || null,
    })
    .select('id')
    .single()

  if (error || !payment) {
    console.error('Mover payment insert error:', error)
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
  }

  return NextResponse.json({ paymentId: payment.id }, { status: 201 })
}
