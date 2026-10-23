import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Link from 'next/link'
import { Camera, ClipboardCheck, Truck, Wallet, CheckCircle2, Check, ChevronDown, Star } from 'lucide-react'
import PricingTabs from '@/components/seo/PricingTabs'
import TruckSlideshow from '@/components/seo/TruckSlideshow'
import { GoogleLogo } from '@/components/landing/JunkAdLanding'
import { GOOGLE_REVIEWS_URL } from '@/lib/seo/junk-proof'
import FadeIn from '@/components/landing/FadeIn'
import { JsonLd, Breadcrumbs, CallBand, FaqList, LinkGrid, CityChips, CallButton, BookButton } from '@/components/seo/SeoBlocks'
import { JUNK_ITEM_BY_SLUG, POPULAR_JUNK_SLUGS, junkItemHref } from '@/lib/seo/junk-items'
import { CITIES, cityHref } from '@/lib/seo/cities'
import { SITE_URL, JUNK_BOOK_HREF, providerLd, breadcrumbLd, faqLd } from '@/lib/seo/site'

export const metadata: Metadata = {
  title: { absolute: `Junk Removal Prices in Vancouver | Priced by Load | Stonegate` },
  description: `Junk removal in Metro Vancouver is priced by load size. Estimate from photos, price confirmed on-site before we start. Labour, loading and disposal included.`,
  keywords: ['junk removal cost Vancouver', 'junk removal prices', 'how much is junk removal', 'junk removal rates Metro Vancouver', 'junk pickup cost'],
  alternates: { canonical: `${SITE_URL}/pricing/junk-removal` },
}

// Truck bed: 16ft (L) x 7.5ft (W) x 6.5ft (H) = 780 ft³ full load
const TRUCK_CUBIC_FT = 16 * 7.5 * 6.5
const OUR_TRUCK_CUBIC_YD = Math.round(TRUCK_CUBIC_FT / 27)
const STANDARD_DUMP_TRUCK_CUBIC_YD = 12
const SIZE_MULTIPLIER = (OUR_TRUCK_CUBIC_YD / STANDARD_DUMP_TRUCK_CUBIC_YD).toFixed(1)

const steps = [
  { Icon: Camera, title: 'Tell us what is going', text: 'Send a few photos or a quick description when you book online or call. No obligation.' },
  { Icon: ClipboardCheck, title: 'Get your estimate', text: 'We estimate the size of your load and give you a price range up front.' },
  { Icon: Truck, title: 'Price confirmed on-site', text: 'Our crew sees everything in person and confirms the final price before any work starts.' },
  { Icon: Wallet, title: 'Pay when it is gone', text: 'We do all the lifting, loading and disposal. You pay after the job - e-transfer, card or cash.' },
]

const factors = [
  { title: 'How much there is', text: 'Your price is based on load size - a single couch costs far less than a full garage cleanout.' },
  { title: 'How heavy it is', text: 'Dense loads like concrete, soil, tile or several appliances take more effort and cost more to dispose of.' },
  { title: 'Access', text: 'Stairs, long carries, elevators and tight spaces can affect the final price.' },
  { title: 'Disposal', text: 'Some items need special drop-offs. Donation and recycling come first wherever possible.' },
]

const faqs = [
  { q: 'How much does junk removal cost in Vancouver?', a: `Junk removal is priced by the size of your load. Your final price depends on how much there is, how heavy it is and how easy it is to reach - we give you an estimate up front and confirm the price on-site before we start.` },
  { q: 'How do you estimate my price?', a: 'Send us photos or a description when you book. We estimate the size of your load from that, then our crew confirms the final price in person before any work begins.' },
  { q: 'Are there any extra fees?', a: 'No hidden fees. Labour, loading, the truck and disposal are part of the price we confirm with you on-site.' },
  { q: 'Do I pay before or after?', a: 'After. We confirm the price before we start, do the job, and collect payment once everything is gone. We accept e-transfer, credit card and cash.' },
  { q: 'What if I add more items on the day?', a: 'No problem - just show the crew. We will update the price before loading the extra items, so there are never surprises.' },
]

// Load sizes are shown as truck fractions only - no prices or minimums on the site
const loads = [
  {
    name: 'Small load',
    range: 'Up to 1/4 truck',
    image: '/junk/pricing/truck-small.jpg',
    loaded: '/junk/pricing/truck-small-loaded.jpg',
    volume: 'Up to ~195 ft³ (7 yd³)',
    lead: 'A smaller load is great for:',
    fits: ['A couch, a mattress and a few boxes', 'Clearing out a balcony or storage locker', 'Leftovers after a move-out', 'Making room for new furniture or appliances'],
  },
  {
    name: 'Medium load',
    range: '1/4 to 1/2 truck',
    image: '/junk/pricing/truck-medium.jpg',
    loaded: '/junk/pricing/truck-medium-loaded.jpg',
    volume: '~195 - 390 ft³ (7 - 14.5 yd³)',
    lead: 'A medium load is great for:',
    fits: ['Garage, basement or storage unit cleanouts', 'Old tools, shelving and sports gear', 'Clearing a small apartment or rental unit', 'Big furniture from two or three rooms'],
  },
  {
    name: 'Large load',
    range: '1/2 to a full truck',
    image: '/junk/pricing/truck-large.jpg',
    loaded: '/junk/pricing/truck-large-loaded.jpg',
    volume: '~390 - 780 ft³ (14.5 - 29 yd³)',
    lead: 'A large load is great for:',
    fits: ['Whole-home and estate cleanouts', 'Downsizing a 3-4 bedroom house', 'Renovation debris plus old furnishings', 'Several packed rooms in one trip'],
  },
]

const singleItems = [
  { label: 'Mattress or box spring', slug: 'mattress-removal' },
  { label: 'Couch, sectional or armchair', slug: 'couch-removal' },
  { label: 'Fridge, stove, washer or dryer', slug: 'appliance-removal' },
  { label: 'Dresser, table or desk', slug: 'dresser-removal' },
  { label: 'TV or computer monitor', slug: 'tv-removal' },
  { label: 'BBQ or treadmill', slug: 'bbq-removal' },
]

const included = ['Labour, loading and the truck', 'Disposal, donation and recycling drop-offs', 'Price confirmed on-site before any work starts', 'No hidden fees - pay after the job']

function IncludesBox({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-3xl p-6 sm:p-8 ${className}`} style={{ backgroundColor: '#E8F0E6' }}>
      <p className="text-lg font-extrabold mb-4" style={{ color: '#1A1714' }}>Every price includes</p>
      <ul className="grid sm:grid-cols-2 gap-3">
        {included.map(t => (
          <li key={t} className="flex items-start gap-3 text-[15px] font-semibold" style={{ color: '#1A1714' }}>
            <CheckCircle2 size={18} className="shrink-0 mt-px" style={{ color: '#254220' }} aria-hidden /> {t}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <CallButton />
        <BookButton href={JUNK_BOOK_HREF} label="Get My Price" />
      </div>
    </div>
  )
}

const crumbs = [
  { name: 'Home', href: '/' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Junk Removal Pricing', href: '/pricing/junk-removal' },
]

export default function JunkPricingPage() {
  const popular = POPULAR_JUNK_SLUGS.map(s => JUNK_ITEM_BY_SLUG.get(s)!)
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <JsonLd graph={[
        {
          '@type': 'Service',
          name: 'Junk Removal - Metro Vancouver',
          serviceType: 'Junk Removal',
          url: `${SITE_URL}/pricing/junk-removal`,
          provider: providerLd,
        },
        breadcrumbLd(crumbs),
        faqLd(faqs),
      ]} />
      <Navbar />

      <main className="flex-1">
        <Breadcrumbs crumbs={crumbs} />

        {/* Page header */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 text-center">
          <h1 className="text-[34px] sm:text-5xl font-extrabold tracking-tight leading-[1.08] mb-3" style={{ color: '#1A1714' }}>
            Simple, <span style={{ color: '#254220' }}>all-inclusive</span> pricing
          </h1>
          <p className="text-[17px] sm:text-lg leading-relaxed max-w-xl mx-auto mb-4" style={{ color: '#6B5E54' }}>
            Your price is based on how much space your items take up in our truck.
          </p>
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
            <span className="flex gap-0.5" aria-hidden>
              {[0, 1, 2, 3, 4].map(i => <Star key={i} size={17} fill="#E3A008" strokeWidth={0} />)}
            </span>
            <GoogleLogo size={16} />
            <span className="text-[15px] font-bold" style={{ color: '#1A1714' }}>4.9 rating on Google</span>
          </a>
        </section>

        {/* Multiple items (by volume) / single item */}
        <section className="max-w-3xl mx-auto w-full px-4 sm:px-6 pb-12 sm:pb-16">
          <PricingTabs
            multiple={
              <div className="pt-7">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3" style={{ color: '#1A1714' }}>Got multiple items? We price by volume.</h2>
                <p className="text-base sm:text-[17px] leading-relaxed mb-5" style={{ color: '#6B5E54' }}>
                  We price by how much of our 29 yd³ truck your items fill, in eighths of the truck. We estimate from your photos and confirm the price on-site before we start.
                </p>
                <div className="rounded-3xl overflow-hidden mb-8" style={{ border: '1px solid #E8E0D5' }}>
                  <TruckSlideshow empty="/junk/pricing/truck-1-8.jpg" loaded="/junk/pricing/truck-1-8-loaded.jpg" alt="Stonegate truck with 1/8 of the box filled - our pricing goes up in eighths of the truck" sizes="(min-width: 768px) 720px, 100vw" />
                </div>

                <p className="text-lg font-extrabold mb-3" style={{ color: '#1A1714' }}>Pick a load size to see what fits:</p>
                <div className="flex flex-col gap-3">
                  {loads.map((l, i) => (
                    <details key={l.name} open={i === 0} className="group rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #B5C9B0' }}>
                      <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 py-4 [&::-webkit-details-marker]:hidden">
                        <span className="text-[17px] font-extrabold" style={{ color: '#254220' }}>{l.name} <span className="font-semibold" style={{ color: '#6B5E54' }}>· {l.range}</span></span>
                        <ChevronDown size={20} className="shrink-0 transition-transform group-open:rotate-180" style={{ color: '#254220' }} aria-hidden />
                      </summary>
                      <div className="px-5 pb-6">
                        <TruckSlideshow empty={l.image} loaded={l.loaded} alt={`Stonegate truck showing a ${l.name.toLowerCase()} - ${l.range}`} sizes="(min-width: 768px) 680px, 100vw" className="rounded-2xl mb-4" />
                        <p className="text-sm mb-4" style={{ color: '#9A8E83' }}>{l.volume}</p>
                        <p className="font-extrabold mb-2.5" style={{ color: '#1A1714' }}>{l.lead}</p>
                        <ul className="flex flex-col gap-2.5">
                          {l.fits.map(t => (
                            <li key={t} className="flex items-start gap-3 text-[15px] leading-snug" style={{ color: '#3D3530' }}>
                              <Check size={19} strokeWidth={2.6} className="shrink-0 mt-px" style={{ color: '#4F8A3F' }} aria-hidden /> {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  ))}
                </div>
                <IncludesBox className="mt-10" />
              </div>
            }
            single={
              <div className="pt-7">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3" style={{ color: '#1A1714' }}>Just one item? We price it on its own.</h2>
                <p className="text-base sm:text-[17px] leading-relaxed mb-5" style={{ color: '#6B5E54' }}>
                  When there&apos;s only one piece to go, we price it by its size and weight - a dresser costs more than a microwave. <strong style={{ color: '#1A1714' }}>More than one item? We price by truck volume.</strong>
                </p>
                <IncludesBox className="mb-8" />
                <p className="font-extrabold mb-2.5" style={{ color: '#1A1714' }}>Single items we often pick up:</p>
                <ul className="flex flex-col gap-2">
                  {singleItems.map(i => (
                    <li key={i.slug}>
                      <Link href={junkItemHref(i.slug)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', color: '#1A1714' }}>
                        <Check size={18} strokeWidth={2.6} className="shrink-0" style={{ color: '#4F8A3F' }} aria-hidden /> {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
        </section>

        {/* What affects price */}
        <section className="max-w-3xl mx-auto w-full px-4 sm:px-6 pb-12">
          <div className="rounded-3xl p-6 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#254220' }}>What affects your price</p>
            <h2 className="text-2xl font-extrabold tracking-tight mb-6" style={{ color: '#1A1714' }}>Every job is a little different.</h2>
            <ul className="grid sm:grid-cols-2 gap-5">
              {factors.map(f => (
                <li key={f.title}>
                  <p className="font-bold mb-1" style={{ color: '#1A1714' }}>{f.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How the estimate works */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#254220' }}>How the estimate works</p>
            <h2 className="text-3xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>From photos to a confirmed price.</h2>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ Icon, title, text }, i) => (
                <li key={title} className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
                  <span className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold" style={{ backgroundColor: '#E8F0E6', color: '#254220' }}>{i + 1}</span>
                    <Icon size={18} style={{ color: '#254220' }} aria-hidden />
                  </span>
                  <p className="font-extrabold mb-2" style={{ color: '#1A1714' }}>{title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="pt-12" />
        {/* Truck size comparison */}
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <FadeIn>
            <div className="rounded-3xl overflow-hidden grid md:grid-cols-2 gap-8 items-center p-8 md:p-10" style={{ backgroundColor: '#F5F0EB', border: '1px solid #E8E0D5' }}>

              <div className="relative w-full" style={{ aspectRatio: '1536 / 1024' }}>
                <Image
                  src="/truck-dimensions.jpg"
                  alt="Stonegate truck dimensions: 16 feet long, 7.5 feet wide, 6.5 feet tall"
                  fill
                  className="object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#254220' }}>Why one trip clears more</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>
                  Our truck is {SIZE_MULTIPLIER}× bigger than a standard dump truck.
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B5E54' }}>
                  A full load with us means {TRUCK_CUBIC_FT} ft³ ({OUR_TRUCK_CUBIC_YD} cubic yards) hauled away in a single trip - not a fraction of it. More fits in one load, so bigger cleanouts leave in a single trip.
                </p>

                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5" style={{ color: '#1A1714' }}>
                      <span>Stonegate truck</span>
                      <span>{OUR_TRUCK_CUBIC_YD} cu yd</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E0D5' }}>
                      <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: '#254220' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5" style={{ color: '#9A8E83' }}>
                      <span>Standard dump truck</span>
                      <span>~{STANDARD_DUMP_TRUCK_CUBIC_YD} cu yd</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E0D5' }}>
                      <div className="h-full rounded-full" style={{ width: `${(Number(STANDARD_DUMP_TRUCK_CUBIC_YD) / Number(OUR_TRUCK_CUBIC_YD)) * 100}%`, backgroundColor: '#B5A99E' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </FadeIn>
        </section>

        <FaqList faqs={faqs} heading="Junk removal pricing FAQ" />

        <CallBand
          heading="Want an exact price?"
          text="Call or send photos and we will tell you which tier you are looking at. The final price is confirmed on-site - no obligation."
          bookHref={JUNK_BOOK_HREF}
          bookLabel="Get My Price"
        />

        <section style={{ backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-14">
            <LinkGrid
              eyebrow="Popular services"
              heading="What people book most"
              links={popular.map(i => ({ href: junkItemHref(i.slug), label: i.name }))}
            />
            <LinkGrid
              heading="More from Stonegate"
              cols={3}
              links={[
                { href: '/junk-removal', label: 'Junk Removal Services' },
                { href: '/junk-removal/what-we-take', label: 'Everything We Take' },
                { href: '/pricing/moving', label: 'Moving Prices' },
              ]}
            />
            <CityChips heading="Junk removal across Metro Vancouver" links={CITIES.map(c => ({ href: cityHref(c), label: c.name }))} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
