import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Plus } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import StickyCallBar from '@/components/landing/StickyCallBar'
import { JsonLd } from '@/components/seo/SeoBlocks'
import { PhoneLink, PhoneNumber } from '@/components/PhoneNumber'
import LinkedText, { plainText } from '@/components/moving/LinkedText'
import GuideBody, { Credit, PAPER, TEXT, SOFT, FAINT, RULE, ACCENT, TINT, serif, label } from '@/components/guides/GuideBody'
import { ReadingProgress, CopyLink } from '@/components/guides/ArticleTools'
import { GUIDES, GUIDE_BY_SLUG, PUBLISHED_GUIDES, guidePath, readingMinutes } from '@/lib/guides'
import { SITE_URL, BUSINESS_NAME, MOVE_BOOK_HREF, breadcrumbLd, faqLd } from '@/lib/seo/site'

export const dynamicParams = false

export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }))
}

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })

export async function generateMetadata({ params }: PageProps<'/guides/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const guide = GUIDE_BY_SLUG.get(slug)
  if (!guide) return {}
  const url = `${SITE_URL}${guidePath(guide)}`
  return {
    title: { absolute: guide.metaTitle },
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: url },
    // Drafts are reachable for review but stay out of search until their facts are filled in
    ...(guide.draft ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'article',
      url,
      title: guide.title,
      description: guide.description,
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      images: [{ url: guide.hero.src, alt: guide.hero.alt }],
    },
  }
}

export default async function GuidePage({ params }: PageProps<'/guides/[slug]'>) {
  const { slug } = await params
  const guide = GUIDE_BY_SLUG.get(slug)
  if (!guide) notFound()

  const url = `${SITE_URL}${guidePath(guide)}`
  const more = PUBLISHED_GUIDES.filter(g => g.slug !== guide.slug)
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Guides', href: '/guides' },
    { name: guide.short, href: guidePath(guide) },
  ]

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: PAPER }}>
      <JsonLd graph={[
        {
          '@type': 'Article',
          '@id': `${url}#article`,
          headline: guide.title,
          description: guide.description,
          image: `${SITE_URL}${guide.hero.src}`,
          datePublished: guide.published,
          dateModified: guide.updated,
          inLanguage: 'en-CA',
          keywords: guide.keywords.join(', '),
          about: guide.keywords[0],
          abstract: plainText(guide.answer),
          mainEntityOfPage: url,
          author: { '@id': `${SITE_URL}/#business` },
          publisher: { '@id': `${SITE_URL}/#business` },
          ...(guide.sources?.length ? { citation: guide.sources.map(s => s.href) } : {}),
        },
        breadcrumbLd(crumbs),
        ...(guide.faqs?.length ? [faqLd(guide.faqs.map(f => ({ q: f.q, a: plainText(f.a) })))] : []),
      ]} />
      <ReadingProgress targetId="guide-article" />
      <Navbar />

      <main className="flex-1" style={{ color: TEXT }}>
        {guide.draft && (
          <div className="px-5 py-3 text-center text-sm font-bold" style={{ backgroundColor: '#F3E6D6', color: '#7A4F22' }}>
            Draft: not listed or indexed yet.
          </div>
        )}

        <article id="guide-article">
          {/* Headline, standfirst and byline */}
          <header id="guide-header" className="max-w-[760px] mx-auto px-5 pt-10 sm:pt-16">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] font-semibold mb-6" style={{ color: SOFT }}>
              <Link href="/guides" className="rounded-full px-3 py-1 transition-colors hover:bg-[#E3EBE1]" style={{ backgroundColor: TINT, color: ACCENT }}>Moving Guides</Link>
              <span style={{ color: FAINT }}>Metro Vancouver</span>
            </nav>
            <h1 className={`${serif} font-semibold text-[2.4rem] sm:text-[3.5rem] leading-[1.04] tracking-[-0.025em] mb-5`}>{guide.title}</h1>
            <p className="text-[1.1rem] sm:text-[1.25rem] leading-relaxed mb-8" style={{ color: SOFT }}>{guide.description}</p>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b" style={{ borderColor: RULE }}>
              <div className="flex items-center gap-3">
                <span className="relative w-11 h-11 rounded-full overflow-hidden shrink-0" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${RULE}` }}>
                  <Image src="/logo.png" alt="" fill sizes="44px" className="object-contain p-1.5" />
                </span>
                <div className="text-[13.5px] leading-tight">
                  <p>By <Link href="/about" className="font-bold hover:underline">{BUSINESS_NAME}</Link></p>
                  <p className="mt-1" style={{ color: SOFT }}>
                    Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time> · {readingMinutes(guide)} min read
                  </p>
                </div>
              </div>
              <CopyLink />
            </div>
          </header>

          <figure className="max-w-[1120px] mx-auto px-5 mt-10">
            <div className="relative aspect-[4/3] sm:aspect-[2/1] overflow-hidden rounded-3xl" style={{ backgroundColor: RULE }}>
              <Image src={guide.hero.src} alt={guide.hero.alt} fill priority sizes="(max-width: 1160px) 100vw, 1080px" className="object-cover" style={{ objectPosition: guide.hero.pos ?? 'center' }} />
            </div>
            <figcaption className="max-w-[720px] mx-auto mt-3 text-[13px] leading-snug" style={{ color: SOFT }}>
              {guide.hero.alt}.{guide.hero.credit && <span style={{ color: FAINT }}> <Credit credit={guide.hero.credit} /></span>}
            </figcaption>
          </figure>

          {/* The direct answer opens the story, set a size up, then the body */}
          <div className="max-w-[720px] mx-auto px-5 pt-10 sm:pt-14">
            <p className={`${serif} text-[21px] sm:text-[23px] leading-[1.6] mb-8`}>
              <LinkedText text={guide.answer} variant="article" />
            </p>
            {/* Key takeaways: the short summary skimmers and answer engines lift */}
            <section aria-label="Key takeaways" className="mb-4 rounded-2xl p-6 sm:p-7" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${RULE}` }}>
              <h2 className={`${label} mb-4`} style={{ color: ACCENT }}>Key takeaways</h2>
              <ul className="flex flex-col gap-3">
                {guide.takeaways.map(t => (
                  <li key={t} className="flex gap-3 text-[16px] leading-relaxed">
                    <span aria-hidden className="shrink-0 mt-[0.6em] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
            <GuideBody blocks={guide.body} />

            {guide.faqs && guide.faqs.length > 0 && (
              <section className="mt-16">
                <h2 className={`${serif} text-[1.65rem] sm:text-[2rem] font-semibold leading-tight tracking-[-0.015em] mb-5`}>Questions readers ask</h2>
                <div className="rounded-2xl px-5 sm:px-6" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${RULE}` }}>
                  {guide.faqs.map((f, n) => (
                    <details key={f.q} className="group py-4" style={n ? { borderTop: `1px solid ${RULE}` } : undefined}>
                      <summary className={`${serif} flex items-start justify-between gap-4 cursor-pointer list-none text-[1.15rem] font-semibold leading-snug`}>
                        {f.q}
                        <Plus size={18} className="shrink-0 mt-1 transition-transform group-open:rotate-45" style={{ color: ACCENT }} aria-hidden />
                      </summary>
                      <p className={`${serif} mt-2.5 text-[17.5px] leading-[1.65]`} style={{ color: SOFT }}><LinkedText text={f.a} variant="article" /></p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* A call to action that sits with the article rather than shouting over it */}
            <aside className="mt-14 rounded-3xl p-7 sm:p-9" style={{ backgroundColor: ACCENT, color: '#FFFFFF' }}>
              <p className={`${label} mb-3`} style={{ color: '#B5C9B0' }}>Planning a move?</p>
              <p className={`${serif} text-[1.6rem] sm:text-[1.9rem] font-semibold leading-tight tracking-[-0.01em] mb-3`}>Get a quote from the team that wrote this guide</p>
              <p className="text-[15.5px] leading-relaxed mb-6" style={{ color: '#D6E2D3' }}>Tell us what you are moving and when in about 2 minutes, or call and we will plan it with you.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={MOVE_BOOK_HREF} className="inline-flex items-center justify-center gap-2 rounded-full min-h-[50px] px-6 text-[15px] font-bold transition-transform active:scale-[0.97]" style={{ backgroundColor: '#FFFFFF', color: ACCENT }}>
                  Request a Moving Quote <ArrowRight size={16} aria-hidden />
                </Link>
                <PhoneLink className="inline-flex items-center justify-center gap-2 rounded-full min-h-[50px] px-6 text-[15px] font-bold border transition-colors hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#FFFFFF', fontVariantNumeric: 'lining-nums tabular-nums' }}>
                  Call <PhoneNumber />
                </PhoneLink>
              </div>
            </aside>

            {/* Trust: who wrote it, when the facts were checked, where they come from */}
            <footer className="mt-10 text-[13.5px] leading-relaxed flex flex-col gap-5" style={{ color: SOFT }}>
              <p>
                <span className="font-bold" style={{ color: TEXT }}>About this guide.</span> Written by the team at {BUSINESS_NAME}, a moving company based in Burnaby, B.C., from the moves we do across Metro Vancouver.
                Published <time dateTime={guide.published}>{formatDate(guide.published)}</time>; facts checked <time dateTime={guide.reviewed}>{formatDate(guide.reviewed)}</time>. Rates, rules and fees change, and we update this guide when they do.
              </p>
              {guide.sources && guide.sources.length > 0 && (
                <div>
                  <p className={`${label} mb-2`} style={{ color: TEXT }}>Sources</p>
                  <ol className="list-decimal pl-5 flex flex-col gap-1.5">
                    {guide.sources.map(s => (
                      <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-70">{s.label}</a></li>
                    ))}
                  </ol>
                </div>
              )}
            </footer>
          </div>
        </article>

        {/* Related reading: the service pages this guide supports, then the other guides */}
        <section className="max-w-[1120px] mx-auto px-5 mt-20 mb-20 w-full">
          <p className={`${label} mb-5`} style={{ color: SOFT }}>Related reading</p>
          <ul className="grid sm:grid-cols-3 gap-4">
            {guide.related.map(r => (
              <li key={r.href}>
                <Link href={r.href} className="group flex flex-col h-full rounded-2xl p-5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[#014421]" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${RULE}` }}>
                  <span className={`${serif} text-[1.2rem] font-semibold leading-snug`}>{r.label}</span>
                  <span className="mt-1.5 text-[14px] leading-snug" style={{ color: SOFT }}>{r.text}</span>
                  <span className="mt-auto pt-4 inline-flex items-center gap-1 text-[13px] font-bold" style={{ color: ACCENT }}>Read more <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
                </Link>
              </li>
            ))}
          </ul>
          {more.length > 0 && (
            <>
              <p className={`${label} mt-14 mb-5`} style={{ color: SOFT }}>More moving guides</p>
              <ul className="grid sm:grid-cols-2 gap-6">
                {more.map(g => (
                  <li key={g.slug}>
                    <Link href={guidePath(g)} className="group grid grid-cols-[112px_1fr] sm:grid-cols-[140px_1fr] gap-5 items-center">
                      <span className="relative block aspect-[4/3] overflow-hidden rounded-xl" style={{ backgroundColor: RULE }}>
                        <Image src={g.hero.src} alt="" fill sizes="140px" className="object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: g.hero.pos ?? 'center' }} />
                      </span>
                      <span>
                        <span className={`${serif} block text-[1.2rem] font-semibold leading-snug group-hover:underline underline-offset-2`}>{g.title}</span>
                        <span className="block mt-1.5 text-[13px]" style={{ color: SOFT }}>{readingMinutes(g)} min read</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>

      <Footer />
      <StickyCallBar watchId="guide-header" quoteHref={MOVE_BOOK_HREF} />
    </div>
  )
}
