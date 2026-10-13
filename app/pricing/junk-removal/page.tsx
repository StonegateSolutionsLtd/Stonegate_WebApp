import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Camera, ClipboardCheck, Truck, Wallet, CheckCircle2 } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'
import { JsonLd, Breadcrumbs, CallBand, FaqList, LinkGrid, CityChips, CallButton, BookButton } from '@/components/seo/SeoBlocks'
import { JUNK_ITEM_BY_SLUG, POPULAR_JUNK_SLUGS, junkItemHref } from '@/lib/seo/junk-items'
import { CITIES, cityHref } from '@/lib/seo/cities'
import { SITE_URL, JUNK_BOOK_HREF, JUNK_RATE, providerLd, breadcrumbLd, faqLd } from '@/lib/seo/site'

export const metadata: Metadata = {
  title: { absolute: `Junk Removal Prices in Vancouver | From ${JUNK_RATE} | Stonegate` },
  description: `Junk removal in Metro Vancouver starts at ${JUNK_RATE}. Free estimate from photos, price confirmed on-site before we start. Labour, loading and disposal included.`,
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
  { q: 'How much does junk removal cost in Vancouver?', a: `Junk removal starts at ${JUNK_RATE} and is priced by the size of your load. Your final price depends on how much there is, how heavy it is and how easy it is to reach - we give you an estimate up front and confirm the price on-site before we start.` },
  { q: 'How do you estimate my price?', a: 'Send us photos or a description when you book. We estimate the size of your load from that, then our crew confirms the final price in person before any work begins.' },
  { q: 'Are there any extra fees?', a: 'No hidden fees. Labour, loading, the truck and disposal are part of the price we confirm with you on-site.' },
  { q: 'Do I pay before or after?', a: 'After. We confirm the price before we start, do the job, and collect payment once everything is gone. We accept e-transfer, credit card and cash.' },
  { q: 'What if I add more items on the day?', a: 'No problem - just show the crew. We will update the price before loading the extra items, so there are never surprises.' },
]

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
        <section className="max-w-6xl mx-auto px-6 pt-10 pb-12">
          <FadeIn>
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-6 border rounded-full px-4 py-1.5"
            style={{ color: '#254220', borderColor: '#B5C9B0' }}
          >
            Junk removal pricing
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6" style={{ color: '#1A1714' }}>
            Junk removal from <span style={{ color: '#254220' }}>{JUNK_RATE}.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-xl mb-8" style={{ color: '#6B5E54' }}>
            Upfront, honest pricing across Metro Vancouver. Free estimate from photos, final price confirmed in person before we lift a thing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <CallButton big />
            <BookButton href={JUNK_BOOK_HREF} label="Get a Free Estimate" />
          </div>
          </FadeIn>
        </section>

        {/* Rate card + what affects price */}
        <section className="max-w-6xl mx-auto px-6 pb-12 grid lg:grid-cols-2 gap-8 items-stretch">
          <FadeIn className="h-full">
            <div className="h-full rounded-3xl overflow-hidden flex flex-col" style={{ border: '1px solid #E8E0D5', boxShadow: '0 2px 12px rgba(37,66,32,0.06)' }}>
              <div className="relative overflow-hidden px-8 pt-10 pb-8" style={{ background: 'linear-gradient(135deg, #1e3a1a 0%, #254220 60%, #2f5229 100%)' }}>
                <Truck size={160} className="absolute -right-6 -top-6 opacity-[0.07]" style={{ color: '#FAF7F2' }} />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#B5C9B0' }}>Starting rate</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-6xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>$150</span>
                    <span className="text-xl font-semibold mb-1" style={{ color: '#B5C9B0' }}>and up</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#B5C9B0' }}>CAD · priced by the size of your load</span>
                </div>
              </div>
              <div className="flex-1 px-8 py-8" style={{ backgroundColor: '#F5F0EB' }}>
                <ul className="flex flex-col gap-3">
                  {['Labour, loading and the truck included', 'Disposal, donation and recycling drop-offs handled', 'Price confirmed on-site before any work starts', 'No hidden fees - pay after the job'].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#254220' }} />
                      <span className="text-sm font-medium" style={{ color: '#1A1714' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={100} className="h-full">
            <div className="h-full rounded-3xl p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#254220' }}>What affects your price</p>
              <h2 className="text-2xl font-extrabold tracking-tight mb-6" style={{ color: '#1A1714' }}>Every job is a little different.</h2>
              <ul className="flex flex-col gap-5">
                {factors.map(f => (
                  <li key={f.title}>
                    <p className="font-bold mb-1" style={{ color: '#1A1714' }}>{f.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{f.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
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
          bookLabel="Get a Free Quote"
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
