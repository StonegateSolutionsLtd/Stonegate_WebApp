'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  payload: Record<string, unknown>
  alreadyAdded: boolean
}

export default function AddToCalendarButton({ payload, alreadyAdded }: Props) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(alreadyAdded)
  const router = useRouter()

  if (added) {
    return (
      <span style={{ background: '#F5F0EB', color: '#9A8E83', padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', display: 'inline-block', boxSizing: 'border-box', border: '1.5px solid transparent' }}>
        📅 On Calendar
      </span>
    )
  }

  async function handleClick() {
    setAdding(true)
    const res = await fetch('/api/admin/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setAdding(false)
    if (res.ok) {
      setAdded(true)
      router.refresh()
    } else {
      alert('Failed to add to calendar. Try again.')
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={adding}
      style={{ background: 'white', color: '#254220', border: '1.5px solid #254220', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', fontWeight: 600, cursor: adding ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' }}
    >
      {adding ? 'Adding…' : '📅 Add to Calendar'}
    </button>
  )
}
