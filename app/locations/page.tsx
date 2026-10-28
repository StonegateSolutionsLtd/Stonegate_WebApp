import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import FadeIn from '@/components/landing/FadeIn'
import StickyCallBar from '@/components/landing/StickyCallBar'
import {
  MovingHero, MovingPriceBlock, MovingReviews, MovingClose,
  GREEN, INK, MUTED, CREAM, LINE, eyebrow, sectionWrap,
} from '@/components/moving/MovingSections'
import { CITIES, cityHref } from '@/lib/seo/cities'
import { MOVE_BOOK_HREF } from '@/lib/seo/site'

export const metadata: Metadata = {
  title: { absolute: 'Moving Service Areas in Metro Vancouver | Stonegate' },
  description: 'Local movers in every Metro Vancouver city - Vancouver, Surrey, Burnaby, Richmond, Coquitlam, New Westminster, North Vancouver, Langley, Delta and more.',
  alternates: { canonical: 'https://www.stonegatemoving.com/locations' },
}

export default function LocationsPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: CREAM }}>
      <Navbar />

      <main className="flex-1">
        <MovingHero
          heading={['Moving', 'Service Areas']}
          intro="Apartment, condo and house moves in every city across Metro Vancouver. Pick yours below, or check your moving date now."
          photo={{ src: '/hero-truck-home-natural.jpg', alt: 'The Stonegate moving truck parked outside a home', pos: 'center 60%' }}
        />

        {/* Cities */}
        <section style={{ backgroundColor: CREAM }}>
          <div className={`${sectionWrap} py-16 sm:py-20`}>
            <FadeIn>
              <p className={eyebrow} style={{ color: GREEN }}>Service areas</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>Every City We Serve</h2>
              <p className="text-base leading-relaxed max-w-2xl mb-10" style={{ color: MUTED }}>
                Pick your city to see local moving details, the neighbourhoods we cover and answers to common questions.
              </p>
            </FadeIn>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CITIES.map((city, i) => (
                <li key={city.slug}>
                  <FadeIn delay={(i % 3) * 60} className="h-full">
                    <Link
                      href={cityHref(city)}
                      className="group h-full flex items-start gap-4 rounded-2xl p-6 transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(26,23,20,0.25)] hover:border-[#014421]"
                      style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}` }}
                    >
                      <span className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F0E6' }}>
                        <MapPin size={18} style={{ color: GREEN }} aria-hidden />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-extrabold text-lg mb-1" style={{ color: INK }}>{city.name} Movers</span>
                        <span className="block text-sm leading-relaxed" style={{ color: MUTED }}>{city.neighbourhoods.slice(0, 4).join(' · ')}</span>
                      </span>
                      <ArrowRight size={18} className="shrink-0 mt-3 transition-transform group-hover:translate-x-1" style={{ color: GREEN }} aria-hidden />
                    </Link>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <MovingPriceBlock note="The same hourly rate in every city we serve. 3-hour minimum, prices plus GST, and a one-time flat travel fee explained ahead of time." />

        <MovingReviews />

        <MovingClose heading="Moving in Metro Vancouver?" text="Pick a day and time online in a couple of minutes, or call and we will book it with you." />
      </main>

      <Footer />
      <StickyCallBar watchId="booking-start" quoteHref={MOVE_BOOK_HREF} quoteLabel="Book Your Move" />
    </div>
  )
}
