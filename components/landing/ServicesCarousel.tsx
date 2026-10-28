import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export interface ServiceCard {
  href: string
  kind: 'Moving' | 'Junk removal'
  name: string
  text: string
  image: { src: string; alt: string; pos?: string; brightness?: number }
}

const GREEN = '#014421'
const MUTED = '#6B5E54'

// Up to four cards sit in one row on desktop
const ONE_ROW: Record<number, string> = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }

/** Service cards: a swipe row on phones and tablets; on desktop one row of up to four, otherwise centred rows of 3 + 2 (one row of 5 on very wide screens) */
export default function ServicesCarousel({ cards, label }: { cards: ServiceCard[]; label: string }) {
  const oneRow = ONE_ROW[cards.length]
  const desktop = oneRow
    ? `lg:grid ${oneRow} lg:overflow-visible lg:max-w-6xl 3xl:max-w-7xl lg:mx-auto`
    : 'lg:flex-wrap lg:justify-center lg:overflow-visible lg:gap-y-6 lg:max-w-[1180px] min-[1950px]:max-w-[1900px] lg:mx-auto'
  return (
    <div>
      <ul
        className={`flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory pt-2 pb-5 px-4 sm:px-6 scroll-px-4 sm:scroll-px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${desktop}`}
        aria-label={label}
      >
        {cards.map(c => (
          <li key={c.href} className={`snap-start shrink-0 w-[84vw] max-w-[400px] sm:w-[400px] lg:max-w-none ${oneRow ? 'lg:w-auto' : 'lg:w-[360px]'}`}>
            <div
              className="group h-full flex flex-col rounded-[28px] p-3.5 pb-5 lg:p-5 lg:pb-6 text-center transition-shadow hover:shadow-lg"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0 6px 24px -12px rgba(26,23,20,0.18)' }}
            >
              <Link href={c.href} tabIndex={-1} aria-hidden className="relative block aspect-[16/9] rounded-[20px] overflow-hidden mb-4" style={{ backgroundColor: '#E8E0D5' }}>
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  sizes="(min-width: 1024px) 420px, 84vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: c.image.pos ?? 'center', filter: c.image.brightness ? `brightness(${c.image.brightness})` : undefined }}
                />
              </Link>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: MUTED }}>{c.kind}</p>
              <h3 className="text-lg lg:text-xl font-extrabold uppercase tracking-tight mb-2 px-1" style={{ color: GREEN }}>
                <Link href={c.href}>{c.name}</Link>
              </h3>
              <p className="text-[14px] lg:text-[15px] leading-relaxed mb-4 px-2 line-clamp-4" style={{ color: MUTED }}>{c.text}</p>
              <Link
                href={c.href}
                className="mt-auto self-center inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[15px] font-bold transition-colors hover:bg-[#014421] hover:text-[#FAF7F2]"
                style={{ border: `2px solid ${GREEN}`, color: GREEN }}
              >
                Learn More <ArrowUpRight size={16} aria-hidden />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
