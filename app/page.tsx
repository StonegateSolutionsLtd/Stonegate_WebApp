import type { Metadata } from 'next'
import Hero from '@/components/landing/Hero'

export const metadata: Metadata = {
  title: { absolute: 'Vancouver Movers - Local Moving Company | Stonegate Moving Solutions' },
  description: 'Local movers in Vancouver, Burnaby, Richmond, Surrey & all of Metro Vancouver. Apartment, house and small moves with 2 professional movers and a truck from $120/hr + GST.',
  alternates: {
    canonical: 'https://www.stonegatemoving.com',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  name: 'Stonegate Moving Solutions',
  url: 'https://www.stonegatemoving.com',
  telephone: '+16723360022',
  email: 'orders@stonegatemoving.com',
  logo: 'https://www.stonegatemoving.com/logo.png',
  description: 'Apartment, house and small moves across Metro Vancouver. 2 movers with truck from $120/hr + GST.',
  areaServed: [
    'Vancouver', 'Burnaby', 'Richmond', 'Surrey', 'Coquitlam',
    'New Westminster', 'Port Coquitlam', 'Port Moody', 'Delta', 'North Vancouver',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Burnaby',
    addressRegion: 'BC',
    addressCountry: 'CA',
  },
  priceRange: '$120/hr + GST',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Moving Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Apartment Moving', description: '2 professional movers with truck, $120/hr + GST, 3-hour minimum' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'House Moving', description: '2 movers from $120/hr or 3 movers with a 16\' truck from $160/hr + GST, 3-hour minimum' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Small Moves', description: 'A single room, a studio or a few large pieces, 3-hour minimum' },
      },
    ],
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
    </>
  )
}
