import { NextResponse, type NextRequest } from 'next/server'
import { loadBusyByDate, parseJobType } from '@/lib/availability'
import {
  BUSINESS_START_MIN,
  DEFAULT_DURATION_MIN,
  addDays,
  computeAvailableSlots,
  conflictDurationFor,
  nowInBusinessZone,
  type DayAvailability,
} from '@/lib/scheduling'

const MAX_DAYS = 14
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  const jobType = parseJobType(params.get('type'))
  if (!jobType) {
    return NextResponse.json({ error: 'Unknown job type' }, { status: 400 })
  }

  const today = nowInBusinessZone()
  const requestedStart = params.get('start')
  if (requestedStart && !DATE_PATTERN.test(requestedStart)) {
    return NextResponse.json({ error: 'Invalid start date' }, { status: 400 })
  }

  // Never offer a window that has already passed.
  const start = requestedStart && requestedStart > today.date ? requestedStart : today.date
  const days = Math.min(Number(params.get('days')) || 7, MAX_DAYS)
  const end = addDays(start, days - 1)

  let busyByDate
  try {
    busyByDate = await loadBusyByDate(start, end)
  } catch (err) {
    console.error('Availability lookup failed:', err)
    return NextResponse.json({ error: 'Could not load availability' }, { status: 503 })
  }

  // The nominal duration is what we tell the customer to expect; the conflict
  // duration is the padded worst-case used to decide which buckets are safe.
  const durationMinutes = DEFAULT_DURATION_MIN[jobType]
  const conflictMinutes = conflictDurationFor(jobType)

  const result: DayAvailability[] = []
  for (let i = 0; i < days; i++) {
    const date = addDays(start, i)
    result.push({
      date,
      slots: computeAvailableSlots({
        busy: busyByDate[date] ?? [],
        durationMinutes: conflictMinutes,
        minStartMinutes: date === today.date ? today.minutes : BUSINESS_START_MIN,
      }),
    })
  }

  return NextResponse.json({ jobType, durationMinutes, days: result })
}
