'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = ['pending', 'confirmed', 'cancelled'] as const
type Status = typeof STATUSES[number]

const COLORS: Record<Status, { bg: string; color: string }> = {
  pending:   { bg: '#FEF3C7', color: '#92400E' },
  confirmed: { bg: '#D1FAE5', color: '#065F46' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B' },
}

export default function StatusSelect({ orderId, current }: { orderId: string; current: string }) {
  const initial = STATUSES.includes(current as Status) ? (current as Status) : 'pending'
  const [status, setStatus] = useState<Status>(initial)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSelect(next: Status) {
    setOpen(false)
    if (next === status) return
    setSaving(true)
    setStatus(next)
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    setSaving(false)
    router.refresh()
  }

  const c = COLORS[status]

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => !saving && setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          backgroundColor: c.bg, color: c.color,
          border: 'none', borderRadius: '20px',
          paddingTop: '4px', paddingBottom: '4px',
          paddingLeft: '10px', paddingRight: '8px',
          fontSize: '12px', fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
          textTransform: 'capitalize', whiteSpace: 'nowrap',
          opacity: saving ? 0.6 : 1,
        }}
      >
        {status}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke={c.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50,
          background: 'white', borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          border: '1px solid #E8E0D5',
          overflow: 'hidden', minWidth: '120px',
        }}>
          {STATUSES.map(s => {
            const sc = COLORS[s]
            return (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  width: '100%', padding: '8px 12px',
                  background: s === status ? '#FAF7F2' : 'white',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontSize: '13px', fontWeight: s === status ? 600 : 400,
                  color: '#1A1714',
                }}
              >
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: sc.color, flexShrink: 0,
                }} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
