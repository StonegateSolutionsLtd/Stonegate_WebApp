import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Trash2, Truck, ArrowRight, CheckCircle2 } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'

export const metadata: Metadata = {
  title: { absolute: 'Junk Removal & Moving Prices in Vancouver | Stonegate' },
  description: 'Upfront prices across Metro Vancouver. Junk removal priced by load size. Moving: 2 movers at $120/hr or 3 movers with a 16\' truck at $160/hr + GST, plus a one-time flat-rate travel fee.',
  alternates: { canonical: 'https://www.stonegatemoving.com/pricing' },
}

const options = [
  {
    href: '/pricing/junk-removal',
    Icon: Trash2,
    eyebrow: 'Junk removal',
    title: 'Junk Removal Prices',
    price: 'Upfront',
    unit: 'pricing',
    points: ['Priced by the size of your load', 'Free estimate from photos or a description', 'Final price confirmed on-site before we start'],
    cta: 'See junk removal prices',
  },
  {
    href: '/pricing/moving',
    Icon: Truck,
    eyebrow: 'Moving',
    title: 'Moving Prices',
    price: '$120',
    unit: '/hr and up',
    points: ['2 movers $120/hr, or 3 movers + 16\' truck $160/hr', 'Plus a one-time flat-rate travel fee, explained upfront', '3-hour minimum, no hidden fees'],
    cta: 'See moving prices',
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
          <FadeIn>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-6 border rounded-full px-4 py-1.5"
              style={{ color: '#254220', borderColor: '#B5C9B0' }}
            >
              Transparent pricing
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6" style={{ color: '#1A1714' }}>
              Simple, honest <span style={{ color: '#254220' }}>pricing.</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#6B5E54' }}>
              No surprise fees. Pick a service to see the full price breakdown.
            </p>
          </FadeIn>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-8">
          {options.map(({ href, Icon, eyebrow, title, price, unit, points, cta }, i) => (
            <FadeIn key={href} delay={i * 100} className="h-full">
              <Link
                href={href}
                className="group h-full rounded-3xl overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1"
                style={{ border: '1px solid #E8E0D5', boxShadow: '0 2px 12px rgba(37,66,32,0.06)' }}
              >
                <div className="relative overflow-hidden px-8 pt-10 pb-8" style={{ background: 'linear-gradient(135deg, #1e3a1a 0%, #254220 60%, #2f5229 100%)' }}>
                  <Icon size={160} className="absolute -right-6 -top-6 opacity-[0.07]" style={{ color: '#FAF7F2' }} />
                  <div className="relative">
                    <span
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1 mb-8"
                      style={{ color: '#B5C9B0', borderColor: 'rgba(181,201,176,0.3)' }}
                    >
                      <Icon size={13} /> {eyebrow}
                    </span>
                    <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#FAF7F2' }}>{title}</h2>
                    <div className="flex items-end gap-2">
                      <span className="text-6xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>{price}</span>
                      <span className="text-lg font-semibold mb-1" style={{ color: '#B5C9B0' }}>{unit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col px-8 py-8" style={{ backgroundColor: '#F5F0EB' }}>
                  <ul className="flex flex-col gap-3 mb-8">
                    {points.map(p => (
                      <li key={p} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#254220' }} />
                        <span className="text-sm font-medium" style={{ color: '#1A1714' }}>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <span
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-full py-4 text-sm font-bold"
                    style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
                  >
                    {cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}
