'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending', dot: '#92400E' },
  { value: 'confirmed', label: 'Confirmed', dot: '#065F46' },
  { value: 'completed', label: 'Completed', dot: '#1E40AF' },
  { value: 'cancelled', label: 'Cancelled', dot: '#991B1B' },
]

export default function StatusFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get('status') ?? ''

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('status', value)
    } else {
      params.delete('status')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <>
      <style>{`
        .sf-bar { display: flex; gap: 6px; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .sf-bar { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .sf-bar::-webkit-scrollbar { display: none; }
          .sf-bar { scrollbar-width: none; }
        }
      `}</style>
      <div className="sf-bar">
        {FILTERS.map(f => {
          const active = current === f.value
          return (
            <button
              key={f.value}
              onClick={() => select(f.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: active ? '1.5px solid #254220' : '1.5px solid #E8E0D5',
                background: active ? '#254220' : 'white',
                color: active ? 'white' : '#6B5E54',
                fontSize: '13px', fontWeight: active ? 600 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {f.dot && (
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: active ? 'white' : f.dot, flexShrink: 0 }} />
              )}
              {f.label}
            </button>
          )
        })}
      </div>
    </>
  )
}
