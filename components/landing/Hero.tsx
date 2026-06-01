import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

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

      {/* Nav */}
      <header style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-4 flex items-center justify-center">
          <span className="font-extrabold text-2xl tracking-tight" style={{ color: '#1A1714' }}>
            Stonegate Moving Solutions
          </span>
        </div>
      </header>

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
            <div className="max-w-xl">
              <span
                className="inline-block text-xs font-semibold uppercase tracking-widest mb-6 border rounded-full px-4 py-1.5"
                style={{ color: '#4D6B47', borderColor: '#B5C9B0', backgroundColor: '#FAF7F2ee' }}
              >
                Apartment moving specialists
              </span>
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none"
                style={{ color: '#1A1714' }}
              >
                Moving made<br />
                <span style={{ color: '#4D6B47' }}>effortless.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed" style={{ color: '#6B5E54' }}>
                Book your apartment move in minutes. We handle the heavy lifting so you can focus on settling in.
              </p>
              <Link href="/order" className="mt-8 inline-block">
                <Button
                  className="text-base px-10 py-6 rounded-full font-bold border-0"
                  style={{ backgroundColor: '#4D6B47', color: '#FAF7F2' }}
                >
                  Book a Move
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
                  <span className="text-5xl font-extrabold" style={{ color: '#4D6B47' }}>{step.number}</span>
                  <h3 className="text-base font-bold" style={{ color: '#1A1714' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        </div>{/* end shared background */}


        {/* Contact & Service Area */}
        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#4D6B47' }}>Contact us</p>
              <div className="flex flex-col gap-3">
                <a href="mailto:orders@stonegatemoving.com" className="font-semibold" style={{ color: '#1A1714', fontStyle: 'normal' }}>
                  orders@stonegatemoving.com
                </a>
                <a href="tel:+16043546479" className="font-semibold" style={{ color: '#1A1714', fontStyle: 'normal', fontVariantNumeric: 'lining-nums tabular-nums' }}>
                  +1-604-354-6479
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#4D6B47' }}>We operate in Metro Vancouver</p>
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
