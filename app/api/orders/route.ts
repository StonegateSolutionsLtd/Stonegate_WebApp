import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendOwnerOrderNotification } from '@/lib/email'
import type { OrderFormData } from '@/lib/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Verify the user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse and validate the body
  let body: OrderFormData
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const required: (keyof OrderFormData)[] = [
    'pickupAddress', 'dropoffAddress', 'apartmentSize', 'movingDate', 'phone',
  ]
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
    }
  }

  // Insert order
  const { data: order, error: insertError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      phone: body.phone,
      pickup_address: body.pickupAddress,
      pickup_floor: body.pickupFloor ?? 1,
      pickup_has_elevator: body.pickupHasElevator ?? false,
      dropoff_address: body.dropoffAddress,
      dropoff_floor: body.dropoffFloor ?? 1,
      dropoff_has_elevator: body.dropoffHasElevator ?? false,
      apartment_size: body.apartmentSize,
      moving_date: body.movingDate,
      special_notes: body.specialNotes || null,
      status: 'confirmed',
    })
    .select('id')
    .single()

  if (insertError || !order) {
    console.error('Order insert error:', insertError)
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }

  // Fetch the profile for customer name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  // Send email notification (non-blocking — don't fail the request if email fails)
  try {
    await sendOwnerOrderNotification({
      orderId: order.id,
      customer: {
        name: profile?.full_name ?? 'Unknown',
        email: profile?.email ?? user.email ?? '',
      },
      order: body,
    })
  } catch (emailError) {
    console.error('Email notification failed:', emailError)
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 })
}
