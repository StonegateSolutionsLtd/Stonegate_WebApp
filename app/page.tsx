import type { Metadata } from 'next'
import Hero from '@/components/landing/Hero'

export const metadata: Metadata = {
  title: { absolute: 'Vancouver Movers & Moving Company in Burnaby | Stonegate Moving Solutions' },
  description: 'Stonegate Moving Solutions is a Vancouver moving company based in Burnaby, rated 4.9 on Google. Apartment, condo, house and office moves across Metro Vancouver from $130/hr + GST.',
  alternates: {
    canonical: 'https://www.stonegatemoving.com',
  },
}

// The MovingCompany structured data is rendered on every page by the root layout
export default function HomePage() {
  return <Hero />
}
