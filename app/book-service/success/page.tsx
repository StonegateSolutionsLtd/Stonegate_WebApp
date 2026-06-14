import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Request Sent · Stonegate Moving Solutions',
}

export default function ServiceSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center py-20">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: '#E8F0E6' }}
          >
            <CheckCircle2 size={32} style={{ color: '#254220' }} />
          </div>
          <h1 className="text-3xl font-extrabold mb-4" style={{ color: '#1A1714' }}>
            Request sent!
          </h1>
          <p className="text-base leading-relaxed mb-2" style={{ color: '#6B5E54' }}>
            We&apos;ve received your request and will get back to you the same day.
          </p>
          <p className="text-base leading-relaxed mb-10" style={{ color: '#6B5E54' }}>
            Check your email for a confirmation.
          </p>
          <Link href="/">
            <Button
              className="rounded-full text-sm font-bold px-10 py-6 border-0"
              style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
      <footer style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <span className="text-sm font-medium" style={{ color: '#B5A99E' }}>
            © {new Date().getFullYear()} Stonegate Moving Solutions. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  )
}



