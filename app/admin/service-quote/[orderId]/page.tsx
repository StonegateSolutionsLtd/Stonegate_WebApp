import { createServiceClient } from '@/lib/supabase/server'
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

  return <ServiceQuoteEditor order={order} />
}
