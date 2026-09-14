import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'
import {
  Shield, DollarSign, Star, MapPin, ArrowRight, Zap,
  Sofa, Refrigerator, Tv, BedDouble, Building2, Wrench, Warehouse, Truck,
} from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'
import ReviewsRow from '@/components/landing/ReviewsRow'

export const metadata: Metadata = {
  title: { absolute: 'Junk Removal Burnaby | Stonegate Moving Solutions' },
  description: 'Fast, same-day junk removal in Burnaby, BC. Furniture, appliances, and property cleanouts hauled away starting at $145. Fully insured, transparent pricing.',
  alternates: { canonical: 'https://www.stonegatemoving.com/burnaby-junk-removal' },
}

const whatWeRemove = [
  { label: 'Furniture', desc: 'Couches, tables, and bulky pieces too heavy to move alone.', Icon: Sofa },
  { label: 'Appliances', desc: 'Fridges, washers, stoves - disconnected and hauled.', Icon: Refrigerator },
  { label: 'Electronics', desc: 'Old TVs, computers, and other e-waste.', Icon: Tv },
  { label: 'Mattresses', desc: 'One mattress or a whole guest room clear-out.', Icon: BedDouble },
  { label: 'Office Furniture', desc: 'Desks, chairs, and full office move-outs.', Icon: Building2 },
  { label: 'Renovation Debris', desc: 'Drywall, cabinets, and old fixtures.', Icon: Wrench },
  { label: 'Property Cleanouts', desc: 'Estate cleanouts and full-property clear-outs.', Icon: Warehouse },
]

const reviews = [
  {
    name: 'Aizhan Tabyldiyeva',
    text: 'Excellent junk removal service! The team was professional, punctual, and worked quickly. Their pricing was very fair and offered great value for the quality of service. They cleared everything out efficiently, and made the whole process easy and stress-free. Highly recommend!!',
  },
  {
    name: 'Albert Go',
    text: 'I had a great experience with Stonegate Moving Solutions for junk removal. They responded quickly, arrived on time, and cleared everything out much faster than I expected. The crew was friendly, professional, and handled everything…',
  },
  {
    name: 'Ksusha Martynova',
    text: "Needed some old furniture and random junk hauled away, and these guys did an awesome job. They were courteous, worked fast, and had everything loaded up in no time. The price was better than I expected, especially for how much they took. I'll definitely be calling them again the next time I need junk removed.",
  },
]

const areas = [
  'Metrotown', 'Brentwood', 'Burnaby Heights', 'Edmonds',
  'Lougheed', 'Deer Lake', 'Capitol Hill', 'Burnaby Mountain',
]

const faqs = [
  {
    q: 'Do you offer same-day junk removal in Burnaby?',
    a: 'Yes - same-day junk removal is available in Burnaby, depending on our schedule that day. Book early in the day for the best chance of a same-day pickup.',
  },
  {
    q: 'How much does junk removal cost in Burnaby?',
    a: 'We price by truck space (from $145 for a small load up to $700 for a full truck) or by weight ($550 per 1,000 kg) for heavier items like dirt or concrete. See our full pricing page for details.',
  },
  {
    q: 'Do you offer a better rate for Burnaby jobs?',
    a: 'Yes - since we\'re based in Burnaby, local jobs often work out more affordably, and we can offer further savings when we have multiple bookings in the same area. Ask us when you request your quote.',
  },
  {
    q: 'What can you take?',
    a: 'Furniture, appliances, electronics, mattresses, office furniture, renovation debris, and full property cleanouts. We can\'t take hazardous waste, paint, chemicals, or asbestos - ask us if you\'re unsure.',
  },
  {
    q: 'How big is your truck?',
    a: 'Our truck holds 780 cubic feet (29 cubic yards) - about 2.4x the capacity of a standard dump truck, so a full load with us clears a lot more in one trip.',
  },
  {
    q: 'How do I get a quote?',
    a: 'Request a free quote online or contact us with a description or photos of what needs to go - we\'ll confirm the exact price on-site before we start.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Junk Removal',
  name: 'Burnaby Junk Removal - Stonegate Moving Solutions',
  areaServed: {
    '@type': 'City',
    name: 'Burnaby',
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Metro Vancouver' },
  },
  provider: {
    '@type': 'MovingCompany',
    name: 'Stonegate Moving Solutions',
    telephone: '+16043546479',
    email: 'orders@stonegatemoving.com',
    url: 'https://www.stonegatemoving.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Burnaby', addressRegion: 'BC', addressCountry: 'CA' },
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'CAD',
    price: '145',
    description: 'Junk removal starting price for the smallest truck-space tier',
  },
}

export default function BurnabyJunkRemovalPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ minHeight: '440px' }}>
          <Image
            src="/burnaby/burnaby-junk-truck-loaded.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,23,20,0.8) 0%, rgba(26,23,20,0.5) 45%, rgba(26,23,20,0.15) 80%)' }} />
          <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-20">
            <FadeIn>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6 border rounded-full px-4 py-1.5" style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.35)' }}>
                <MapPin size={13} /> Based in Burnaby
              </span>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6" style={{ color: '#FFFFFF' }}>
                Junk Removal in Burnaby, BC
              </h1>
              <p className="text-lg leading-relaxed max-w-xl mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Furniture, appliances, and full property cleanouts hauled away fast - same-day pickup available. Fully insured, transparent pricing, no hidden fees.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/book-service?type=junk-removal">
                  <Button className="text-base py-6 px-8 rounded-full font-bold border-0" style={{ backgroundColor: '#FAF7F2', color: '#254220' }}>
                    Get a Free Quote →
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {([
                  { Icon: Star, label: '5.0 Google Rating' },
                  { Icon: Shield, label: 'Fully Insured' },
                  { Icon: Zap, label: 'Same-Day Available' },
                  { Icon: DollarSign, label: 'Transparent Pricing' },
                ] as const).map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon size={14} style={{ color: 'rgba(255,255,255,0.75)' }} />
                    <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Before & After */}
        <section style={{ borderBottom: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#A9743F' }}>Real results</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>Before &amp; After a Burnaby Cleanout</h2>
            </FadeIn>
            <FadeIn>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E0D5' }}>
                <div className="grid grid-cols-2">
                  <div className="relative" style={{ height: '420px' }}>
                    <Image src="/burnaby/burnaby-junk-before-cleanout.jpg" alt="Before junk removal - cluttered property in Burnaby" fill className="object-cover" />
                    <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1" style={{ backgroundColor: 'rgba(26,23,20,0.6)', color: '#FFFFFF' }}>
                      Before
                    </span>
                  </div>
                  <div className="relative" style={{ height: '420px' }}>
                    <Image src="/burnaby/burnaby-junk-after-cleanout.jpg" alt="After junk removal - cleared property in Burnaby" fill className="object-cover" />
                    <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1" style={{ backgroundColor: '#A9743F', color: '#FFFFFF' }}>
                      After
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* What We Remove */}
        <section style={{ backgroundColor: '#F5F0EB', borderBottom: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#A9743F' }}>What we take</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>What We Remove</h2>
            </FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {whatWeRemove.map(({ label, desc, Icon }, i) => (
                <FadeIn key={label} delay={i * 50}>
                  <div className="h-full rounded-2xl p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#E8F0E6' }}>
                      <Icon size={20} style={{ color: '#254220' }} />
                    </span>
                    <p className="font-bold text-sm mb-1" style={{ color: '#1A1714' }}>{label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9A8E83' }}>{desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn>
              <p className="text-xs leading-relaxed" style={{ color: '#6B5E54' }}>
                <span className="font-bold" style={{ color: '#1A1714' }}>What we can&apos;t take: </span>
                hazardous waste, paint, chemicals, and asbestos. Ask us if you&apos;re unsure - we&apos;ll point you in the right direction.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Pricing */}
        <section>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <FadeIn>
              <div
                className="rounded-3xl overflow-hidden flex flex-col sm:flex-row items-center gap-8 p-8 sm:p-10"
                style={{ background: 'linear-gradient(135deg, #1e3a1a 0%, #254220 60%, #2f5229 100%)' }}
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#B5C9B0' }}>Junk removal pricing</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-6xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>$145</span>
                    <span className="text-lg font-semibold mb-1" style={{ color: '#B5C9B0' }}>and up</span>
                  </div>
                  <p className="text-sm" style={{ color: '#B5C9B0' }}>Priced by truck space (up to $700 for a full load) or by weight at $550/1,000 kg.</p>
                </div>
                <Link href="/pricing#junk-pricing" className="flex-shrink-0">
                  <Button className="rounded-full text-sm font-bold px-7 py-6 border-0" style={{ backgroundColor: '#FAF7F2', color: '#254220' }}>
                    See Full Pricing <ArrowRight size={15} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Our Truck */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="flex flex-col md:flex-row gap-6 px-6 py-6 items-stretch">
            <FadeIn className="md:w-2/5">
              <div className="flex flex-col justify-center px-10 py-16 h-full rounded-3xl" style={{ backgroundColor: '#254220' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#B5C9B0' }}>
                  <Truck size={13} className="inline mr-2" style={{ verticalAlign: '-2px' }} /> Our truck
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-6" style={{ color: '#FAF7F2' }}>
                  780 ft³.<br />29 cubic yards.
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: '#B5C9B0' }}>
                  Our truck comes fully equipped with straps, dollies, and protective padding, so a full load clears out far more than a typical dump-trailer service in a single trip.
                </p>
                <Link href="/book-service?type=junk-removal">
                  <Button className="self-start rounded-full text-sm font-bold px-7 py-3.5 border-0" style={{ backgroundColor: '#FAF7F2', color: '#254220' }}>
                    Get a Free Quote
                  </Button>
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={120} className="md:w-3/5">
              <div className="relative w-full rounded-3xl overflow-hidden" style={{ height: '420px', backgroundColor: '#FAF7F2' }}>
                <Image
                  src="/truck-dimensions.jpg"
                  alt="Stonegate truck dimensions: 16 feet long, 7.5 feet wide, 6.5 feet tall"
                  fill
                  className="object-contain"
                  style={{ objectPosition: 'center', mixBlendMode: 'multiply' }}
                />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Areas Served */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>Coverage</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>Areas We Serve in Burnaby</h2>
              <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: '#6B5E54' }}>
                We pick up junk across all of Burnaby, including:
              </p>
            </FadeIn>
            <div className="flex flex-wrap gap-3">
              {areas.map((area, i) => (
                <FadeIn key={area} delay={i * 40}>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-4 py-2" style={{ backgroundColor: '#F5F0EB', border: '1px solid #E8E0D5', color: '#1A1714' }}>
                    <MapPin size={13} style={{ color: '#254220' }} /> {area}
                  </span>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#014421' }}>Reviews</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-4" style={{ color: '#1A1714' }}>What Our Customers Say</h2>
              <div className="flex items-center justify-center gap-2 mb-14">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={18} fill="#D4A017" style={{ color: '#D4A017' }} />
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: '#1A1714' }}>5.0 from Google reviews</span>
              </div>
            </FadeIn>
            <ReviewsRow reviews={reviews} />
            <div className="text-center">
              <a href="https://maps.app.goo.gl/ooQYs564eGP7JZbC6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Button className="text-base py-6 px-8 rounded-full font-bold border-0" style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
                  Read More Reviews on Google →
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-10" style={{ color: '#1A1714' }}>Common questions</p>
            </FadeIn>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {faqs.map(({ q, a }, i) => (
                <FadeIn key={q} delay={i * 60}>
                  <p className="font-bold mb-2" style={{ color: '#1A1714' }}>{q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{a}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <FadeIn>
            <div className="max-w-6xl mx-auto px-6 py-20 text-center">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>
                Ready to Clear the Clutter?
              </h2>
              <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: '#6B5E54' }}>
                Get a free quote in minutes - same-day pickup available in Burnaby.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/book-service?type=junk-removal">
                  <Button className="text-base px-10 py-6 rounded-full font-bold border-0" style={{ backgroundColor: '#254220', color: '#FAF7F2' }}>
                    Get a Free Quote
                  </Button>
                </Link>
                <Link href="/burnaby-movers">
                  <Button className="text-base px-10 py-6 rounded-full font-bold" style={{ backgroundColor: 'transparent', color: '#254220', border: '2px solid #254220' }}>
                    Need Movers Instead?
                  </Button>
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
