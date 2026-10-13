import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'
import { Users, Clock, Truck, Info, CheckCircle2, Route } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'
import { JsonLd, Breadcrumbs, CallBand, FaqList, LinkGrid } from '@/components/seo/SeoBlocks'
import { SITE_URL, MOVE_BOOK_HREF, providerLd, breadcrumbLd, faqLd } from '@/lib/seo/site'

export const metadata: Metadata = {
  title: { absolute: 'Moving Prices in Vancouver | $120-$160/hr + GST | Stonegate' },
  description: 'Moving prices in Metro Vancouver: 2 movers with a fully equipped truck at $120/hr, or 3 movers with a 16\' truck at $160/hr + GST, 3-hour minimum. Plus a one-time flat-rate travel fee, explained upfront.',
  keywords: ['moving cost Vancouver', 'movers hourly rate Vancouver', 'how much do movers cost', 'Metro Vancouver moving prices', 'apartment moving cost'],
  alternates: { canonical: `${SITE_URL}/pricing/moving` },
}

const included = [
  'Professional, uniformed movers',
  'Moving truck - fully equipped',
  'Moving blankets, straps, and dollies',
  'Disassembly & reassembly of basic furniture',
  'Floor and door-frame protection',
  'No fuel surcharge, no hidden fees',
]

const tiers = [
  {
    icon: Users,
    eyebrow: 'Apartment & Home Moving',
    title: '2 Movers & Truck',
    price: '$120',
    unit: '/hr',
    sub: 'CAD + GST · 3-hour minimum · 2 movers',
  },
  {
    icon: Truck,
    eyebrow: 'Bigger Moves',
    title: "3 Movers & 16' Truck",
    price: '$160',
    unit: '/hr',
    sub: "CAD + GST · 3-hour minimum · 3 movers, 16' truck",
  },
]

const notes = [
  {
    icon: Clock,
    title: '3-hour minimum',
    body: 'Most 1-bedroom moves complete in 3-4 hours. 2-bedrooms typically take 4-5 hours depending on the amount of items.',
  },
  {
    icon: Truck,
    title: 'Truck included',
    body: 'Our fully-equipped truck is part of the hourly rate. There are no separate vehicle or fuel fees added to your bill.',
  },
  {
    icon: Route,
    title: 'One-time travel fee',
    body: 'Along with the hourly rate, a one-time flat-rate travel fee applies. We explain the exact amount to you ahead of time, so it\'s never a surprise.',
  },
  {
    icon: Info,
    title: 'Need a bigger crew?',
    body: 'Moving a house or a bigger apartment? Choose the 3-mover, 16\' truck option above for faster, larger moves.',
  },
]

const faqs = [
  { q: 'How much do movers cost in Vancouver?', a: '2 professional movers with a fully equipped truck cost $120/hr + GST, with a 3-hour minimum. For bigger moves, 3 movers with a 16\' truck are $160/hr + GST. Most 1-bedroom moves take 3-4 hours.' },
  { q: 'Is there a travel fee?', a: 'Yes - in addition to the hourly rate, we charge a one-time flat-rate travel fee. We\'ll tell you the exact amount ahead of time when you book, so there are no surprises.' },
  { q: 'When does the clock start?', a: 'Time starts when our team arrives at your pickup address and stops once everything is in place at your new home.' },
  { q: 'Are stairs or long carry distances extra?', a: 'Not in most cases. If your building has no elevator and requires many flights of stairs, we\'ll discuss it with you at booking - never a surprise on moving day.' },
  { q: 'What payment methods do you accept?', a: 'We accept e-transfer, credit card, and cash. Payment is collected after the job is complete.' },
]

const crumbs = [
  { name: 'Home', href: '/' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Moving Pricing', href: '/pricing/moving' },
]

export default function MovingPricingPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <JsonLd graph={[
        {
          '@type': 'Service',
          name: 'Moving - Metro Vancouver',
          serviceType: 'Moving',
          url: `${SITE_URL}/pricing/moving`,
          provider: providerLd,
          offers: [
            { '@type': 'Offer', price: '120', priceCurrency: 'CAD', description: '2 movers with truck, per hour + GST, 3-hour minimum, plus a one-time flat-rate travel fee' },
            { '@type': 'Offer', price: '160', priceCurrency: 'CAD', description: '3 movers with 16\' truck, per hour + GST, 3-hour minimum, plus a one-time flat-rate travel fee' },
          ],
        },
        breadcrumbLd(crumbs),
        faqLd(faqs),
      ]} />
      <Navbar />

      <main className="flex-1">
        <Breadcrumbs crumbs={crumbs} />

        {/* Page header */}
        <section className="max-w-6xl mx-auto px-6 pt-10 pb-12">
          <FadeIn>
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-6 border rounded-full px-4 py-1.5"
            style={{ color: '#254220', borderColor: '#B5C9B0' }}
          >
            Moving pricing
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6" style={{ color: '#1A1714' }}>
            Simple, upfront <span style={{ color: '#254220' }}>hourly rates.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#6B5E54' }}>
            Choose 2 movers or 3 movers with a 16&apos; truck, anywhere in Metro Vancouver. We charge an hourly rate plus a one-time flat-rate travel fee, explained to you ahead of time - no fuel surcharge, no hidden fees.
          </p>
          </FadeIn>
        </section>

        {/* Moving pricing */}
        <section id="moving-pricing" className="max-w-6xl mx-auto px-6 pb-12" style={{ scrollMarginTop: '16px' }}>
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {tiers.map(({ icon: Icon, eyebrow, title, price, unit, sub }, i) => (
                <FadeIn key={title} delay={i * 100} className="h-full">
                <div
                  className="h-full rounded-3xl overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1"
                  style={{ border: '1px solid #E8E0D5', boxShadow: '0 2px 12px rgba(37,66,32,0.06)' }}
                >
                  <div className="relative overflow-hidden px-8 pt-10 pb-8" style={{ background: 'linear-gradient(135deg, #1e3a1a 0%, #254220 60%, #2f5229 100%)' }}>
                    <Icon size={160} className="absolute -right-6 -top-6 opacity-[0.07]" style={{ color: '#FAF7F2' }} />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-8">
                        <span
                          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1"
                          style={{ color: '#B5C9B0', borderColor: 'rgba(181,201,176,0.3)' }}
                        >
                          <Icon size={13} />
                          {eyebrow}
                        </span>
                      </div>
                      <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#FAF7F2' }}>
                        {title}
                      </h2>
                      <div className="flex items-end gap-2 mb-1">
                        <span className="text-6xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>{price}</span>
                        <span className="text-xl font-semibold mb-1" style={{ color: '#B5C9B0' }}>{unit}</span>
                      </div>
                      <span className="text-sm font-medium" style={{ color: '#B5C9B0' }}>{sub}</span>
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
                        Request Your Move
                      </Button>
                    </Link>
                  </div>
                </div>
                </FadeIn>
              ))}
            </div>
            <p className="text-sm mt-6" style={{ color: '#6B5E54' }}>
              Plus a one-time flat-rate travel fee - we&apos;ll explain the exact amount to you ahead of time, so it&apos;s never a surprise.
            </p>
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

        <FaqList faqs={faqs} heading="Moving pricing FAQ" />

        <CallBand
          heading="Ready to book your move?"
          text="Check availability online in a couple of minutes, or call us to talk through your move."
          bookHref={MOVE_BOOK_HREF}
          bookLabel="Check Availability"
        />

        <section style={{ backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <LinkGrid
              heading="More from Stonegate"
              cols={3}
              links={[
                { href: '/moving', label: 'Moving Services' },
                { href: '/junk-removal/move-out-cleanout', label: 'Move-Out Junk Removal' },
                { href: '/pricing/junk-removal', label: 'Junk Removal Prices' },
              ]}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
