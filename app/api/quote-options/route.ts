import { NextResponse, type NextRequest } from 'next/server'
import { openSlotTimes } from '@/lib/availability'
import { TRUCK_FRACTIONS, type TruckFractionLabel } from '@/lib/quote-pricing'
import { signOffer } from '@/lib/offer-token'
import { loadDayRows, requestEngineQuote } from '@/lib/quote-engine'
import { SLOT_STEP_MIN, addDays, formatSlotRange, timeToMinutes } from '@/lib/scheduling'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN = /^\d{2}:\d{2}$/

interface QuoteOptionsBody {
  address: string
  date: string
  // The slot the customer picked (its start, "HH:MM").
  time: string
  loadSize: TruckFractionLabel
  volumeYd3?: number
  onSiteMin?: number
}

/**
 * Cheaper slots on the same day for a junk removal the customer is about to
 * book. Only what the customer may see comes back; our costs stay here.
 */
export async function POST(request: NextRequest) {
  let body: QuoteOptionsBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  const { address, date, time, loadSize, volumeYd3, onSiteMin } = body
  if (
    typeof address !== 'string' || !address.trim() ||
    !DATE_PATTERN.test(date ?? '') || !TIME_PATTERN.test(time ?? '') ||
    !TRUCK_FRACTIONS.some(f => f.label === loadSize)
  ) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  let quote
  let open: Set<string>
  try {
    const [rows, previousDayRows, openTimes] = await Promise.all([
      loadDayRows(date),
      // What the truck may still have on board from the evening before.
      loadDayRows(addDays(date, -1)),
      openSlotTimes('junk_removal', date),
    ])
    open = openTimes
    quote = await requestEngineQuote(rows, previousDayRows, {
      address: address.trim(),
      preferredTime: time,
      loadSize,
      ...(typeof volumeYd3 === 'number' ? { volumeYd3 } : {}),
      ...(typeof onSiteMin === 'number' ? { onSiteMin } : {}),
    })
  } catch (err) {
    // The booking goes ahead at the normal price without offers.
    console.error('Quote options unavailable:', err)
    return NextResponse.json({ error: 'Quote options are unavailable right now' }, { status: 503 })
  }

  if (quote.warnings.length > 0) console.warn('Quote warnings:', quote.warnings)

  const offers = []
  // Only slots the booking form still offers, so an accepted offer can't be
  // turned away at submit with "that time was just booked".
  for (const o of quote.offers.filter(o => open.has(o.start))) {
    const token = signOffer({
      address: address.trim(), date, time: o.start, loadSize, price: o.price,
      basePrice: quote.basePrice, originalTime: time,
    })
    if (!token) {
      console.error('QUOTE_SIGNING_SECRET is not set: no offers made')
      break
    }
    offers.push({
      time: o.start,
      label: formatSlotRange(timeToMinutes(o.start), SLOT_STEP_MIN),
      price: o.price,
      discount: o.discount,
      token,
    })
  }

  return NextResponse.json({ basePrice: quote.basePrice, pickedFits: quote.pickedFits, offers })
}
