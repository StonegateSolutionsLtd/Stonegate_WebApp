import type { Metadata } from 'next'
import NoAdminTracking from '@/components/NoAdminTracking'

export const metadata: Metadata = {
  title: 'Admin · Stonegate Moving Solutions',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><NoAdminTracking />{children}</>
}
