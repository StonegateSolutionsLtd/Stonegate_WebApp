import Link from 'next/link'
import { ChevronRight, Phone, ArrowRight, MapPin, Plus } from 'lucide-react'
import { type Crumb, type Faq } from '@/lib/seo/site'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'

export function JsonLd({ graph }: { graph: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  )
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-6 pt-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold" style={{ color: '#9A8E83' }}>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} aria-hidden />}
            {i < crumbs.length - 1
              ? <Link href={c.href} className="hover:underline" style={{ color: '#6B5E54' }}>{c.name}</Link>
              : <span aria-current="page" style={{ color: '#1A1714' }}>{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function CallButton({ big = false, light = false }: { big?: boolean; light?: boolean }) {
  return (
    <PhoneLink
      className={`inline-flex items-center justify-center gap-3 rounded-full font-extrabold transition-transform hover:scale-[1.03] ${big ? 'px-9 py-5 text-lg sm:text-xl' : 'px-7 py-4 text-base'}`}
      style={light ? { backgroundColor: '#FAF7F2', color: '#014421' } : { backgroundColor: '#014421', color: '#FAF7F2' }}
    >
      <Phone size={big ? 22 : 18} fill="currentColor" aria-hidden />
      <span>Call <PhoneNumber /></span>
    </PhoneLink>
  )
}

export function BookButton({ href, label, light = false }: { href: string; label: string; light?: boolean }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-extrabold transition-opacity hover:opacity-85"
      style={light
        ? { color: '#FAF7F2', border: '2px solid rgba(250,247,242,0.7)' }
        : { color: '#014421', border: '2px solid #014421' }}
    >
      {label} <ArrowRight size={16} aria-hidden />
    </Link>
  )
}

export function CallBand({ heading, text, bookHref, bookLabel }: { heading: string; text: string; bookHref: string; bookLabel: string }) {
  return (
    <section style={{ backgroundColor: '#014421' }}>
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row lg:items-center gap-8 lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: '#FAF7F2' }}>{heading}</h2>
          <p className="text-base leading-relaxed" style={{ color: '#B5C9B0' }}>{text}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <CallButton big light />
          <BookButton href={bookHref} label={bookLabel} light />
        </div>
      </div>
    </section>
  )
}

export function FaqList({ faqs, heading = 'Common questions' }: { faqs: Faq[]; heading?: string }) {
  return (
    <section style={{ borderTop: '1px solid #E8E0D5' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold tracking-tight mb-8" style={{ color: '#1A1714' }}>{heading}</h2>
        <div className="flex flex-col">
          {faqs.map(f => (
            <details key={f.q} className="group py-5" style={{ borderBottom: '1px solid #E8E0D5' }}>
              <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-bold" style={{ color: '#1A1714' }}>
                {f.q}
                <Plus size={18} className="shrink-0 mt-0.5 transition-transform group-open:rotate-45" style={{ color: '#014421' }} aria-hidden />
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6B5E54' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export interface LinkItem { href: string; label: string; sub?: string }

export function LinkGrid({ eyebrow, heading, links, cols = 4 }: { eyebrow?: string; heading: string; links: LinkItem[]; cols?: 2 | 3 | 4 }) {
  const grid = cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : cols === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'
  return (
    <div>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#A9743F' }}>{eyebrow}</p>}
      <h2 className="text-2xl font-extrabold tracking-tight mb-6" style={{ color: '#1A1714' }}>{heading}</h2>
      <ul className={`grid grid-cols-1 ${grid} gap-3`}>
        {links.map(l => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 h-full transition-colors hover:bg-[#F5F0EB]"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}
            >
              <span>
                <span className="block text-sm font-bold" style={{ color: '#1A1714' }}>{l.label}</span>
                {l.sub && <span className="block text-xs mt-0.5" style={{ color: '#9A8E83' }}>{l.sub}</span>}
              </span>
              <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: '#014421' }} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CityChips({ links, heading }: { links: LinkItem[]; heading: string }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight mb-6" style={{ color: '#1A1714' }}>{heading}</h2>
      <ul className="flex flex-wrap gap-2.5">
        {links.map(l => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#E8F0E6]"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', color: '#1A1714' }}
            >
              <MapPin size={13} style={{ color: '#014421' }} aria-hidden /> {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PricingTeaser({ text }: { text: string }) {
  return (
    <div className="rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-6 justify-between" style={{ backgroundColor: '#254220' }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#B5C9B0' }}>Upfront pricing</p>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-5xl font-extrabold leading-none" style={{ color: '#FAF7F2' }}>$150</span>
          <span className="text-base font-semibold mb-1" style={{ color: '#B5C9B0' }}>and up</span>
        </div>
        <p className="text-sm max-w-md" style={{ color: '#B5C9B0' }}>{text}</p>
      </div>
      <Link
        href="/pricing/junk-removal"
        className="inline-flex items-center gap-2 self-start sm:self-center rounded-full px-7 py-3.5 text-sm font-extrabold shrink-0"
        style={{ backgroundColor: '#FAF7F2', color: '#254220' }}
      >
        See Junk Removal Pricing <ArrowRight size={15} aria-hidden />
      </Link>
    </div>
  )
}
