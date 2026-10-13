import { Fragment } from 'react'
import Link from 'next/link'
import { CITIES, cityHref } from '@/lib/seo/cities'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Trash2, Truck, Shield, DollarSign, Star, CalendarDays, MapPin, ClipboardList, ArrowRight } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'
import ReviewsRow from '@/components/landing/ReviewsRow'
import BeforeAfterCarousel from '@/components/landing/BeforeAfterCarousel'

const beforeAfterPairs = [
  { label: 'Warehouse cleanout', before: '/junk-before-warehouse.jpg', after: '/junk-after-warehouse.jpg', afterObjectPosition: 'center' },
  { label: 'House exterior', before: '/junk-before-siding.jpg', after: '/junk-after-siding.jpg', afterObjectPosition: 'center' },
  { label: 'Fence line', before: '/junk-before-fence.jpg', after: '/junk-after-fence-v2.jpg', afterObjectPosition: 'center 25%' },
]

const steps = [
  { number: '01', title: 'Book Your Move or Junk Removal', description: 'Pick an available day and time online in minutes - no hidden fees, no stress.', Icon: CalendarDays },
  { number: '02', title: 'Get a Free, No-Pressure Estimate', description: 'We\'ll confirm the details and give you a clear, upfront price before we start.', Icon: ClipboardList },
  { number: '03', title: 'We Show Up & Get It Done', description: 'Our uniformed crew arrives on time, handles the heavy lifting, and you relax.', Icon: Truck },
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
  {
    name: 'Aizhan Tabyldiyeva',
    text: 'Excellent junk removal service! The team was professional, punctual, and worked quickly. Their pricing was very fair and offered great value for the quality of service. They cleared everything out efficiently, and made the whole process easy and stress-free. Highly recommend!!',
  },
  {
    name: 'Albert Go',
    text: 'I had a great experience with Stonegate Moving Solutions for junk removal. They responded quickly, arrived on time, and cleared everything out much faster than I expected. The crew was friendly, professional, and handled everything…',
  },
  {
    name: 'Ksusha Martynova',
    text: "Needed some old furniture and random junk hauled away, and these guys did an awesome job. They were courteous, worked fast, and had everything loaded up in no time. The price was better than I expected, especially for how much they took. I'll definitely be calling them again the next time I need junk removed.",
  },
]


export default function Hero() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>

      <Navbar />

      <main className="flex-1">

        {/* Hero - full-screen video with text overlay */}
        <section className="relative flex items-start min-h-[calc(70vh-65px)] lg:min-h-[calc(96vh-65px)]" style={{ overflow: 'hidden' }}>

          {/* Full-screen image */}
          <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#1A1714' }}>
            <Image
              src="/hero-truck-home-natural.jpg"
              alt="Stonegate Moving Solutions truck outside a home"
              fill
              priority
              quality={90}
              sizes="(max-width: 1024px) 200vw, 100vw"
              className="object-cover object-[42%_center] lg:object-[60%_center]"
              style={{ filter: 'brightness(0.95)' }}
            />
          </div>

          {/* Left-side darkening gradient */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.79) 18%, rgba(0,0,0,0.7) 32%, rgba(0,0,0,0.56) 44%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.12) 75%, rgba(0,0,0,0.04) 84%, transparent 92%)' }} />

          {/* Text - left side, vertically centered */}
          <div className="relative z-20 self-stretch flex flex-col pl-8 sm:pl-16 lg:pl-24 pt-12 pb-16 lg:pt-16 lg:pb-[140px] max-w-[680px] lg:max-w-[1040px]">
            <div className="flex flex-col flex-1">
              <h1 className="flex flex-col font-extrabold uppercase tracking-tight leading-none mb-3 lg:mb-4 w-fit" style={{ fontSize: 'clamp(2.05rem, 7.3vw, 4.55rem)' }}>
                <span className="block text-xs font-bold normal-case tracking-widest mb-3 lg:mb-5" style={{ color: '#FFFFFF' }}>
                  Metro Vancouver
                </span>
                <span className="[text-shadow:0_3px_8px_rgba(0,0,0,0.45)]" style={{ color: '#FFFFFF' }}>Moving</span>
                <span className="flex items-center gap-3" style={{ fontSize: 'clamp(0.65rem, 2vw, 1.1rem)', margin: '0.3em 0', letterSpacing: '0.35em' }}>
                  <span style={{ flex: 0.6, height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.35))' }} />
                  <span className="font-extrabold [text-shadow:0_1px_6px_rgba(0,0,0,0.85)]" style={{ color: '#FFFFFF', flexShrink: 0 }}>AND</span>
                  <span style={{ flex: 1.4, height: '1.5px', background: 'linear-gradient(to right, rgba(255,255,255,0.35), transparent)' }} />
                </span>
                <span className="[text-shadow:0_3px_8px_rgba(0,0,0,0.45)]" style={{ color: '#C98A45', whiteSpace: 'nowrap', fontSize: '1.15em' }}>Junk Removal</span>
              </h1>
              <p className="sm:hidden text-[18px] font-medium leading-tight mb-3 max-w-[320px] [text-shadow:0_0_2px_rgba(0,0,0,1),0_1px_3px_rgba(0,0,0,1),0_2px_10px_rgba(0,0,0,0.95),0_0_24px_rgba(0,0,0,0.7)]" style={{ color: '#FFFFFF' }}>
                Fast, reliable moving &amp; junk removal in Metro Vancouver.
              </p>
              <p className="hidden sm:block text-[22px] font-medium leading-tight mb-4 lg:mb-6 max-w-[320px] lg:max-w-[560px] [text-shadow:0_0_2px_rgba(0,0,0,1),0_1px_3px_rgba(0,0,0,1),0_2px_10px_rgba(0,0,0,0.95),0_0_24px_rgba(0,0,0,0.7)]" style={{ color: '#FFFFFF' }}>
                Professional moving and junk removal across Metro Vancouver. No hidden fees, no stress.
              </p>

              {/* Buttons - side by side */}
              <div className="flex flex-col sm:flex-row gap-4 mb-3 mt-1 lg:gap-3 lg:mb-6 lg:mt-2">
                <Link href="/book-service?type=junk-removal">
                  <Button className="text-[15px] py-3.5 px-5 lg:text-base lg:py-7 lg:px-5 rounded-full font-bold border-0 flex items-center gap-2 whitespace-nowrap" style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
                    <Trash2 size={16} /> Get a Junk Removal Quote →
                  </Button>
                </Link>
                <Link href="/order">
                  <Button className="text-[15px] py-3.5 px-5 lg:text-base lg:py-7 lg:px-5 rounded-full font-bold border-0 flex items-center gap-2 whitespace-nowrap" style={{ backgroundColor: '#FAF7F2', color: '#014421' }}>
                    <CalendarDays size={16} /> Check Moving Availability →
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-row flex-wrap gap-x-6 gap-y-2 mb-3 mt-auto pt-2 lg:gap-y-3 lg:mb-3">
                {([
                  { Icon: Shield, label: 'Fully Insured' },
                  { Icon: Star, label: '5-Star Rated' },
                  { Icon: DollarSign, label: 'No Hidden Fees' },
                ] as const).map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon size={14} style={{ color: '#FFFFFF', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,1)) drop-shadow(0 2px 6px rgba(0,0,0,0.8))' }} />
                    <span className="text-xs font-semibold [text-shadow:0_1px_3px_rgba(0,0,0,1),0_2px_8px_rgba(0,0,0,0.85)]" style={{ color: '#FFFFFF' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Serving area */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-1 lg:mt-3">
                <div className="flex items-center gap-2 shrink-0">
                  <MapPin size={13} style={{ color: '#FFFFFF', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,1)) drop-shadow(0 2px 6px rgba(0,0,0,0.8))' }} />
                  <span className="text-[11px] font-semibold uppercase tracking-widest [text-shadow:0_1px_3px_rgba(0,0,0,1),0_2px_8px_rgba(0,0,0,0.85)]" style={{ color: 'rgba(255,255,255,0.8)' }}>Serving Metro Vancouver</span>
                </div>
                <div className="hidden sm:flex flex-wrap items-center gap-y-1">
                  {['Vancouver', 'Burnaby', 'Richmond', 'Surrey', 'Coquitlam', 'North Vancouver', 'West Vancouver', '& More'].map((city, i, arr) => (
                    <span key={city} className="flex items-center whitespace-nowrap">
                      <span className="text-sm font-medium px-3 [text-shadow:0_1px_3px_rgba(0,0,0,1),0_2px_6px_rgba(0,0,0,0.8)]" style={{ color: 'rgba(255,255,255,0.95)' }}>{city}</span>
                      {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Solid cream strip - smooth transition into next section */}
          <div className="absolute bottom-0 inset-x-0 h-10 lg:h-[110px]" style={{ backgroundColor: '#FAF7F2' }} />

        </section>

        {/* Real Crew */}
        <section className="-mt-10 lg:-mt-[110px]" style={{ backgroundColor: '#FAF7F2', position: 'relative', zIndex: 10 }}>
          <div className="max-w-6xl mx-auto px-6 pt-10 sm:pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
            <FadeIn className="order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden" style={{ height: '380px' }}>
                <Image
                  src="/team-with-truck.jpg"
                  alt="The Stonegate Moving Solutions crew in front of their truck"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 60%' }}
                />
              </div>
            </FadeIn>
            <FadeIn delay={120} className="order-1 md:order-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#014421' }}>
                  Who shows up
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>
                  Professional and Fast<br />Every Time.
                </h2>
                <p className="text-base leading-relaxed" style={{ color: '#6B5E54' }}>
                  Every job is handled by our own uniformed team in our fully-equipped truck - no subcontractors, no surprises. Based right here in Metro Vancouver.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Before & After */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>Junk removal results</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>See The Difference</h2>
            </FadeIn>
            <FadeIn delay={60}>
              <BeforeAfterCarousel pairs={beforeAfterPairs} />
            </FadeIn>
          </div>
        </section>

        {/* How it works */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
          <div className="max-w-6xl mx-auto px-6 pt-20 pb-20">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#014421' }}>
                How it works
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-16" style={{ color: '#1A1714' }}>
                Simple. Transparent. Stress-Free.
              </h2>
            </FadeIn>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {steps.map((step, i) => (
                <Fragment key={step.number}>
                  <FadeIn delay={i * 120} style={{ flex: 1 }}>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <span className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0"
                          style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
                          {step.number}
                        </span>
                        <div className="w-24 h-24 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: '#EDE8E3' }}>
                          <step.Icon size={40} strokeWidth={1.5} style={{ color: '#014421' }} />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-lg mb-2" style={{ color: '#1A1714' }}>{step.title}</p>
                        <p className="text-base leading-relaxed" style={{ color: '#6B5E54' }}>{step.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                  {i < steps.length - 1 && (
                    <div className="hidden sm:flex items-center self-start shrink-0" style={{ paddingTop: '30px' }}>
                      <span style={{ color: 'rgba(0,0,0,0.18)', fontSize: '16px', letterSpacing: '3px' }}>——</span>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: '#014421' }}>
                Reviews
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-4" style={{ color: '#1A1714' }}>
                What Our Customers Say
              </h2>
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
              <a
                href="https://maps.app.goo.gl/ooQYs564eGP7JZbC6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Button className="text-base py-6 px-8 rounded-full font-bold border-0" style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
                  Read More Reviews on Google →
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Our Services */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>What we do</p>
                  <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#1A1714' }}>Our Services</h2>
                </div>
                <Link href="/pricing">
                  <Button className="rounded-full font-bold border-0 px-6 py-5" style={{ backgroundColor: 'transparent', color: '#014421', border: '2px solid #014421' }}>
                    Check Out Pricing →
                  </Button>
                </Link>
              </div>
            </FadeIn>
            <div className="grid sm:grid-cols-2 gap-6">

              {/* Moving card */}
              <FadeIn delay={0} className="flex flex-col">
              <div className="group rounded-2xl overflow-hidden flex flex-col h-full" style={{ border: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
                <div className="relative w-full overflow-hidden" style={{ height: '200px' }}>
                  <Image
                    src="/crew-wrapping-furniture.jpg"
                    alt="Stonegate crew wrapping and loading furniture into the truck"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: 'center 45%' }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#E8F0E6' }}>
                    <Truck size={18} style={{ color: '#014421' }} />
                  </span>
                  <p className="font-bold text-base mb-2" style={{ color: '#1A1714' }}>Moving</p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B5E54' }}>
                    Apartment and house moves across Metro Vancouver. 2 professional movers with a truck from $120/hr + GST.
                  </p>
                  <Link href="/order" className="mt-auto">
                    <Button className="w-full rounded-xl font-bold border-0 py-5" style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
                      Check Moving Availability
                    </Button>
                  </Link>
                </div>
              </div>
              </FadeIn>

              {/* Junk Removal card */}
              <FadeIn delay={120} className="flex flex-col">
              <div className="group rounded-2xl overflow-hidden flex flex-col h-full" style={{ border: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
                <div className="relative w-full overflow-hidden" style={{ height: '200px' }}>
                  <Image
                    src="/crew-loading-ramp.jpg"
                    alt="Stonegate crew loading the truck ramp"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: 'center 40%' }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#E8F0E6' }}>
                    <Trash2 size={18} style={{ color: '#014421' }} />
                  </span>
                  <p className="font-bold text-base mb-2" style={{ color: '#1A1714' }}>Junk Removal</p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B5E54' }}>
                    Furniture, appliances, estate and office cleanouts - hauled away responsibly across Metro Vancouver.
                  </p>
                  <Link href="/book-service?type=junk-removal" className="mt-auto">
                    <Button className="w-full rounded-xl font-bold border-0 py-5" style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
                      Get a Free Junk Removal Quote
                    </Button>
                  </Link>
                </div>
              </div>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* Service areas */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>Service areas</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: '#1A1714' }}>Junk Removal Across Metro Vancouver</h2>
              <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: '#6B5E54' }}>
                Same-day and next-day junk removal in every city. Pick yours to see local details.
              </p>
            </FadeIn>
            <ul className="flex flex-wrap gap-2.5">
              {CITIES.map(c => (
                <li key={c.slug}>
                  <Link href={cityHref(c)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#E8F0E6]" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', color: '#1A1714' }}>
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/locations" className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold" style={{ color: '#014421' }}>
                  All areas <ArrowRight size={14} />
                </Link>
              </li>
            </ul>
          </div>
        </section>

        {/* Contact & Service Area */}
        <section className="relative" style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>

          <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 gap-12">
            <FadeIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#014421' }}>Contact us</p>
              <div className="flex flex-col gap-3">
                <a href="mailto:orders@stonegatemoving.com" className="font-semibold hover:opacity-60 transition-opacity" style={{ color: '#1A1714' }}>
                  orders@stonegatemoving.com
                </a>
                <a href="tel:+16723360022" className="font-semibold hover:opacity-60 transition-opacity" style={{ color: '#1A1714', fontVariantNumeric: 'lining-nums tabular-nums' }}>
                  +1-672-336-0022
                </a>
              </div>
            </div>
            </FadeIn>
            <FadeIn delay={120}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#014421' }}>We operate in Metro Vancouver</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  'Vancouver', 'Burnaby', 'Richmond', 'Coquitlam',
                  'Surrey', 'New Westminster', 'Port Coquitlam', 'Port Moody',
                  'Delta', 'North Vancouver',
                ].map(city => (
                  <span key={city} className="text-sm font-medium" style={{ color: '#6B5E54' }}>{city}</span>
                ))}
              </div>
            </div>
            </FadeIn>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
