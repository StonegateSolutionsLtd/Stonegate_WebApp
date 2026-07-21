import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendOwnerServiceRequestNotification, sendCustomerServiceRequestConfirmation } from '@/lib/email'

const TYPE_MAP: Record<string, string> = {
  'junk-removal': 'junk_removal',
}

export async function POST(request: NextRequest) {
  let body: { serviceType: string; address: string; date: string; time: string; customerName: string; customerEmail: string; phone: string; notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { serviceType, address, date, time, customerName, customerEmail, phone } = body
  if (!serviceType || !address || !date || !time || !customerName || !customerEmail || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const orderType = TYPE_MAP[serviceType]
  if (!orderType) {
    return NextResponse.json({ error: 'Unknown service type' }, { status: 400 })
  }

  // Save to database
  const supabase = createServiceClient()
  const { data: serviceOrder, error: insertError } = await supabase
    .from('service_orders')
    .insert({
      order_type: orderType,
      customer_name: customerName,
      customer_email: customerEmail,
      phone,
      address,
      service_date: date,
      service_time: time,
      notes: body.notes || null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (insertError || !serviceOrder) {
    console.error('Service order insert error:', JSON.stringify(insertError))
    return NextResponse.json({ error: 'Failed to save request', detail: insertError?.message }, { status: 500 })
  }

  // Send email notifications - don't fail the request if email fails
  await Promise.allSettled([
    sendOwnerServiceRequestNotification({ serviceType, address, date, time, customerName, customerEmail, phone, notes: body.notes }),
    sendCustomerServiceRequestConfirmation({ serviceType, address, date, time, customerName, customerEmail, phone }),
  ])

  return NextResponse.json({ orderId: serviceOrder.id }, { status: 201 })
}
