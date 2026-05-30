import Link from 'next/link'
import OrderForm from '@/components/order/OrderForm'

export const metadata = { title: 'Book Your Move — Stonegate Moving Solutions' }

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 font-medium">Back to home</Link>
          <h1 className="text-4xl font-extrabold text-gray-950 mt-4 tracking-tight">Book your move</h1>
          <p className="text-gray-500 mt-2">Fill in the details below. Takes about 2 minutes.</p>
        </div>
        <OrderForm />
      </div>
    </div>
  )
}
