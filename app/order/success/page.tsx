import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Order Confirmed — Stonegate Moves' }

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-zinc-900">You&apos;re booked!</h1>
        <p className="text-zinc-500 mt-3 leading-relaxed">
          Your move has been confirmed. We will review your request and get in touch to finalise the details.
        </p>
        <div className="mt-8 p-4 bg-white rounded-lg border border-zinc-200 text-sm text-zinc-500">
          You will receive a follow-up call or email within 24 hours to confirm your time slot.
        </div>
        <div className="mt-8">
          <Link href="/">
            <Button variant="outline">Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
