import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin · Stonegate Moving Solutions',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
