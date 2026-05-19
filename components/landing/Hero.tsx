'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const steps = [
  { number: '01', title: 'Fill the form', description: 'Tell us your addresses, apartment size, and moving date. Takes under 2 minutes.' },
  { number: '02', title: 'Confirm your order', description: 'Review the details, create an account, and lock in your booking.' },
  { number: '03', title: 'We handle the rest', description: 'Our team shows up on time and moves everything safely to your new home.' },
]

const highlights = [
  'Licensed & insured',
  'Careful with your belongings',
  'Flexible scheduling',
  'Transparent pricing',
]

export default function Hero() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight text-zinc-900">Stonegate Moving Solutions</span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/order">
              <Button size="sm">Book a Move</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 bg-zinc-50">
        <section className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6">Apartment moving specialists</Badge>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900 leading-tight max-w-2xl">
            Moving made simple.
          </h1>
          <p className="mt-6 text-xl text-zinc-500 max-w-xl leading-relaxed">
            Book your apartment move in minutes. We handle the heavy lifting. You just show up to your new home.
          </p>
          <Link href="/order" className="mt-10">
            <Button size="lg" className="text-base px-10 py-6 rounded-full shadow-md">
              Book Your Move
            </Button>
          </Link>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {highlights.map(h => (
              <span key={h} className="text-sm text-zinc-400 flex items-center gap-1">
                <span className="text-green-500">✓</span> {h}
              </span>
            ))}
          </div>
        </section>

        <Separator className="max-w-5xl mx-auto" />

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-semibold text-zinc-900 text-center mb-14">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {steps.map(step => (
              <div key={step.number} className="flex flex-col gap-3">
                <span className="text-4xl font-bold text-zinc-200">{step.number}</span>
                <h3 className="text-lg font-semibold text-zinc-900">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="bg-zinc-900 text-white py-16">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xl font-semibold">Ready to move?</p>
              <p className="text-zinc-400 mt-1">Fill in your details and we'll take care of the rest.</p>
            </div>
            <Link href="/order">
              <Button size="lg" variant="secondary" className="px-8">
                Start Your Order
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-zinc-400">
          <span>© {new Date().getFullYear()} Stonegate Moves. All rights reserved.</span>
          <span>Moving you forward.</span>
        </div>
      </footer>
    </div>
  )
}
