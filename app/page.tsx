import type { Metadata } from 'next'
import Hero from '@/components/landing/Hero'

export const metadata: Metadata = {
  title: { absolute: 'Movers in Vancouver | Local Moving Company | Stonegate' },
  description: 'Local movers in Vancouver, Burnaby, Surrey and Coquitlam. Stonegate is a moving company rated 4.9 on Google: house, apartment, condo and office moves from $130/hr + GST.',
  alternates: {
    canonical: 'https://www.stonegatemoving.com',
  },
}

// The MovingCompany structured data is rendered on every page by the root layout
export default function HomePage() {
  return <Hero />
}
