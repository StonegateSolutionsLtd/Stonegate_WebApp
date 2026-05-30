'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EMPTY_ORDER_FORM, type OrderFormData } from '@/lib/types'
import OrderSummary from '@/components/order/OrderSummary'
import { Button } from '@/components/ui/button'

export default function ConfirmPage() {
  const router = useRouter()
  const [order, setOrder] = useState<OrderFormData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('pendingOrder')
    if (!raw) {
      router.replace('/order')
      return
    }
    try {
      setOrder(JSON.parse(raw))
    } catch {
      router.replace('/order')
    }
  }, [router])

  async function handleConfirm() {
    if (!order) return
    setError('')
    setSubmitting(true)

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

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-zinc-400">Loading your order…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <Link href="/order" className="text-sm text-zinc-400 hover:text-zinc-700">← Edit order</Link>
          <h1 className="text-3xl font-bold text-zinc-900 mt-4">Confirm your order</h1>
          <p className="text-zinc-500 mt-1">Review everything below, then hit confirm.</p>
        </div>

        <OrderSummary order={order} />

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          After confirming, we will reach out to you to discuss further details including the price.
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? 'Confirming…' : 'Confirm Order'}
          </Button>
          <Link href="/order">
            <Button variant="ghost" className="w-full">Go back and edit</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
