import Image from 'next/image'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import HomeSections from '@/components/landing/HomeSections'
import BookingStart from '@/components/moving/BookingStart'
import MascotCouch from '@/components/landing/MascotCouch'
import GoogleStars from '@/components/GoogleStars'
import { Montserrat } from 'next/font/google'


/** Headlines: a bold geometric sans, in the spirit of Coca-Cola's headline face */
const headline = Montserrat({ subsets: ['latin'], weight: ['700', '800'] })

/** `headlineFont` / `accentFont` override the H1 typeface or just its last word (used only by the temporary /type-compare preview) */
export default function Hero({ headlineFont, accentFont }: { headlineFont?: string; accentFont?: string } = {}) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>

      <Navbar />

      <main className="flex-1">

        {/* Hero. A centred headline on white, then the truck photo and the quote form.
            Phones and tablets: the photo sits inside the purple quote card, with the mascot under it.
            Desktop (lg+): the quote form sits centred above the photo, which is a wide rounded panel,
            and the mascot pushes his couch along its bottom edge. */}
        <section style={{ backgroundColor: '#FFFFFF' }}>
          <div className="max-w-6xl 3xl:max-w-7xl mx-auto px-5 sm:px-6 pt-4 sm:pt-10 lg:pt-5 pb-2 lg:pb-12">
            <div className="flex justify-center mb-2.5 lg:mb-2"><GoogleStars onLight label="4.9 on Google" /></div>
            {/* The page's H1: the search people make */}
            <h1 className={`${headlineFont ?? headline.className} text-center font-bold leading-[1.08] tracking-[-0.02em] text-[clamp(2.3rem,6vw,4.4rem)] lg:text-[clamp(2.8rem,4vw,3.9rem)] lg:leading-[1.05]`} style={{ color: '#1E1530' }}>
              Professional Movers in <span className={accentFont} style={{ color: '#4B1D8F' }}>Vancouver</span>
            </h1>
            <p className="mt-2.5 lg:mt-2 mx-auto max-w-[580px] text-center text-[15px] sm:text-[19px] leading-snug" style={{ color: '#5F5870' }}>
              Local moving company providing house, apartment, condo and commercial moving services across Metro Vancouver.
            </p>

            <div className="flex flex-col">
            {/* Desktop: the truck photo in a wide rounded panel (below the form, with clear space between them), with the mascot pushing his couch along its bottom */}
            <div className="hidden lg:block lg:order-2 relative">
              <div className="relative h-[min(460px,calc(100svh-290px))] min-h-[340px] rounded-[32px] overflow-hidden" style={{ backgroundColor: '#E6DFF0' }}>
                <Image src="/hero-truck-home-natural.jpg" alt="Stonegate Moving Solutions truck outside a home" fill priority quality={88} sizes="(min-width: 1024px) 1150px, 1px" className="object-cover object-[72%_62%] xl:object-[64%_62%]" />
              </div>
              <MascotCouch className="absolute left-0 w-[34%] -bottom-[40px] h-[150px] justify-start pl-6 z-30" />
            </div>

            <div className="relative z-20 mt-5 lg:order-1 lg:mt-4 lg:mb-4 max-w-[760px] lg:max-w-none mx-auto w-full lg:flex lg:items-center lg:justify-center">
              {/* The quote card: the truck first (phones and tablets only), then the booking start on purple */}
              <div className="rounded-[28px] lg:rounded-[26px] overflow-hidden flex flex-col lg:w-[540px]" style={{ backgroundColor: '#4B1D8F', color: '#FFFFFF' }}>
                <div className="relative h-[165px] sm:h-[290px] lg:hidden">
                  <Image src="/hero-truck-home-natural.jpg" alt="Stonegate Moving Solutions truck outside a home" fill priority quality={85} sizes="(max-width: 1023px) 100vw, 1px" className="object-cover object-[60%_70%]" />
                </div>
                <div className="px-4 sm:px-8 lg:p-[4px] pt-5 sm:pt-6 pb-4 sm:pb-5">
                  <BookingStart center hideTitle phoneClassName="lg:hidden" />
                </div>
              </div>
            </div>
            {/* Phones and tablets: the mascot rolls a couch along right under the card, overlapping the top of the next section */}
            <div className="relative z-10 -mb-[34px] translate-y-[14px] lg:hidden">
              <MascotCouch />
            </div>
            </div>
          </div>
        </section>

        <HomeSections />

      </main>

      <Footer />
    </div>
  )
}
