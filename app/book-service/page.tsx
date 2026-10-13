import type { Metadata } from 'next'
import { Suspense } from 'react'
import ServiceForm from './ServiceForm'

export const metadata: Metadata = {
  title: 'Book Junk Removal Online',
  description: 'Book junk removal online in Metro Vancouver. Pick a 2-hour arrival window, no deposit - we confirm the price on site before we start.',
  alternates: { canonical: 'https://www.stonegatemoving.com/book-service' },
}

export default function BookServicePage() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh' }} />}>
      <ServiceForm />
    </Suspense>
  )
}
