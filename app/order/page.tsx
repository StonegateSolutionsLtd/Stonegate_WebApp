import Link from 'next/link'
import OrderForm from '@/components/order/OrderForm'

export const metadata = { title: 'Book Your Move — Stonegate Moves' }

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-700">← Back to home</Link>
          <h1 className="text-3xl font-bold text-zinc-900 mt-4">Book your move</h1>
          <p className="text-zinc-500 mt-1">Fill in the details below. Takes about 2 minutes.</p>
        </div>
        <OrderForm />
      </div>
    </div>
  )
}
