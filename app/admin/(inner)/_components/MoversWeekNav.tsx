'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function shiftWeek(weekStartStr: string, deltaWeeks: number) {
  const [y, m, d] = weekStartStr.split('-').map(Number)
  return fmt(new Date(y, m - 1, d + deltaWeeks * 7))
}

function currentWeekStart() {
  const now = new Date()
  return fmt(new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()))
}

export default function MoversWeekNav({ weekStartStr, label }: { weekStartStr: string; label: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function go(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('week', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  const btn: React.CSSProperties = {
    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1.5px solid #E8E0D5', borderRadius: '8px', background: 'white', color: '#254220',
    fontSize: '15px', fontWeight: 700, cursor: 'pointer',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button style={btn} onClick={() => go(shiftWeek(weekStartStr, -1))} aria-label="Previous week">‹</button>
      <span style={{ fontSize: '14px', fontWeight: 700, color: '#1A1714', minWidth: '190px', textAlign: 'center' }}>{label}</span>
      <button style={btn} onClick={() => go(shiftWeek(weekStartStr, 1))} aria-label="Next week">›</button>
      <button
        onClick={() => go(currentWeekStart())}
        style={{ padding: '0 12px', height: '32px', border: '1.5px solid #E8E0D5', borderRadius: '8px', background: 'white', color: '#6B5E54', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginLeft: '4px' }}
      >
        This Week
      </button>
    </div>
  )
}
