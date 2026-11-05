'use client'

import { useEffect } from 'react'
import '@/lib/analytics'

export default function ConversionEvent({ transactionId }: { transactionId: string }) {
  useEffect(() => {
    window.gtag?.('event', 'conversion', {
      send_to: 'AW-18221842465/eebtCKG90bocEKGA7fBD',
      transaction_id: transactionId,
    })
  }, [transactionId])

  return null
}
