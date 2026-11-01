import type { Metadata } from 'next'
import Hero from '@/components/landing/Hero'

export const metadata: Metadata = {
  title: { absolute: 'Vancouver Movers - Local Moving Company | Stonegate Moving Solutions' },
  description: 'Local movers in Vancouver, Burnaby, Richmond, Surrey & all of Metro Vancouver. Apartment, condo and house moves with 2 professional movers and a truck from $130/hr + GST.',
  alternates: {
    canonical: 'https://www.stonegatemoving.com',
  },
}

// The MovingCompany structured data is rendered on every page by the root layout
export default function HomePage() {
  return <Hero />
}
