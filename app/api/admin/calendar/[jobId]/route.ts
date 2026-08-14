import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { CalendarJobType } from '@/lib/types'

const VALID_JOB_TYPES: CalendarJobType[] = ['moving', 'junk_removal']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const {
    job_type, event_date, event_time, is_subcontract, company_name,
    pickup_address, size, customer_name, notes,
  } = body

  if (!VALID_JOB_TYPES.includes(job_type as CalendarJobType)) {
    return NextResponse.json({ error: 'Invalid job type' }, { status: 400 })
  }
  if (!event_date) {
    return NextResponse.json({ error: 'Missing required field: event_date' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('calendar_jobs')
    .update({
      job_type,
      event_date,
      event_time: event_time || null,
      is_subcontract: !!is_subcontract,
      company_name: company_name || null,
      pickup_address: pickup_address || null,
      size: size || null,
      customer_name: customer_name || null,
      notes: notes || null,
    })
    .eq('id', jobId)

  if (error) {
    console.error('Calendar job update error:', error)
    return NextResponse.json({ error: 'Failed to update calendar job' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('calendar_jobs')
    .delete()
    .eq('id', jobId)

  if (error) {
    console.error('Calendar job delete error:', error)
    return NextResponse.json({ error: 'Failed to delete calendar job' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
