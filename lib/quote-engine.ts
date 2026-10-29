import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { LOCAL_WITHOUT_SUPABASE, createServiceClient } from '@/lib/supabase/server'
import type { TruckFractionLabel } from '@/lib/quote-pricing'

// The Python quoting engine (engine/) runs alongside Next, like the chat
// server, and is never exposed to the browser directly.
const ENGINE_SERVER_URL = process.env.ENGINE_SERVER_URL ?? 'http://127.0.0.1:8001'
const ENGINE_SERVER_SECRET = process.env.ENGINE_SERVER_SECRET

/** One day's orders, in the shape engine/fleet_engine/stonegate.py reads. */
export interface DayRows {
  service_orders: Record<string, unknown>[]
  orders: Record<string, unknown>[]
  calendar_jobs: Record<string, unknown>[]
}

export interface EngineOffer {
  start: string
  end: string
  price: number
  discount: number
  message: string
  // For staff only: what the move saves us, and price minus our cost.
  ourSaving: number
  margin: number
}

export interface EngineQuote {
  tier: TruckFractionLabel
  basePrice: number
  pickedFits: boolean
  pickedCost: number | null
  carryInYd3: number
  warnings: string[]
  offers: EngineOffer[]
  slots: { start: string; end: string; fits: boolean; extraCost: number | null }[]
}

/** What /api/quote-options gives the browser: no costs or margins. */
export interface CustomerOffer {
  time: string
  label: string
  price: number
  discount: number
  // Signed terms, sent back with the booking if the customer accepts.
  token: string
}

export interface CustomerQuote {
  basePrice: number
  pickedFits: boolean
  offers: CustomerOffer[]
}

export interface QuoteRequest {
  address: string
  preferredTime: string
  loadSize?: TruckFractionLabel
  // The chat's estimates, when it has them.
  volumeYd3?: number
  onSiteMin?: number
}

/**
 * Everything that takes the truck on `date`: the same tables and filters as
 * loadBusyByDate in lib/availability.ts. Only the columns the engine needs;
 * no customer names or contact details leave the site.
 */
export async function loadDayRows(date: string): Promise<DayRows> {
  if (LOCAL_WITHOUT_SUPABASE) return localDayRows(date)

  const supabase = createServiceClient()
  const [serviceOrders, orders, calendarJobs] = await Promise.all([
    supabase
      .from('service_orders')
      .select('id, order_number, address, service_date, service_time, load_size, duration_minutes, status')
      .neq('status', 'cancelled')
      .eq('service_date', date),
    supabase
      .from('orders')
      .select('id, order_number, pickup_address, dropoff_address, moving_date, moving_time, duration_minutes, status')
      .neq('status', 'cancelled')
      .eq('moving_date', date),
    supabase
      .from('calendar_jobs')
      .select('id, job_type, event_date, event_time, duration_minutes, pickup_address, order_id, service_order_id')
      .eq('event_date', date),
  ])

  // Fail closed, like availability: quoting against a day that looks empty
  // would offer windows that are already taken.
  const failure = serviceOrders.error ?? orders.error ?? calendarJobs.error
  if (failure) throw new Error(`Day lookup failed: ${failure.message}`)

  return {
    service_orders: serviceOrders.data ?? [],
    orders: orders.data ?? [],
    calendar_jobs: calendarJobs.data ?? [],
  }
}

/**
 * Local dev without Supabase: the junk removals the booking form saved to
 * data/service-orders/ (app/api/service-requests), so offers can be tried on
 * localhost. Availability still shows every slot open there.
 */
async function localDayRows(date: string): Promise<DayRows> {
  const rows: DayRows = { service_orders: [], orders: [], calendar_jobs: [] }
  const dir = path.join(process.cwd(), 'data', 'service-orders')
  let names: string[]
  try {
    names = await readdir(dir)
  } catch {
    return rows
  }
  for (const name of names.filter(n => n.endsWith('.txt'))) {
    try {
      const order = JSON.parse(await readFile(path.join(dir, name), 'utf8'))
      if (order.date !== date || order.status === 'cancelled') continue
      rows.service_orders.push({
        id: order.orderId, address: order.address, service_time: order.time, load_size: order.loadSize,
        status: order.status,
      })
    } catch {
      // Not an order file we can read: skip it.
    }
  }
  return rows
}

export async function requestEngineQuote(
  rows: DayRows,
  previousDayRows: DayRows,
  request: QuoteRequest
): Promise<EngineQuote> {
  const res = await fetch(`${ENGINE_SERVER_URL}/quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(ENGINE_SERVER_SECRET ? { 'X-Engine-Secret': ENGINE_SERVER_SECRET } : {}),
    },
    body: JSON.stringify({ rows, previousDayRows, ...request }),
  })
  if (!res.ok) throw new Error(`Quoting engine error ${res.status}: ${await res.text()}`)
  return res.json()
}
