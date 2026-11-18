'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TravelEstimate } from '@/lib/travel-fee-info'

const duration = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`)

/** The order's travel fee at a glance in the orders list; orders without one can be calculated right here */
export default function TravelFeeCell({ orderId, estimate }: { orderId: string; estimate: TravelEstimate | null }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  if (estimate) {
    return (
      <div title={`To pickup ${duration(estimate.out.minutes)} + back ${duration(estimate.back.minutes)} at $${estimate.rate}/hr`}>
        <span style={{ background: '#E8F0E6', color: '#254220', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' }}>
          ${estimate.fee}
        </span>
        <div style={{ fontSize: '11.5px', color: '#9A8E83', marginTop: '4px', whiteSpace: 'nowrap' }}>{duration(estimate.totalMinutes)} drive</div>
      </div>
    )
  }

  async function calculate() {
    setBusy(true)
    setFailed(false)
    const res = await fetch(`/api/admin/orders/${orderId}/travel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
    setBusy(false)
    if (res.ok) router.refresh()
    else setFailed(true)
  }

  return (
    <button
      type="button"
      onClick={calculate}
      disabled={busy}
      title={failed ? 'An address could not be found. Open Details to check it.' : 'Work out the drive from Spruce Rd and back'}
      style={{ background: 'white', color: failed ? '#B42318' : '#254220', border: `1.5px solid ${failed ? '#F3C1C1' : '#E8E0D5'}`, borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, cursor: busy ? 'wait' : 'pointer', whiteSpace: 'nowrap' }}
    >
      {busy ? 'Calculating…' : failed ? 'Not found' : 'Calculate'}
    </button>
  )
}
