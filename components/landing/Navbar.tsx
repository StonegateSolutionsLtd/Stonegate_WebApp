'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X, Phone, Menu, ChevronDown, ChevronRight, Home, Truck, Trash2, ArrowRight } from 'lucide-react'
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
          <div className="absolute inset-0 backdrop-blur-sm animate-in fade-in duration-200" style={{ backgroundColor: 'rgba(26,23,20,0.6)' }} />
          <div
            className="relative rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200"
            style={{ backgroundColor: '#FAF7F2' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header band */}
            <div className="relative px-8 pt-8 pb-7" style={{ background: 'linear-gradient(135deg, #014421 0%, #0B2E1A 100%)' }}>
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,138,69,0.35) 0%, transparent 70%)' }} />
              <button
                onClick={() => setQuoteOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 cursor-pointer rounded-full p-1.5 transition-colors hover:bg-white/10"
                style={{ background: 'none', border: 'none' }}
              >
                <X size={18} style={{ color: '#FAF7F2' }} />
              </button>
              <p className="relative text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#C98A45' }}>Free quote · No hidden fees</p>
              <h2 className="relative text-3xl font-extrabold" style={{ color: '#FAF7F2' }}>What do you need?</h2>
            </div>

            <div className="flex flex-col gap-3 p-6">
              {[
                { href: '/order', title: 'Moving', desc: 'Apartment & house moves across Metro Vancouver', Icon: Truck, accent: '#014421', tint: 'rgba(1,68,33,0.08)' },
                { href: '/book-service?type=junk-removal', title: 'Junk Removal', desc: 'Furniture, appliances & estate cleanouts', Icon: Trash2, accent: '#C98A45', tint: 'rgba(201,138,69,0.14)' },
              ].map(({ href, title, desc, Icon, accent, tint }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setQuoteOpen(false)}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white border-[1.5px] border-[#E8E0D5] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-[var(--accent)]"
                  style={{ textDecoration: 'none', ['--accent' as string]: accent }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: tint }}>
                    <Icon size={22} style={{ color: accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base" style={{ color: '#1A1714' }}>{title}</p>
                    <p className="text-sm" style={{ color: '#6B5E54' }}>{desc}</p>
                  </div>
                  <ArrowRight size={18} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" style={{ color: accent }} />
                </Link>
              ))}
            </div>

            <div className="px-6 pb-6 -mt-1 text-center text-sm" style={{ color: '#6B5E54' }}>
              Prefer to talk?{' '}
              <a href={`tel:${CONTACT_PHONES[2].replace(/\D/g, '')}`} className="font-bold hover:underline" style={{ color: '#014421' }}>
                Call {CONTACT_PHONES[2]}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
