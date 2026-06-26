import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServiceClient()

  // 1. Check if table exists by trying a SELECT
  const { data: rows, error: selectError } = await supabase
    .from('service_orders')
    .select('id, order_type, customer_name, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  if (selectError) {
    return NextResponse.json({
      step: 'SELECT failed',
      error: selectError.message,
      code: selectError.code,
    }, { status: 500 })
  }

  // 2. Try inserting a test row
  const { data: inserted, error: insertError } = await supabase
    .from('service_orders')
    .insert({
      order_type: 'junk_removal',
      customer_name: 'TEST - DELETE ME',
      customer_email: 'test@test.com',
      phone: '000-000-0000',
      address: '123 Test St',
      service_date: '2026-07-01',
      service_time: '09:00',
      status: 'pending',
    })
    .select('id')
    .single()

  if (insertError) {
    return NextResponse.json({
      step: 'INSERT failed',
      existing_rows: rows,
      error: insertError.message,
      code: insertError.code,
    }, { status: 500 })
  }

  // 3. Clean up test row
  await supabase.from('service_orders').delete().eq('id', inserted.id)

  return NextResponse.json({
    success: true,
    message: 'service_orders table is working correctly',
    existing_count: rows?.length ?? 0,
    recent_orders: rows,
  })
}
