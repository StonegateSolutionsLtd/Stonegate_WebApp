'use client'

import { useState } from 'react'
import { DEFAULT_START, DEPOT, type TravelEstimate } from '@/lib/travel-fee-info'

const clock = (departAt: string) =>
  new Date(`1970-01-01T${departAt.slice(-5)}`).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', hour12: true })
const duration = (min: number) => (min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`)

/**
 * The truck's drive from the parking spot to the pickup and back from the drop-off, as time and money.
 * Shows the estimate saved with the order and recalculates it with a start time and the job hours.
 */
export default function TravelFeePanel({ orderId, initial, initialStart, jobHours, onUseAsFee }: {
  orderId: string
  initial: TravelEstimate | null
  /** The order's start time, if it has one */
  initialStart?: string | null
  jobHours: number
  /** Copies the fee into the quote; omitted where there is no quote to add it to */
  onUseAsFee?: (fee: number) => void
}) {
  const [travel, setTravel] = useState<TravelEstimate | null>(initial)
  const [start, onStart] = useState((initialStart ?? initial?.startTime ?? DEFAULT_START).slice(0, 5))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onRecalc() {
    setError('')
    setBusy(true)
    const res = await fetch(`/api/admin/orders/${orderId}/travel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startTime: start, jobHours }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && data.estimate) setTravel(data.estimate)
    else setError(data.error ?? 'Could not calculate. Try again.')
    setBusy(false)
  }

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
        {onUseAsFee && travel && (
          <button type="button" onClick={() => onUseAsFee(travel.fee)}
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

