import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Be_Vietnam_Pro, Instrument_Sans, Leckerli_One, Shrikhand } from 'next/font/google'
import Hero from '@/components/landing/Hero'

/**
 * TEMPORARY: the homepage with only the H1 typeface swapped, for comparing heading fonts side by side.
 * Not linked anywhere and kept out of search. Delete app/type-compare once a font is chosen.
 */
export const metadata: Metadata = { title: 'Type compare', robots: { index: false, follow: false } }

const instrument = Instrument_Sans({ subsets: ['latin'], weight: '700' })
const vietnam = Be_Vietnam_Pro({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const shrikhand = Shrikhand({ subsets: ['latin'], weight: '400' })
const leckerli = Leckerli_One({ subsets: ['latin'], weight: '400' })
// Script faces have their own weight; the H1's bold must not fake-bold them
const script = (cls: string) => `${cls} !font-normal !tracking-normal`

const ACCENTS: Record<string, string> = {
  'accent-shrikhand': `${shrikhand.className} font-normal tracking-normal text-[1.06em]`,
}

const FONTS: Record<string, string | undefined> = {
  current: undefined,
  instrument: instrument.className,
  general: 'font-[family-name:General_Sans,sans-serif] [font-weight:700]',
  shrikhand: script(shrikhand.className),
  leckerli: script(leckerli.className),
  'accent-shrikhand': undefined,
  vietnam: vietnam.className,
  'vietnam-all': vietnam.className,
}

/** Options that also swap the body text, not just the H1 */
const WHOLE_PAGE: Record<string, string> = { 'vietnam-all': vietnam.className }

export function generateStaticParams() {
  return Object.keys(FONTS).map(font => ({ font }))
}

export default async function TypeComparePage({ params }: { params: Promise<{ font: string }> }) {
  const { font } = await params
  if (!(font in FONTS)) notFound()
  return (
    <>
      {/* General Sans is not on Google Fonts; it is free from Fontshare */}
      {font === 'general' && <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@700&display=swap" />}
      <div className={WHOLE_PAGE[font]}>
        <Hero headlineFont={FONTS[font]} accentFont={ACCENTS[font]} />
      </div>
    </>
  )
}
