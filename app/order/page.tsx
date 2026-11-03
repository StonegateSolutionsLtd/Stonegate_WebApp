import Image from 'next/image'
import { Phone, Mail, MapPin, MessageCircleQuestion, Check } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import OrderForm from '@/components/order/OrderForm'
import ReviewCarousel from '@/components/order/ReviewCarousel'
import GoogleLogo from '@/components/GoogleLogo'
import GoogleStars from '@/components/GoogleStars'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import { CONTACT_EMAIL } from '@/lib/contact'
import { MOVING_REVIEWS } from '@/lib/moving-services'
import { BUSINESS_PROFILES } from '@/lib/seo/site'
import { MASCOT } from '@/components/moving/MovingSections'

export const metadata = {
  title: 'Request a Free Moving Estimate',
  description: 'Request a free moving estimate online for your Metro Vancouver move. 2 movers with a fully equipped truck from $130/hr + GST - tell us about your move in 2 minutes.',
  alternates: { canonical: 'https://www.stonegatemoving.com/order' },
}

const GREEN = '#014421'
const INK = '#1A1714'
const MUTED = '#6B5E54'
const LINE = '#E8E0D5'
const GOOGLE_PROFILE = BUSINESS_PROFILES[0]

const HELP = [
  'What to expect on moving day',
  'How long your move will likely take',
  'The hourly rate and travel fee, upfront',
]

/** Free estimate: the mascot panel holds still on the left while the form, reviews and contact details scroll on the right */
export default function OrderPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F5F0EB' }}>
      <Navbar />

      <main className="flex-1 lg:grid lg:grid-cols-[minmax(0,30fr)_minmax(0,70fr)] xl:grid-cols-[minmax(0,28fr)_minmax(0,72fr)] 2xl:grid-cols-[minmax(0,26fr)_minmax(0,74fr)]">
        {/* Mascot panel: a band on phones, a full-height column that stays put on desktop */}
        <div className="relative h-40 sm:h-56 lg:h-auto">
          <div className="relative h-full lg:sticky lg:top-0 lg:h-screen overflow-hidden" style={{ backgroundColor: GREEN }}>
            {/* Soft light behind the mascot */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 70% 85%, rgba(201,138,69,0.35), rgba(201,138,69,0) 55%)' }} />
            <div className="absolute left-5 top-5 sm:left-8 sm:top-7 lg:left-10 lg:top-12 z-10 max-w-[55%] lg:max-w-none">
              <p className="text-[23px] sm:text-[32px] lg:text-4xl xl:text-[40px] 2xl:text-5xl font-black uppercase leading-[0.95] tracking-tight" style={{ color: '#FAF7F2' }}>
                Moving<br />made<br /><span style={{ color: '#C98A45' }}>effortless</span>
              </p>
              <GoogleStars size="sm" className="mt-3 lg:mt-6" />
            </div>
            <div className="absolute bottom-0 right-0 lg:right-1/2 lg:translate-x-1/2 h-[96%] aspect-square lg:h-auto lg:w-[86%] lg:max-w-[520px] xl:max-w-[640px]">
              <Image
                src={MASCOT}
                alt="The Stonegate mascot giving a thumbs up and holding a moving box"
                fill
                priority
                sizes="(min-width: 1024px) 26vw, 46vw"
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 lg:pl-[clamp(3rem,7vw,9rem)] lg:pr-12 pt-8 pb-16 lg:pt-14">
          {/* Desktop: starts near the green panel, towards the middle of the screen, and widens on big screens */}
          <div className="max-w-xl mx-auto lg:mx-0 lg:max-w-[640px] xl:max-w-[700px] 2xl:max-w-[760px]">
            <h1 className="text-3xl sm:text-4xl xl:text-[44px] font-black tracking-tight" style={{ color: INK }}>
              Get your free moving estimate
            </h1>
            <p className="mt-2 mb-8 text-base" style={{ color: MUTED }}>
              Takes about 2 minutes. We reply within 24 hours.
            </p>

            <OrderForm />

            <div className="flex flex-col gap-5 mt-10">
              {/* Google rating */}
              <a href={GOOGLE_PROFILE} target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl p-5 transition-shadow hover:shadow-md"
                style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}` }}>
                <GoogleLogo size={36} />
                <span className="flex-1 min-w-0">
                  <span className="block text-lg font-extrabold leading-tight" style={{ color: INK }}>Excellent on Google</span>
                  <span className="flex items-center gap-1.5 mt-1 text-sm font-bold" style={{ color: INK }}>
                    4.9
                    <span className="flex gap-0.5" aria-label="out of 5 stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg key={i} width="15" height="15" viewBox="0 0 24 24" aria-hidden><path fill="#E8A317" d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
                      ))}
                    </span>
                  </span>
                </span>
                <span className="hidden sm:inline-flex rounded-full px-4 py-2 text-sm font-bold transition-colors group-hover:bg-[#00341A]" style={{ backgroundColor: GREEN, color: '#FAF7F2' }}>
                  Read reviews
                </span>
              </a>

              <ReviewCarousel reviews={MOVING_REVIEWS} />

              {/* Contact */}
              <div className="rounded-2xl p-6 sm:p-7 flex flex-col gap-4" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${LINE}` }}>
                <PhoneLink className="flex items-center gap-3 text-xl font-extrabold hover:underline" style={{ color: GREEN, fontVariantNumeric: 'lining-nums tabular-nums' }}>
                  <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: GREEN }}>
                    <Phone size={18} fill="#FAF7F2" style={{ color: '#FAF7F2' }} aria-hidden />
                  </span>
                  <PhoneNumber />
                </PhoneLink>
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 text-base font-semibold hover:underline" style={{ color: INK }}>
                  <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#E8F0E6' }}>
                    <Mail size={18} style={{ color: GREEN }} aria-hidden />
                  </span>
                  {CONTACT_EMAIL}
                </a>
                <p className="flex items-center gap-3 text-base font-semibold" style={{ color: INK }}>
                  <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#E8F0E6' }}>
                    <MapPin size={18} style={{ color: GREEN }} aria-hidden />
                  </span>
                  <span>Based in Burnaby, BC<span className="block text-sm font-normal" style={{ color: MUTED }}>Moving all of Metro Vancouver</span></span>
                </p>
              </div>

              {/* Questions */}
              <div className="rounded-2xl p-6 sm:p-7 flex gap-4" style={{ backgroundColor: GREEN }}>
                <MessageCircleQuestion size={34} strokeWidth={1.6} className="shrink-0" style={{ color: '#F3E6D6' }} aria-hidden />
                <div>
                  <h2 className="text-lg font-extrabold" style={{ color: '#FAF7F2' }}>Questions about your move?</h2>
                  <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: '#CFE0CB' }}>
                    Call or email us before you book and we will talk it through with you:
                  </p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {HELP.map(item => (
                      <li key={item} className="flex items-start gap-2 text-[15px]" style={{ color: '#FAF7F2' }}>
                        <Check size={17} strokeWidth={3} className="shrink-0 mt-0.5" style={{ color: '#C98A45' }} aria-hidden /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
