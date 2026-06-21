import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params
  const { hourly_rate, estimated_hours, additional_fees } = await request.json()

  if (typeof hourly_rate !== 'number' || hourly_rate <= 0) {
    return NextResponse.json({ error: 'Invalid hourly rate' }, { status: 400 })
  }
  if (typeof estimated_hours !== 'number' || estimated_hours <= 0) {
    return NextResponse.json({ error: 'Invalid hours' }, { status: 400 })
  }
  if (typeof additional_fees !== 'number' || additional_fees < 0) {
    return NextResponse.json({ error: 'Invalid additional fees' }, { status: 400 })
  }

  const estimated_price = Math.round((hourly_rate * estimated_hours + additional_fees) * 100) / 100

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('orders')
    .update({
      hourly_rate,
      estimated_hours,
      additional_fees,
      estimated_price,
      quote_generated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) {
    console.error('Quote update error:', error)
    return NextResponse.json({ error: 'Failed to save quote' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
