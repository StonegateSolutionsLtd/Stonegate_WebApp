import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { CalendarJobType } from '@/lib/types'

const VALID_JOB_TYPES: CalendarJobType[] = ['moving', 'junk_removal']

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const {
    job_type, event_date, event_time, is_subcontract, company_name,
    pickup_address, size, customer_name, notes, order_id, service_order_id,
  } = body

  if (!VALID_JOB_TYPES.includes(job_type as CalendarJobType)) {
    return NextResponse.json({ error: 'Invalid job type' }, { status: 400 })
  }
  if (!event_date) {
    return NextResponse.json({ error: 'Missing required field: event_date' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: job, error } = await supabase
    .from('calendar_jobs')
    .insert({
      job_type,
      event_date,
      event_time: event_time || null,
      is_subcontract: !!is_subcontract,
      company_name: company_name || null,
      pickup_address: pickup_address || null,
      size: size || null,
      customer_name: customer_name || null,
      notes: notes || null,
      order_id: order_id || null,
      service_order_id: service_order_id || null,
    })
    .select('id')
    .single()

  if (error || !job) {
    console.error('Calendar job insert error:', error)
    return NextResponse.json({ error: 'Failed to save calendar job' }, { status: 500 })
  }

  return NextResponse.json({ jobId: job.id }, { status: 201 })
}
