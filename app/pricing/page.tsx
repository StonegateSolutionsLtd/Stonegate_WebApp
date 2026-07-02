import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import { Button } from '@/components/ui/button'
import { Users, Clock, Truck, Info, CheckCircle2, Droplets, Trash2 } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'

export const metadata: Metadata = {
  title: 'Moving Prices in Vancouver · $80/hr',
  description: 'Transparent hourly pricing for apartment moving in Vancouver, Burnaby, Richmond & Metro Vancouver. 2 movers with truck at $80 CAD/hr. No hidden fees.',
  alternates: { canonical: 'https://www.stonegatemoving.com/pricing' },
}

const included = [
  '2 professional, uniformed movers',
  'Moving truck - fully equipped',
  'Moving blankets, straps, and dollies',
  'Disassembly & reassembly of basic furniture',
  'Floor and door-frame protection',
  'No fuel surcharge, no hidden fees',
]

const notes = [
  {
    icon: Clock,
    title: '2-hour minimum',
    body: 'Most 1-bedroom moves complete in 2-3 hours. 2-bedrooms typically take 3-5 hours depending on the amount of items.',
  },
  {
    icon: Truck,
    title: 'Truck included',
    body: 'Our fully-equipped truck is part of the hourly rate. There are no separate vehicle or fuel fees added to your bill.',
  },
  {
    icon: Users,
    title: 'Rate reflects travel distance',
    body: 'Our flat $80/hr rate applies across all moves within Metro Vancouver - no surprises based on distance.',
  },
  {
    icon: Info,
    title: 'Need a larger crew?',
    body: 'For bigger moves or tight timelines, contact us to discuss adding a third mover or requesting a custom quote.',
  },
]

const faqs = [
  {
    q: 'When does the clock start?',
    a: 'Time starts when our team arrives at your pickup address and stops once everything is in place at your new home.',
  },
  {
    q: 'Are stairs or long carry distances extra?',
    a: 'Not in most cases. If your building has no elevator and requires many flights of stairs, we\'ll discuss it with you at booking - never a surprise on moving day.',
  },
  {
    q: 'Do you offer flat-rate quotes?',
    a: 'For larger or more complex moves, contact us and we can provide a custom fixed-price estimate.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept e-transfer, credit card, and cash. Payment is collected after the move is complete.',
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />

      <main className="flex-1">

        {/* Page header */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
          <FadeIn>
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-6 border rounded-full px-4 py-1.5"
            style={{ color: '#254220', borderColor: '#B5C9B0' }}
          >
            Transparent pricing
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6" style={{ color: '#1A1714' }}>
            Simple, honest <span style={{ color: '#254220' }}>pricing.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#6B5E54' }}>
            No surprise fees. Just a straightforward hourly rate that covers everything you need for a smooth move.
          </p>
          </FadeIn>
        </section>

        {/* Pricing + notes */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-2 gap-8 items-start">

            {/* Pricing card */}
            <FadeIn>
            <div className="rounded-3xl overflow-hidden" style={{ border: '1px solid #E8E0D5' }}>
              <div className="px-8 pt-10 pb-8" style={{ background: 'linear-gradient(135deg, #1e3a1a 0%, #254220 60%, #2f5229 100%)' }}>
                <div className="flex items-center gap-2 mb-8">
                  <span
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1"
                    style={{ color: '#B5C9B0', borderColor: 'rgba(181,201,176,0.3)' }}
                  >
                    <Users size={13} />
                    2 Movers
                  </span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-7xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>$80</span>
                  <span className="text-xl font-semibold mb-2" style={{ color: '#B5C9B0' }}>/hr</span>
                </div>
                <span className="text-sm font-medium" style={{ color: '#B5C9B0' }}>CAD · 2-hour minimum</span>
              </div>
              <div className="px-8 py-8" style={{ backgroundColor: '#F5F0EB' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#254220' }}>
                  Everything included
                </p>
                <ul className="flex flex-col gap-4">
                  {included.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#254220' }} />
                      <span className="text-sm font-medium" style={{ color: '#1A1714' }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/order" className="block mt-8">
                  <Button
                    className="w-full rounded-full text-sm font-bold py-6 border-0"
                    style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
                  >
                    Get a quote
                  </Button>
                </Link>
              </div>
            </div>
            </FadeIn>

            {/* Notes */}
            <div className="flex flex-col gap-4">
              {notes.map(({ icon: Icon, title, body }, i) => (
                <FadeIn key={title} delay={i * 100}>
                <div
                  className="rounded-2xl p-6"
                  style={{ backgroundColor: '#F5F0EB', border: '1px solid #E8E0D5' }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: '#E8F0E6' }}
                    >
                      <Icon size={18} style={{ color: '#254220' }} />
                    </span>
                    <div>
                      <p className="font-bold mb-1" style={{ color: '#1A1714' }}>{title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{body}</p>
                    </div>
                  </div>
                </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Other services pricing */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <p className="text-sm font-bold uppercase tracking-widest mb-10" style={{ color: '#1A1714' }}>
              Other services
            </p>
            <div className="grid md:grid-cols-2 gap-8">

              {/* Bin Cleaning */}
              <FadeIn>
              <div className="rounded-3xl overflow-hidden" style={{ border: '1px solid #E8E0D5' }}>
                <div className="px-8 pt-10 pb-8" style={{ backgroundColor: '#254220' }}>
                  <div className="flex items-center gap-2 mb-8">
                    <span
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1"
                      style={{ color: '#B5C9B0', borderColor: '#254220' }}
                    >
                      <Droplets size={13} />
                      Bin Cleaning
                    </span>
                  </div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>Starting at</span>
                  </div>
                  <div className="flex items-end gap-2 mt-2 mb-1">
                    <span className="text-6xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>$35</span>
                    <span className="text-xl font-bold mb-1" style={{ color: '#B5C9B0' }}>/ house</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#B5C9B0' }}>CAD · discounts for multiple houses</span>
                </div>
                <div className="px-8 py-8" style={{ backgroundColor: '#F5F0EB' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#254220' }}>
                    What&apos;s included
                  </p>
                  <ul className="flex flex-col gap-4 mb-8">
                    {['High-pressure hot water washing', 'Eco-friendly disinfectants', 'Interior & exterior cleaning', 'Odor and bacteria elimination'].map(item => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#254220' }} />
                        <span className="text-sm font-medium" style={{ color: '#1A1714' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/book-service?type=bin-cleaning" className="block w-full rounded-full py-3.5 text-sm font-bold text-center transition-opacity hover:opacity-90" style={{ backgroundColor: '#254220', color: '#FAF7F2' }}>
                    Book Bin Cleaning
                  </Link>
                </div>
              </div>
              </FadeIn>

              {/* Junk Removal */}
              <FadeIn delay={120}>
              <div className="rounded-3xl overflow-hidden" style={{ border: '1px solid #E8E0D5' }}>
                <div className="px-8 pt-10 pb-8" style={{ backgroundColor: '#254220' }}>
                  <div className="flex items-center gap-2 mb-8">
                    <span
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1"
                      style={{ color: '#B5C9B0', borderColor: '#254220' }}
                    >
                      <Trash2 size={13} />
                      Junk Removal
                    </span>
                  </div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>Starting at</span>
                  </div>
                  <div className="flex items-end gap-2 mt-2 mb-1">
                    <span className="text-6xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>$150</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#B5C9B0' }}>CAD · price varies by volume</span>
                </div>
                <div className="px-8 py-8" style={{ backgroundColor: '#F5F0EB' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#254220' }}>
                    What&apos;s included
                  </p>
                  <ul className="flex flex-col gap-4 mb-8">
                    {['Furniture, appliances & electronics', 'Estate & garage cleanouts', 'Office & commercial junk', 'Responsible disposal - donate & recycle first'].map(item => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#254220' }} />
                        <span className="text-sm font-medium" style={{ color: '#1A1714' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/book-service?type=junk-removal" className="block w-full rounded-full py-3.5 text-sm font-bold text-center transition-opacity hover:opacity-90" style={{ backgroundColor: '#254220', color: '#FAF7F2' }}>
                    Book Junk Removal
                  </Link>
                </div>
              </div>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <p className="text-sm font-bold uppercase tracking-widest mb-10" style={{ color: '#1A1714' }}>
              Common questions
            </p>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {faqs.map(({ q, a }, i) => (
                <FadeIn key={q} delay={i * 80}>
                  <p className="font-bold mb-2" style={{ color: '#1A1714' }}>{q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{a}</p>
                </FadeIn>
              ))}
            </div>
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



