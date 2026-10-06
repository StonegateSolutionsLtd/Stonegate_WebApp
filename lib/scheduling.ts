import type { CalendarJobType } from './types'

export const BUSINESS_START_MIN = 6 * 60
export const BUSINESS_END_MIN = 22 * 60
// Fixed display buckets (6-8, 8-10, 10-12, ...) rather than a sliding 30-min start time.
export const SLOT_STEP_MIN = 120

// A job occupies the truck/crew for this long, so it also decides how much free
// space a slot needs before it can be offered.
export const DEFAULT_DURATION_MIN: Record<CalendarJobType, number> = {
  moving: 300,
  junk_removal: 120,
}

// A calendar job with no time set can't be pinned to a real window, but blocking
// the whole day is too aggressive — assume a half-day commitment instead.
export const UNSCHEDULED_JOB_BLOCK_MIN = 360

// A move is only ever an estimate — a crew running long must never bump into
// whatever's booked next. Every moving job, new or existing, adds this on top
// of its own duration (configured or default) for conflict-checking purposes,
// so a 3hr job still blocks 4hr and the untouched 5hr default blocks 6hr.
export const MOVING_CONFLICT_BUFFER_MIN = 60

export const DURATION_OPTIONS_MIN = [60, 90, 120, 150, 180, 240, 300, 360, 420, 480]

export interface BusyInterval {
  start: number
  end: number
}

export interface Slot {
  value: string
  label: string
}

export interface DayAvailability {
  date: string
  slots: Slot[]
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatTimeLabel(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')}${period.toLowerCase()}`
}

export function formatSlotRange(startMinutes: number, durationMinutes: number): string {
  return `${formatTimeLabel(startMinutes)}–${formatTimeLabel(startMinutes + durationMinutes)}`
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}

export function durationFor(jobType: CalendarJobType, override?: number | null): number {
  return override && override > 0 ? override : DEFAULT_DURATION_MIN[jobType]
}

/**
 * How much schedule room a job needs to be treated as blocking, for conflict
 * checks only — never for the customer-facing "reserves about X" estimate.
 * Moving jobs (default or explicitly configured) add MOVING_CONFLICT_BUFFER_MIN
 * so a run-over never collides with whatever's booked next; other job types
 * use their plain duration.
 */
export function conflictDurationFor(jobType: CalendarJobType, override?: number | null): number {
  const base = durationFor(jobType, override)
  return jobType === 'moving' ? base + MOVING_CONFLICT_BUFFER_MIN : base
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d + days)
  return formatDateKey(date)
}

export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const BUSINESS_TIME_ZONE = 'America/Vancouver'

/** Server runs in UTC, so "today" and "already passed" must be judged in the crew's zone. */
export function nowInBusinessZone(): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00'
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

/**
 * Candidate starts fall on fixed SLOT_STEP_MIN buckets (6-8, 8-10, 10-12, ...),
 * labeled by that bucket rather than the job's real duration — the job may run
 * past its bucket, but the full duration still has to clear every busy interval
 * and fit before closing before the bucket is offered. For "today", buckets that
 * have already started are dropped.
 */
export function computeAvailableSlots({
  busy,
  durationMinutes,
  minStartMinutes = BUSINESS_START_MIN,
}: {
  busy: BusyInterval[]
  durationMinutes: number
  minStartMinutes?: number
}): Slot[] {
  const slots: Slot[] = []

  for (let start = BUSINESS_START_MIN; start + durationMinutes <= BUSINESS_END_MIN; start += SLOT_STEP_MIN) {
    if (start < minStartMinutes) continue
    const end = start + durationMinutes
    const overlaps = busy.some(b => start < b.end && end > b.start)
    if (overlaps) continue
    slots.push({ value: minutesToTime(start), label: formatSlotRange(start, SLOT_STEP_MIN) })
  }

  return slots
}
