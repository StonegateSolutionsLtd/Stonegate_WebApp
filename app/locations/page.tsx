import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { MapPin } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'
import { CITIES, cityHref } from '@/lib/seo/cities'
import { CallBand } from '@/components/seo/SeoBlocks'
import { JUNK_BOOK_HREF } from '@/lib/seo/site'

export const metadata: Metadata = {
  title: { absolute: 'Junk Removal Service Areas in Metro Vancouver | Stonegate' },
  description: 'Same-day junk removal in every Metro Vancouver city - Vancouver, Surrey, Burnaby, Richmond, Coquitlam, New Westminster, North Vancouver, Langley, Delta and more.',
  alternates: { canonical: 'https://www.stonegatemoving.com/locations' },
}


export default function LocationsPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ minHeight: '320px' }}>
          <Image src="/hero-truck.jpg" alt="" fill className="object-cover object-center" priority style={{ filter: 'brightness(0.55)' }} />
          <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
            <FadeIn>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6" style={{ color: '#FFFFFF' }}>
                Junk Removal Across Metro Vancouver
              </h1>
              <p className="text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Same-day and next-day junk removal in every city across Metro Vancouver - pick yours below.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Cities */}
        <section style={{ backgroundColor: '#F5F0EB', borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>Every City We Serve</h2>
              <p className="text-base leading-relaxed max-w-2xl mb-10" style={{ color: '#6B5E54' }}>
                Pick your city to see local junk removal details, the neighbourhoods we cover and answers to common questions.
              </p>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CITIES.map((city, i) => (
                <FadeIn key={city.slug} delay={i * 30}>
                  <div className="h-full rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
                    <Link href={cityHref(city)} className="flex items-center gap-2 mb-2 group">
                      <MapPin size={16} style={{ color: '#254220' }} />
                      <h3 className="font-bold group-hover:underline" style={{ color: '#1A1714' }}>{city.name}</h3>
                    </Link>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: '#6B5E54' }}>{city.neighbourhoods.slice(0, 4).join(' · ')}</p>
                    <Link href={cityHref(city)} className="text-xs font-bold transition-opacity hover:opacity-60" style={{ color: '#254220' }}>{city.name} Junk Removal →</Link>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <CallBand
          heading="Need junk removal in Metro Vancouver?"
          text="Call now for today's availability, or book online in a couple of minutes. We confirm the price on site - no obligation."
          bookHref={JUNK_BOOK_HREF}
          bookLabel="Book Junk Removal"
        />

      </main>

      <Footer />
    </div>
  )
}
