import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'
import { JUNK_ITEMS, junkItemHref } from '@/lib/seo/junk-items'
import { TEMPLATE_CITIES } from '@/lib/seo/cities'

type Entry = [path: string, priority: number, freq?: MetadataRoute.Sitemap[number]['changeFrequency']]

const STATIC: Entry[] = [
  ['', 1],
  ['/moving', 0.95],
  ['/residential-moving', 0.9],
  ['/commercial-moving', 0.9],
  ['/packing-services', 0.9],
  ['/pricing/moving', 0.9],
  ['/locations', 0.85],
  ['/about', 0.7],
  ['/junk-removal', 0.6],
  ['/pricing/junk-removal', 0.5],
  ['/junk-removal/what-we-take', 0.5],
  ['/order', 0.7, 'yearly'],
  ['/book-service', 0.6, 'yearly'],
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const entries: Entry[] = [
    ...STATIC,
    ['/burnaby-movers', 0.85],
    ['/burnaby-junk-removal', 0.5],
    ...TEMPLATE_CITIES.map((c): Entry => [`/locations/${c.slug}`, 0.85]),
    ...JUNK_ITEMS.map((i): Entry => [junkItemHref(i.slug), 0.4]),
  ]
  return entries.map(([path, priority, freq = 'monthly']) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: freq,
    priority,
  }))
}
