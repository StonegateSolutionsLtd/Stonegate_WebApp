import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'
import { MapPin, Truck, Trash2, ArrowRight } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'

export const metadata: Metadata = {
  title: { absolute: 'Areas We Serve in Metro Vancouver | Stonegate Moving Solutions' },
  description: 'Stonegate Moving Solutions is based in Burnaby, BC and serves Vancouver, Coquitlam, New Westminster, Richmond, Surrey, and the rest of Metro Vancouver.',
  alternates: { canonical: 'https://www.stonegatemoving.com/locations' },
}

const otherCities = ['Vancouver', 'Coquitlam', 'New Westminster', 'Richmond', 'Surrey', 'Port Coquitlam', 'Port Moody', 'Delta', 'North Vancouver']

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
                Areas We Serve
              </h1>
              <p className="text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Based in Burnaby, BC, and moving and hauling junk across Metro Vancouver.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Burnaby - flagship, dedicated pages */}
        <section style={{ borderBottom: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} style={{ color: '#254220' }} />
                <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#1A1714' }}>Burnaby</h2>
              </div>
              <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: '#6B5E54' }}>
                Our home base. We know Metrotown, Brentwood, Burnaby Heights, Edmonds, Lougheed, Deer Lake, Capitol Hill, and Burnaby Mountain well - and can often offer faster scheduling for local jobs.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/burnaby-movers" className="group flex items-center justify-between gap-4 rounded-2xl p-6" style={{ backgroundColor: '#F5F0EB', border: '1px solid #E8E0D5' }}>
                  <div className="flex items-center gap-4">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F0E6' }}>
                      <Truck size={20} style={{ color: '#254220' }} />
                    </span>
                    <p className="font-bold" style={{ color: '#1A1714' }}>Burnaby Movers</p>
                  </div>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" style={{ color: '#254220' }} />
                </Link>
                <Link href="/burnaby-junk-removal" className="group flex items-center justify-between gap-4 rounded-2xl p-6" style={{ backgroundColor: '#F5F0EB', border: '1px solid #E8E0D5' }}>
                  <div className="flex items-center gap-4">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F0E6' }}>
                      <Trash2 size={20} style={{ color: '#254220' }} />
                    </span>
                    <p className="font-bold" style={{ color: '#1A1714' }}>Burnaby Junk Removal</p>
                  </div>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" style={{ color: '#254220' }} />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Other Metro Vancouver areas */}
        <section style={{ backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>Also Serving Metro Vancouver</h2>
              <p className="text-base leading-relaxed max-w-2xl mb-10" style={{ color: '#6B5E54' }}>
                Dedicated city pages for the areas below are on the way - for now, book through our Moving or Junk Removal pages and let us know where you&apos;re located.
              </p>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherCities.map((city, i) => (
                <FadeIn key={city} delay={i * 40}>
                  <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={16} style={{ color: '#254220' }} />
                      <p className="font-bold" style={{ color: '#1A1714' }}>{city}</p>
                    </div>
                    <div className="flex gap-3">
                      <Link href="/moving" className="text-xs font-bold transition-opacity hover:opacity-60" style={{ color: '#254220' }}>Movers →</Link>
                      <Link href="/junk-removal" className="text-xs font-bold transition-opacity hover:opacity-60" style={{ color: '#254220' }}>Junk Removal →</Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <FadeIn>
            <div className="max-w-6xl mx-auto px-6 py-20 text-center">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>Make a Request</h2>
              <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: '#6B5E54' }}>
                Wherever you are in Metro Vancouver, we can help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/order">
                  <Button className="text-base px-10 py-6 rounded-full font-bold border-0" style={{ backgroundColor: '#254220', color: '#FAF7F2' }}>Request Your Move</Button>
                </Link>
                <Link href="/book-service?type=junk-removal">
                  <Button className="text-base px-10 py-6 rounded-full font-bold" style={{ backgroundColor: 'transparent', color: '#254220', border: '2px solid #254220' }}>Get a Junk Removal Quote</Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </section>

      </main>

      <Footer />
    </div>
  )
}
