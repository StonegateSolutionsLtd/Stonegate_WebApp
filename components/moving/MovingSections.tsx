import Image, { getImageProps } from 'next/image'
import Link from 'next/link'
import GoogleLogo from '@/components/GoogleLogo'
import { Shield, Star, MapPin, ArrowRight, Phone, Plus, Check } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'
import ReviewsRow from '@/components/landing/ReviewsRow'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import { MOVE_BOOK_HREF } from '@/lib/seo/site'
import { MOVING_REVIEWS, type ServicePhoto } from '@/lib/moving-services'
import BookingStart from './BookingStart'
import GoogleStars from '@/components/GoogleStars'

export const GREEN = '#014421'
export const INK = '#1A1714'
export const MUTED = '#6B5E54'
export const CREAM = '#FAF7F2'
export const CLAY = '#C98A45'
export const LINE = '#E8E0D5'

export const eyebrow = 'text-xs font-bold uppercase tracking-widest mb-3'
export const sectionWrap = 'max-w-6xl 3xl:max-w-7xl mx-auto px-6 3xl:px-8'

/** The Stonegate mascot: thumbs up, holding an SG box; transparent PNG cut off at the waist */
export const MASCOT = '/moving/mascot.png'

const TIERS = [
  { crew: '2 movers + truck', price: '$130', fit: 'Studios, 1- and 2-bedroom apartments' },
  { crew: '3 movers + 16\' truck', price: '$170', fit: 'Anything bigger than a 2-bedroom apartment' },
]

const filterOf = (p: ServicePhoto) => (p.brightness ? `brightness(${p.brightness})` : 'none')

/** One <picture>: the phone photo, swapped for the desktop photo from lg (1024px) up, so only one is downloaded */
function HeroPicture({ photo, desktop }: { photo: ServicePhoto; desktop: ServicePhoto }) {
  // No preload link: it would fetch one of the two photos on every screen
  const common = { fill: true, loading: 'eager', fetchPriority: 'high', quality: 90, sizes: '100vw' } as const
  const { props: { srcSet: desktopSet } } = getImageProps({ ...common, src: desktop.src, alt: desktop.alt })
  const { props: { srcSet: phoneSet, ...img } } = getImageProps({ ...common, src: photo.src, alt: photo.alt })
  const vars = {
    '--pos': photo.pos ?? 'center', '--pos-lg': desktop.pos ?? 'center',
    '--filter': filterOf(photo), '--filter-lg': filterOf(desktop),
  } as React.CSSProperties
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktopSet} sizes="100vw" />
      <source srcSet={phoneSet} sizes="100vw" />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
      <img
        {...img}
        className="object-cover [object-position:var(--pos)] [filter:var(--filter)] lg:[object-position:var(--pos-lg)] lg:[filter:var(--filter-lg)]"
        style={{ ...img.style, ...vars, objectPosition: undefined }}
      />
    </picture>
  )
}

/** Photo hero with the stacked headline, then the two-address booking start */
export function MovingHero({ heading, divider = 'METRO VANCOUVER', intro, photo, desktopPhoto }: {
  /** White line, then the orange line under the divider */
  heading: [string, string]
  divider?: string
  intro: string
  photo: ServicePhoto
  /** A different photo from the lg breakpoint up; phones keep `photo` */
  desktopPhoto?: ServicePhoto
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: INK }}>
        {desktopPhoto ? (
          <HeroPicture photo={photo} desktop={desktopPhoto} />
        ) : (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: photo.pos ?? 'center', filter: photo.brightness ? `brightness(${photo.brightness})` : undefined }}
          />
        )}
        {/* Phones: only the upper left, behind the headline, is darkened; desktop fades from the left */}
        <div className="absolute inset-0 lg:hidden" style={{ background: 'radial-gradient(ellipse 130% 520px at 0% 0%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.68) 55%, rgba(0,0,0,0.45) 74%, rgba(0,0,0,0.15) 90%, transparent 100%)' }} />
        <div className="absolute inset-0 hidden lg:block" style={{ background: (desktopPhoto ?? photo).bright
          ? 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.74) 25%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.25) 58%, transparent 75%)'
          : 'linear-gradient(to right, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.55) 25%, rgba(0,0,0,0.34) 42%, rgba(0,0,0,0.14) 58%, transparent 75%)' }} />
      </div>

      <div className="relative max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center lg:min-h-[min(calc(88svh-68px),820px)] pt-10 pb-8 sm:pt-14 sm:pb-12 lg:py-16 short:min-h-0 short:py-9">
        <div className="flex flex-col w-full">
          <GoogleStars className="mb-4 lg:mb-5 short:mb-3" />
          <h1 className="flex flex-col font-extrabold uppercase tracking-tight leading-none mb-4 w-fit" style={{ fontSize: 'clamp(2.1rem, min(7.3vw, 7.5svh), 4.4rem)' }}>
            <span className="[text-shadow:0_3px_8px_rgba(0,0,0,0.45)]" style={{ color: '#FFFFFF' }}>{heading[0]}</span>
            <span className="flex items-center gap-3" style={{ fontSize: 'clamp(0.7rem, 1.6vw, 1rem)', margin: '0.45em 0', letterSpacing: '0.3em' }}>
              <span style={{ flex: 0.3, height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4))' }} />
              {/* Drawn from CSS so the decorative divider is not read as part of the H1 ("Residential Movers", not "Residential METRO VANCOUVER Movers") */}
              <span aria-hidden data-divider={divider} className="font-extrabold whitespace-nowrap [text-shadow:0_1px_6px_rgba(0,0,0,0.85)] before:content-[attr(data-divider)]" style={{ color: '#FFFFFF' }} />
              <span style={{ flex: 1.7, height: '1.5px', background: 'linear-gradient(to right, rgba(255,255,255,0.4), transparent)' }} />
            </span>
            <span className="[text-shadow:0_3px_8px_rgba(0,0,0,0.45)]" style={{ color: CLAY, fontSize: '1.15em' }}>{heading[1]}</span>
          </h1>
          <p className="text-[18px] sm:text-[21px] font-medium leading-snug max-w-[520px] mb-7 short:mb-5 short:text-[19px] [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.6)]" style={{ color: '#FFFFFF' }}>
            {intro}
          </p>
          {/* Lower in the photo on phones, then the badges under it */}
          <div className="mt-24 sm:mt-0">
            <BookingStart id="booking-start" />
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-7 sm:mt-8 short:mt-5">
            {([
              { Icon: Shield, label: 'Insured' },
              { Icon: GoogleLogo, label: '4.9-Star Rated' },
            ] as const).map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon size={15} style={{ color: '#FFFFFF', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,1))' }} aria-hidden />
                <span className="text-[13px] sm:text-sm font-semibold [text-shadow:0_1px_3px_rgba(0,0,0,1),0_2px_8px_rgba(0,0,0,0.85)]" style={{ color: '#FFFFFF' }}>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** Green price card with both crew tiers */
/** The hourly rates beside the note; with `quotePoints` (moves priced per job) those points show instead of the rates */
export function MovingPriceBlock({ note, quotePoints }: { note: string; quotePoints?: string[] }) {
  return (
    <section style={{ backgroundColor: CREAM }}>
      <div className={`${sectionWrap} pb-16 sm:pb-20`}>
        <FadeIn>
          <div className="rounded-3xl p-7 sm:p-10 lg:p-12 grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center" style={{ backgroundColor: GREEN }}>
            <div>
              <p className={eyebrow} style={{ color: '#B5C9B0' }}>{quotePoints ? 'Quoted for your move' : 'Clear hourly pricing'}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: CREAM }}>Know the Price Before You Book</h2>
              <p className="text-base leading-relaxed mb-7" style={{ color: '#B5C9B0' }}>{note}</p>
              {/* Buttons drop to their own rows rather than breaking their labels */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <Link href={MOVE_BOOK_HREF} className="flex items-center justify-center gap-2 rounded-full min-h-[56px] px-7 font-extrabold whitespace-nowrap transition-[transform,background-color] active:scale-[0.97] hover:bg-white" style={{ backgroundColor: CREAM, color: GREEN }}>
                  Request a Free Estimate <ArrowRight size={18} aria-hidden />
                </Link>
                <Link href="/pricing/moving" className="flex items-center justify-center rounded-full min-h-[56px] px-6 font-bold whitespace-nowrap transition-[transform,opacity] active:scale-[0.97] hover:opacity-80" style={{ color: CREAM, border: '2px solid rgba(250,247,242,0.6)' }}>
                  See All Moving Prices
                </Link>
              </div>
            </div>
            {quotePoints ? (
              <ul className="rounded-2xl p-6 sm:p-8 flex flex-col gap-4" style={{ backgroundColor: CREAM }}>
                {quotePoints.map(p => (
                  <li key={p} className="flex items-start gap-3 text-lg font-bold leading-snug" style={{ color: INK }}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: GREEN }}>
                      <Check size={15} strokeWidth={3} style={{ color: CREAM }} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {TIERS.map(t => (
                <li key={t.crew} className="rounded-2xl p-6" style={{ backgroundColor: CREAM }}>
                  <p className="font-bold" style={{ color: INK }}>{t.crew}</p>
                  <p className="mt-2 flex items-end gap-1.5">
                    <span className="text-5xl font-extrabold leading-none" style={{ color: GREEN }}>{t.price}</span>
                    <span className="text-base font-semibold mb-1" style={{ color: MUTED }}>/hr + GST</span>
                  </p>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>{t.fit}</p>
                </li>
              ))}
            </ul>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function MovingReviews() {
  return (
    <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }}>
      <div className={`${sectionWrap} py-16`}>
        <FadeIn>
          <p className={`${eyebrow} text-center`} style={{ color: GREEN }}>Reviews</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-4" style={{ color: INK }}>What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mb-14">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} size={18} fill="#D4A017" style={{ color: '#D4A017' }} aria-hidden />)}
            </div>
            <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: INK }}><GoogleLogo size={16} /> 4.9 from Google reviews</span>
          </div>
        </FadeIn>
        <ReviewsRow reviews={MOVING_REVIEWS} />
        <div className="text-center">
          <a href="https://maps.app.goo.gl/ooQYs564eGP7JZbC6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full min-h-[52px] px-8 font-bold transition-[transform,background-color] active:scale-[0.97] hover:bg-[#00341A]" style={{ backgroundColor: GREEN, color: CREAM }}>
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white"><GoogleLogo size={14} /></span> Read More Reviews on Google →
          </a>
        </div>
      </div>
    </section>
  )
}

/** Pill links to city pages */
export function CityPills({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {links.map(l => (
        <li key={l.href}>
          <Link href={l.href} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#E8F0E6]" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}`, color: INK }}>
            <MapPin size={13} style={{ color: GREEN }} aria-hidden /> {l.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** Questions, with the mascot beside them on desktop */
export function MovingFaq({ heading, faqs }: { heading: string; faqs: { q: string; a: string }[] }) {
  return (
    <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }}>
      <div className={`${sectionWrap} pt-16 grid lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16`}>
        <div className="flex flex-col">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>{heading}</h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: MUTED }}>Still have a question? Call us and we will walk you through it.</p>
          <PhoneLink className="self-start flex items-center gap-2 rounded-full min-h-[52px] px-6 font-bold border-2 border-[#014421] transition-[transform,background-color] active:scale-[0.97] hover:bg-[#E8F0E6]" style={{ color: GREEN, fontVariantNumeric: 'lining-nums tabular-nums' }}>
            <Phone size={16} fill="currentColor" aria-hidden /> Call <PhoneNumber />
          </PhoneLink>
        </div>
        <div className="flex flex-col pb-16">
          {faqs.map(f => (
            <details key={f.q} className="group py-5" style={{ borderBottom: `1px solid ${LINE}` }}>
              <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-bold text-lg" style={{ color: INK }}>
                {f.q}
                <Plus size={20} className="shrink-0 mt-0.5 transition-transform group-open:rotate-45" style={{ color: GREEN }} aria-hidden />
              </summary>
              <p className="mt-3 text-base leading-relaxed" style={{ color: MUTED }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Close: book or call, with the mascot standing on the band's bottom edge */
export function MovingClose({ heading, text }: { heading: string; text: string }) {
  return (
    <section style={{ backgroundColor: GREEN }}>
      <div className={`${sectionWrap} relative grid md:grid-cols-[1.3fr_1fr] items-end gap-4`}>
        <div className="py-14 md:py-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: CREAM }}>{heading}</h2>
          <p className="text-base leading-relaxed max-w-lg mb-8" style={{ color: '#B5C9B0' }}>{text}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={MOVE_BOOK_HREF} className="flex items-center justify-center gap-2 rounded-full min-h-[56px] px-7 font-extrabold transition-[transform,background-color] active:scale-[0.97] hover:bg-white" style={{ backgroundColor: CREAM, color: GREEN }}>
              Check Moving Availability <ArrowRight size={18} aria-hidden />
            </Link>
            <PhoneLink className="flex items-center justify-center gap-2 rounded-full min-h-[56px] px-6 font-bold border-2 border-[rgba(250,247,242,0.7)] transition-[transform,background-color] active:scale-[0.97] hover:bg-white/10" style={{ color: CREAM, fontVariantNumeric: 'lining-nums tabular-nums' }}>
              <Phone size={16} fill="currentColor" aria-hidden /> Call <PhoneNumber />
            </PhoneLink>
          </div>
        </div>
        <div className="relative justify-self-center md:justify-self-end w-[240px] sm:w-[300px] lg:w-[380px] aspect-square -mb-px">
          <Image src={MASCOT} alt="Stonegate mascot giving a thumbs up and holding a moving box" fill sizes="(max-width: 768px) 240px, 380px" className="object-contain object-bottom" />
        </div>
      </div>
    </section>
  )
}
