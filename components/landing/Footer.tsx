import Image from 'next/image'
import Link from 'next/link'
import { CONTACT_PHONES, CONTACT_EMAIL } from '@/lib/contact'

const columns = [
  {
    title: 'Moving',
    links: [
      { label: 'Moving Services', href: '/moving' },
      { label: 'Residential Moving', href: '/moving#residential-moving' },
      { label: 'Apartment & Condo Moving', href: '/moving#apartment-moving' },
      { label: 'Commercial & Office Moving', href: '/moving#commercial-moving' },
      { label: 'Small Moves', href: '/moving#small-moves' },
      { label: 'Long-Distance Moving', href: '/moving#long-distance-moving' },
    ],
  },
  {
    title: 'Junk Removal',
    links: [
      { label: 'Junk Removal', href: '/junk-removal' },
      { label: 'Furniture Removal', href: '/junk-removal#furniture-removal' },
      { label: 'Appliance Removal', href: '/junk-removal#appliance-removal' },
      { label: 'Property Cleanouts', href: '/junk-removal#property-cleanouts' },
      { label: 'Commercial Junk Removal', href: '/junk-removal#commercial-junk-removal' },
      { label: 'Construction Debris Removal', href: '/junk-removal#construction-debris-removal' },
    ],
  },
  {
    title: 'Service Areas',
    links: [
      { label: 'Burnaby', href: '/burnaby-movers' },
      { label: 'View All Areas', href: '/locations' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Stonegate logo" width={40} height={40} className="h-9 w-9 object-cover" />
              <span className="font-extrabold text-base tracking-tight" style={{ color: '#1A1714' }}>Stonegate</span>
            </Link>
            <div className="flex flex-col gap-1.5">
              {CONTACT_PHONES.slice(0, 1).map(phone => (
                <a key={phone} href={`tel:${phone.replace(/\D/g, '')}`} className="text-sm font-semibold transition-opacity hover:opacity-60" style={{ color: '#6B5E54' }}>
                  {phone}
                </a>
              ))}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-semibold transition-opacity hover:opacity-60" style={{ color: '#6B5E54' }}>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          {columns.map(col => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9A8E83' }}>{col.title}</p>
              {col.links.map(link => (
                <Link key={link.href} href={link.href} className="text-sm font-medium transition-opacity hover:opacity-60" style={{ color: '#6B5E54' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #E8E0D5', paddingTop: '24px' }}>
          <span className="text-sm font-medium" style={{ color: '#B5A99E' }}>© {new Date().getFullYear()} Stonegate Moving Solutions. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
