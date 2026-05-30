import Link from 'next/link'
import { Button } from '@/components/ui/button'

const steps = [
  { number: '01', title: 'Fill the form', description: 'Tell us your addresses, apartment size, and moving date. Takes under 2 minutes.' },
  { number: '02', title: 'Review your order', description: 'Look over the details and submit. We handle everything from there.' },
  { number: '03', title: 'We handle the rest', description: 'Our team shows up on time and moves everything safely to your new home.' },
]

const highlights = [
  'Licensed and insured',
  'Careful with your belongings',
  'Flexible scheduling',
  'Transparent pricing',
]

export default function Hero() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-center">
          <span className="font-extrabold text-2xl tracking-tight text-gray-950">
            Stonegate Moving Solutions
          </span>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8 border border-gray-200 rounded-full px-4 py-1.5">
            Apartment moving specialists
          </span>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-gray-950 leading-none max-w-4xl">
            Moving made<br />
            <span className="text-gray-400">effortless</span>
          </h1>
          <p className="mt-8 text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
            Book your apartment move in minutes. We handle the heavy lifting so you can focus on settling in.
          </p>
          <Link href="/order" className="mt-10">
            <Button className="bg-gray-950 text-white hover:bg-gray-800 text-base px-10 py-6 rounded-full font-bold shadow-xl shadow-gray-200">
              Book a Move
            </Button>
          </Link>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2">
            {highlights.map(h => (
              <span key={h} className="text-sm text-gray-400 font-medium">{h}</span>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 text-center mb-14">
              How it works
            </p>
            <div className="grid sm:grid-cols-3 gap-12">
              {steps.map(step => (
                <div key={step.number} className="flex flex-col gap-4">
                  <span className="text-5xl font-extrabold text-gray-600">{step.number}</span>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Contact & Service Area */}
      <section className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Contact us</p>
            <div className="flex flex-col gap-3">
              <a href="mailto:orders@stonegatemoving.com" className="text-gray-950 font-semibold hover:text-gray-600 transition-colors" style={{ fontStyle: 'normal' }}>
                orders@stonegatemoving.com
              </a>
              <a href="tel:+16043546479" className="text-gray-950 font-semibold hover:text-gray-600 transition-colors" style={{ fontStyle: 'normal', fontVariantNumeric: 'lining-nums tabular-nums' }}>
                +1-604-354-6479
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">We operate in Metro Vancouver</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {[
                'Vancouver', 'Burnaby', 'Richmond', 'Coquitlam',
                'Surrey', 'New Westminster', 'Port Coquitlam', 'Port Moody',
                'Delta', 'North Vancouver',
              ].map(city => (
                <span key={city} className="text-sm text-gray-600 font-medium">{city}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-400 font-medium">
          <span>© {new Date().getFullYear()} Stonegate Moving Solutions. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
