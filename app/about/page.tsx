import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import { Button } from '@/components/ui/button'
import { Shield, Clock, Star } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'

export const metadata: Metadata = {
  title: 'About Us | Stonegate Moving Solutions',
  description: 'Meet the Stonegate Moving Solutions team - professional movers serving Metro Vancouver with moving, junk removal, and bin cleaning services.',
}

const values = [
  {
    icon: Shield,
    title: 'Fully Licensed & Insured',
    desc: 'Every move is covered. You can relax knowing your belongings are protected from start to finish.',
  },
  {
    icon: Clock,
    title: 'On Time, Every Time',
    desc: 'We respect your schedule. Our team shows up when we say we will - no waiting around.',
  },
  {
    icon: Star,
    title: 'Quality You Can Count On',
    desc: 'We treat every home like our own. Careful handling, clean equipment, and a job done right.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden" style={{ minHeight: '680px' }}>
          <Image
            src="/about/photo-4.jpg"
            alt="Stonegate team loading the truck"
            fill
            className="object-cover"
            style={{ objectPosition: 'center 55%' }}
            priority
          />

          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 35%, transparent 65%)' }} />
          <div className="relative max-w-6xl mx-auto px-6 flex flex-col justify-center" style={{ minHeight: '680px', paddingTop: '80px', paddingBottom: '80px' }}>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-6 border rounded-full px-4 py-1.5 w-fit"
              style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.35)' }}
            >
              Who we are
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6" style={{ color: '#FFFFFF' }}>
              Built on Hard Work<br />
              <span style={{ color: '#014421' }}>&amp; Trust.</span>
            </h1>
            <p className="text-lg max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Stonegate Moving Solutions is a local Metro Vancouver team dedicated to making your move - and your home - stress-free.
            </p>
          </div>
        </section>

        {/* ── Our Story ── */}
        <section style={{ borderTop: '1px solid #E8E0D5', borderBottom: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
            <FadeIn>
            <div>
              <span
                className="inline-block text-xs font-semibold uppercase tracking-widest mb-6 border rounded-full px-4 py-1.5"
                style={{ color: '#254220', borderColor: '#B5C9B0' }}
              >
                Our story
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6" style={{ color: '#1A1714' }}>
                A Local Team<br />
                <span style={{ color: '#254220' }}>You Can Trust</span>
              </h2>
              <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: '#6B5E54' }}>
                <p>
                  Stonegate Moving Solutions started with a simple idea: moving should be easy. We saw too many people stressed out by unreliable movers, hidden fees, and careless handling - and we knew we could do better.
                </p>
                <p>
                  We&apos;re a young, driven team based right here in Metro Vancouver. Every job we take on gets our full attention and effort, whether it&apos;s a studio apartment move across town or a full house cleanout.
                </p>
                <p>
                  Over time we expanded into junk removal and bin cleaning - because the same values that make a great move also make every other home service better: showing up on time, working hard, and leaving the place better than we found it.
                </p>
              </div>
            </div>

            </FadeIn>

            {/* Group photo */}
            <FadeIn delay={150}>
            <div className="relative rounded-2xl overflow-hidden shadow-md" style={{ height: '460px', border: '1px solid #E8E0D5' }}>
              <Image
                src="/about/photo-3.jpg"
                alt="The Stonegate team in front of the truck"
                fill
                className="object-cover object-top"
              />
            </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Photo Grid ── */}
        <section style={{ backgroundColor: '#F5F0EB', borderBottom: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-20">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 border rounded-full px-4 py-1.5"
              style={{ color: '#254220', borderColor: '#B5C9B0' }}
            >
              The team in action
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>Meet the Crew</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ gridAutoRows: '240px' }}>
              {/* Large: action shot - 2 cols × 2 rows */}
              <FadeIn className="col-span-2 row-span-2">
              <div className="relative rounded-2xl overflow-hidden h-full" style={{ border: '1px solid #E8E0D5' }}>
                <Image src="/about/team-truck.png" alt="Team member walking to the Stonegate truck" fill className="object-cover object-center" />
              </div>
              </FadeIn>
              {/* Interior action shot */}
              <FadeIn delay={100}>
              <div className="relative rounded-2xl overflow-hidden h-full" style={{ border: '1px solid #E8E0D5' }}>
                <Image src="/about/photo-5.jpg" alt="Team member working inside the truck" fill className="object-cover object-center" />
              </div>
              </FadeIn>
              {/* Solo portrait 2 */}
              <FadeIn delay={200}>
              <div className="relative rounded-2xl overflow-hidden h-full" style={{ border: '1px solid #E8E0D5' }}>
                <Image src="/about/photo-2.jpg" alt="Stonegate team member" fill className="object-cover object-top" />
              </div>
              </FadeIn>
              {/* Team on top of truck - 2 cols */}
              <FadeIn delay={150} className="col-span-2">
              <div className="relative rounded-2xl overflow-hidden h-full" style={{ border: '1px solid #E8E0D5' }}>
                <Image src="/about/photo-6.png" alt="Stonegate team sitting on top of the truck" fill className="object-cover" style={{ objectPosition: 'center 35%' }} />
              </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section style={{ borderBottom: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <span
                className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 border rounded-full px-4 py-1.5"
                style={{ color: '#254220', borderColor: '#B5C9B0' }}
              >
                What drives us
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: '#1A1714' }}>Our Values</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <FadeIn key={v.title} delay={i * 120}>
                <div className="flex flex-col gap-4 p-8 rounded-2xl" style={{ backgroundColor: '#F5F0EB', border: '1px solid #E8E0D5' }}>
                  <span className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F0E6' }}>
                    <v.icon size={22} style={{ color: '#254220' }} />
                  </span>
                  <h3 className="font-bold text-base" style={{ color: '#1A1714' }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{v.desc}</p>
                </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <FadeIn>
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 border rounded-full px-4 py-1.5"
              style={{ color: '#254220', borderColor: '#B5C9B0' }}
            >
              Get started
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>
              Ready to work with us?
            </h2>
            <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: '#6B5E54' }}>
              Book a move, schedule junk removal, or get your bins cleaned - we&apos;ve got you covered.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/order">
                <Button className="text-base px-10 py-6 rounded-full font-bold border-0" style={{ backgroundColor: '#254220', color: '#FAF7F2' }}>
                  Book a Move
                </Button>
              </Link>
              <Link href="/book-service?type=junk-removal">
                <Button className="text-base px-10 py-6 rounded-full font-bold" style={{ backgroundColor: 'transparent', color: '#254220', border: '2px solid #254220' }}>
                  Junk Removal
                </Button>
              </Link>
              <Link href="/book-service?type=bin-cleaning">
                <Button className="text-base px-10 py-6 rounded-full font-bold" style={{ backgroundColor: 'transparent', color: '#254220', border: '2px solid #254220' }}>
                  Bin Cleaning
                </Button>
              </Link>
            </div>
          </div>
          </FadeIn>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="Stonegate logo" width={220} height={220} style={{ filter: 'brightness(0)' }} />
          <span className="font-extrabold text-xl tracking-tight" style={{ color: '#1A1714' }}>Stonegate Moving Solutions</span>
          <span className="text-sm font-medium" style={{ color: '#B5A99E' }}>© {new Date().getFullYear()} Stonegate Moving Solutions. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
