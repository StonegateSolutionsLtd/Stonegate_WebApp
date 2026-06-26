'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  orderId: string
  customerName: string
  apiPath: string
}

export default function DeleteButton({ orderId, customerName, apiPath }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`${apiPath}/${orderId}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      setDeleting(false)
      setConfirming(false)
      alert('Failed to delete. Try again.')
    }
  }

  if (confirming) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: '12px', color: '#6B5E54' }}>Delete {customerName}?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          {deleting ? '…' : 'Yes'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{ background: '#F5F0EB', color: '#6B5E54', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
    >
      Delete
    </button>
  )
}
