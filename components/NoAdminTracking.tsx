'use client'

import { useEffect } from 'react'
import { GA4_MEASUREMENT_ID } from '@/lib/analytics'
import { GOOGLE_TAG_ID } from '@/lib/googleAds'

/**
 * Keeps admin activity out of Google Analytics and Google Ads. Google's tag stops sending hits for an ID once
 * window['ga-disable-<ID>'] is true. The root layout sets this before the tag loads when a visit starts on /admin;
 * this covers arriving at /admin by client-side navigation from the public site.
 */
export default function NoAdminTracking() {
  useEffect(() => {
    const w = window as unknown as Record<string, boolean>
    w[`ga-disable-${GA4_MEASUREMENT_ID}`] = true
    w[`ga-disable-${GOOGLE_TAG_ID}`] = true
  }, [])
  return null
}
