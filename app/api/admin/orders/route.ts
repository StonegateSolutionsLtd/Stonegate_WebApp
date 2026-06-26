import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { OrderFormData } from '@/lib/types'

export async function POST(request: NextRequest) {
  let body: OrderFormData
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const required: (keyof OrderFormData)[] = [
    'customerName', 'customerEmail', 'phone',
    'pickupAddress', 'dropoffAddress', 'apartmentSize', 'movingDate', 'movingTime',
  ]
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
    }
  }

  const supabase = createServiceClient()

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_name: body.customerName,
      customer_email: body.customerEmail,
      phone: body.phone,
      pickup_address: body.pickupAddress,
      pickup_floor: body.pickupFloor ?? 1,
      pickup_has_elevator: body.pickupHasElevator ?? false,
      dropoff_address: body.dropoffAddress,
      dropoff_floor: body.dropoffFloor ?? 1,
      dropoff_has_elevator: body.dropoffHasElevator ?? false,
      apartment_size: body.apartmentSize,
      moving_date: body.movingDate,
      moving_time: body.movingTime,
      special_notes: body.specialNotes || null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error || !order) {
    console.error('Manual order insert error:', error)
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 })
}
