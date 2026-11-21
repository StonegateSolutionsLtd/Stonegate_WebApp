'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X, Phone, Menu, ChevronDown, ChevronRight, Home } from 'lucide-react'
import { PhoneNumber, usePhoneNumber } from '@/components/PhoneNumber'
import { CITIES, cityHref } from '@/lib/seo/cities'
import { MOVE_BOOK_HREF } from '@/lib/seo/site'

interface NavLink {
  label: string
  href: string
}

interface NavGroup {
  label: string
  href: string
  links: NavLink[]
}

const servicesGroup: NavGroup = {
  label: 'Services',
  href: '/moving',
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
}

const locationsGroup: NavGroup = {
  label: 'Locations',
  href: '/locations',
  links: [
    { label: 'All Areas We Serve', href: '/locations' },
    ...CITIES.map(c => ({ label: c.name, href: cityHref(c) })),
  ],
}

const aboutGroup: NavGroup = {
  label: 'About',
  href: '/about',
  links: [
    { label: 'About Us', href: '/about' },
    { label: 'Customer Reviews', href: '/reviews' },
  ],
}

interface MegaColumn {
  title: string
  links: NavLink[]
}

/** Desktop mega menus: the same links, grouped into titled columns */
const cityLink = (slug: string) => {
  const c = CITIES.find(x => x.slug === slug)
  return c ? { label: c.name, href: cityHref(c) } : null
}
const cityLinks = (slugs: string[]) => slugs.map(cityLink).filter((l): l is NavLink => l !== null)

const MEGA: Record<string, { kicker: string; columns: MegaColumn[]; footer?: NavLink }> = {
  Services: {
    kicker: 'Services',
    columns: [
      { title: 'Home moving', links: [
        { label: 'Local Moving', href: '/moving' },
        { label: 'Residential Moving', href: '/residential-moving' },
        { label: 'Apartment & Condo Moving', href: '/apartment-moving' },
        { label: 'Senior Moving', href: '/senior-moving' },
      ] },
      { title: 'Business moving', links: [
        { label: 'Commercial Moving & Corporate Relocation', href: '/commercial-moving' },
        { label: 'Office Moving', href: '/office-moving' },
      ] },
      { title: 'More services', links: [
        { label: 'Long-Distance Moving', href: '/long-distance-moving' },
        { label: 'Specialty Moving', href: '/specialty-moving' },
        { label: 'Packing Services', href: '/packing-services' },
      ] },
    ],
    footer: { label: 'See moving prices', href: '/pricing/moving' },
  },
  Locations: {
    kicker: 'Locations',
    columns: [
      { title: 'Vancouver & North Shore', links: cityLinks(['vancouver', 'north-vancouver', 'west-vancouver', 'lions-bay']) },
      { title: 'Burnaby & Tri-Cities', links: cityLinks(['burnaby', 'new-westminster', 'coquitlam', 'port-coquitlam', 'port-moody', 'anmore', 'belcarra']) },
      { title: 'South of the Fraser', links: cityLinks(['richmond', 'surrey', 'delta', 'white-rock', 'langley']) },
      { title: 'Ridge Meadows', links: cityLinks(['maple-ridge', 'pitt-meadows']) },
    ],
    footer: { label: 'All areas we serve', href: '/locations' },
  },
}

const PRICING_HREF = '/pricing/moving'

/** Brand bar: purple header with white logo, links and icons; orange for the main call to action */
const BAR = '#4B1D8F'
const ORANGE = '#F26B21'

const groups = [servicesGroup, locationsGroup]

function DesktopDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mega = MEGA[group.label]

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    // A mega menu is positioned against the header (full width), so its wrapper is not `relative`
    <div className={mega ? '' : 'relative'} onMouseEnter={openNow} onMouseLeave={closeSoon} onFocus={openNow} onBlur={closeSoon}>
      <Link
        href={group.href}
        aria-expanded={open}
        className="relative flex items-center gap-1 whitespace-nowrap text-base font-extrabold transition-opacity hover:opacity-90 h-[68px]"
        style={{ color: '#FFFFFF' }}
      >
        {group.label}
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
        {/* Underline marks the open menu */}
        <span aria-hidden className="absolute left-0 right-0 bottom-[18px] h-[3px] rounded-full transition-opacity" style={{ backgroundColor: '#FFFFFF', opacity: open ? 1 : 0 }} />
      </Link>
      {open && mega && (
        <div className="absolute left-0 right-0 top-full" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E6DFF0', boxShadow: '0 18px 30px -18px rgba(30,21,48,0.25)' }}>
          <div className="max-w-6xl 3xl:max-w-7xl mx-auto px-8 pt-8 pb-9">
            <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] mb-4" style={{ color: ORANGE }}>{mega.kicker}</p>
            <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${mega.columns.length}, minmax(0, 1fr))` }}>
              {mega.columns.map((col, i) => (
                <div key={col.title} className={i ? 'pl-8' : 'pr-8'} style={i ? { borderLeft: '1px solid #E6DFF0' } : undefined}>
                  <p className="text-[19px] font-extrabold mb-3" style={{ color: '#1E1530' }}>{col.title}</p>
                  <ul className="flex flex-col">
                    {col.links.map(link => (
                      <li key={link.href}>
                        <Link href={link.href} className="block py-1.5 text-[15px] font-semibold transition-colors hover:text-[#4B1D8F]" style={{ color: '#3A3448' }}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {mega.footer && (
              <Link href={mega.footer.href} className="inline-flex items-center gap-1.5 mt-6 text-[15px] font-extrabold" style={{ color: BAR }}>
                {mega.footer.label} <ChevronRight size={16} aria-hidden />
              </Link>
            )}
          </div>
        </div>
      )}
      {open && !mega && (
        <div className="absolute top-full left-0" style={{ minWidth: '240px' }}>
          <div className="rounded-2xl overflow-hidden py-2 mt-1" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6DFF0', boxShadow: '0 12px 32px rgba(30,21,48,0.12)' }}>
            {group.links.map(link => (
              <Link key={link.href} href={link.href} className="block px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#F6F2FC]" style={{ color: '#1E1530' }}>
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
    <div style={{ borderBottom: '1px solid #E6DFF0' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-base font-bold text-left cursor-pointer"
        style={{ color: '#1E1530', background: 'none', border: 'none' }}
      >
        {group.label}
        <ChevronRight size={18} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', color: '#8A82A0' }} />
      </button>
      {open && (
        <div className="flex flex-col pb-3 pl-3">
          {group.links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="py-2.5 text-sm font-semibold"
              style={{ color: '#5F5870' }}
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

  function closeMenu() { setMenuOpen(false) }

  return (
    <>
      <header className="relative z-40" style={{ backgroundColor: BAR }}>
        <div className="flex h-[68px] w-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-16 3xl:max-w-[2200px] 3xl:mx-auto">

          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image src="/logo.png" alt="" width={42} height={42} className="h-10 w-10 object-cover brightness-0 invert" />
            <span className="hidden min-[1400px]:inline whitespace-nowrap font-extrabold text-xl tracking-tight" style={{ color: '#FFFFFF' }}>
              Stonegate Moving Solutions
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {!isHome && (
              <Link href="/" className="flex items-center gap-1.5 whitespace-nowrap text-base font-extrabold transition-opacity hover:opacity-70" style={{ color: '#FFFFFF' }}>
                <Home size={16} /> Home
              </Link>
            )}
            {groups.map(group => <DesktopDropdown key={group.label} group={group} />)}
            <Link href={PRICING_HREF} className="whitespace-nowrap text-base font-extrabold transition-opacity hover:opacity-70" style={{ color: '#FFFFFF' }}>
              Pricing
            </Link>
            <Link href="/guides" className="whitespace-nowrap text-base font-extrabold transition-opacity hover:opacity-70" style={{ color: '#FFFFFF' }}>
              Guides
            </Link>
            <DesktopDropdown group={aboutGroup} />
            {/* The phone number as a solid deep-purple pill */}
            <a
              href={phone.tel}
              className="flex items-center gap-2 rounded-full px-4 py-[9px] text-[15px] font-extrabold whitespace-nowrap transition-colors hover:bg-[#2A0F55]"
              style={{ backgroundColor: '#36146B', color: '#FFFFFF', fontVariantNumeric: 'lining-nums tabular-nums' }}
            >
              <Phone size={15} fill="currentColor" aria-hidden /> <PhoneNumber />
            </a>
            {/* Get Quote, with the opening hours under it on the white page just below the bar */}
            <div className="relative">
              <Link
                href={MOVE_BOOK_HREF}
                className="block whitespace-nowrap sg-btn text-sm font-extrabold px-6 py-3"
                style={{ backgroundColor: ORANGE, color: '#FFFFFF' }}
              >
                Get Quote
              </Link>
              <span className={`absolute right-0 text-[13px] font-bold whitespace-nowrap leading-none pointer-events-none ${isHome ? '' : 'bg-white rounded-full px-2.5 py-1.5 shadow-[0_2px_8px_rgba(30,21,48,0.15)]'}`} style={{ top: isHome ? 'calc(100% + 20px)' : 'calc(100% + 16px)', color: '#4B1D8F' }}>7 days a week · 6AM–10PM</span>
            </div>
          </nav>

          <div className="flex lg:hidden items-center gap-2 min-[375px]:gap-3">
            {minimalMobile ? (
              <a
                href={phone.tel}
                aria-label="Call Stonegate"
                className="flex items-center justify-center rounded-full"
                style={{ width: '44px', height: '44px', backgroundColor: '#FFFFFF' }}
              >
                <Phone size={18} fill="currentColor" style={{ color: BAR }} />
              </a>
            ) : (<>
            <a
              href={phone.tel}
              aria-label="Call Stonegate"
              className="flex items-center justify-center rounded-full shrink-0 transition-transform hover:scale-105"
              style={{ width: '44px', height: '44px', backgroundColor: '#FFFFFF' }}
            >
              <Phone size={18} fill="currentColor" style={{ color: BAR }} />
            </a>

            <Link
              href={MOVE_BOOK_HREF}
              className="whitespace-nowrap sg-btn font-extrabold text-[13px] min-[375px]:text-[14px] px-3 min-[375px]:px-3.5 py-[12px]"
              style={{ backgroundColor: ORANGE, color: '#FFFFFF' }}
            >
              Free Estimate
            </Link>
            </>)}

            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex cursor-pointer p-1 -mr-1"
              style={{ background: 'none', border: 'none' }}
              aria-label="Toggle menu"
            >
              {menuOpen
                ? <X size={26} style={{ color: '#FFFFFF' }} />
                : <Menu size={26} strokeWidth={2.5} style={{ color: '#FFFFFF' }} />
              }
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden max-h-[calc(100vh-68px)] overflow-y-auto" style={{ borderTop: '1px solid #E6DFF0', backgroundColor: '#FFFFFF' }}>
            <div className="px-5 py-2 flex flex-col">
              {!isHome && (
                <Link href="/" onClick={closeMenu} className="flex items-center gap-2 py-4 text-base font-bold" style={{ color: '#1E1530', borderBottom: '1px solid #E6DFF0' }}>
                  <Home size={17} /> Home
                </Link>
              )}
              {groups.map(group => (
                <MobileGroup key={group.label} group={group} onNavigate={closeMenu} />
              ))}
              <Link href={PRICING_HREF} onClick={closeMenu} className="py-4 text-base font-bold" style={{ color: '#1E1530', borderBottom: '1px solid #E6DFF0' }}>
                Pricing
              </Link>
              <Link href="/guides" onClick={closeMenu} className="py-4 text-base font-bold" style={{ color: '#1E1530', borderBottom: '1px solid #E6DFF0' }}>
                Guides
              </Link>
              <MobileGroup group={aboutGroup} onNavigate={closeMenu} />
              <Link
                href={MOVE_BOOK_HREF}
                onClick={closeMenu}
                className="my-4 sg-btn text-sm font-bold text-center px-6 py-3 hover:opacity-90"
                style={{ backgroundColor: '#4B1D8F', color: '#FFFFFF' }}
              >
                Get Quote
              </Link>
              <div className="flex flex-col gap-2 pb-6" style={{ borderTop: '1px solid #E6DFF0', paddingTop: '16px' }}>
                <a href={phone.tel} className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#5F5870' }}>
                  <Phone size={14} style={{ color: '#4B1D8F' }} /> <PhoneNumber />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

    </>
  )
}
