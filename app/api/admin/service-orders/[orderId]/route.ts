import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params
  const { status } = await request.json()

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('service_orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    console.error('Service order status update error:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
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
    .from('service_orders')
    .delete()
    .eq('id', orderId)

  if (error) {
    console.error('Service order delete error:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
