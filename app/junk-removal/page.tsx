import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import ContactButton from '@/components/landing/ContactButton'
import {
  Trash2, CheckCircle2, ArrowRight, Sofa, Refrigerator, Tv, BedDouble,
  Dumbbell, Flame, Building2, Wrench, Leaf, Warehouse, Package, Waves,
  AlertTriangle, MessageCircleQuestion,
} from 'lucide-react'
import FadeIn from '@/components/landing/FadeIn'

export const metadata: Metadata = {
  title: 'Junk Removal in Vancouver',
  description: 'Professional junk removal in Vancouver, Burnaby, Richmond & Metro Vancouver. Residential and commercial. Book online.',
  alternates: { canonical: 'https://www.stonegatemoving.com/junk-removal' },
}

const junkFeatures = [
  'Old furniture and mattresses',
  'Appliances and electronics (e-waste)',
  'Estate and garage cleanouts',
  'Office and commercial junk',
  'We donate and recycle before the landfill',
]

const junkCategories = [
  { label: 'Couches & Big Furniture', desc: 'Too heavy to move alone? That\'s our job.', Icon: Sofa },
  { label: 'Fridges, Washers & Stoves', desc: 'We disconnect and haul the big stuff too.', Icon: Refrigerator },
  { label: 'Old TVs & Gadgets', desc: 'Screens, computers and other e-waste.', Icon: Tv },
  { label: 'Beds & Box Springs', desc: 'One mattress or a whole guest room.', Icon: BedDouble },
  { label: 'Home Gym Gear', desc: 'Treadmills and weights you\'ll never lift.', Icon: Dumbbell },
  { label: 'Patio & BBQ Leftovers', desc: 'Includes safe propane tank disposal.', Icon: Flame },
  { label: 'Business Cleanouts', desc: 'Desks, chairs and office move-outs.', Icon: Building2 },
  { label: 'Reno Leftovers', desc: 'Drywall, cabinets and old fixtures.', Icon: Wrench },
  { label: 'Yard Debris', desc: 'Fence boards, branches and dirt piles.', Icon: Leaf },
  { label: 'Whole-Property Cleanouts', desc: 'Estate sales, foreclosures and more.', Icon: Warehouse },
  { label: 'General Clutter', desc: 'Boxes, bags - if it\'s in the way, it\'s gone.', Icon: Package },
  { label: 'Oversized & Awkward Items', desc: 'Hot tubs, pianos - ask and we\'ll haul it.', Icon: Waves },
]

export default function JunkRemovalPage() {
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

        {/* What we take */}
        <section className="relative overflow-hidden" style={{ borderBottom: '1px solid #E8E0D5', backgroundColor: '#F5F0EB' }}>
          <Trash2 size={280} className="absolute pointer-events-none select-none" style={{ color: '#254220', opacity: 0.05, right: '-40px', top: '-40px', transform: 'rotate(-12deg)' }} />
          <div className="relative max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#014421' }}>What we take</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: '#1A1714' }}>
                  If it&apos;s taking up space, we&apos;ll take it away.
                </h2>
                <p className="text-base leading-relaxed" style={{ color: '#6B5E54' }}>
                  From a single old couch to a full estate cleanout - here&apos;s a sample of what we haul, every day, across Metro Vancouver.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {junkCategories.map(({ label, desc, Icon }, i) => (
                <FadeIn key={label} delay={i * 40}>
                  <div
                    className="group h-full rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', boxShadow: '0 2px 10px rgba(37,66,32,0.05)' }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-[#254220]"
                      style={{ backgroundColor: '#E8F0E6' }}
                    >
                      <Icon size={20} className="transition-colors duration-300 group-hover:text-white" style={{ color: '#254220' }} />
                    </div>
                    <p className="font-bold text-sm mb-1" style={{ color: '#1A1714' }}>{label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9A8E83' }}>{desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={480}>
              <div className="flex flex-col sm:flex-row items-stretch gap-4 mt-6">
                <div className="flex items-start gap-3 flex-1 rounded-2xl p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
                  <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#B45309' }} />
                  <p className="text-xs leading-relaxed" style={{ color: '#6B5E54' }}>
                    <span className="font-bold" style={{ color: '#1A1714' }}>What we can&apos;t take: </span>
                    hazardous waste, paint, chemicals, and asbestos. Ask us if you&apos;re unsure - we&apos;ll point you in the right direction.
                  </p>
                </div>
                <Link
                  href="/book-service?type=junk-removal"
                  className="flex items-center justify-center gap-2 rounded-2xl px-6 py-5 text-sm font-bold transition-opacity hover:opacity-90 whitespace-nowrap"
                  style={{ backgroundColor: '#254220', color: '#FAF7F2' }}
                >
                  <MessageCircleQuestion size={16} /> Leave A Request, We&apos;ll Explain
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Before & After */}
        <section style={{ borderBottom: '1px solid #E8E0D5' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <FadeIn>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#014421' }}>Junk removal results</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-10" style={{ color: '#1A1714' }}>Let Your House Breathe</h2>
            </FadeIn>
            <FadeIn>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E0D5' }}>
                <div className="grid grid-cols-2">
                  <div className="relative" style={{ height: '420px' }}>
                    <Image src="/junk-before-livingroom.png" alt="Before junk removal - Living room furniture removal" fill className="object-cover" />
                    <span
                      className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1"
                      style={{ backgroundColor: 'rgba(26,23,20,0.6)', color: '#FFFFFF' }}
                    >
                      Before
                    </span>
                  </div>
                  <div className="relative" style={{ height: '420px' }}>
                    <Image src="/junk-after-livingroom.png" alt="After junk removal - Living room furniture removal" fill className="object-cover" />
                    <span
                      className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest rounded-full px-3 py-1"
                      style={{ backgroundColor: '#014421', color: '#FFFFFF' }}
                    >
                      After
                    </span>
                  </div>
                </div>
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
                Our truck comes fully equipped for junk removal - straps, dollies, and protective padding to haul out furniture, appliances, and debris without damaging your home. No extra fees, no surprises.
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
