'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

export interface ServiceCard {
  href: string
  kind: 'Moving' | 'Junk removal'
  name: string
  text: string
  image: { src: string; alt: string; pos?: string }
}

const GREEN = '#014421'
const INK = '#1A1714'
const MUTED = '#6B5E54'

/** Horizontally scrolling row of service cards with arrow buttons (swipe on touch screens) */
export default function ServicesCarousel({ cards, label }: { cards: ServiceCard[]; label: string }) {
  const row = useRef<HTMLUListElement>(null)

  const scroll = (dir: 1 | -1) => {
    const el = row.current
    if (!el) return
    const card = el.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || '16') : el.clientWidth * 0.8
    // Jump by as many whole cards as fit on screen
    const n = Math.max(1, Math.floor(el.clientWidth / step))
    el.scrollBy({ left: dir * step * n, behavior: 'smooth' })
  }

  return (
    <div>
      <ul
        ref={row}
        className="flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory pt-2 pb-5 px-4 sm:px-6 scroll-px-4 sm:scroll-px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={label}
      >
        {cards.map(c => (
          <li key={c.href} className="snap-start shrink-0 w-[84vw] max-w-[400px] sm:w-[400px] lg:w-[420px] lg:max-w-none">
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
                  style={{ objectPosition: c.image.pos ?? 'center' }}
                />
              </Link>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: MUTED }}>{c.kind}</p>
              <h3 className="text-lg lg:text-xl font-extrabold uppercase tracking-tight mb-2 px-1" style={{ color: GREEN }}>
                <Link href={c.href}>{c.name}</Link>
              </h3>
              <p className="text-[14px] lg:text-[15px] leading-relaxed mb-4 px-2 line-clamp-3" style={{ color: MUTED }}>{c.text}</p>
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
      {/* A short row fits on a desktop screen, so it needs no arrows there */}
      <div className={`flex justify-center gap-6 mt-2 ${cards.length <= 3 ? 'lg:hidden' : ''}`}>
        <button type="button" onClick={() => scroll(-1)} aria-label={`Previous - ${label}`} className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-[#E8F0E6]" style={{ border: `2px solid ${GREEN}`, color: INK }}>
          <ArrowLeft size={20} style={{ color: GREEN }} aria-hidden />
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label={`More - ${label}`} className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-[#E8F0E6]" style={{ border: `2px solid ${GREEN}`, color: INK }}>
          <ArrowRight size={20} style={{ color: GREEN }} aria-hidden />
        </button>
      </div>
    </div>
  )
}
