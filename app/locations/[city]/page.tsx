import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, CheckCircle2, Lightbulb, ArrowRight } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import FadeIn from '@/components/landing/FadeIn'
import ServicesCarousel from '@/components/landing/ServicesCarousel'
import StickyCallBar from '@/components/landing/StickyCallBar'
import { JsonLd, Breadcrumbs } from '@/components/seo/SeoBlocks'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import {
  MovingHero, MovingPriceBlock, MovingReviews, MovingFaq, MovingClose, CityPills,
  GREEN, INK, MUTED, CREAM, LINE, eyebrow, sectionWrap,
} from '@/components/moving/MovingSections'
import { TEMPLATE_CITIES, CITY_BY_SLUG, CITIES, cityJobPhoto, cityHeroPhoto, cityHref } from '@/lib/seo/cities'
import { movingServiceCards } from '@/lib/moving-services'
import { SITE_URL, MOVE_BOOK_HREF, providerLd, breadcrumbLd, faqLd, type Faq } from '@/lib/seo/site'

export const dynamicParams = false

const MOVING_SERVICES = [
  { href: '/residential-moving', name: 'Residential Moving' },
  { href: '/moving#apartment-moving', name: 'Apartment & Condo Moving' },
  { href: '/commercial-moving', name: 'Commercial Moving & Corporate Relocation' },
  { href: '/packing-services', name: 'Packing Services' },
  { href: '/moving#long-distance-moving', name: 'Long-Distance Moving' },
]

export function generateStaticParams() {
  return TEMPLATE_CITIES.map(c => ({ city: c.slug }))
}

export async function generateMetadata({ params }: PageProps<'/locations/[city]'>): Promise<Metadata> {
  const { city: slug } = await params
  const city = CITY_BY_SLUG.get(slug)
  if (!city || city.movingHref) return {}
  const url = `${SITE_URL}/locations/${slug}`
  return {
    title: { absolute: `${city.title} | Stonegate` },
    description: city.description,
    keywords: city.keywords,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: city.title, description: city.description, images: [{ url: '/stonegate-mascot.png', alt: `Stonegate movers in ${city.name}` }] },
  }
}

export default async function CityPage({ params }: PageProps<'/locations/[city]'>) {
  const { city: slug } = await params
  const city = CITY_BY_SLUG.get(slug)
  if (!city || city.movingHref) notFound()

  const detail = cityJobPhoto(city)
  const nearby = city.nearby.map(s => CITY_BY_SLUG.get(s)!).filter(Boolean)
  const faqs: Faq[] = [
    ...city.faqs,
    { q: `How much do movers cost in ${city.name}?`, a: `Moving is $120/hr + GST for 2 professional movers and a fully-equipped truck, or $160/hr + GST for 3 movers with a 16' truck, with a 3-hour minimum. We also charge a one-time flat-rate travel fee, explained to you ahead of time.` },
    { q: `How far ahead should I book my ${city.name} move?`, a: 'As early as you can, especially for weekends and the end of the month. Pick a day and time online to see what is available.' },
    { q: 'What is included in the hourly rate?', a: 'The movers, the truck, moving blankets, straps and dollies. We wrap your furniture, take apart what needs it and put it back together at your new place.' },
  ]
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Locations', href: '/locations' },
    { name: city.name, href: `/locations/${city.slug}` },
  ]

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: CREAM }}>
      <JsonLd graph={[
        {
          '@type': 'Service',
          name: `Moving Services in ${city.name}, BC`,
          serviceType: 'Moving',
          description: city.description,
          url: `${SITE_URL}/locations/${city.slug}`,
          provider: providerLd,
          areaServed: {
            '@type': 'City',
            name: city.name,
            containedInPlace: { '@type': 'AdministrativeArea', name: 'Metro Vancouver' },
          },
        },
        breadcrumbLd(crumbs),
        faqLd(faqs),
      ]} />
      <Navbar />

      <main className="flex-1">
        <MovingHero
          heading={[city.name, 'Movers']}
          divider={city.slug === 'vancouver' ? 'BRITISH COLUMBIA' : 'METRO VANCOUVER'}
          intro={city.lead}
          photo={cityHeroPhoto(city)}
        />
        <Breadcrumbs crumbs={crumbs} />

        {/* Moving in this city */}
        <section id="moving" style={{ backgroundColor: CREAM, scrollMarginTop: '80px' }}>
          <div className={`${sectionWrap} pt-10 pb-16 sm:pb-20 grid md:grid-cols-2 gap-12 items-center`}>
            <FadeIn className="order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden h-[420px] md:h-[600px]" style={{ backgroundColor: LINE }}>
                <Image src={detail.src} alt={detail.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" style={{ objectPosition: detail.pos ?? 'center' }} />
              </div>
            </FadeIn>
            <FadeIn delay={120} className="order-1 md:order-2">
              <div>
                <p className={eyebrow} style={{ color: GREEN }}>Moving in {city.name}</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5" style={{ color: INK }}>
                  The 4.9-Star Rated Moving Team in {city.name}
                </h2>
                <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: MUTED }}>{city.moving}</p>
                <ul className="flex flex-col gap-3.5 mb-9">
                  {MOVING_SERVICES.map(s => (
                    <li key={s.href}>
                      <Link href={s.href} className="flex items-center gap-3 font-bold text-lg hover:underline" style={{ color: INK }}>
                        <CheckCircle2 size={22} className="shrink-0" style={{ color: GREEN }} aria-hidden />
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={MOVE_BOOK_HREF} className="flex items-center justify-center gap-2 rounded-full min-h-[56px] px-7 font-extrabold transition-[transform,background-color] active:scale-[0.97] hover:bg-[#00341A]" style={{ backgroundColor: GREEN, color: CREAM }}>
                    Check Moving Availability <ArrowRight size={18} aria-hidden />
                  </Link>
                  <PhoneLink className="flex items-center justify-center gap-2 rounded-full min-h-[56px] px-6 font-bold border-2 border-[#014421] transition-[transform,background-color] active:scale-[0.97] hover:bg-[#E8F0E6]" style={{ color: GREEN, fontVariantNumeric: 'lining-nums tabular-nums' }}>
                    Call <PhoneNumber />
                  </PhoneLink>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Neighbourhoods and the local tip */}
        <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: '#F5F0EB' }}>
          <div className={`${sectionWrap} py-16 sm:py-20 grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start`}>
            <FadeIn>
              <p className={eyebrow} style={{ color: GREEN }}>Where we move</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>{city.name} Neighbourhoods We Serve</h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: MUTED }}>Moving across all of {city.name}, including:</p>
              <ul className="flex flex-wrap gap-2.5">
                {city.neighbourhoods.map(n => (
                  <li key={n} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}`, color: INK }}>
                    <MapPin size={13} style={{ color: GREEN }} aria-hidden /> {n}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="rounded-3xl p-7 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}` }}>
                <span className="w-11 h-11 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: '#F3E6D6' }}>
                  <Lightbulb size={20} style={{ color: '#A9743F' }} aria-hidden />
                </span>
                <p className={eyebrow} style={{ color: '#A9743F' }}>Local tip</p>
                <h3 className="text-xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>{city.localTip.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: MUTED }}>{city.localTip.text}</p>
              </div>
            </FadeIn>
          </div>
        </section>

        <div className="pt-16 sm:pt-20" style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }} />
        <MovingPriceBlock note={`2 movers and a truck from $120/hr + GST, or 3 movers with a 16' truck from $160/hr + GST, for moves in ${city.name}. 3-hour minimum, no hidden fees.`} />

        <MovingReviews />

        <MovingFaq heading={`${city.name} Moving FAQ`} faqs={faqs} />

        {/* Moving services */}
        <section className="pb-10 lg:pb-12" style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }}>
          <div className={`${sectionWrap} pt-12`}>
            <FadeIn>
              <p className={eyebrow} style={{ color: GREEN }}>Moving services</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-6" style={{ color: INK }}>How We Can Help in {city.name}</h2>
            </FadeIn>
          </div>
          <ServicesCarousel cards={movingServiceCards()} label="Moving services" />
        </section>

        {/* Nearby and other cities */}
        <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: '#F5F0EB' }}>
          <div className={`${sectionWrap} py-16 flex flex-col gap-12`}>
            {nearby.length > 0 && (
              <FadeIn>
                <p className={eyebrow} style={{ color: GREEN }}>Nearby</p>
                <h2 className="text-3xl font-extrabold tracking-tight mb-6" style={{ color: INK }}>Also Serving Near {city.name}</h2>
                <CityPills links={nearby.map(n => ({ href: cityHref(n), label: `${n.name} Movers` }))} />
              </FadeIn>
            )}
            <FadeIn>
              <p className={eyebrow} style={{ color: GREEN }}>Service areas</p>
              <h2 className="text-2xl font-extrabold tracking-tight mb-6" style={{ color: INK }}>Movers in Other Metro Vancouver Cities</h2>
              <CityPills links={CITIES.filter(c => c.slug !== city.slug).map(c => ({ href: cityHref(c), label: c.name }))} />
              <Link href="/locations" className="inline-flex items-center gap-2 mt-8 text-sm font-extrabold underline" style={{ color: GREEN }}>
                All service areas <ArrowRight size={14} aria-hidden />
              </Link>
            </FadeIn>
          </div>
        </section>

        <MovingClose heading={`Moving in ${city.name}?`} text="Pick a day and time online in a couple of minutes, or call and we will book it with you." />
      </main>

      <Footer />
      <StickyCallBar watchId="booking-start" quoteHref={MOVE_BOOK_HREF} quoteLabel="Book Your Move" />
    </div>
  )
}
