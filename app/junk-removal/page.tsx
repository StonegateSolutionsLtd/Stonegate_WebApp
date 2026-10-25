import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import {
  Phone, ArrowRight, Star, Hand, ClipboardList, Sofa, Refrigerator, Warehouse, AlertTriangle, MapPin,
  BedDouble, Waves, Wrench, Tv, Building2, Shield,
} from 'lucide-react'
import { JsonLd } from '@/components/seo/SeoBlocks'
import StickyCallBar from '@/components/landing/StickyCallBar'
import BeforeAfterSlider from '@/components/landing/BeforeAfterSlider'
import RevealOnScroll from '@/components/landing/RevealOnScroll'
import { PriceTicket, FaqText, revealDelay as delay } from '@/components/landing/JunkBlocks'
import { beforeAfterPairs, featuredReview, reviews } from '@/lib/seo/junk-proof'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import { JUNK_ITEMS, junkItemHref } from '@/lib/seo/junk-items'
import { CITIES, cityJunkHref } from '@/lib/seo/cities'
import {
  SITE_URL, JUNK_BOOK_HREF, providerLd, faqLd, type Faq,
} from '@/lib/seo/site'

export const metadata: Metadata = {
  title: { absolute: `Junk Removal Vancouver | Same-Day Pickup | Stonegate` },
  description: `Same-day junk removal across Metro Vancouver. Our crew lifts, loads and hauls it all - furniture, appliances, cleanouts. No deposit, pay after the job.`,
  keywords: ['junk removal Vancouver', 'junk removal near me', 'same-day junk removal', 'junk pickup Metro Vancouver', 'furniture removal', 'garbage removal Vancouver'],
  alternates: { canonical: `${SITE_URL}/junk-removal` },
}

const GREEN = '#014421'
const INK = '#1A1714'
const MUTED = '#6B5E54'
const LINE = '#E8E0D5'
const CREAM = '#FAF7F2'
const WHITE = '#FFFFFF'
const LIGHT_GREEN = '#E8F0E6'
const TAN = '#F3EADD'
const FOREST = '#064B31'
const CHARCOAL = '#2B2A28'

const HERO_PHOTO = {
  src: '/junk/driver-hero-4627.jpg',
  // Cropped (not scaled up) to a portrait aspect so the driver's face clears the headline on narrow/tall mobile screens
  mobileSrc: '/junk/driver-cab-4520-mobile.jpg',
  alt: 'Stonegate junk removal driver standing beside the Stonegate truck',
}

const steps = [
  { title: 'Book a free on-site estimate', text: 'Tell us what is going and pick a time that suits you. No deposit, no obligation.' },
  { title: 'Exact price in person', text: 'Our crew sees everything and gives you the price on the spot - before we lift a thing.' },
  { title: 'We haul it all away', text: 'We carry it out from any room or floor, load the truck and sweep up after.' },
]

const trust = [
  { Icon: Hand, label: 'Any room, any floor' },
  { Icon: ClipboardList, label: 'Free on-site estimates' },
  { Icon: Shield, label: 'Local & fully insured' },
]

const takes = [
  { slug: 'furniture-removal', label: 'Furniture', Icon: Sofa },
  { slug: 'appliance-removal', label: 'Appliances', Icon: Refrigerator },
  { slug: 'garage-cleanout', label: 'Home & garage cleanouts', Icon: Warehouse },
  { slug: 'mattress-removal', label: 'Mattresses', Icon: BedDouble },
  { slug: 'hot-tub-removal', label: 'Hot tubs', Icon: Waves },
  { slug: 'construction-debris-removal', label: 'Reno debris', Icon: Wrench },
  { slug: 'electronics-removal', label: 'Electronics', Icon: Tv },
  { slug: 'commercial-junk-removal', label: 'Office & commercial', Icon: Building2 },
]

const jobs = [
  { src: '/junk/residential-junk-removal.jpg', caption: 'Full house cleanout', pos: 'center 62%' },
  { src: '/junk/household-junk-job.jpg', caption: 'Household junk pickup', pos: 'center 60%' },
  { src: '/junk/commercial-junk-loading.jpg', caption: 'Commercial pallet removal', pos: 'center 60%' },
  { src: '/burnaby/burnaby-junk-truck-loaded.jpg', caption: 'Warehouse cleanout', pos: 'center' },
  { src: '/junk/commercial-junk-disposal.jpg', caption: 'Straight to the right facility', pos: 'center 55%' },
  { src: '/junk/cardboard-removal.jpg', caption: 'Boxes & cardboard', pos: 'center 72%' },
]

// Label strip colours under the job photos, rotated so neighbouring tiles never match
const STRIPS = [
  { bg: FOREST, fg: CREAM },
  { bg: TAN, fg: INK },
  { bg: INK, fg: CREAM },
  { bg: LIGHT_GREEN, fg: GREEN },
]

const why = [
  { title: 'Same-day & next-day', text: 'Call in the morning and we can often be there the same day.' },
  { title: 'We do all the lifting', text: 'From any room, basement or floor. You just point.' },
  { title: 'Price before we start', text: 'Confirmed on-site. Pay after the job - no deposit.' },
  { title: 'Bigger truck, fewer trips', text: '29 cubic yards - about 2.4x a standard dump truck.' },
  { title: 'Donate & recycle first', text: 'Usable items go to local charities, landfill last.' },
  { title: 'Local & fully insured', text: 'Covered for your home, your building and your things.' },
]

const beforeAfter = beforeAfterPairs
const featured = featuredReview

const faqs: Faq[] = [
  { q: 'How much does junk removal cost?', a: `Junk removal is priced by the size of your load. Estimates are free and done on-site - the crew confirms the final price before we start, and you pay after the job.` },
  { q: 'Can you come today?', a: 'Often, yes. Same-day and next-day pickups are available across Metro Vancouver depending on the schedule. Call for today\'s availability.' },
  { q: 'Do I need to carry anything outside?', a: 'No. We take items from wherever they are - bedrooms, basements, upper floors, garages or storage lockers - and sweep up after.' },
  { q: 'What can\'t you take?', a: 'Hazardous waste: paint, solvents, chemicals, fuel and asbestos. Everything else non-hazardous we can usually haul. Not sure? Just call.' },
  { q: 'Do I need to be home?', a: 'We prefer someone is there to confirm the price. For outdoor pickups we can arrange payment in advance and work while you are out.' },
  { q: 'Where does my junk go?', a: 'Usable items are donated to local charities, materials are recycled, and only what is left goes to the transfer station.' },
]

function Stars({ size = 15 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => <Star key={i} size={size} fill="#D4A017" style={{ color: '#D4A017' }} aria-hidden />)}
    </span>
  )
}

function GoogleLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.8741 2.6836-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.806.5404-1.8368.8605-3.0477.8605-2.344 0-4.3282-1.5831-5.0359-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z" />
      <path fill="#FBBC05" d="M3.9641 10.71c-.18-.5404-.2827-1.1181-.2827-1.71s.1027-1.1696.2827-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.9641 10.71z" />
      <path fill="#EA4335" d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.9641 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z" />
    </svg>
  )
}

function QuoteCta({ className = '', onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <a
      href={JUNK_BOOK_HREF}
      className={`flex items-center justify-center gap-2 rounded-full font-extrabold text-[17px] min-h-[56px] px-7 transition-[transform,opacity] active:scale-[0.97] hover:opacity-90 ${className}`}
      style={onDark ? { backgroundColor: CREAM, color: GREEN } : { backgroundColor: GREEN, color: WHITE }}
    >
      <span className="whitespace-nowrap">Get a Free Estimate</span> <ArrowRight size={18} aria-hidden />
    </a>
  )
}

function CallCta({ className = '', onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <PhoneLink
      className={`flex items-center justify-center gap-2 rounded-full font-bold text-[17px] min-h-[56px] px-6 transition-[transform,background-color] active:scale-[0.97] ${onDark ? 'bg-white/10 hover:bg-white/20' : 'bg-[#E8F0E6] hover:bg-[#D9E7D6]'} ${className}`}
      style={{ color: onDark ? WHITE : GREEN, fontVariantNumeric: 'lining-nums tabular-nums' }}
    >
      <Phone size={18} fill="currentColor" aria-hidden />
      <span className="whitespace-nowrap">Call <PhoneNumber /></span>
    </PhoneLink>
  )
}

function Heading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 data-reveal className={`text-[30px] min-[400px]:text-[32px] sm:text-[40px] font-extrabold leading-[1.1] tracking-tight text-balance ${className}`} style={{ color: INK }}>
      {children}
    </h2>
  )
}

export default function JunkRemovalPage() {
  const itemCount = JUNK_ITEMS.length
  return (
    <div className="flex flex-col min-h-svh pb-[84px] lg:pb-0 selection:bg-[#E8F0E6] selection:text-[#014421] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#014421]" style={{ backgroundColor: WHITE }}>
      <JsonLd graph={[
        {
          '@type': 'Service',
          name: 'Junk Removal - Metro Vancouver',
          serviceType: 'Junk Removal',
          url: `${SITE_URL}/junk-removal`,
          provider: providerLd,
          areaServed: CITIES.map(c => ({ '@type': 'City', name: c.name })),
        },
        faqLd(faqs),
      ]} />
      <RevealOnScroll />
      <Navbar minimalMobile />

      {/* Main sits above the footer so on desktop it slides away like a sheet to uncover it (curtain footer) */}
      <main className="flex-1 relative z-10" style={{ backgroundColor: WHITE }}>

        {/* ───────── Hero ───────── */}
        {/* Phone: full-bleed photo with the headline over it. Tablet: headline on cream, photo card below. Desktop: headline and photo card side by side */}
        <section className="relative flex items-center min-h-[680px] sm:min-h-0 sm:py-10 lg:py-12 xl:py-14 sm:bg-[#FAF7F2]" style={{ overflow: 'hidden' }}>
          <div className="absolute inset-0 sm:hidden overflow-hidden" style={{ backgroundColor: CHARCOAL }}>
            {/* fetchPriority instead of preload: each breakpoint shows only one of the two hero images, so only that one should download */}
            <Image
              src={HERO_PHOTO.mobileSrc}
              alt={HERO_PHOTO.alt}
              fill
              fetchPriority="high"
              quality={90}
              sizes="100vw"
              className="object-cover object-[center_top]"
            />
          </div>
          {/* Mobile: neutral scrim in the top-left corner only, behind the headline */}
          <div className="absolute inset-0 sm:hidden" style={{ background: 'radial-gradient(ellipse 130% 470px at 0% 0%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.68) 55%, rgba(0,0,0,0.45) 74%, rgba(0,0,0,0.15) 90%, transparent 100%)' /* taste-skill-ignore: neutral scrim over the photo for legibility */ }} aria-hidden />
          {/* Desktop: two-column layout - headline left, large photo card right (the main focus) */}
          <div className="relative z-20 w-full lg:max-w-[1600px] lg:mx-auto lg:px-12 xl:px-16 lg:grid lg:grid-cols-[minmax(0,36fr)_minmax(0,64fr)] lg:gap-10 xl:gap-14 lg:items-center">
          {/* On desktop the text column is a size container, so the headline scales to always fit it on one line */}
          <div className="px-5 sm:px-6 pt-0 pb-2 lg:p-0 max-w-[620px] lg:max-w-none lg:@container">
            {/* The stacked sign-style headline (with its small "in" between fading rules) is kept by choice over the skill's no-label / no-shadow rules */}
            <h1 className="font-extrabold uppercase tracking-tight leading-[0.95] mb-3 lg:mb-4 lg:whitespace-nowrap text-[40px] min-[380px]:text-[46px] sm:text-[58px] lg:text-[length:min(76px,calc(100cqw/8.8))]">
              <span className="block text-[#C98A45] [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] sm:text-[#B5793A] sm:[text-shadow:none]">Junk Removal</span>
              <span className="flex items-center gap-3 my-1.5 sm:my-2 text-[12px] sm:text-[15px] font-bold uppercase leading-none tracking-[0.35em] text-white/75 sm:text-[#8B6845]">
                <span className="h-px w-10 sm:w-14 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.4))] sm:bg-[linear-gradient(to_right,transparent,rgba(139,104,69,0.5))]" aria-hidden />
                in
                <span className="h-px w-10 sm:w-14 bg-[linear-gradient(to_left,transparent,rgba(255,255,255,0.4))] sm:bg-[linear-gradient(to_left,transparent,rgba(139,104,69,0.5))]" aria-hidden />
              </span>
              <span className="block text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] sm:text-[#064B31] sm:[text-shadow:none]">Metro Vancouver</span>
            </h1>
            <p className="text-[18px] sm:text-xl lg:text-[24px] leading-snug mb-2 lg:mb-3 text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.85),0_1px_3px_rgba(0,0,0,0.9)] sm:text-[#2B2A28] sm:[text-shadow:none]">
              We lift, load and haul it away.
            </p>
            <a href="https://maps.app.goo.gl/ooQYs564eGP7JZbC6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mb-52 sm:mb-8 hover:opacity-80 transition-opacity">
              <GoogleLogo size={16} />
              <Stars size={15} />
              <span className="text-[15px] lg:text-[17px] font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.85)] sm:text-[#1A1714] sm:[text-shadow:none]">4.9 rating</span>
            </a>
            {/* Desktop: the text column is too narrow for two buttons side by side until ~1680px, so they stack full-width below that */}
            <div className="flex flex-col sm:flex-row lg:max-[1679px]:flex-col gap-3">
              <div id="hero-cta">
                <a
                  href={JUNK_BOOK_HREF}
                  className="flex items-center justify-center gap-2 rounded-full font-extrabold text-lg min-h-[58px] px-8 w-full sm:w-auto lg:max-[1679px]:w-full transition-[transform,opacity] active:scale-[0.97] hover:opacity-90"
                  style={{ backgroundColor: FOREST, color: WHITE }}
                >
                  <span className="whitespace-nowrap">Get a Free Estimate</span> <ArrowRight size={19} aria-hidden />
                </a>
              </div>
              <PhoneLink
                className="flex items-center justify-center gap-2 rounded-full font-bold text-[17px] min-h-[58px] px-6 transition-[transform,background-color] active:scale-[0.97] bg-white sm:bg-[#E8F0E6] hover:bg-[#F2F5F2] sm:hover:bg-[#D9E7D6]"
                style={{ color: FOREST, fontVariantNumeric: 'lining-nums tabular-nums' }}
              >
                <Phone size={17} fill="currentColor" aria-hidden />
                <span className="whitespace-nowrap">Call <PhoneNumber /></span>
              </PhoneLink>
            </div>
          </div>

          <div className="relative hidden sm:block sm:mx-6 sm:mt-8 lg:mx-0 lg:mt-0 sm:aspect-[16/11] lg:aspect-auto lg:h-[clamp(480px,38vw,760px)] rounded-2xl overflow-hidden" style={{ backgroundColor: LINE }}>
            <Image
              src={HERO_PHOTO.src}
              alt={HERO_PHOTO.alt}
              fill
              fetchPriority="high"
              quality={90}
              sizes="(min-width: 640px) 1000px, 100vw"
              className="object-cover object-[50%_72%]"
              style={{ filter: 'brightness(1.08)' }}
            />
            <div className="absolute left-6 bottom-6 flex items-center gap-3 rounded-2xl px-4 py-3" style={{ backgroundColor: WHITE }}>
              <MapPin size={20} style={{ color: GREEN }} aria-hidden />
              <div className="leading-tight">
                <p className="text-[16px] font-extrabold" style={{ color: INK }}>Local crew</p>
                <p className="text-[14px] font-semibold" style={{ color: MUTED }}>Metro Vancouver</p>
              </div>
            </div>
          </div>
          </div>

          {/* Solid cream strip - smooth transition into the next section (mobile) */}
          <div className="absolute bottom-0 inset-x-0 h-10 sm:hidden" style={{ backgroundColor: CREAM }} aria-hidden />
        </section>

        {/* ───────── Slogan + trust ───────── */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-5 lg:pt-2 pb-8 lg:pb-7 text-center">
            <p className="font-extrabold uppercase tracking-tight leading-none text-[26px] min-[380px]:text-[28px] sm:text-[34px]" style={{ color: INK }}>
              You point. We haul.
            </p>
            <p className="mt-2 text-[16px] sm:text-[17px] leading-snug max-w-md mx-auto" style={{ color: INK }}>
              From a single couch to a full garage - we carry it out, load the truck and sweep up after.
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-2.5">
              {trust.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-[16px] font-semibold" style={{ color: INK }}>
                  <Icon size={18} className="shrink-0" style={{ color: GREEN }} aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── Before & after - the strongest proof, straight after the hero ───────── */}
        <section style={{ backgroundColor: WHITE }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 lg:py-24 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[0.75fr_1.25fr] gap-8 lg:gap-16 items-center">
            <div>
              <Heading className="mb-4">Drag to clear the room.</Heading>
              <p data-reveal style={delay(80, { color: INK })} className="text-[17px] leading-relaxed max-w-md lg:mb-8">
                Real Stonegate jobs, photographed before we started and after we left.
              </p>
              <div data-reveal style={delay(160)}>
                <QuoteCta className="hidden lg:flex w-fit" />
              </div>
            </div>
            <div data-reveal style={delay(120)} className="mx-auto w-full max-w-[500px] lg:max-w-[560px]">
              <BeforeAfterSlider pairs={beforeAfter} />
            </div>
          </div>
        </section>

        {/* ───────── Real jobs - photo tiles, each with its label strip ───────── */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 lg:py-24">
            <Heading className="mb-3">This is what we haul.</Heading>
            <p data-reveal style={delay(80, { color: INK })} className="text-[17px] leading-relaxed max-w-lg mb-8 lg:mb-10">
              Single items to full warehouse cleanouts, across Metro Vancouver.
            </p>
            {/* Phones and tablets: one swipeable row that bleeds to the screen edges; desktop: three-column grid */}
            <ul className="-mx-5 sm:-mx-6 px-5 sm:px-6 scroll-px-5 sm:scroll-px-6 flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible">
              {jobs.map((j, i) => {
                const strip = STRIPS[i % STRIPS.length]
                return (
                  <li key={j.src} data-reveal style={delay((i % 3) * 80)} className="snap-start shrink-0 w-[72%] min-[480px]:w-[280px] lg:w-auto rounded-2xl overflow-hidden flex flex-col">
                    <div className="relative aspect-[4/5]" style={{ backgroundColor: LINE }}>
                      <Image src={j.src} alt={`${j.caption} - Stonegate junk removal truck`} fill sizes="(max-width: 1024px) 280px, 360px" className="object-cover" style={{ objectPosition: j.pos }} />
                    </div>
                    <p className="flex-1 px-4 py-3 text-[16px] font-bold leading-snug" style={{ backgroundColor: strip.bg, color: strip.fg }}>
                      {j.caption}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* ───────── What we take - filled bar rows ───────── */}
        <section id="what-we-take" style={{ backgroundColor: WHITE, scrollMarginTop: '80px' }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 lg:py-24 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16 items-start">
            <div>
              <Heading className="mb-4">Big cleanout or one bulky item.</Heading>
              <p data-reveal style={delay(80, { color: INK })} className="text-[17px] leading-relaxed max-w-md mb-5">
                Whatever is going, the crew carries it out and takes it away.
              </p>
              <div data-reveal style={delay(140)} className="flex flex-col gap-3">
                <Link href="/junk-removal/what-we-take" className="inline-flex items-center gap-2 text-[17px] font-extrabold underline underline-offset-4 hover:no-underline w-fit" style={{ color: GREEN }}>
                  See all {itemCount} things we take <ArrowRight size={16} aria-hidden />
                </Link>
                <p className="flex items-start gap-2 text-[14px]" style={{ color: MUTED }}>
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" style={{ color: '#B45309' }} aria-hidden />
                  No hazardous waste - paint, chemicals, fuel or asbestos.
                </p>
              </div>
            </div>
            <ul className="grid sm:grid-cols-2 gap-1.5">
              {takes.map(({ slug, label, Icon }, i) => (
                <li key={slug} data-reveal style={delay((i % 4) * 60)}>
                  <Link href={junkItemHref(slug)} className="group flex items-center gap-3 min-h-[60px] rounded-2xl px-5 transition-colors hover:bg-[#E8F0E6]" style={{ backgroundColor: CREAM }}>
                    <Icon size={22} strokeWidth={1.6} className="shrink-0" style={{ color: GREEN }} aria-hidden />
                    <span className="flex-1 text-[17px] font-semibold leading-tight" style={{ color: INK }}>{label}</span>
                    <ArrowRight size={17} className="shrink-0 transition-transform group-hover:translate-x-1" style={{ color: GREEN }} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── Pricing - the estimate as a ticket, with the tear-off stub for paying after ───────── */}
        <section style={{ backgroundColor: TAN }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 lg:py-24">
            <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-end mb-8 lg:mb-10">
              <Heading className="mb-4 lg:mb-0">Priced by load, confirmed on site.</Heading>
              <div data-reveal style={delay(80)}>
                <p className="text-[17px] leading-relaxed mb-4" style={{ color: INK }}>
                  You only pay for what you get rid of. Labour, loading and disposal are included - no hidden fees, no deposit, and you pay after the job.
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
        <section style={{ backgroundColor: WHITE }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 lg:py-24">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 mb-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Heading>Rated 4.9 on Google</Heading>
                <Stars size={22} />
              </div>
              <a href="https://maps.app.goo.gl/ooQYs564eGP7JZbC6" target="_blank" rel="noopener noreferrer" className="text-[17px] font-bold underline underline-offset-4 hover:no-underline" style={{ color: GREEN }}>
                Read all reviews
              </a>
            </div>
            <blockquote data-reveal style={delay(80)} className="max-w-4xl mb-12 lg:mb-16">
              <p className="text-[22px] min-[400px]:text-[24px] sm:text-3xl lg:text-[36px] font-bold leading-[1.3] tracking-tight mb-4" style={{ color: INK }}>
                &ldquo;{featured.text}&rdquo;
              </p>
              <footer className="text-[17px] font-extrabold" style={{ color: GREEN }}>{featured.name}</footer>
            </blockquote>
            <ul className="grid sm:grid-cols-3 gap-8 sm:gap-10">
              {reviews.map((r, i) => (
                <li key={r.name} data-reveal style={delay(i * 80)}>
                  <p className="text-[17px] leading-relaxed mb-3" style={{ color: INK }}>{r.text}</p>
                  <p className="text-[16px] font-extrabold" style={{ color: GREEN }}>{r.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── Why Stonegate + crew ───────── */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 lg:py-24 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-center">
            <div data-reveal className="relative aspect-[4/5] max-h-[560px] w-full rounded-2xl overflow-hidden" style={{ backgroundColor: LINE }}>
              <Image
                src="/about/photo-6.png"
                alt="The Stonegate junk removal crew sitting on top of their truck"
                fill
                sizes="(max-width: 1024px) 100vw, 460px"
                className="object-cover"
                style={{ objectPosition: 'center 42%' }}
              />
            </div>
            <div>
              <Heading className="mb-8">A local crew that shows up.</Heading>
              <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-7">
                {why.map(({ title, text }, i) => (
                  <li key={title} data-reveal style={delay((i % 2) * 80 + Math.floor(i / 2) * 60)}>
                    <p className="text-[20px] font-extrabold tracking-tight mb-1" style={{ color: INK }}>{title}</p>
                    <p className="text-[16px] leading-relaxed" style={{ color: INK }}>{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ───────── FAQ - answers set as reading text, all visible at a glance ───────── */}
        <section style={{ backgroundColor: WHITE }}>
          <FaqText faqs={faqs} heading={<Heading>Junk removal questions</Heading>} />
        </section>

        {/* ───────── Service area ───────── */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 lg:py-20">
            <Heading className="mb-3">Junk removal across Metro Vancouver</Heading>
            <p data-reveal style={delay(80, { color: INK })} className="text-[17px] leading-relaxed mb-7">
              Same-day pickup in every one of these cities.
            </p>
            <ul data-reveal style={delay(140)} className="flex flex-wrap gap-2">
              {CITIES.map(c => (
                <li key={c.slug}>
                  <Link href={cityJunkHref(c)} className="inline-flex items-center rounded-full px-4 min-h-[44px] text-[16px] font-semibold transition-colors hover:bg-[#E8F0E6]" style={{ backgroundColor: WHITE, color: INK }}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── Final CTA - full-width forest band with the crew photo ───────── */}
        <section className="[&_a:focus-visible]:outline-white selection:bg-white/25 selection:text-white" style={{ backgroundColor: FOREST }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 lg:py-24 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-14 items-center">
            <div data-reveal className="lg:order-2 relative aspect-[16/10] w-full rounded-2xl overflow-hidden" style={{ backgroundColor: CHARCOAL }}>
              <Image src="/crew-walking-truck.jpg" alt="Stonegate crew member walking beside the branded Stonegate truck" fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" style={{ objectPosition: 'center 55%' }} />
            </div>
            <div>
              <h2 data-reveal className="text-[30px] min-[400px]:text-[32px] sm:text-[40px] font-extrabold leading-[1.1] tracking-tight mb-3" style={{ color: WHITE }}>Tell us what needs to go.</h2>
              <p data-reveal style={delay(80, { color: '#CFE0D4' })} className="text-[17px] sm:text-lg mb-7">
                Your local Stonegate crew, serving Metro Vancouver.
              </p>
              <div data-reveal style={delay(160)} className="flex flex-col sm:flex-row gap-3 max-w-md sm:max-w-none">
                <QuoteCta onDark className="sm:w-auto" />
                <CallCta onDark className="sm:w-auto" />
              </div>
            </div>
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
