import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JunkAdLanding from '@/components/landing/JunkAdLanding'
import { JUNK_ADS, junkAdFor } from '@/lib/seo/junk-ads'
import { JsonLd } from '@/components/seo/SeoBlocks'
import { JUNK_ITEMS, JUNK_ITEM_BY_SLUG, junkItemHref, relatedItems } from '@/lib/seo/junk-items'
import { CITIES } from '@/lib/seo/cities'
import { SITE_URL, providerLd, breadcrumbLd, faqLd, type Faq } from '@/lib/seo/site'

export const dynamicParams = false

export function generateStaticParams() {
  return JUNK_ITEMS.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: PageProps<'/junk-removal/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const item = JUNK_ITEM_BY_SLUG.get(slug)
  if (!item) return {}
  const url = `${SITE_URL}${junkItemHref(slug)}`
  const ad = junkAdFor(item)
  // Google Ads pages get an ad-matching title; the rest keep their SEO titles
  const title = JUNK_ADS[slug] ? `${ad.headline} Vancouver | Same-Day Pickup | Stonegate` : `${item.title} | Stonegate`
  return {
    title: { absolute: title },
    description: item.description,
    keywords: item.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', url, title: item.title, description: item.description,
      images: [{ url: ad.itemPhoto.src, alt: ad.itemPhoto.alt }],
    },
  }
}

const sharedFaqs = (name: string): Faq[] => [
  { q: `Do you offer same-day ${name.toLowerCase()}?`, a: 'Often, yes. Same-day and next-day pickups are available across Metro Vancouver depending on the schedule. Call us for today\'s availability.' },
  { q: 'How is the price calculated?', a: `Junk removal is priced by the size of your load. The final price depends on how much there is, how heavy it is and how easy it is to reach. We estimate from your photos or description, then confirm the final price on-site before we start.` },
]

export default async function JunkItemPage({ params }: PageProps<'/junk-removal/[slug]'>) {
  const { slug } = await params
  const item = JUNK_ITEM_BY_SLUG.get(slug)
  if (!item) notFound()

  const related = relatedItems(item, 8)
  // Keep the FAQ short - the top three item questions plus the shared ones
  const faqs = [...item.faqs.slice(0, 3), ...sharedFaqs(item.name)]
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Junk Removal', href: '/junk-removal' },
    { name: 'What We Take', href: '/junk-removal/what-we-take' },
    { name: item.name, href: junkItemHref(item.slug) },
  ]

  return (
    <>
      <JsonLd graph={[
        {
          '@type': 'Service',
          name: `${item.name} - Metro Vancouver`,
          serviceType: item.name,
          description: item.description,
          url: `${SITE_URL}${junkItemHref(item.slug)}`,
          provider: providerLd,
          areaServed: CITIES.map(c => ({ '@type': 'City', name: c.name })),
        },
        breadcrumbLd(crumbs),
        faqLd(faqs),
      ]} />
      <JunkAdLanding item={item} ad={junkAdFor(item)} faqs={faqs} related={related} />
    </>
  )
}
