'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X, Phone, Menu, ChevronDown, ChevronRight, Home } from 'lucide-react'
import { PhoneNumber, usePhoneNumber } from '@/components/PhoneNumber'
import { CITIES, cityHref } from '@/lib/seo/cities'

interface NavLink {
  label: string
  href: string
}

interface NavGroup {
  label: string
  href: string
  links: NavLink[]
}

const movingGroup: NavGroup = {
  label: 'Moving',
  href: '/moving',
  links: [
    { label: 'Moving Services', href: '/moving' },
    { label: 'Residential Moving', href: '/moving#residential-moving' },
    { label: 'Apartment & Condo Moving', href: '/moving#apartment-moving' },
    { label: 'Commercial & Office Moving', href: '/moving#commercial-moving' },
    { label: 'Small Moves', href: '/moving#small-moves' },
    { label: 'Long-Distance Moving', href: '/moving#long-distance-moving' },
    { label: 'Moving Pricing', href: '/pricing/moving' },
  ],
}

const junkGroup: NavGroup = {
  label: 'Junk Removal',
  href: '/junk-removal',
  links: [
    { label: 'Junk Removal Services', href: '/junk-removal' },
    { label: 'What We Take', href: '/junk-removal/what-we-take' },
    { label: 'Furniture Removal', href: '/junk-removal/furniture-removal' },
    { label: 'Appliance Removal', href: '/junk-removal/appliance-removal' },
    { label: 'Mattress Removal', href: '/junk-removal/mattress-removal' },
    { label: 'Garage & Estate Cleanouts', href: '/junk-removal/what-we-take#cleanouts' },
    { label: 'Construction Debris Removal', href: '/junk-removal/construction-debris-removal' },
    { label: 'Commercial Junk Removal', href: '/junk-removal/commercial-junk-removal' },
    { label: 'Junk Removal Pricing', href: '/pricing/junk-removal' },
  ],
}

const locationsGroup: NavGroup = {
  label: 'Locations',
  href: '/locations',
  links: [
    { label: 'All Areas We Serve', href: '/locations' },
    ...CITIES.map(c => ({ label: c.name, href: cityHref(c) })),
  ],
}

// Junk removal pricing lives in the Junk Removal menu; Pricing is moving only
const PRICING_HREF = '/pricing/moving'

const groups = [movingGroup, junkGroup, locationsGroup]

function DesktopDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <Link
        href={group.href}
        className="flex items-center gap-1 whitespace-nowrap text-base font-extrabold transition-opacity hover:opacity-60"
        style={{ color: '#1A1714' }}
      >
        {group.label}
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </Link>
      {open && (
        <div
          className={`absolute top-full pt-3 ${group.links.length > 10 ? 'left-1/2 -translate-x-1/2' : 'left-0'}`}
          style={{ minWidth: group.links.length > 10 ? '460px' : '260px' }}
        >
          <div className={`rounded-2xl overflow-hidden py-2 ${group.links.length > 10 ? 'grid grid-cols-2' : ''}`} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', boxShadow: '0 12px 32px rgba(26,23,20,0.12)' }}>
            {group.links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#F5F0EB]"
                style={{ color: '#1A1714' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileGroup({ group, onNavigate }: { group: NavGroup; onNavigate: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #E8E0D5' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-base font-bold text-left cursor-pointer"
        style={{ color: '#1A1714', background: 'none', border: 'none' }}
      >
        {group.label}
        <ChevronRight size={18} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', color: '#9A8E83' }} />
      </button>
      {open && (
        <div className="flex flex-col pb-3 pl-3">
          {group.links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="py-2.5 text-sm font-semibold"
              style={{ color: '#6B5E54' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar({ minimalMobile = false }: { minimalMobile?: boolean } = {}) {
  const phone = usePhoneNumber()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)

  function closeMenu() { setMenuOpen(false) }

  return (
    <>
      <header className="relative z-40" style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E0D5' }}>
        <div className="flex h-[68px] w-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-16 3xl:max-w-[2200px] 3xl:mx-auto">

          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image src="/logo.png" alt="" width={42} height={42} className="h-10 w-10 object-cover" />
            <span className="hidden min-[1400px]:inline whitespace-nowrap font-extrabold text-xl tracking-tight" style={{ color: '#1A1714' }}>
              Stonegate Moving Solutions
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {!isHome && (
              <Link href="/" className="flex items-center gap-1.5 whitespace-nowrap text-base font-extrabold transition-opacity hover:opacity-60" style={{ color: '#1A1714' }}>
                <Home size={16} /> Home
              </Link>
            )}
            {groups.map(group => <DesktopDropdown key={group.label} group={group} />)}
            <Link href={PRICING_HREF} className="whitespace-nowrap text-base font-extrabold transition-opacity hover:opacity-60" style={{ color: '#1A1714' }}>
              Pricing
            </Link>
            <Link href="/about" className="whitespace-nowrap text-base font-extrabold transition-opacity hover:opacity-60" style={{ color: '#1A1714' }}>
              About
            </Link>
            <a
              href={phone.tel}
              aria-label="Call Stonegate"
              className="flex items-center justify-center rounded-full transition-opacity hover:opacity-60"
              style={{ width: '38px', height: '38px', border: '1.5px solid #E8E0D5' }}
            >
              <Phone size={15} style={{ color: '#014421' }} />
            </a>
            <button
              onClick={() => setQuoteOpen(true)}
              className="whitespace-nowrap rounded-full text-sm font-extrabold px-6 py-3 cursor-pointer transition-transform duration-200 hover:scale-105 border-0"
              style={{ backgroundColor: '#014421', color: '#FAF7F2' }}
            >
              Make a Request
            </button>
          </nav>

          <div className="flex lg:hidden items-center gap-1.5 min-[360px]:gap-2.5">
            {minimalMobile ? (
              <a
                href={phone.tel}
                aria-label="Call Stonegate"
                className="flex items-center justify-center rounded-full"
                style={{ width: '44px', height: '44px', backgroundColor: '#014421' }}
              >
                <Phone size={18} fill="currentColor" style={{ color: '#FAF7F2' }} />
              </a>
            ) : (<>
            <a
              href={phone.tel}
              aria-label="Call Stonegate"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full font-extrabold transition-transform hover:scale-105 px-3.5 min-[360px]:px-[18px] py-[11px]"
              style={{ backgroundColor: '#014421', color: '#FAF7F2' }}
            >
              <Phone size={16} fill="currentColor" style={{ color: '#FAF7F2' }} />
              <span className="text-[15px]">Call</span>
            </a>

            <button
              onClick={() => setQuoteOpen(true)}
              className="whitespace-nowrap rounded-full font-extrabold text-[15px] cursor-pointer transition-transform hover:scale-105 px-3.5 min-[360px]:px-[18px] py-[11px]"
              style={{ backgroundColor: '#FAF7F2', color: '#014421', border: '1.5px solid #014421' }}
            >
              Free Quote
            </button>
            </>)}

            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex cursor-pointer p-1"
              style={{ background: 'none', border: 'none' }}
              aria-label="Toggle menu"
            >
              {menuOpen
                ? <X size={24} style={{ color: '#1A1714' }} />
                : <Menu size={24} style={{ color: '#1A1714' }} />
              }
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden max-h-[calc(100vh-68px)] overflow-y-auto" style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
            <div className="px-5 py-2 flex flex-col">
              {!isHome && (
                <Link href="/" onClick={closeMenu} className="flex items-center gap-2 py-4 text-base font-bold" style={{ color: '#1A1714', borderBottom: '1px solid #E8E0D5' }}>
                  <Home size={17} /> Home
                </Link>
              )}
              {groups.map(group => (
                <MobileGroup key={group.label} group={group} onNavigate={closeMenu} />
              ))}
              <Link href={PRICING_HREF} onClick={closeMenu} className="py-4 text-base font-bold" style={{ color: '#1A1714', borderBottom: '1px solid #E8E0D5' }}>
                Pricing
              </Link>
              <Link href="/about" onClick={closeMenu} className="py-4 text-base font-bold" style={{ color: '#1A1714', borderBottom: '1px solid #E8E0D5' }}>
                About
              </Link>
              <button
                onClick={() => { closeMenu(); setQuoteOpen(true) }}
                className="my-4 rounded-full text-sm font-bold text-center px-6 py-3 transition-opacity hover:opacity-90 border-0 cursor-pointer"
                style={{ backgroundColor: '#014421', color: '#FAF7F2' }}
              >
                Make a Request
              </button>
              <div className="flex flex-col gap-2 pb-6" style={{ borderTop: '1px solid #E8E0D5', paddingTop: '16px' }}>
                <a href={phone.tel} className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#6B5E54' }}>
                  <Phone size={14} style={{ color: '#014421' }} /> <PhoneNumber />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {quoteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setQuoteOpen(false)}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26,23,20,0.6)' }} />
          <div
            className="relative rounded-xl w-full max-w-lg p-6 sm:p-7 shadow-xl"
            style={{ backgroundColor: '#FAF7F2' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setQuoteOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 cursor-pointer transition-opacity hover:opacity-60"
              style={{ background: 'none', border: 'none', padding: '4px' }}
            >
              <X size={18} style={{ color: '#1A1714' }} />
            </button>
            <h2 className="text-2xl font-extrabold mb-5" style={{ color: '#1A1714' }}>What do you need?</h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { href: '/order', title: 'Moving', desc: 'Apartments & houses', cta: 'Check moving availability', img: '/crew-walking-truck.jpg', pos: 'center 55%', color: '#014421', ctaText: '#FFFFFF' },
                { href: '/book-service?type=junk-removal', title: 'Junk Removal', desc: 'Furniture, appliances, cleanouts', cta: 'Get a free junk removal quote', img: '/truck-bed-loaded.jpg', pos: 'center 55%', color: '#C98A45', ctaText: '#1A1714' },
              ].map(({ href, title, desc, cta, img, pos, color, ctaText }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setQuoteOpen(false)}
                  className="group flex flex-col rounded-lg overflow-hidden transition-shadow hover:shadow-lg"
                  style={{ textDecoration: 'none', border: `2px solid ${color}` }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: '#E8E0D5' }}>
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 45vw, 240px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      style={{ objectPosition: pos }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-3/5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                      <p className="font-extrabold text-xl sm:text-2xl leading-tight" style={{ color: '#FFFFFF' }}>{title}</p>
                      <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>{desc}</p>
                    </div>
                  </div>
                  <span className="flex-1 flex items-center justify-center py-3 px-3 text-center text-sm font-bold" style={{ backgroundColor: color, color: ctaText }}>
                    {cta} →
                  </span>
                </Link>
              ))}
            </div>

            <p className="mt-6 pt-5 text-sm border-t" style={{ color: '#6B5E54', borderColor: '#E8E0D5' }}>
              Or call us:{' '}
              <a href={phone.tel} className="font-bold hover:underline" style={{ color: '#014421' }}>
                <PhoneNumber />
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
