'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDateKey } from '@/lib/scheduling'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function parseKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** An always-open month grid for picking one day; days before `min` can't be picked */
export default function MonthCalendar({ value, min, onChange }: { value: string; min: string; onChange: (date: string) => void }) {
  const start = parseKey(value || min)
  const [view, setView] = useState({ year: start.getFullYear(), month: start.getMonth() })
  const minDate = parseKey(min)
  const atFirstMonth = view.year === minDate.getFullYear() && view.month === minDate.getMonth()

  const firstWeekday = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (string | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => formatDateKey(new Date(view.year, view.month, i + 1))),
  ]

  function shift(by: number) {
    setView(v => {
      const d = new Date(v.year, v.month + by, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: '#E0D8D0', backgroundColor: '#FFFFFF' }}>
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => shift(-1)} disabled={atFirstMonth} aria-label="Previous month"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[#F0EBE3] disabled:opacity-30 disabled:hover:bg-transparent"
          style={{ color: '#4A3F38' }}>
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-bold" style={{ color: '#1A1714' }}>{MONTHS[view.month]} {view.year}</span>
        <button type="button" onClick={() => shift(1)} aria-label="Next month"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[#F0EBE3]"
          style={{ color: '#4A3F38' }}>
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map(d => (
          <span key={d} className="text-[11px] font-semibold uppercase py-1" style={{ color: '#B0A49A' }}>{d}</span>
        ))}
        {cells.map((key, i) => {
          if (!key) return <span key={`blank-${i}`} />
          const past = key < min
          const selected = key === value
          return (
            <button
              key={key}
              type="button"
              disabled={past}
              onClick={() => onChange(key)}
              aria-pressed={selected}
              aria-label={parseKey(key).toDateString()}
              className={cn(
                'h-10 rounded-lg text-sm font-semibold transition-colors',
                !past && !selected && 'hover:bg-[#E8F0E6]',
                past && 'cursor-not-allowed',
              )}
              style={{
                backgroundColor: selected ? '#254220' : undefined,
                color: selected ? '#FAF7F2' : past ? '#D3C9BF' : '#1A1714',
                boxShadow: key === min && !selected ? 'inset 0 0 0 1.5px #B5C9B0' : undefined,
              }}
            >
              {parseKey(key).getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
