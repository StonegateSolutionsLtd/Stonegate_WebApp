import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Truck, CheckCircle2, Lightbulb, ArrowRight } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import {
  JsonLd, Breadcrumbs, CallBand, FaqList, LinkGrid, CityChips, PricingTeaser,
} from '@/components/seo/SeoBlocks'
import { TEMPLATE_CITIES, CITY_BY_SLUG, CITIES, cityJobPhoto, cityHref, citySkyline } from '@/lib/seo/cities'
import CityBanner from '@/components/seo/CityBanner'
import { SITE_URL, MOVE_BOOK_HREF, providerLd, breadcrumbLd, faqLd, type Faq } from '@/lib/seo/site'

export const dynamicParams = false

const MOVING_SERVICES = [
  { href: '/moving#residential-moving', name: 'House Moving' },
  { href: '/moving#apartment-moving', name: 'Apartment & Condo Moving' },
  { href: '/moving#small-moves', name: 'Small Moves' },
  { href: '/moving#commercial-moving', name: 'Commercial & Office Moving' },
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
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
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
        <CityBanner city={city.name} slug={city.slug} style={citySkyline(city)} lead={city.lead} />
        <Breadcrumbs crumbs={crumbs} />

        {/* Intro */}
        <section>
          <div className="max-w-4xl mx-auto px-6 pt-10 pb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-6" style={{ color: '#1A1714' }}>
              The <span style={{ color: '#C98A45' }}>4.9-Star Rated</span> Moving Team in {city.name}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4" style={{ color: '#4A3F38' }}>
              <Link href="/about" className="font-bold underline" style={{ color: '#014421' }}>Stonegate Moving Solutions</Link> is a
              local, fully insured moving crew serving every city in Metro Vancouver. {city.name} homeowners, renters and businesses book us
              when they want a careful, on-time move at a clear hourly rate. We wrap your furniture, do all the lifting and set everything up in your new place.
            </p>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: '#4A3F38' }}>
              We handle <Link href="/moving#residential-moving" className="underline" style={{ color: '#014421' }}>house moves</Link>,{' '}
              <Link href="/moving#apartment-moving" className="underline" style={{ color: '#014421' }}>apartment and condo moves</Link>,{' '}
              <Link href="/moving#small-moves" className="underline" style={{ color: '#014421' }}>small moves</Link> and{' '}
              <Link href="/moving#commercial-moving" className="underline" style={{ color: '#014421' }}>office moves</Link>{' '}
              anywhere in {city.name}. See <Link href="/pricing/moving" className="underline" style={{ color: '#014421' }}>our moving prices</Link> or
              read more about <Link href="/moving" className="underline" style={{ color: '#014421' }}>our moving services</Link>.
            </p>
          </div>
        </section>

        {/* Moving */}
        <section id="moving" style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB', scrollMarginTop: '80px' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-5 gap-10 lg:gap-14">
            <div className="lg:col-span-3">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#A9743F' }}>
                <Truck size={14} aria-hidden /> Moving
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-5" style={{ color: '#1A1714' }}>Moving in {city.name}</h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#4A3F38' }}>{city.moving}</p>
              <h3 className="text-lg font-extrabold mb-4" style={{ color: '#1A1714' }}>Our moving services in {city.name}</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
                {MOVING_SERVICES.map(s => (
                  <li key={s.href}>
                    <Link href={s.href} className="flex items-center gap-2.5 text-sm font-bold hover:underline" style={{ color: '#014421' }}>
                      <CheckCircle2 size={16} className="shrink-0" style={{ color: '#254220' }} aria-hidden />
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/moving" className="inline-flex items-center gap-2 text-sm font-extrabold underline" style={{ color: '#014421' }}>
                See all moving services <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]" style={{ backgroundColor: '#E8E0D5' }}>
                <Image src={detail.src} alt={detail.alt} fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" style={{ objectPosition: detail.pos ?? 'center' }} />
              </div>
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
                <p className="flex items-center gap-2 font-extrabold mb-2" style={{ color: '#1A1714' }}>
                  <Lightbulb size={18} style={{ color: '#A9743F' }} aria-hidden /> {city.localTip.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{city.localTip.text}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Neighbourhoods + pricing */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-extrabold tracking-tight mb-3" style={{ color: '#1A1714' }}>{city.name} neighbourhoods we serve</h2>
            <p className="text-sm mb-6" style={{ color: '#6B5E54' }}>Moving across all of {city.name}, including:</p>
            <ul className="flex flex-wrap gap-2.5 mb-12">
              {city.neighbourhoods.map(n => (
                <li key={n} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', color: '#1A1714' }}>
                  <MapPin size={13} style={{ color: '#014421' }} aria-hidden /> {n}
                </li>
              ))}
            </ul>
            <PricingTeaser
              text={`2 movers and a truck from $120/hr + GST, or 3 movers with a 16' truck from $160/hr + GST, for moves in ${city.name}. 3-hour minimum, no hidden fees.`}
              href="/pricing/moving"
              label="See Moving Prices"
            />
          </div>
        </section>

        <FaqList faqs={faqs} heading={`${city.name} moving FAQ`} />

        <CallBand
          heading={`Moving in ${city.name}?`}
          text="Call now to check availability, or book your move online in a couple of minutes."
          bookHref={MOVE_BOOK_HREF}
          bookLabel="Book Your Move"
        />

        {/* Internal links */}
        <section style={{ backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-14">
            <LinkGrid
              eyebrow="Nearby"
              heading={`Also serving near ${city.name}`}
              links={nearby.map(n => ({ href: cityHref(n), label: `${n.name} Movers` }))}
            />
            <LinkGrid
              heading="Explore our services"
              cols={3}
              links={[
                { href: '/moving', label: 'Moving Services' },
                { href: '/moving#apartment-moving', label: 'Apartment & Condo Moving' },
                { href: '/moving#residential-moving', label: 'House Moving' },
                { href: '/moving#small-moves', label: 'Small Moves' },
                { href: '/pricing/moving', label: 'Moving Prices' },
                { href: '/locations', label: 'All Service Areas' },
              ]}
            />
            <CityChips heading="Movers in other Metro Vancouver cities" links={CITIES.filter(c => c.slug !== city.slug).map(c => ({ href: cityHref(c), label: c.name }))} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
