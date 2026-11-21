import Image from 'next/image'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/contact'
import { PhoneLink } from '@/components/PhoneNumber'
import { CITIES, cityHref } from '@/lib/seo/cities'
import { WORKSAFEBC_STATEMENT } from '@/lib/seo/site'

const MAIN_CITIES = ['vancouver', 'burnaby', 'surrey', 'coquitlam', 'richmond', 'new-westminster']

const columns: { title: string; links: { label: string; href: string; desktopOnly?: boolean }[] }[] = [
  {
    title: 'Moving',
    links: [
      { label: 'Local Moving', href: '/moving' },
      { label: 'Residential Moving', href: '/residential-moving' },
      { label: 'Apartment & Condo Moving', href: '/apartment-moving' },
      { label: 'Commercial Moving & Corporate Relocation', href: '/commercial-moving' },
      { label: 'Office Moving', href: '/office-moving' },
      { label: 'Long-Distance Moving', href: '/long-distance-moving' },
      { label: 'Senior Moving', href: '/senior-moving' },
      { label: 'Specialty Moving', href: '/specialty-moving' },
      { label: 'Packing Services', href: '/packing-services' },
    ],
  },
  {
    title: 'Service Areas',
    links: [
      // On phones only the main cities show (the rest are hidden there, still linked on larger screens and on /locations)
      ...CITIES.map(c => ({ label: c.name, href: cityHref(c), desktopOnly: !MAIN_CITIES.includes(c.slug) })),
      { label: 'View All Areas', href: '/locations' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Customer Reviews', href: '/reviews' },
      { label: 'Moving Prices', href: '/pricing/moving' },
      { label: 'Moving Guides', href: '/guides' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #E6DFF0', backgroundColor: '#FFFFFF' }}>
      <div className="max-w-6xl 3xl:max-w-[2200px] mx-auto px-6 3xl:px-16 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Stonegate logo" width={40} height={40} className="h-9 w-9 object-cover" />
              <span className="font-extrabold text-base tracking-tight" style={{ color: '#1E1530' }}>Stonegate</span>
            </Link>
            <div className="flex flex-col gap-1.5">
              <PhoneLink className="text-sm font-semibold transition-opacity hover:opacity-60" style={{ color: '#5F5870' }} />
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-semibold transition-opacity hover:opacity-60" style={{ color: '#5F5870' }}>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          {columns.map(col => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="text-sm font-extrabold" style={{ color: '#1E1530' }}>{col.title}</p>
              {col.links.map(link => (
                <Link key={link.href} href={link.href} className={`${link.desktopOnly ? 'hidden sm:block' : ''} text-sm font-medium transition-opacity hover:opacity-60`} style={{ color: '#5F5870' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
          <span className="text-sm font-medium" style={{ color: '#5F5870' }}>© {new Date().getFullYear()} Stonegate Moving Solutions. All rights reserved.</span>
          <span className="text-sm font-medium" style={{ color: '#5F5870' }}>{WORKSAFEBC_STATEMENT}</span>
        </div>
      </div>
    </footer>
  )
}
