import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'
import {
  Building2, Home, Package, MapPinned, Star, CheckCircle2, MessageCircleQuestion,
} from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'
import ReviewsRow from '@/components/landing/ReviewsRow'

export const metadata: Metadata = {
  title: { absolute: 'Moving Services in Metro Vancouver | Stonegate Moving Solutions' },
  description: 'Professional moving services across Metro Vancouver - apartments, houses, and small moves. 2 uniformed movers with a fully-equipped truck from $110/hr + GST.',
  alternates: { canonical: 'https://www.stonegatemoving.com/moving' },
}

const reviews = [
  {
    name: 'Fady Nasr',
    text: "Great experience with Stonegate. The team was professional, efficient, and careful with everything from start to finish. They showed up prepared, handled the move smoothly, and made the whole process much less stressful.",
  },
  {
    name: 'Aryan Kapoor',
    text: 'Really happy with the service. The guys were on time, worked quickly, and took good care of my stuff. The whole move went smoothly and they made the process a lot less stressful. Would definitely use them again!',
  },
  {
    name: 'Le Cao Huy',
    text: 'I had a fantastic experience with Stonegate Moving Solutions. The crew arrived on time, worked efficiently, and treated my furniture and boxes with care.',
  },
]

const faqs = [
  { q: 'How much does moving cost in Metro Vancouver?', a: 'Moving is $110/hr + GST for 2 professional movers and a fully-equipped truck, with a 3-hour minimum, no matter where in Metro Vancouver you\'re moving.' },
  { q: 'What\'s included in the hourly rate?', a: 'The truck, moving blankets, straps, dollies, and basic furniture disassembly/reassembly are all included - no separate vehicle or equipment fees.' },
  { q: 'Do you move outside Metro Vancouver?', a: 'Our standard service covers Metro Vancouver. If your move is further out, contact us directly and we\'ll let you know if we can help.' },
  { q: 'How do I book?', a: 'Request a free quote online and we\'ll confirm a date and time that works for you.' },
]

export default function MovingPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ minHeight: '400px' }}>
          <Image src="/hero-left.jpg" alt="" fill className="object-cover" priority style={{ objectPosition: 'center 40%' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,23,20,0.75) 0%, rgba(26,23,20,0.45) 45%, rgba(26,23,20,0.15) 75%)' }} />
          <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-20">
            <FadeIn>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6" style={{ color: '#FFFFFF' }}>
                Professional Moving Services in Metro Vancouver
              </h1>
              <p className="text-lg leading-relaxed max-w-xl mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
                A uniformed crew and a fully-equipped truck for apartment, house, and small moves - one flat hourly rate, no hidden fees.
              </p>
              <Link href="/order">
                <Button className="text-base py-6 px-8 rounded-full font-bold border-0" style={{ backgroundColor: '#FAF7F2', color: '#254220' }}>
                  Request Your Move
                </Button>
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* Service cards */}
        <section style={{ borderBottom: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <h2 className="text-3xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>Moving Services</h2>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Residential Moving', href: '#residential-moving', Icon: Home },
                { label: 'Apartment & Condo Moving', href: '#apartment-moving', Icon: Building2 },
                { label: 'Small Moves', href: '#small-moves', Icon: Package },
                { label: 'Commercial & Office Moving', href: '#commercial-moving', Icon: Building2 },
                { label: 'Long-Distance Moving', href: '#long-distance-moving', Icon: MapPinned },
              ].map(({ label, href, Icon }, i) => (
                <FadeIn key={label} delay={i * 60}>
                  <a href={href} className="group flex items-center gap-4 h-full rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ backgroundColor: '#F5F0EB', border: '1px solid #E8E0D5' }}>
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F0E6' }}>
                      <Icon size={20} style={{ color: '#254220' }} />
                    </span>
                    <p className="font-bold text-sm" style={{ color: '#1A1714' }}>{label}</p>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Residential Moving */}
        <section id="residential-moving" style={{ scrollMarginTop: '80px' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#014421' }}>Residential moving</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>House Moving</h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#6B5E54' }}>
                Full household moves handled by our own uniformed crew - no subcontractors. We wrap and protect furniture, disassemble what needs it, and get everything into the new place carefully.
              </p>
              <Link href="/order" className="inline-flex">
                <Button className="rounded-full font-bold border-0 px-7 py-5" style={{ backgroundColor: '#254220', color: '#FAF7F2' }}>Request Your Move</Button>
              </Link>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="relative rounded-3xl overflow-hidden" style={{ height: '320px' }}>
                <Image src="/crew-wrapping-furniture.jpg" alt="Stonegate crew wrapping and loading furniture for a house move" fill className="object-cover" style={{ objectPosition: 'center 45%' }} />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Apartment & Condo Moving */}
        <section id="apartment-moving" style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB', scrollMarginTop: '80px' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
            <FadeIn delay={100} className="md:order-2">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#014421' }}>Apartment & condo moving</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>Apartment & Condo Moving</h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#6B5E54' }}>
                Studios to multi-bedroom units, including elevator buildings and stairs. We know how to move quickly and carefully through tight hallways and shared spaces.
              </p>
              <Link href="/order" className="inline-flex">
                <Button className="rounded-full font-bold border-0 px-7 py-5" style={{ backgroundColor: '#254220', color: '#FAF7F2' }}>Request Your Move</Button>
              </Link>
            </FadeIn>
            <FadeIn className="md:order-1">
              <div className="relative rounded-3xl overflow-hidden" style={{ height: '320px' }}>
                <Image src="/crew-loading-ramp.jpg" alt="Stonegate crew loading a moving truck outside an apartment building" fill className="object-cover" style={{ objectPosition: 'center 40%' }} />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Small Moves */}
        <section id="small-moves" style={{ borderTop: '1px solid #E8E0D5', scrollMarginTop: '80px' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#014421' }}>Small moves</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>Small Moves</h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#6B5E54' }}>
                A single room, a studio, or just a few large pieces - our 3-hour minimum covers it. No move is too small to book.
              </p>
              <Link href="/order" className="inline-flex">
                <Button className="rounded-full font-bold border-0 px-7 py-5" style={{ backgroundColor: '#254220', color: '#FAF7F2' }}>Request Your Move</Button>
              </Link>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="relative rounded-3xl overflow-hidden" style={{ height: '320px' }}>
                <Image src="/burnaby/burnaby-move-truck-loaded.jpg" alt="Moving truck packed with boxes and furniture" fill className="object-cover" />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Commercial & Long-Distance - ask-us sections, not asserted as standard services */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 gap-6">
            <FadeIn>
              <div id="commercial-moving" className="h-full rounded-2xl p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', scrollMarginTop: '80px' }}>
                <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#E8F0E6' }}>
                  <Building2 size={20} style={{ color: '#254220' }} />
                </span>
                <h3 className="text-xl font-extrabold mb-2" style={{ color: '#1A1714' }}>Commercial & Office Moving</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B5E54' }}>
                  Have an office or commercial move in mind? Contact us directly with the details and we&apos;ll let you know if we&apos;re the right fit.
                </p>
                <a href="tel:+16043546479" className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: '#254220' }}>
                  <MessageCircleQuestion size={16} /> Ask About Your Move
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div id="long-distance-moving" className="h-full rounded-2xl p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', scrollMarginTop: '80px' }}>
                <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#E8F0E6' }}>
                  <MapPinned size={20} style={{ color: '#254220' }} />
                </span>
                <h3 className="text-xl font-extrabold mb-2" style={{ color: '#1A1714' }}>Long-Distance Moving</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B5E54' }}>
                  Moving outside Metro Vancouver? Get in touch with your route and timeline and we&apos;ll confirm whether we can take it on.
                </p>
                <a href="tel:+16043546479" className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: '#254220' }}>
                  <MessageCircleQuestion size={16} /> Ask About Your Move
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Why Stonegate + equipment */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#254220' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#B5C9B0' }}>Why Stonegate</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-6" style={{ color: '#FAF7F2' }}>Truck, Equipment & Crew - All Included</h2>
              <ul className="flex flex-col gap-3">
                {['Fully-equipped truck included in the hourly rate', 'Moving blankets, straps, and dollies on every job', 'Fully insured', 'Our own uniformed crew - no subcontractors', 'Transparent pricing, no hidden fees'].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#B5C9B0' }} />
                    <span className="text-sm font-medium" style={{ color: '#FAF7F2' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="relative rounded-3xl overflow-hidden" style={{ height: '340px' }}>
                <Image src="/truck.png" alt="Stonegate Moving Solutions truck" fill className="object-cover" style={{ objectPosition: 'center 45%' }} />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Pricing preview */}
        <section>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <FadeIn>
              <div className="rounded-3xl overflow-hidden flex flex-col sm:flex-row items-center gap-8 p-8 sm:p-10" style={{ background: 'linear-gradient(135deg, #1e3a1a 0%, #254220 60%, #2f5229 100%)' }}>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#B5C9B0' }}>Moving pricing</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-6xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>$110</span>
                    <span className="text-lg font-semibold mb-1" style={{ color: '#B5C9B0' }}>/hr + GST</span>
                  </div>
                  <p className="text-sm" style={{ color: '#B5C9B0' }}>2 movers, fully-equipped truck, 3-hour minimum.</p>
                </div>
                <Link href="/pricing" className="flex-shrink-0">
                  <Button className="rounded-full text-sm font-bold px-7 py-6 border-0" style={{ backgroundColor: '#FAF7F2', color: '#254220' }}>See Full Pricing</Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Reviews */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <div className="flex items-center gap-2 mb-10 justify-center">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => <Star key={i} size={18} fill="#D4A017" style={{ color: '#D4A017' }} />)}
                </div>
                <span className="text-sm font-semibold" style={{ color: '#1A1714' }}>5.0 from Google reviews</span>
              </div>
            </FadeIn>
            <ReviewsRow reviews={reviews} />
          </div>
        </section>

        {/* Service areas */}
        <section>
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <FadeIn>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>Moving Across Metro Vancouver</h2>
              <p className="text-base leading-relaxed max-w-xl mx-auto mb-8" style={{ color: '#6B5E54' }}>
                We&apos;re based in Burnaby and move households throughout Metro Vancouver.
              </p>
              <Link href="/locations" className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: '#254220' }}>
                <MapPinned size={16} /> See All Areas We Serve
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {faqs.map(({ q, a }, i) => (
                <FadeIn key={q} delay={i * 60}>
                  <p className="font-bold mb-2" style={{ color: '#1A1714' }}>{q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{a}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <FadeIn>
            <div className="max-w-6xl mx-auto px-6 py-20 text-center">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>Ready to Book Your Move?</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/order">
                  <Button className="text-base px-10 py-6 rounded-full font-bold border-0" style={{ backgroundColor: '#254220', color: '#FAF7F2' }}>Request Your Move</Button>
                </Link>
                <Link href="/junk-removal">
                  <Button className="text-base px-10 py-6 rounded-full font-bold" style={{ backgroundColor: 'transparent', color: '#254220', border: '2px solid #254220' }}>Need Junk Removal?</Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </section>

      </main>

      <Footer />
    </div>
  )
}
