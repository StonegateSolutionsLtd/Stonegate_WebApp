import type { Patrol } from './types'

export function slotsRemaining(patrol: Patrol): number {
  return Math.max(0, patrol.maxStops - patrol.bookedStops)
}

export function capacityRemainingRatio(patrol: Patrol): number {
  if (patrol.truckCapacity <= 0) return 0
  return Math.max(0, Math.min(1, 1 - patrol.capacityUsed / patrol.truckCapacity))
}

export function capacityUsedRatio(patrol: Patrol): number {
  return 1 - capacityRemainingRatio(patrol)
}

export function isBookable(patrol: Patrol): boolean {
  return (
    (patrol.status === 'scheduled' || patrol.status === 'filling' || patrol.status === 'almost_full') &&
    slotsRemaining(patrol) > 0
  )
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

/** "2026-09-24" -> "Thursday, September 24" (parsed as local, not UTC, to avoid off-by-one). */
export function formatPatrolDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return DATE_FORMATTER.format(date)
}

function formatTime(hhmm: string): string {
  const [hour, minute] = hhmm.split(':').map(Number)
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return minute === 0 ? `${hour12} ${period}` : `${hour12}:${String(minute).padStart(2, '0')} ${period}`
}

/** "12:00" / "16:00" -> "12:00 PM – 4:00 PM" */
export function formatPatrolWindow(patrol: Patrol): string {
  return `${formatTime(patrol.startTime)} – ${formatTime(patrol.endTime)}`
}

/**
 * Chooses which patrol to lead with: the soonest one, unless it's no longer
 * bookable (full/cancelled) and a later one still has room — in which case
 * that becomes "Next Patrol" and the soonest one is surfaced as a note.
 */
export function pickFeaturedPatrol(
  next: Patrol | undefined,
  following: Patrol | undefined
): { featured: Patrol | undefined; skippedFull: Patrol | undefined } {
  if (next && !isBookable(next) && following && isBookable(following)) {
    return { featured: following, skippedFull: next }
  }
  return { featured: next, skippedFull: undefined }
}
