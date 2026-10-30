'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X, Phone, Menu, ChevronDown, ChevronRight, Home } from 'lucide-react'
import { PhoneNumber, usePhoneNumber } from '@/components/PhoneNumber'
import { CITIES, cityHref } from '@/lib/seo/cities'
import { JUNK_BOOK_HREF, MOVE_BOOK_HREF } from '@/lib/seo/site'

interface NavLink {
  label: string
  href: string
}

interface NavGroup {
  label: string
  href: string
  links: NavLink[]
}

// Moving leads; junk removal is one service among them (its own pages link to its sub-pages and pricing)
const servicesGroup: NavGroup = {
  label: 'Services',
  href: '/moving',
  links: [
    { label: 'Local Moving', href: '/moving' },
    { label: 'Residential Moving', href: '/residential-moving' },
    { label: 'Commercial Moving & Corporate Relocation', href: '/commercial-moving' },
    { label: 'Packing Services', href: '/packing-services' },
    { label: 'Junk Removal', href: '/junk-removal' },
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

// Pricing is moving only; junk removal pricing is linked from the junk removal pages
const PRICING_HREF = '/pricing/moving'

const groups = [servicesGroup, locationsGroup]

const JUNK_PATHS = ['/junk-removal', '/burnaby-junk-removal', '/pricing/junk-removal', '/book-service']

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
  // The quote button books a move; on the junk removal pages it stays a junk removal quote
  const isJunk = JUNK_PATHS.some(p => pathname.startsWith(p))
  const quoteHref = isJunk ? JUNK_BOOK_HREF : MOVE_BOOK_HREF

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
            <Link
              href={quoteHref}
              className="whitespace-nowrap rounded-full text-sm font-extrabold px-6 py-3 transition-transform duration-200 hover:scale-105"
              style={{ backgroundColor: '#014421', color: '#FAF7F2' }}
            >
              {isJunk ? 'Get a Quote' : 'Book Your Move'}
            </Link>
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

            <Link
              href={quoteHref}
              className="whitespace-nowrap rounded-full font-extrabold text-[15px] transition-transform hover:scale-105 px-3.5 min-[360px]:px-[18px] py-[11px]"
              style={{ backgroundColor: '#FAF7F2', color: '#014421', border: '1.5px solid #014421' }}
            >
              {isJunk ? 'Free Quote' : 'Book Move'}
            </Link>
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
              <Link
                href={quoteHref}
                onClick={closeMenu}
                className="my-4 rounded-full text-sm font-bold text-center px-6 py-3 transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#014421', color: '#FAF7F2' }}
              >
                {isJunk ? 'Get a Junk Removal Quote' : 'Book Your Move'}
              </Link>
              <div className="flex flex-col gap-2 pb-6" style={{ borderTop: '1px solid #E8E0D5', paddingTop: '16px' }}>
                <a href={phone.tel} className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#6B5E54' }}>
                  <Phone size={14} style={{ color: '#014421' }} /> <PhoneNumber />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

    </>
  )
}
