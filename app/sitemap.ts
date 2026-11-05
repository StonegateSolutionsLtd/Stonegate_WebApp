import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'
import { TEMPLATE_CITIES } from '@/lib/seo/cities'

type Entry = [path: string, priority: number, freq?: MetadataRoute.Sitemap[number]['changeFrequency']]

const STATIC: Entry[] = [
  ['', 1],
  ['/moving', 0.95],
  ['/residential-moving', 0.9],
  ['/commercial-moving', 0.9],
  ['/office-moving', 0.9],
  ['/packing-services', 0.9],
  ['/apartment-moving', 0.9],
  ['/long-distance-moving', 0.9],
  ['/senior-moving', 0.85],
  ['/specialty-moving', 0.85],
  ['/pricing/moving', 0.9],
  ['/locations', 0.85],
  ['/about', 0.7],
  ['/order', 0.7, 'yearly'],
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const entries: Entry[] = [
    ...STATIC,
    ['/burnaby-movers', 0.85],
    ...TEMPLATE_CITIES.map((c): Entry => [`/locations/${c.slug}`, 0.85]),
  ]
  return entries.map(([path, priority, freq = 'monthly']) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: freq,
    priority,
  }))
}
