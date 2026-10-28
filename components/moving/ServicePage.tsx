import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Phone, Plus } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import FadeIn from '@/components/landing/FadeIn'
import ServicesCarousel from '@/components/landing/ServicesCarousel'
import StickyCallBar from '@/components/landing/StickyCallBar'
import { JsonLd } from '@/components/seo/SeoBlocks'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import { SITE_URL, MOVE_BOOK_HREF, providerLd, faqLd } from '@/lib/seo/site'
import { CITIES, cityHref } from '@/lib/seo/cities'
import { movingServiceCards, type MovingService } from '@/lib/moving-services'
import { MovingHero, MovingPriceBlock, MovingReviews, CityPills, GREEN, INK, MUTED, CREAM, LINE, MASCOT, eyebrow, sectionWrap } from './MovingSections'

export default function ServicePage({ service }: { service: MovingService }) {
  const otherCards = movingServiceCards(service.slug)

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: CREAM }}>
      <JsonLd graph={[
        {
          '@type': 'Service',
          name: service.name,
          serviceType: 'Moving',
          description: service.metaDescription,
          url: `${SITE_URL}${service.path}`,
          provider: providerLd,
          areaServed: { '@type': 'AdministrativeArea', name: 'Metro Vancouver' },
        },
        faqLd(service.faqs),
      ]} />
      <Navbar />

      <main className="flex-1">

        <MovingHero heading={service.heading} intro={service.intro} photo={service.heroPhoto} />

        {/* What this service includes */}
        <section style={{ backgroundColor: CREAM }}>
          <div className={`${sectionWrap} py-16 sm:py-20 grid md:grid-cols-2 gap-12 items-center`}>
            <FadeIn className="order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden h-[420px] md:h-[540px]" style={{ backgroundColor: LINE }}>
                <Image src={service.listPhoto.src} alt={service.listPhoto.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" style={{ objectPosition: service.listPhoto.pos ?? 'center' }} />
              </div>
            </FadeIn>
            <FadeIn delay={120} className="order-1 md:order-2">
              <div>
                <p className={eyebrow} style={{ color: GREEN }}>{service.name}</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8" style={{ color: INK }}>{service.includedHeading}</h2>
                <ul className="flex flex-col gap-6 mb-9">
                  {service.included.map(item => (
                    <li key={item.title} id={item.id} className="flex gap-3" style={{ scrollMarginTop: '96px' }}>
                      <CheckCircle2 size={22} className="shrink-0 mt-0.5" style={{ color: GREEN }} aria-hidden />
                      <div>
                        <p className="font-bold text-lg" style={{ color: INK }}>{item.title}</p>
                        <p className="text-base leading-relaxed" style={{ color: MUTED }}>{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={MOVE_BOOK_HREF} className="flex items-center justify-center gap-2 rounded-full min-h-[56px] px-7 font-extrabold transition-[transform,background-color] active:scale-[0.97] hover:bg-[#00341A]" style={{ backgroundColor: GREEN, color: CREAM }}>
                    Check Moving Availability <ArrowRight size={18} aria-hidden />
                  </Link>
                  <PhoneLink className="flex items-center justify-center gap-2 rounded-full min-h-[56px] px-6 font-bold border-2 border-[#014421] transition-[transform,background-color] active:scale-[0.97] hover:bg-[#E8F0E6]" style={{ color: GREEN, fontVariantNumeric: 'lining-nums tabular-nums' }}>
                    Call <PhoneNumber />
                  </PhoneLink>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* How the move runs */}
        <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }}>
          <div className={`${sectionWrap} pt-16 sm:pt-20`}>
            <FadeIn>
              <p className={`${eyebrow} text-center`} style={{ color: GREEN }}>How it works</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10 sm:mb-14" style={{ color: INK }}>Your Move, Step by Step</h2>
            </FadeIn>
          </div>
          <ol className="flex lg:grid lg:grid-cols-4 gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory px-6 pb-16 sm:pb-20 scroll-px-6 max-w-6xl 3xl:max-w-7xl mx-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {service.steps.map((step, i) => (
              <li key={step.verb} className="snap-start shrink-0 w-[78vw] max-w-[320px] lg:w-auto lg:max-w-none">
                <FadeIn delay={i * 90} className="h-full">
                  <div className={`relative ${step.illustration ? 'aspect-square' : 'aspect-[4/5]'} rounded-2xl overflow-hidden mb-4`} style={{ backgroundColor: step.illustration ? '#FFFFFF' : LINE }}>
                    {step.illustration ? (
                      // Inset a little so the 520px artwork is never stretched past its own pixels
                      <Image src={step.illustration.src} alt={step.illustration.alt} fill quality={90} sizes="(max-width: 1024px) 66vw, 240px" className="object-contain p-[8%]" />
                    ) : step.photo && (
                      <Image src={step.photo.src} alt={step.photo.alt} fill sizes="(max-width: 1024px) 78vw, 280px" className="object-cover transition-transform duration-700 hover:scale-105" style={{ objectPosition: step.photo.pos ?? 'center' }} />
                    )}
                    <span className="absolute left-3 top-3 w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold" style={{ backgroundColor: GREEN, color: CREAM }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="font-bold text-lg mb-1" style={{ color: INK }}>{step.verb}</p>
                  <p className="text-base leading-relaxed" style={{ color: MUTED }}>{step.text}</p>
                </FadeIn>
              </li>
            ))}
          </ol>
        </section>

        <MovingPriceBlock note={service.priceNote} />

        <MovingReviews />

        {/* Questions, with the mascot beside them on desktop */}
        <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }}>
          <div className={`${sectionWrap} pt-16 grid lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16`}>
            <div className="flex flex-col">
              <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>{service.faqHeading}</h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: MUTED }}>Still have a question? Call us and we will walk you through it.</p>
              <PhoneLink className="self-start flex items-center gap-2 rounded-full min-h-[52px] px-6 font-bold border-2 border-[#014421] transition-[transform,background-color] active:scale-[0.97] hover:bg-[#E8F0E6]" style={{ color: GREEN, fontVariantNumeric: 'lining-nums tabular-nums' }}>
                <Phone size={16} fill="currentColor" aria-hidden /> Call <PhoneNumber />
              </PhoneLink>
              <div className="hidden lg:block relative mt-auto pt-10 w-full max-w-[340px] aspect-square">
                <Image src={MASCOT} alt="" fill sizes="340px" className="object-contain object-bottom" />
              </div>
            </div>
            <div className="flex flex-col pb-16">
              {service.faqs.map(f => (
                <details key={f.q} className="group py-5" style={{ borderBottom: `1px solid ${LINE}` }}>
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-bold text-lg" style={{ color: INK }}>
                    {f.q}
                    <Plus size={20} className="shrink-0 mt-0.5 transition-transform group-open:rotate-45" style={{ color: GREEN }} aria-hidden />
                  </summary>
                  <p className="mt-3 text-base leading-relaxed" style={{ color: MUTED }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Other moving services */}
        <section className="pb-10 lg:pb-12" style={{ borderTop: `1px solid ${LINE}`, backgroundColor: CREAM }}>
          <div className={`${sectionWrap} pt-12`}>
            <FadeIn>
              <p className={eyebrow} style={{ color: GREEN }}>More moving services</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-6" style={{ color: INK }}>We Can Also Help With</h2>
            </FadeIn>
          </div>
          <ServicesCarousel cards={otherCards} label="Other moving services" />
        </section>

        {/* Service areas */}
        <section style={{ borderTop: `1px solid ${LINE}`, backgroundColor: '#F5F0EB' }}>
          <div className={`${sectionWrap} py-16`}>
            <FadeIn>
              <p className={eyebrow} style={{ color: GREEN }}>Service areas</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>Movers Across Metro Vancouver</h2>
              <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: MUTED }}>Pick your city to see local moving details.</p>
            </FadeIn>
            <CityPills links={CITIES.map(c => ({ href: cityHref(c), label: c.name }))} />
          </div>
        </section>

        {/* Close: book or call, with the mascot standing on the band's bottom edge */}
        <section style={{ backgroundColor: GREEN }}>
          <div className={`${sectionWrap} relative grid md:grid-cols-[1.3fr_1fr] items-end gap-4`}>
            <div className="py-14 md:py-20">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: CREAM }}>Ready to book your move?</h2>
              <p className="text-base leading-relaxed max-w-lg mb-8" style={{ color: '#B5C9B0' }}>Pick a day and time online in a couple of minutes, or call and we will book it with you.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={MOVE_BOOK_HREF} className="flex items-center justify-center gap-2 rounded-full min-h-[56px] px-7 font-extrabold transition-[transform,background-color] active:scale-[0.97] hover:bg-white" style={{ backgroundColor: CREAM, color: GREEN }}>
                  Check Moving Availability <ArrowRight size={18} aria-hidden />
                </Link>
                <PhoneLink className="flex items-center justify-center gap-2 rounded-full min-h-[56px] px-6 font-bold border-2 border-[rgba(250,247,242,0.7)] transition-[transform,background-color] active:scale-[0.97] hover:bg-white/10" style={{ color: CREAM, fontVariantNumeric: 'lining-nums tabular-nums' }}>
                  <Phone size={16} fill="currentColor" aria-hidden /> Call <PhoneNumber />
                </PhoneLink>
              </div>
            </div>
            <div className="relative justify-self-center md:justify-self-end w-[240px] sm:w-[300px] lg:w-[380px] aspect-square -mb-px">
              <Image src={MASCOT} alt="Stonegate mascot giving a thumbs up and holding a moving box" fill sizes="(max-width: 768px) 240px, 380px" className="object-contain object-bottom" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCallBar watchId="booking-start" quoteHref={MOVE_BOOK_HREF} quoteLabel="Book Your Move" />
    </div>
  )
}
