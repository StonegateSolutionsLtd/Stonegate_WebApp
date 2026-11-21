import Image from 'next/image'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import GoogleLogo from '@/components/GoogleLogo'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import { CITIES, cityMovingHref } from '@/lib/seo/cities'
import { MOVING_REVIEWS, movingServiceCards } from '@/lib/moving-services'
import { CONTACT_EMAIL } from '@/lib/contact'
import ScrollRow from '@/components/landing/ScrollRow'

/**
 * The homepage below the hero, in the truck's brand: white as the main colour, Stonegate purple for the brand panels
 * and details, orange as the spark, and a bold geometric sans for headlines. Clean proportions: mostly white,
 * soft lavender cards, purple used where it matters. Everything shown is Stonegate's own: rates, inclusions,
 * real reviews, and drive times and travel fees per city.
 */

const headline = Montserrat({ subsets: ['latin'], weight: ['700', '800'] })
const display = `${headline.className} font-bold tracking-[-0.02em]`

const PURPLE = '#4B1D8F'
const PURPLE_DEEP = '#36146B'
const LAVENDER = '#EEE7FA'
const CARD = '#F6F2FC'
const PAGE = '#FFFFFF'
const WHITE = '#FFFFFF'
const INK = '#1E1530'
const MUTED = '#5F5870'
const ORANGE = '#F26B21'
const LINE = '#E6DFF0'
const wrap = 'max-w-6xl 3xl:max-w-7xl mx-auto px-5 sm:px-6 3xl:px-8'
const pill = 'inline-flex items-center justify-center gap-2 sg-btn min-h-[52px] px-7 text-[16px] font-bold'

function Stars({ size = 18 }: { size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"><path fill="#F5B301" d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
      ))}
    </span>
  )
}

/** A short centred intro: serif headline and one line under it */
function Intro({ title, text, light = false }: { title: React.ReactNode; text?: string; light?: boolean }) {
  return (
    <div className="max-w-[720px] mx-auto text-center mb-6 lg:mb-9">
      <h2 className={`${display} leading-[1.1]`} style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', color: light ? WHITE : INK }}>{title}</h2>
      {text && <p className="mt-2.5 text-[16px] sm:text-[17px] leading-relaxed" style={{ color: light ? 'rgba(255,255,255,0.8)' : MUTED }}>{text}</p>}
    </div>
  )
}

/* ---------- The crew: a green brand panel with a round crew seal ---------- */
function Crew() {
  return (
    <section style={{ backgroundColor: PAGE }}>
      <div className={`${wrap} pt-4 sm:pt-8 lg:pt-10 pb-6 lg:pb-8`}>
        <div className="relative overflow-hidden rounded-[28px] grid md:grid-cols-[0.85fr_1.15fr] items-stretch" style={{ backgroundColor: CARD, color: INK }}>
          {/* The crew, filling the left side of the panel */}
          <div className="relative order-2 md:order-1 aspect-[16/10] md:aspect-auto md:min-h-[360px]">
            <Image src="/junk/crew-4628-by-truck.jpg" alt="A Stonegate mover standing in front of the truck" fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" style={{ objectPosition: '58% 30%' }} />
          </div>
          <div className="order-1 md:order-2 px-6 sm:px-10 lg:px-12 pt-11 pb-7 md:py-10 self-center">
            <h2 className={`${display} leading-[1.1]`} style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)' }}>
              We handle the heavy lifting.
            </h2>
            <p className="mt-3 text-[15px] sm:text-[17px] leading-relaxed max-w-[52ch]" style={{ color: MUTED }}>
              From the first box to the last piece of furniture: we wrap and protect your furniture, take apart and put back together what needs it, and set everything up at your new place. Based in Burnaby, serving Metro Vancouver.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/order" className={`${pill} hover:bg-[#36146B]`} style={{ backgroundColor: PURPLE, color: WHITE }}>Get your free quote <ArrowRight size={18} aria-hidden /></Link>
              <Link href="/about" className={`${pill} border-2 hover:bg-white`} style={{ borderColor: PURPLE, color: PURPLE }}>Meet the crew</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- The price: two white cards, and what both include ---------- */
const included = ['Furniture protection', 'Disassembly & reassembly', 'Moving equipment', 'Insured for property damage']

function Price() {
  return (
    <section style={{ backgroundColor: PAGE }}>
      <div className={`${wrap} pt-4 pb-8 lg:pt-8 lg:pb-12`}>
        <Intro title={<>Straightforward moving rates.<br className="hidden sm:inline" /> No surprises.</>} text="You pay for the hours we work, plus GST and a travel fee you know before you book. 3-hour minimum." />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 max-w-[960px] mx-auto">
          {[
            { crew: '2 movers + truck', price: '$130', fit: 'Studios to 2-bedrooms', dark: false },
            { crew: '3 movers + truck', price: '$170', fit: 'Larger homes and offices', dark: true },
          ].map(t => (
            <div key={t.price} className="rounded-[22px] px-3 py-4 sm:px-8 sm:py-6 text-center" style={{ backgroundColor: t.dark ? PURPLE : CARD, color: t.dark ? WHITE : INK }}>
              <p className="text-[14px] sm:text-[17px] font-bold">{t.crew}</p>
              <p className={`${display} mt-2 leading-none`} style={{ fontSize: 'clamp(2.3rem, 5.5vw, 3.7rem)' }}>{t.price}<span className="text-[0.36em] font-semibold" style={{ opacity: 0.7 }}> /hr</span></p>
              <p className="mt-2 text-[13px] sm:text-[15px] leading-snug" style={{ opacity: 0.8 }}>{t.fit}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 max-w-[960px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-6">
          <p className="text-[15px] font-extrabold shrink-0 text-center" style={{ color: PURPLE }}>Both include</p>
          <ul className="w-fit mx-auto sm:mx-0 flex flex-col sm:flex-row gap-x-6 gap-y-1.5 text-[15px]" style={{ color: INK }}>
            {included.map(t => <li key={t} className="flex items-start gap-2.5 leading-snug"><span aria-hidden className="shrink-0 mt-[7px] w-2 h-2 rounded-full" style={{ backgroundColor: ORANGE }} />{t}</li>)}
          </ul>
        </div>
        {/* Owner-confirmed wording: CGL covers damage to property; there is no cargo insurance, so belongings are not claimed as covered */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/order" className={`${pill} hover:bg-[#36146B]`} style={{ backgroundColor: PURPLE, color: WHITE }}>Get your free quote <ArrowRight size={18} aria-hidden /></Link>
          <Link href="/pricing/moving" className="font-bold underline underline-offset-4 px-2 py-2" style={{ color: PURPLE }}>See how pricing works</Link>
        </div>
      </div>
    </section>
  )
}

/* ---------- How it works: a photo beside a white card that overlaps it ---------- */
const steps = [
  { title: 'Tell us about the move', text: 'Where from, where to and when. About 2 minutes online, or call us.' },
  { title: 'Get your price', text: 'Your hourly rate and travel fee, before you book.' },
  { title: 'We move you in', text: 'We wrap, load, drive and set up your furniture at the new place.' },
]

function Steps() {
  return (
    <section style={{ backgroundColor: PAGE }}>
      <div className={`${wrap} py-8 lg:py-14`}>
        <div className="grid lg:grid-cols-[1fr_1fr] items-center">
          <div className="relative aspect-[16/9] lg:aspect-[5/4] rounded-[28px] overflow-hidden" style={{ backgroundColor: LINE }}>
            <Image src="/crew-walking-truck.jpg" alt="A Stonegate mover walking with a dolly beside the moving truck" fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" style={{ objectPosition: 'center 55%' }} />
          </div>
          <div className="relative -mt-10 mx-3 lg:mt-0 lg:-ml-16 lg:mr-0 rounded-[24px] p-5 sm:p-8 lg:p-10" style={{ backgroundColor: CARD, boxShadow: '0 20px 50px -30px rgba(30,21,48,0.35)' }}>
            <h2 className={`${display} leading-[1.12]`} style={{ fontSize: 'clamp(1.45rem, 2.4vw, 2.1rem)', color: INK }}>Here&apos;s what happens after you request a quote.</h2>
            <ol className="mt-5 grid gap-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span aria-hidden className={`${display} shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[20px]`} style={{ backgroundColor: i === 2 ? PURPLE : LAVENDER, color: i === 2 ? WHITE : PURPLE }}>{i + 1}</span>
                  <div>
                    <h3 className="text-[17px] font-extrabold leading-snug" style={{ color: INK }}>{s.title}</h3>
                    <p className="mt-0.5 text-[15px] leading-relaxed" style={{ color: MUTED }}>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/order" className={`${pill} mt-6 border-2 hover:bg-[#4B1D8F] hover:text-white`} style={{ borderColor: PURPLE, color: PURPLE }}>Start with step one <ArrowRight size={18} aria-hidden /></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Reviews: white cards on the grey page, one featured in green ---------- */
function Reviews() {
  const featured = MOVING_REVIEWS.find(r => r.name === 'Fady Nasr') ?? MOVING_REVIEWS[0]
  const more = MOVING_REVIEWS.filter(r => ['Diana K', 'Chanvi Kotak'].includes(r.name))
  const initials = (n: string) => n.split(' ').map(w => w[0]).slice(0, 2).join('')
  return (
    <section style={{ backgroundColor: PAGE }}>
      <div className={`${wrap} py-8 lg:py-14`}>
        <Intro title="Rated 4.9 on Google." />
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
          <figure className="rounded-[24px] p-6 sm:p-8 flex flex-col" style={{ backgroundColor: PURPLE, color: WHITE }}>
            <Stars size={17} />
            <blockquote className="mt-4 text-[16px] sm:text-[19px] font-semibold leading-relaxed">&ldquo;{featured.text}&rdquo;</blockquote>
            <figcaption className="mt-auto pt-5 flex items-center gap-3 text-[15px] font-semibold">
              <span className="w-11 h-11 rounded-full flex items-center justify-center text-[15px] font-extrabold" style={{ backgroundColor: ORANGE, color: INK }}>{initials(featured.name)}</span>
              {featured.name} <span className="font-normal opacity-70">· Google review</span>
            </figcaption>
          </figure>
          <ul className="grid gap-3 sm:gap-5">
            {more.map(r => (
              <li key={r.name} className="rounded-[20px] p-5" style={{ backgroundColor: CARD }}>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-extrabold" style={{ backgroundColor: LAVENDER, color: PURPLE }}>{initials(r.name)}</span>
                  <span className="text-[16px] font-bold" style={{ color: INK }}>{r.name}</span>
                  <span className="ml-auto"><Stars size={14} /></span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: MUTED }}>&ldquo;{r.text}&rdquo;</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/reviews" className={`${pill} hover:bg-[#EEE7FA]`} style={{ color: PURPLE, backgroundColor: CARD }}>Read more reviews <ArrowRight size={16} aria-hidden /></Link>
          <a href="https://maps.app.goo.gl/ooQYs564eGP7JZbC6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold underline underline-offset-4 px-2 py-2" style={{ color: INK }}>
            <GoogleLogo size={16} /> On Google <ArrowUpRight size={15} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------- Services: little white cards, a photo and a name each ---------- */
function Services() {
  const services = movingServiceCards()
  return (
    <section style={{ backgroundColor: PAGE }}>
      <div className={`${wrap} py-8 lg:py-14`}>
        <Intro title="Moving services for homes, condos and offices." text="Homes, offices, long distance and the heavy, awkward things in between." />
        <p className="sm:hidden -mt-3 mb-3 text-center text-[13px] font-semibold" style={{ color: MUTED }}>Swipe to see all {services.length} services →</p>
        <ScrollRow label="Moving services">
          {services.map(s => (
            <li key={s.href} className="snap-start shrink-0 w-[64vw] max-w-[250px] sm:w-[260px] sm:max-w-none lg:w-[calc((100%-3rem)/4)]">
              <Link href={s.href} className="group h-full flex flex-col rounded-[22px] overflow-hidden bg-[#F6F2FC] transition-transform hover:-translate-y-0.5">
                <span className="relative block aspect-[4/3]" style={{ backgroundColor: LINE }}>
                  <Image src={s.image.src} alt="" fill sizes="(max-width: 640px) 64vw, 280px" className="object-cover" style={{ objectPosition: s.image.pos ?? 'center', filter: s.image.brightness ? `brightness(${s.image.brightness})` : undefined }} />
                </span>
                <span className="flex items-start gap-3 p-4 pb-5">
                  <span className="min-w-0">
                    <span className="block text-[18px] font-extrabold leading-snug" style={{ color: INK }}>{s.name}</span>
                    <span className="block mt-1 text-[14px] leading-snug line-clamp-3" style={{ color: MUTED }}>{s.text}</span>
                  </span>
                  <span className="ml-auto shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors group-hover:bg-[#4B1D8F] group-hover:text-white" style={{ backgroundColor: LAVENDER, color: PURPLE }}>
                    <ArrowRight size={17} aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ScrollRow>
        <p className="mt-6 text-center"><Link href="/pricing/moving" className="font-bold underline underline-offset-4" style={{ color: PURPLE }}>See moving prices</Link></p>
      </div>
    </section>
  )
}

/* ---------- Service areas: the main cities, then the full list on /locations ---------- */
const MAIN_CITIES = ['vancouver', 'burnaby', 'surrey', 'coquitlam', 'richmond', 'new-westminster']

function Areas() {
  const cities = MAIN_CITIES.map(slug => CITIES.find(c => c.slug === slug)).filter(c => c !== undefined)
  return (
    <section style={{ backgroundColor: PAGE }}>
      <div className={`${wrap} py-8 lg:py-14`}>
        <Intro title="Movers across Metro Vancouver." />
        <ul className="max-w-[760px] mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {cities.map(c => (
            <li key={c.slug}>
              <Link href={cityMovingHref(c)} className="flex items-center justify-between gap-2 rounded-[16px] px-4 py-3 text-[16px] font-bold transition-colors hover:bg-[#EEE7FA]" style={{ backgroundColor: CARD, color: INK }}>
                {c.name} <ArrowRight size={15} aria-hidden style={{ color: PURPLE }} />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-center"><Link href="/locations" className="inline-flex items-center gap-2 font-bold" style={{ color: PURPLE }}>View all service areas <ArrowRight size={16} aria-hidden /></Link></p>
      </div>
    </section>
  )
}

/** The house from the truck: a white house with its orange door open, at the end of an orange path */
function HouseMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden>
      <path d="M8 214 C 90 196, 150 226, 228 206 S 300 196, 316 200" fill="none" stroke={ORANGE} strokeWidth="14" strokeLinecap="round" />
      <path d="M150 196V110l70-58 70 58v86z" fill={WHITE} />
      <path d="M128 118l92-76 92 76" fill="none" stroke={WHITE} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="196" y="126" width="44" height="70" rx="4" fill={PURPLE_DEEP} />
      <path d="M196 126l30 8v70l-30-8z" fill={ORANGE} />
      <circle cx="220" cy="168" r="3.5" fill={WHITE} />
      <path d="M104 92l-16-12M112 70l-6-18M96 108l-20 0" stroke={ORANGE} strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}

/* ---------- Close: the truck's message on a purple panel ---------- */
function Close() {
  return (
    <section style={{ backgroundColor: PAGE }}>
      <div className={`${wrap} pt-6 pb-16 lg:pb-24`}>
        <div className="relative overflow-hidden rounded-[32px] px-7 sm:px-12 py-10 sm:py-14 grid md:grid-cols-[1.4fr_1fr] items-center gap-8" style={{ backgroundColor: PURPLE, color: WHITE }}>
          <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.75)' }}>Stonegate Moving Solutions</p>
            <h2 className={`${display} mt-3 leading-[1.04]`} style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>Open the gate to an <span style={{ color: ORANGE }}>easy move.</span></h2>
            <p className="mt-4 text-[18px] leading-relaxed max-w-[46ch]" style={{ color: 'rgba(255,255,255,0.85)' }}>Tell us what you&apos;re moving and when in about 2 minutes, or call and we will sort it out with you.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/order" className={`${pill} hover:bg-[#DD5A12]`} style={{ backgroundColor: ORANGE, color: WHITE }}>Get your free quote <ArrowRight size={18} aria-hidden /></Link>
              <PhoneLink className={`${pill} border-2 border-[rgba(255,255,255,0.6)] hover:bg-white/10`} style={{ color: WHITE, fontVariantNumeric: 'lining-nums tabular-nums' }}>
                Call <PhoneNumber />
              </PhoneLink>
            </div>
            <p className="mt-6 text-[15px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
              6 am to 10 pm, 7 days a week · <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">{CONTACT_EMAIL}</a>
            </p>
          </div>
          <HouseMark className="w-full max-w-[340px] justify-self-center md:justify-self-end" />
        </div>
      </div>
    </section>
  )
}

export default function HomeSections() {
  return (
    <>
      {/* Value before cost: who we are, what we do and what customers say come before the prices */}
      <Crew />
      <Services />
      <Reviews />
      <Price />
      <Steps />
      <Areas />
      <Close />
    </>
  )
}
