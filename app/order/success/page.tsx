import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Order Received — Stonegate Moving Solutions' }

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-md w-full text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: '#4D6B47' }}
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: '#1A1714' }}>Order received</h1>
        <p className="mt-4 leading-relaxed" style={{ color: '#9A8E83' }}>
          We have received your request and will reach out within 24 hours to discuss the details and finalize your move.
        </p>
        <div
          className="mt-8 p-4 rounded-xl text-sm"
          style={{ backgroundColor: '#F0EBE3', border: '1px solid #E8E0D5', color: '#9A8E83' }}
        >
          Check your email for a confirmation with your order summary.
        </div>
        <div className="mt-8">
          <Link href="/">
            <Button
              className="font-bold rounded-full px-8 border-0"
              style={{ backgroundColor: '#4D6B47', color: '#FAF7F2' }}
            >
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
