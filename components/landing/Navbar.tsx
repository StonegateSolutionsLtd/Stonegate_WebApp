'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X, Phone, Menu, ChevronDown, ChevronRight, Home } from 'lucide-react'
import { CONTACT_PHONES } from '@/lib/contact'

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
  ],
}

const junkGroup: NavGroup = {
  label: 'Junk Removal',
  href: '/junk-removal',
  links: [
    { label: 'Junk Removal Services', href: '/junk-removal' },
    { label: 'Furniture Removal', href: '/junk-removal#furniture-removal' },
    { label: 'Appliance Removal', href: '/junk-removal#appliance-removal' },
    { label: 'Property Cleanouts', href: '/junk-removal#property-cleanouts' },
    { label: 'Commercial Junk Removal', href: '/junk-removal#commercial-junk-removal' },
    { label: 'Construction Debris Removal', href: '/junk-removal#construction-debris-removal' },
  ],
}

const locationsGroup: NavGroup = {
  label: 'Locations',
  href: '/locations',
  links: [
    { label: 'Areas We Serve', href: '/locations' },
    { label: 'Burnaby Movers', href: '/burnaby-movers' },
    { label: 'Burnaby Junk Removal', href: '/burnaby-junk-removal' },
  ],
}

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
        className="flex items-center gap-1 text-base font-extrabold transition-opacity hover:opacity-60"
        style={{ color: '#1A1714' }}
      >
        {group.label}
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </Link>
      {open && (
        <div
          className="absolute left-0 top-full pt-3"
          style={{ minWidth: '260px' }}
        >
          <div className="rounded-2xl overflow-hidden py-2" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', boxShadow: '0 12px 32px rgba(26,23,20,0.12)' }}>
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

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)

  function closeMenu() { setMenuOpen(false) }

  return (
    <>
      <header className="relative z-40" style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E0D5' }}>
        <div className="flex h-[68px] w-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-16">

          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image src="/logo.png" alt="" width={42} height={42} className="h-10 w-10 object-cover" />
            <span className="hidden md:inline font-extrabold text-lg tracking-tight lg:text-xl" style={{ color: '#1A1714' }}>
              Stonegate Moving Solutions
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {!isHome && (
              <Link href="/" className="flex items-center gap-1.5 text-base font-extrabold transition-opacity hover:opacity-60" style={{ color: '#1A1714' }}>
                <Home size={16} /> Home
              </Link>
            )}
            {groups.map(group => <DesktopDropdown key={group.label} group={group} />)}
            <Link href="/pricing" className="text-base font-extrabold transition-opacity hover:opacity-60" style={{ color: '#1A1714' }}>
              Pricing
            </Link>
            <Link href="/about" className="text-base font-extrabold transition-opacity hover:opacity-60" style={{ color: '#1A1714' }}>
              About
            </Link>
            <a
              href={`tel:${CONTACT_PHONES[0].replace(/\D/g, '')}`}
              aria-label="Call Stonegate"
              className="flex items-center justify-center rounded-full transition-opacity hover:opacity-60"
              style={{ width: '38px', height: '38px', border: '1.5px solid #E8E0D5' }}
            >
              <Phone size={15} style={{ color: '#014421' }} />
            </a>
            <button
              onClick={() => setQuoteOpen(true)}
              className="rounded-full text-sm font-extrabold px-6 py-3 cursor-pointer transition-transform duration-200 hover:scale-105 border-0"
              style={{ backgroundColor: '#014421', color: '#FAF7F2' }}
            >
              Make a Request
            </button>
          </nav>

          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex md:hidden cursor-pointer p-1"
            style={{ background: 'none', border: 'none' }}
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <X size={24} style={{ color: '#1A1714' }} />
              : <Menu size={24} style={{ color: '#1A1714' }} />
            }
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden max-h-[calc(100vh-68px)] overflow-y-auto" style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
            <div className="px-5 py-2 flex flex-col">
              {!isHome && (
                <Link href="/" onClick={closeMenu} className="flex items-center gap-2 py-4 text-base font-bold" style={{ color: '#1A1714', borderBottom: '1px solid #E8E0D5' }}>
                  <Home size={17} /> Home
                </Link>
              )}
              {groups.map(group => (
                <MobileGroup key={group.label} group={group} onNavigate={closeMenu} />
              ))}
              <Link href="/pricing" onClick={closeMenu} className="py-4 text-base font-bold" style={{ color: '#1A1714', borderBottom: '1px solid #E8E0D5' }}>
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
                {CONTACT_PHONES.slice(0, 1).map(phone => (
                  <a key={phone} href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#6B5E54' }}>
                    <Phone size={14} style={{ color: '#014421' }} /> {phone}
                  </a>
                ))}
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
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26,23,20,0.55)' }} />
          <div
            className="relative rounded-2xl p-8 w-full max-w-sm shadow-xl"
            style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E0D5' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setQuoteOpen(false)}
              className="absolute top-4 right-4 cursor-pointer transition-opacity hover:opacity-60"
              style={{ background: 'none', border: 'none', padding: '4px' }}
            >
              <X size={18} style={{ color: '#1A1714' }} />
            </button>
            <h2 className="text-2xl font-extrabold mb-6" style={{ color: '#1A1714' }}>What do you need?</h2>
            <div className="flex flex-col gap-3">
              <Link
                href="/order"
                onClick={() => setQuoteOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl border transition-colors hover:border-[#014421] group"
                style={{ border: '1.5px solid #E8E0D5', textDecoration: 'none' }}
              >
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1A1714' }}>Moving</p>
                  <p className="text-xs" style={{ color: '#9A8E83' }}>Apartment & house moves across Metro Vancouver</p>
                </div>
              </Link>
              <Link
                href="/book-service?type=junk-removal"
                onClick={() => setQuoteOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl border transition-colors hover:border-[#014421] group"
                style={{ border: '1.5px solid #E8E0D5', textDecoration: 'none' }}
              >
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1A1714' }}>Junk Removal</p>
                  <p className="text-xs" style={{ color: '#9A8E83' }}>Furniture, appliances & estate cleanouts</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
