import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import { Button } from '@/components/ui/button'
import { Users, Clock, Truck, Info, CheckCircle2, Droplets, Trash2 } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'

export const metadata: Metadata = {
  title: 'Moving & Junk Removal Prices in Vancouver',
  description: 'Transparent pricing for apartment moving and junk removal in Vancouver, Burnaby, Richmond & Metro Vancouver. 2 movers with truck at $90 CAD/hr, junk removal from $99. No hidden fees.',
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

const junkTiers = [
  { name: '1/8 Truck', desc: 'A few small items', price: 99, fraction: 0.125 },
  { name: '1/4 Truck', desc: 'Small room worth', price: 175, fraction: 0.25 },
  { name: '1/2 Truck', desc: 'One-two rooms', price: 275, fraction: 0.5 },
  { name: '3/4 Truck', desc: 'Large haul', price: 375, fraction: 0.75 },
  { name: 'Full Truck', desc: 'Complete cleanout', price: 475, fraction: 1 },
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
    body: 'Our flat $90/hr rate applies across all moves within Metro Vancouver - no surprises based on distance.',
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
    q: 'How do you decide how much truck space my junk removal needs?',
    a: 'We can estimate from photos or a description when you book, and confirm on-site before we start. You only pay for the space your items actually take up.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept e-transfer, credit card, and cash. Payment is collected after the job is complete.',
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
            No surprise fees. Just straightforward rates for moving and junk removal.
          </p>
          </FadeIn>
        </section>

        {/* Junk Removal + Moving pricing - equal priority, junk removal shown first */}
        <section id="pricing-cards" className="max-w-6xl mx-auto px-6 pb-12">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">

            {/* Junk Removal pricing card */}
            <FadeIn className="h-full">
            <div
              id="junk-pricing"
              className="rounded-3xl overflow-hidden h-full flex flex-col transition-transform duration-300 hover:-translate-y-1"
              style={{ border: '1px solid #E8E0D5', boxShadow: '0 2px 12px rgba(37,66,32,0.06)', scrollMarginTop: '16px' }}
            >
              <div className="relative overflow-hidden px-8 pt-10 pb-8" style={{ background: 'linear-gradient(135deg, #1e3a1a 0%, #254220 60%, #2f5229 100%)' }}>
                <Trash2 size={160} className="absolute -right-6 -top-6 opacity-[0.07]" style={{ color: '#FAF7F2' }} />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-8">
                    <span
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1"
                      style={{ color: '#B5C9B0', borderColor: 'rgba(181,201,176,0.3)' }}
                    >
                      <Trash2 size={13} />
                      Junk & Furniture Removal
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#FAF7F2' }}>
                    Clearing out junk or furniture?
                  </h2>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-5xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>$99</span>
                    <span className="text-xl font-semibold mb-1" style={{ color: '#B5C9B0' }}>and up</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#B5C9B0' }}>CAD · priced by truck space used</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col px-8 py-8" style={{ backgroundColor: '#F5F0EB' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#254220' }}>
                  Truck space used
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {junkTiers.map(tier => (
                    <li
                      key={tier.name}
                      className="rounded-2xl px-5 py-3.5"
                      style={{ border: '1px solid #E8E0D5', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <div>
                          <p className="text-sm font-bold" style={{ color: '#1A1714' }}>{tier.name}</p>
                          <p className="text-xs" style={{ color: '#9A8E83' }}>{tier.desc}</p>
                        </div>
                        <span className="text-lg font-extrabold flex-shrink-0" style={{ color: '#1A1714' }}>${tier.price}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E8F0E6' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${tier.fraction * 100}%`, backgroundColor: '#254220' }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href="/book-service?type=junk-removal" className="block mt-auto">
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

            {/* Moving pricing card */}
            <FadeIn delay={100} className="h-full">
            <div
              id="moving-pricing"
              className="rounded-3xl overflow-hidden h-full flex flex-col transition-transform duration-300 hover:-translate-y-1"
              style={{ border: '1px solid #E8E0D5', boxShadow: '0 2px 12px rgba(37,66,32,0.06)', scrollMarginTop: '16px' }}
            >
              <div className="relative overflow-hidden px-8 pt-10 pb-8" style={{ background: 'linear-gradient(135deg, #1e3a1a 0%, #254220 60%, #2f5229 100%)' }}>
                <Users size={160} className="absolute -right-6 -top-6 opacity-[0.07]" style={{ color: '#FAF7F2' }} />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-8">
                    <span
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1"
                      style={{ color: '#B5C9B0', borderColor: 'rgba(181,201,176,0.3)' }}
                    >
                      <Users size={13} />
                      Apartment & Home Moving
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#FAF7F2' }}>
                    Moving to a new home?
                  </h2>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-7xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>$90</span>
                    <span className="text-xl font-semibold mb-2" style={{ color: '#B5C9B0' }}>/hr</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#B5C9B0' }}>CAD · 2-hour minimum · 2 movers</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col px-8 py-8" style={{ backgroundColor: '#F5F0EB' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#254220' }}>
                  Everything included
                </p>
                <ul className="flex flex-col gap-4 mb-8">
                  {included.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#254220' }} />
                      <span className="text-sm font-medium" style={{ color: '#1A1714' }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/order" className="block mt-auto">
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

          </div>
        </section>

        {/* Notes about the hourly moving rate */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <p className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: '#1A1714' }}>
            Good to know about moving rates
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {notes.map(({ icon: Icon, title, body }, i) => (
              <FadeIn key={title} delay={i * 100}>
              <div
                className="rounded-2xl p-6 h-full"
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
        </section>

        {/* Other services */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <p className="text-sm font-bold uppercase tracking-widest mb-10" style={{ color: '#1A1714' }}>
              Other services
            </p>
            <div className="max-w-md">

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
