import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { type Crumb } from '@/lib/seo/site'

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

