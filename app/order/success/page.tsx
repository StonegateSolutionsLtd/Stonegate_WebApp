import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PageCanvas from '@/components/PageCanvas'

export const metadata = { title: 'Order Received - Stonegate Moving Solutions' }

export default function SuccessPage() {
  return (
    <PageCanvas backHref="/" backLabel="â† Home">
      <div className="max-w-md mx-auto pt-16 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: '#254220', boxShadow: '0 4px 20px rgba(77,107,71,0.35)' }}
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-black tracking-tight" style={{ color: '#1A1714' }}>
          Order received
        </h1>
        <p className="mt-4 text-base leading-relaxed" style={{ color: '#9A8E83' }}>
          We&apos;ve received your request and will reach out within 24 hours to discuss the details and finalize your move.
        </p>

        <div className="mt-8 p-5 rounded-2xl text-sm text-left"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDE6DE', color: '#9A8E83' }}>
          Check your email for a confirmation with your order summary.
        </div>

        <div className="mt-8">
          <Link href="/">
            <Button
              className="font-bold rounded-xl px-8 border-0"
              style={{ backgroundColor: '#254220', color: '#FAF7F2', boxShadow: '0 4px 14px rgba(77,107,71,0.35)' }}
            >
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </PageCanvas>
  )
}



