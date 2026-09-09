'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Mover, MoverAssignmentWithJob, MoverPayment } from '@/lib/types'
import MoverModal from './MoverModal'
import RecordPaymentModal from './RecordPaymentModal'
import ManualEntryModal from './ManualEntryModal'

const JOB_ICON = { moving: '🚛', junk_removal: '🗑️' } as const

const money = (n: number) => `$${n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function formatTime(time: string | null): string {
  if (!time) return ''
  const [hStr, mStr] = time.split(':')
  const h = parseInt(hStr, 10)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${mStr} ${period}`
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

interface Props {
  mover: Mover
  assignments: MoverAssignmentWithJob[]
  payments: MoverPayment[]
  carryover: number
  periodStart: string
  periodEnd: string
}

export default function MoverCard({ mover, assignments, payments, carryover, periodStart, periodEnd }: Props) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [payOpen, setPayOpen] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  // Only holds values the user is actively editing — falls back to the prop value otherwise,
  // so newly added/refreshed assignments always render their real hours/amount.
  const [hoursDraft, setHoursDraft] = useState<Record<string, string>>({})
  const [amountDraft, setAmountDraft] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const totalHours = assignments.reduce((sum, a) => sum + (a.hours ?? 0), 0)
  const owed = assignments.reduce((sum, a) => sum + (a.amount_override != null ? Number(a.amount_override) : (a.hours ?? 0) * mover.hourly_rate), 0)
  const paid = payments.reduce((sum, p) => sum + Number(p.amount), 0)
  const remaining = carryover + owed - paid

  async function saveHours(assignmentId: string, value: string) {
    setSavingId(assignmentId)
    await fetch(`/api/admin/mover-assignments/${assignmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours: value === '' ? null : value }),
    }).catch(() => {})
    setSavingId(null)
    router.refresh()
  }

  async function saveAmount(assignmentId: string, value: string) {
    setSavingId(assignmentId)
    await fetch(`/api/admin/mover-assignments/${assignmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount_override: value === '' ? null : value }),
    }).catch(() => {})
    setSavingId(null)
    router.refresh()
  }

  async function removeAssignment(assignmentId: string, isManual: boolean) {
    if (!confirm(isManual ? 'Remove this entry?' : 'Unassign this mover from the job?')) return
    await fetch(`/api/admin/mover-assignments/${assignmentId}`, { method: 'DELETE' }).catch(() => {})
    router.refresh()
  }

  async function deletePayment(paymentId: string) {
    if (!confirm('Remove this payment record?')) return
    await fetch(`/api/admin/mover-payments/${paymentId}`, { method: 'DELETE' }).catch(() => {})
    router.refresh()
  }

  async function toggleActive() {
    await fetch(`/api/admin/movers/${mover.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !mover.active }),
    }).catch(() => {})
    router.refresh()
  }

  async function deleteMover() {
    if (!confirm(`Permanently delete ${mover.name}? This also removes all their job assignments and payment history.`)) return
    await fetch(`/api/admin/movers/${mover.id}`, { method: 'DELETE' }).catch(() => {})
    router.refresh()
  }

  const balanceColor = remaining > 0.004 ? '#9A4B12' : '#254220'
  const balanceBg = remaining > 0.004 ? '#FDE4C8' : '#D6E8D3'

  const todayStr = new Date().toLocaleDateString('en-CA')
  const defaultEntryDate = todayStr >= periodStart && todayStr <= periodEnd ? todayStr : periodStart

  return (
    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F5F0EB', overflow: 'hidden', opacity: mover.active ? 1 : 0.65 }}>
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #F5F0EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: mover.active ? '#3FA34D' : '#9A8E83', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1714' }}>{mover.name}</div>
            <div style={{ fontSize: '11.5px', color: '#9A8E83' }}>
              {money(mover.hourly_rate)}/hr{mover.phone ? ` · ${mover.phone}` : ''}{!mover.active ? ' · Inactive' : ''}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button onClick={() => setEditOpen(true)} style={{ padding: '5px 10px', border: '1.5px solid #E8E0D5', borderRadius: '6px', background: 'white', color: '#6B5E54', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
          <button onClick={toggleActive} style={{ padding: '5px 10px', border: '1.5px solid #E8E0D5', borderRadius: '6px', background: 'white', color: '#6B5E54', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}>{mover.active ? 'Deactivate' : 'Reactivate'}</button>
          <button onClick={deleteMover} style={{ padding: '5px 10px', border: '1.5px solid #ef4444', borderRadius: '6px', background: 'white', color: '#ef4444', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
        </div>
      </div>

      <div style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8E83', letterSpacing: '0.4px' }}>HOURS &amp; ENTRIES THIS WEEK</div>
          <button onClick={() => setManualOpen(true)} style={{ padding: '4px 10px', border: '1.5px solid #254220', borderRadius: '6px', background: 'white', color: '#254220', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}>+ Add Entry</button>
        </div>
        {assignments.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#9A8E83', margin: '0 0 12px' }}>No jobs or hours logged this week.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            {assignments.map(a => {
              const job = a.calendar_jobs
              const isManual = !job
              const isFlat = a.amount_override != null
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: '#FAF7F2', borderRadius: '8px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '160px', fontSize: '12.5px', color: '#1A1714' }}>
                    {job ? (
                      <>
                        <strong>{JOB_ICON[job.job_type]} {formatDate(job.event_date)}</strong>
                        {job.event_time && <span style={{ color: '#6B5E54' }}> · {formatTime(job.event_time)}</span>}
                        <div style={{ fontSize: '11.5px', color: '#9A8E83' }}>{job.is_subcontract ? (job.company_name || 'Subcontract') : (job.pickup_address || job.customer_name || '—')}</div>
                      </>
                    ) : (
                      <>
                        <strong>{isFlat ? '💵' : '⏱'} {a.work_date ? formatDate(a.work_date) : ''}</strong>
                        <div style={{ fontSize: '11.5px', color: '#9A8E83' }}>{a.label || (isFlat ? 'Flat amount' : 'Manual hours')}</div>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isFlat ? (
                      <>
                        <label style={{ fontSize: '11px', color: '#6B5E54', fontWeight: 600 }}>Amount $</label>
                        <input
                          type="number" min="0" step="0.01"
                          value={amountDraft[a.id] ?? (a.amount_override != null ? String(a.amount_override) : '')}
                          onChange={e => setAmountDraft(d => ({ ...d, [a.id]: e.target.value }))}
                          onBlur={e => saveAmount(a.id, e.target.value)}
                          disabled={savingId === a.id}
                          style={{ width: '72px', padding: '5px 7px', border: '1.5px solid #E8E0D5', borderRadius: '6px', fontSize: '12.5px', outline: 'none' }}
                        />
                      </>
                    ) : (
                      <>
                        <label style={{ fontSize: '11px', color: '#6B5E54', fontWeight: 600 }}>Hours</label>
                        <input
                          type="number" min="0" step="0.25"
                          value={hoursDraft[a.id] ?? (a.hours != null ? String(a.hours) : '')}
                          onChange={e => setHoursDraft(d => ({ ...d, [a.id]: e.target.value }))}
                          onBlur={e => saveHours(a.id, e.target.value)}
                          disabled={savingId === a.id}
                          style={{ width: '64px', padding: '5px 7px', border: '1.5px solid #E8E0D5', borderRadius: '6px', fontSize: '12.5px', outline: 'none' }}
                        />
                      </>
                    )}
                    <button onClick={() => removeAssignment(a.id, isManual)} title={isManual ? 'Remove entry' : 'Unassign'} style={{ background: 'transparent', border: 'none', color: '#9A8E83', fontSize: '15px', cursor: 'pointer', lineHeight: 1 }}>×</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {Math.abs(carryover) > 0.004 && (
          <p style={{ fontSize: '12px', color: carryover > 0 ? '#9A4B12' : '#254220', margin: '0 0 8px' }}>
            {carryover > 0
              ? `Carried over from before: ${money(carryover)} still unpaid`
              : `Carried over from before: ${money(Math.abs(carryover))} credit (overpaid)`}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', padding: '10px 12px', background: '#FAF7F2', borderRadius: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '12.5px', color: '#1A1714' }}><strong>{totalHours.toFixed(2)}</strong> hrs</span>
          <span style={{ fontSize: '12.5px', color: '#1A1714' }}>Owed this week: <strong>{money(owed)}</strong></span>
          <span style={{ fontSize: '12.5px', color: '#1A1714' }}>Paid this week: <strong>{money(paid)}</strong></span>
          <span style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: '20px', background: balanceBg, color: balanceColor, fontSize: '12px', fontWeight: 700 }}>
            {remaining > 0.004 ? `${money(remaining)} owed` : remaining < -0.004 ? `${money(Math.abs(remaining))} credit` : 'Paid in full'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {payments.map(p => (
              <div key={p.id} style={{ fontSize: '11.5px', color: '#6B5E54', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{formatDate(p.paid_date)} — {money(Number(p.amount))}{p.notes ? ` (${p.notes})` : ''}</span>
                <button onClick={() => deletePayment(p.id)} title="Remove payment" style={{ background: 'transparent', border: 'none', color: '#9A8E83', fontSize: '13px', cursor: 'pointer', lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
          <button onClick={() => setPayOpen(true)} style={{ padding: '7px 14px', background: '#254220', color: 'white', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Record Payment
          </button>
        </div>
      </div>

      <MoverModal key={editOpen ? 'edit-open' : 'edit-closed'} open={editOpen} mover={mover} onClose={() => setEditOpen(false)} onSaved={() => router.refresh()} />
      <ManualEntryModal
        key={manualOpen ? 'manual-open' : 'manual-closed'}
        open={manualOpen}
        moverId={mover.id}
        moverName={mover.name}
        hourlyRate={mover.hourly_rate}
        defaultDate={defaultEntryDate}
        onClose={() => setManualOpen(false)}
        onSaved={() => router.refresh()}
      />
      <RecordPaymentModal
        key={payOpen ? 'pay-open' : 'pay-closed'}
        open={payOpen}
        moverId={mover.id}
        moverName={mover.name}
        periodStart={periodStart}
        periodEnd={periodEnd}
        suggestedAmount={Math.max(remaining, 0)}
        onClose={() => setPayOpen(false)}
        onSaved={() => router.refresh()}
      />
    </div>
  )
}
