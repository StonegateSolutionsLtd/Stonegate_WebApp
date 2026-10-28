import Image from 'next/image'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/contact'
import { PhoneLink } from '@/components/PhoneNumber'
import { JUNK_ITEM_BY_SLUG, junkItemHref } from '@/lib/seo/junk-items'
import { CITIES, cityHref } from '@/lib/seo/cities'

const FOOTER_JUNK_SLUGS = [
  'furniture-removal', 'couch-removal', 'mattress-removal', 'appliance-removal', 'hot-tub-removal',
  'garage-cleanout', 'estate-cleanout', 'construction-debris-removal', 'commercial-junk-removal',
]

const columns = [
  {
    title: 'Moving',
    links: [
      { label: 'Local Moving', href: '/moving' },
      { label: 'Residential Moving', href: '/residential-moving' },
      { label: 'Commercial Moving & Corporate Relocation', href: '/commercial-moving' },
      { label: 'Packing Services', href: '/packing-services' },
    ],
  },
  {
    title: 'Junk Removal',
    links: [
      { label: 'Junk Removal', href: '/junk-removal' },
      { label: 'What We Take', href: '/junk-removal/what-we-take' },
      ...FOOTER_JUNK_SLUGS.map(s => ({ label: JUNK_ITEM_BY_SLUG.get(s)!.name, href: junkItemHref(s) })),
    ],
  },
  {
    title: 'Service Areas',
    links: [
      ...CITIES.map(c => ({ label: c.name, href: cityHref(c) })),
      { label: 'View All Areas', href: '/locations' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Junk Removal Prices', href: '/pricing/junk-removal' },
      { label: 'Moving Prices', href: '/pricing/moving' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
      <div className="max-w-6xl 3xl:max-w-[2200px] mx-auto px-6 3xl:px-16 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Stonegate logo" width={40} height={40} className="h-9 w-9 object-cover" />
              <span className="font-extrabold text-base tracking-tight" style={{ color: '#1A1714' }}>Stonegate</span>
            </Link>
            <div className="flex flex-col gap-1.5">
              <PhoneLink className="text-sm font-semibold transition-opacity hover:opacity-60" style={{ color: '#6B5E54' }} />
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-semibold transition-opacity hover:opacity-60" style={{ color: '#6B5E54' }}>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          {columns.map(col => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="text-sm font-extrabold" style={{ color: '#1A1714' }}>{col.title}</p>
              {col.links.map(link => (
                <Link key={link.href} href={link.href} className="text-sm font-medium transition-opacity hover:opacity-60" style={{ color: '#6B5E54' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ paddingTop: '8px' }}>
          <span className="text-sm font-medium" style={{ color: '#6B5E54' }}>© {new Date().getFullYear()} Stonegate Moving Solutions. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
