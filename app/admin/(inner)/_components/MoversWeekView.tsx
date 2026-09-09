'use client'
import { useMemo, useState } from 'react'
import type { Mover, MoverAssignmentWithJob, MoverPayment } from '@/lib/types'
import MoverCard from './MoverCard'

const money = (n: number) => `$${n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

interface Props {
  movers: Mover[]
  assignments: MoverAssignmentWithJob[]
  payments: MoverPayment[]
  carryovers: Record<string, number>
  weekStartStr: string
  weekEndStr: string
}

export default function MoversWeekView({ movers, assignments, payments, carryovers, weekStartStr, weekEndStr }: Props) {
  const [showInactive, setShowInactive] = useState(false)

  const { totals, visibleMovers } = useMemo(() => {
    const byMover = movers.map(m => {
      const moverAssignments = assignments.filter(a => a.mover_id === m.id)
      const moverPayments = payments.filter(p => p.mover_id === m.id)
      const hours = moverAssignments.reduce((sum, a) => sum + (a.hours ?? 0), 0)
      const owed = moverAssignments.reduce((sum, a) => sum + (a.amount_override != null ? Number(a.amount_override) : (a.hours ?? 0) * m.hourly_rate), 0)
      const paid = moverPayments.reduce((sum, p) => sum + Number(p.amount), 0)
      const carryover = carryovers[m.id] ?? 0
      const totalRemaining = carryover + owed - paid
      return {
        mover: m, assignments: moverAssignments, payments: moverPayments, hours, owed, paid, carryover, totalRemaining,
        hasActivity: moverAssignments.length > 0 || moverPayments.length > 0 || Math.abs(carryover) > 0.004,
      }
    })

    const summed = byMover.reduce(
      (acc, x) => ({ hours: acc.hours + x.hours, owed: acc.owed + x.owed, paid: acc.paid + x.paid, remaining: acc.remaining + x.totalRemaining }),
      { hours: 0, owed: 0, paid: 0, remaining: 0 }
    )

    const visible = byMover.filter(x => x.mover.active || x.hasActivity || showInactive)

    return {
      totals: summed,
      visibleMovers: visible,
    }
  }, [movers, assignments, payments, carryovers, showInactive])

  const hiddenInactiveCount = movers.filter(m => !m.active && !assignments.some(a => a.mover_id === m.id) && !payments.some(p => p.mover_id === m.id) && Math.abs(carryovers[m.id] ?? 0) <= 0.004).length

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ flex: '1 1 140px', background: 'white', border: '1px solid #F5F0EB', borderRadius: '10px', padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: '#9A8E83', fontWeight: 700, letterSpacing: '0.4px' }}>TOTAL HOURS</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#254220' }}>{totals.hours.toFixed(2)}</div>
        </div>
        <div style={{ flex: '1 1 140px', background: 'white', border: '1px solid #F5F0EB', borderRadius: '10px', padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: '#9A8E83', fontWeight: 700, letterSpacing: '0.4px' }}>TOTAL OWED</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#254220' }}>{money(totals.owed)}</div>
        </div>
        <div style={{ flex: '1 1 140px', background: 'white', border: '1px solid #F5F0EB', borderRadius: '10px', padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: '#9A8E83', fontWeight: 700, letterSpacing: '0.4px' }}>PAID SO FAR</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#254220' }}>{money(totals.paid)}</div>
        </div>
        <div style={{ flex: '1 1 140px', background: totals.remaining > 0.004 ? '#FDE4C8' : '#D6E8D3', border: '1px solid #F5F0EB', borderRadius: '10px', padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: '#6B5E54', fontWeight: 700, letterSpacing: '0.4px' }}>REMAINING (ALL-TIME)</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: totals.remaining > 0.004 ? '#9A4B12' : '#254220' }}>{money(totals.remaining)}</div>
        </div>
      </div>

      {hiddenInactiveCount > 0 && (
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#6B5E54', marginBottom: '14px', cursor: 'pointer' }}>
          <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)} />
          Show {hiddenInactiveCount} inactive mover{hiddenInactiveCount === 1 ? '' : 's'} with no activity this week
        </label>
      )}

      {visibleMovers.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #F5F0EB', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#9A8E83', fontSize: '13px' }}>
          No movers yet — add your crew with the button above.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visibleMovers.map(({ mover, assignments: a, payments: p, carryover }) => (
            <MoverCard key={mover.id} mover={mover} assignments={a} payments={p} carryover={carryover} periodStart={weekStartStr} periodEnd={weekEndStr} />
          ))}
        </div>
      )}
    </div>
  )
}
