import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { calcDetailedQuote, isValidDetailedQuoteInputs } from '@/lib/quote-pricing'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params
  const body = await request.json()
  const supabase = createServiceClient()

  if (body.quote_type === 'detailed') {
    if (!isValidDetailedQuoteInputs(body.detailed_inputs)) {
      return NextResponse.json({ error: 'Invalid detailed quote inputs' }, { status: 400 })
    }
    const result = calcDetailedQuote(body.detailed_inputs)
    if (result.total <= 0) {
      return NextResponse.json({ error: 'Quote total must be greater than zero' }, { status: 400 })
    }

    const { error } = await supabase
      .from('service_orders')
      .update({
        quote_type: 'detailed',
        quote_details: { inputs: body.detailed_inputs },
        hourly_rate: null,
        estimated_hours: null,
        additional_fees: 0,
        estimated_price: result.total,
        quote_generated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (error) {
      console.error('Service order detailed quote update error:', error)
      return NextResponse.json({ error: 'Failed to save quote' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  const { hourly_rate, estimated_hours, additional_fees } = body

  if (typeof hourly_rate !== 'number' || hourly_rate <= 0) {
    return NextResponse.json({ error: 'Invalid rate' }, { status: 400 })
  }
  if (typeof estimated_hours !== 'number' || estimated_hours <= 0) {
    return NextResponse.json({ error: 'Invalid hours' }, { status: 400 })
  }
  if (typeof additional_fees !== 'number' || additional_fees < 0) {
    return NextResponse.json({ error: 'Invalid additional fees' }, { status: 400 })
  }

  const estimated_price = Math.round((hourly_rate * estimated_hours + additional_fees) * 100) / 100

  const { error } = await supabase
    .from('service_orders')
    .update({
      quote_type: 'standard',
      quote_details: null,
      hourly_rate,
      estimated_hours,
      additional_fees,
      estimated_price,
      quote_generated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) {
    console.error('Service order quote update error:', error)
    return NextResponse.json({ error: 'Failed to save quote' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
