import type { Metadata } from 'next'
import { Suspense } from 'react'
import ServiceForm from './ServiceForm'

export const metadata: Metadata = {
  title: 'Request a Free Junk Removal Estimate',
  description: 'Request a free in-person junk removal estimate in Metro Vancouver. Pick a time, get an exact price on the spot - no deposit, no obligation.',
  alternates: { canonical: 'https://www.stonegatemoving.com/book-service' },
}

export default function BookServicePage() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh' }} />}>
      <ServiceForm />
    </Suspense>
  )
}
