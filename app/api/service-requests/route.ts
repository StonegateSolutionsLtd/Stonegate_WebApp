import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse, type NextRequest } from 'next/server'
import { LOCAL_WITHOUT_SUPABASE, createServiceClient } from '@/lib/supabase/server'
import { isSlotAvailable } from '@/lib/availability'
import { sendOwnerServiceRequestNotification, sendCustomerServiceRequestConfirmation } from '@/lib/email'
import { TRUCK_FRACTIONS } from '@/lib/quote-pricing'
import type { ServiceFormData } from '@/lib/service-chat'
import { MAX_PHOTOS, MAX_PHOTOS_TOTAL_BYTES, PHOTO_BUCKET, photoExtension } from '@/lib/photos'

const TYPE_MAP: Record<string, string> = {
  'junk-removal': 'junk_removal',
}

export async function POST(request: NextRequest) {
  // multipart/form-data: `data` = the form as JSON, `photos` = image files.
  let body: ServiceFormData & { serviceType: string }
  let photos: File[]
  try {
    const formData = await request.formData()
    body = JSON.parse(String(formData.get('data')))
    photos = formData.getAll('photos').filter((p): p is File => p instanceof File)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  if (
    photos.length === 0 ||
    photos.length > MAX_PHOTOS ||
    photos.some(p => !photoExtension(p.type)) ||
    photos.reduce((sum, p) => sum + p.size, 0) > MAX_PHOTOS_TOTAL_BYTES
  ) {
    return NextResponse.json({ error: 'Photos are invalid or too large' }, { status: 400 })
  }

  const { serviceType, address, date, time, customerName, customerEmail, phone, loadSize, floor, hasElevator } = body
  if (!serviceType || !address || !date || !time || !customerName || !customerEmail || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (
    !TRUCK_FRACTIONS.some(f => f.label === loadSize) ||
    !Number.isInteger(floor) || floor < 1 || floor > 50 ||
    typeof hasElevator !== 'boolean'
  ) {
    return NextResponse.json({ error: 'Invalid junk details' }, { status: 400 })
  }

  const orderType = TYPE_MAP[serviceType]
  if (!orderType) {
    return NextResponse.json({ error: 'Unknown service type' }, { status: 400 })
  }

  try {
    if (!(await isSlotAvailable('junk_removal', date, time))) {
      return NextResponse.json(
        { error: 'That time was just booked. Please pick another slot.' },
        { status: 409 }
      )
    }
  } catch (err) {
    console.error('Availability check failed:', err)
    return NextResponse.json(
      { error: 'Could not verify that time is still open. Please try again.' },
      { status: 503 }
    )
  }

  const orderId = randomUUID()
  const photoNames = photos.map((p, i) => `${i + 1}.${photoExtension(p.type)}`)

  if (LOCAL_WITHOUT_SUPABASE) {
    const dir = path.join(process.cwd(), 'data', 'service-orders')
    await mkdir(path.join(dir, orderId), { recursive: true })
    await Promise.all(photos.map(async (p, i) =>
      writeFile(path.join(dir, orderId, photoNames[i]), Buffer.from(await p.arrayBuffer())),
    ))
    await writeFile(
      path.join(dir, `${orderId}.txt`),
      JSON.stringify({
        orderId, createdAt: new Date().toISOString(), status: 'pending', ...body,
        photos: photoNames.map(n => `${orderId}/${n}`),
      }, null, 2),
    )
    return NextResponse.json({ orderId }, { status: 201 })
  }

  const supabase = createServiceClient()

  // A failed photo upload shouldn't lose the booking; staff can ask for photos.
  const uploads = await Promise.all(photos.map(async (p, i) => {
    const photoPath = `${orderId}/${photoNames[i]}`
    const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(photoPath, p, { contentType: p.type })
    if (error) console.error('Photo upload error:', photoPath, error.message)
    return error ? null : photoPath
  }))
  const photoPaths = uploads.filter((p): p is string => p !== null)

  // Save to database
  const { data: serviceOrder, error: insertError } = await supabase
    .from('service_orders')
    .insert({
      id: orderId,
      order_type: orderType,
      customer_name: customerName,
      customer_email: customerEmail,
      phone,
      address,
      service_date: date,
      service_time: time,
      notes: body.notes || null,
      load_size: loadSize,
      floor,
      has_elevator: hasElevator,
      photo_paths: photoPaths,
      status: 'pending',
    })
    .select('id')
    .single()

  if (insertError || !serviceOrder) {
    console.error('Service order insert error:', JSON.stringify(insertError))
    return NextResponse.json({ error: 'Failed to save request', detail: insertError?.message }, { status: 500 })
  }

  // Send email notifications - don't fail the request if email fails
  await Promise.allSettled([
    sendOwnerServiceRequestNotification({ serviceType, address, date, time, customerName, customerEmail, phone, notes: body.notes, loadSize, floor, hasElevator, photoCount: photoPaths.length }),
    sendCustomerServiceRequestConfirmation({ serviceType, address, date, time, customerName, customerEmail, phone }),
  ])

  return NextResponse.json({ orderId: serviceOrder.id }, { status: 201 })
}
