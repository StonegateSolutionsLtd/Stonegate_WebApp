import { Fragment } from 'react'
import Link from 'next/link'
import GoogleLogo from '@/components/GoogleLogo'
import { CITIES, cityMovingHref } from '@/lib/seo/cities'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Truck, Shield, DollarSign, Star, CalendarDays, MapPin, ClipboardList, ArrowRight, CheckCircle2 } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'
import ReviewsRow from '@/components/landing/ReviewsRow'
import ServicesCarousel from '@/components/landing/ServicesCarousel'
import { movingServiceCards } from '@/lib/moving-services'
import { PhoneLink } from '@/components/PhoneNumber'
import BookingStart from '@/components/moving/BookingStart'

const included = [
  { title: 'Furniture wrapped and protected', text: 'Moving blankets and straps on every piece, so it arrives the way it left.' },
  { title: 'Taken apart and put back together', text: 'Beds, tables and anything that won\'t fit through a door - reassembled in your new place.' },
  { title: 'Truck and equipment included', text: 'A fully-equipped truck, dollies and ramp come with the crew. Nothing extra to rent.' },
  { title: 'Clear hourly rate', text: '2 movers and a truck from $120/hr, or 3 movers with a 16\' truck from $160/hr, plus GST. 3-hour minimum.' },
]

const steps = [
  { number: '01', title: 'Book Your Move', description: 'Pick an available day and time online in minutes - no hidden fees, no stress.', Icon: CalendarDays },
  { number: '02', title: 'We Confirm the Details', description: 'We go over your move with you and give you a clear, upfront rate before moving day.', Icon: ClipboardList },
  { number: '03', title: 'We Move You In', description: 'Our crew arrives on time, wraps and loads your furniture, and sets it up in your new place.', Icon: Truck },
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


// Every moving service page
const serviceCards = movingServiceCards()

export default function Hero() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>

      <Navbar />

      <main className="flex-1">

        {/* Hero - full-screen video with text overlay */}
        <section className="relative flex items-start min-h-[calc(70vh-65px)] lg:min-h-[min(calc(96vh-65px),60vw)] 3xl:min-h-[max(min(calc(84vh-65px),900px),calc(34vw+110px))]" style={{ overflow: 'hidden' }}>

          {/* Full-screen image */}
          <div className="absolute inset-0 lg:bottom-[110px] overflow-hidden" style={{ backgroundColor: '#1A1714' }}>
            <Image
              src="/hero-truck-home-natural.jpg"
              alt="Stonegate Moving Solutions truck outside a home"
              fill
              priority
              quality={90}
              sizes="(max-width: 1024px) 200vw, 100vw"
              className="object-cover object-[42%_center] lg:object-[60%_75%]"
              style={{ filter: 'brightness(0.95)' }}
            />
          </div>

          {/* Left-side darkening gradient */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.79) 18%, rgba(0,0,0,0.7) 32%, rgba(0,0,0,0.56) 44%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.12) 75%, rgba(0,0,0,0.04) 84%, transparent 92%)' }} />

          {/* Text - left side, vertically centered */}
          <div className="relative z-20 self-stretch flex flex-col pl-8 pr-6 sm:pl-16 sm:pr-16 lg:pl-24 lg:pr-0 pt-12 pb-16 lg:pt-16 lg:pb-[140px] max-w-[680px] lg:max-w-[1040px] 3xl:pl-[max(4rem,calc((100vw-2200px)/2+4rem))] 3xl:max-w-none 3xl:pt-32 3xl:pb-[150px]">
            <div className="flex flex-col flex-1">
              <h1 className="flex flex-col font-extrabold uppercase tracking-tight leading-none mb-3 lg:mb-4 w-fit 3xl:[--hero-h1-max:5.4rem]" style={{ fontSize: 'clamp(2.05rem, 7.3vw, var(--hero-h1-max, 4.55rem))' }}>
                <span className="[text-shadow:0_3px_8px_rgba(0,0,0,0.45)]" style={{ color: '#FFFFFF' }}>Moving</span>
                <span className="flex items-center gap-3" style={{ fontSize: 'clamp(0.8rem, 2.4vw, 1.35rem)', margin: '0.3em 0', letterSpacing: '0.35em' }}>
                  <span style={{ flex: 0.3, height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.35))' }} />
                  <span className="font-extrabold [text-shadow:0_1px_6px_rgba(0,0,0,0.85)]" style={{ color: '#FFFFFF', flexShrink: 0 }}>MADE</span>
                  <span style={{ flex: 1.7, height: '1.5px', background: 'linear-gradient(to right, rgba(255,255,255,0.35), transparent)' }} />
                </span>
                <span className="[text-shadow:0_3px_8px_rgba(0,0,0,0.45)]" style={{ color: '#C98A45', whiteSpace: 'nowrap', fontSize: '1.15em' }}>Effortless</span>
              </h1>
              <p className="sm:hidden text-[17px] font-medium leading-snug mb-3 [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.6)]" style={{ color: '#FFFFFF' }}>
                Local movers across Metro Vancouver.<br />
                You pick the day, we do the lifting.
              </p>
              <p className="hidden sm:block text-[21px] font-medium leading-snug mb-4 lg:mb-6 3xl:text-[25px] [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.6)]" style={{ color: '#FFFFFF' }}>
                Local movers across Metro Vancouver.<br />
                You pick the day - we wrap, carry and set it all up.
              </p>

              {/* Start a booking: two addresses and Next, with the phone number under it (pushed lower in the photo on phones) */}
              <div className="mt-auto pt-8 mb-6 sm:mt-1 sm:pt-0 sm:mb-4 lg:mb-6 lg:mt-2">
                <BookingStart />
              </div>

              {/* Trust badges */}
              <div className="flex flex-row flex-wrap gap-x-6 gap-y-2 mb-3 sm:mt-auto sm:pt-2 lg:gap-y-3 lg:mb-3">
                {([
                  { Icon: Shield, label: 'Fully Insured' },
                  { Icon: GoogleLogo, label: '4.9-Star Rated' },
                  { Icon: DollarSign, label: 'No Hidden Fees' },
                ] as const).map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon size={14} style={{ color: '#FFFFFF', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,1)) drop-shadow(0 2px 6px rgba(0,0,0,0.8))' }} />
                    <span className="text-xs 3xl:text-sm font-semibold [text-shadow:0_1px_3px_rgba(0,0,0,1),0_2px_8px_rgba(0,0,0,0.85)]" style={{ color: '#FFFFFF' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Serving area */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-1 lg:mt-3">
                <div className="flex items-center gap-2 shrink-0">
                  <MapPin size={13} style={{ color: '#FFFFFF', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,1)) drop-shadow(0 2px 6px rgba(0,0,0,0.8))' }} />
                  <span className="text-[11px] 3xl:text-xs font-semibold uppercase tracking-widest [text-shadow:0_1px_3px_rgba(0,0,0,1),0_2px_8px_rgba(0,0,0,0.85)]" style={{ color: 'rgba(255,255,255,0.8)' }}>Serving Metro Vancouver</span>
                </div>
                <div className="hidden sm:flex flex-wrap items-center gap-y-1">
                  {['Vancouver', 'Burnaby', 'Richmond', 'Surrey', 'Coquitlam', 'North Vancouver', 'West Vancouver', '& More'].map((city, i, arr) => (
                    <span key={city} className="flex items-center whitespace-nowrap">
                      <span className="text-sm 3xl:text-base font-medium px-3 [text-shadow:0_1px_3px_rgba(0,0,0,1),0_2px_6px_rgba(0,0,0,0.8)]" style={{ color: 'rgba(255,255,255,0.95)' }}>{city}</span>
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
          <div className="max-w-6xl 3xl:max-w-7xl mx-auto px-6 3xl:px-8 pt-10 sm:pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
            <FadeIn className="order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden h-[380px] 3xl:h-[440px]">
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
                <h2 className="text-3xl sm:text-4xl 3xl:text-5xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>
                  Professional and Fast<br />Every Time.
                </h2>
                <p className="text-base 3xl:text-lg leading-relaxed" style={{ color: '#6B5E54' }}>
                  A friendly, careful crew that shows up on time and ready to work, from the first box to the last piece of furniture. Based right here in Metro Vancouver.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* What every move includes */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
          <div className="max-w-6xl 3xl:max-w-7xl mx-auto px-6 3xl:px-8 py-16 grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#014421' }}>Every move includes</p>
                <h2 className="text-3xl sm:text-4xl 3xl:text-5xl font-extrabold tracking-tight mb-8" style={{ color: '#1A1714' }}>
                  Everything You Need for Moving Day
                </h2>
                <ul className="flex flex-col gap-5 mb-8">
                  {included.map(item => (
                    <li key={item.title} className="flex gap-3">
                      <CheckCircle2 size={22} className="shrink-0 mt-0.5" style={{ color: '#014421' }} aria-hidden />
                      <div>
                        <p className="font-bold 3xl:text-lg" style={{ color: '#1A1714' }}>{item.title}</p>
                        <p className="text-sm 3xl:text-base leading-relaxed" style={{ color: '#6B5E54' }}>{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href="/order">
                  <Button className="text-base py-6 px-8 rounded-full font-bold border-0" style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
                    Check Moving Availability →
                  </Button>
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="relative rounded-3xl overflow-hidden h-[420px] md:h-[560px] 3xl:h-[640px]">
                <Image
                  src="/crew-walking-truck.jpg"
                  alt="Stonegate mover walking with a dolly beside the moving truck"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: 'center 55%' }}
                />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* How it works */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
          <div className="max-w-6xl 3xl:max-w-7xl mx-auto px-6 3xl:px-8 pt-20 pb-20">
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
          <div className="max-w-6xl 3xl:max-w-7xl mx-auto px-6 3xl:px-8 py-16">
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
                <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#1A1714' }}><GoogleLogo size={16} /> 4.9 from Google reviews</span>
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
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white"><GoogleLogo size={14} /></span> Read More Reviews on Google →
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Our Services */}
        <section className="pb-10 lg:pb-12" style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
          <div className="max-w-6xl 3xl:max-w-7xl mx-auto px-6 3xl:px-8 pt-10 lg:pt-12">
            <FadeIn>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>What we do</p>
                  <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#1A1714' }}>Moving Services</h2>
                </div>
                <Link href="/pricing/moving">
                  <Button className="rounded-full font-bold border-0 px-6 py-5" style={{ backgroundColor: 'transparent', color: '#014421', border: '2px solid #014421' }}>
                    See Moving Prices →
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
          <ServicesCarousel cards={serviceCards} label="Moving services" />
        </section>

        {/* Service areas */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl 3xl:max-w-7xl mx-auto px-6 3xl:px-8 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>Service areas</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: '#1A1714' }}>Movers Across Metro Vancouver</h2>
              <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: '#6B5E54' }}>
                Local moves in every city. Pick yours to see local details.
              </p>
            </FadeIn>
            <ul className="flex flex-wrap gap-2.5">
              {CITIES.map(c => (
                <li key={c.slug}>
                  <Link href={cityMovingHref(c)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#E8F0E6]" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', color: '#1A1714' }}>
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

          <div className="max-w-6xl 3xl:max-w-7xl mx-auto px-6 3xl:px-8 py-16 grid sm:grid-cols-2 gap-12">
            <FadeIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#014421' }}>Contact us</p>
              <div className="flex flex-col gap-3">
                <a href="mailto:orders@stonegatemoving.com" className="font-semibold hover:opacity-60 transition-opacity" style={{ color: '#1A1714' }}>
                  orders@stonegatemoving.com
                </a>
                <PhoneLink className="font-semibold hover:opacity-60 transition-opacity" style={{ color: '#1A1714', fontVariantNumeric: 'lining-nums tabular-nums' }} />
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
