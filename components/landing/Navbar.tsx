'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { X, Phone, Mail, Menu, Truck, Trash2 } from 'lucide-react'
import { CONTACT_PHONES, CONTACT_EMAIL } from '@/lib/contact'

export default function Navbar() {
  const pathname = usePathname()
  const [contactOpen, setContactOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)

  function closeMenu() { setMenuOpen(false) }

  return (
    <>
      <header className="relative z-40" style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E0D5' }}>
        <div className="flex h-[68px] w-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-16">

          {/* Brand - left */}
          <Link href="/" className="hidden md:flex shrink-0 items-center gap-3">
            <Image src="/logo.png" alt="" width={42} height={42} className="h-10 w-10 object-cover" />
            <span className="font-extrabold text-lg tracking-tight lg:text-xl" style={{ color: '#1A1714' }}>
              Stonegate Moving Solutions
            </span>
          </Link>

          {/* Nav + CTA - right */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8">
            {pathname !== '/' && (
              <Link href="/" className="text-base font-extrabold transition-all duration-200 hover:opacity-50 hover:scale-110" style={{ color: '#1A1714' }}>
                Home
              </Link>
            )}
            <Link href="/other-services" className="text-base font-extrabold transition-all duration-200 hover:opacity-50 hover:scale-110" style={{ color: '#1A1714' }}>
              Junk Removal
            </Link>
            <Link href="/pricing" className="text-base font-extrabold transition-all duration-200 hover:opacity-50 hover:scale-110" style={{ color: '#1A1714' }}>
              Pricing
            </Link>
            <Link href="/about" className="text-base font-extrabold transition-all duration-200 hover:opacity-50 hover:scale-110" style={{ color: '#1A1714' }}>
              About Us
            </Link>
            <button
              onClick={() => setContactOpen(true)}
              className="text-base font-extrabold transition-all duration-200 hover:opacity-50 hover:scale-110 cursor-pointer"
              style={{ color: '#1A1714', background: 'none', border: 'none', padding: 0 }}
            >
              Contact Us
            </button>
            <button
              onClick={() => setQuoteOpen(true)}
              className="rounded-full text-sm font-extrabold px-6 py-3 cursor-pointer transition-transform duration-200 hover:scale-110 border-0"
              style={{ backgroundColor: '#014421', color: '#FAF7F2' }}
            >
              Get a quote
            </button>
          </nav>

          {/* Mobile brand */}
          <Link href="/" className="md:hidden shrink-0">
            <span className="font-extrabold text-lg tracking-tight" style={{ color: '#1A1714' }}>
              Stonegate Moving Solutions
            </span>
          </Link>

          {/* Mobile: hamburger only */}
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

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden" style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
            <div className="px-5 py-2 flex flex-col">
              {pathname !== '/' && (
                <Link href="/" onClick={closeMenu} className="py-4 text-base font-bold" style={{ color: '#1A1714', borderBottom: '1px solid #E8E0D5' }}>
                  Home
                </Link>
              )}
              <Link href="/other-services" onClick={closeMenu} className="py-4 text-base font-bold" style={{ color: '#1A1714', borderBottom: '1px solid #E8E0D5' }}>
                Junk Removal
              </Link>
              <Link href="/pricing" onClick={closeMenu} className="py-4 text-base font-bold" style={{ color: '#1A1714', borderBottom: '1px solid #E8E0D5' }}>
                Pricing
              </Link>
              <Link href="/about" onClick={closeMenu} className="py-4 text-base font-bold" style={{ color: '#1A1714', borderBottom: '1px solid #E8E0D5' }}>
                About Us
              </Link>
              <button
                onClick={() => { closeMenu(); setContactOpen(true) }}
                className="py-4 text-base font-bold text-left cursor-pointer"
                style={{ color: '#1A1714', background: 'none', border: 'none', borderBottom: '1px solid #E8E0D5' }}
              >
                Contact Us
              </button>
              <button
                onClick={() => { closeMenu(); setQuoteOpen(true) }}
                className="my-4 rounded-full text-sm font-bold text-center px-6 py-3 transition-opacity hover:opacity-90 border-0 cursor-pointer"
                style={{ backgroundColor: '#014421', color: '#FAF7F2' }}
              >
                Get a quote
              </button>
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
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>Get a quote</p>
            <h2 className="text-2xl font-extrabold mb-6" style={{ color: '#1A1714' }}>What service do you need?</h2>
            <div className="flex flex-col gap-3">
              <Link
                href="/order"
                onClick={() => setQuoteOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl border transition-colors hover:border-[#014421] group"
                style={{ border: '1.5px solid #E8E0D5', textDecoration: 'none' }}
              >
                <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F0E6' }}>
                  <Truck size={18} style={{ color: '#014421' }} />
                </span>
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
                <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F0E6' }}>
                  <Trash2 size={18} style={{ color: '#014421' }} />
                </span>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1A1714' }}>Junk Removal</p>
                  <p className="text-xs" style={{ color: '#9A8E83' }}>Furniture, appliances & estate cleanouts</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {contactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setContactOpen(false)}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26, 23, 20, 0.55)' }} />
          <div
            className="relative rounded-2xl p-8 w-full max-w-sm shadow-xl"
            style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E0D5' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-4 right-4 cursor-pointer transition-opacity hover:opacity-60"
              style={{ background: 'none', border: 'none', padding: '4px' }}
            >
              <X size={18} style={{ color: '#1A1714' }} />
            </button>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>
              Get in touch
            </p>
            <h2 className="text-2xl font-extrabold mb-8" style={{ color: '#1A1714' }}>
              We&apos;re here to help
            </h2>
            <div className="flex flex-col gap-5">
              {CONTACT_PHONES.map(phone => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-3 group"
                >
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#E8F0E6' }}
                  >
                    <Phone size={15} style={{ color: '#014421' }} />
                  </span>
                  <span
                    className="font-semibold transition-opacity group-hover:opacity-60"
                    style={{ color: '#1A1714' }}
                  >
                    {phone}
                  </span>
                </a>
              ))}
              <div style={{ borderTop: '1px solid #E8E0D5', paddingTop: '16px', marginTop: '4px' }}>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 group"
                >
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#E8F0E6' }}
                  >
                    <Mail size={15} style={{ color: '#014421' }} />
                  </span>
                  <span
                    className="font-semibold transition-opacity group-hover:opacity-60"
                    style={{ color: '#1A1714' }}
                  >
                    {CONTACT_EMAIL}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
