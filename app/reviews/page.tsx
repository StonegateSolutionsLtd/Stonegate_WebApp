import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import GoogleLogo from '@/components/GoogleLogo'
import ReviewsGrid from '@/components/reviews/ReviewsGrid'
import { GREEN, INK, MUTED, CREAM, CLAY, LINE, MASCOT, eyebrow, sectionWrap } from '@/components/moving/MovingSections'
import { BUSINESS_PROFILES, MOVE_BOOK_HREF } from '@/lib/seo/site'
import { GOOGLE_MOVING_REVIEWS } from '@/lib/reviews'

const GOOGLE_PROFILE = BUSINESS_PROFILES[0]

export const metadata: Metadata = {
  title: { absolute: 'Customer Reviews | Stonegate Moving Solutions' },
  description: 'Real Google reviews from customers who moved with Stonegate Moving Solutions across Metro Vancouver. Rated 4.9 on Google.',
  alternates: { canonical: 'https://www.stonegatemoving.com/reviews' },
}

export default function ReviewsPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: CREAM }}>
      <Navbar />

      <main className="flex-1">
        {/* Intro and the rating, linking to the public Google profile */}
        <section>
          <div className={`${sectionWrap} pt-12 pb-10 sm:pt-16 sm:pb-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-end`}>
            <div>
              {/* On phones the mascot stands beside the headline; from lg it moves next to the rating card */}
              <div className="flex items-end justify-between gap-3 mb-5">
                <div>
                  <p className={eyebrow} style={{ color: GREEN }}>About Stonegate</p>
                  <h1 className="text-[2.3rem] min-[400px]:text-[2.5rem] sm:text-6xl font-extrabold tracking-tight leading-[1.02]" style={{ color: INK }}>
                    What Our Customers <span style={{ color: CLAY }}>Say</span>
                  </h1>
                </div>
                <div className="lg:hidden relative shrink-0 w-[130px] min-[400px]:w-[140px] sm:w-[190px] aspect-square -mb-1">
                  <Image src={MASCOT} alt="Stonegate mascot giving a thumbs up and holding a moving box" fill priority sizes="190px" className="object-contain object-bottom" />
                </div>
              </div>
              <p className="text-[18px] sm:text-xl leading-relaxed max-w-[600px]" style={{ color: MUTED }}>
                Real experiences from people who moved with our crew across Metro Vancouver, copied word for word from our Google reviews.
              </p>
            </div>

            {/* From lg the mascot stands beside the rating card */}
            <div className="flex items-end gap-5">
            <div className="hidden lg:block relative shrink-0 w-[140px] xl:w-[170px] aspect-square">
              <Image src={MASCOT} alt="" fill sizes="170px" className="object-contain object-bottom" />
            </div>
            <a
              href={GOOGLE_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1 min-w-0 flex flex-col rounded-3xl p-5 sm:p-7 bg-white transition-shadow hover:shadow-[0_16px_40px_-20px_rgba(26,23,20,0.35)]"
              style={{ border: `1px solid ${LINE}` }}
            >
              <span className="flex items-center gap-3 mb-2">
                <GoogleLogo size={28} />
                <span className="text-5xl font-extrabold tracking-tight" style={{ color: INK }}>4.9</span>
              </span>
              <span className="flex items-center gap-0.5 mb-3" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, j) => <Star key={j} size={18} fill="#FBBC04" style={{ color: '#FBBC04' }} aria-hidden />)}
              </span>
              <span className="text-[15px] font-semibold mb-4" style={{ color: MUTED }}>Average rating on Google</span>
              <span className="text-[15px] font-bold leading-snug" style={{ color: GREEN }}>
                See every review on <span className="whitespace-nowrap">Google<ArrowUpRight size={16} className="inline ml-1 align-[-3px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden /></span>
              </span>
            </a>
            </div>
          </div>
        </section>

        <section style={{ borderTop: `1px solid ${LINE}` }}>
          <div className={`${sectionWrap} py-10 sm:py-14`}>
            <ReviewsGrid />
            <p className="mt-4 text-sm" style={{ color: MUTED }}>
              {GOOGLE_MOVING_REVIEWS.length} reviews about moves and our crew. Reviews of our junk removal service are on{' '}
              <a href={GOOGLE_PROFILE} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2" style={{ color: GREEN }}>our Google profile</a>.
            </p>
          </div>
        </section>

        {/* Ask past customers for a review; a quiet link for anyone planning a move */}
        <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: '#F5F0EB' }}>
          <div className={`${sectionWrap} py-14 sm:py-16 flex flex-col md:flex-row md:items-center justify-between gap-6`}>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2" style={{ color: INK }}>Moved with Stonegate?</h2>
              <p className="text-[17px]" style={{ color: MUTED }}>Tell others how it went. Every review helps a small local crew.</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <a href={GOOGLE_PROFILE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full min-h-[52px] px-6 font-bold whitespace-nowrap transition-[transform,background-color] active:scale-[0.97] hover:bg-[#00341A]" style={{ backgroundColor: GREEN, color: CREAM }}>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white"><GoogleLogo size={14} /></span> Leave a Google review
              </a>
              <Link href={MOVE_BOOK_HREF} className="inline-flex items-center gap-1.5 font-bold whitespace-nowrap hover:underline underline-offset-4" style={{ color: GREEN }}>
                Planning a move? Get an estimate <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
