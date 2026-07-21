import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import ContactButton from '@/components/landing/ContactButton'
import { Trash2, CheckCircle2, ArrowRight } from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'

export const metadata: Metadata = {
  title: 'Junk Removal in Vancouver',
  description: 'Professional junk removal in Vancouver, Burnaby, Richmond & Metro Vancouver. Residential and commercial. Book online.',
  alternates: { canonical: 'https://www.stonegatemoving.com/other-services' },
}

const junkFeatures = [
  'Old furniture and mattresses',
  'Appliances and electronics (e-waste)',
  'Estate and garage cleanouts',
  'Office and commercial junk',
  'We donate and recycle before the landfill',
]

export default function OtherServicesPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ backgroundColor: '#254220', minHeight: '340px' }}>
          <div className="absolute inset-0 opacity-20">
            <Image src="/junk-removal.jpg" alt="" fill className="object-cover object-center" priority />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-20">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-6 border rounded-full px-4 py-1.5" style={{ color: '#B5C9B0', borderColor: '#3d6b35' }}>
              Beyond moving
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6" style={{ color: '#FAF7F2' }}>
              Junk Removal
            </h1>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#B5C9B0' }}>
              We go beyond moving day. Keep your home clean and clutter-free with professional junk removal across Metro Vancouver.
            </p>
          </div>
        </section>

        {/* Junk Removal */}
        <section style={{ borderBottom: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

            {/* Content */}
            <FadeIn>
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#E8F0E6' }}>
                <Trash2 size={22} style={{ color: '#254220' }} />
              </div>
              <h2 className="text-4xl font-extrabold mb-4" style={{ color: '#1A1714' }}>Junk Removal</h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: '#6B5E54' }}>
                Reclaim your space. Whether you&apos;re decluttering before a move, clearing out an estate, or just need that old couch gone - we&apos;ll haul it away quickly and responsibly. We prioritize donating usable items and recycling before anything reaches the landfill.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {junkFeatures.map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="flex-shrink-0" style={{ color: '#254220' }} />
                    <span className="text-sm font-medium" style={{ color: '#1A1714' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/book-service?type=junk-removal"
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
              >
                Book Junk Removal <ArrowRight size={15} />
              </Link>
            </div>
            </FadeIn>

            {/* Photo */}
            <FadeIn delay={120}>
            <div className="relative rounded-3xl overflow-hidden" style={{ height: '420px' }}>
              <Image
                src="/junk-removal.jpg"
                alt="Junk removal service"
                fill
                className="object-cover object-center"
              />
            </div>
            </FadeIn>
          </div>
        </section>

        {/* Truck + CTA */}
        <section>
          <div className="flex flex-col md:flex-row gap-6 px-6 py-6 items-stretch" style={{ backgroundColor: '#FAF7F2' }}>

            {/* Left: dark green content */}
            <FadeIn className="md:w-2/5">
            <div
              className="flex flex-col justify-center px-10 py-16 h-full rounded-3xl"
              style={{ backgroundColor: '#254220' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#B5C9B0' }}>
                Our fleet
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-6" style={{ color: '#FAF7F2' }}>
                Fully equipped.<br />Always on time.
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#B5C9B0' }}>
                Our truck comes loaded with moving blankets, straps, and dollies - everything needed to move your belongings safely. No extra fees, no surprises.
              </p>
              <ContactButton
                label="Contact Us Directly"
                className="self-start rounded-full text-sm font-bold px-7 py-3.5 border-0 cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#FAF7F2', color: '#254220' }}
              />
            </div>

            </FadeIn>

            {/* Right: truck image */}
            <FadeIn delay={120} className="md:w-3/5">
            <div style={{ backgroundColor: '#FAF7F2' }}>
              <div className="relative w-full rounded-3xl overflow-hidden" style={{ height: '520px' }}>
                <Image
                  src="/truck.png"
                  alt="Stonegate Moving Solutions truck"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 45%' }}
                />
              </div>
            </div>
            </FadeIn>

          </div>
        </section>

      </main>

      <footer style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <span className="text-sm font-medium" style={{ color: '#B5A99E' }}>
            © {new Date().getFullYear()} Stonegate Moving Solutions. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  )
}
