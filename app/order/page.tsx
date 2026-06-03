import Link from 'next/link'
import OrderForm from '@/components/order/OrderForm'

export const metadata = { title: 'Book Your Move - Stonegate Moving Solutions' }

export default function OrderPage() {
  return (
    <div className="min-h-screen px-4 py-12" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium transition-colors" style={{ color: '#9A8E83' }}>
            Back to home
          </Link>
          <h1 className="text-4xl font-extrabold mt-4 tracking-tight" style={{ color: '#1A1714' }}>
            Book your move
          </h1>
          <p className="mt-2" style={{ color: '#9A8E83' }}>Fill in the details below. Takes about 2 minutes.</p>
        </div>
        <OrderForm />
      </div>
    </div>
  )
}
