import type { Metadata } from 'next'
import { Suspense } from 'react'
import ServiceForm from './ServiceForm'

export const metadata: Metadata = {
  title: 'Book a Service · Stonegate Moving Solutions',
}

export default function BookServicePage() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh' }} />}>
      <ServiceForm />
    </Suspense>
  )
}
