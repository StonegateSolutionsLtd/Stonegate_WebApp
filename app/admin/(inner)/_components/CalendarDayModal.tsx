'use client'
import type { CalendarJob } from '@/lib/types'
import { SIZE_SHORT, TYPE_STYLE, formatTime } from './calendarJobDisplay'

interface Props {
  date: string | null
  jobs: CalendarJob[]
  onClose: () => void
  onSelectJob: (job: CalendarJob) => void
}

function formatDateLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function CalendarDayModal({ date, jobs, onClose, onSelectJob }: Props) {
  if (!date) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ background: '#254220', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{formatDateLabel(date)}</span>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '70vh', overflowY: 'auto' }}>
          {jobs.length === 0 && (
            <p style={{ color: '#9A8E83', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>No jobs scheduled for this day.</p>
          )}
          {jobs.map(job => {
            const style = TYPE_STYLE[job.job_type]
            const sizeLabel = job.size ? SIZE_SHORT[job.size] : ''
            const subLine = job.is_subcontract
              ? `🏢 ${job.company_name || 'Subcontract'}`
              : (job.pickup_address || job.customer_name || '')
            return (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                style={{
                  border: '1.5px solid #F5F0EB',
                  borderLeft: job.is_subcontract ? '4px solid #7C3AED' : `4px solid ${style.color}`,
                  borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', background: '#FAF7F2',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: style.color }}>{style.icon} {formatTime(job.event_time)}</span>
                  {sizeLabel && <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B5E54', background: 'white', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>{sizeLabel}</span>}
                </div>
                {subLine && (
                  <div style={{ fontSize: '13px', color: job.is_subcontract ? '#7C3AED' : '#6B5E54', marginTop: '2px', fontWeight: job.is_subcontract ? 600 : 400 }}>
                    {subLine}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
