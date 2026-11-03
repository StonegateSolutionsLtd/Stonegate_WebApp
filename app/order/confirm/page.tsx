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
    const order = raw ? (JSON.parse(raw) as OrderFormData) : null
    // A request saved by the older form has no move type; send it back through the new one
    return order?.moveType ? order : null
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
      <p className="text-center pt-20" style={{ color: '#9A8E83' }}>Loading your request...</p>
    </PageCanvas>
  )

  return (
    <PageCanvas backHref="/order" backLabel="← Edit request">
      <div className="max-w-lg mx-auto pt-8">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: '#1A1714' }}>
          Review your estimate request
        </h1>
        <p className="mt-2 text-base" style={{ color: '#9A8E83' }}>
          Make sure everything looks right before sending.
        </p>

        <div className="mt-8">
          <OrderSummary order={order} />
        </div>

        <div className="mt-4 p-4 rounded-xl text-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDE6DE', color: '#9A8E83' }}>
          We will contact you within 24 hours with your free estimate and to confirm your moving date.
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full font-bold rounded-xl border-0"
            style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Request My Free Estimate'}
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



