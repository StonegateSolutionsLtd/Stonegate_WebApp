import Link from 'next/link'

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g

/** Plain text with internal links written inline as [link text](/path), so content can link to related pages in context */
export default function LinkedText({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(LINK)) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(
      <Link key={m.index} href={m[2]} className="font-semibold underline underline-offset-2 hover:opacity-70" style={{ color: '#014421' }}>
        {m[1]}
      </Link>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

/** The same text with the link markup removed, for meta tags and structured data */
export function plainText(text: string) {
  return text.replace(LINK, '$1')
}
