import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/landing/Navbar'
import { Droplets, Trash2 } from 'lucide-react'

const logoStyle = {
  filter: 'brightness(0)',
}

const steps = [
  { number: '01', title: 'Fill the form', description: 'Tell us your addresses, apartment size, and moving date. Takes under 2 minutes.' },
  { number: '02', title: 'Review your order', description: 'Look over the details and submit. We handle everything from there.' },
  { number: '03', title: 'We handle the rest', description: 'Our team shows up on time and moves everything safely to your new home.' },
]


export default function Hero() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>

      <Navbar />

      <main className="flex-1">

        {/* Shared background for hero + how it works */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero.jpg"
              alt="Elegant living room interior"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

        {/* Hero */}
        <section className="relative" style={{ minHeight: '600px' }}>

          {/* Gradient overlay: solid cream on left, fades to transparent on right */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, #FAF7F2dd 0%, #FAF7F2aa 40%, #FAF7F260 65%, transparent 95%)' }}
          />
          <div
            className="absolute inset-x-0 top-0 h-40"
            style={{ background: 'linear-gradient(to bottom, #FAF7F2 0%, #FAF7F2cc 40%, #FAF7F280 70%, transparent 100%)' }}
          />

          {/* Content */}
          <div className="relative max-w-6xl mx-auto px-6 pt-40 pb-16 lg:pt-52 lg:pb-20">
            <div className="max-w-5xl">
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none"
                style={{ color: '#1A1714' }}
              >
                Moving In Metro Vancouver<br />
                <span style={{ color: '#254220' }}>Made Effortless.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed" style={{ color: '#1A1714' }}>
                Book your apartment move in minutes. We handle the heavy lifting so you can focus on settling in.
              </p>
              <p className="mt-6 text-sm" style={{ color: '#1A1714' }}>
                No commitment - we confirm the details and price with you before anything is booked.
              </p>
              <Link href="/order" className="mt-4 inline-block">
                <Button
                  className="text-base px-10 py-6 rounded-full font-bold border-0"
                  style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
                >
                  Book Your Move
                </Button>
              </Link>
            </div>
          </div>

        </section>

        {/* How it works */}
        <section className="relative" style={{ backgroundColor: 'transparent' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #FAF7F2dd 0%, #FAF7F2aa 40%, #FAF7F260 65%, transparent 95%)' }} />
          <div className="relative max-w-6xl mx-auto px-6 py-20">
            <p className="text-sm font-bold uppercase tracking-widest text-center mb-14" style={{ color: '#1A1714' }}>
              How it works
            </p>
            <div className="grid sm:grid-cols-3 gap-10">
              {steps.map(step => (
                <div
                  key={step.number}
                  className="flex flex-col gap-4 p-6 rounded-2xl"
                  style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E0D5' }}
                >
                  <span className="text-5xl font-extrabold" style={{ color: '#254220' }}>{step.number}</span>
                  <h3 className="text-base font-bold" style={{ color: '#1A1714' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        </div>{/* end shared background */}

        {/* Also offering */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
          <div className="max-w-6xl mx-auto px-6 py-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-8" style={{ color: '#254220' }}>
              Also offering
            </p>
            <div className="grid sm:grid-cols-2 gap-6">

              {/* Bin Cleaning card */}
              <Link href="/other-services" className="group rounded-2xl overflow-hidden transition-opacity hover:opacity-90" style={{ border: '1px solid #E8E0D5' }}>
                <div className="relative w-full overflow-hidden" style={{ height: '220px' }}>
                  <Image
                    src="/bin-cleaning.jpg"
                    alt="Bin cleaning service"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: 'center 65%' }}
                  />
                </div>
                <div className="p-6 flex items-start gap-4" style={{ backgroundColor: '#FAF7F2' }}>
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#E8F0E6' }}>
                    <Droplets size={18} style={{ color: '#254220' }} />
                  </span>
                  <div>
                    <p className="font-bold mb-1" style={{ color: '#1A1714' }}>Bin Cleaning</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>
                      High-pressure hot water washing with eco-safe disinfectants. Residential and commercial.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Junk Removal card */}
              <Link href="/other-services" className="group rounded-2xl overflow-hidden transition-opacity hover:opacity-90" style={{ border: '1px solid #E8E0D5' }}>
                <div className="relative w-full overflow-hidden" style={{ height: '220px' }}>
                  <Image
                    src="/junk-removal.jpg"
                    alt="Junk removal service"
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex items-start gap-4" style={{ backgroundColor: '#FAF7F2' }}>
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#E8F0E6' }}>
                    <Trash2 size={18} style={{ color: '#254220' }} />
                  </span>
                  <div>
                    <p className="font-bold mb-1" style={{ color: '#1A1714' }}>Junk Removal</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>
                      Furniture, appliances, estate and office cleanouts - hauled away responsibly across Metro Vancouver.
                    </p>
                  </div>
                </div>
              </Link>

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
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#254220' }}>Contact us</p>
              <div className="flex flex-col gap-3">
                <a href="mailto:orders@stonegatemoving.com" className="font-semibold hover:opacity-60 transition-opacity" style={{ color: '#1A1714' }}>
                  orders@stonegatemoving.com
                </a>
                <a href="tel:+16043546479" className="font-semibold hover:opacity-60 transition-opacity" style={{ color: '#1A1714', fontVariantNumeric: 'lining-nums tabular-nums' }}>
                  +1-604-354-6479
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#254220' }}>We operate in Metro Vancouver</p>
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



