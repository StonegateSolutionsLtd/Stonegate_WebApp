import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'
import {
  Shield, DollarSign, Users, Truck, Star, CheckCircle2, Building2,
  Home, Package, MapPin, ArrowRight,
} from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'
import ReviewsRow from '@/components/landing/ReviewsRow'

export const metadata: Metadata = {
  title: { absolute: 'Burnaby Movers | Local Moving Company | Stonegate Moving Solutions' },
  description: 'Professional local movers in Burnaby, BC. 2 uniformed movers with a fully-equipped truck from $110/hr + GST. Transparent pricing, fully insured, no hidden fees.',
  alternates: { canonical: 'https://www.stonegatemoving.com/burnaby-movers' },
}

const services = [
  { label: 'Apartment & Condo Moving', desc: 'Studio to 3-bedroom moves across Burnaby high-rises and low-rises.', Icon: Building2 },
  { label: 'House Moving', desc: 'Full household moves, handled by our own uniformed crew.', Icon: Home },
  { label: 'Small Moves', desc: 'A few pieces of furniture or a single room - no move too small.', Icon: Package },
  { label: 'Local Moving', desc: 'Moving within Burnaby or across Metro Vancouver, flat hourly rate.', Icon: Truck },
]

const whyChoose = [
  { title: 'Transparent Pricing', desc: 'One flat hourly rate, quoted upfront. No fuel surcharge, no surprise fees.' },
  { title: 'Truck Included', desc: 'Our fully-equipped moving truck is part of the hourly rate, not billed separately.' },
  { title: 'Professional Equipment', desc: 'Moving blankets, straps, and dollies included on every job.' },
  { title: 'Fully Insured', desc: 'Every move is covered, so you can relax while we handle your belongings.' },
  { title: 'Professional Crew', desc: 'Our own uniformed team - no subcontractors, no surprises on moving day.' },
  { title: 'No Hidden Fees', desc: 'The rate we quote is the rate you pay, plus GST.' },
]

const areas = [
  'Metrotown', 'Brentwood', 'Burnaby Heights', 'Edmonds',
  'Lougheed', 'Deer Lake', 'Capitol Hill', 'Burnaby Mountain',
]

const jobs = [
  { src: '/burnaby/burnaby-move-apartment-boxes.jpg', alt: 'Stonegate mover carrying wrapped furniture down the truck ramp during a Burnaby apartment move', position: 'center' },
  { src: '/burnaby/burnaby-move-truck-night.jpg', alt: 'Stonegate Moving Solutions truck parked outside a Burnaby home', position: 'center 40%' },
  { src: '/burnaby/burnaby-move-truck-street.jpg', alt: 'Stonegate moving truck loaded with wrapped furniture on a Burnaby street', position: 'center' },
]

const reviews = [
  {
    name: 'Fady Nasr',
    text: "Great experience with Stonegate. The team was professional, efficient, and careful with everything from start to finish. They showed up prepared, handled the move smoothly, and made the whole process much less stressful. Communication was clear, the service felt reliable, and I'd definitely recommend them to anyone looking for movers.",
  },
  {
    name: 'Le Cao Huy',
    text: 'I had a fantastic experience with Stonegate Moving Solutions. The crew arrived on time, worked efficiently, and treated my furniture and boxes with care. They were friendly, professional, and made the entire moving process much easier than…',
  },
  {
    name: 'Amirali Nasrinpay',
    text: 'The stonegate solution is the best moving company in the whole of Vancouver. They came on time picked my items and safely put them to the other location i needed them to it. They have one of the strongest times in Vancouver, very respect…',
  },
  {
    name: 'Aryan Kapoor',
    text: 'Really happy with the service. The guys were on time, worked quickly, and took good care of my stuff. The whole move went smoothly and they made the process a lot less stressful. Would definitely use them again!',
  },
]

const faqs = [
  {
    q: 'How much do movers cost in Burnaby?',
    a: 'Moving is $110/hr + GST for 2 professional movers and a fully-equipped truck, with a 3-hour minimum. Since we\'re based in Burnaby, local jobs often work out more affordably too - see our full pricing breakdown for details.',
  },
  {
    q: 'Do you provide moving blankets and equipment?',
    a: 'Yes - moving blankets, straps, and dollies are included on every job at no extra cost, along with floor and door-frame protection.',
  },
  {
    q: 'Do you move apartments and condos?',
    a: 'Yes, apartment and condo moves are a big part of what we do across Burnaby, from studios to multi-bedroom units.',
  },
  {
    q: 'Do you handle small moves?',
    a: 'Yes. Our 3-hour minimum covers everything from a single room to a full apartment - there\'s no move too small to book.',
  },
  {
    q: 'What areas around Burnaby do you serve?',
    a: 'We regularly work in Metrotown, Brentwood, Burnaby Heights, Edmonds, Lougheed, Deer Lake, Capitol Hill, and Burnaby Mountain, plus the rest of Metro Vancouver.',
  },
  {
    q: 'Do you offer better rates for local Burnaby jobs?',
    a: 'Yes - since we\'re based in Burnaby, we can often offer more competitive pricing on jobs close to home, and additional savings when we have other bookings in your area. Ask us when you request a quote.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Moving Company',
  name: 'Burnaby Movers - Stonegate Moving Solutions',
  areaServed: {
    '@type': 'City',
    name: 'Burnaby',
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Metro Vancouver' },
  },
  provider: {
    '@type': 'MovingCompany',
    name: 'Stonegate Moving Solutions',
    telephone: '+16043546479',
    email: 'orders@stonegatemoving.com',
    url: 'https://www.stonegatemoving.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Burnaby', addressRegion: 'BC', addressCountry: 'CA' },
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'CAD',
    price: '110',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '110',
      priceCurrency: 'CAD',
      unitText: 'HOUR',
    },
  },
}

export default function BurnabyMoversPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <FadeIn>
                <span
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6 border rounded-full px-4 py-1.5"
                  style={{ color: '#254220', borderColor: '#B5C9B0' }}
                >
                  <MapPin size={13} /> Based in Burnaby
                </span>
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6" style={{ color: '#1A1714' }}>
                  Professional Movers in <span style={{ color: '#254220' }}>Burnaby, BC</span>
                </h1>
                <p className="text-lg leading-relaxed max-w-lg mb-8" style={{ color: '#6B5E54' }}>
                  A local, uniformed moving crew with a fully-equipped truck - based right here in Burnaby and serving all of Metro Vancouver. Transparent hourly pricing, no hidden fees.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link href="/order">
                    <Button className="text-base py-6 px-8 rounded-full font-bold border-0" style={{ backgroundColor: '#254220', color: '#FAF7F2' }}>
                      Request Your Move →
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {([
                    { Icon: Star, label: '5.0 Google Rating' },
                    { Icon: Shield, label: 'Fully Insured' },
                    { Icon: DollarSign, label: 'Transparent Pricing' },
                    { Icon: Users, label: 'Local Crew' },
                  ] as const).map(({ Icon, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Icon size={15} style={{ color: '#254220' }} />
                      <span className="text-xs font-bold" style={{ color: '#1A1714' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={150}>
              <div
                className="relative mx-auto lg:mx-0 rounded-3xl overflow-hidden"
                style={{ aspectRatio: '1125 / 2000', height: 'clamp(440px, 65vh, 760px)', width: 'auto', maxWidth: '100%', backgroundColor: '#F5F0EB' }}
              >
                <Image
                  src="/burnaby/burnaby-movers-hero.jpg"
                  alt="Stonegate Moving Solutions truck loaded with a wardrobe box and moving boxes during a Burnaby move"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Local Burnaby Moving Company */}
        <section style={{ borderTop: '1px solid #E8E0D5', borderBottom: '1px solid #E8E0D5' }}>
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#014421' }}>Local Burnaby moving company</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5" style={{ color: '#1A1714' }}>
                A Moving Company That Actually Lives Here
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#6B5E54' }}>
                Stonegate Moving Solutions is based in Burnaby, and it shows in how we work - we know the buildings, the elevator booking windows, and the fastest routes around town. We also serve the rest of Metro Vancouver, but Burnaby is home base, which means quicker scheduling and local know-how on every job.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Moving Services */}
        <section>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>What we do</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>Moving Services in Burnaby</h2>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map(({ label, desc, Icon }, i) => (
                <FadeIn key={label} delay={i * 80}>
                  <div className="h-full rounded-2xl p-6" style={{ backgroundColor: '#F5F0EB', border: '1px solid #E8E0D5' }}>
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#E8F0E6' }}>
                      <Icon size={20} style={{ color: '#254220' }} />
                    </span>
                    <p className="font-bold text-sm mb-2" style={{ color: '#1A1714' }}>{label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9A8E83' }}>{desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Stonegate */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#254220' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#B5C9B0' }}>Why choose us</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-10" style={{ color: '#FAF7F2' }}>Why Choose Stonegate</h2>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChoose.map((item, i) => (
                <FadeIn key={item.title} delay={i * 60}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#B5C9B0' }} />
                    <div>
                      <p className="font-bold text-sm mb-1" style={{ color: '#FAF7F2' }}>{item.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#B5C9B0' }}>{item.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Burnaby Areas We Serve */}
        <section>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>Coverage</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>Burnaby Areas We Serve</h2>
              <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: '#6B5E54' }}>
                From Metrotown high-rises to houses near Deer Lake, we move Burnaby residents across every neighbourhood, including:
              </p>
            </FadeIn>
            <div className="flex flex-wrap gap-3">
              {areas.map((area, i) => (
                <FadeIn key={area} delay={i * 40}>
                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-4 py-2"
                    style={{ backgroundColor: '#F5F0EB', border: '1px solid #E8E0D5', color: '#1A1714' }}
                  >
                    <MapPin size={13} style={{ color: '#254220' }} /> {area}
                  </span>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Real Moving Jobs */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>Real moves</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>Real Moving Jobs</h2>
            </FadeIn>
            <div className="grid sm:grid-cols-3 gap-4" style={{ gridAutoRows: '300px' }}>
              {jobs.map((job, i) => (
                <FadeIn key={job.src} delay={i * 80}>
                  <div className="relative rounded-2xl overflow-hidden h-full" style={{ border: '1px solid #E8E0D5' }}>
                    <Image src={job.src} alt={job.alt} fill className="object-cover" style={{ objectPosition: job.position }} />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#014421' }}>Reviews</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-4" style={{ color: '#1A1714' }}>What Our Customers Say</h2>
              <div className="flex items-center justify-center gap-2 mb-14">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={18} fill="#D4A017" style={{ color: '#D4A017' }} />
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: '#1A1714' }}>5.0 from Google reviews</span>
              </div>
            </FadeIn>
            <ReviewsRow reviews={reviews} />
            <div className="text-center">
              <a href="https://maps.app.goo.gl/ooQYs564eGP7JZbC6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Button className="text-base py-6 px-8 rounded-full font-bold border-0" style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
                  Read More Reviews on Google →
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Pricing summary */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <FadeIn>
              <div
                className="rounded-3xl overflow-hidden flex flex-col sm:flex-row items-center gap-8 p-8 sm:p-10"
                style={{ background: 'linear-gradient(135deg, #1e3a1a 0%, #254220 60%, #2f5229 100%)' }}
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#B5C9B0' }}>Moving pricing</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-6xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>$110</span>
                    <span className="text-lg font-semibold mb-1" style={{ color: '#B5C9B0' }}>/hr + GST</span>
                  </div>
                  <p className="text-sm" style={{ color: '#B5C9B0' }}>2 movers, fully-equipped truck, 3-hour minimum. No hidden fees.</p>
                </div>
                <Link href="/pricing" className="flex-shrink-0">
                  <Button className="rounded-full text-sm font-bold px-7 py-6 border-0" style={{ backgroundColor: '#FAF7F2', color: '#254220' }}>
                    See Full Pricing <ArrowRight size={15} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ borderTop: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-10" style={{ color: '#1A1714' }}>Common questions</p>
            </FadeIn>
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
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>
                Ready to Book Your Burnaby Move?
              </h2>
              <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: '#6B5E54' }}>
                Get a free quote in minutes - transparent pricing, no surprises.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/order">
                  <Button className="text-base px-10 py-6 rounded-full font-bold border-0" style={{ backgroundColor: '#254220', color: '#FAF7F2' }}>
                    Request Your Move
                  </Button>
                </Link>
                <Link href="/burnaby-junk-removal">
                  <Button className="text-base px-10 py-6 rounded-full font-bold" style={{ backgroundColor: 'transparent', color: '#254220', border: '2px solid #254220' }}>
                    Need Junk Removal Instead?
                  </Button>
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
