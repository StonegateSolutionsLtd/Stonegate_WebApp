import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import {
  Phone, ArrowRight, Star, Shield, Zap, Clock, CheckCircle2, Recycle, Truck, Hand, BadgeDollarSign,
  Sofa, BedDouble, Refrigerator, Waves, Warehouse, Wrench, Tv, Building2, AlertTriangle, MapPin,
} from 'lucide-react'
import { JsonLd, FaqList, CityChips } from '@/components/seo/SeoBlocks'
import { Skyline } from '@/components/seo/CityBanner'
import StickyCallBar from '@/components/landing/StickyCallBar'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import { JUNK_ITEMS, junkItemHref } from '@/lib/seo/junk-items'
import { CITIES, cityJunkHref } from '@/lib/seo/cities'
import {
  SITE_URL, JUNK_BOOK_HREF, JUNK_RATE, providerLd, faqLd, type Faq,
} from '@/lib/seo/site'

export const metadata: Metadata = {
  title: { absolute: `Junk Removal Vancouver | Same-Day, From ${JUNK_RATE} | Stonegate` },
  description: `Same-day junk removal across Metro Vancouver. Our crew lifts, loads and hauls it all - furniture, appliances, cleanouts. From ${JUNK_RATE}, free estimate.`,
  keywords: ['junk removal Vancouver', 'junk removal near me', 'same-day junk removal', 'junk pickup Metro Vancouver', 'furniture removal', 'garbage removal Vancouver'],
  alternates: { canonical: `${SITE_URL}/junk-removal` },
}

const GREEN = '#014421'
const INK = '#1A1714'
const BODY = '#4A3F38'
const MUTED = '#6B5E54'
const LINE = '#E8E0D5'
const CREAM = '#FAF7F2'
const SAND = '#F5F0EB'
const GOLD = '#C98A45'

const trust = [
  { Icon: Clock, label: '2-hour window' },
  { Icon: Zap, label: 'Same-day pickup' },
  { Icon: Shield, label: 'Fully insured' },
  { Icon: BadgeDollarSign, label: 'No hidden fees' },
]

const steps = [
  { title: 'Request a free estimate', text: 'Tell us what is going and pick a time that suits you. No deposit, no obligation.' },
  { title: 'Exact price in person', text: 'Our crew sees everything and gives you the price on the spot - before we lift a thing.' },
  { title: 'We haul it all away', text: 'We carry it out from any room or floor, load the truck and sweep up after.' },
]

const takes = [
  { slug: 'furniture-removal', label: 'Furniture', Icon: Sofa },
  { slug: 'mattress-removal', label: 'Mattresses', Icon: BedDouble },
  { slug: 'appliance-removal', label: 'Appliances', Icon: Refrigerator },
  { slug: 'hot-tub-removal', label: 'Hot tubs', Icon: Waves },
  { slug: 'garage-cleanout', label: 'Garage cleanouts', Icon: Warehouse },
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

const beforeAfter = [
  { label: 'Living room cleared', before: '/junk-before-livingroom.png', after: '/junk-after-livingroom.png' },
  { label: 'Warehouse cleanout', before: '/junk-before-warehouse.jpg', after: '/junk-after-warehouse.jpg' },
  { label: 'Side yard debris', before: '/junk-before-siding.jpg', after: '/junk-after-siding.jpg' },
  { label: 'Old fence hauled', before: '/junk-before-fence.jpg', after: '/junk-after-fence-v2.jpg' },
]

const reviews = [
  { name: 'Ksusha Martynova', text: 'Needed some old furniture and random junk hauled away, and these guys did an awesome job. They were courteous, worked fast, and had everything loaded up in no time. The price was better than I expected, especially for how much they took.' },
  { name: 'Aizhan Tabyldiyeva', text: 'Excellent junk removal service! The team was professional, punctual, and worked quickly. Their pricing was very fair and offered great value for the quality of service. They cleared everything out efficiently. Highly recommend!!' },
  { name: 'Albert Go', text: 'I had a great experience with Stonegate Moving Solutions for junk removal. They responded quickly, arrived on time, and cleared everything out much faster than I expected. The crew was friendly and professional.' },
  { name: 'Aryan Kapoor', text: 'Really happy with the service. The guys were on time, worked quickly, and took good care of my stuff. Would definitely use them again!' },
]

const why = [
  { Icon: Zap, title: 'Same-day & next-day', text: 'Call in the morning and we can often be there the same day.' },
  { Icon: Hand, title: 'We do all the lifting', text: 'From any room, basement or floor. You just point.' },
  { Icon: BadgeDollarSign, title: 'Price before we start', text: 'Confirmed on-site. Pay after the job - no deposit.' },
  { Icon: Truck, title: 'Bigger truck, fewer trips', text: '29 cubic yards - about 2.4x a standard dump truck.' },
  { Icon: Recycle, title: 'Donate & recycle first', text: 'Usable items go to local charities, landfill last.' },
  { Icon: Shield, title: 'Local & fully insured', text: 'A real Metro Vancouver crew, not a call centre.' },
]

const faqs: Faq[] = [
  { q: 'How much does junk removal cost?', a: `Junk removal starts at ${JUNK_RATE} and is priced by the size of your load. Send a photo for a free estimate - the final price is confirmed on-site before we start, and you pay after the job.` },
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

function CallCta({ className = '', light = false }: { className?: string; light?: boolean }) {
  return (
    <PhoneLink
      className={`flex items-center justify-center gap-2 rounded-full font-extrabold text-base min-h-[54px] px-4 min-[375px]:px-6 transition-opacity hover:opacity-85 ${className}`}
      style={light ? { color: CREAM, border: '2px solid rgba(250,247,242,0.75)' } : { color: GREEN, border: `2px solid ${GREEN}`, backgroundColor: '#FFFFFF' }}
    >
      <Phone size={18} fill="currentColor" aria-hidden />
      <span className="whitespace-nowrap">Call <PhoneNumber /></span>
    </PhoneLink>
  )
}

function QuoteCta({ className = '', light = false }: { className?: string; light?: boolean }) {
  return (
    <a
      href={JUNK_BOOK_HREF}
      className={`flex items-center justify-center gap-2 rounded-full font-extrabold text-[17px] min-[375px]:text-lg min-h-[58px] px-6 transition-transform active:scale-[0.98] hover:scale-[1.02] ${className}`}
      style={light ? { backgroundColor: CREAM, color: GREEN } : { backgroundColor: GREEN, color: CREAM }}
    >
      Get a Free Estimate <ArrowRight size={18} aria-hidden />
    </a>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>{children}</p>
}

export default function JunkRemovalPage() {
  const itemCount = JUNK_ITEMS.length
  return (
    <div className="flex flex-col min-h-screen pb-[84px] lg:pb-0" style={{ backgroundColor: CREAM }}>
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
        <section className="relative overflow-hidden lg:bg-[#014421]">
          <div className="hidden lg:block absolute inset-0 opacity-30 [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.3)_45%,black_85%)]" aria-hidden>
            <Skyline seed="junk-removal" style="city" />
          </div>
          <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:py-11 grid lg:grid-cols-[1.1fr_1fr] gap-x-12 items-center">
            <div className="-mx-5 px-5 sm:-mx-6 sm:px-6 pt-5 pb-6 lg:m-0 lg:p-0" style={{ backgroundColor: GREEN }}>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <a
                  href="https://maps.app.goo.gl/ooQYs564eGP7JZbC6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', color: '#FFFFFF' }}
                >
                  <Stars size={12} /> 4.9 on Google
                </a>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold" style={{ backgroundColor: GOLD, color: INK }}>
                  <Zap size={13} aria-hidden /> Same-day available
                </span>
              </div>
              <h1 className="font-extrabold tracking-tight leading-[1.05] mb-2.5 text-[34px] min-[375px]:text-[36px] sm:text-[38px] lg:text-[52px]" style={{ color: '#FFFFFF' }}>
                <span style={{ color: GOLD }}>Junk Removal</span> in Metro Vancouver
              </h1>
              <p className="text-base sm:text-lg leading-snug mb-3.5 max-w-xl" style={{ color: 'rgba(255,255,255,0.88)' }}>
                We lift, load and haul your junk away. You just point.
              </p>
              <p className="mb-4">
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.78)' }}>From </span>
                <span className="text-[28px] font-extrabold align-middle" style={{ color: '#FFFFFF' }}>{JUNK_RATE}</span>
                <span className="block text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.78)' }}>Free estimate · Price confirmed before loading</span>
              </p>
              <div id="hero-cta" className="grid grid-cols-1 min-[360px]:grid-cols-[1.25fr_1fr] lg:flex gap-2.5 lg:gap-3">
                <a
                  href={JUNK_BOOK_HREF}
                  className="flex items-center justify-center gap-1.5 rounded-full font-extrabold text-base lg:text-lg min-h-[56px] px-4 lg:px-7 transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: '#FFFFFF', color: GREEN }}
                >
                  <span className="whitespace-nowrap">Get a Free Estimate</span> <ArrowRight size={17} aria-hidden />
                </a>
                <PhoneLink
                  className="flex items-center justify-center gap-2 rounded-full font-extrabold text-base min-h-[56px] px-4 lg:px-6"
                  style={{ color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.8)' }}
                >
                  <Phone size={17} fill="currentColor" aria-hidden />
                  <span className="lg:hidden">Call</span>
                  <span className="hidden lg:inline whitespace-nowrap"><PhoneNumber /></span>
                </PhoneLink>
              </div>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="relative h-[210px] min-[400px]:h-[230px] sm:h-[300px] lg:h-auto lg:aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_12px_28px_-14px_rgba(26,23,20,0.45)] lg:shadow-[0_18px_40px_-14px_rgba(0,0,0,0.55)]" style={{ backgroundColor: LINE }}>
                <Image
                  src="/about/photo-3.jpg"
                  alt="The Stonegate junk removal crew in uniform in front of their truck"
                  fill
                  preload
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 90vw, 520px"
                  className="object-cover object-[60%_76%] lg:object-[62%_45%]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Reviews ───────── */}
        <section className="pt-7 pb-10 lg:py-14" style={{ backgroundColor: CREAM }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
              <div>
                <Eyebrow>Real Google reviews</Eyebrow>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: INK }}>Rated 4.9 by our customers</h2>
              </div>
              <a href="https://maps.app.goo.gl/ooQYs564eGP7JZbC6" target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline" style={{ color: GREEN }}>
                Read all reviews
              </a>
            </div>
          </div>
          <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-5 sm:px-6 lg:max-w-6xl lg:mx-auto lg:grid lg:grid-cols-4 lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {reviews.map(r => (
              <li key={r.name} className="snap-start shrink-0 w-[82%] min-[480px]:w-[300px] lg:w-auto rounded-2xl p-5 flex flex-col" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}` }}>
                <Stars />
                <p className="text-[15px] leading-relaxed mt-3 mb-4 flex-1" style={{ color: BODY }}>&ldquo;{r.text}&rdquo;</p>
                <p className="text-sm font-extrabold" style={{ color: INK }}>{r.name}</p>
              </li>
            ))}
          </ul>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 mt-7">
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {trust.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-2 rounded-xl px-3 py-3 text-[13px] min-[375px]:text-sm font-bold" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}`, color: INK }}>
                  <Icon size={17} className="shrink-0" style={{ color: GREEN }} aria-hidden /> {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── How it works ───────── */}
        <section className="py-12 lg:py-16" style={{ backgroundColor: SAND, borderTop: `1px solid ${LINE}` }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8" style={{ color: INK }}>Gone in 3 easy steps</h2>
            <ol className="grid md:grid-cols-3 gap-4 md:gap-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex md:flex-col gap-4 rounded-2xl p-5 md:p-6" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}` }}>
                  <span className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-lg font-extrabold" style={{ backgroundColor: GREEN, color: CREAM }}>{i + 1}</span>
                  <div>
                    <p className="text-lg font-extrabold mb-1" style={{ color: INK }}>{s.title}</p>
                    <p className="text-[15px] leading-relaxed" style={{ color: MUTED }}>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── Real jobs ───────── */}
        <section className="py-12 lg:py-16" style={{ backgroundColor: '#FFFFFF', borderTop: `1px solid ${LINE}` }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>Real Stonegate jobs</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: INK }}>This is what we haul, every day.</h2>
            <p className="text-[15px]" style={{ color: MUTED }}>No stock photos - these are our trucks on real Metro Vancouver jobs.</p>
          </div>
          <ul className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory px-5 sm:px-6 lg:max-w-6xl lg:mx-auto lg:grid lg:grid-cols-3 lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {jobs.map(j => (
              <li key={j.src} className="snap-start shrink-0 w-[72%] min-[480px]:w-[280px] lg:w-auto">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden" style={{ backgroundColor: LINE }}>
                  <Image src={j.src} alt={`${j.caption} - Stonegate junk removal truck`} fill sizes="(max-width: 1024px) 280px, 360px" className="object-cover" style={{ objectPosition: j.pos }} />
                  <span className="absolute left-3 bottom-3 right-3 rounded-xl px-3 py-2 text-[13px] font-bold" style={{ backgroundColor: 'rgba(26,23,20,0.78)', color: '#FFFFFF' }}>{j.caption}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────── Before & after ───────── */}
        <section className="py-12 lg:py-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 mb-6">
            <Eyebrow>Before &amp; after</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: INK }}>Let your space breathe again.</h2>
            <p className="text-[15px] lg:hidden" style={{ color: MUTED }}>Swipe to see more jobs →</p>
          </div>
          <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-5 sm:px-6 lg:max-w-6xl lg:mx-auto lg:grid lg:grid-cols-2 lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {beforeAfter.map(p => (
              <li key={p.label} className="snap-start shrink-0 w-[88%] min-[520px]:w-[440px] lg:w-auto">
                <div className="grid grid-cols-2 rounded-2xl overflow-hidden" style={{ border: `1px solid ${LINE}` }}>
                  {([['Before', p.before, 'rgba(26,23,20,0.7)'], ['After', p.after, GREEN]] as const).map(([tag, src, bg]) => (
                    <div key={tag} className="relative aspect-[3/4]" style={{ backgroundColor: LINE }}>
                      <Image src={src} alt={`${tag} junk removal - ${p.label}`} fill sizes="(max-width: 1024px) 45vw, 290px" className="object-cover" />
                      <span className="absolute top-2.5 left-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1" style={{ backgroundColor: bg, color: '#FFFFFF' }}>{tag}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold mt-2.5" style={{ color: INK }}>{p.label}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ───────── What we take ───────── */}
        <section id="what-we-take" className="py-12 lg:py-16" style={{ backgroundColor: SAND, scrollMarginTop: '80px' }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <Eyebrow>What we take</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: INK }}>If it&apos;s taking up space, we take it.</h2>
            <p className="text-[15px] mb-7" style={{ color: MUTED }}>From a single couch to a full estate cleanout.</p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {takes.map(({ slug, label, Icon }) => (
                <li key={slug}>
                  <Link href={junkItemHref(slug)} className="flex flex-col items-start gap-3 h-full rounded-2xl p-4 min-h-[104px] transition-colors hover:bg-[#E8F0E6]" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}` }}>
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F0E6' }}>
                      <Icon size={20} style={{ color: GREEN }} aria-hidden />
                    </span>
                    <span className="text-[15px] font-extrabold leading-tight" style={{ color: INK }}>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/junk-removal/what-we-take" className="mt-5 flex items-center justify-center gap-2 rounded-full min-h-[50px] px-6 text-[15px] font-extrabold sm:inline-flex" style={{ color: GREEN, border: `2px solid ${GREEN}` }}>
              See all {itemCount} things we take <ArrowRight size={16} aria-hidden />
            </Link>
            <div className="flex items-start gap-3 rounded-2xl p-4 mt-6" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}` }}>
              <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: '#B45309' }} aria-hidden />
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                <span className="font-bold" style={{ color: INK }}>We can&apos;t take </span>
                hazardous waste - paint, chemicals, fuel or asbestos. Not sure? Just ask.
              </p>
            </div>
          </div>
        </section>

        {/* ───────── Pricing ───────── */}
        <section className="py-12 lg:py-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            <div>
              <Eyebrow>Simple pricing</Eyebrow>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>Priced by load size. Confirmed before we start.</h2>
              <p className="text-[15px] leading-relaxed mb-5" style={{ color: MUTED }}>
                You only pay for what you get rid of. Labour, loading and disposal are included - no hidden fees, no deposit, and you pay after the job.
              </p>
              <Link href="/pricing/junk-removal" className="inline-flex items-center gap-2 text-[15px] font-extrabold underline" style={{ color: GREEN }}>
                How our pricing works <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
            <div className="rounded-3xl p-6 sm:p-8" style={{ backgroundColor: '#254220' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#B5C9B0' }}>Junk removal from</p>
              <p className="flex items-end gap-2 mb-5">
                <span className="text-6xl font-extrabold leading-none" style={{ color: CREAM }}>{JUNK_RATE}</span>
                <span className="text-lg font-semibold mb-1" style={{ color: '#B5C9B0' }}>and up</span>
              </p>
              <ul className="flex flex-col gap-2.5 mb-6">
                {['Free estimate from a photo', 'Price confirmed on-site', 'Pay after - card, e-transfer or cash'].map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-[15px] font-semibold" style={{ color: CREAM }}>
                    <CheckCircle2 size={17} style={{ color: '#B5C9B0' }} aria-hidden /> {t}
                  </li>
                ))}
              </ul>
              <QuoteCta light className="w-full" />
            </div>
          </div>
        </section>

        {/* ───────── Why Stonegate + crew ───────── */}
        <section className="py-12 lg:py-16" style={{ backgroundColor: SAND }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 grid lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-12 items-center">
            <div className="relative aspect-[4/5] max-h-[560px] w-full rounded-3xl overflow-hidden" style={{ backgroundColor: LINE }}>
              <Image
                src="/about/photo-6.png"
                alt="Stonegate crew sitting on top of their junk removal truck"
                fill
                sizes="(max-width: 1024px) 100vw, 460px"
                className="object-cover"
                style={{ objectPosition: 'center 42%' }}
              />
            </div>
            <div>
              <Eyebrow>Why Stonegate</Eyebrow>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-7" style={{ color: INK }}>A local crew that shows up and gets it done.</h2>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                {why.map(({ Icon, title, text }) => (
                  <li key={title} className="flex gap-3.5">
                    <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}` }}>
                      <Icon size={19} style={{ color: GREEN }} aria-hidden />
                    </span>
                    <div>
                      <p className="font-extrabold mb-0.5" style={{ color: INK }}>{title}</p>
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
        <section className="py-12" style={{ borderTop: `1px solid ${LINE}`, backgroundColor: SAND }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <p className="flex items-center gap-2 text-sm font-bold mb-1" style={{ color: MUTED }}>
              <MapPin size={15} aria-hidden /> Same-day service area
            </p>
            <CityChips heading="Junk removal across Metro Vancouver" links={CITIES.map(c => ({ href: cityJunkHref(c), label: c.name }))} />
          </div>
        </section>

        {/* ───────── Final CTA ───────── */}
        <section style={{ backgroundColor: GREEN }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-6 py-14 lg:py-20 text-center">
            <div className="relative mx-auto w-[200px] sm:w-[240px] aspect-[3/2] mb-4">
              <Image src="/stonegate-mascot.png" alt="" fill sizes="240px" className="object-contain" />
            </div>
            <p className="flex items-center justify-center gap-2 mb-3 text-sm font-bold" style={{ color: '#B5C9B0' }}>
              <Clock size={15} aria-hidden /> Same-day pickups often available
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: CREAM }}>Ready to clear the clutter?</h2>
            <p className="text-base sm:text-lg mb-8" style={{ color: '#B5C9B0' }}>Request your free in-person estimate online in two minutes. We confirm the price on-site - no obligation.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <QuoteCta light />
              <CallCta light />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <StickyCallBar watchId="hero-cta" quoteHref={JUNK_BOOK_HREF} />
    </div>
  )
}
