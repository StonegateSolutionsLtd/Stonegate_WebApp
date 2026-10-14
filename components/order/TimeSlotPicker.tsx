'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DEFAULT_DURATION_MIN, addDays, formatDuration, nowInBusinessZone, type DayAvailability } from '@/lib/scheduling'
import type { CalendarJobType } from '@/lib/types'
import { cn } from '@/lib/utils'

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
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed hover:scale-110 hover:-translate-x-0.5 active:scale-95 disabled:hover:scale-100 disabled:hover:translate-x-0"
            style={{ border: '1.5px solid #E0D8D0', backgroundColor: '#FFFFFF', color: '#254220' }}
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => shiftWeek(1)}
            aria-label="Next week"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 hover:scale-110 hover:translate-x-0.5 active:scale-95"
            style={{ border: '1.5px solid #E0D8D0', backgroundColor: '#FFFFFF', color: '#254220' }}
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div key={`week-${weekStart}`} className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map((dayDate, i) => {
          const selected = dayDate === date
          return (
            <button
              key={dayDate}
              type="button"
              onClick={() => onChange(dayDate, '')}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2.5 rounded-xl transition-[background-color,border-color,color,transform] duration-150 animate-in fade-in slide-in-from-bottom-2 hover:scale-105 active:scale-95',
                selected && 'scale-[1.04]'
              )}
              style={{
                border: selected ? '1.5px solid #254220' : '1.5px solid transparent',
                backgroundColor: selected ? '#254220' : 'transparent',
                color: selected ? '#FAF7F2' : '#6B5E54',
                animationDelay: `${i * 35}ms`,
                animationDuration: '300ms',
                animationFillMode: 'backwards',
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
        <span className="text-sm font-bold" style={{ color: '#1A1714' }}>When works for you?</span>
        <span className="text-xs" style={{ color: '#9A8E83' }}>
          Usually about {formatDuration(DEFAULT_DURATION_MIN[jobType])}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-0.5">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="h-11 rounded-xl animate-pulse"
              style={{ backgroundColor: '#F0EBE3', animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      ) : failed ? (
        <div className="py-4 animate-in fade-in duration-300">
          <p className="text-sm mb-2" style={{ color: '#ef4444' }}>Couldn&apos;t load availability.</p>
          <button type="button" onClick={load} className="text-sm font-semibold underline transition-opacity hover:opacity-70" style={{ color: '#254220' }}>
            Try again
          </button>
        </div>
      ) : !date ? (
        <p className="text-sm py-4 animate-in fade-in duration-300" style={{ color: '#9A8E83' }}>Pick a day above to see open times.</p>
      ) : slots.length === 0 ? (
        <div className="rounded-xl px-4 py-3.5 animate-in fade-in zoom-in-95 duration-300" style={{ backgroundColor: '#FDE4C8' }}>
          <p className="text-sm font-semibold" style={{ color: '#9A4B12' }}>
            No openings left on {longDate(date)}.
          </p>
          <p className="text-sm mt-0.5" style={{ color: '#9A4B12' }}>
            Try another day - or give us a call, we can often fit you in.
          </p>
        </div>
      ) : (
        <div key={`slots-${activeDate}`} className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {slots.map((slot, i) => {
            const selected = slot.value === time
            return (
              <button
                key={slot.value}
                type="button"
                onClick={() => onChange(date, slot.value)}
                className={cn(
                  'h-11 rounded-xl text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 animate-in fade-in slide-in-from-bottom-2 hover:scale-105 hover:-translate-y-0.5 active:scale-95',
                  selected && 'scale-[1.03]'
                )}
                style={{
                  border: `1.5px solid ${selected ? '#254220' : '#E0D8D0'}`,
                  backgroundColor: selected ? '#254220' : '#FFFFFF',
                  color: selected ? '#FAF7F2' : '#4A3F38',
                  boxShadow: selected ? '0 2px 8px rgba(77,107,71,0.25)' : 'none',
                  animationDelay: `${i * 40}ms`,
                  animationDuration: '300ms',
                  animationFillMode: 'backwards',
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
