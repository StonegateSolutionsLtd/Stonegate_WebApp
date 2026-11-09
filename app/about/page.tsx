import type { Metadata } from 'next'
import Image from 'next/image'
import { CircleCheck, Clock, HardHat, PackageCheck, ReceiptText, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import GoogleStars from '@/components/GoogleStars'
import FadeIn from '@/components/landing/FadeIn'
import StickyCallBar from '@/components/landing/StickyCallBar'
import GoogleLogo from '@/components/GoogleLogo'
import { MovingReviews, MovingClose, GREEN, INK, MUTED, CREAM, CLAY, LINE, eyebrow, sectionWrap } from '@/components/moving/MovingSections'
import { CITIES } from '@/lib/seo/cities'
import { MOVE_BOOK_HREF, WORKSAFEBC_STATEMENT } from '@/lib/seo/site'

export const metadata: Metadata = {
  title: { absolute: 'About Us | Stonegate Moving Solutions' },
  description: 'Meet the Stonegate Moving Solutions crew - a local moving team based in Burnaby, serving every city in Metro Vancouver.',
  alternates: { canonical: 'https://www.stonegatemoving.com/about' },
}

// What the crew does on every job, with a real photo of it
const values = [
  {
    Icon: Clock,
    title: 'On time, every time',
    text: 'We respect your schedule. The crew shows up when we say we will, ready to work.',
    photo: { src: '/about/team-truck.png', alt: 'A Stonegate mover walking a dolly to the truck on a sunny street', pos: 'center 55%' },
  },
  {
    Icon: PackageCheck,
    title: 'Careful with your things',
    text: 'Blankets, straps and plastic wrap on every piece. We treat every home like our own.',
    photo: { src: '/moving/protect-wrapped-furniture.png', alt: 'A Stonegate mover wrapping furniture in a moving blanket inside a home', pos: 'center 55%' },
  },
  {
    Icon: ReceiptText,
    title: 'Clear, hourly pricing',
    text: 'You know the rate before you book: $130 an hour for 2 movers, $170 for 3, plus GST.',
    photo: { src: '/about/photo-4-warm.png', alt: 'Two Stonegate movers lifting a box into the truck', pos: 'center 60%' },
  },
]

// A move with us, from booking to the last box (same terms as the pricing page)
const steps = [
  { title: 'Request your estimate', text: 'Tell us where you are moving from and to, and roughly what is coming. It takes a couple of minutes online, or call and we will do it with you.' },
  { title: 'Know the price before you book', text: 'You get the hourly rate for your crew and the fixed travel fee upfront. Stairs or a long carry? We talk about it now, not on moving day.' },
  { title: 'Moving day', text: 'The crew arrives on time with a fully equipped truck. The clock starts when we arrive at your pickup and stops once everything is in place at your new home.' },
  { title: 'Pay when it is done', text: 'Payment is collected after the job is complete, by e-transfer, credit card or cash.' },
]

// Included in the hourly rate on every move
const included = [
  'Moving blankets and stretch wrap for your furniture',
  'Dollies, straps and tools on the truck',
  'Furniture taken apart and put back together',
  'CGL insurance for damage to property',
]

// The crew at work
const gallery = [
  { src: '/about/photo-2.jpg', alt: 'A Stonegate mover on the truck ramp under the Moving made effortless sign', pos: 'center 40%', caption: 'Ready on the ramp' },
  { src: '/about/photo-5.jpg', alt: 'A Stonegate mover arranging wrapped furniture inside the truck', pos: 'center 60%', caption: 'Packed tight, nothing shifts', brightness: 1.2 },
  { src: '/burnaby/burnaby-move-truck-loading-bright.png', alt: 'A Stonegate mover carrying wrapped furniture up the ramp', pos: 'center 45%', caption: 'Up the ramp, piece by piece' },
  { src: '/junk/driver-hero-4627.jpg', alt: 'A Stonegate mover standing in front of the branded truck', pos: 'center 45%', caption: 'Your crew for the day' },
]

export default function AboutPage() {
  const facts = [
    { big: '4.9', small: 'Google rating', google: true },
    { big: 'Burnaby', small: 'where we are based' },
    { big: String(CITIES.length), small: 'cities we serve' },
  ]
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: CREAM }}>
      <Navbar />

      <main className="flex-1">
        {/* Hero: who we are, with the crew photo in a rounded frame */}
        <section id="about-hero" style={{ backgroundColor: CREAM }}>
          <div className={`${sectionWrap} pt-10 pb-14 sm:pt-14 lg:py-16 short:py-10 grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center`}>
            <div>
              <GoogleStars onLight className="mb-5" />
              <p className={eyebrow} style={{ color: GREEN }}>About Stonegate</p>
              <h1 className="text-[2.6rem] sm:text-6xl short:text-[3.4rem] font-extrabold tracking-tight leading-[1.02] mb-5" style={{ color: INK }}>
                Meet the <span style={{ color: CLAY }}>Stonegate Crew</span>
              </h1>
              <p className="text-[18px] sm:text-xl leading-relaxed max-w-[520px] mb-8" style={{ color: MUTED }}>
                A young, local moving team from Burnaby, making moves across Metro Vancouver feel effortless. The people who answer your call are the people who show up with the truck.
              </p>
              <ul className="grid grid-cols-3 max-w-[520px]" style={{ borderTop: `1px solid ${LINE}` }}>
                {facts.map((f, i) => (
                  <li key={f.small} className={`pt-5 ${i ? 'pl-4 sm:pl-6' : ''}`} style={i ? { borderLeft: `1px solid ${LINE}` } : undefined}>
                    <p className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: INK }}>
                      {f.google && <GoogleLogo size={20} />}{f.big}
                    </p>
                    <p className="mt-0.5 text-[13px] sm:text-sm font-semibold" style={{ color: MUTED }}>{f.small}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="relative rounded-[28px] overflow-hidden aspect-[4/3] shadow-[0_24px_60px_-28px_rgba(26,23,20,0.45)]" style={{ backgroundColor: LINE }}>
                <Image
                  src="/about/photo-3.jpg"
                  alt="The three-person Stonegate crew standing in front of the moving truck"
                  fill
                  priority
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover"
                  style={{ objectPosition: 'center 60%' }}
                />
              </div>
              <div className="absolute -bottom-6 left-4 sm:left-6 lg:-left-6 flex items-center gap-3 rounded-2xl px-4 py-3 bg-white shadow-[0_12px_32px_-12px_rgba(26,23,20,0.35)]">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: GREEN }}>
                  <ShieldCheck size={20} style={{ color: CREAM }} aria-hidden />
                </span>
                <span className="leading-tight">
                  <span className="block text-[15px] font-extrabold" style={{ color: INK }}>Insured</span>
                  <span className="block text-[13px] font-medium" style={{ color: MUTED }}>CGL for damage to property</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Our story */}
        <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }}>
          <div className={`${sectionWrap} py-16 sm:py-24 grid md:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center`}>
            <FadeIn>
              <div>
                <p className={eyebrow} style={{ color: GREEN }}>Our story</p>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-7" style={{ color: INK }}>
                  Moving Should Be Easy. <span style={{ color: CLAY }}>So We Made It That Way.</span>
                </h2>
                <div className="flex flex-col gap-5 text-[17px] sm:text-lg leading-relaxed" style={{ color: INK }}>
                  <p>
                    Stonegate Moving Solutions started with a simple idea: moving should be easy. We saw too many people stressed out by unreliable movers, hidden fees and careless handling, and we knew we could do better.
                  </p>
                  <p>
                    We&apos;re a young, driven team based right here in Metro Vancouver. Every job gets our full attention, whether it&apos;s a studio across town or a whole family home.
                  </p>
                  <p>
                    We keep it simple on purpose: one hourly rate you know before booking, a travel fee we tell you upfront, and a crew that wraps every piece of furniture without charging extra for blankets or stretch wrap.
                  </p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-[460px] mx-auto md:ml-auto" style={{ backgroundColor: LINE }}>
                <Image src="/about/photo-6.png" alt="The Stonegate crew sitting on the roof of their moving truck" fill sizes="(max-width: 768px) 100vw, 460px" className="object-cover" style={{ objectPosition: 'center 48%' }} />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* What we stand for, each with a photo */}
        <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: '#F5F0EB' }}>
          <div className={`${sectionWrap} py-16 sm:py-20`}>
            <FadeIn>
              <p className={`${eyebrow} text-center`} style={{ color: GREEN }}>What we stand for</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-10 sm:mb-14" style={{ color: INK }}>How We Work on Every Move</h2>
            </FadeIn>
            <ul className="grid md:grid-cols-3 gap-6">
              {values.map(({ Icon, title, text, photo }, i) => (
                <li key={title}>
                  <FadeIn delay={i * 100} className="h-full">
                    <div className="h-full rounded-3xl overflow-hidden flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
                      <div className="relative aspect-[4/3]" style={{ backgroundColor: LINE }}>
                        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" style={{ objectPosition: photo.pos }} />
                        <span className="absolute left-4 -bottom-6 w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: GREEN }}>
                          <Icon size={22} style={{ color: CREAM }} aria-hidden />
                        </span>
                      </div>
                      <div className="p-6 pt-10">
                        <h3 className="text-xl font-extrabold mb-2" style={{ color: INK }}>{title}</h3>
                        <p className="text-base leading-relaxed" style={{ color: MUTED }}>{text}</p>
                      </div>
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-center gap-2 text-center">
              <p className="flex items-center justify-center gap-2 text-base font-semibold" style={{ color: INK }}>
                <ShieldCheck size={20} style={{ color: GREEN }} aria-hidden /> CGL insurance for property damage on every move
              </p>
              <p className="flex items-center justify-center gap-2 text-[15px]" style={{ color: MUTED }}>
                <HardHat size={18} style={{ color: GREEN }} aria-hidden /> {WORKSAFEBC_STATEMENT}
              </p>
            </div>
          </div>
        </section>

        {/* How a move with us works, step by step */}
        <section style={{ backgroundColor: CREAM }}>
          <div className={`${sectionWrap} py-16 sm:py-20 grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16`}>
            <FadeIn>
              <p className={eyebrow} style={{ color: GREEN }}>How we work</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1] mb-5" style={{ color: INK }}>
                No Surprises, From the First Call to the Last Box
              </h2>
              <p className="text-[17px] leading-relaxed mb-8" style={{ color: MUTED }}>
                Everything that affects your price is settled before moving day, so the day itself is just the move.
              </p>
              <ul className="flex flex-col gap-3">
                {included.map(item => (
                  <li key={item} className="flex items-start gap-3 text-[16px] font-semibold" style={{ color: INK }}>
                    <CircleCheck size={20} className="shrink-0 mt-0.5" style={{ color: GREEN }} aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <ol className="flex flex-col gap-4">
              {steps.map((st, i) => (
                <li key={st.title}>
                  <FadeIn delay={i * 80}>
                    <div className="flex gap-5 rounded-3xl p-6 sm:p-7 bg-white" style={{ border: `1px solid ${LINE}` }}>
                      <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-lg font-extrabold" style={{ backgroundColor: '#E8F0E6', color: GREEN }}>{i + 1}</span>
                      <div>
                        <h3 className="text-lg sm:text-xl font-extrabold mb-1.5" style={{ color: INK }}>{st.title}</h3>
                        <p className="text-base leading-relaxed" style={{ color: MUTED }}>{st.text}</p>
                      </div>
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* The crew in action: swipe row on phones, grid on desktop */}
        <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }}>
          <div className={`${sectionWrap} pt-16 sm:pt-20`}>
            <FadeIn>
              <p className={eyebrow} style={{ color: GREEN }}>The team in action</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8" style={{ color: INK }}>A Day on the Job</h2>
            </FadeIn>
          </div>
          <ul className="flex lg:grid lg:grid-cols-4 gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory px-6 pb-16 sm:pb-20 scroll-px-6 max-w-6xl 3xl:max-w-7xl mx-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gallery.map((g, i) => (
              <li key={g.src} className="snap-start shrink-0 w-[72vw] max-w-[300px] lg:w-auto lg:max-w-none">
                <FadeIn delay={i * 80}>
                  <figure className="relative aspect-[3/4] rounded-2xl overflow-hidden group" style={{ backgroundColor: LINE }}>
                    <Image src={g.src} alt={g.alt} fill sizes="(max-width: 1024px) 72vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: g.pos, filter: g.brightness ? `brightness(${g.brightness})` : undefined }} />
                    <figcaption className="absolute inset-x-0 bottom-0 p-4 pt-12 text-[15px] font-bold" style={{ color: '#FFFFFF', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                      {g.caption}
                    </figcaption>
                  </figure>
                </FadeIn>
              </li>
            ))}
          </ul>
        </section>

        <MovingReviews />

        <MovingClose
          heading="Ready to work with us?"
          text="Pick a day and time online in a couple of minutes, or call and we will book it with you."
        />
      </main>

      <Footer />
      <StickyCallBar watchId="about-hero" quoteHref={MOVE_BOOK_HREF} />
    </div>
  )
}
