import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import StickyCallBar from '@/components/landing/StickyCallBar'
import { JsonLd } from '@/components/seo/SeoBlocks'
import { ArrowRight } from 'lucide-react'
import { PAPER, TEXT, SOFT, RULE, ACCENT, TINT, serif, label } from '@/components/guides/GuideBody'
import { PUBLISHED_GUIDES, guidePath, readingMinutes } from '@/lib/guides'
import { SITE_URL, MOVE_BOOK_HREF, breadcrumbLd } from '@/lib/seo/site'

export const metadata: Metadata = {
  title: { absolute: 'Moving Guides for Metro Vancouver | Stonegate' },
  description: 'Practical moving guides from a Metro Vancouver moving company: condo elevator and strata rules, office relocation checklists, crew sizes and how long a move takes.',
  alternates: { canonical: `${SITE_URL}/guides` },
}

const crumbs = [
  { name: 'Home', href: '/' },
  { name: 'Guides', href: '/guides' },
]

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })

/** Newest first: the latest guide leads the page */
const guides = [...PUBLISHED_GUIDES].sort((a, b) => b.updated.localeCompare(a.updated) || b.published.localeCompare(a.published))

export default function GuidesPage() {
  const [lead, ...rest] = guides

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: PAPER }}>
      <JsonLd graph={[
        {
          '@type': 'CollectionPage',
          name: 'Stonegate Moving Guides',
          url: `${SITE_URL}/guides`,
          publisher: { '@id': `${SITE_URL}/#business` },
          hasPart: PUBLISHED_GUIDES.map(g => ({ '@type': 'Article', headline: g.title, url: `${SITE_URL}${guidePath(g)}` })),
        },
        breadcrumbLd(crumbs),
      ]} />
      <Navbar />

      <main className="flex-1 w-full max-w-[1120px] mx-auto px-5 pb-24" style={{ color: TEXT }}>
        <header id="guides-header" className="pt-12 sm:pt-16 pb-10 max-w-[720px]">
          <p className="inline-flex rounded-full px-3 py-1 text-[13px] font-semibold mb-5" style={{ backgroundColor: TINT, color: ACCENT }}>Stonegate Moving Guides</p>
          <h1 className={`${serif} font-semibold text-[2.6rem] sm:text-[3.8rem] leading-[1.02] tracking-[-0.03em] mb-4`}>Moving in Metro Vancouver, explained</h1>
          <p className="text-[1.1rem] sm:text-[1.2rem] leading-relaxed" style={{ color: SOFT }}>
            Straight answers from the crew that does the moves: building rules, timing, crew sizes and checklists for homes and offices.
          </p>
        </header>

        {lead && (
          <Link href={guidePath(lead)} className="group grid md:grid-cols-[1.3fr_1fr] rounded-3xl overflow-hidden transition-shadow hover:shadow-[0_18px_48px_-24px_rgba(28,26,23,0.35)]" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${RULE}` }}>
            <span className="relative block aspect-[3/2] md:aspect-auto md:min-h-[380px] overflow-hidden" style={{ backgroundColor: RULE }}>
              <Image src={lead.hero.src} alt={lead.hero.alt} fill priority sizes="(max-width: 768px) 100vw, 620px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" style={{ objectPosition: lead.hero.pos ?? 'center' }} />
            </span>
            <span className="flex flex-col p-7 sm:p-9">
              <span className={`${label} mb-4`} style={{ color: ACCENT }}>Latest</span>
              <span className={`${serif} font-semibold text-[1.9rem] sm:text-[2.3rem] leading-[1.08] tracking-[-0.02em] mb-4`}>{lead.title}</span>
              <span className="text-[15.5px] leading-relaxed mb-6" style={{ color: SOFT }}>{lead.description}</span>
              <span className="mt-auto flex items-center justify-between text-[13px]" style={{ color: SOFT }}>
                <span>{formatDate(lead.updated)} · {readingMinutes(lead)} min read</span>
                <span className="inline-flex items-center gap-1 font-bold" style={{ color: ACCENT }}>Read <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
              </span>
            </span>
          </Link>
        )}

        {rest.length > 0 && (
          <ul className="mt-6 grid sm:grid-cols-2 gap-6">
            {rest.map(g => (
              <li key={g.slug}>
                <Link href={guidePath(g)} className="group flex flex-col h-full rounded-3xl overflow-hidden transition-shadow hover:shadow-[0_18px_48px_-24px_rgba(28,26,23,0.35)]" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${RULE}` }}>
                  <span className="relative block aspect-[16/9] overflow-hidden" style={{ backgroundColor: RULE }}>
                    <Image src={g.hero.src} alt="" fill sizes="(max-width: 640px) 100vw, 540px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" style={{ objectPosition: g.hero.pos ?? 'center' }} />
                  </span>
                  <span className="flex flex-col flex-1 p-6 sm:p-7">
                    <span className={`${serif} font-semibold text-[1.45rem] leading-[1.15] tracking-[-0.01em] mb-3`}>{g.title}</span>
                    <span className="text-[15px] leading-relaxed mb-5" style={{ color: SOFT }}>{g.description}</span>
                    <span className="mt-auto flex items-center justify-between text-[13px]" style={{ color: SOFT }}>
                      <span>{formatDate(g.updated)} · {readingMinutes(g)} min read</span>
                      <span className="inline-flex items-center gap-1 font-bold" style={{ color: ACCENT }}>Read <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
      <StickyCallBar watchId="guides-header" quoteHref={MOVE_BOOK_HREF} />
    </div>
  )
}
