import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sofa, Refrigerator, Tv, Flower2, Warehouse, HardHat, AlertTriangle } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { JsonLd, Breadcrumbs, CallButton, BookButton, CallBand, CityChips } from '@/components/seo/SeoBlocks'
import { JUNK_CATEGORIES, itemsInCategory, junkItemHref, JUNK_ITEMS, type JunkCategoryId } from '@/lib/seo/junk-items'
import { CITIES, cityJunkHref } from '@/lib/seo/cities'
import { SITE_URL, JUNK_BOOK_HREF, breadcrumbLd } from '@/lib/seo/site'

const URL = `${SITE_URL}/junk-removal/what-we-take`

export const metadata: Metadata = {
  title: { absolute: 'What We Take - Junk Removal Items | Stonegate Vancouver' },
  description: 'Everything we haul away in Metro Vancouver: furniture, mattresses, appliances, e-waste, hot tubs, yard waste, renovation debris and full cleanouts.',
  keywords: ['what junk removal takes', 'junk removal items', 'items we haul', 'junk removal list Vancouver', 'what can junk removal take'],
  alternates: { canonical: URL },
}

const ICONS: Record<JunkCategoryId, typeof Sofa> = {
  furniture: Sofa,
  appliances: Refrigerator,
  electronics: Tv,
  household: Flower2,
  cleanouts: Warehouse,
  construction: HardHat,
}

const crumbs = [
  { name: 'Home', href: '/' },
  { name: 'Junk Removal', href: '/junk-removal' },
  { name: 'What We Take', href: '/junk-removal/what-we-take' },
]

export default function WhatWeTakePage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <JsonLd graph={[
        breadcrumbLd(crumbs),
        {
          '@type': 'ItemList',
          name: 'Junk removal services',
          itemListElement: JUNK_ITEMS.map((i, n) => ({
            '@type': 'ListItem', position: n + 1, name: i.name, url: `${SITE_URL}${junkItemHref(i.slug)}`,
          })),
        },
      ]} />
      <Navbar />

      <main className="flex-1">
        <Breadcrumbs crumbs={crumbs} />

        <section>
          <div className="max-w-6xl mx-auto px-6 pt-8 pb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#A9743F' }}>What we take</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-5 max-w-3xl" style={{ color: '#1A1714' }}>
              If it&apos;s taking up space, we&apos;ll haul it away.
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl mb-8" style={{ color: '#4A3F38' }}>
              We take almost everything non-hazardous, from a single old couch to a whole-house cleanout. Pick an item below to see how we handle it, where it goes, and what it costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <CallButton big />
              <BookButton href={JUNK_BOOK_HREF} label="Book Online" />
            </div>
          </div>
        </section>

        <section style={{ borderTop: '1px solid #E8E0D5', backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-6">
            {JUNK_CATEGORIES.map(cat => {
              const Icon = ICONS[cat.id]
              return (
                <div key={cat.id} id={cat.id} className="rounded-3xl p-7 sm:p-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5', scrollMarginTop: '80px' }}>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#E8F0E6' }}>
                      <Icon size={22} style={{ color: '#254220' }} aria-hidden />
                    </span>
                    <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#1A1714' }}>{cat.name}</h2>
                  </div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B5E54' }}>{cat.blurb}</p>
                  <ul className="flex flex-col">
                    {itemsInCategory(cat.id).map(item => (
                      <li key={item.slug} style={{ borderTop: '1px solid #F0E9E0' }}>
                        <Link href={junkItemHref(item.slug)} className="group flex items-center justify-between gap-3 py-3">
                          <span className="text-[15px] font-bold group-hover:underline" style={{ color: '#014421' }}>{item.name}</span>
                          <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: '#014421' }} aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
          <div className="max-w-6xl mx-auto px-6 pb-16">
            <div className="flex items-start gap-3 rounded-2xl p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
              <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: '#B45309' }} aria-hidden />
              <p className="text-sm leading-relaxed" style={{ color: '#6B5E54' }}>
                <span className="font-bold" style={{ color: '#1A1714' }}>What we can&apos;t take: </span>
                hazardous waste, paint, solvents, chemicals, fuel and asbestos. Not sure? Call us and we&apos;ll point you in the right direction.
                See <Link href="/pricing/junk-removal" className="font-bold underline" style={{ color: '#014421' }}>junk removal pricing</Link>.
              </p>
            </div>
          </div>
        </section>

        <CallBand
          heading="Don't see your item?"
          text="We probably take it. Call us or send a request with a photo and we'll confirm in minutes."
          bookHref={JUNK_BOOK_HREF}
          bookLabel="Send a Request"
        />

        <section style={{ backgroundColor: '#F5F0EB' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <CityChips heading="Junk removal across Metro Vancouver" links={CITIES.map(c => ({ href: cityJunkHref(c), label: c.name }))} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
