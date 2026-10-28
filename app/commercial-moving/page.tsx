import type { Metadata } from 'next'
import ServicePage from '@/components/moving/ServicePage'
import { SERVICE_BY_SLUG } from '@/lib/moving-services'
import { SITE_URL } from '@/lib/seo/site'

const service = SERVICE_BY_SLUG.commercial

export const metadata: Metadata = {
  title: { absolute: service.metaTitle },
  description: service.metaDescription,
  alternates: { canonical: `${SITE_URL}${service.path}` },
}

export default function Page() {
  return <ServicePage service={service} />
}
