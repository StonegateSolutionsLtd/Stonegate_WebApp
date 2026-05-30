'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { type OrderFormData } from '@/lib/types'
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading your order...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <Link href="/order" className="text-sm text-gray-400 hover:text-gray-700 font-medium">Edit order</Link>
          <h1 className="text-4xl font-extrabold text-gray-950 mt-4 tracking-tight">Confirm your order</h1>
          <p className="text-gray-500 mt-2">Review everything below, then hit confirm.</p>
        </div>

        <OrderSummary order={order} />

        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-500">
          After confirming, we will reach out to discuss the details and finalize the price.
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full bg-gray-950 text-white hover:bg-gray-800 font-bold rounded-xl"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? 'Confirming...' : 'Confirm Order'}
          </Button>
          <Link href="/order">
            <Button variant="ghost" className="w-full text-gray-400 hover:text-gray-700">Go back and edit</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
