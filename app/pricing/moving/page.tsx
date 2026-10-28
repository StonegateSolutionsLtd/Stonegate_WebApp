import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import GoogleLogo from '@/components/GoogleLogo'
import { ArrowRight, CheckCircle2, Clock, MapPin, Route, ShieldCheck, Star, Truck, Users } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import FadeIn from '@/components/landing/FadeIn'
import StickyCallBar from '@/components/landing/StickyCallBar'
import { JsonLd } from '@/components/seo/SeoBlocks'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import PriceEstimator from '@/components/moving/PriceEstimator'
import { MovingReviews, MovingFaq, MovingClose, GREEN, INK, MUTED, CREAM, CLAY, LINE, MASCOT, eyebrow, sectionWrap } from '@/components/moving/MovingSections'
import { SITE_URL, MOVE_BOOK_HREF, providerLd, breadcrumbLd, faqLd } from '@/lib/seo/site'

export const metadata: Metadata = {
  title: { absolute: 'Moving Prices in Vancouver | $120-$160/hr + GST | Stonegate' },
  description: 'Moving prices in Metro Vancouver: 2 movers with a fully equipped truck at $120/hr, or 3 movers with a 16\' truck at $160/hr + GST, 3-hour minimum. Plus a one-time flat-rate travel fee, explained upfront.',
  keywords: ['moving cost Vancouver', 'movers hourly rate Vancouver', 'how much do movers cost', 'Metro Vancouver moving prices', 'apartment moving cost'],
  alternates: { canonical: `${SITE_URL}/pricing/moving` },
}

const GOOGLE_REVIEWS = 'https://maps.app.goo.gl/ooQYs564eGP7JZbC6'

const tiers = [
  { Icon: Users, crew: '2 Movers + Truck', price: '$120', fit: 'Studios, 1- and 2-bedroom homes' },
  { Icon: Truck, crew: '3 Movers + 16\' Truck', price: '$160', fit: 'Houses and bigger moves, finished faster' },
]

const included = [
  'Professional, uniformed movers',
  'Moving truck - fully equipped',
  'Moving blankets, straps and dollies',
  'Disassembly & reassembly of basic furniture',
  'Floor and door-frame protection',
  'No fuel surcharge, no hidden fees',
]

// The bill, as one line of arithmetic
const bill = [
  { top: 'Hours worked', bottom: '3-hour minimum' },
  { op: '×' },
  { top: '$120 or $160', bottom: 'per hour, by crew' },
  { op: '+' },
  { top: 'Travel fee', bottom: 'fixed, based on truck travel time' },
  { op: '+' },
  { top: 'GST', bottom: '5%' },
] as const

const faqs = [
  { q: 'How much do movers cost in Vancouver?', a: '2 professional movers with a fully equipped truck cost $120/hr + GST, with a 3-hour minimum. For bigger moves, 3 movers with a 16\' truck are $160/hr + GST. Most 1-bedroom moves take 3-4 hours.' },
  { q: 'How is the travel fee worked out?', a: "It covers the truck's drive time: from our base to your pickup address, and back from your drop-off. It's a fixed, one-time amount based on that travel time, and we tell you the exact figure before your move. It doesn't change on moving day." },
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
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: CREAM }}>
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

        {/* Hero: the two rates, big */}
        <section className="relative overflow-hidden" style={{ backgroundColor: GREEN }}>
          {/* On wide screens the mascot fills the empty space left of the content, standing on the hero's bottom edge */}
          <div
            className="hidden min-[1600px]:block absolute bottom-0 aspect-square right-[calc(50%+36rem+24px)] w-[min(340px,calc(50vw-36rem-56px))] 3xl:right-[calc(50%+40rem+24px)] 3xl:w-[min(380px,calc(50vw-40rem-56px))]"
            aria-hidden
          >
            <Image src={MASCOT} alt="" fill sizes="380px" className="object-contain object-bottom" />
          </div>
          {/* Below lg the left column dissolves so its parts and the price cards can be ordered: headline, intro, prices, buttons */}
          <div className={`${sectionWrap} relative pt-8 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24 grid lg:grid-cols-[1fr_1.15fr] gap-6 sm:gap-10 lg:gap-14 items-center`}>
            <div className="contents lg:block">
              <div className="order-1 flex items-center justify-between gap-4 lg:mb-5">
              <h1 className="flex flex-col font-extrabold uppercase tracking-tight leading-none w-fit" style={{ fontSize: 'clamp(2.4rem, 6.5vw, 4.4rem)' }}>
                <span style={{ color: CREAM }}>Moving</span>
                <span className="flex items-center gap-3" style={{ fontSize: 'clamp(0.7rem, 1.6vw, 1rem)', margin: '0.45em 0', letterSpacing: '0.3em' }}>
                  <span style={{ flex: 0.3, height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(250,247,242,0.4))' }} />
                  <span className="font-extrabold whitespace-nowrap" style={{ color: CREAM }}>SIMPLE HOURLY</span>
                  <span style={{ flex: 1.7, height: '1.5px', background: 'linear-gradient(to right, rgba(250,247,242,0.4), transparent)' }} />
                </span>
                <span style={{ color: CLAY, fontSize: '1.15em' }}>Prices</span>
              </h1>
              {/* Phones and tablets: the mascot beside the headline */}
              <div className="lg:hidden relative shrink-0 w-[118px] sm:w-[180px] aspect-square">
                <Image src={MASCOT} alt="Stonegate mascot giving a thumbs up and holding a moving box" fill priority sizes="180px" className="object-contain" />
              </div>
              </div>
              <p className="order-2 text-[17px] sm:text-[20px] leading-snug max-w-[480px] lg:mb-7" style={{ color: '#D6E2D3' }}>
                Pick your crew, pay for the hours we work. The truck, blankets and equipment are included.
              </p>
              <div className="order-4 flex flex-col sm:flex-row gap-3" id="pricing-cta">
                <a href="#estimate" className="flex items-center justify-center gap-2 rounded-full min-h-[56px] px-7 font-extrabold transition-[transform,background-color] active:scale-[0.97] hover:bg-white" style={{ backgroundColor: CREAM, color: GREEN }}>
                  Estimate My Move <ArrowRight size={18} aria-hidden />
                </a>
                <PhoneLink className="flex items-center justify-center gap-2 rounded-full min-h-[56px] px-6 font-bold border-2 transition-[transform,background-color] active:scale-[0.97] hover:bg-white/10" style={{ color: CREAM, borderColor: CLAY, fontVariantNumeric: 'lining-nums tabular-nums' }}>
                  Call <PhoneNumber />
                </PhoneLink>
              </div>
            </div>

            <ul className="order-3 grid grid-cols-2 gap-2.5 sm:gap-4 -mx-1 sm:mx-0">
              {tiers.map(({ Icon, crew, price, fit }, i) => (
                <li key={crew}>
                  <FadeIn delay={i * 100} className="h-full">
                    <div className="h-full rounded-2xl sm:rounded-3xl p-[18px] sm:p-7 flex flex-col transition-transform duration-300 hover:-translate-y-1" style={{ backgroundColor: CREAM }}>
                      <span className="hidden sm:flex w-12 h-12 rounded-2xl items-center justify-center mb-5" style={{ backgroundColor: '#E8F0E6' }}>
                        <Icon size={22} style={{ color: GREEN }} aria-hidden />
                      </span>
                      <p className="text-[16px] sm:text-lg font-extrabold leading-tight" style={{ color: INK }}>{crew}</p>
                      <p className="mt-2 sm:mt-3 flex items-end gap-1">
                        <span className="text-[2.5rem] sm:text-6xl font-extrabold leading-none tracking-tight" style={{ color: GREEN }}>{price}</span>
                        <span className="text-base sm:text-lg font-bold mb-0.5 sm:mb-1" style={{ color: MUTED }}>/hr</span>
                      </p>
                      <p className="mt-1.5 text-[14px] sm:text-sm font-semibold leading-snug" style={{ color: MUTED }}>+ GST · 3-hour minimum<span className="hidden sm:inline"> · + fixed travel fee</span></p>
                      <p className="mt-3.5 pt-3.5 sm:mt-5 sm:pt-5 text-[15px] font-semibold leading-snug" style={{ color: INK, borderTop: `1px solid ${LINE}` }}>{fit}</p>
                    </div>
                  </FadeIn>
                </li>
              ))}
              {/* The travel fee, said plainly next to the rates */}
              <li className="col-span-2 flex items-start gap-3 rounded-2xl px-4 py-3 sm:px-5 sm:py-4" style={{ backgroundColor: 'rgba(250,247,242,0.08)', border: '1px solid rgba(250,247,242,0.18)' }}>
                <Route size={22} className="shrink-0 mt-0.5" style={{ color: CLAY }} aria-hidden />
                <p className="text-[14px] sm:text-[15px] leading-relaxed" style={{ color: '#D6E2D3' }}>
                  <span className="font-bold" style={{ color: CREAM }}>Plus a one-time travel fee.</span>{' '}It covers the truck&apos;s drive to your pickup address and back from your drop-off, based on that travel time. It&apos;s fixed and confirmed with you before your move, so there are no surprises on moving day.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Trust, right under the prices: the real crew, the Google rating with a real review, insurance */}
        <section style={{ backgroundColor: CREAM }}>
          <div className={`${sectionWrap} py-10 sm:py-12`}>
            <FadeIn>
              <div className="rounded-3xl overflow-hidden grid md:grid-cols-[0.9fr_1.4fr]" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}` }}>
                <div className="relative h-52 sm:h-64 md:h-auto md:min-h-[300px]" style={{ backgroundColor: LINE }}>
                  <Image src="/about/photo-3.jpg" alt="The Stonegate moving crew in front of their truck" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" style={{ objectPosition: 'center 55%' }} />
                </div>
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <h2 className="sr-only">Why customers trust Stonegate</h2>
                  <a href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer" className="group flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 w-fit">
                    <span className="text-4xl font-extrabold leading-none" style={{ color: INK }}>4.9</span>
                    <span className="flex gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }, (_, i) => <Star key={i} size={20} fill="#D4A017" style={{ color: '#D4A017' }} />)}
                    </span>
                    <span className="flex items-center gap-1.5 text-[15px] font-semibold underline underline-offset-4 decoration-[#E8E0D5] group-hover:decoration-current" style={{ color: MUTED }}><GoogleLogo size={16} /> Google reviews</span>
                  </a>
                  <blockquote className="text-lg sm:text-xl font-semibold leading-snug mb-2" style={{ color: INK }}>
                    &ldquo;The guys were on time, worked quickly, and took good care of my stuff.&rdquo;
                  </blockquote>
                  <p className="flex items-center gap-1.5 text-sm mb-6" style={{ color: MUTED }}><GoogleLogo size={14} /> Aryan Kapoor, Google review</p>
                  <ul className="flex flex-wrap gap-2">
                    {([
                      { Icon: ShieldCheck, label: 'Fully insured' },
                      { Icon: Users, label: 'Uniformed movers' },
                      { Icon: MapPin, label: 'Based in Burnaby' },
                    ] as const).map(({ Icon, label }) => (
                      <li key={label} className="flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-semibold" style={{ backgroundColor: '#E8F0E6', color: GREEN }}>
                        <Icon size={16} aria-hidden /> {label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Estimator */}
        <section id="estimate" style={{ backgroundColor: '#F5F0EB', scrollMarginTop: '80px' }}>
          <div className={`${sectionWrap} py-16 sm:py-20`}>
            <FadeIn>
              <p className={`${eyebrow} text-center`} style={{ color: GREEN }}>Quick estimate</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-10" style={{ color: INK }}>What Will My Move Cost?</h2>
            </FadeIn>
            <FadeIn delay={80}>
              <PriceEstimator />
            </FadeIn>
          </div>
        </section>

        {/* How the bill works */}
        <section style={{ backgroundColor: CREAM }}>
          <div className={`${sectionWrap} py-16 sm:py-20`}>
            <FadeIn>
              <p className={eyebrow} style={{ color: GREEN }}>How your bill works</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-10" style={{ color: INK }}>One Simple Formula</h2>
            </FadeIn>
            <FadeIn delay={80}>
              <div className="flex flex-col lg:flex-row lg:items-stretch gap-3">
                {bill.map((b, i) =>
                  'op' in b ? (
                    <span key={i} className="self-center text-3xl font-extrabold leading-none" style={{ color: CLAY }} aria-hidden>{b.op}</span>
                  ) : (
                    <div key={i} className="flex-1 rounded-2xl px-5 py-5 text-center" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}` }}>
                      <p className="text-xl font-extrabold" style={{ color: INK }}>{b.top}</p>
                      <p className="text-sm mt-1" style={{ color: MUTED }}>{b.bottom}</p>
                    </div>
                  ),
                )}
                <span className="self-center text-3xl font-extrabold leading-none" style={{ color: CLAY }} aria-hidden>=</span>
                <div className="flex-1 rounded-2xl px-5 py-5 text-center" style={{ backgroundColor: GREEN }}>
                  <p className="text-xl font-extrabold" style={{ color: CREAM }}>Your total</p>
                  <p className="text-sm mt-1" style={{ color: '#B5C9B0' }}>paid after the job</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={140}>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="flex gap-3 rounded-2xl p-5" style={{ backgroundColor: '#F5F0EB' }}>
                  <Clock size={22} className="shrink-0 mt-0.5" style={{ color: GREEN }} aria-hidden />
                  <p className="text-base leading-relaxed" style={{ color: INK }}>
                    <span className="font-bold">The clock starts</span> when the crew arrives at your pickup address.
                  </p>
                </div>
                <div className="flex gap-3 rounded-2xl p-5" style={{ backgroundColor: '#F5F0EB' }}>
                  <CheckCircle2 size={22} className="shrink-0 mt-0.5" style={{ color: GREEN }} aria-hidden />
                  <p className="text-base leading-relaxed" style={{ color: INK }}>
                    <span className="font-bold">It stops</span> once everything is in place at your new home.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* What's included */}
        <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }}>
          <div className={`${sectionWrap} py-16 sm:py-20 grid md:grid-cols-2 gap-12 items-center`}>
            <FadeIn className="order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden h-[420px] md:h-[520px]" style={{ backgroundColor: LINE }}>
                <Image src="/about/photo-4.jpg" alt="Two Stonegate movers lifting a box into the moving truck" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" style={{ objectPosition: 'center 60%' }} />
              </div>
            </FadeIn>
            <FadeIn delay={120} className="order-1 md:order-2">
              <div>
                <p className={eyebrow} style={{ color: GREEN }}>Included in the rate</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8" style={{ color: INK }}>Everything Comes With the Crew</h2>
                <ul className="grid gap-4 mb-9">
                  {included.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={22} className="shrink-0" style={{ color: GREEN }} aria-hidden />
                      <span className="text-lg font-semibold" style={{ color: INK }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={MOVE_BOOK_HREF} className="inline-flex items-center justify-center gap-2 rounded-full min-h-[56px] px-7 font-extrabold transition-[transform,background-color] active:scale-[0.97] hover:bg-[#00341A]" style={{ backgroundColor: GREEN, color: CREAM }}>
                  Check Moving Availability <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        <MovingReviews />

        <MovingFaq heading="Moving pricing FAQ" faqs={faqs} />

        <MovingClose
          heading="Ready to book your move?"
          text="Check availability online in a couple of minutes, or call us to talk through your move."
        />
      </main>

      <Footer />
      <StickyCallBar watchId="pricing-cta" quoteHref={MOVE_BOOK_HREF} quoteLabel="Book Your Move" />
    </div>
  )
}
