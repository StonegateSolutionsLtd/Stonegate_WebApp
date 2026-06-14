import type { Metadata } from 'next'
import Hero from '@/components/landing/Hero'

export const metadata: Metadata = {
  title: 'Apartment Moving in Vancouver & Metro Area | Stonegate Moving Solutions',
  description: 'Top-rated apartment moving company in Vancouver, Burnaby, Richmond, Surrey & all of Metro Vancouver. 2 professional movers with truck from $73/hr. Also offering bin cleaning and junk removal.',
  alternates: {
    canonical: 'https://stonegatemoving.com',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  name: 'Stonegate Moving Solutions',
  url: 'https://stonegatemoving.com',
  telephone: '+16043546479',
  email: 'orders@stonegatemoving.com',
  logo: 'https://stonegatemoving.com/logo.png',
  description: 'Professional apartment moving company serving Metro Vancouver. 2 movers with truck from $73–$95/hr. Also offering bin cleaning and junk removal.',
  areaServed: [
    'Vancouver', 'Burnaby', 'Richmond', 'Surrey', 'Coquitlam',
    'New Westminster', 'Port Coquitlam', 'Port Moody', 'Delta', 'North Vancouver',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Vancouver',
    addressRegion: 'BC',
    addressCountry: 'CA',
  },
  priceRange: '$73–$95/hr',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Moving Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Apartment Moving', description: '2 professional movers with truck, $73–$95/hr' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Bin Cleaning', description: 'High-pressure hot water washing, starting at $35/bin' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Junk Removal', description: 'Furniture, appliances, estate cleanouts, starting at $150' },
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
