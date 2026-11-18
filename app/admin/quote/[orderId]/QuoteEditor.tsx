'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { moveDateLabel, moveSummary } from '@/lib/types'
import type { DetailedQuoteInputs } from '@/lib/quote-pricing'
import { useDetailedQuoteState } from '@/components/admin/useDetailedQuoteState'
import { DetailedQuoteForm } from '@/components/admin/DetailedQuoteForm'
import { DEFAULT_JOB_HOURS, DEFAULT_START, DEPOT, type TravelEstimate } from '@/lib/travel-fee-info'

interface Order {
  id: string
  order_number: number | null
  customer_name: string
  customer_email: string
  phone: string
  pickup_address: string
  pickup_floor: number
  pickup_has_elevator: boolean
  dropoff_address: string
  dropoff_floor: number
  dropoff_has_elevator: boolean
  apartment_size: string | null
  /** Set on free estimate requests; older and admin-entered orders have none */
  move_type: string | null
  move_size: string | null
  date_flexibility: string | null
  moving_date: string
  moving_time: string | null
  special_notes: string | null
  status: string
  hourly_rate: number | null
  estimated_hours: number | null
  additional_fees: number | null
  estimated_price: number | null
  quote_type: string | null
  quote_details: { inputs: DetailedQuoteInputs } | null
  duration_minutes: number | null
  travel_fee: number | null
  travel_estimate: TravelEstimate | null
  created_at: string
}

export default function QuoteEditor({ order }: { order: Order }) {
  const [tab, setTab] = useState<'standard' | 'detailed'>(order.quote_type === 'detailed' ? 'detailed' : 'standard')

  const [rate, setRate] = useState(order.hourly_rate?.toString() ?? '80')
  const [hours, setHours] = useState(order.estimated_hours?.toString() ?? '')
  const [fees, setFees] = useState(order.additional_fees?.toString() ?? '0')

  const { inputs: detailedInputs, result: detailedResult, formProps: detailedFormProps } =
    useDetailedQuoteState(order.quote_details?.inputs)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Travel fee: worked out when the request came in; recalculated here with the real start time and hours
  const [travel, setTravel] = useState<TravelEstimate | null>(order.travel_estimate)
  const [travelStart, setTravelStart] = useState((order.moving_time ?? order.travel_estimate?.startTime ?? DEFAULT_START).slice(0, 5))
  const [travelBusy, setTravelBusy] = useState(false)
  const [travelError, setTravelError] = useState('')
  const jobHoursForTravel = (parseFloat(hours) || 0) > 0
    ? parseFloat(hours)
    : order.estimated_hours ?? (order.duration_minutes ? order.duration_minutes / 60 : DEFAULT_JOB_HOURS)

  async function recalcTravel() {
    setTravelError('')
    setTravelBusy(true)
    const res = await fetch(`/api/admin/orders/${order.id}/travel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startTime: travelStart, jobHours: jobHoursForTravel }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && data.estimate) setTravel(data.estimate)
    else setTravelError(data.error ?? 'Could not calculate. Try again.')
    setTravelBusy(false)
  }

  const year = new Date(order.created_at).getFullYear()
  const num = String(order.order_number ?? '-').padStart(4, '0')
  const orderNum = `SG-${year}-${num}`
  const sizeLabel = moveSummary(order.move_type, order.move_size, order.apartment_size)

  const parsedRate = parseFloat(rate) || 0
  const parsedHours = parseFloat(hours) || 0
  const parsedFees = parseFloat(fees) || 0
  const total = Math.round((parsedRate * parsedHours + parsedFees) * 100) / 100

  async function handleSaveAndPrint() {
    setError('')

    if (tab === 'standard') {
      const r = parseFloat(rate)
      const h = parseFloat(hours)
      const f = parseFloat(fees)
      if (isNaN(r) || r <= 0) { setError('Enter a valid hourly rate'); return }
      if (isNaN(h) || h <= 0) { setError('Enter valid hours'); return }
      if (isNaN(f) || f < 0) { setError('Additional fees cannot be negative'); return }

      setSaving(true)
      const res = await fetch(`/api/admin/quote/${order.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote_type: 'standard', hourly_rate: r, estimated_hours: h, additional_fees: f }),
      })
      if (res.ok) {
        router.refresh()
        window.open(`/admin/quote/${order.id}/print`, '_blank')
      } else {
        setError('Failed to save. Try again.')
      }
      setSaving(false)
      return
    }

    if (detailedResult.total <= 0) { setError('Enter at least one quote detail'); return }

    setSaving(true)
    const res = await fetch(`/api/admin/quote/${order.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quote_type: 'detailed', detailed_inputs: detailedInputs }),
    })
    if (res.ok) {
      router.refresh()
      window.open(`/admin/quote/${order.id}/print`, '_blank')
    } else {
      setError('Failed to save. Try again.')
    }
    setSaving(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <style>{`
        .qe-header { padding: 14px 20px; }
        .qe-title { font-size: 15px; }
        .qe-main { padding: 20px 16px; max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
        .qe-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 768px) {
          .qe-header { padding: 12px 16px; flex-wrap: wrap; gap: 8px; }
          .qe-title { font-size: 13px; }
          .qe-main { grid-template-columns: 1fr; padding: 16px 12px; gap: 16px; }
          .qe-detail-grid { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>

      {/* Header */}
      <header className="qe-header" style={{ background: '#254220', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            ← Dashboard
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span className="qe-title" style={{ color: 'white', fontWeight: 700 }}>Quote - {orderNum}</span>
        </div>
        {order.estimated_price != null && (
          <a
            href={`/admin/quote/${order.id}/print`}
            target="_blank"
            rel="noreferrer"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '7px 12px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Open PDF
          </a>
        )}
      </header>

      <main className="qe-main">
        {/* Order Details */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ color: '#254220', fontSize: '16px', fontWeight: 700, margin: '0 0 20px', borderBottom: '1px solid #F5F0EB', paddingBottom: '12px' }}>
            Order Details
          </h2>
          <div className="qe-detail-grid">
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '12px' }}>CUSTOMER</div>
              <Row label="Name" value={order.customer_name} />
              <Row label="Email" value={order.customer_email} />
              <Row label="Phone" value={order.phone} />
              <Row label="Move Date" value={moveDateLabel(order.date_flexibility, order.moving_date, order.moving_time)} />
              <Row label="Move" value={sizeLabel} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '12px' }}>LOCATIONS</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#254220', marginBottom: '6px' }}>FROM</div>
              <Row label="Address" value={order.pickup_address} />
              {/* The estimate form doesn't ask for floors or elevators, so only older orders have them */}
              {!order.move_type && <Row label="Floor" value={String(order.pickup_floor)} />}
              {!order.move_type && <Row label="Elevator" value={order.pickup_has_elevator ? 'Yes' : 'No'} />}
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#254220', margin: '12px 0 6px' }}>TO</div>
              <Row label="Address" value={order.dropoff_address} />
              {!order.move_type && <Row label="Floor" value={String(order.dropoff_floor)} />}
              {!order.move_type && <Row label="Elevator" value={order.dropoff_has_elevator ? 'Yes' : 'No'} />}
            </div>
          </div>
          {order.special_notes && (
            <div style={{ marginTop: '20px', padding: '12px 16px', background: '#FAF7F2', borderRadius: '8px', fontSize: '13px', color: '#6B5E54' }}>
              <strong>Notes:</strong> {order.special_notes}
            </div>
          )}

          <TravelPanel
            travel={travel}
            start={travelStart}
            onStart={setTravelStart}
            jobHours={jobHoursForTravel}
            busy={travelBusy}
            error={travelError}
            onRecalc={recalcTravel}
            onUseAsFee={tab === 'standard' && travel ? () => setFees(String(travel.fee)) : undefined}
          />
        </div>

        {/* Quote Input Panel */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ color: '#254220', fontSize: '16px', fontWeight: 700, margin: '0 0 16px', borderBottom: '1px solid #F5F0EB', paddingBottom: '12px' }}>
            Quote Details
          </h2>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: '#FAF7F2', borderRadius: '10px', padding: '4px' }}>
            {(['standard', 'detailed'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '9px 10px', borderRadius: '8px', border: 'none',
                  background: tab === t ? '#254220' : 'transparent',
                  color: tab === t ? 'white' : '#6B5E54',
                  fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                }}
              >
                {t === 'standard' ? 'Hourly Rate' : 'Detailed Quote'}
              </button>
            ))}
          </div>

          {tab === 'standard' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '8px' }}>
                  Hourly Rate (CAD)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9A8E83', fontSize: '15px' }}>$</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                    placeholder="80"
                    style={{ width: '100%', padding: '11px 14px 11px 26px', border: '1.5px solid #E8E0D5', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '8px' }}>
                  Estimated Hours
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={hours}
                  onChange={e => setHours(e.target.value)}
                  placeholder="e.g. 5"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8E0D5', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1714', marginBottom: '8px' }}>
                  Additional Fees (CAD)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9A8E83', fontSize: '15px' }}>$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={fees}
                    onChange={e => setFees(e.target.value)}
                    placeholder="0.00"
                    style={{ width: '100%', padding: '11px 14px 11px 26px', border: '1.5px solid #E8E0D5', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <p style={{ fontSize: '12px', color: '#9A8E83', marginTop: '6px' }}>
                  Extra charges beyond hourly rate (stairs, long carry, etc.)
                </p>
              </div>
            </>
          )}

          {tab === 'detailed' && <DetailedQuoteForm {...detailedFormProps} showWeightOption={false} showStairsFee />}

          {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <button
            onClick={handleSaveAndPrint}
            disabled={saving}
            style={{ width: '100%', padding: '12px', background: saving ? '#6B5E54' : '#254220', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving…' : 'Save & Open PDF Preview'}
          </button>

          {/* Pricing Summary */}
          <div style={{ marginTop: '20px', padding: '12px', background: '#FAF7F2', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px', marginBottom: '8px' }}>PRICING SUMMARY</div>

            {tab === 'standard' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                  <span>Rate</span><span>${parsedRate.toFixed(2)} / hr</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                  <span>Hours</span><span>{hours || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                  <span>Base ({hours || '0'} × ${parsedRate.toFixed(0)})</span>
                  <span>${(parsedRate * parsedHours).toFixed(2)}</span>
                </div>
                {parsedFees > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                    <span>Additional Fees</span><span>${parsedFees.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid #E8E0D5', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: '#254220' }}>
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <>
                {detailedResult.lineItems.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#9A8E83' }}>Enter quote details to see a breakdown.</div>
                )}
                {detailedResult.lineItems.map(li => (
                  <div key={li.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B5E54', marginBottom: '4px' }}>
                    <span>{li.label}</span><span>${li.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #E8E0D5', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: '#254220' }}>
                  <span>Total</span><span>${detailedResult.total.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

const clock = (departAt: string) =>
  new Date(`1970-01-01T${departAt.slice(-5)}`).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', hour12: true })
const duration = (min: number) => (min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`)

/** The truck's drive from the parking spot to the pickup and back from the drop-off, as time and money */
function TravelPanel({ travel, start, onStart, jobHours, busy, error, onRecalc, onUseAsFee }: {
  travel: TravelEstimate | null
  start: string
  onStart: (v: string) => void
  jobHours: number
  busy: boolean
  error: string
  onRecalc: () => void
  onUseAsFee?: () => void
}) {
  const label: React.CSSProperties = { fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '1px' }
  const line: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '13px', color: '#1A1714', marginBottom: '6px' }
  const muted: React.CSSProperties = { color: '#9A8E83', fontSize: '12px' }
  return (
    <div style={{ marginTop: '20px', padding: '16px', background: '#F3F7F2', border: '1px solid #DCE8D9', borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
        <div style={label}>TRAVEL FEE</div>
        <div style={muted}>From {DEPOT.label}</div>
      </div>

      {travel ? (
        <>
          <div style={line}>
            <span>To pickup <span style={muted}>· leaves {clock(travel.out.departAt)} · {travel.out.km} km</span></span>
            <strong>{duration(travel.out.minutes)}</strong>
          </div>
          <div style={line}>
            <span>Back from drop-off <span style={muted}>· leaves {clock(travel.back.departAt)} · {travel.back.km} km</span></span>
            <strong>{duration(travel.back.minutes)}</strong>
          </div>
          <div style={{ ...line, borderTop: '1px solid #DCE8D9', paddingTop: '8px', marginTop: '4px', fontSize: '14px', fontWeight: 700, color: '#254220' }}>
            <span>{duration(travel.totalMinutes)} × ${travel.rate}/hr</span>
            <span>${travel.fee.toFixed(0)}</span>
          </div>
          <div style={{ ...muted, marginTop: '8px', lineHeight: 1.5 }}>
            Pickup matched as: {travel.pickupMatch}<br />
            Drop-off matched as: {travel.dropoffMatch}<br />
            Based on a {clock(`T${travel.startTime}`)} start and {travel.jobHours} h of work, with typical traffic for that day and time.
          </div>
        </>
      ) : (
        <div style={{ ...muted, marginBottom: '8px' }}>Not calculated yet.</div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '12px', color: '#6B5E54', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Start
          <input type="time" value={start} onChange={e => onStart(e.target.value)}
            style={{ padding: '6px 8px', border: '1.5px solid #E8E0D5', borderRadius: '8px', fontSize: '13px' }} />
        </label>
        <span style={{ fontSize: '12px', color: '#6B5E54' }}>· {jobHours} h of work</span>
        <button type="button" onClick={onRecalc} disabled={busy}
          style={{ marginLeft: 'auto', padding: '7px 12px', background: '#254220', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: busy ? 'wait' : 'pointer' }}>
          {busy ? 'Calculating…' : 'Recalculate'}
        </button>
        {onUseAsFee && (
          <button type="button" onClick={onUseAsFee}
            style={{ padding: '7px 12px', background: 'white', color: '#254220', border: '1.5px solid #254220', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Add to fees
          </button>
        )}
      </div>
      <div style={{ ...muted, marginTop: '6px' }}>Hours come from Estimated Hours; change it there and recalculate.</div>
      {error && <p style={{ color: '#ef4444', fontSize: '12px', margin: '8px 0 0' }}>{error}</p>}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px' }}>
      <span style={{ color: '#9A8E83', minWidth: '70px' }}>{label}:</span>
      <span style={{ color: '#1A1714', fontWeight: 500 }}>{value}</span>
    </div>
  )
}
