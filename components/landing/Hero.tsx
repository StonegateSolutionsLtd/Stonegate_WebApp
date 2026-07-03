import { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/landing/Navbar'
import HeroVideo from '@/components/landing/HeroVideo'
import { Droplets, Trash2, Truck, Shield, Clock, DollarSign, Star, CalendarDays, MapPin, ClipboardList } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'

const logoStyle = {
  filter: 'brightness(0)',
}

const steps = [
  { number: '01', title: 'Request Your Quote', description: 'Tell us about your move or junk removal. Get your free estimate in minutes.', Icon: ClipboardList },
  { number: '02', title: 'Schedule Your Move', description: 'Choose a time that works for you. We\'ll handle the rest.', Icon: CalendarDays },
  { number: '03', title: 'We Get The Job Done', description: 'Our professional team shows up on time and gets it done right. You relax, we carry the load.', Icon: Truck },
]


export default function Hero() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>

      <Navbar />

      <main className="flex-1">

        {/* Hero - full-screen video with text overlay */}
        <section className="relative" style={{ height: 'calc(100vh - 65px)', overflow: 'hidden' }}>

          {/* Full-screen video */}
          <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#1A1714' }}>
            <HeroVideo />
          </div>

          {/* Left-side darkening gradient */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.45) 20%, transparent 40%)' }} />

          {/* Text - left side, vertically centered */}
          <div className="relative z-10 h-full flex flex-col justify-center pl-8 sm:pl-16 lg:pl-52" style={{ maxWidth: '680px' }}>
            <div className="flex flex-col" style={{ marginTop: '-180px' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#FFFFFF' }}>
                Metro Vancouver
              </p>
              <h1 className="flex flex-col font-extrabold uppercase tracking-tight leading-none mb-6 w-fit" style={{ fontSize: 'clamp(2.25rem, 8vw, 5rem)' }}>
                <span style={{ color: '#FFFFFF' }}>Moving</span>
                <span className="flex items-center gap-3" style={{ fontSize: 'clamp(0.65rem, 2vw, 1.1rem)', margin: '0.6em 0', letterSpacing: '0.35em' }}>
                  <span style={{ flex: 0.6, height: '1.5px', backgroundColor: 'rgba(255,255,255,0.35)' }} />
                  <span className="font-extrabold" style={{ color: '#FFFFFF', flexShrink: 0 }}>AND</span>
                  <span style={{ flex: 1.4, height: '1.5px', backgroundColor: 'rgba(255,255,255,0.35)' }} />
                </span>
                <span style={{ color: '#FFFFFF', whiteSpace: 'nowrap' }}>Junk Removal</span>
              </h1>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '380px' }}>
                Professional moving and junk removal across Metro Vancouver. No hidden fees, no stress.
              </p>

              {/* Buttons - side by side */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/order">
                  <Button className="text-sm sm:text-base py-6 sm:py-7 rounded-full font-bold border-0 flex items-center gap-2 whitespace-nowrap" style={{ backgroundColor: '#014421', color: '#FAF7F2', paddingLeft: '20px', paddingRight: '20px' }}>
                    <CalendarDays size={15} /> Moving Quote →
                  </Button>
                </Link>
                <Link href="/book-service?type=junk-removal">
                  <Button className="text-sm sm:text-base py-6 sm:py-7 rounded-full font-bold border-0 flex items-center gap-2 whitespace-nowrap" style={{ backgroundColor: '#FAF7F2', color: '#014421', paddingLeft: '20px', paddingRight: '20px' }}>
                    <Trash2 size={15} /> Junk Removal Quote →
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-row flex-wrap gap-x-6 gap-y-3">
                {([
                  { Icon: Shield, label: 'Fully Insured' },
                  { Icon: Star, label: '5-Star Rated' },
                  { Icon: Clock, label: 'Same-Day Availability' },
                  { Icon: DollarSign, label: 'No Hidden Fees' },
                ] as const).map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon size={14} style={{ color: 'rgba(255,255,255,0.65)' }} />
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Serving area bar */}
          <div className="absolute inset-x-0 z-10 flex items-center justify-center gap-6 px-8" style={{ bottom: '200px', height: '60px' }}>
            <div className="flex items-center gap-2 shrink-0">
              <MapPin size={13} style={{ color: '#FFFFFF' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FFFFFF' }}>Serving Metro Vancouver</span>
            </div>
            <div className="hidden sm:flex items-center overflow-hidden">
              {['Vancouver', 'Burnaby', 'Richmond', 'Surrey', 'Coquitlam', 'North Vancouver', 'West Vancouver', '& More'].map((city, i, arr) => (
                <span key={city} className="flex items-center">
                  <span className="text-sm font-medium px-3" style={{ color: 'rgba(255,255,255,0.85)' }}>{city}</span>
                  {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.25)' }}>|</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Solid cream strip - covers watermark */}
          <div className="absolute bottom-0 inset-x-0" style={{ height: '200px', backgroundColor: '#FAF7F2' }} />

        </section>

        {/* How it works */}
        <section style={{ backgroundColor: '#FAF7F2', position: 'relative', zIndex: 10, marginTop: '-160px' }}>
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

        {/* Our Services */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>What we do</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>Our Services</h2>
            </FadeIn>
            <div className="grid sm:grid-cols-3 gap-6">

              {/* Moving card */}
              <FadeIn delay={0} className="flex flex-col">
              <div className="group rounded-2xl overflow-hidden flex flex-col h-full" style={{ border: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
                <div className="relative w-full overflow-hidden" style={{ height: '200px' }}>
                  <Image
                    src="/hero.jpg"
                    alt="Moving service"
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#E8F0E6' }}>
                    <Truck size={18} style={{ color: '#014421' }} />
                  </span>
                  <p className="font-bold text-base mb-2" style={{ color: '#1A1714' }}>Moving</p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B5E54' }}>
                    Apartment and house moves across Metro Vancouver. 2 professional movers with a truck from $73/hr.
                  </p>
                  <Link href="/order" className="mt-auto">
                    <Button className="w-full rounded-xl font-bold border-0 py-5" style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
                      Book a Move
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
                    src="/junk-removal.jpg"
                    alt="Junk removal service"
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
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
                      Book Junk Removal
                    </Button>
                  </Link>
                </div>
              </div>
              </FadeIn>

              {/* Bin Cleaning card */}
              <FadeIn delay={240} className="flex flex-col">
              <div className="group rounded-2xl overflow-hidden flex flex-col h-full" style={{ border: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
                <div className="relative w-full overflow-hidden" style={{ height: '200px' }}>
                  <Image
                    src="/bin-cleaning.jpg"
                    alt="Bin cleaning service"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: 'center 65%' }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#E8F0E6' }}>
                    <Droplets size={18} style={{ color: '#014421' }} />
                  </span>
                  <p className="font-bold text-base mb-2" style={{ color: '#1A1714' }}>Bin Cleaning</p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B5E54' }}>
                    High-pressure hot water washing with eco-safe disinfectants. Residential and commercial bins.
                  </p>
                  <Link href="/book-service?type=bin-cleaning" className="mt-auto">
                    <Button className="w-full rounded-xl font-bold border-0 py-5" style={{ backgroundColor: '#014421', color: '#FAF7F2' }}>
                      Book Bin Cleaning
                    </Button>
                  </Link>
                </div>
              </div>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* Contact & Service Area */}
        <section className="relative" style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>

          {/* Truck – desktop only, absolute right */}
          <div className="absolute bottom-0 hidden md:block pointer-events-none select-none" style={{ width: '440px', right: '140px' }}>
            <Image
              src="/truck-nobg.png"
              alt=""
              width={560}
              height={420}
              className="object-contain w-full"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>

          <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 gap-12">
            <FadeIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#014421' }}>Contact us</p>
              <div className="flex flex-col gap-3">
                <a href="mailto:orders@stonegatemoving.com" className="font-semibold hover:opacity-60 transition-opacity" style={{ color: '#1A1714' }}>
                  orders@stonegatemoving.com
                </a>
                <a href="tel:+16043546479" className="font-semibold hover:opacity-60 transition-opacity" style={{ color: '#1A1714', fontVariantNumeric: 'lining-nums tabular-nums' }}>
                  +1-604-354-6479
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

      {/* Truck – mobile only: centered between We Operate and footer */}
      <div className="flex justify-center md:hidden" style={{ backgroundColor: '#FAF7F2' }}>
        <Image
          src="/truck-nobg.png"
          alt=""
          width={400}
          height={300}
          className="w-[260px] object-contain"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="Stonegate logo" width={220} height={220} style={logoStyle} />
          <span className="font-extrabold text-xl tracking-tight" style={{ color: '#1A1714' }}>Stonegate Moving Solutions</span>
          <span className="text-sm font-medium" style={{ color: '#B5A99E' }}>© {new Date().getFullYear()} Stonegate Moving Solutions. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
