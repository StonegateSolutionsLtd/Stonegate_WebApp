'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CalendarJobModal from './CalendarJobModal'
import type { CalendarJob } from '@/lib/types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const SIZE_SHORT: Record<string, string> = {
  studio: 'Studio', '1br': '1BR', '2br': '2BR', '3br': '3BR', '4br+': '4BR+',
}

const TYPE_STYLE = {
  moving: { bg: '#D6E8D3', color: '#254220', icon: '🚛' },
  junk_removal: { bg: '#FDE4C8', color: '#9A4B12', icon: '🗑️' },
} as const

function formatTime(time: string | null): string {
  if (!time) return 'No time set'
  const [hStr, mStr] = time.split(':')
  const h = parseInt(hStr, 10)
  const m = mStr
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m} ${period}`
}

export interface CalendarDay {
  date: string
  day: number
  inMonth: boolean
  isToday: boolean
}

interface Props {
  weeks: CalendarDay[][]
  jobsByDate: Record<string, CalendarJob[]>
}

type ModalState = { mode: 'create'; date: string } | { mode: 'edit'; job: CalendarJob } | null

export default function CalendarGrid({ weeks, jobsByDate }: Props) {
  const [modal, setModal] = useState<ModalState>(null)
  const router = useRouter()

  return (
    <>
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F5F0EB', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#254220' }}>
          {WEEKDAYS.map(d => (
            <div key={d} style={{ padding: '10px 6px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'white', letterSpacing: '0.5px' }}>{d}</div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: wi === weeks.length - 1 ? 'none' : '1px solid #F5F0EB' }}>
            {week.map(cell => {
              const jobs = jobsByDate[cell.date] ?? []
              return (
                <div
                  key={cell.date}
                  onClick={() => setModal({ mode: 'create', date: cell.date })}
                  style={{
                    minHeight: '100px', padding: '6px', cursor: 'pointer',
                    background: cell.isToday ? '#FAF7F2' : 'white',
                    opacity: cell.inMonth ? 1 : 0.4,
                    borderRight: '1px solid #F5F0EB',
                    display: 'flex', flexDirection: 'column', gap: '3px',
                  }}
                >
                  <span style={{
                    fontSize: '11px', fontWeight: cell.isToday ? 800 : 600,
                    color: cell.isToday ? '#254220' : '#9A8E83',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: cell.isToday ? '#D6E8D3' : 'transparent',
                  }}>
                    {cell.day}
                  </span>

                  {jobs.map(job => {
                    const style = TYPE_STYLE[job.job_type]
                    const sizeLabel = job.size ? SIZE_SHORT[job.size] : ''
                    const subLine = job.is_subcontract
                      ? `🏢 ${job.company_name || 'Subcontract'}`
                      : (job.pickup_address || job.customer_name || '')
                    return (
                      <div
                        key={job.id}
                        onClick={e => { e.stopPropagation(); setModal({ mode: 'edit', job }) }}
                        title={`${style.icon} ${formatTime(job.event_time)}${job.pickup_address ? ' · ' + job.pickup_address : ''}`}
                        style={{
                          background: style.bg, color: style.color,
                          borderLeft: job.is_subcontract ? '3px solid #7C3AED' : `3px solid ${style.color}`,
                          borderRadius: '5px', padding: '3px 5px', cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 700 }}>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{style.icon} {formatTime(job.event_time)}</span>
                          {sizeLabel && <span style={{ flexShrink: 0 }}>{sizeLabel}</span>}
                        </div>
                        {subLine && (
                          <div style={{ fontSize: '9.5px', color: '#6B5E54', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {subLine}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <CalendarJobModal
        key={modal === null ? 'closed' : modal.mode === 'edit' ? modal.job.id : modal.date}
        open={modal !== null}
        job={modal?.mode === 'edit' ? modal.job : null}
        defaultDate={modal?.mode === 'create' ? modal.date : undefined}
        onClose={() => setModal(null)}
        onSaved={() => router.refresh()}
      />
    </>
  )
}
