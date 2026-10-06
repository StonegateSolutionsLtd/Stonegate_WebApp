import { createServiceClient } from '@/lib/supabase/server'
import {
  BUSINESS_START_MIN,
  DEFAULT_DURATION_MIN,
  UNSCHEDULED_JOB_BLOCK_MIN,
  computeAvailableSlots,
  conflictDurationFor,
  nowInBusinessZone,
  timeToMinutes,
  type BusyInterval,
} from '@/lib/scheduling'
import type { CalendarJobType } from '@/lib/types'

/**
 * Every booked window in the range, keyed by date. Covers both customer-facing
 * tables plus the admin calendar; cancelled orders free their slot back up.
 */
export async function loadBusyByDate(
  startDate: string,
  endDate: string
): Promise<Record<string, BusyInterval[]>> {
  const supabase = createServiceClient()

  const [ordersRes, serviceOrdersRes, calendarJobsRes] = await Promise.all([
    supabase
      .from('orders')
      .select('moving_date, moving_time, duration_minutes')
      .neq('status', 'cancelled')
      .gte('moving_date', startDate)
      .lte('moving_date', endDate),
    supabase
      .from('service_orders')
      .select('service_date, service_time, duration_minutes')
      .neq('status', 'cancelled')
      .gte('service_date', startDate)
      .lte('service_date', endDate),
    supabase
      .from('calendar_jobs')
      .select('event_date, event_time, duration_minutes, job_type')
      .gte('event_date', startDate)
      .lte('event_date', endDate),
  ])

  // Fail closed: treating a failed query as "nothing is booked" would hand out
  // slots that are already taken.
  const failure = ordersRes.error ?? serviceOrdersRes.error ?? calendarJobsRes.error
  if (failure) throw new Error(`Availability lookup failed: ${failure.message}`)

  const orders = ordersRes.data
  const serviceOrders = serviceOrdersRes.data
  const calendarJobs = calendarJobsRes.data

  const busy: Record<string, BusyInterval[]> = {}
  const push = (date: string, interval: BusyInterval) => {
    ;(busy[date] ??= []).push(interval)
  }

  for (const o of orders ?? []) {
    if (!o.moving_time) continue
    const start = timeToMinutes(o.moving_time)
    push(o.moving_date, { start, end: start + conflictDurationFor('moving', o.duration_minutes) })
  }

  for (const s of serviceOrders ?? []) {
    if (!s.service_time) continue
    const start = timeToMinutes(s.service_time)
    push(s.service_date, { start, end: start + conflictDurationFor('junk_removal', s.duration_minutes) })
  }

  for (const j of calendarJobs ?? []) {
    const jobType = (j.job_type ?? 'moving') as CalendarJobType
    // No time set means we can't say when the crew starts, so assume a half-day
    // commitment from opening rather than blocking the entire day.
    if (!j.event_time) {
      const blockMinutes = j.duration_minutes && j.duration_minutes > 0
        ? conflictDurationFor(jobType, j.duration_minutes)
        : UNSCHEDULED_JOB_BLOCK_MIN
      push(j.event_date, { start: BUSINESS_START_MIN, end: BUSINESS_START_MIN + blockMinutes })
      continue
    }
    const start = timeToMinutes(j.event_time)
    push(j.event_date, { start, end: start + conflictDurationFor(jobType, j.duration_minutes) })
  }

  return busy
}

export function parseJobType(value: string | null): CalendarJobType | null {
  return value && value in DEFAULT_DURATION_MIN ? (value as CalendarJobType) : null
}

/**
 * Re-checks a slot at submit time — the browser may have been sitting on a stale
 * availability list while someone else booked the same window.
 */
export async function isSlotAvailable(
  jobType: CalendarJobType,
  date: string,
  time: string
): Promise<boolean> {
  const now = nowInBusinessZone()
  if (date < now.date) return false

  const busyByDate = await loadBusyByDate(date, date)
  const slots = computeAvailableSlots({
    busy: busyByDate[date] ?? [],
    durationMinutes: conflictDurationFor(jobType),
    minStartMinutes: date === now.date ? now.minutes : BUSINESS_START_MIN,
  })

  const normalized = time.slice(0, 5)
  return slots.some(slot => slot.value === normalized)
}
