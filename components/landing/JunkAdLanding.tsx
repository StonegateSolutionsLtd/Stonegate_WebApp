import Image from 'next/image'
import Link from 'next/link'
import {
  Phone, ArrowRight, Star, CheckCircle2, AlertTriangle, Hand, Truck, Recycle, Zap, Shield, BadgeDollarSign,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import StickyCallBar from '@/components/landing/StickyCallBar'
import BeforeAfterSlider from '@/components/landing/BeforeAfterSlider'
import RevealOnScroll from '@/components/landing/RevealOnScroll'
import { PriceTicket, FaqText, revealDelay as delay } from '@/components/landing/JunkBlocks'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import { type JunkItem, junkItemHref } from '@/lib/seo/junk-items'
import type { JunkAd } from '@/lib/seo/junk-ads'
import { beforeAfterPairs, featuredReview, reviews, GOOGLE_REVIEWS_URL } from '@/lib/seo/junk-proof'
import { CITIES, cityJunkHref } from '@/lib/seo/cities'
import { JUNK_BOOK_HREF, type Faq } from '@/lib/seo/site'

const GREEN = '#014421'
const FOREST = '#064B31'
const INK = '#1A1714'
const MUTED = '#6B5E54'
const LINE = '#E8E0D5'
const CREAM = '#FAF7F2'
const WHITE = '#FFFFFF'
const LIGHT_GREEN = '#E8F0E6'
const TAN = '#F3EADD'
// Shared grade for the hero photo pair - tames the saturated job photos so they match the crew portraits
const PHOTO_GRADE = 'saturate(0.82) contrast(1.04) brightness(1.03)'

const serviceFacts = [
  { Icon: Zap, title: 'Same-day', text: 'or next-day' },
  { Icon: Shield, title: 'Fully insured', text: 'local crew' },
  { Icon: BadgeDollarSign, title: 'Pay after', text: 'no deposit' },
]

const steps = [
  { title: 'Get your free estimate', text: 'Book online or call. Tell us what is going and pick a time - no deposit, no obligation.' },
  { title: 'Price confirmed on site', text: 'The crew sees everything and gives you the exact price before lifting a thing.' },
  { title: 'We haul it all away', text: 'We carry it out from any room or floor, load the truck and sweep up after. You pay when it is done.' },
]

const crewFacts = [
  { Icon: Hand, text: 'Any room, any floor - stairs included' },
  { Icon: Truck, text: '29 yd³ truck - about 2.4x a standard dump truck' },
  { Icon: Recycle, text: 'Usable items donated, materials recycled' },
]

function Stars({ size = 15 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => <Star key={i} size={size} fill="#D4A017" style={{ color: '#D4A017' }} aria-hidden />)}
    </span>
  )
}

import GoogleLogo from '@/components/GoogleLogo'

export { GoogleLogo }

function QuoteCta({ id, className = '', onDark = false }: { id?: string; className?: string; onDark?: boolean }) {
  return (
    <a
      id={id}
      href={JUNK_BOOK_HREF}
      className={`flex items-center justify-center gap-2 rounded-full font-extrabold text-lg min-h-[58px] px-8 transition-[transform,opacity] active:scale-[0.97] hover:opacity-90 ${className}`}
      style={onDark ? { backgroundColor: CREAM, color: GREEN } : { backgroundColor: FOREST, color: WHITE }}
    >
      <span className="whitespace-nowrap">Get a Free Estimate</span> <ArrowRight size={19} aria-hidden />
    </a>
  )
}

function CallCta({ className = '', onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <PhoneLink
      className={`flex items-center justify-center gap-2 rounded-full font-bold text-[17px] min-h-[58px] px-6 transition-[transform,background-color] active:scale-[0.97] ${onDark ? 'bg-white/10 hover:bg-white/20' : 'bg-[#E8F0E6] hover:bg-[#D9E7D6]'} ${className}`}
      style={{ color: onDark ? WHITE : FOREST, fontVariantNumeric: 'lining-nums tabular-nums' }}
    >
      <Phone size={17} fill="currentColor" aria-hidden />
      <span className="whitespace-nowrap">Call <PhoneNumber /></span>
    </PhoneLink>
  )
}

function Heading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 data-reveal className={`text-[28px] min-[400px]:text-[30px] sm:text-[38px] font-extrabold leading-[1.1] tracking-tight text-balance ${className}`} style={{ color: INK }}>
      {children}
    </h2>
  )
}

/** The key words of a heading, in the brand green */
function Accent({ children }: { children: React.ReactNode }) {
  return <span style={{ color: GREEN }}>{children}</span>
}

/** Thin rule at the top of every section after the hero, so neighbouring cream/white sections read as separate */
const RULE = `1px solid ${LINE}`

export default function JunkAdLanding({ item, ad, faqs, related }: { item: JunkItem; ad: JunkAd; faqs: Faq[]; related: JunkItem[] }) {
  const sliderPairs = ad.sliderFirst
    ? [...beforeAfterPairs].sort((a, b) => Number(b.label === ad.sliderFirst) - Number(a.label === ad.sliderFirst))
    : beforeAfterPairs

  return (
    <div className="flex flex-col min-h-svh pb-[84px] lg:pb-0 selection:bg-[#E8F0E6] selection:text-[#014421] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#014421]" style={{ backgroundColor: WHITE }}>
      <RevealOnScroll />
      <Navbar minimalMobile />

      {/* Main sits above the footer so on desktop it slides away like a sheet to uncover it (curtain footer) */}
      <main className="flex-1 relative z-10" style={{ backgroundColor: WHITE }}>

        {/* ───────── Hero ───────── */}
        {/* Only what decides the click: headline → the item + crew photo pair (captions under, nothing laid over) → one main button,
            with the framed call button and rating under it. Everything else is grouped in the "why us" block straight after. */}
        {/* Warm, a step lighter than the full tan */}
        <section style={{ backgroundColor: '#F4ECE0' }}>
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12 sm:py-14 lg:py-20 grid grid-cols-[minmax(0,1fr)] [grid-template-areas:'text'_'photo'_'cta'] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:[grid-template-areas:'text_photo'_'cta_photo'] lg:gap-x-12 xl:gap-x-16">
            <div className="[grid-area:text] lg:self-end">
              <h1 className="font-extrabold tracking-tight leading-none mb-4 lg:mb-5 text-[40px] min-[380px]:text-[44px] sm:text-[54px] lg:text-[60px]" style={{ color: INK }}>
                <span className="block">{ad.headline}</span>
                <span className="block mt-2 text-[20px] min-[380px]:text-[22px] sm:text-[26px] lg:text-[28px] font-bold" style={{ color: '#B5793A' }}>Same-day in Metro Vancouver</span>
              </h1>
              <p className="text-[17px] sm:text-[19px] leading-snug mb-7 lg:mb-10 max-w-xl" style={{ color: INK }}>{ad.promise}</p>
            </div>

            {/* The item and the crew as one matched pair: same frame, same crop, same colour treatment */}
            <div className="[grid-area:photo] -mx-2 sm:mx-0 grid grid-cols-2 gap-2 sm:gap-5 mb-8 sm:mb-10 lg:mb-0">
              {[{ photo: ad.itemPhoto, caption: ad.itemPhoto.label }, { photo: ad.crewPhoto, caption: 'Your Stonegate crew' }].map(({ photo, caption }) => (
                <figure key={photo.src}>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden" style={{ backgroundColor: LINE }}>
                    <Image src={photo.src} alt={photo.alt} fill preload quality={90} sizes="(min-width: 1024px) 400px, 50vw" className="object-cover" style={{ objectPosition: photo.pos ?? 'center', filter: PHOTO_GRADE }} />
                    {/* Warm wash in the page's tan, so photos from different days sit together */}
                    <span className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: 'rgba(243,234,221,0.35)' }} aria-hidden />
                  </div>
                  <figcaption className="mt-3 px-2 sm:px-0 text-[14px] sm:text-[15px] font-semibold leading-snug" style={{ color: INK }}>{caption}</figcaption>
                </figure>
              ))}
            </div>

            {/* One main action; the call line keeps the number visible without a second heavy button (the sticky bar takes over on scroll) */}
            <div className="[grid-area:cta] lg:self-start flex flex-col sm:flex-row lg:flex-col xl:flex-row sm:flex-wrap sm:items-center lg:items-stretch xl:items-center gap-3 sm:gap-x-8 sm:gap-y-4 lg:gap-y-3 xl:gap-x-8 xl:gap-y-5">
              <QuoteCta id="hero-cta" className="w-full sm:w-auto lg:w-full xl:w-auto" />
              <PhoneLink
                className="flex items-center justify-center gap-2 min-h-[54px] px-6 rounded-xl w-full sm:w-auto lg:w-full xl:w-auto text-[17px] font-bold transition-[transform,background-color] active:scale-[0.97] hover:bg-[#F2F5F2]"
                style={{ color: FOREST, backgroundColor: WHITE, border: `1.5px solid ${FOREST}`, fontVariantNumeric: 'lining-nums tabular-nums' }}
              >
                <Phone size={16} fill="currentColor" aria-hidden />
                <span className="whitespace-nowrap">Call <PhoneNumber /></span>
              </PhoneLink>
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start gap-1.5 text-[15px] hover:opacity-80 transition-opacity sm:basis-full lg:basis-auto xl:basis-full">
                <GoogleLogo size={15} />
                <Stars size={14} />
                <span className="font-semibold" style={{ color: INK }}>4.9 on Google</span>
              </a>
            </div>
          </div>
        </section>

        {/* ───────── Slogan band - gold rules either side, as on /junk-removal ───────── */}
        <section style={{ backgroundColor: WHITE, borderTop: RULE }}>
          <p className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-9 flex items-center justify-center gap-3 sm:gap-5 font-extrabold uppercase tracking-tight leading-none text-[24px] min-[380px]:text-[26px] sm:text-[34px]" style={{ color: INK }}>
            <span className="h-px w-8 sm:w-16 shrink-0" style={{ background: 'linear-gradient(to right, transparent, #C98A45)' }} aria-hidden />
            <span>You point. <span style={{ color: FOREST }}>We haul.</span></span>
            <span className="h-px w-8 sm:w-16 shrink-0" style={{ background: 'linear-gradient(to left, transparent, #C98A45)' }} aria-hidden />
          </p>
        </section>

        {/* ───────── Why us: the promise, the item's own reasons and the three service facts, in one calm block ───────── */}
        <section style={{ backgroundColor: WHITE, borderTop: RULE }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-28 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20 lg:items-center">
            <div>
              <Heading className="mb-6">{item.name} without the <Accent>heavy lifting.</Accent></Heading>
              <p data-reveal style={delay(80, { color: INK })} className="text-[17px] sm:text-[19px] leading-relaxed max-w-lg">
                Tell us what is going. The crew shows up on time, gives you the price on the spot, carries everything out from wherever it sits and leaves the space swept clean.
              </p>
            </div>
            {/* One tinted panel: the item's own reasons on top, the three service facts under a divider */}
            <div data-reveal style={delay(120, { backgroundColor: LIGHT_GREEN })} className="rounded-2xl px-5 py-7 sm:p-9">
              <ul className="flex flex-col gap-4">
                {ad.highlights.map(h => (
                  <li key={h} className="flex items-center gap-3 text-[17px] sm:text-[18px] font-bold" style={{ color: INK }}>
                    <CheckCircle2 size={22} className="shrink-0" style={{ color: GREEN }} aria-hidden /> {h}
                  </li>
                ))}
              </ul>
              <ul className="grid grid-cols-3 gap-3 mt-7 pt-7 text-center" style={{ borderTop: '1px solid rgba(1,68,33,0.15)' }}>
                {serviceFacts.map(({ Icon, title, text }) => (
                  <li key={title} className="flex flex-col items-center gap-2">
                    <Icon size={22} style={{ color: GREEN }} aria-hidden />
                    <span className="text-[15px] sm:text-[17px] font-extrabold leading-tight" style={{ color: GREEN }}>{title}</span>
                    <span className="text-[14px] leading-tight" style={{ color: INK }}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ───────── Before & after - proof straight after the why-us block ───────── */}
        <section style={{ backgroundColor: CREAM, borderTop: RULE }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-24 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[0.75fr_1.25fr] gap-8 lg:gap-16 items-center">
            <div>
              <Heading className="mb-4">Drag to <Accent>clear the room.</Accent></Heading>
              <p data-reveal style={delay(80, { color: INK })} className="text-[17px] leading-relaxed max-w-md lg:mb-8">
                Real Stonegate jobs, photographed before we started and after we left.
              </p>
              <div data-reveal style={delay(160)}>
                <QuoteCta className="hidden lg:flex w-fit" />
              </div>
            </div>
            <div data-reveal style={delay(120)} className="mx-auto w-full max-w-[480px] lg:max-w-[540px]">
              <BeforeAfterSlider pairs={sliderPairs} />
            </div>
          </div>
        </section>

        {/* ───────── What we take ───────── */}
        <section style={{ backgroundColor: WHITE, borderTop: RULE }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-24 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-14">
            <div>
              <Heading className="mb-6">{item.name}, <Accent>done for you.</Accent></Heading>
              <ul className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-5 max-sm:[&>li:nth-child(n+7)]:hidden">
                {item.takes.map((t, i) => (
                  <li key={t} data-reveal style={delay((i % 4) * 50, { backgroundColor: LIGHT_GREEN, color: INK })} className="flex items-center gap-2 rounded-2xl px-3.5 py-3 text-[15px] sm:text-[16px] font-semibold leading-tight">
                    <CheckCircle2 size={16} className="shrink-0" style={{ color: GREEN }} aria-hidden /> {t}
                  </li>
                ))}
              </ul>
              <p className="flex items-start gap-2 text-[14px]" style={{ color: MUTED }}>
                <AlertTriangle size={15} className="shrink-0 mt-0.5" style={{ color: '#B45309' }} aria-hidden />
                No hazardous waste - paint, chemicals, fuel or asbestos.
              </p>
            </div>
            <div className="hidden lg:flex flex-col gap-4">
              <p data-reveal className="text-[17px] leading-relaxed" style={{ color: INK }}>{item.body[0]}</p>
              {item.body.length > 1 && (
                <details className="group">
                  <summary className="cursor-pointer list-none text-[16px] font-extrabold underline underline-offset-4 hover:no-underline w-fit" style={{ color: GREEN }}>
                    <span className="group-open:hidden">More about {item.name.toLowerCase()}</span><span className="hidden group-open:inline">Show less</span>
                  </summary>
                  <div className="flex flex-col gap-4 mt-4">
                    {item.body.slice(1).map(p => (
                      <p key={p.slice(0, 32)} className="text-[17px] leading-relaxed" style={{ color: INK }}>{p}</p>
                    ))}
                  </div>
                </details>
              )}
              <div data-reveal style={delay(80, { backgroundColor: LIGHT_GREEN })} className="rounded-2xl p-6">
                <p className="flex items-center gap-2 text-[18px] font-extrabold mb-1.5" style={{ color: INK }}>
                  <Recycle size={18} style={{ color: GREEN }} aria-hidden /> Where it goes
                </p>
                <p className="text-[16px] leading-relaxed" style={{ color: INK }}>{item.disposal}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Pricing - the estimate as a ticket (the steps live on it, so there is no separate how-it-works) ───────── */}
        <section style={{ backgroundColor: TAN, borderTop: RULE }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-24">
            <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-end mb-8 lg:mb-10">
              <Heading className="mb-4 lg:mb-0">Know the price <Accent>before we start.</Accent></Heading>
              <div data-reveal style={delay(80)}>
                <p className="text-[17px] leading-relaxed mb-4" style={{ color: INK }}>
                  {item.name} is priced by how much space it takes in the truck. Labour, loading and disposal are all included - no hidden fees, no deposit, and you pay after the job.
                </p>
                <Link href="/pricing/junk-removal" className="inline-flex items-center gap-2 text-[17px] font-extrabold underline underline-offset-4 hover:no-underline" style={{ color: GREEN }}>
                  How our pricing works <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
            </div>
            <PriceTicket steps={steps} action={<QuoteCta className="w-full" />} />
          </div>
        </section>

        {/* ───────── Reviews ───────── */}
        <section style={{ backgroundColor: WHITE, borderTop: RULE }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-24">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 mb-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <GoogleLogo size={28} />
                <Heading>Rated 4.9 on Google</Heading>
                <Stars size={22} />
              </div>
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="text-[17px] font-bold underline underline-offset-4 hover:no-underline" style={{ color: GREEN }}>
                Read all reviews
              </a>
            </div>
            <blockquote data-reveal style={delay(80)} className="max-w-4xl sm:mb-12 lg:mb-16">
              <p className="text-[22px] min-[400px]:text-[24px] sm:text-3xl lg:text-[36px] font-bold leading-[1.3] tracking-tight mb-4" style={{ color: INK }}>
                <span style={{ color: GREEN }}>&ldquo;</span>{featuredReview.text}<span style={{ color: GREEN }}>&rdquo;</span>
              </p>
              <footer className="text-[17px] font-extrabold" style={{ color: GREEN }}>{featuredReview.name}</footer>
            </blockquote>
            {/* Phones get the one featured review - the page stays short where most ad clicks land */}
            <ul className="hidden sm:grid sm:grid-cols-3 gap-10">
              {reviews.map((r, i) => (
                <li key={r.name} data-reveal style={delay(i * 80)}>
                  <p className="text-[17px] leading-relaxed mb-3" style={{ color: INK }}>{r.text}</p>
                  <p className="text-[16px] font-extrabold" style={{ color: GREEN }}>{r.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── Meet the crew ───────── */}
        <section style={{ backgroundColor: CREAM, borderTop: RULE }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-24 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-14 items-center">
            <div data-reveal className="relative aspect-[4/3] lg:aspect-[4/5] max-h-[540px] w-full rounded-2xl overflow-hidden" style={{ backgroundColor: LINE }}>
              <Image src={ad.teamPhoto.src} alt={ad.teamPhoto.alt} fill quality={90} sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" style={{ objectPosition: ad.teamPhoto.pos ?? 'center' }} />
            </div>
            <div>
              <Heading className="mb-4">A local crew that <Accent>shows up.</Accent></Heading>
              <p data-reveal style={delay(80, { color: INK })} className="text-[17px] leading-relaxed mb-6">
                We show up on time, carry everything out from wherever it sits and leave the space swept clean.
              </p>
              <ul className="flex flex-col gap-3.5">
                {crewFacts.map(({ Icon, text }, i) => (
                  <li key={text} data-reveal className="flex items-center gap-3 text-[16px] font-semibold" style={delay(140 + i * 60, { color: INK })}>
                    <Icon size={20} className="shrink-0" style={{ color: GREEN }} aria-hidden />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: WHITE, borderTop: RULE }}>
          <FaqText faqs={faqs} heading={<Heading>{item.name} questions</Heading>} />
        </section>

        {/* ───────── Final CTA - full-width forest band ───────── */}
        <section className="[&_a:focus-visible]:outline-white selection:bg-white/25 selection:text-white" style={{ backgroundColor: FOREST }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-20 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1fr_auto] gap-7 lg:gap-14 items-center">
            <div>
              <h2 data-reveal className="text-[28px] min-[400px]:text-[30px] sm:text-[38px] font-extrabold leading-[1.1] tracking-tight mb-3" style={{ color: WHITE }}>Ready when you are.</h2>
              <p data-reveal style={delay(80, { color: '#CFE0D4' })} className="text-[17px] sm:text-lg">
                Same-day and next-day pickups across Metro Vancouver.
              </p>
            </div>
            <div data-reveal style={delay(160)} className="flex flex-col sm:flex-row gap-3">
              <QuoteCta onDark className="sm:w-auto" />
              <CallCta onDark className="sm:w-auto" />
            </div>
          </div>
        </section>

        {/* ───────── Related + service area ───────── */}
        <section className="hidden sm:block" style={{ backgroundColor: CREAM }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-16 flex flex-col gap-10">
            <div>
              <h2 className="text-[22px] font-extrabold tracking-tight mb-4" style={{ color: INK }}>We also haul</h2>
              <ul className="flex flex-wrap gap-2">
                {related.map(r => (
                  <li key={r.slug}>
                    <Link href={junkItemHref(r.slug)} className="inline-flex items-center rounded-full px-4 min-h-[44px] text-[16px] font-semibold transition-colors hover:bg-[#E8F0E6]" style={{ backgroundColor: WHITE, color: INK }}>
                      {r.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/junk-removal/what-we-take" className="inline-flex items-center gap-1.5 rounded-full px-4 min-h-[44px] text-[16px] font-extrabold hover:underline" style={{ color: GREEN }}>
                    Everything we take <ArrowRight size={15} aria-hidden />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-[22px] font-extrabold tracking-tight mb-4" style={{ color: INK }}>Same-day {item.name.toLowerCase()} across Metro Vancouver</h2>
              <ul className="flex flex-wrap gap-2">
                {CITIES.map(c => (
                  <li key={c.slug}>
                    <Link href={cityJunkHref(c)} className="inline-flex items-center rounded-full px-4 min-h-[44px] text-[16px] font-semibold transition-colors hover:bg-[#E8F0E6]" style={{ backgroundColor: WHITE, color: INK }}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[16px]" style={{ color: INK }}>
              Back to <Link href="/junk-removal" className="font-bold underline underline-offset-4 hover:no-underline" style={{ color: GREEN }}>all junk removal services</Link>.
            </p>
          </div>
        </section>
      </main>

      {/* Curtain footer: pinned to the bottom under main on desktop, uncovered as the page scrolls past */}
      <div className="lg:sticky lg:bottom-0 lg:z-0">
        <Footer />
      </div>

      <StickyCallBar watchId="hero-cta" quoteHref={JUNK_BOOK_HREF} />
    </div>
  )
}
