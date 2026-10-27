import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Shield, DollarSign, Phone, ArrowRight } from 'lucide-react'
import { MOVE_BOOK_HREF } from '@/lib/seo/site'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import type { SkylineStyle } from '@/lib/seo/cities'

/** Deterministic PRNG so every city gets its own, stable skyline at build time */
function rng(seed: string) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

const W = 1440
const H = 560

export function Skyline({ seed, style }: { seed: string; style: SkylineStyle }) {
  const r = rng(seed)

  // Far layer: North Shore-style mountain ridge
  const ridge: string[] = [`M0 ${H}`, `L0 ${300 + r() * 40}`]
  for (let x = 0; x <= W; x += 120) ridge.push(`L${x + 60} ${200 + r() * 110}`, `L${x + 120} ${290 + r() * 50}`)
  ridge.push(`L${W} ${H}Z`)

  // Mid layer: towers
  const towerCount = style === 'city' ? 22 : style === 'suburb' ? 9 : 0
  const towers = Array.from({ length: towerCount }, () => {
    const w = 34 + r() * 46
    const h = (style === 'city' ? 150 : 80) + r() * (style === 'city' ? 190 : 90)
    return { x: r() * (W - w), w, h }
  })

  // Front layer: houses and trees along the bottom
  const front: { kind: 'house' | 'tree'; x: number; w: number; h: number }[] = []
  for (let x = -20; x < W; ) {
    const tree = r() < (style === 'village' ? 0.65 : style === 'suburb' ? 0.35 : 0.2)
    const w = tree ? 40 + r() * 30 : 90 + r() * 70
    const h = tree ? 70 + r() * 60 : 60 + r() * 40
    front.push({ kind: tree ? 'tree' : 'house', x, w, h })
    x += w + 6 + r() * 18
  }
  const base = H - 30

  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
    >
      <path d={ridge.join(' ')} fill="#0A5A31" />
      {towers.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={base - t.h} width={t.w} height={t.h} fill="#0D6236" />
          {Array.from({ length: Math.floor(t.h / 26) }, (_, j) => (
            <rect key={j} x={t.x + 8} y={base - t.h + 12 + j * 26} width={t.w - 16} height={6} fill="#13703F" />
          ))}
        </g>
      ))}
      {front.map((f, i) => f.kind === 'tree' ? (
        <path
          key={i}
          d={`M${f.x + f.w / 2} ${base - f.h} L${f.x + f.w} ${base - 8} L${f.x} ${base - 8} Z M${f.x + f.w / 2 - 4} ${base - 8} h8 v8 h-8 Z`}
          fill="#0F6939"
        />
      ) : (
        <g key={i} fill="#0F6939">
          <path d={`M${f.x} ${base - f.h * 0.55} L${f.x + f.w / 2} ${base - f.h} L${f.x + f.w} ${base - f.h * 0.55} V${base} H${f.x} Z`} />
          <rect x={f.x + f.w * 0.18} y={base - f.h * 0.42} width={f.w * 0.2} height={f.h * 0.18} fill="#16784A" />
          <rect x={f.x + f.w * 0.62} y={base - f.h * 0.42} width={f.w * 0.2} height={f.h * 0.18} fill="#16784A" />
        </g>
      ))}
      <rect x="0" y={base} width={W} height={H - base} fill="#0F6939" />
    </svg>
  )
}

export default function CityBanner({ city, slug, style, lead }: { city: string; slug: string; style: SkylineStyle; lead: string }) {
  return (
    <>
      <div className="text-center text-sm font-bold px-4 py-2.5" style={{ backgroundColor: '#E8F0E6', color: '#014421' }}>
        Local movers in {city} and all of Metro Vancouver - 2 movers and a truck from $120/hr + GST
      </div>
      <section className="relative overflow-hidden" style={{ backgroundColor: '#014421' }}>
        <Skyline seed={slug} style={style} />
        <div className="relative max-w-6xl mx-auto px-6 py-8 lg:py-10 grid lg:grid-cols-[1.45fr_1fr] gap-6 lg:gap-8 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-3 rounded-full px-3 py-1" style={{ color: '#C98A45', border: '1px solid rgba(201,138,69,0.5)' }}>
              <MapPin size={12} aria-hidden /> {city}, BC
            </p>
            <h1 className="font-extrabold uppercase tracking-tight leading-[0.95] mb-4" style={{ color: '#FFFFFF' }}>
              <span className="block text-4xl sm:text-5xl lg:text-6xl">{city}</span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl mt-1.5 [text-shadow:0_3px_8px_rgba(0,0,0,0.45)]" style={{ color: '#C98A45' }}>Movers</span>
            </h1>
            <p className="text-base leading-relaxed max-w-xl mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>{lead}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              <PhoneLink
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-extrabold transition-transform hover:scale-[1.03] w-full sm:w-auto"
                style={{ backgroundColor: '#FAF7F2', color: '#014421' }}
              >
                <Phone size={17} fill="currentColor" aria-hidden /> Call <PhoneNumber />
              </PhoneLink>
              {[{ href: MOVE_BOOK_HREF, label: 'Book Your Move Online' }].map(b => (
                <Link
                  key={b.href}
                  href={b.href}
                  className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 sm:px-5 py-3 text-[13px] sm:text-sm font-extrabold transition-opacity hover:opacity-85"
                  style={{ color: '#FAF7F2', border: '2px solid rgba(250,247,242,0.7)' }}
                >
                  {b.label} <ArrowRight size={15} aria-hidden />
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {([
                { Icon: Star, label: '4.9 Google Rating' },
                { Icon: Shield, label: 'Fully Insured' },
                { Icon: DollarSign, label: 'No Hidden Fees' },
              ] as const).map(({ Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  <Icon size={13} aria-hidden /> {label}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[420px] aspect-[3/2]">
            <Image
              src="/stonegate-mascot.png"
              alt={`Stonegate mover with the moving truck, serving ${city}`}
              fill
              preload
              sizes="(max-width: 640px) 240px, 420px"
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </>
  )
}
