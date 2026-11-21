import type { Metadata } from 'next'

/** TEMPORARY: the homepage hero in three heading fonts, desktop and mobile. Delete app/type-compare once a font is chosen. */
export const metadata: Metadata = { title: 'Type compare', robots: { index: false, follow: false } }

const OPTIONS = [
  { slug: 'current', label: '1. Current: Montserrat 700' },
  { slug: 'instrument', label: '2. Instrument Sans 700' },
  { slug: 'general', label: '3. General Sans 700' },
  { slug: 'shrikhand', label: '4. Shrikhand (free, closest to Sway): whole headline' },
  { slug: 'leckerli', label: '5. Leckerli One (free retro script): whole headline' },
  { slug: 'accent-shrikhand', label: '6. Montserrat + Shrikhand on "Vancouver" only' },
  { slug: 'vietnam', label: '7. Be Vietnam Pro 700: headline only' },
  { slug: 'vietnam-all', label: '8. Be Vietnam Pro: headline and all text' },
]

export default function TypeCompare() {
  return (
    <main style={{ background: '#2A2433', padding: 24, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {OPTIONS.map(o => (
        <section key={o.slug} style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#fff', fontSize: 18, margin: '0 0 12px' }}>{o.label}</h2>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ width: 1440 * 0.6, height: 860 * 0.6, overflow: 'hidden', borderRadius: 8, background: '#fff', flexShrink: 0 }}>
              <iframe src={`/type-compare/${o.slug}`} title={`${o.label} desktop`} style={{ width: 1440, height: 860, border: 0, transform: 'scale(0.6)', transformOrigin: '0 0' }} />
            </div>
            <div style={{ width: 375 * 0.75, height: 812 * 0.75, overflow: 'hidden', borderRadius: 8, background: '#fff', flexShrink: 0 }}>
              <iframe src={`/type-compare/${o.slug}`} title={`${o.label} mobile`} style={{ width: 375, height: 812, border: 0, transform: 'scale(0.75)', transformOrigin: '0 0' }} />
            </div>
          </div>
        </section>
      ))}
    </main>
  )
}
