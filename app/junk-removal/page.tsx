import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import {
  Phone, ArrowRight, Star, CheckCircle2, Truck, Hand, ClipboardList, Sofa, Refrigerator, Warehouse, AlertTriangle, MapPin,
  BedDouble, Waves, Wrench, Tv, Building2, Zap, BadgeDollarSign, Recycle, Shield,
} from 'lucide-react'
import { JsonLd, FaqList, CityChips } from '@/components/seo/SeoBlocks'
import StickyCallBar from '@/components/landing/StickyCallBar'
import BeforeAfterSlider, { type SliderPair } from '@/components/landing/BeforeAfterSlider'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import { JUNK_ITEMS, junkItemHref } from '@/lib/seo/junk-items'
import { CITIES, cityJunkHref } from '@/lib/seo/cities'
import {
  SITE_URL, JUNK_BOOK_HREF, JUNK_RATE, providerLd, faqLd, type Faq,
} from '@/lib/seo/site'

export const metadata: Metadata = {
  title: { absolute: `Junk Removal Vancouver | Same-Day, From ${JUNK_RATE} | Stonegate` },
  description: `Same-day junk removal across Metro Vancouver. Our crew lifts, loads and hauls it all - furniture, appliances, cleanouts. From ${JUNK_RATE}, free on-site estimate.`,
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
const MUTED_BROWN = '#8B6845'
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

const why = [
  { Icon: Zap, title: 'Same-day & next-day', text: 'Call in the morning and we can often be there the same day.' },
  { Icon: Hand, title: 'We do all the lifting', text: 'From any room, basement or floor. You just point.' },
  { Icon: BadgeDollarSign, title: 'Price before we start', text: 'Confirmed on-site. Pay after the job - no deposit.' },
  { Icon: Truck, title: 'Bigger truck, fewer trips', text: '29 cubic yards - about 2.4x a standard dump truck.' },
  { Icon: Recycle, title: 'Donate & recycle first', text: 'Usable items go to local charities, landfill last.' },
  { Icon: Shield, title: 'Local & fully insured', text: 'A real Metro Vancouver crew, not a call centre.' },
]

// The before/after shots weren't taken from the exact same spot - the transforms line them up for the drag slider
const beforeAfter: SliderPair[] = [
  { label: 'Warehouse', before: '/junk-before-warehouse.jpg', after: '/junk-after-warehouse.jpg', afterAlign: { transform: 'scale(1.32)', transformOrigin: '30% 70%' } },
  // The after shot faces back the other way along the fence - mirrored so the fence sits on the same side
  { label: 'Fence removal', before: '/junk-before-fence.jpg', after: '/junk-after-fence-v2.jpg', afterAlign: { transform: 'scaleX(-1)', objectPosition: 'center 30%' } },
  { label: 'Living room', before: '/junk-before-livingroom.png', after: '/junk-after-livingroom.png', beforeAlign: { transform: 'scale(1.97)', transformOrigin: '39% 53%' } },
]

const featured = {
  name: 'Ksusha Martynova',
  text: 'They were courteous, worked fast, and had everything loaded up in no time. The price was better than I expected.',
}

const reviews = [
  { name: 'Aizhan Tabyldiyeva', text: 'Excellent junk removal service! The team was professional, punctual, and worked quickly. Their pricing was very fair and offered great value for the quality of service. They cleared everything out efficiently. Highly recommend!!' },
  { name: 'Albert Go', text: 'I had a great experience with Stonegate Moving Solutions for junk removal. They responded quickly, arrived on time, and cleared everything out much faster than I expected. The crew was friendly and professional.' },
  { name: 'Aryan Kapoor', text: 'Really happy with the service. The guys were on time, worked quickly, and took good care of my stuff. Would definitely use them again!' },
]

const faqs: Faq[] = [
  { q: 'How much does junk removal cost?', a: `Junk removal starts at ${JUNK_RATE} and is priced by the size of your load. Estimates are free and done on-site - the crew confirms the final price before we start, and you pay after the job.` },
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

function QuoteCta({ className = '' }: { className?: string }) {
  return (
    <a
      href={JUNK_BOOK_HREF}
      className={`flex items-center justify-center gap-2 rounded-xl font-extrabold text-[17px] min-h-[56px] px-7 transition-transform active:scale-[0.98] hover:scale-[1.01] ${className}`}
      style={{ backgroundColor: GREEN, color: WHITE }}
    >
      <span className="whitespace-nowrap">Get a Free Estimate</span> <ArrowRight size={18} aria-hidden />
    </a>
  )
}

function CallCta({ className = '' }: { className?: string }) {
  return (
    <PhoneLink
      className={`flex items-center justify-center gap-2 rounded-xl font-bold text-base min-h-[52px] px-6 transition-colors hover:bg-[#E8F0E6] ${className}`}
      style={{ color: GREEN, border: `1.5px solid ${GREEN}`, backgroundColor: WHITE, fontVariantNumeric: 'lining-nums tabular-nums' }}
    >
      <Phone size={18} fill="currentColor" aria-hidden />
      <span className="whitespace-nowrap">Call <PhoneNumber /></span>
    </PhoneLink>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: MUTED_BROWN }}>{children}</p>
}

function Heading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-[30px] min-[400px]:text-[32px] sm:text-[40px] font-extrabold leading-[1.1] tracking-tight ${className}`} style={{ color: INK }}>
      {children}
    </h2>
  )
}

function Accent({ children }: { children: React.ReactNode }) {
  return <span style={{ color: GREEN }}>{children}</span>
}

export default function JunkRemovalPage() {
  const itemCount = JUNK_ITEMS.length
  return (
    <div className="flex flex-col min-h-screen pb-[84px] lg:pb-0" style={{ backgroundColor: WHITE }}>
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
      <Navbar minimalMobile />

      <main className="flex-1">

        {/* ───────── Hero ───────── */}
        {/* Phone: full-bleed photo with the headline over it. Tablet: headline on warm cream, photo card below. Desktop: headline and photo card side by side */}
        <section className="relative flex items-center min-h-[680px] sm:min-h-0 sm:py-10 lg:py-12 xl:py-14 sm:bg-[linear-gradient(180deg,#F3EADD_0%,#FAF7F2_100%)]" style={{ overflow: 'hidden' }}>
          <div className="absolute inset-0 sm:hidden" style={{ backgroundColor: CHARCOAL }}>
            <Image
              src={HERO_PHOTO.mobileSrc}
              alt={HERO_PHOTO.alt}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-[center_top]"
            />
          </div>
          {/* Mobile: soft dark patch in the top-left corner only, behind the headline */}
          <div className="absolute inset-0 sm:hidden" style={{ background: 'radial-gradient(ellipse 125% 440px at 0% 0%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.4) 72%, rgba(0,0,0,0.15) 88%, transparent 100%)' }} aria-hidden />
          {/* Desktop: centred two-column layout - headline left, large photo card right (the main focus) */}
          <div className="relative z-20 w-full lg:max-w-[1600px] lg:mx-auto lg:px-12 xl:px-16 lg:grid lg:grid-cols-[minmax(0,36fr)_minmax(0,64fr)] lg:gap-10 xl:gap-14 lg:items-center">
          {/* On desktop the text column is a size container, so the headline scales to always fit it on one line */}
          <div className="px-5 sm:px-6 pt-0 pb-2 lg:p-0 max-w-[620px] lg:max-w-none lg:@container">
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
            <a href="https://maps.app.goo.gl/ooQYs564eGP7JZbC6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mb-52 sm:mb-8">
              <GoogleLogo size={16} />
              <Stars size={15} />
              <span className="text-[15px] lg:text-[17px] font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.85)] sm:text-[#1A1714] sm:[text-shadow:none]">4.9 rating</span>
            </a>
            {/* Desktop: the text column is too narrow for two buttons side by side until ~1680px, so they stack full-width below that */}
            <div className="flex flex-col sm:flex-row lg:max-[1679px]:flex-col gap-4 sm:gap-3">
              <div id="hero-cta">
                <a
                  href={JUNK_BOOK_HREF}
                  className="flex items-center justify-center gap-2 rounded-xl font-extrabold text-lg min-h-[58px] px-8 w-full sm:w-auto lg:max-[1679px]:w-full transition-transform active:scale-[0.98] hover:scale-[1.01]"
                  style={{ backgroundColor: FOREST, color: WHITE, boxShadow: '0 4px 12px -4px rgba(0,0,0,0.35)' }}
                >
                  <span className="whitespace-nowrap">Get a Free Estimate</span> <ArrowRight size={19} aria-hidden />
                </a>
              </div>
              <PhoneLink
                className="flex items-center justify-center gap-2 rounded-xl font-bold text-base min-h-[58px] px-6 transition-colors hover:bg-[#F2F5F2] sm:border-[1.5px] sm:border-[#064B31]"
                style={{ color: FOREST, backgroundColor: WHITE, fontVariantNumeric: 'lining-nums tabular-nums' }}
              >
                <Phone size={17} fill="currentColor" aria-hidden />
                <span className="whitespace-nowrap">Call <PhoneNumber /></span>
              </PhoneLink>
            </div>
          </div>

          <div className="relative hidden sm:block sm:mx-6 sm:mt-8 lg:mx-0 lg:mt-0 sm:aspect-[16/11] lg:aspect-auto lg:translate-x-8 xl:translate-x-12 lg:h-[clamp(480px,38vw,760px)] rounded-[32px] overflow-hidden" style={{ backgroundColor: LINE, boxShadow: '0 30px 60px -30px rgba(26,23,20,0.45)' }}>
            <Image
              src={HERO_PHOTO.src}
              alt={HERO_PHOTO.alt}
              fill
              priority
              quality={90}
              sizes="(min-width: 640px) 1000px, 100vw"
              className="object-cover object-[50%_72%]"
              style={{ filter: 'brightness(1.08)' }}
            />
            <div className="absolute left-6 bottom-6 flex items-center gap-3 rounded-2xl px-4 py-3" style={{ backgroundColor: WHITE, boxShadow: '0 14px 30px -14px rgba(26,23,20,0.35)' }}>
              <span className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: LIGHT_GREEN }}>
                <MapPin size={19} style={{ color: GREEN }} aria-hidden />
              </span>
              <div className="leading-tight">
                <p className="text-[15px] font-extrabold" style={{ color: INK }}>Local crew</p>
                <p className="text-[13px] font-semibold" style={{ color: MUTED }}>Metro Vancouver</p>
              </div>
            </div>
          </div>
          </div>

          {/* Solid cream strip - smooth transition into the next section (mobile) */}
          <div className="absolute bottom-0 inset-x-0 h-10 sm:hidden" style={{ backgroundColor: CREAM }} aria-hidden />
        </section>

        {/* ───────── Slogan card + trust ───────── */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-5 lg:pt-2">
            {/* Slogan - plain type on the cream, gold rules either side */}
            <div className="text-center">
              <p className="flex items-center justify-center gap-3 sm:gap-4 font-extrabold uppercase tracking-tight leading-none text-[26px] min-[380px]:text-[28px] sm:text-[34px]" style={{ color: INK }}>
                <span className="h-px w-8 sm:w-14 shrink-0" style={{ background: 'linear-gradient(to right, transparent, #C98A45)' }} aria-hidden />
                <span>You point. <span style={{ color: FOREST }}>We haul.</span></span>
                <span className="h-px w-8 sm:w-14 shrink-0" style={{ background: 'linear-gradient(to left, transparent, #C98A45)' }} aria-hidden />
              </p>
              <p className="mt-2 text-sm sm:text-[15px] leading-snug max-w-md mx-auto" style={{ color: MUTED }}>
                From a single couch to a full garage - we carry it out, load the truck and sweep up after.
              </p>
            </div>
          </div>

          {/* Trust row */}
          <ul className="max-w-6xl mx-auto px-5 sm:px-6 py-6 lg:py-5 grid grid-cols-3 gap-2">
            {trust.map(({ Icon, label }, i) => (
              <li key={label} className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left ${i > 0 ? 'border-l' : ''}`} style={{ borderColor: LINE }}>
                <span className="flex items-center justify-center shrink-0 w-10 h-10 rounded-full" style={{ backgroundColor: LIGHT_GREEN }}>
                  <Icon size={19} style={{ color: GREEN }} aria-hidden />
                </span>
                <span className="text-[13px] sm:text-[15px] font-semibold leading-tight" style={{ color: INK }}>{label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────── Real jobs ───────── */}
        <section style={{ backgroundColor: WHITE }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-14 lg:pt-20 mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Real Stonegate jobs</Eyebrow>
              <Heading>This is what <Accent>we haul.</Accent></Heading>
            </div>
            <p className="text-[15px] max-w-xs" style={{ color: MUTED }}>No stock photos. Our trucks on real Metro Vancouver jobs.</p>
          </div>
          <ul className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-5 sm:scroll-px-6 px-5 sm:px-6 pb-14 lg:pb-20 lg:max-w-6xl lg:mx-auto lg:grid lg:grid-cols-3 lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {jobs.map(j => (
              <li key={j.src} className="snap-start shrink-0 w-[72%] min-[480px]:w-[280px] lg:w-auto">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden" style={{ backgroundColor: LINE }}>
                  <Image src={j.src} alt={`${j.caption} - Stonegate junk removal truck`} fill sizes="(max-width: 1024px) 280px, 360px" className="object-cover" style={{ objectPosition: j.pos }} />
                </div>
                <p className="text-[15px] font-bold mt-3" style={{ color: INK }}>{j.caption}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────── What we take ───────── */}
        <section id="what-we-take" style={{ backgroundColor: CREAM, scrollMarginTop: '80px' }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-12 lg:py-16">
            <div className="text-center mb-7">
              <Eyebrow>What we take</Eyebrow>
              <Heading>Big cleanout or one bulky item.</Heading>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              {takes.map(({ slug, label, Icon }) => (
                <li key={slug}>
                  <Link href={junkItemHref(slug)} className="flex flex-col items-center justify-center gap-3 h-full rounded-2xl px-3 py-5 sm:py-6 text-center transition-colors hover:bg-[#E8F0E6]" style={{ backgroundColor: WHITE, border: `1px solid ${LINE}` }}>
                    <Icon size={32} strokeWidth={1.5} style={{ color: GREEN }} aria-hidden />
                    <span className="text-[15px] sm:text-base font-bold leading-tight" style={{ color: INK }}>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col items-center gap-3 text-center">
              <Link href="/junk-removal/what-we-take" className="inline-flex items-center gap-2 text-[15px] font-extrabold underline underline-offset-4" style={{ color: GREEN }}>
                See all {itemCount} things we take <ArrowRight size={16} aria-hidden />
              </Link>
              <p className="flex items-center justify-center gap-2 text-sm" style={{ color: MUTED }}>
                <AlertTriangle size={15} className="shrink-0" style={{ color: '#B45309' }} aria-hidden />
                No hazardous waste - paint, chemicals, fuel or asbestos.
              </p>
            </div>
          </div>
        </section>

        {/* ───────── Before & after ───────── */}
        <section style={{ backgroundColor: WHITE }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14 lg:py-20 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-20 items-center">
            <div>
              <Eyebrow>Before &amp; after</Eyebrow>
              <Heading className="mb-4">Drag to <Accent>clear the room.</Accent></Heading>
              <p className="text-base sm:text-[17px] leading-relaxed max-w-md" style={{ color: MUTED }}>
                Real Stonegate jobs, photographed before we started and after we left.
              </p>
            </div>
            <div className="mx-auto w-full max-w-[500px]">
              <BeforeAfterSlider pairs={beforeAfter} />
            </div>
          </div>
        </section>

        {/* ───────── How it works ───────── */}
        <section style={{ backgroundColor: TAN }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14 lg:py-20">
            <Eyebrow>How it works</Eyebrow>
            <Heading className="mb-8">Gone in <span style={{ color: GREEN }}>three steps.</span></Heading>
            <ol className="grid md:grid-cols-3 gap-4 md:gap-6">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-2xl p-6" style={{ backgroundColor: WHITE }}>
                  <span className="flex items-center justify-center w-11 h-11 rounded-full text-lg font-extrabold mb-4" style={{ backgroundColor: GREEN, color: WHITE }}>{i + 1}</span>
                  <p className="text-lg font-extrabold mb-1.5" style={{ color: INK }}>{s.title}</p>
                  <p className="text-[15px] leading-relaxed" style={{ color: MUTED }}>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── Reviews ───────── */}
        <section style={{ backgroundColor: WHITE }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-14 lg:pt-20 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="flex items-center gap-3">
                <Stars size={18} />
                <span className="text-sm font-bold" style={{ color: INK }}>Rated 4.9 on Google</span>
              </span>
              <a href="https://maps.app.goo.gl/ooQYs564eGP7JZbC6" target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline underline-offset-4" style={{ color: GREEN }}>
                Read all reviews
              </a>
            </div>
            <blockquote>
              <p className="text-[22px] min-[400px]:text-[24px] sm:text-3xl lg:text-[36px] font-bold leading-[1.3] tracking-tight mb-5" style={{ color: INK }}>
                <span style={{ color: GREEN }}>&ldquo;</span>{featured.text}<span style={{ color: GREEN }}>&rdquo;</span>
              </p>
              <footer className="text-[15px] font-extrabold" style={{ color: GREEN }}>{featured.name}</footer>
            </blockquote>
          </div>
          <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-5 sm:scroll-px-6 px-5 sm:px-6 pt-6 pb-14 lg:pb-20 lg:max-w-6xl lg:mx-auto lg:grid lg:grid-cols-3 lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {reviews.map(r => (
              <li key={r.name} className="snap-start shrink-0 w-[80%] min-[480px]:w-[300px] lg:w-auto flex flex-col rounded-2xl p-5" style={{ backgroundColor: CREAM, border: `1px solid ${LINE}` }}>
                <Stars size={13} />
                <p className="text-[15px] leading-relaxed mt-3 mb-4 flex-1" style={{ color: MUTED }}>{r.text}</p>
                <p className="text-sm font-extrabold" style={{ color: INK }}>{r.name}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────── Pricing ───────── */}
        <section style={{ backgroundColor: LIGHT_GREEN }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14 lg:py-20 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <Eyebrow>Simple pricing</Eyebrow>
              <Heading className="mb-4">Priced by load. <Accent>Confirmed before we start.</Accent></Heading>
              <p className="text-base sm:text-[17px] leading-relaxed mb-6 max-w-lg" style={{ color: MUTED }}>
                You only pay for what you get rid of. Labour, loading and disposal are included - no hidden fees, no deposit, and you pay after the job.
              </p>
              <Link href="/pricing/junk-removal" className="inline-flex items-center gap-2 text-[15px] font-extrabold underline underline-offset-4" style={{ color: GREEN }}>
                How our pricing works <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
            <div className="mx-auto w-full max-w-[420px] rounded-3xl p-7 sm:p-9" style={{ backgroundColor: WHITE, boxShadow: '0 12px 32px -16px rgba(1,68,33,0.25)' }}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: MUTED }}>Junk removal from</p>
              <p className="flex items-end gap-2 mb-6">
                <span className="text-6xl font-extrabold tracking-tight leading-none" style={{ color: INK }}>{JUNK_RATE}</span>
                <span className="text-base font-semibold mb-1" style={{ color: MUTED }}>and up</span>
              </p>
              <ul className="flex flex-col gap-3 mb-7">
                {['Free on-site estimate', 'Price confirmed before we start', 'Pay after - card, e-transfer or cash'].map(t => (
                  <li key={t} className="flex items-center gap-3 text-[15px] font-semibold" style={{ color: INK }}>
                    <CheckCircle2 size={18} className="shrink-0" style={{ color: GREEN }} aria-hidden /> {t}
                  </li>
                ))}
              </ul>
              <QuoteCta className="w-full" />
            </div>
          </div>
        </section>

        {/* ───────── Why Stonegate + crew ───────── */}
        <section style={{ backgroundColor: WHITE }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14 lg:py-20 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-center">
            <div className="relative aspect-[4/5] max-h-[560px] w-full rounded-3xl overflow-hidden" style={{ backgroundColor: LINE }}>
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
              <Eyebrow>Why Stonegate</Eyebrow>
              <Heading className="mb-7">A local crew that <Accent>shows up.</Accent></Heading>
              <ul className="grid sm:grid-cols-2 gap-x-8">
                {why.map(({ Icon, title, text }) => (
                  <li key={title} className="flex gap-4 py-5" style={{ borderTop: `1px solid ${LINE}` }}>
                    <Icon size={22} className="shrink-0 mt-0.5" style={{ color: GREEN }} aria-hidden />
                    <div>
                      <p className="font-extrabold mb-1" style={{ color: INK }}>{title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <FaqList faqs={faqs} heading="Junk removal questions" />

        {/* ───────── Service area ───────── */}
        <section className="py-12" style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <p className="flex items-center gap-2 text-sm font-bold mb-1" style={{ color: MUTED }}>
              <MapPin size={15} aria-hidden /> Same-day service area
            </p>
            <CityChips heading="Junk removal across Metro Vancouver" links={CITIES.map(c => ({ href: cityJunkHref(c), label: c.name }))} />
          </div>
        </section>

        {/* ───────── Crew + final CTA ───────── */}
        <section style={{ backgroundColor: WHITE }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-6 py-14 lg:py-20 text-center">
            <Heading className="mb-2">Your local Stonegate crew</Heading>
            <p className="text-base sm:text-lg mb-6" style={{ color: MUTED }}>A local team serving Metro Vancouver.</p>
            <div className="relative aspect-[16/10] sm:aspect-[16/8] w-full rounded-2xl overflow-hidden mb-8" style={{ backgroundColor: LINE }}>
              <Image src="/crew-walking-truck.jpg" alt="Stonegate crew member walking beside the branded Stonegate truck" fill sizes="(max-width: 896px) 100vw, 860px" className="object-cover" style={{ objectPosition: 'center 55%' }} />
            </div>
            <h2 className="text-[26px] sm:text-[32px] font-extrabold tracking-tight mb-5" style={{ color: INK }}>Tell us what needs to go.</h2>
            <div className="max-w-md mx-auto">
              <QuoteCta className="w-full mb-2.5" />
              <CallCta className="w-full" />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <StickyCallBar watchId="hero-cta" quoteHref={JUNK_BOOK_HREF} />
    </div>
  )
}
