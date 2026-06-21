import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import QuoteEditor from './QuoteEditor'

export default async function QuotePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const supabase = createServiceClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !order) {
    notFound()
  }

  return <QuoteEditor order={order} />
}
