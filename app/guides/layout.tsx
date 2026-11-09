import { Newsreader } from 'next/font/google'

/** Editorial serif for the guides only, so articles read like a publication rather than a service page */
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-news',
  style: ['normal', 'italic'],
  axes: ['opsz'],
})

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${newsreader.variable} contents`}>{children}</div>
}
