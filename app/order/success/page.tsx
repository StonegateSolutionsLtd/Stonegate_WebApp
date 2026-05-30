import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Order Received — Stonegate Moving Solutions' }

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-gray-950 flex items-center justify-center mx-auto mb-8">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-950 tracking-tight">Order received</h1>
        <p className="text-gray-500 mt-4 leading-relaxed">
          We have received your request and will reach out within 24 hours to discuss the details and finalize your move.
        </p>
        <div className="mt-8 p-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-400">
          Check your email for a confirmation with your order summary.
        </div>
        <div className="mt-8">
          <Link href="/">
            <Button className="bg-gray-950 text-white hover:bg-gray-800 font-bold rounded-full px-8">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
