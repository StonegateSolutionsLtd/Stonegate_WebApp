'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface DatePickerProps {
  id?: string
  value: string
  onChange: (value: string) => void
  min?: string
}

export default function DatePicker({ id, value, onChange, min }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const parsed = value ? new Date(value + 'T12:00:00') : null
  const minDate = min ? new Date(min + 'T12:00:00') : null

  const [viewYear, setViewYear] = useState(() => parsed?.getFullYear() ?? new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => parsed?.getMonth() ?? new Date().getMonth())

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setPanelPos({ top: r.bottom + 6, left: r.left, width: r.width })
  }, [])

  function toggle() {
    updatePos()
    setOpen(o => !o)
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    let rafId: number
    function onScrollOrResize() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updatePos)
    }
    if (open) {
      document.addEventListener('mousedown', onClickOutside)
      window.addEventListener('scroll', onScrollOrResize, true)
      window.addEventListener('resize', onScrollOrResize)
    }
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
      cancelAnimationFrame(rafId)
    }
  }, [open, updatePos])

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function selectDay(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    onChange(d.toISOString().split('T')[0])
    setOpen(false)
  }

  function isDisabled(day: number) {
    if (!minDate) return false
    return new Date(viewYear, viewMonth, day) < minDate
  }
  function isSelected(day: number) {
    return !!parsed &&
      parsed.getFullYear() === viewYear &&
      parsed.getMonth() === viewMonth &&
      parsed.getDate() === day
  }
  function isToday(day: number) {
    const t = new Date()
    return t.getFullYear() === viewYear && t.getMonth() === viewMonth && t.getDate() === day
  }

  const displayValue = parsed
    ? parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={toggle}
        className="w-full h-9 flex items-center gap-2.5 px-3 rounded-md border text-sm transition-colors focus:outline-none"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: open ? '#4D6B47' : '#E0D8D0',
          color: displayValue ? '#1A1714' : '#C4B8AC',
          boxShadow: open ? '0 0 0 3px rgba(77,107,71,0.15)' : 'none',
        }}
      >
        <CalendarDays size={15} style={{ color: '#9A8E83', flexShrink: 0 }} />
        <span className="flex-1 text-left">{displayValue || 'Select date'}</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed z-[9999] rounded-2xl border p-4"
          style={{
            top: panelPos.top,
            left: panelPos.left,
            width: Math.max(panelPos.width, 280),
            backgroundColor: '#FAF7F2',
            borderColor: '#E8E0D5',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          }}
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[#E8E0D5]"
            >
              <ChevronLeft size={14} style={{ color: '#6B5E54' }} />
            </button>
            <span className="text-sm font-semibold" style={{ color: '#1A1714' }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[#E8E0D5]"
            >
              <ChevronRight size={14} style={{ color: '#6B5E54' }} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wide py-1" style={{ color: '#B0A49A' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`gap-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const sel = isSelected(day)
              const today = isToday(day)
              const disabled = isDisabled(day)
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                  className="h-8 w-8 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: sel ? '#4D6B47' : 'transparent',
                    color: disabled ? '#D9CFC4' : sel ? '#FAF7F2' : today ? '#4D6B47' : '#1A1714',
                    fontWeight: sel || today ? 600 : 400,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    outline: today && !sel ? '2px solid #4D6B47' : 'none',
                    outlineOffset: '-2px',
                  }}
                  onMouseEnter={e => {
                    if (!disabled && !sel)
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#E8E0D5'
                  }}
                  onMouseLeave={e => {
                    if (!disabled && !sel)
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
