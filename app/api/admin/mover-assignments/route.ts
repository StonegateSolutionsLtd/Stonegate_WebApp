import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Creates a manual mover_assignment not tied to a calendar job — either hours
// worked (paid at the mover's hourly rate) or a flat amount owed directly.
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { mover_id, work_date, label, hours, amount_override } = body

  if (!mover_id || typeof mover_id !== 'string') {
    return NextResponse.json({ error: 'Missing required field: mover_id' }, { status: 400 })
  }
  if (!work_date) {
    return NextResponse.json({ error: 'Missing required field: work_date' }, { status: 400 })
  }

  let hoursValue: number | null = null
  if (hours !== null && hours !== undefined && hours !== '') {
    const n = Number(hours)
    if (!Number.isFinite(n) || n < 0) {
      return NextResponse.json({ error: 'Invalid hours' }, { status: 400 })
    }
    hoursValue = n
  }

  let amountValue: number | null = null
  if (amount_override !== null && amount_override !== undefined && amount_override !== '') {
    const n = Number(amount_override)
    if (!Number.isFinite(n) || n < 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }
    amountValue = n
  }

  if (hoursValue === null && amountValue === null) {
    return NextResponse.json({ error: 'Enter hours or a flat amount' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: assignment, error } = await supabase
    .from('mover_assignments')
    .insert({
      mover_id,
      calendar_job_id: null,
      work_date,
      label: label || null,
      hours: hoursValue,
      amount_override: amountValue,
    })
    .select('id')
    .single()

  if (error || !assignment) {
    console.error('Manual mover entry insert error:', error)
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 })
  }

  return NextResponse.json({ assignmentId: assignment.id }, { status: 201 })
}
