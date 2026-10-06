'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DURATION_OPTIONS_MIN, formatDuration } from '@/lib/scheduling'

interface Props {
  orderId: string
  current: number
  apiPath: string
}

export default function DurationSelect({ orderId, current, apiPath }: Props) {
  const [duration, setDuration] = useState(current)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  async function handleSelect(next: number) {
    setOpen(false)
    if (next === duration) return
    setSaving(true)
    setDuration(next)
    await fetch(`${apiPath}/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration_minutes: next }),
    }).catch(() => {})
    setSaving(false)
    router.refresh()
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => !saving && setOpen(o => !o)}
        title="How long this job blocks the schedule"
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          background: 'white', color: '#6B5E54',
          border: '1.5px solid #E8E0D5', borderRadius: '20px',
          padding: '3px 9px 3px 11px',
          fontSize: '12px', fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap', opacity: saving ? 0.6 : 1,
        }}
      >
        ⏱ {formatDuration(duration)}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="#6B5E54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50,
          background: 'white', borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          border: '1px solid #E8E0D5', overflow: 'hidden', minWidth: '120px',
          maxHeight: '220px', overflowY: 'auto',
        }}>
          {DURATION_OPTIONS_MIN.map(mins => (
            <button
              key={mins}
              onClick={() => handleSelect(mins)}
              style={{
                display: 'block', width: '100%', padding: '8px 12px',
                background: mins === duration ? '#FAF7F2' : 'white',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: '13px', fontWeight: mins === duration ? 600 : 400, color: '#1A1714',
              }}
            >
              {formatDuration(mins)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
