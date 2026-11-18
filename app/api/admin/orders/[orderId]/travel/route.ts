import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { estimateTravel } from '@/lib/travel-fee'

/** Recalculates and saves an order's travel fee; the body may override the start time and the job hours */
export async function POST(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const body: { startTime?: string; jobHours?: number } = await request.json().catch(() => ({}))
  const supabase = createServiceClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('pickup_address, dropoff_address, moving_date, moving_time, estimated_hours, duration_minutes')
    .eq('id', orderId)
    .single()
  if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const startTime = body.startTime && /^\d{2}:\d{2}$/.test(body.startTime) ? body.startTime : order.moving_time
  const jobHours = typeof body.jobHours === 'number' && body.jobHours > 0 && body.jobHours <= 24
    ? body.jobHours
    : order.estimated_hours ?? (order.duration_minutes ? order.duration_minutes / 60 : null)

  const estimate = await estimateTravel({
    pickup: order.pickup_address,
    dropoff: order.dropoff_address,
    date: order.moving_date,
    startTime,
    jobHours,
  })
  if (!estimate) {
    return NextResponse.json({ error: 'Could not calculate the drive. Check both addresses.' }, { status: 422 })
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ travel_fee: estimate.fee, travel_estimate: estimate })
    .eq('id', orderId)
  if (updateError) {
    console.error('Travel fee update error:', updateError)
    return NextResponse.json({ error: 'Failed to save the travel fee' }, { status: 500 })
  }
  return NextResponse.json({ estimate })
}
