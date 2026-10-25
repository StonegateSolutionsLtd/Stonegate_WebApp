import type { Faq } from '@/lib/seo/site'

/** Shared sections for /junk-removal and the junk ad landing pages, so the funnel looks like one site */

const GREEN = '#014421'
const INK = '#1A1714'
const WHITE = '#FFFFFF'
const LIGHT_GREEN = '#E8F0E6'
const TAN = '#F3EADD'

/** Stagger for a `data-reveal` element, read by the entrance transition in globals.css (see RevealOnScroll) */
export function revealDelay(ms: number, style: React.CSSProperties = {}) {
  return { ...style, '--reveal-delay': `${ms}ms` } as React.CSSProperties
}

/**
 * The on-site estimate as a printed ticket: the steps on the main part, "pay after" and the action on a tear-off stub.
 * Sits on a TAN section - the notches and perforation dots are cut in that colour.
 */
export function PriceTicket({ steps, action }: { steps: { title: string; text: string }[]; action: React.ReactNode }) {
  return (
    <div data-reveal style={revealDelay(140)} className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[7fr_3fr] rounded-2xl">
      <div className="rounded-t-2xl lg:rounded-tr-none lg:rounded-l-2xl p-7 sm:p-10" style={{ backgroundColor: WHITE }}>
        <h3 className="text-[24px] sm:text-[28px] font-extrabold tracking-tight mb-7" style={{ color: INK }}>How you get your price</h3>
        <ol className="grid sm:grid-cols-3 gap-6 sm:gap-8">
          {steps.map(s => (
            <li key={s.title}>
              <p className="text-[17px] font-extrabold mb-1.5" style={{ color: GREEN }}>{s.title}</p>
              <p className="text-[16px] leading-relaxed" style={{ color: INK }}>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
      {/* Stub: notches bitten out where it tears off, and a row of round perforation dots in the section colour */}
      <div className="relative rounded-b-2xl lg:rounded-bl-none lg:rounded-r-2xl p-7 sm:p-10 flex flex-col justify-between gap-6 border-t-[6px] lg:border-t-0 lg:border-l-[6px] border-dotted" style={{ backgroundColor: LIGHT_GREEN, borderColor: TAN }}>
        <span className="absolute w-7 h-7 rounded-full -top-[17px] -left-3.5 lg:-left-[17px] lg:-top-3.5" style={{ backgroundColor: TAN }} aria-hidden />
        <span className="absolute w-7 h-7 rounded-full -top-[17px] -right-3.5 lg:right-auto lg:top-auto lg:-left-[17px] lg:-bottom-3.5" style={{ backgroundColor: TAN }} aria-hidden />
        <div>
          <p className="text-[24px] sm:text-[28px] font-extrabold tracking-tight leading-tight mb-2" style={{ color: GREEN }}>Pay after the job</p>
          <p className="text-[16px] leading-relaxed" style={{ color: INK }}>Card, e-transfer or cash. No deposit.</p>
        </div>
        {action}
      </div>
    </div>
  )
}

/** FAQ set as reading text under its heading - every answer visible, two columns on tablets, three on desktop */
export function FaqText({ faqs, heading }: { faqs: Faq[]; heading: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 lg:py-24">
      <div className="mb-8 lg:mb-10">{heading}</div>
      <div className="md:columns-2 lg:columns-3 md:gap-12">
        {faqs.map((f, i) => (
          <p key={f.q} data-reveal style={revealDelay((i % 3) * 60)} className="break-inside-avoid mb-6 text-[17px] leading-relaxed">
            <strong className="font-extrabold" style={{ color: INK }}>{f.q}</strong>{' '}
            <span style={{ color: INK }}>{f.a}</span>
          </p>
        ))}
      </div>
    </div>
  )
}
