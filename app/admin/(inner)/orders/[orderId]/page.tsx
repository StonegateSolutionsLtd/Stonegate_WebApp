import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { LEAD_SOURCES, moveDateLabel, moveSummary } from '@/lib/types'
import { durationFor } from '@/lib/scheduling'
import { DEFAULT_JOB_HOURS } from '@/lib/travel-fee-info'
import TravelFeePanel from '@/components/admin/TravelFeePanel'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  pending: { bg: '#FDF1D6', fg: '#8A5A00' },
  confirmed: { bg: '#D1FAE5', fg: '#065F46' },
  completed: { bg: '#E3EEF9', fg: '#1F4E79' },
  cancelled: { bg: '#F5E1E1', fg: '#8A1F1F' },
}

const card: React.CSSProperties = { background: 'white', borderRadius: '12px', padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }
const heading: React.CSSProperties = { fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', margin: '0 0 12px' }
const mapLink = (address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '6px 0', fontSize: '13.5px', borderBottom: '1px solid #F7F3EE' }}>
      <span style={{ color: '#9A8E83', width: '110px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1A1714', fontWeight: 500, minWidth: 0, overflowWrap: 'anywhere' }}>{children}</span>
    </div>
  )
}

/** Everything about one moving request in one place, read-only; the quote is made on the quote page */
export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const supabase = createServiceClient()
  const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()
  if (!order) notFound()

  const year = new Date(order.created_at).getFullYear()
  const orderNum = `SG-${year}-${String(order.order_number ?? '-').padStart(4, '0')}`
  const status = STATUS_COLORS[order.status] ?? { bg: '#F5F0EB', fg: '#6B5E54' }
  const durationMin = durationFor('moving', order.duration_minutes)
  const jobHours = order.estimated_hours ?? (order.duration_minutes ? order.duration_minutes / 60 : DEFAULT_JOB_HOURS)
  const leadSource = LEAD_SOURCES.find(s => s.value === order.lead_source)?.label
  const hasQuote = order.estimated_price != null

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <style>{`
        .od-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
        @media (max-width: 768px) { .od-grid { grid-template-columns: 1fr; } }
      `}</style>

      <Link href="/admin/dashboard" style={{ color: '#6B5E54', fontSize: '13px', textDecoration: 'none' }}>← Moving Orders</Link>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', margin: '10px 0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h1 style={{ color: '#254220', fontSize: '20px', fontWeight: 700, margin: 0 }}>{orderNum}</h1>
          <span style={{ background: status.bg, color: status.fg, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>{order.status}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {hasQuote && (
            <Link href={`/admin/quote/${order.id}/print`} target="_blank" style={{ background: 'white', color: '#254220', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', border: '1.5px solid #254220' }}>
              View PDF
            </Link>
          )}
          <Link href={`/admin/quote/${order.id}`} style={{ background: '#254220', color: 'white', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            {hasQuote ? 'Edit Quote' : 'Generate Quote'}
          </Link>
        </div>
      </div>

      <div className="od-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <section style={card}>
            <h2 style={heading}>CUSTOMER</h2>
            <Row label="Name">{order.customer_name}</Row>
            <Row label="Email"><a href={`mailto:${order.customer_email}`} style={{ color: '#254220' }}>{order.customer_email}</a></Row>
            <Row label="Phone"><a href={`tel:${order.phone}`} style={{ color: '#254220' }}>{order.phone}</a></Row>
            {leadSource && <Row label="Found us via">{leadSource}</Row>}
            <Row label="Submitted">{new Date(order.created_at).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Vancouver' })}</Row>
          </section>

          <section style={card}>
            <h2 style={heading}>MOVE</h2>
            <Row label="Move">{moveSummary(order.move_type, order.move_size, order.apartment_size)}</Row>
            <Row label="Date">{moveDateLabel(order.date_flexibility, order.moving_date, order.moving_time)}</Row>
            <Row label="Job length">{durationMin / 60} h (calendar)</Row>
            <Row label="From"><a href={mapLink(order.pickup_address)} target="_blank" rel="noreferrer" style={{ color: '#254220' }}>{order.pickup_address}</a></Row>
            {!order.move_type && <Row label="Pickup floor">{`${order.pickup_floor}${order.pickup_has_elevator ? ', elevator' : ', no elevator'}`}</Row>}
            <Row label="To"><a href={mapLink(order.dropoff_address)} target="_blank" rel="noreferrer" style={{ color: '#254220' }}>{order.dropoff_address}</a></Row>
            {!order.move_type && <Row label="Drop-off floor">{`${order.dropoff_floor}${order.dropoff_has_elevator ? ', elevator' : ', no elevator'}`}</Row>}
            {order.special_notes && (
              <div style={{ marginTop: '12px', padding: '10px 12px', background: '#FAF7F2', borderRadius: '8px', fontSize: '13px', color: '#6B5E54', whiteSpace: 'pre-wrap' }}>
                <strong>Notes:</strong> {order.special_notes}
              </div>
            )}
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <section style={card}>
            <h2 style={heading}>QUOTE</h2>
            {hasQuote ? (
              <>
                <Row label="Total">${Number(order.estimated_price).toFixed(2)}</Row>
                {order.quote_type !== 'detailed' && order.hourly_rate != null && <Row label="Rate">${Number(order.hourly_rate).toFixed(2)}/hr × {order.estimated_hours} h</Row>}
                {order.quote_type !== 'detailed' && Number(order.additional_fees) > 0 && <Row label="Extra fees">${Number(order.additional_fees).toFixed(2)}</Row>}
                {order.quote_type !== 'detailed' && <Row label="Travel">{order.quote_travel_fee != null ? `$${Number(order.quote_travel_fee).toFixed(2)} charged` : 'Included (not charged)'}</Row>}
                {order.quote_type === 'detailed' && <Row label="Type">Detailed quote</Row>}
              </>
            ) : (
              <p style={{ fontSize: '13px', color: '#9A8E83', margin: 0 }}>No quote yet.</p>
            )}
          </section>

          <section style={{ ...card, paddingTop: '4px' }}>
            <TravelFeePanel orderId={order.id} initial={order.travel_estimate ?? null} initialStart={order.moving_time} jobHours={jobHours} />
          </section>
        </div>
      </div>
    </div>
  )
}
