import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Trash2, CheckCircle2, Lightbulb, ArrowRight } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import {
  JsonLd, Breadcrumbs, CallBand, FaqList, LinkGrid, CityChips, PricingTeaser,
} from '@/components/seo/SeoBlocks'
import { TEMPLATE_CITIES, CITY_BY_SLUG, CITIES, cityJobPhoto, cityHref, citySkyline } from '@/lib/seo/cities'
import CityBanner from '@/components/seo/CityBanner'
import { JUNK_ITEM_BY_SLUG, POPULAR_JUNK_SLUGS, junkItemHref } from '@/lib/seo/junk-items'
import { SITE_URL, JUNK_BOOK_HREF, providerLd, breadcrumbLd, faqLd, type Faq } from '@/lib/seo/site'

export const dynamicParams = false

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
    openGraph: { type: 'website', url, title: city.title, description: city.description, images: [{ url: '/stonegate-mascot.png', alt: `Stonegate junk removal in ${city.name}` }] },
  }
}

export default async function CityPage({ params }: PageProps<'/locations/[city]'>) {
  const { city: slug } = await params
  const city = CITY_BY_SLUG.get(slug)
  if (!city || city.movingHref) notFound()

  const detail = cityJobPhoto(city)
  const popular = POPULAR_JUNK_SLUGS.map(s => JUNK_ITEM_BY_SLUG.get(s)!)
  const nearby = city.nearby.map(s => CITY_BY_SLUG.get(s)!).filter(Boolean)
  const faqs: Faq[] = [
    ...city.faqs,
    { q: `How much does junk removal cost in ${city.name}?`, a: `Junk removal is priced by the size of your load. The final price depends on how much there is, how heavy it is and how easy it is to reach. We estimate from your photos or description, then confirm the final price on-site before we start.` },
    { q: `Do you offer same-day junk removal in ${city.name}?`, a: `Often, yes. Same-day and next-day pickups are available across ${city.name} depending on the schedule. Call us for today's availability.` },
    { q: 'What can you take?', a: 'Almost anything non-hazardous: furniture, mattresses, appliances, electronics, hot tubs, yard waste, renovation debris and full cleanouts. We cannot take paint, chemicals, fuel or asbestos.' },
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
          name: `Junk Removal in ${city.name}, BC`,
          serviceType: 'Junk Removal',
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
              The <span style={{ color: '#C98A45' }}>4.9-Star Rated</span> Junk Removal Team in {city.name}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4" style={{ color: '#4A3F38' }}>
              <Link href="/about" className="font-bold underline" style={{ color: '#014421' }}>Stonegate Moving Solutions</Link> is a
              local, fully insured junk removal crew serving every city in Metro Vancouver. {city.name} homeowners, renters and businesses call us
              when they need junk hauled away - quickly, responsibly and at an upfront price. We do all the lifting, and we donate and recycle before anything goes to the landfill.
            </p>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: '#4A3F38' }}>
              We handle <Link href="/junk-removal/furniture-removal" className="underline" style={{ color: '#014421' }}>furniture removal</Link>,{' '}
              <Link href="/junk-removal/mattress-removal" className="underline" style={{ color: '#014421' }}>mattress removal</Link>,{' '}
              <Link href="/junk-removal/appliance-removal" className="underline" style={{ color: '#014421' }}>appliance removal</Link>,{' '}
              <Link href="/junk-removal/hot-tub-removal" className="underline" style={{ color: '#014421' }}>hot tub removal</Link>,{' '}
              <Link href="/junk-removal/garage-cleanout" className="underline" style={{ color: '#014421' }}>garage cleanouts</Link>,{' '}
              <Link href="/junk-removal/estate-cleanout" className="underline" style={{ color: '#014421' }}>estate cleanouts</Link> and{' '}
              <Link href="/junk-removal/construction-debris-removal" className="underline" style={{ color: '#014421' }}>construction debris removal</Link>{' '}
              anywhere in {city.name}. See <Link href="/pricing/junk-removal" className="underline" style={{ color: '#014421' }}>our pricing</Link> or
              browse <Link href="/junk-removal/what-we-take" className="underline" style={{ color: '#014421' }}>everything we take</Link>.
            </p>
          </div>
        </section>

        {/* Junk removal */}
        <section id="junk-removal" style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB', scrollMarginTop: '80px' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-5 gap-10 lg:gap-14">
            <div className="lg:col-span-3">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#A9743F' }}>
                <Trash2 size={14} aria-hidden /> Junk removal
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-5" style={{ color: '#1A1714' }}>What we haul in {city.name}</h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#4A3F38' }}>{city.junk}</p>
              <h3 className="text-lg font-extrabold mb-4" style={{ color: '#1A1714' }}>Popular {city.name} junk removal services</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
                {popular.map(i => (
                  <li key={i.slug}>
                    <Link href={junkItemHref(i.slug)} className="flex items-center gap-2.5 text-sm font-bold hover:underline" style={{ color: '#014421' }}>
                      <CheckCircle2 size={16} className="shrink-0" style={{ color: '#254220' }} aria-hidden />
                      {i.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/junk-removal/what-we-take" className="inline-flex items-center gap-2 text-sm font-extrabold underline" style={{ color: '#014421' }}>
                See everything we take <ArrowRight size={14} aria-hidden />
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
            <p className="text-sm mb-6" style={{ color: '#6B5E54' }}>Junk removal across all of {city.name}, including:</p>
            <ul className="flex flex-wrap gap-2.5 mb-12">
              {city.neighbourhoods.map(n => (
                <li key={n} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', color: '#1A1714' }}>
                  <MapPin size={13} style={{ color: '#014421' }} aria-hidden /> {n}
                </li>
              ))}
            </ul>
            <PricingTeaser text={`Free estimate for junk removal in ${city.name} from photos - final price confirmed on-site before we start. No hidden fees.`} />
          </div>
        </section>

        <FaqList faqs={faqs} heading={`${city.name} junk removal FAQ`} />

        <CallBand
          heading={`Need junk removal in ${city.name}?`}
          text="Call now for today's availability, or book online in a couple of minutes."
          bookHref={JUNK_BOOK_HREF}
          bookLabel="Book Junk Removal"
        />

        {/* Internal links */}
        <section style={{ backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-14">
            <LinkGrid
              eyebrow="Nearby"
              heading={`Also serving near ${city.name}`}
              links={nearby.map(n => ({ href: cityHref(n), label: `${n.name} Junk Removal` }))}
            />
            <LinkGrid
              heading="Explore our services"
              cols={3}
              links={[
                { href: '/junk-removal', label: 'Junk Removal Services' },
                { href: '/junk-removal/what-we-take', label: 'What We Take' },
                { href: '/pricing/junk-removal', label: 'Junk Removal Pricing' },
                { href: '/junk-removal/garage-cleanout', label: 'Garage Cleanouts' },
                { href: '/junk-removal/estate-cleanout', label: 'Estate Cleanouts' },
                { href: '/locations', label: 'All Service Areas' },
              ]}
            />
            <CityChips heading="Junk removal in other Metro Vancouver cities" links={CITIES.filter(c => c.slug !== city.slug).map(c => ({ href: cityHref(c), label: c.name }))} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
