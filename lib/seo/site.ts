import { CONTACT_PHONES, CONTACT_EMAIL } from '@/lib/contact'

export const SITE_URL = 'https://www.stonegatemoving.com'
export const BUSINESS_NAME = 'Stonegate Moving Solutions'

export const PRIMARY_PHONE = CONTACT_PHONES[0]


export const JUNK_BOOK_HREF = '/book-service?type=junk-removal'
export const MOVE_BOOK_HREF = '/order'

export interface SeoImage {
  src: string
  alt: string
  /** CSS object-position, e.g. 'center 40%' */
  pos?: string
}

export interface Faq {
  q: string
  a: string
}

export interface Crumb {
  name: string
  href: string
}

export const providerLd = {
  '@type': 'MovingCompany',
  '@id': `${SITE_URL}/#business`,
  name: BUSINESS_NAME,
  telephone: `+${PRIMARY_PHONE.replace(/\D/g, '')}`,
  email: CONTACT_EMAIL,
  url: SITE_URL,
  image: `${SITE_URL}/truck.png`,
  priceRange: '$$',
  address: { '@type': 'PostalAddress', addressLocality: 'Burnaby', addressRegion: 'BC', addressCountry: 'CA' },
  areaServed: { '@type': 'AdministrativeArea', name: 'Metro Vancouver' },
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
