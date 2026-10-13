import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Recycle, Clock, ShieldCheck, Truck } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import {
  JsonLd, Breadcrumbs, CallButton, BookButton, CallBand, FaqList, LinkGrid, CityChips, PricingTeaser,
} from '@/components/seo/SeoBlocks'
import {
  JUNK_ITEMS, JUNK_ITEM_BY_SLUG, JUNK_CATEGORIES, junkItemHref, relatedItems, itemImages, categoryOf, itemsInCategory,
} from '@/lib/seo/junk-items'
import { CITIES, cityJunkHref } from '@/lib/seo/cities'
import { SITE_URL, JUNK_BOOK_HREF, JUNK_RATE, providerLd, breadcrumbLd, faqLd, type Faq } from '@/lib/seo/site'

export const dynamicParams = false

export function generateStaticParams() {
  return JUNK_ITEMS.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: PageProps<'/junk-removal/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const item = JUNK_ITEM_BY_SLUG.get(slug)
  if (!item) return {}
  const url = `${SITE_URL}${junkItemHref(slug)}`
  const [hero] = itemImages(item)
  return {
    title: { absolute: `${item.title} | Stonegate` },
    description: item.description,
    keywords: item.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', url, title: item.title, description: item.description,
      images: [hero ? { url: hero.src, alt: hero.alt } : { url: '/truck.png', alt: 'Stonegate junk removal truck' }],
    },
  }
}

const sharedFaqs = (name: string): Faq[] => [
  { q: `Do you offer same-day ${name.toLowerCase()}?`, a: 'Often, yes. Same-day and next-day pickups are available across Metro Vancouver depending on the schedule. Call us for today\'s availability.' },
  { q: 'How is the price calculated?', a: `Junk removal starts at ${JUNK_RATE} and is priced by the size of your load. The final price depends on how much there is, how heavy it is and how easy it is to reach. We estimate from your photos or description, then confirm the final price on-site before we start.` },
]

const steps = [
  { Icon: Clock, title: 'Book or call', text: 'Pick a 2-hour arrival window online or by phone. No deposit.' },
  { Icon: ShieldCheck, title: 'Price confirmed on site', text: 'We see the items, give you the price, and only start when you say go.' },
  { Icon: Truck, title: 'We lift & haul', text: 'Two-person crew carries everything out from any room or floor.' },
  { Icon: Recycle, title: 'Donate & recycle', text: 'Usable items donated, materials recycled, landfill last.' },
]

export default async function JunkItemPage({ params }: PageProps<'/junk-removal/[slug]'>) {
  const { slug } = await params
  const item = JUNK_ITEM_BY_SLUG.get(slug)
  if (!item) notFound()

  const category = categoryOf(item.category)
  const [hero, detail] = itemImages(item)
  const related = relatedItems(item, 8)
  const faqs = [...item.faqs, ...sharedFaqs(item.name)]
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Junk Removal', href: '/junk-removal' },
    { name: 'What We Take', href: '/junk-removal/what-we-take' },
    { name: item.name, href: junkItemHref(item.slug) },
  ]
  const otherCategories = JUNK_CATEGORIES.filter(c => c.id !== item.category)
    .map(c => itemsInCategory(c.id)[0])
    .filter(i => !related.includes(i))

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <JsonLd graph={[
        {
          '@type': 'Service',
          name: `${item.name} - Metro Vancouver`,
          serviceType: item.name,
          description: item.description,
          url: `${SITE_URL}${junkItemHref(item.slug)}`,
          provider: providerLd,
          areaServed: CITIES.map(c => ({ '@type': 'City', name: c.name })),
        },
        breadcrumbLd(crumbs),
        faqLd(faqs),
      ]} />
      <Navbar />

      <main className="flex-1">
        <Breadcrumbs crumbs={crumbs} />

        {/* Hero */}
        <section>
          <div className={`max-w-6xl mx-auto px-6 pt-8 pb-14 ${hero ? 'grid lg:grid-cols-2 gap-10 lg:gap-14 items-center' : ''}`}>
            <div className={hero ? '' : 'max-w-3xl'}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#A9743F' }}>
                {category.name} · Junk Removal
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-5" style={{ color: '#1A1714' }}>
                {item.h1}
              </h1>
              <p className="text-lg leading-relaxed mb-8" style={{ color: '#4A3F38' }}>{item.lead}</p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <CallButton big />
                <BookButton href={JUNK_BOOK_HREF} label="Book Online" />
              </div>
              <p className="text-sm font-semibold" style={{ color: '#6B5E54' }}>
                From {JUNK_RATE} · Same-day available · Fully insured · We do all the lifting
              </p>
            </div>
            {hero && (
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]" style={{ backgroundColor: '#E8E0D5' }}>
                <Image
                  src={hero.src}
                  alt={hero.alt}
                  fill
                  preload
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                  style={{ objectPosition: hero.pos ?? 'center' }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Description + what we take */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-5 gap-10 lg:gap-14">
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-extrabold tracking-tight mb-6" style={{ color: '#1A1714' }}>
                {item.name} done for you
              </h2>
              <div className="flex flex-col gap-4 mb-10">
                {item.body.map(p => (
                  <p key={p.slice(0, 32)} className="text-base leading-relaxed" style={{ color: '#4A3F38' }}>{p}</p>
                ))}
              </div>
              <h3 className="text-lg font-extrabold mb-4" style={{ color: '#1A1714' }}>What we take</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {item.takes.map(t => (
                  <li key={t} className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="shrink-0" style={{ color: '#254220' }} aria-hidden />
                    <span className="text-sm font-semibold" style={{ color: '#1A1714' }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className={detail && item.image3 ? 'grid grid-cols-2 gap-3' : ''}>
                {[detail, item.image3].filter(img => img != null).map(img => (
                  <div key={img.src} className="relative rounded-3xl overflow-hidden aspect-[4/5]" style={{ backgroundColor: '#E8E0D5' }}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes={item.image3 ? '(max-width: 1024px) 50vw, 210px' : '(max-width: 1024px) 100vw, 420px'}
                      className="object-cover"
                      style={{ objectPosition: img.pos ?? 'center' }}
                    />
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
                <p className="flex items-center gap-2 font-extrabold mb-2" style={{ color: '#1A1714' }}>
                  <Recycle size={18} style={{ color: '#254220' }} aria-hidden /> Where it goes
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{item.disposal}</p>
              </div>
            </div>
          </div>
        </section>

        {item.beforeAfter && (
          <section style={{ borderTop: '1px solid #E8E0D5' }}>
            <div className="max-w-6xl mx-auto px-6 py-16">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#A9743F' }}>Real results</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: '#1A1714' }}>Before &amp; after</h2>
              <p className="text-base mb-8" style={{ color: '#6B5E54' }}>{item.beforeAfter.caption}</p>
              <div className="grid grid-cols-2 rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E0D5' }}>
                {([['Before', item.beforeAfter.before, 'rgba(26,23,20,0.6)'], ['After', item.beforeAfter.after, '#A9743F']] as const).map(([label, img, bg]) => (
                  <div key={label} className="relative aspect-[3/4] sm:aspect-[4/5]">
                    <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1152px) 50vw, 576px" className="object-cover" style={{ objectPosition: img.pos ?? 'center' }} />
                    <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1" style={{ backgroundColor: bg, color: '#FFFFFF' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>How {item.name.toLowerCase()} works</h2>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ Icon, title, text }, i) => (
                <li key={title} className="flex flex-col gap-3">
                  <span className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold" style={{ backgroundColor: '#E8F0E6', color: '#254220' }}>{i + 1}</span>
                    <Icon size={18} style={{ color: '#A9743F' }} aria-hidden />
                  </span>
                  <p className="font-extrabold" style={{ color: '#1A1714' }}>{title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-12">
              <PricingTeaser text={`Free estimate for your ${item.name.toLowerCase()} from photos - final price confirmed on-site before we start. No hidden fees.`} />
            </div>
          </div>
        </section>

        <FaqList faqs={faqs} heading={`${item.name} FAQ`} />

        <CallBand
          heading={`Ready for ${item.name.toLowerCase()}?`}
          text="Call now for same-day availability, or book online in two minutes. We confirm the price on site - no obligation."
          bookHref={JUNK_BOOK_HREF}
          bookLabel="Book Junk Removal"
        />

        {/* Internal links */}
        <section style={{ backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-14">
            <LinkGrid
              eyebrow="Related services"
              heading="Other things we haul"
              links={related.map(r => ({ href: junkItemHref(r.slug), label: r.name }))}
            />
            <LinkGrid
              heading="More junk removal services"
              cols={3}
              links={[
                ...otherCategories.map(r => ({ href: junkItemHref(r.slug), label: r.name, sub: categoryOf(r.category).name })),
                { href: '/junk-removal/what-we-take', label: 'Everything We Take', sub: 'Full list of items' },
                { href: '/pricing/junk-removal', label: 'Junk Removal Pricing', sub: 'How estimates work' },
                { href: '/moving', label: 'Moving Services', sub: 'Moving and hauling in one job' },
              ]}
            />
            <CityChips
              heading={`${item.name} across Metro Vancouver`}
              links={CITIES.map(c => ({ href: cityJunkHref(c), label: c.name }))}
            />
            <p className="text-sm" style={{ color: '#6B5E54' }}>
              Back to <Link href="/junk-removal" className="font-bold underline" style={{ color: '#014421' }}>all junk removal services</Link>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
