import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await params
  const supabase = createServiceClient()

  const { error } = await supabase.from('mover_payments').delete().eq('id', paymentId)

  if (error) {
    console.error('Mover payment delete error:', error)
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
