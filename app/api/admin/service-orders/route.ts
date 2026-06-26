import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const VALID_TYPES = ['junk_removal', 'bin_cleaning'] as const

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderType = searchParams.get('type')

  const supabase = createServiceClient()
  let query = supabase.from('service_orders').select('*').order('created_at', { ascending: false })

  if (orderType && VALID_TYPES.includes(orderType as typeof VALID_TYPES[number])) {
    query = query.eq('order_type', orderType)
  }

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { order_type, customer_name, customer_email, phone, address, service_date, service_time, notes } = body

  if (!VALID_TYPES.includes(order_type as typeof VALID_TYPES[number])) {
    return NextResponse.json({ error: 'Invalid order type' }, { status: 400 })
  }

  const required = { customer_name, customer_email, phone, address, service_date, service_time }
  for (const [key, val] of Object.entries(required)) {
    if (!val) {
      return NextResponse.json({ error: `Missing required field: ${key}` }, { status: 400 })
    }
  }

  const supabase = createServiceClient()

  const { data: order, error } = await supabase
    .from('service_orders')
    .insert({
      order_type,
      customer_name,
      customer_email,
      phone,
      address,
      service_date,
      service_time,
      notes: notes || null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error || !order) {
    console.error('Service order insert error:', error)
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 })
}
