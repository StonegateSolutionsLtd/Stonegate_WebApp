import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import { Button } from '@/components/ui/button'
import { Users, Clock, Truck, Info, CheckCircle2, Weight, Ruler } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'

export const metadata: Metadata = {
  title: 'Moving & Junk Removal Prices in Vancouver',
  description: 'Transparent pricing for apartment moving and junk removal in Vancouver, Burnaby, Richmond & Metro Vancouver. 2 movers with truck at $90 CAD/hr, junk removal from $145. No hidden fees.',
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

// Truck bed: 16ft (L) x 7.5ft (W) x 6.5ft (H) = 780 ft³ full load
const TRUCK_CUBIC_FT = 16 * 7.5 * 6.5
const OUR_TRUCK_CUBIC_YD = Math.round(TRUCK_CUBIC_FT / 27)
const STANDARD_DUMP_TRUCK_CUBIC_YD = 12
const SIZE_MULTIPLIER = (OUR_TRUCK_CUBIC_YD / STANDARD_DUMP_TRUCK_CUBIC_YD).toFixed(1)
const WEIGHT_RATE_PER_1000KG = 550

const junkTiers = [
  { name: '1/8 Truck', desc: 'A few small items', price: 145, fraction: 0.125 },
  { name: '1/4 Truck', desc: 'Small room worth', price: 260, fraction: 0.25 },
  { name: '1/2 Truck', desc: 'One-two rooms', price: 405, fraction: 0.5 },
  { name: '3/4 Truck', desc: 'Large haul', price: 555, fraction: 0.75 },
  { name: 'Full Truck', desc: 'Complete cleanout', price: 700, fraction: 1 },
].map(tier => ({ ...tier, cubicFeet: TRUCK_CUBIC_FT * tier.fraction }))

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

        {/* Junk Removal pricing */}
        <section id="pricing-cards" className="max-w-6xl mx-auto px-6 pb-8">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#254220' }}>How junk removal pricing works</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>
              Two ways we calculate your price.
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">

            {/* By truck space */}
            <FadeIn className="h-full">
            <div
              id="junk-pricing"
              className="rounded-3xl overflow-hidden h-full flex flex-col transition-transform duration-300 hover:-translate-y-1"
              style={{ border: '1px solid #E8E0D5', boxShadow: '0 2px 12px rgba(37,66,32,0.06)', scrollMarginTop: '16px' }}
            >
              <div className="relative overflow-hidden px-8 pt-10 pb-8" style={{ background: 'linear-gradient(135deg, #1e3a1a 0%, #254220 60%, #2f5229 100%)' }}>
                <Ruler size={160} className="absolute -right-6 -top-6 opacity-[0.07]" style={{ color: '#FAF7F2' }} />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-8">
                    <span
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1"
                      style={{ color: '#B5C9B0', borderColor: 'rgba(181,201,176,0.3)' }}
                    >
                      <Ruler size={13} />
                      By Truck Space
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-4" style={{ color: '#FAF7F2' }}>
                    Bulky but light? Pay for the space it takes.
                  </h3>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-5xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>$145</span>
                    <span className="text-xl font-semibold mb-1" style={{ color: '#B5C9B0' }}>and up</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#B5C9B0' }}>CAD · best for furniture, boxes, mattresses</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col px-8 py-8" style={{ backgroundColor: '#F5F0EB' }}>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B5E54' }}>
                  Priced by how much of the truck your items take up - from ${junkTiers[0].price} for a small load up to ${junkTiers[junkTiers.length - 1].price} for a full truck. We confirm the exact tier on-site before we start.
                </p>
                <ul className="flex flex-col gap-3 mb-6">
                  {['No hidden fees - price matches the space used', 'Great for furniture, boxes, and mattresses'].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#254220' }} />
                      <span className="text-sm font-medium" style={{ color: '#1A1714' }}>{item}</span>
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

            {/* By weight */}
            <FadeIn delay={100} className="h-full">
            <div
              className="rounded-3xl overflow-hidden h-full flex flex-col transition-transform duration-300 hover:-translate-y-1"
              style={{ border: '1px solid #E8E0D5', boxShadow: '0 2px 12px rgba(37,66,32,0.06)' }}
            >
              <div className="relative overflow-hidden px-8 pt-10 pb-8" style={{ background: 'linear-gradient(135deg, #1e3a1a 0%, #254220 60%, #2f5229 100%)' }}>
                <Weight size={160} className="absolute -right-6 -top-6 opacity-[0.07]" style={{ color: '#FAF7F2' }} />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-8">
                    <span
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1"
                      style={{ color: '#B5C9B0', borderColor: 'rgba(181,201,176,0.3)' }}
                    >
                      <Weight size={13} />
                      By Weight
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-4" style={{ color: '#FAF7F2' }}>
                    Heavy load? We charge by the kg.
                  </h3>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-5xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>${WEIGHT_RATE_PER_1000KG}</span>
                    <span className="text-xl font-semibold mb-1" style={{ color: '#B5C9B0' }}>/1,000 kg</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#B5C9B0' }}>CAD · $0.55/kg · best for dirt, concrete, appliances</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col px-8 py-8" style={{ backgroundColor: '#F5F0EB' }}>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B5E54' }}>
                  This is the exact rate disposal stations charge us, passed straight through with no markup. A typical 1,000 kg load (small renovation debris) runs about $550.
                </p>
                <ul className="flex flex-col gap-3 mb-6">
                  {['Best for dirt, concrete, and appliances', 'We weigh on-site before confirming your price'].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#254220' }} />
                      <span className="text-sm font-medium" style={{ color: '#1A1714' }}>{item}</span>
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

          </div>
        </section>

        {/* Truck size comparison */}
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <FadeIn>
            <div className="rounded-3xl overflow-hidden grid md:grid-cols-2 gap-8 items-center p-8 md:p-10" style={{ backgroundColor: '#F5F0EB', border: '1px solid #E8E0D5' }}>

              <div className="relative w-full" style={{ aspectRatio: '1536 / 1024' }}>
                <Image
                  src="/truck-dimensions.jpg"
                  alt="Stonegate truck dimensions: 16 feet long, 7.5 feet wide, 6.5 feet tall"
                  fill
                  className="object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#254220' }}>Why full-truck pricing is higher</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>
                  Our truck is {SIZE_MULTIPLIER}× bigger than a standard dump truck.
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B5E54' }}>
                  A full load with us means {TRUCK_CUBIC_FT} ft³ ({OUR_TRUCK_CUBIC_YD} cubic yards) hauled away in a single trip - not a fraction of it. That&apos;s why our top-tier prices look higher than a typical dump-trailer service: you&apos;re getting a lot more capacity for it.
                </p>

                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5" style={{ color: '#1A1714' }}>
                      <span>Stonegate truck</span>
                      <span>{OUR_TRUCK_CUBIC_YD} cu yd</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E0D5' }}>
                      <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: '#254220' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5" style={{ color: '#9A8E83' }}>
                      <span>Standard dump truck</span>
                      <span>~{STANDARD_DUMP_TRUCK_CUBIC_YD} cu yd</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E0D5' }}>
                      <div className="h-full rounded-full" style={{ width: `${(Number(STANDARD_DUMP_TRUCK_CUBIC_YD) / Number(OUR_TRUCK_CUBIC_YD)) * 100}%`, backgroundColor: '#B5A99E' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </FadeIn>
        </section>

        {/* Moving pricing */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
            {/* Moving pricing card */}
            <FadeIn delay={100}>
            <div
              id="moving-pricing"
              className="rounded-3xl overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1"
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
