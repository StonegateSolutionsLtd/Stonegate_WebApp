import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'
import { TEMPLATE_CITIES } from '@/lib/seo/cities'
import { PUBLISHED_GUIDES, guidePath } from '@/lib/guides'

/**
 * The date each page's content last changed in a way a reader would notice (YYYY-MM-DD).
 * Google only trusts lastmod when it tracks real edits, so it is never the build or request time:
 * when you substantively change a page (prices, crews, copy, FAQs, links in the text), update its date here.
 * Layout-only tweaks and site-wide footer/menu changes do not count.
 */
const PAGES: [path: string, updated: string][] = [
  ['', '2026-11-09'],
  ['/moving', '2026-11-09'],
  ['/residential-moving', '2026-11-09'],
  ['/commercial-moving', '2026-11-09'],
  ['/office-moving', '2026-11-09'],
  ['/packing-services', '2026-11-08'],
  ['/apartment-moving', '2026-11-09'],
  ['/long-distance-moving', '2026-11-08'],
  ['/senior-moving', '2026-11-08'],
  ['/specialty-moving', '2026-11-08'],
  ['/pricing/moving', '2026-11-08'],
  ['/locations', '2026-11-02'],
  ['/about', '2026-11-08'],
  ['/reviews', '2026-11-09'],
  ['/order', '2026-11-02'],
  ['/burnaby-movers', '2026-11-09'],
]

/** All city pages share one template and one data file (lib/seo/cities.ts), so they share a date */
const CITY_PAGES_UPDATED = '2026-11-08'

/** Only loc and lastmod: Google ignores priority and changefreq */
export default function sitemap(): MetadataRoute.Sitemap {
  const guidesUpdated = PUBLISHED_GUIDES.map(g => g.updated).sort().at(-1)
  return [
    ...PAGES.map(([path, updated]) => ({ url: `${SITE_URL}${path}`, lastModified: updated })),
    ...TEMPLATE_CITIES.map(c => ({ url: `${SITE_URL}/locations/${c.slug}`, lastModified: CITY_PAGES_UPDATED })),
    // The guides index changes when a guide is added or updated; each guide carries its own last substantive update; drafts stay out
    ...(guidesUpdated ? [{ url: `${SITE_URL}/guides`, lastModified: guidesUpdated }] : []),
    ...PUBLISHED_GUIDES.map(g => ({ url: `${SITE_URL}${guidePath(g)}`, lastModified: g.updated })),
  ]
}
