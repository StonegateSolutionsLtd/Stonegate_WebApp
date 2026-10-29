import type { CustomerOffer, CustomerQuote } from '@/lib/quote-engine'
import type { ServiceFormData } from '@/lib/service-chat'
import { timeToMinutes } from '@/lib/scheduling'

// Past this, the booking goes ahead as picked rather than keep the customer waiting.
const OFFER_TIMEOUT_MS = 8000

export interface BestOffer {
  offer: CustomerOffer
  basePrice: number
}

/**
 * The cheapest other slot the same day, or null when there's none worth
 * offering, or the engine is slow or down.
 */
export async function fetchBestOffer(booking: ServiceFormData): Promise<BestOffer | null> {
  try {
    const res = await fetch('/api/quote-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: booking.address, date: booking.date, time: booking.time, loadSize: booking.loadSize,
      }),
      signal: AbortSignal.timeout(OFFER_TIMEOUT_MS),
    })
    if (!res.ok) return null
    const quote: CustomerQuote = await res.json()
    return quote.offers.length > 0 ? { offer: quote.offers[0], basePrice: quote.basePrice } : null
  } catch {
    return null
  }
}

/** "Would you like to move your pickup 2 hours earlier, to 4:00pm–6:00pm, for $230 instead of $260?" */
export function offerMessage(pickedTime: string, { offer, basePrice }: BestOffer): string {
  const shift = timeToMinutes(offer.time) - timeToMinutes(pickedTime)
  const hours = Math.abs(shift) / 60
  return `Would you like to move your pickup ${hours} hour${hours === 1 ? '' : 's'} ${shift < 0 ? 'earlier' : 'later'}, ` +
    `to ${offer.label}, for $${offer.price} instead of $${basePrice}?`
}
