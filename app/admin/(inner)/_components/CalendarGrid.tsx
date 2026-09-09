'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CalendarJobModal from './CalendarJobModal'
import CalendarDayModal from './CalendarDayModal'
import { SIZE_SHORT, TYPE_STYLE, formatTime } from './calendarJobDisplay'
import type { CalendarJob } from '@/lib/types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

export default function CalendarGrid({ weeks, jobsByDate }: Props) {
  const [editingJob, setEditingJob] = useState<CalendarJob | null>(null)
  const [dayView, setDayView] = useState<string | null>(null)
  const router = useRouter()

  return (
    <>
      <style>{`
        .cal-card { background: white; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #F5F0EB; overflow: hidden; }
        .cal-header-row, .cal-week-row { display: grid; grid-template-columns: repeat(7, 1fr); }
        .cal-header-row { background: #254220; }
        .cal-header-cell { padding: 10px 6px; text-align: center; font-size: 11px; font-weight: 700; color: white; letter-spacing: 0.5px; }
        .cal-week-row { border-bottom: 1px solid #F5F0EB; }
        .cal-week-row:last-child { border-bottom: none; }
        .cal-day-cell {
          height: 128px;
          min-width: 0;
          padding: 6px;
          cursor: pointer;
          border-right: 1px solid #F5F0EB;
          display: flex;
          flex-direction: column;
          gap: 3px;
          overflow: hidden;
        }
        .cal-day-badge {
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .cal-jobs-area {
          flex: 1;
          min-height: 0;
          min-width: 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .cal-job-pill {
          border-radius: 5px;
          padding: 3px 5px;
          cursor: pointer;
          overflow: hidden;
          min-width: 0;
          flex-shrink: 0;
        }
        .cal-job-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          font-weight: 700;
          min-width: 0;
        }
        .cal-job-time {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }
        .cal-job-subline {
          font-size: 9.5px;
          color: #6B5E54;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 640px) {
          .cal-header-cell { padding: 6px 2px; font-size: 9.5px; }
          .cal-day-cell { height: 84px; padding: 4px; gap: 2px; }
          .cal-day-badge { width: 16px; height: 16px; font-size: 9.5px; }
          .cal-job-pill { padding: 2px 4px; border-radius: 4px; }
          .cal-job-row { font-size: 8.5px; gap: 2px; }
          .cal-job-subline { font-size: 7.5px; }
        }
      `}</style>

      <div className="cal-card">
        <div className="cal-header-row">
          {WEEKDAYS.map(d => (
            <div key={d} className="cal-header-cell">{d}</div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="cal-week-row">
            {week.map(cell => {
              const jobs = jobsByDate[cell.date] ?? []
              return (
                <div
                  key={cell.date}
                  className="cal-day-cell"
                  onClick={() => setDayView(cell.date)}
                  style={{
                    background: cell.isToday ? '#FAF7F2' : 'white',
                    opacity: cell.inMonth ? 1 : 0.4,
                  }}
                >
                  <span
                    className="cal-day-badge"
                    style={{
                      fontWeight: cell.isToday ? 800 : 600,
                      color: cell.isToday ? '#254220' : '#9A8E83',
                      background: cell.isToday ? '#D6E8D3' : 'transparent',
                    }}
                  >
                    {cell.day}
                  </span>

                  <div className="cal-jobs-area">
                    {jobs.map(job => {
                      const style = TYPE_STYLE[job.job_type]
                      const sizeLabel = job.size ? SIZE_SHORT[job.size] : ''
                      const subLine = job.is_subcontract
                        ? `🏢 ${job.company_name || 'Subcontract'}`
                        : (job.pickup_address || job.customer_name || '')
                      return (
                        <div
                          key={job.id}
                          className="cal-job-pill"
                          onClick={e => { e.stopPropagation(); setEditingJob(job) }}
                          title={`${style.icon} ${formatTime(job.event_time)}${job.pickup_address ? ' · ' + job.pickup_address : ''}`}
                          style={{
                            background: style.bg, color: style.color,
                            borderLeft: job.is_subcontract ? '3px solid #7C3AED' : `3px solid ${style.color}`,
                          }}
                        >
                          <div className="cal-job-row">
                            <span className="cal-job-time">{style.icon} {formatTime(job.event_time)}</span>
                            {sizeLabel && <span style={{ flexShrink: 0 }}>{sizeLabel}</span>}
                          </div>
                          {subLine && (
                            <div className="cal-job-subline">
                              {subLine}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <CalendarDayModal
        date={dayView}
        jobs={dayView ? jobsByDate[dayView] ?? [] : []}
        onClose={() => setDayView(null)}
        onSelectJob={job => { setDayView(null); setEditingJob(job) }}
      />

      <CalendarJobModal
        key={editingJob?.id ?? 'closed'}
        open={editingJob !== null}
        job={editingJob}
        onClose={() => setEditingJob(null)}
        onSaved={() => router.refresh()}
      />
    </>
  )
}
