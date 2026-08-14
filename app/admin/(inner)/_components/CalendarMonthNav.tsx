'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

function shiftMonth(year: number, monthIndex: number, delta: number) {
  const d = new Date(year, monthIndex + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function CalendarMonthNav({ year, monthIndex, label }: { year: number; monthIndex: number; label: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function go(monthValue: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('month', monthValue)
    router.push(`${pathname}?${params.toString()}`)
  }

  const now = new Date()
  const currentMonthValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const btn: React.CSSProperties = {
    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1.5px solid #E8E0D5', borderRadius: '8px', background: 'white', color: '#254220',
    fontSize: '15px', fontWeight: 700, cursor: 'pointer',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button style={btn} onClick={() => go(shiftMonth(year, monthIndex, -1))} aria-label="Previous month">‹</button>
      <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1714', minWidth: '150px', textAlign: 'center' }}>{label}</span>
      <button style={btn} onClick={() => go(shiftMonth(year, monthIndex, 1))} aria-label="Next month">›</button>
      <button
        onClick={() => go(currentMonthValue)}
        style={{ padding: '0 12px', height: '32px', border: '1.5px solid #E8E0D5', borderRadius: '8px', background: 'white', color: '#6B5E54', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginLeft: '4px' }}
      >
        Today
      </button>
    </div>
  )
}
