import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendOwnerOrderNotification, sendCustomerOrderConfirmation } from '@/lib/email'
import { addDays, nowInBusinessZone } from '@/lib/scheduling'
import { MOVE_TYPES, sizesFor, type ApartmentSize, type OrderFormData } from '@/lib/types'

const DATE_FLEX = ['today', 'this_week', 'date']

/** A free estimate request from the public form - no time slot is held until we confirm the move */
export async function POST(request: NextRequest) {
  let body: OrderFormData
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const required: (keyof OrderFormData)[] = [
    'moveType', 'dateFlex', 'movingDate', 'pickupAddress', 'dropoffAddress',
    'customerName', 'customerEmail', 'phone',
  ]
  for (const field of required) {
    const value = body[field]
    if (typeof value !== 'string' || !value.trim()) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
    }
  }

  const moveType = body.moveType!
  if (!MOVE_TYPES.some(t => t.value === moveType)) {
    return NextResponse.json({ error: 'Invalid move type' }, { status: 400 })
  }
  const sizes = sizesFor(moveType)
  const moveSize = sizes.length ? body.moveSize ?? '' : ''
  if (sizes.length && !sizes.some(s => s.value === moveSize)) {
    return NextResponse.json({ error: 'Please choose a size for your move' }, { status: 400 })
  }
  if (!DATE_FLEX.includes(body.dateFlex!)) {
    return NextResponse.json({ error: 'Invalid moving date' }, { status: 400 })
  }
  // A day of slack either side of Vancouver's date covers customers in other time zones
  const today = nowInBusinessZone().date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.movingDate) || body.movingDate < addDays(today, -1) || body.movingDate > addDays(today, 730)) {
    return NextResponse.json({ error: 'Please choose a valid moving date' }, { status: 400 })
  }

  const isHome = moveType === 'house' || moveType === 'apartment'
  const supabase = createServiceClient()

  const { data: order, error: insertError } = await supabase
    .from('orders')
    .insert({
      customer_name: body.customerName.trim(),
      customer_email: body.customerEmail.trim(),
      phone: body.phone.trim(),
      pickup_address: body.pickupAddress.trim(),
      dropoff_address: body.dropoffAddress.trim(),
      move_type: moveType,
      move_size: moveSize || null,
      apartment_size: isHome ? (moveSize as ApartmentSize) : null,
      date_flexibility: body.dateFlex,
      moving_date: body.movingDate,
      moving_time: null,
      special_notes: body.specialNotes?.trim() || null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (insertError || !order) {
    console.error('Order insert error:', insertError)
    return NextResponse.json({ error: 'Failed to save your request. Please try again or call us.' }, { status: 500 })
  }

  // Send both emails - don't fail the request if email fails
  const saved: OrderFormData = { ...body, moveSize, movingTime: '' }
  await Promise.allSettled([
    sendOwnerOrderNotification({ orderId: order.id, order: saved }),
    sendCustomerOrderConfirmation({ orderId: order.id, order: saved }),
  ])

  return NextResponse.json({ orderId: order.id }, { status: 201 })
}
