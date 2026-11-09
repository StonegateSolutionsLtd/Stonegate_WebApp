import Image from 'next/image'
import { Check, Info, Lightbulb, Truck } from 'lucide-react'
import LinkedText from '@/components/moving/LinkedText'
import type { GuideBlock, GuideCredit } from '@/lib/guides'

/** Editorial palette: warm off-white page, near-black text, green for small accents */
export const PAPER = '#FBF9F6'
export const TEXT = '#1C1A17'
export const SOFT = '#5E554D'
export const FAINT = '#8A8077'
export const RULE = '#E3DCD2'
export const ACCENT = '#014421'
export const TINT = '#EEF3EC'

/** Serif for reading; labels, captions, tables and UI stay in the site's sans */
export const serif = 'font-[family-name:var(--font-news)]'
export const label = 'text-[11px] font-bold uppercase tracking-[0.14em]'
export const bodyText = `${serif} text-[19px] sm:text-[20px] leading-[1.72]`

const CALLOUT = {
  crew: { name: 'How Stonegate works', Icon: Truck, bg: TINT, fg: ACCENT },
  tip: { name: 'Worth knowing', Icon: Lightbulb, bg: '#F6EEE3', fg: '#9A6631' },
  note: { name: 'Note', Icon: Info, bg: '#F3F0EC', fg: SOFT },
}

export function Credit({ credit }: { credit: GuideCredit }) {
  return (
    <>Photo: <a href={credit.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-70">{credit.author}</a> ({credit.license})</>
  )
}

function Caption({ caption, credit }: { caption?: string; credit?: GuideCredit }) {
  if (!caption && !credit) return null
  return (
    <figcaption className="mt-3 text-[13px] leading-snug" style={{ color: SOFT }}>
      {caption}{caption && credit && ' '}{credit && <span style={{ color: FAINT }}><Credit credit={credit} /></span>}
    </figcaption>
  )
}

/** Renders a guide's content blocks as an article column; text accepts inline [link](/path) and **bold** markup */
export default function GuideBody({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <div className="flex flex-col gap-6" style={{ color: TEXT }}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return <h2 key={i} id={b.id} className={`${serif} text-[1.65rem] sm:text-[2rem] font-semibold leading-[1.15] tracking-[-0.015em] mt-10`} style={{ scrollMarginTop: '96px' }}>{b.text}</h2>
          case 'h3':
            return <h3 key={i} className={`${serif} text-xl font-semibold mt-2`}>{b.text}</h3>
          case 'p':
            return <p key={i} className={bodyText}><LinkedText text={b.text} variant="article" /></p>
          case 'list': {
            const Tag = b.ordered ? 'ol' : 'ul'
            return (
              <Tag key={i} className={`${bodyText} flex flex-col gap-2.5 pl-6 ${b.ordered ? 'list-decimal' : 'list-disc'} marker:text-[#014421]`}>
                {b.items.map(item => <li key={item} className="pl-1.5"><LinkedText text={item} variant="article" /></li>)}
              </Tag>
            )
          }
          case 'checklist':
            return (
              <ul key={i} className="flex flex-col rounded-2xl px-5 sm:px-6 py-2" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${RULE}` }}>
                {b.items.map((item, n) => (
                  <li key={item} className={`flex gap-3.5 py-3.5 ${serif} text-[18px] leading-[1.6]`} style={n ? { borderTop: `1px solid ${RULE}` } : undefined}>
                    <span aria-hidden className="shrink-0 mt-[0.3em] w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: TINT }}>
                      <Check size={13} strokeWidth={3} style={{ color: ACCENT }} />
                    </span>
                    <span><LinkedText text={item} variant="article" /></span>
                  </li>
                ))}
              </ul>
            )
          case 'table':
            return (
              <figure key={i} className="my-2">
                <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${RULE}`, backgroundColor: '#FFFFFF' }}>
                  <table className="w-full min-w-[540px] text-left text-[14.5px] leading-snug">
                    <thead style={{ backgroundColor: '#F6F2EC' }}>
                      <tr>{b.head.map(h => <th key={h} scope="col" className={`${label} px-4 py-3`} style={{ color: SOFT }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {b.rows.map(row => (
                        <tr key={row.join('|')} style={{ borderTop: `1px solid ${RULE}` }}>
                          {row.map((cell, c) => (
                            <td key={c} className={`px-4 py-3.5 align-top ${c === 0 ? 'font-semibold' : ''}`} style={{ color: c === 0 ? TEXT : SOFT }}><LinkedText text={cell} variant="article" /></td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {b.caption && <figcaption className="mt-3 text-[13px] leading-snug" style={{ color: SOFT }}>{b.caption}</figcaption>}
              </figure>
            )
          case 'callout': {
            const { name, Icon, bg, fg } = CALLOUT[b.tone]
            return (
              <aside key={i} className="my-2 rounded-2xl p-6 sm:p-7" style={{ backgroundColor: bg }}>
                <p className={`${label} mb-3 inline-flex items-center gap-1.5`} style={{ color: fg }}><Icon size={14} aria-hidden /> {name}</p>
                <p className={`${serif} text-[1.25rem] font-semibold leading-snug mb-2`}>{b.title}</p>
                <p className={`${serif} text-[17.5px] leading-[1.65]`} style={{ color: '#3D3732' }}><LinkedText text={b.text} variant="article" /></p>
              </aside>
            )
          }
          case 'quote':
            return (
              <blockquote key={i} className="my-4 pl-6 sm:pl-8 border-l-[3px]" style={{ borderColor: ACCENT }}>
                <p className={`${serif} text-[1.6rem] sm:text-[2rem] font-medium leading-[1.25] tracking-[-0.015em]`}>{b.text}</p>
              </blockquote>
            )
          case 'image':
            return (
              <figure key={i} className={`my-3 ${b.portrait ? 'sm:max-w-[400px]' : 'lg:-mx-16'}`}>
                <div className={`relative overflow-hidden rounded-2xl ${b.portrait ? 'aspect-[4/5]' : 'aspect-[3/2]'}`} style={{ backgroundColor: b.portrait ? RULE : '#FFFFFF' }}>
                  <Image src={b.src} alt={b.alt} fill sizes={b.portrait ? '(max-width: 640px) 100vw, 400px' : '(max-width: 1024px) 100vw, 840px'} className={b.portrait ? 'object-cover' : 'object-contain'} />
                </div>
                <Caption caption={b.caption} credit={b.credit} />
              </figure>
            )
        }
      })}
    </div>
  )
}
