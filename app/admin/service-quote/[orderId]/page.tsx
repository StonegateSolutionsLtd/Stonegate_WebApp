import { createServiceClient } from '@/lib/supabase/server'
import { PHOTO_BUCKET } from '@/lib/photos'
import { notFound } from 'next/navigation'
import ServiceQuoteEditor from './ServiceQuoteEditor'

export default async function ServiceQuotePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const supabase = createServiceClient()

  const { data: order, error } = await supabase
    .from('service_orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !order) notFound()

  // The photo bucket is private; links expire after an hour.
  const paths: string[] = order.photo_paths ?? []
  const { data: signed } = paths.length
    ? await supabase.storage.from(PHOTO_BUCKET).createSignedUrls(paths, 60 * 60)
    : { data: [] }
  const photoUrls = (signed ?? []).flatMap(s => (s.signedUrl ? [s.signedUrl] : []))

  return <ServiceQuoteEditor order={order} photoUrls={photoUrls} />
}
