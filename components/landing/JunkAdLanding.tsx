import Image from 'next/image'
import Link from 'next/link'
import {
  Phone, ArrowRight, Star, CheckCircle2, AlertTriangle, MapPin, Zap, Shield, BadgeDollarSign, Hand, Truck, Recycle,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { FaqList, CityChips } from '@/components/seo/SeoBlocks'
import StickyCallBar from '@/components/landing/StickyCallBar'
import BeforeAfterSlider from '@/components/landing/BeforeAfterSlider'
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
const GOLD = '#B5793A'
const MUTED_BROWN = '#8B6845'

const trustBar = [
  { Icon: Star, title: '4.9 on Google', text: 'Top-rated in Metro Van' },
  { Icon: Zap, title: 'Same-day', text: 'Or next-day pickup' },
  { Icon: Shield, title: 'Fully insured', text: 'Local Metro Van crew' },
  { Icon: BadgeDollarSign, title: 'Pay after', text: 'No deposit needed' },
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

export function GoogleLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.8741 2.6836-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.806.5404-1.8368.8605-3.0477.8605-2.344 0-4.3282-1.5831-5.0359-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z" />
      <path fill="#FBBC05" d="M3.9641 10.71c-.18-.5404-.2827-1.1181-.2827-1.71s.1027-1.1696.2827-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.9641 10.71z" />
      <path fill="#EA4335" d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.9641 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z" />
    </svg>
  )
}

function QuoteCta({ id, className = '' }: { id?: string; className?: string }) {
  return (
    <a
      id={id}
      href={JUNK_BOOK_HREF}
      className={`flex items-center justify-center gap-2 rounded-xl font-extrabold text-lg min-h-[58px] px-8 transition-transform active:scale-[0.98] hover:scale-[1.01] ${className}`}
      style={{ backgroundColor: FOREST, color: WHITE, boxShadow: '0 4px 12px -4px rgba(0,0,0,0.35)' }}
    >
      <span className="whitespace-nowrap">Get a Free Estimate</span> <ArrowRight size={19} aria-hidden />
    </a>
  )
}

function CallCta({ className = '' }: { className?: string }) {
  return (
    <PhoneLink
      className={`flex items-center justify-center gap-2 rounded-xl font-bold text-base min-h-[56px] px-6 transition-colors hover:bg-[#F2F5F2] ${className}`}
      style={{ color: FOREST, border: `1.5px solid ${FOREST}`, backgroundColor: WHITE, fontVariantNumeric: 'lining-nums tabular-nums' }}
    >
      <Phone size={17} fill="currentColor" aria-hidden />
      <span className="whitespace-nowrap">Call <PhoneNumber /></span>
    </PhoneLink>
  )
}

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs font-bold uppercase tracking-[0.2em] mb-3 ${className}`} style={{ color: MUTED_BROWN }}>{children}</p>
}

function Heading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-[28px] min-[400px]:text-[30px] sm:text-[38px] font-extrabold leading-[1.1] tracking-tight ${className}`} style={{ color: INK }}>
      {children}
    </h2>
  )
}

function Accent({ children }: { children: React.ReactNode }) {
  return <span style={{ color: GREEN }}>{children}</span>
}

function PhotoChip({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className="absolute left-2.5 bottom-2.5 sm:left-3 sm:bottom-3 max-w-[calc(100%-16px)] inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-[12px] sm:text-[14px] font-extrabold leading-tight"
      style={dark
        ? { backgroundColor: FOREST, color: WHITE, boxShadow: '0 4px 12px -4px rgba(0,0,0,0.4)' }
        : { backgroundColor: 'rgba(255,255,255,0.95)', color: INK, boxShadow: '0 4px 12px -4px rgba(0,0,0,0.3)' }}
    >
      {children}
    </span>
  )
}

export default function JunkAdLanding({ item, ad, faqs, related }: { item: JunkItem; ad: JunkAd; faqs: Faq[]; related: JunkItem[] }) {
  const sliderPairs = ad.sliderFirst
    ? [...beforeAfterPairs].sort((a, b) => Number(b.label === ad.sliderFirst) - Number(a.label === ad.sliderFirst))
    : beforeAfterPairs

  return (
    <div className="flex flex-col min-h-screen pb-[84px] lg:pb-0" style={{ backgroundColor: WHITE }}>
      <Navbar minimalMobile />
      <main className="flex-1">

        {/* ───────── Hero ───────── */}
        {/* Phone: headline → item + crew photos → buttons, all above the fold. Desktop: text and buttons left, photos right */}
        <section style={{ background: `linear-gradient(180deg, ${TAN} 0%, ${CREAM} 100%)` }}>
          <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-7 sm:pt-8 lg:py-12 grid grid-cols-[minmax(0,1fr)] gap-x-10 xl:gap-x-14 [grid-template-areas:'top'_'photos'_'cta'] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:[grid-template-areas:'top_photos'_'cta_photos'] lg:items-center">
            <div className="[grid-area:top] lg:self-end">
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mb-2.5 sm:mb-4">
                <GoogleLogo size={15} />
                <Stars size={14} />
                <span className="text-[13px] sm:text-[15px] font-bold" style={{ color: INK }}>4.9 rating</span>
                <span className="text-[13px] sm:text-[15px] font-semibold" style={{ color: MUTED }}>· Metro Vancouver</span>
              </a>
              <h1 className="font-extrabold tracking-tight leading-[1.02] mb-2.5 sm:mb-4" style={{ color: INK }}>
                <span className="block text-[36px] min-[380px]:text-[40px] sm:text-[54px] lg:text-[58px]">{ad.headline}</span>
                <span className="block text-[19px] min-[380px]:text-[21px] sm:text-[26px] lg:text-[28px] mt-1 font-bold" style={{ color: GOLD }}>Same-day in Metro Vancouver</span>
              </h1>
              <p className="text-[16px] sm:text-[19px] leading-snug mb-4 lg:mb-6" style={{ color: '#2B2A28' }}>{ad.promise}</p>
            </div>

            {/* Item photo is never covered - the only overlay is a small label in the corner */}
            <div className="[grid-area:photos] -mx-4 sm:mx-0 grid grid-cols-2 gap-1 sm:gap-4 mb-5 lg:mb-0">
              <figure className="relative aspect-[3/4] sm:rounded-3xl overflow-hidden" style={{ backgroundColor: LINE }}>
                <Image src={ad.itemPhoto.src} alt={ad.itemPhoto.alt} fill preload quality={90} sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" style={{ objectPosition: ad.itemPhoto.pos ?? 'center' }} />
                <PhotoChip>{ad.itemPhoto.label}</PhotoChip>
              </figure>
              <figure className="relative aspect-[3/4] sm:rounded-3xl overflow-hidden" style={{ backgroundColor: LINE }}>
                <Image src={ad.crewPhoto.src} alt={ad.crewPhoto.alt} fill preload quality={90} sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" style={{ objectPosition: ad.crewPhoto.pos ?? 'center' }} />
                <PhotoChip dark><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#6EE7A0' }} aria-hidden />Your Stonegate crew</PhotoChip>
              </figure>
            </div>

            <div className="[grid-area:cta] lg:self-start">
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5 sm:gap-3">
                <QuoteCta id="hero-cta" className="w-full sm:w-auto lg:w-full xl:w-auto" />
                <CallCta className="w-full sm:w-auto lg:w-full xl:w-auto" />
              </div>
              <p className="mt-3 text-[13px] sm:text-sm font-semibold text-center sm:text-left" style={{ color: MUTED }}>
                No deposit · Pay after the job
              </p>
              <ul className="hidden sm:flex mt-4 lg:mt-6 flex-col gap-2">
                {ad.highlights.map(h => (
                  <li key={h} className="flex items-center gap-2.5 text-[15px] font-semibold" style={{ color: INK }}>
                    <CheckCircle2 size={18} className="shrink-0" style={{ color: GREEN }} aria-hidden /> {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ───────── Trust bar ───────── */}
        <section style={{ backgroundColor: FOREST }}>
          <ul className="max-w-6xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-3">
            {trustBar.map(({ Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3">
                <span className="flex items-center justify-center shrink-0 w-10 h-10 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                  <Icon size={19} style={{ color: '#F3D9A4' }} fill={Icon === Star ? '#F3D9A4' : 'none'} aria-hidden />
                </span>
                <span className="leading-tight">
                  <span className="block text-[15px] font-extrabold" style={{ color: WHITE }}>{title}</span>
                  <span className="block text-[12px] sm:text-[13px]" style={{ color: 'rgba(255,255,255,0.72)' }}>{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────── Meet the crew ───────── */}
        <section style={{ backgroundColor: WHITE }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-20 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1fr_1.2fr] gap-7 lg:gap-14 items-center">
            <div className="relative aspect-[4/3] lg:aspect-[4/5] max-h-[540px] w-full rounded-3xl overflow-hidden" style={{ backgroundColor: LINE }}>
              <Image src={ad.teamPhoto.src} alt={ad.teamPhoto.alt} fill quality={90} sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" style={{ objectPosition: ad.teamPhoto.pos ?? 'center' }} />
            </div>
            <div>
              <Eyebrow>Your crew</Eyebrow>
              <Heading className="mb-4">You point. <Accent>We haul.</Accent></Heading>
              <p className="text-base sm:text-[17px] leading-relaxed lg:mb-6" style={{ color: MUTED }}>
                We show up on time, carry everything out from wherever it sits and leave the space swept clean.
              </p>
              <ul className="hidden lg:flex flex-col gap-3">
                {crewFacts.map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-[15px] font-semibold" style={{ color: INK }}>
                    <span className="flex items-center justify-center shrink-0 w-9 h-9 rounded-full" style={{ backgroundColor: LIGHT_GREEN }}>
                      <Icon size={17} style={{ color: GREEN }} aria-hidden />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ───────── Reviews ───────── */}
        <section style={{ backgroundColor: CREAM, borderTop: `1px solid ${LINE}` }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:pt-12 sm:pb-4 lg:pt-16">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <span className="flex items-center gap-2.5">
                <GoogleLogo size={18} />
                <Stars size={18} />
                <span className="text-sm font-bold" style={{ color: INK }}>Rated 4.9 on Google</span>
              </span>
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline underline-offset-4" style={{ color: GREEN }}>
                Read all reviews
              </a>
            </div>
            <blockquote>
              <p className="text-[21px] min-[400px]:text-[23px] sm:text-3xl font-bold leading-[1.3] tracking-tight mb-4" style={{ color: INK }}>
                <span style={{ color: GREEN }}>&ldquo;</span>{featuredReview.text}<span style={{ color: GREEN }}>&rdquo;</span>
              </p>
              <footer className="text-[15px] font-extrabold" style={{ color: GREEN }}>{featuredReview.name}</footer>
            </blockquote>
          </div>
          <ul className="hidden sm:flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 px-4 sm:px-6 pt-5 pb-12 lg:pb-16 lg:max-w-6xl lg:mx-auto lg:grid lg:grid-cols-3 lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {reviews.map(r => (
              <li key={r.name} className="snap-start shrink-0 w-[82%] min-[480px]:w-[300px] lg:w-auto flex flex-col rounded-2xl p-5" style={{ backgroundColor: WHITE, border: `1px solid ${LINE}` }}>
                <Stars size={13} />
                <p className="text-[15px] leading-relaxed mt-3 mb-4 flex-1" style={{ color: MUTED }}>{r.text}</p>
                <p className="text-sm font-extrabold" style={{ color: INK }}>{r.name}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────── Pricing ───────── */}
        <section style={{ backgroundColor: LIGHT_GREEN }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-20 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="hidden lg:block">
              <Eyebrow>Simple pricing</Eyebrow>
              <Heading className="mb-4">Know the price <Accent>before we start.</Accent></Heading>
              <p className="text-base sm:text-[17px] leading-relaxed mb-5 max-w-lg" style={{ color: MUTED }}>
                {item.name} is priced by how much space it takes in the truck. Labour, loading and disposal are all included - no hidden fees, no deposit, and you pay after the job.
              </p>
              <Link href="/pricing/junk-removal" className="inline-flex items-center gap-2 text-[15px] font-extrabold underline underline-offset-4" style={{ color: GREEN }}>
                How our pricing works <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
            <div className="mx-auto w-full max-w-[420px] rounded-3xl p-7 sm:p-9" style={{ backgroundColor: WHITE, boxShadow: '0 12px 32px -16px rgba(1,68,33,0.25)' }}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: MUTED }}>{item.name}</p>
              <p className="flex flex-wrap items-end gap-x-2 gap-y-1 mb-6">
                <span className="text-6xl font-extrabold tracking-tight leading-none" style={{ color: INK }}>Upfront</span>
                <span className="text-base font-semibold mb-1" style={{ color: MUTED }}>pricing</span>
              </p>
              <ul className="flex flex-col gap-3 mb-7">
                {['Priced by how much space it takes', 'Price confirmed before we start', 'Pay after - card, e-transfer or cash'].map(t => (
                  <li key={t} className="flex items-center gap-3 text-[15px] font-semibold" style={{ color: INK }}>
                    <CheckCircle2 size={18} className="shrink-0" style={{ color: GREEN }} aria-hidden /> {t}
                  </li>
                ))}
              </ul>
              <QuoteCta className="w-full" />
            </div>
          </div>
        </section>

        {/* ───────── What we take ───────── */}
        <section style={{ backgroundColor: WHITE }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-20 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-14">
            <div>
              <Eyebrow>What we take</Eyebrow>
              <Heading className="mb-5">{item.name} <Accent>done for you.</Accent></Heading>
              <ul className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-5 max-sm:[&>li:nth-child(n+7)]:hidden">
                {item.takes.map(t => (
                  <li key={t} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[14px] sm:text-[15px] font-semibold leading-tight" style={{ backgroundColor: CREAM, border: `1px solid ${LINE}`, color: INK }}>
                    <CheckCircle2 size={16} className="shrink-0" style={{ color: GREEN }} aria-hidden /> {t}
                  </li>
                ))}
              </ul>
              <p className="flex items-center gap-2 text-sm" style={{ color: MUTED }}>
                <AlertTriangle size={15} className="shrink-0" style={{ color: '#B45309' }} aria-hidden />
                No hazardous waste - paint, chemicals, fuel or asbestos.
              </p>
            </div>
            <div className="hidden lg:flex flex-col gap-4">
              <p className="text-base leading-relaxed" style={{ color: '#4A3F38' }}>{item.body[0]}</p>
              {item.body.length > 1 && (
                <details className="group">
                  <summary className="cursor-pointer list-none text-[15px] font-extrabold underline underline-offset-4" style={{ color: GREEN }}>
                    <span className="group-open:hidden">Read more</span><span className="hidden group-open:inline">Show less</span>
                  </summary>
                  <div className="flex flex-col gap-4 mt-4">
                    {item.body.slice(1).map(p => (
                      <p key={p.slice(0, 32)} className="text-base leading-relaxed" style={{ color: '#4A3F38' }}>{p}</p>
                    ))}
                  </div>
                </details>
              )}
              <div className="rounded-2xl p-5" style={{ backgroundColor: LIGHT_GREEN }}>
                <p className="flex items-center gap-2 font-extrabold mb-1.5" style={{ color: INK }}>
                  <Recycle size={18} style={{ color: GREEN }} aria-hidden /> Where it goes
                </p>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{item.disposal}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Before & after ───────── */}
        <section style={{ backgroundColor: CREAM, borderTop: `1px solid ${LINE}` }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-20 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-20 items-center">
            <div>
              <Eyebrow>Before &amp; after</Eyebrow>
              <Heading className="mb-4">Drag to <Accent>clear the room.</Accent></Heading>
              <p className="hidden sm:block text-base sm:text-[17px] leading-relaxed max-w-md" style={{ color: MUTED }}>
                Real Stonegate jobs, photographed before we started and after we left.
              </p>
            </div>
            <div className="mx-auto w-full max-w-[480px]">
              <BeforeAfterSlider pairs={sliderPairs} />
            </div>
          </div>
        </section>

        {/* ───────── How it works ───────── */}
        <section style={{ backgroundColor: TAN }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-20">
            <Eyebrow>How it works</Eyebrow>
            <Heading className="mb-5 sm:mb-7">Gone in <Accent>three steps.</Accent></Heading>
            <ol className="grid md:grid-cols-3 gap-3 md:gap-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex items-center md:items-start md:flex-col gap-4 md:gap-0 rounded-2xl p-4 md:p-6" style={{ backgroundColor: WHITE }}>
                  <span className="flex items-center justify-center shrink-0 w-11 h-11 rounded-full text-lg font-extrabold md:mb-4" style={{ backgroundColor: GREEN, color: WHITE }}>{i + 1}</span>
                  <div>
                    <p className="text-[17px] md:text-lg font-extrabold md:mb-1" style={{ color: INK }}>{s.title}</p>
                    <p className="hidden md:block text-[15px] leading-relaxed" style={{ color: MUTED }}>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <QuoteCta className="hidden sm:inline-flex mt-7" />
          </div>
        </section>

        <FaqList faqs={faqs} heading={`${item.name} questions`} />

        {/* ───────── Final CTA ───────── */}
        <section style={{ backgroundColor: WHITE, borderTop: `1px solid ${LINE}` }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-20 text-center">
            <Heading className="mb-3">Ready when <Accent>you are.</Accent></Heading>
            <p className="text-base sm:text-lg mb-6" style={{ color: MUTED }}>
              Same-day and next-day pickups across Metro Vancouver.
            </p>
            <div className="flex flex-col gap-2.5 max-w-md mx-auto">
              <QuoteCta className="w-full" />
              <CallCta className="w-full" />
            </div>
          </div>
        </section>

        {/* ───────── Related + service area ───────── */}
        <section className="hidden sm:block py-10" style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
            <div>
              <p className="text-sm font-bold mb-3" style={{ color: MUTED }}>We also haul</p>
              <ul className="flex flex-wrap gap-2">
                {related.map(r => (
                  <li key={r.slug}>
                    <Link href={junkItemHref(r.slug)} className="inline-block rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors hover:bg-[#E8F0E6]" style={{ backgroundColor: WHITE, border: `1px solid ${LINE}`, color: INK }}>
                      {r.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/junk-removal/what-we-take" className="inline-block rounded-full px-3.5 py-1.5 text-sm font-extrabold" style={{ color: GREEN }}>
                    Everything we take &rarr;
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-bold mb-1" style={{ color: MUTED }}>
                <MapPin size={15} aria-hidden /> Same-day service area
              </p>
              <CityChips heading={`${item.name} across Metro Vancouver`} links={CITIES.map(c => ({ href: cityJunkHref(c), label: c.name }))} />
            </div>
            <p className="text-sm" style={{ color: MUTED }}>
              Back to <Link href="/junk-removal" className="font-bold underline" style={{ color: GREEN }}>all junk removal services</Link>.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      <StickyCallBar watchId="hero-cta" quoteHref={JUNK_BOOK_HREF} />
    </div>
  )
}
