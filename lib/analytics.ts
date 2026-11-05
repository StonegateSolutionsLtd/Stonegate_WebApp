/**
 * GA4 property. Not configured in code: it is a destination of the Google tag (AW-18221842465) in the
 * root layout, set up in the Google tag settings. A second gtag('config') here would double page views.
 */
export const GA4_MEASUREMENT_ID = 'G-WZ8RQRW987'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Sends a custom event to GA4 only (send_to keeps it away from the Google Ads destination).
 * Returns whether the event was handed to gtag (queued, not confirmed received by Google).
 */
export function trackEvent(name: string, params: Record<string, string | number | undefined> = {}): boolean {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false
  window.gtag('event', name, { ...params, send_to: GA4_MEASUREMENT_ID })
  return true
}

/** generate_lead once per order, even if the confirm step runs again for the same order */
export function trackLead(orderId: string, params: Record<string, string | undefined> = {}) {
  const key = 'ga4LeadTracked'
  try { if (sessionStorage.getItem(key) === orderId) return } catch {}
  // Only marked as tracked once gtag actually took the event
  if (!trackEvent('generate_lead', params)) return
  try { sessionStorage.setItem(key, orderId) } catch {}
}

/** "homepage_hero" on /, "<path>_hero" elsewhere (e.g. "pricing_moving_hero"). */
export function formLocationFor(pathname: string) {
  const slug = pathname.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '_')
  return `${slug || 'homepage'}_hero`
}
