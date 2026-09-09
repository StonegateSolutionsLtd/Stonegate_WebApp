import { createServiceClient } from '@/lib/supabase/server'
import MoversWeekNav from '../_components/MoversWeekNav'
import AddMoverButton from '../_components/AddMoverButton'
import MoversWeekView from '../_components/MoversWeekView'
import type { Mover, MoverAssignmentWithJob, MoverPayment } from '@/lib/types'

export const dynamic = 'force-dynamic'

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseDateLocal(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export default async function MoversPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const { week } = await searchParams
  const anchor = week && /^\d{4}-\d{2}-\d{2}$/.test(week) ? parseDateLocal(week) : new Date()

  const weekStart = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - anchor.getDay())
  const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6)
  const weekStartStr = fmt(weekStart)
  const weekEndStr = fmt(weekEnd)
  const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

  const supabase = createServiceClient()
  const [
    { data: movers },
    { data: jobAssignments },
    { data: manualAssignments },
    { data: payments },
    { data: priorJobAssignments },
    { data: priorManualAssignments },
    { data: priorPayments },
  ] = await Promise.all([
    supabase.from('movers').select('*').order('active', { ascending: false }).order('name', { ascending: true }),
    supabase
      .from('mover_assignments')
      .select('*, calendar_jobs!inner(*)')
      .gte('calendar_jobs.event_date', weekStartStr)
      .lte('calendar_jobs.event_date', weekEndStr)
      .order('event_date', { referencedTable: 'calendar_jobs', ascending: true }),
    supabase
      .from('mover_assignments')
      .select('*')
      .is('calendar_job_id', null)
      .gte('work_date', weekStartStr)
      .lte('work_date', weekEndStr)
      .order('work_date', { ascending: true }),
    supabase.from('mover_payments').select('*').eq('period_start', weekStartStr).order('paid_date', { ascending: true }),
    // Everything before this week — used to carry forward any balance that hasn't been paid off yet.
    supabase.from('mover_assignments').select('mover_id, hours, amount_override, calendar_jobs!inner(event_date)').lt('calendar_jobs.event_date', weekStartStr),
    supabase.from('mover_assignments').select('mover_id, hours, amount_override').is('calendar_job_id', null).lt('work_date', weekStartStr),
    supabase.from('mover_payments').select('mover_id, amount').lt('period_start', weekStartStr),
  ])

  const assignments = [...(jobAssignments ?? []), ...(manualAssignments ?? [])]

  const priorOwedByMover: Record<string, number> = {}
  const moverRates: Record<string, number> = Object.fromEntries((movers ?? []).map(m => [m.id, Number(m.hourly_rate)]))
  for (const a of [...(priorJobAssignments ?? []), ...(priorManualAssignments ?? [])]) {
    const owed = a.amount_override != null ? Number(a.amount_override) : (a.hours ?? 0) * (moverRates[a.mover_id] ?? 0)
    priorOwedByMover[a.mover_id] = (priorOwedByMover[a.mover_id] ?? 0) + owed
  }
  const priorPaidByMover: Record<string, number> = {}
  for (const p of priorPayments ?? []) {
    priorPaidByMover[p.mover_id] = (priorPaidByMover[p.mover_id] ?? 0) + Number(p.amount)
  }
  const carryoverByMover: Record<string, number> = {}
  for (const m of movers ?? []) {
    const carryover = (priorOwedByMover[m.id] ?? 0) - (priorPaidByMover[m.id] ?? 0)
    if (Math.abs(carryover) > 0.004) carryoverByMover[m.id] = carryover
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
        <h1 style={{ color: '#254220', fontSize: '20px', fontWeight: 700, margin: 0 }}>Movers &amp; Payroll</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <MoversWeekNav weekStartStr={weekStartStr} label={weekLabel} />
          <AddMoverButton />
        </div>
      </div>
      <p style={{ fontSize: '12px', color: '#9A8E83', margin: '0 0 16px' }}>
        Hours are logged per calendar job — assign movers from the Calendar tab, then fill in hours here once a job is done. Payments are tracked against this pay period, however early you pay. Any unpaid balance carries forward to the next week until it&apos;s settled.
      </p>

      <MoversWeekView
        movers={(movers ?? []) as Mover[]}
        assignments={assignments as unknown as MoverAssignmentWithJob[]}
        payments={(payments ?? []) as MoverPayment[]}
        carryovers={carryoverByMover}
        weekStartStr={weekStartStr}
        weekEndStr={weekEndStr}
      />
    </div>
  )
}
