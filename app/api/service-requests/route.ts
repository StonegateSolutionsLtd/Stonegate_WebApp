import { NextResponse, type NextRequest } from 'next/server'
import { sendOwnerServiceRequestNotification, sendCustomerServiceRequestConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  let body: { serviceType: string; address: string; date: string; time: string; customerName: string; customerEmail: string; phone: string; notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { serviceType, address, date, time, customerName, customerEmail, phone } = body
  if (!serviceType || !address || !date || !time || !customerName || !customerEmail || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await Promise.allSettled([
    sendOwnerServiceRequestNotification({ serviceType, address, date, time, customerName, customerEmail, phone, notes: body.notes }),
    sendCustomerServiceRequestConfirmation({ serviceType, address, date, time, customerName, customerEmail, phone }),
  ])

  return NextResponse.json({ success: true }, { status: 201 })
}
