import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

// Never crawled: the admin panel and the API
const PRIVATE = ['/api/', '/admin']

// Search and AI answer crawlers, allowed by name so the site can be found and cited in ChatGPT Search,
// Google AI Mode / AI Overviews, Bing / Copilot, Perplexity, Claude and Apple Intelligence
const SEARCH_BOTS = [
  'Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User',
  'Claude-SearchBot', 'Claude-User', 'Applebot', 'DuckDuckBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: SEARCH_BOTS, allow: '/', disallow: PRIVATE },
      { userAgent: '*', allow: '/', disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
