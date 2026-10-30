import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, PackageCheck, ReceiptText, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import FadeIn from '@/components/landing/FadeIn'
import StickyCallBar from '@/components/landing/StickyCallBar'
import GoogleLogo from '@/components/GoogleLogo'
import { MovingReviews, MovingClose, GREEN, INK, MUTED, CREAM, CLAY, LINE, eyebrow, sectionWrap } from '@/components/moving/MovingSections'
import { CITIES } from '@/lib/seo/cities'
import { MOVE_BOOK_HREF } from '@/lib/seo/site'

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
    photo: { src: '/about/photo-4.jpg', alt: 'Two Stonegate movers lifting a box into the truck', pos: 'center 60%' },
  },
]

// The crew at work
const gallery = [
  { src: '/about/photo-2.jpg', alt: 'A Stonegate mover on the truck ramp under the Moving made effortless sign', pos: 'center 40%', caption: 'Ready on the ramp' },
  { src: '/about/photo-5.jpg', alt: 'A Stonegate mover arranging wrapped furniture inside the truck', pos: 'center 60%', caption: 'Packed tight, nothing shifts', brightness: 1.2 },
  { src: '/burnaby/burnaby-move-apartment-boxes.jpg', alt: 'A Stonegate mover carrying wrapped furniture up the ramp', pos: 'center 45%', caption: 'Up the ramp, piece by piece' },
  { src: '/junk/driver-hero-4627.jpg', alt: 'A Stonegate mover standing in front of the branded truck', pos: 'center 45%', caption: 'Your crew for the day' },
]

export default function AboutPage() {
  const facts = [
    { big: '4.9', small: 'Google rating', google: true },
    { big: 'Burnaby', small: 'where we are based' },
    { big: String(CITIES.length), small: 'cities across Metro Vancouver' },
    { big: 'Insured', small: 'every move is covered' },
  ]

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: CREAM }}>
      <Navbar />

      <main className="flex-1">
        {/* Hero: just who we are, no booking form */}
        <section id="about-hero" className="relative overflow-hidden" style={{ backgroundColor: INK }}>
          <Image
            src="/about/photo-3.jpg"
            alt="The three-person Stonegate crew standing in front of the moving truck"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: 'center 60%' }}
          />
          <div className="absolute inset-0 lg:hidden" style={{ background: 'radial-gradient(ellipse 130% 420px at 0% 0%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.35) 78%, transparent 100%)' }} />
          <div className="absolute inset-0 hidden lg:block" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.55) 25%, rgba(0,0,0,0.3) 45%, transparent 65%)' }} />
          <div className="relative max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 flex items-start lg:items-center min-h-[520px] sm:min-h-[600px] lg:min-h-[min(calc(80svh-68px),720px)] pt-14 pb-12 lg:py-16">
            <div>
              <h1 className="flex flex-col font-extrabold uppercase tracking-tight leading-none mb-5 w-fit" style={{ fontSize: 'clamp(2.4rem, 7.3vw, 4.8rem)' }}>
                <span className="[text-shadow:0_3px_8px_rgba(0,0,0,0.45)]" style={{ color: '#FFFFFF' }}>Meet the</span>
                <span className="flex items-center gap-3" style={{ fontSize: 'clamp(0.7rem, 1.6vw, 1rem)', margin: '0.45em 0', letterSpacing: '0.3em' }}>
                  <span style={{ flex: 0.3, height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4))' }} />
                  <span className="font-extrabold whitespace-nowrap [text-shadow:0_1px_6px_rgba(0,0,0,0.85)]" style={{ color: '#FFFFFF' }}>STONEGATE</span>
                  <span style={{ flex: 1.7, height: '1.5px', background: 'linear-gradient(to right, rgba(255,255,255,0.4), transparent)' }} />
                </span>
                <span className="[text-shadow:0_3px_8px_rgba(0,0,0,0.45)]" style={{ color: CLAY, fontSize: '1.15em' }}>Crew</span>
              </h1>
              <p className="text-[18px] sm:text-[21px] font-medium leading-snug max-w-[480px] [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.6)]" style={{ color: '#FFFFFF' }}>
                A young, local moving team from Burnaby, making moves across Metro Vancouver feel effortless.
              </p>
            </div>
          </div>
        </section>

        {/* Quick facts */}
        <section style={{ backgroundColor: GREEN }}>
          <ul className={`${sectionWrap} py-8 sm:py-10 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4`}>
            {facts.map(f => (
              <li key={f.small} className="text-center">
                <p className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: CREAM }}>
                  {f.google && <span className="w-9 h-9 rounded-full flex items-center justify-center bg-white"><GoogleLogo size={20} /></span>}
                  {f.big}
                </p>
                <p className="mt-1 text-[15px] font-semibold" style={{ color: '#B5C9B0' }}>{f.small}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Our story */}
        <section style={{ backgroundColor: CREAM }}>
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
                    Over time we added junk removal too, because the same things make every home service better: showing up on time, working hard, and leaving the place better than we found it.
                  </p>
                </div>
                <Link href={MOVE_BOOK_HREF} className="mt-9 inline-flex items-center justify-center gap-2 rounded-full min-h-[56px] px-7 font-extrabold transition-[transform,background-color] active:scale-[0.97] hover:bg-[#00341A]" style={{ backgroundColor: GREEN, color: CREAM }}>
                  Book Your Move With Us <ArrowRight size={18} aria-hidden />
                </Link>
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
            <p className="mt-8 flex items-center justify-center gap-2 text-base font-semibold" style={{ color: INK }}>
              <ShieldCheck size={20} style={{ color: GREEN }} aria-hidden /> Fully insured on every move
            </p>
          </div>
        </section>

        {/* The crew in action: swipe row on phones, grid on desktop */}
        <section style={{ backgroundColor: CREAM }}>
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
      <StickyCallBar watchId="about-hero" quoteHref={MOVE_BOOK_HREF} quoteLabel="Book Your Move" />
    </div>
  )
}
