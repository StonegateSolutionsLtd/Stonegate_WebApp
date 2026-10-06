'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DEFAULT_DURATION_MIN, addDays, formatDuration, nowInBusinessZone, type DayAvailability } from '@/lib/scheduling'
import type { CalendarJobType } from '@/lib/types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function parseLocal(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function longDate(dateStr: string) {
  const d = parseLocal(dateStr)
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

interface Props {
  jobType: CalendarJobType
  date: string
  time: string
  onChange: (date: string, time: string) => void
}

export default function TimeSlotPicker({ jobType, date, time, onChange }: Props) {
  const [weekStart, setWeekStart] = useState(() => date || nowInBusinessZone().date)
  const [days, setDays] = useState<DayAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  const today = nowInBusinessZone().date
  const activeDate = date || weekStart

  const load = useCallback(async () => {
    setLoading(true)
    setFailed(false)
    try {
      const res = await fetch(`/api/availability?type=${jobType}&start=${weekStart}&days=7`)
      if (!res.ok) throw new Error('availability request failed')
      const data = await res.json()
      setDays(data.days ?? [])
    } catch {
      setFailed(true)
      setDays([])
    } finally {
      setLoading(false)
    }
  }, [jobType, weekStart])

  useEffect(() => {
    // Standard fetch-on-mount/dependency-change pattern; the loading/failed
    // resets inside `load` are flagged by the new set-state-in-effect rule,
    // but there's no external system here to synchronize with instead.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  // Open straight to today instead of making the customer click a day first.
  useEffect(() => {
    if (!date) onChange(today, '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeDay = days.find(d => d.date === activeDate)
  const slots = activeDay?.slots ?? []
  const atFirstWeek = weekStart <= today

  function shiftWeek(delta: number) {
    const next = addDays(weekStart, delta * 7)
    const target = next < today ? today : next
    setWeekStart(target)
    // Keep the selected day inside the visible week.
    if (date && (date < target || date > addDays(target, 6))) onChange('', '')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <span className="text-base font-bold" style={{ color: '#1A1714' }}>{longDate(activeDate)}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => shiftWeek(-1)}
            disabled={atFirstWeek}
            aria-label="Previous week"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
            style={{ border: '1.5px solid #E0D8D0', backgroundColor: '#FFFFFF', color: '#254220' }}
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => shiftWeek(1)}
            aria-label="Next week"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ border: '1.5px solid #E0D8D0', backgroundColor: '#FFFFFF', color: '#254220' }}
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map(dayDate => {
          const selected = dayDate === date
          return (
            <button
              key={dayDate}
              type="button"
              onClick={() => onChange(dayDate, '')}
              className="flex flex-col items-center gap-0.5 py-2.5 rounded-xl transition-[background-color,border-color,color] duration-150"
              style={{
                border: selected ? '1.5px solid #254220' : '1.5px solid transparent',
                backgroundColor: selected ? '#254220' : 'transparent',
                color: selected ? '#FAF7F2' : '#6B5E54',
              }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide">
                {WEEKDAYS[parseLocal(dayDate).getDay()]}
              </span>
              <span className="text-lg font-bold">
                {parseLocal(dayDate).getDate()}
              </span>
            </button>
          )
        })}
      </div>

      <div className="my-5 h-px" style={{ backgroundColor: '#F0EBE3' }} />

      <div className="flex items-baseline justify-between mb-3.5">
        <span className="text-sm font-bold" style={{ color: '#1A1714' }}>Select a time slot</span>
        <span className="text-xs" style={{ color: '#9A8E83' }}>
          Reserves about {formatDuration(DEFAULT_DURATION_MIN[jobType])}
        </span>
      </div>

      {loading ? (
        <p className="text-sm py-4" style={{ color: '#9A8E83' }}>Checking availability…</p>
      ) : failed ? (
        <div className="py-4">
          <p className="text-sm mb-2" style={{ color: '#ef4444' }}>Couldn&apos;t load availability.</p>
          <button type="button" onClick={load} className="text-sm font-semibold underline" style={{ color: '#254220' }}>
            Try again
          </button>
        </div>
      ) : !date ? (
        <p className="text-sm py-4" style={{ color: '#9A8E83' }}>Pick a day above to see open times.</p>
      ) : slots.length === 0 ? (
        <div className="rounded-xl px-4 py-3.5" style={{ backgroundColor: '#FDE4C8' }}>
          <p className="text-sm font-semibold" style={{ color: '#9A4B12' }}>
            {longDate(date)} is fully booked.
          </p>
          <p className="text-sm mt-0.5" style={{ color: '#9A4B12' }}>
            Please pick another day.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {slots.map(slot => {
            const selected = slot.value === time
            return (
              <button
                key={slot.value}
                type="button"
                onClick={() => onChange(date, slot.value)}
                className="h-11 rounded-xl text-sm font-semibold transition-[background-color,border-color,color,box-shadow] duration-150"
                style={{
                  border: `1.5px solid ${selected ? '#254220' : '#E0D8D0'}`,
                  backgroundColor: selected ? '#254220' : '#FFFFFF',
                  color: selected ? '#FAF7F2' : '#4A3F38',
                  boxShadow: selected ? '0 2px 8px rgba(77,107,71,0.25)' : 'none',
                }}
              >
                {slot.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
