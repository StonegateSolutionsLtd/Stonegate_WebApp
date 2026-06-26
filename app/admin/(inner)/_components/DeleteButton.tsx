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

  return (
    <>
      <button
        onClick={() => setConfirming(true)}
        style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
      >
        Delete
      </button>

      {confirming && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}
          onClick={() => { if (!deleting) setConfirming(false) }}
        >
          <div
            style={{ background: 'white', borderRadius: '14px', padding: '28px 32px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', maxWidth: '400px', width: '90%', textAlign: 'center', boxSizing: 'border-box' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '20px' }}>
              🗑️
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#1A1714' }}>Delete order?</h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#6B5E54', whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '100%' }}>
              This will permanently remove <strong>{customerName}</strong>&apos;s order. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setConfirming(false)}
                disabled={deleting}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1.5px solid #E8E0D5', background: 'white', color: '#6B5E54', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontSize: '14px', fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
