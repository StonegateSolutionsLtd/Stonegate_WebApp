import Link from 'next/link'

/** [link text](/path) or **bold** */
const MARKUP = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g

/**
 * Plain text with internal links written inline as [link text](/path) and **bold** phrases, so content can link to related pages in context.
 * 'article' keeps links in the surrounding text colour with a green underline, as in an editorial body.
 */
export default function LinkedText({ text, variant = 'site' }: { text: string; variant?: 'site' | 'article' }) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(MARKUP)) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[3] !== undefined) {
      parts.push(<strong key={m.index} className="font-bold" style={variant === 'site' ? { color: '#1A1714' } : undefined}>{m[3]}</strong>)
    } else if (variant === 'article') {
      parts.push(<Link key={m.index} href={m[2]} className="underline decoration-[#014421]/50 decoration-[1.5px] underline-offset-[3px] hover:decoration-[#014421]">{m[1]}</Link>)
    } else {
      parts.push(<Link key={m.index} href={m[2]} className="font-semibold underline underline-offset-2 hover:opacity-70" style={{ color: '#014421' }}>{m[1]}</Link>)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

/** The same text with the markup removed, for meta tags and structured data */
export function plainText(text: string) {
  return text.replace(MARKUP, (_, label, _href, bold) => bold ?? label)
}
