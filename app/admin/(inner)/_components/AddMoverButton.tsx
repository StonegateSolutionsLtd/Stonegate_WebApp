'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MoverModal from './MoverModal'

export default function AddMoverButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ background: '#254220', color: 'white', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        + Add Mover
      </button>
      <MoverModal
        key={open ? 'open' : 'closed'}
        open={open}
        mover={null}
        onClose={() => setOpen(false)}
        onSaved={() => router.refresh()}
      />
    </>
  )
}
