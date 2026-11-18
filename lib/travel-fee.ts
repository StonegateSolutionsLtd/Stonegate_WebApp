import { addDays, nowInBusinessZone } from '@/lib/scheduling'

/**
 * Travel fee: the truck's drive from where it parks to the pickup, and from the drop-off back again,
 * charged at TRAVEL_RATE_PER_HOUR. Drive times come from Mapbox (driving-traffic with a departure time,
 * so they reflect typical traffic for that weekday and hour).
 *
 * Server-only: uses MAPBOX_SERVER_TOKEN, a token without URL restrictions (server requests send no referrer),
 * falling back to the public browser token.
 */

import { DEFAULT_JOB_HOURS, DEFAULT_START, DEPOT, TRAVEL_RATE_PER_HOUR, type TravelEstimate, type TravelLeg } from '@/lib/travel-fee-info'

export * from '@/lib/travel-fee-info'

const token = () => process.env.MAPBOX_SERVER_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN

async function geocode(address: string): Promise<{ coords: [number, number]; label: string } | null> {
  const params = new URLSearchParams({ q: address, country: 'ca', proximity: '-123.1207,49.2827', limit: '1', access_token: token()! })
  const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params}`, { cache: 'no-store' })
  if (!res.ok) return null
  const f = (await res.json()).features?.[0]
  if (!f) return null
  return { coords: f.geometry.coordinates, label: String(f.properties.full_address ?? f.properties.name ?? '').replace(/,\s*Canada$/, '') }
}

async function drive(from: readonly [number, number], to: readonly [number, number], departAt: string): Promise<TravelLeg | null> {
  const params = new URLSearchParams({ depart_at: departAt, overview: 'false', access_token: token()! })
  const res = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${from.join(',')};${to.join(',')}?${params}`, { cache: 'no-store' })
  if (!res.ok) return null
  const route = (await res.json()).routes?.[0]
  if (!route) return null
  return { minutes: Math.ceil(route.duration / 60), km: Math.round(route.distance / 100) / 10, departAt }
}

/** A traffic prediction needs a future time: a past move date is moved forward by whole weeks, keeping the weekday */
function futureDate(date: string): string {
  const today = nowInBusinessZone().date
  let d = date
  while (d < today) d = addDays(d, 7)
  return d
}

function addMinutes(date: string, time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  const day = addDays(date, Math.floor(total / 1440))
  const t = ((total % 1440) + 1440) % 1440
  return `${day}T${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

/**
 * Out: depot → pickup, leaving at the start time (9am by default).
 * Back: drop-off → depot, leaving at the start time plus the job length.
 * Returns null when Mapbox is not configured, an address cannot be found, or no route comes back.
 */
export async function estimateTravel({ pickup, dropoff, date, startTime, jobHours }: {
  pickup: string
  dropoff: string
  date: string
  startTime?: string | null
  jobHours?: number | null
}): Promise<TravelEstimate | null> {
  if (!token() || !pickup.trim() || !dropoff.trim()) return null
  const start = (startTime || DEFAULT_START).slice(0, 5)
  const hours = jobHours && jobHours > 0 ? jobHours : DEFAULT_JOB_HOURS
  const day = futureDate(date)

  const [p, d] = await Promise.all([geocode(pickup), geocode(dropoff)])
  if (!p || !d) return null

  const departOut = `${day}T${start}`
  const departBack = addMinutes(day, start, Math.round(hours * 60))
  const [out, back] = await Promise.all([drive(DEPOT.coords, p.coords, departOut), drive(d.coords, DEPOT.coords, departBack)])
  if (!out || !back) return null

  const totalMinutes = out.minutes + back.minutes
  return {
    out,
    back,
    totalMinutes,
    fee: Math.round((totalMinutes / 60) * TRAVEL_RATE_PER_HOUR),
    rate: TRAVEL_RATE_PER_HOUR,
    pickupMatch: p.label,
    dropoffMatch: d.label,
    startTime: start,
    jobHours: hours,
    computedAt: new Date().toISOString(),
  }
}
