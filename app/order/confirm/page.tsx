'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { type OrderFormData } from '@/lib/types'
import OrderSummary from '@/components/order/OrderSummary'
import { Button } from '@/components/ui/button'
import PageCanvas from '@/components/PageCanvas'

function readStoredOrder(): OrderFormData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem('pendingOrder')
    return raw ? (JSON.parse(raw) as OrderFormData) : null
  } catch { return null }
}

export default function ConfirmPage() {
  const router = useRouter()
  const [order]      = useState<OrderFormData | null>(readStoredOrder)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => { if (!order) router.replace('/order') }, [order, router])

  async function handleConfirm() {
    if (!order) return
    setError(''); setSubmitting(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
    setSubmitting(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Something went wrong. Please try again.')
      return
    }
    const { orderId } = await res.json()
    sessionStorage.removeItem('pendingOrder')
    router.push(`/order/success?id=${orderId}`)
  }

  if (!order) return (
    <PageCanvas>
      <p className="text-center pt-20" style={{ color: '#9A8E83' }}>Loading your order...</p>
    </PageCanvas>
  )

  return (
    <PageCanvas backHref="/order" backLabel="← Edit order">
      <div className="max-w-lg mx-auto pt-8">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: '#1A1714' }}>
          Confirm your order
        </h1>
        <p className="mt-2 text-base" style={{ color: '#9A8E83' }}>
          Review everything below, then hit confirm.
        </p>

        <div className="mt-8">
          <OrderSummary order={order} />
        </div>

        <div className="mt-4 p-4 rounded-xl text-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDE6DE', color: '#9A8E83' }}>
          After confirming, we will reach out to discuss the details and finalize the price.
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full font-bold rounded-xl border-0"
            style={{ backgroundColor: '#4D6B47', color: '#FAF7F2' }}
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? 'Confirming...' : 'Confirm Order'}
          </Button>
          <Link href="/order">
            <Button variant="ghost" className="w-full" style={{ color: '#9A8E83' }}>
              Go back and edit
            </Button>
          </Link>
        </div>
      </div>
    </PageCanvas>
  )
}
