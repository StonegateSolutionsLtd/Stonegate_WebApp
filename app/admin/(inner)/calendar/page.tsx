import { createServiceClient } from '@/lib/supabase/server'
import CalendarMonthNav from '../_components/CalendarMonthNav'
import AddCalendarJobButton from '../_components/AddCalendarJobButton'
import CalendarGrid, { type CalendarDay } from '../_components/CalendarGrid'
import type { CalendarJob } from '@/lib/types'

export const dynamic = 'force-dynamic'

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month } = await searchParams
  const now = new Date()

  let year = now.getFullYear()
  let monthIndex = now.getMonth()
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split('-').map(Number)
    year = y
    monthIndex = m - 1
  }

  const monthStart = new Date(year, monthIndex, 1)
  const monthEnd = new Date(year, monthIndex + 1, 0)
  const monthLabel = monthStart.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })

  const gridStart = new Date(year, monthIndex, 1 - monthStart.getDay())
  const gridEnd = new Date(year, monthIndex, monthEnd.getDate() + (6 - monthEnd.getDay()))

  const todayStr = fmt(now)
  const weeks: CalendarDay[][] = []
  let cursor = new Date(gridStart)
  while (cursor <= gridEnd) {
    const week: CalendarDay[] = []
    for (let i = 0; i < 7; i++) {
      const dateStr = fmt(cursor)
      week.push({ date: dateStr, day: cursor.getDate(), inMonth: cursor.getMonth() === monthIndex, isToday: dateStr === todayStr })
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  const supabase = createServiceClient()
  const { data: jobs } = await supabase
    .from('calendar_jobs')
    .select('*')
    .gte('event_date', fmt(gridStart))
    .lte('event_date', fmt(gridEnd))
    .order('event_date', { ascending: true })
    .order('event_time', { ascending: true })

  const jobsByDate: Record<string, CalendarJob[]> = {}
  for (const job of (jobs ?? []) as CalendarJob[]) {
    ;(jobsByDate[job.event_date] ??= []).push(job)
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
        <h1 style={{ color: '#254220', fontSize: '20px', fontWeight: 700, margin: 0 }}>Calendar</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <CalendarMonthNav year={year} monthIndex={monthIndex} label={monthLabel} />
          <AddCalendarJobButton defaultDate={todayStr} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px', fontSize: '12px', color: '#6B5E54' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#D6E8D3', display: 'inline-block' }} /> Moving</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#FDE4C8', display: 'inline-block' }} /> Junk Removal</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', borderRadius: '3px', border: '3px solid #7C3AED', display: 'inline-block' }} /> Subcontracting job</span>
        <span>Click a day to add a job · click a job to edit it</span>
      </div>

      <CalendarGrid weeks={weeks} jobsByDate={jobsByDate} />
    </div>
  )
}
