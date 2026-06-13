import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import { Button } from '@/components/ui/button'
import ContactButton from '@/components/landing/ContactButton'
import { Droplets, Trash2, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Other Services · Stonegate Moving Solutions',
  description: 'Professional bin cleaning and junk removal services in Metro Vancouver.',
}

const binFeatures = [
  'High-pressure hot water washing',
  'Eco-friendly, non-toxic disinfectants',
  'Eliminates odors, bacteria, and mold',
  'Interior and exterior cleaning',
  'Available for residential buildings and strata',
]

const junkFeatures = [
  'Old furniture and mattresses',
  'Appliances and electronics (e-waste)',
  'Estate and garage cleanouts',
  'Office and commercial junk',
  'We donate and recycle before the landfill',
]

export default function OtherServicesPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />

      <main className="flex-1">

        {/* Page header */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-16">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-6 border rounded-full px-4 py-1.5"
            style={{ color: '#4D6B47', borderColor: '#B5C9B0' }}
          >
            Beyond moving
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6" style={{ color: '#1A1714' }}>
            Other <span style={{ color: '#4D6B47' }}>Services</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#6B5E54' }}>
            We go beyond moving day. Keep your home clean and clutter-free with our bin cleaning and junk removal services across Metro Vancouver.
          </p>
        </section>

        {/* Bin Cleaning */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#E8F0E6' }}
              >
                <Droplets size={26} style={{ color: '#4D6B47' }} />
              </div>
              <h2 className="text-3xl font-extrabold mb-4" style={{ color: '#1A1714' }}>Bin Cleaning</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#6B5E54' }}>
                Your garbage bins collect more than trash - they harbour bacteria, mold, and stubborn odors that household cleaning can&apos;t reach. Our professional bin cleaning service solves that with high-pressure hot water and eco-safe disinfectants, leaving your bins hygienically clean and smelling fresh.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#6B5E54' }}>
                Available for single-family homes, apartments, and strata complexes throughout Metro Vancouver. Schedule a one-time clean or set up a recurring service.
              </p>
              <Link href="/book-service?type=bin-cleaning" className="inline-block rounded-full px-8 py-3.5 text-sm font-bold transition-opacity hover:opacity-90" style={{ backgroundColor: '#4D6B47', color: '#FAF7F2' }}>
                Book Bin Cleaning
              </Link>
            </div>
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: '#F0EDE8', border: '1px solid #E8E0D5' }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#4D6B47' }}>
                What&apos;s included
              </p>
              <ul className="flex flex-col gap-4">
                {binFeatures.map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="mt-0.5 flex-shrink-0" style={{ color: '#4D6B47' }} />
                    <span className="text-sm font-medium" style={{ color: '#1A1714' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Junk Removal */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: '#E8F0E6' }}
              >
                <Trash2 size={26} style={{ color: '#4D6B47' }} />
              </div>
              <h2 className="text-3xl font-extrabold mb-4" style={{ color: '#1A1714' }}>Junk Removal</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#6B5E54' }}>
                Reclaim your space. Whether you&apos;re decluttering before a move, clearing out an estate, or just need that old couch gone - we&apos;ll haul it away quickly and responsibly. No job too big or too small.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#6B5E54' }}>
                We prioritize donating usable items to local charities and recycling materials before anything reaches the landfill.
              </p>
              <Link href="/book-service?type=junk-removal" className="inline-block rounded-full px-8 py-3.5 text-sm font-bold transition-opacity hover:opacity-90" style={{ backgroundColor: '#4D6B47', color: '#FAF7F2' }}>
                Book Junk Removal
              </Link>
            </div>
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: '#F0EDE8', border: '1px solid #E8E0D5' }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#4D6B47' }}>
                What we remove
              </p>
              <ul className="flex flex-col gap-4">
                {junkFeatures.map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="mt-0.5 flex-shrink-0" style={{ color: '#4D6B47' }} />
                    <span className="text-sm font-medium" style={{ color: '#1A1714' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Truck image */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="relative w-full overflow-hidden rounded-3xl" style={{ height: 'clamp(220px, 40vw, 620px)' }}>
              <Image
                src="/truck.png"
                alt="Stonegate Moving Solutions truck"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col items-center text-center gap-4">
            <p className="text-base" style={{ color: '#6B5E54' }}>
              Or make an order directly? We&apos;re happy to help.
            </p>
            <ContactButton
              label="Contact Us Directly"
              className="rounded-full text-sm font-semibold px-7 py-5 border-0 transition-opacity hover:opacity-80 cursor-pointer"
              style={{ backgroundColor: '#4D6B47', color: '#FAF7F2' }}
            />
          </div>
        </section>

      </main>

      <footer style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <span className="text-sm font-medium" style={{ color: '#B5A99E' }}>
            © {new Date().getFullYear()} Stonegate Moving Solutions. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  )
}
