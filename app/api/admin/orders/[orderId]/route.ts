import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { APARTMENT_SIZE_LABELS, type ApartmentSize } from '@/lib/types'

const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const
const VALID_SIZES = Object.keys(APARTMENT_SIZE_LABELS) as ApartmentSize[]

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params
  const body = await request.json()
  const supabase = createServiceClient()

  // Status-only update (used by the dashboard status dropdown)
  if (Object.keys(body).length === 1 && 'status' in body) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const { error } = await supabase.from('orders').update({ status: body.status }).eq('id', orderId)
    if (error) {
      console.error('Status update error:', error)
      return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  // Editing the client / moving details
  const update: Record<string, unknown> = {}

  if (body.customerName !== undefined) {
    if (typeof body.customerName !== 'string' || !body.customerName.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    update.customer_name = body.customerName.trim()
  }
  if (body.customerEmail !== undefined) update.customer_email = String(body.customerEmail).trim()
  if (body.phone !== undefined) update.phone = String(body.phone).trim()
  if (body.pickupAddress !== undefined) {
    if (typeof body.pickupAddress !== 'string' || !body.pickupAddress.trim()) {
      return NextResponse.json({ error: 'Pickup address is required' }, { status: 400 })
    }
    update.pickup_address = body.pickupAddress.trim()
  }
  if (body.pickupFloor !== undefined) update.pickup_floor = Number(body.pickupFloor) || 1
  if (body.pickupHasElevator !== undefined) update.pickup_has_elevator = !!body.pickupHasElevator
  if (body.dropoffAddress !== undefined) {
    if (typeof body.dropoffAddress !== 'string' || !body.dropoffAddress.trim()) {
      return NextResponse.json({ error: 'Drop-off address is required' }, { status: 400 })
    }
    update.dropoff_address = body.dropoffAddress.trim()
  }
  if (body.dropoffFloor !== undefined) update.dropoff_floor = Number(body.dropoffFloor) || 1
  if (body.dropoffHasElevator !== undefined) update.dropoff_has_elevator = !!body.dropoffHasElevator
  if (body.apartmentSize !== undefined) {
    if (!VALID_SIZES.includes(body.apartmentSize)) {
      return NextResponse.json({ error: 'Invalid apartment size' }, { status: 400 })
    }
    update.apartment_size = body.apartmentSize
  }
  if (body.movingDate !== undefined) {
    if (typeof body.movingDate !== 'string' || !body.movingDate) {
      return NextResponse.json({ error: 'Moving date is required' }, { status: 400 })
    }
    update.moving_date = body.movingDate
  }
  if (body.movingTime !== undefined) {
    if (typeof body.movingTime !== 'string' || !body.movingTime) {
      return NextResponse.json({ error: 'Moving time is required' }, { status: 400 })
    }
    update.moving_time = body.movingTime
  }
  if (body.specialNotes !== undefined) update.special_notes = String(body.specialNotes).trim() || null

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { error } = await supabase.from('orders').update(update).eq('id', orderId)

  if (error) {
    console.error('Order details update error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)

  if (error) {
    console.error('Order delete error:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
