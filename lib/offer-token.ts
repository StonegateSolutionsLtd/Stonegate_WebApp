import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

// An accepted offer's price comes back from the browser at submit, so
// /api/quote-options signs each offer and /api/service-requests only honours
// one whose signature, request details and expiry all check out.

// Long enough to finish the booking after saying yes (photos still upload).
const OFFER_TTL_MS = 30 * 60 * 1000

export interface OfferTerms {
  address: string
  date: string
  // The offered slot's start, "HH:MM".
  time: string
  loadSize: string
  price: number
  basePrice: number
  // The slot the customer picked first.
  originalTime: string
}

// Local dev without a configured secret: a per-process one, so offers work
// until the server restarts. Production must set QUOTE_SIGNING_SECRET (with
// several server instances a random one wouldn't verify), or no offers are made.
let devSecret: string | null = null
function signingSecret(): string | null {
  if (process.env.QUOTE_SIGNING_SECRET) return process.env.QUOTE_SIGNING_SECRET
  if (process.env.NODE_ENV !== 'development') return null
  return (devSecret ??= randomBytes(32).toString('hex'))
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

/** null when offers can't be signed here (no secret configured). */
export function signOffer(terms: OfferTerms): string | null {
  const secret = signingSecret()
  if (!secret) return null
  const payload = Buffer.from(JSON.stringify({ ...terms, exp: Date.now() + OFFER_TTL_MS })).toString('base64url')
  return `${payload}.${sign(payload, secret)}`
}

/**
 * The offer's terms when `token` is genuine, unexpired, and for this exact
 * booking (address, date, slot and load size); otherwise null.
 */
export function verifyOffer(
  token: string,
  booking: { address: string; date: string; time: string; loadSize: string }
): OfferTerms | null {
  const secret = signingSecret()
  const [payload, signature] = token.split('.')
  if (!secret || !payload || !signature) return null
  const expected = Buffer.from(sign(payload, secret))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null

  let terms: OfferTerms & { exp: number }
  try {
    terms = JSON.parse(Buffer.from(payload, 'base64url').toString())
  } catch {
    return null
  }
  if (terms.exp < Date.now()) return null
  if (
    terms.address !== booking.address.trim() ||
    terms.date !== booking.date ||
    terms.time !== booking.time.slice(0, 5) ||
    terms.loadSize !== booking.loadSize
  ) {
    return null
  }
  return {
    address: terms.address, date: terms.date, time: terms.time, loadSize: terms.loadSize,
    price: terms.price, basePrice: terms.basePrice, originalTime: terms.originalTime,
  }
}
