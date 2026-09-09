import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}

  if (body.hours !== undefined) {
    let hoursValue: number | null = null
    if (body.hours !== null && body.hours !== '') {
      const n = Number(body.hours)
      if (!Number.isFinite(n) || n < 0) {
        return NextResponse.json({ error: 'Invalid hours' }, { status: 400 })
      }
      hoursValue = n
    }
    update.hours = hoursValue
  }

  if (body.amount_override !== undefined) {
    let amountValue: number | null = null
    if (body.amount_override !== null && body.amount_override !== '') {
      const n = Number(body.amount_override)
      if (!Number.isFinite(n) || n < 0) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
      }
      amountValue = n
    }
    update.amount_override = amountValue
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('mover_assignments')
    .update(update)
    .eq('id', assignmentId)

  if (error) {
    console.error('Mover assignment update error:', error)
    return NextResponse.json({ error: 'Failed to update hours' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params
  const supabase = createServiceClient()

  const { error } = await supabase.from('mover_assignments').delete().eq('id', assignmentId)

  if (error) {
    console.error('Mover assignment delete error:', error)
    return NextResponse.json({ error: 'Failed to remove assignment' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
