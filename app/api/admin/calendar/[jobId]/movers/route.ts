import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('mover_assignments')
    .select('mover_id')
    .eq('calendar_job_id', jobId)

  if (error) {
    console.error('Job movers fetch error:', error)
    return NextResponse.json({ error: 'Failed to load assigned movers' }, { status: 500 })
  }

  return NextResponse.json({ moverIds: (data ?? []).map(r => r.mover_id) })
}

// Replaces the full set of movers assigned to a calendar job. Assignments that
// remain in the new list keep their previously logged hours; removed movers lose theirs.
export async function PUT(
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

  const moverIds = Array.isArray(body.mover_ids) ? body.mover_ids.filter((id): id is string => typeof id === 'string') : []

  const supabase = createServiceClient()

  const { data: existing, error: fetchError } = await supabase
    .from('mover_assignments')
    .select('id, mover_id')
    .eq('calendar_job_id', jobId)

  if (fetchError) {
    console.error('Job movers fetch error:', fetchError)
    return NextResponse.json({ error: 'Failed to load current assignments' }, { status: 500 })
  }

  const existingMoverIds = new Set((existing ?? []).map(r => r.mover_id))
  const newMoverIds = new Set(moverIds)

  const toRemove = (existing ?? []).filter(r => !newMoverIds.has(r.mover_id)).map(r => r.id)
  const toAdd = moverIds.filter(id => !existingMoverIds.has(id))

  if (toRemove.length > 0) {
    const { error } = await supabase.from('mover_assignments').delete().in('id', toRemove)
    if (error) {
      console.error('Job movers remove error:', error)
      return NextResponse.json({ error: 'Failed to update assigned movers' }, { status: 500 })
    }
  }

  if (toAdd.length > 0) {
    const { error } = await supabase
      .from('mover_assignments')
      .insert(toAdd.map(mover_id => ({ mover_id, calendar_job_id: jobId })))
    if (error) {
      console.error('Job movers add error:', error)
      return NextResponse.json({ error: 'Failed to update assigned movers' }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
