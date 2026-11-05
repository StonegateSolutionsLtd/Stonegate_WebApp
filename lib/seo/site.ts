import { CONTACT_PHONES, CONTACT_EMAIL } from '@/lib/contact'
import { CITIES } from './cities'

export const SITE_URL = 'https://www.stonegatemoving.com'
export const BUSINESS_NAME = 'Stonegate Moving Solutions'

export const PRIMARY_PHONE = CONTACT_PHONES[0]

export const MOVE_BOOK_HREF = '/order'

export interface SeoImage {
  src: string
  alt: string
  /** CSS object-position, e.g. 'center 40%' */
  pos?: string
  /** CSS brightness() for photos taken in low light, e.g. 1.4 */
  brightness?: number
}

export interface Faq {
  q: string
  a: string
}

export interface Crumb {
  name: string
  href: string
}

const BUSINESS_ID = `${SITE_URL}/#business`

/** Official profiles of the business, listed as sameAs - add each social profile here once it exists */
export const BUSINESS_PROFILES = [
  'https://maps.app.goo.gl/ooQYs564eGP7JZbC6', // Google Business Profile
]

const MOVING_SERVICES_LD = [
  { name: 'Local Moving', path: '/moving' },
  { name: 'Residential Moving', path: '/residential-moving' },
  { name: 'Commercial Moving & Corporate Relocation', path: '/commercial-moving' },
  { name: 'Office Moving', path: '/office-moving' },
  { name: 'Packing Services', path: '/packing-services' },
  { name: 'Apartment & Condo Moving', path: '/apartment-moving' },
  { name: 'Long-Distance Moving', path: '/long-distance-moving' },
  { name: 'Senior Moving', path: '/senior-moving' },
  { name: 'Specialty Moving', path: '/specialty-moving' },
]

export const RATE_TERMS = 'Hourly rate plus GST, 3-hour minimum, plus a one-time flat-rate travel fee explained before booking.'

/** An hourly moving rate with its conditions, so the price never reads as a complete flat price */
export function hourlyOfferLd(name: string, rate: number) {
  return {
    '@type': 'Offer',
    name,
    description: `${name}: $${rate}/hr. ${RATE_TERMS}`,
    priceCurrency: 'CAD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: rate,
      priceCurrency: 'CAD',
      unitCode: 'HUR',
      unitText: 'per hour',
      valueAddedTaxIncluded: false,
      eligibleQuantity: { '@type': 'QuantitativeValue', minValue: 3, unitCode: 'HUR' },
    },
  }
}

/** The business itself - rendered once on every page (root layout); other pages point to it through providerLd */
export const businessLd = {
  '@type': 'MovingCompany',
  '@id': BUSINESS_ID,
  name: BUSINESS_NAME,
  alternateName: 'Stonegate Moving',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/truck.png`,
  description: 'Local moving company in Metro Vancouver, BC. Apartment, condo, house and commercial moves and packing, with 2 movers and a truck from $130/hr + GST or 3 movers with a 16\' truck from $170/hr + GST.',
  telephone: `+${PRIMARY_PHONE.replace(/\D/g, '')}`,
  email: CONTACT_EMAIL,
  priceRange: '$130-$170/hr + GST',
  currenciesAccepted: 'CAD',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2186 Gilmore Ave',
    addressLocality: 'Burnaby',
    addressRegion: 'BC',
    postalCode: 'V5C 0N7',
    addressCountry: 'CA',
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Metro Vancouver' },
    ...CITIES.map(c => ({ '@type': 'City', name: `${c.name}, BC` })),
  ],
  sameAs: BUSINESS_PROFILES,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Moving Services',
    itemListElement: MOVING_SERVICES_LD.map(s => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, serviceType: s.name, url: `${SITE_URL}${s.path}`, provider: { '@id': BUSINESS_ID } },
    })),
  },
  makesOffer: [
    hourlyOfferLd('2 movers with a truck', 130),
    hourlyOfferLd("3 movers with a 16' truck", 170),
  ],
}

export const websiteLd = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: BUSINESS_NAME,
  url: SITE_URL,
  inLanguage: 'en-CA',
  publisher: { '@id': BUSINESS_ID },
}

/** Points a page's Service at the business defined in the root layout */
export const providerLd = {
  '@type': 'MovingCompany',
  '@id': BUSINESS_ID,
  name: BUSINESS_NAME,
  url: SITE_URL,
  telephone: businessLd.telephone,
}

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.href === '/' ? '' : c.href}`,
    })),
  }
}

export function faqLd(faqs: Faq[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}
