'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CalendarJobModal from './CalendarJobModal'

export default function AddCalendarJobButton({ defaultDate }: { defaultDate: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ background: '#254220', color: 'white', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        + Add to Calendar
      </button>
      <CalendarJobModal
        key={open ? 'open' : 'closed'}
        open={open}
        job={null}
        defaultDate={defaultDate}
        onClose={() => setOpen(false)}
        onSaved={() => router.refresh()}
      />
    </>
  )
}
