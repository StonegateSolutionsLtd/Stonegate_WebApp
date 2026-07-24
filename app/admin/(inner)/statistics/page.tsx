import { createServiceClient } from '@/lib/supabase/server'
import MonthFilter from '../_components/MonthFilter'

export const dynamic = 'force-dynamic'

interface QuoteRecord {
  estimated_price: number | null
  created_at: string
  status: string
}

interface PeriodStats {
  total: number
  ordersReceived: number
  ordersQuoted: number
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

function aggregate(records: QuoteRecord[], start: Date, end?: Date): PeriodStats {
  let total = 0
  let ordersReceived = 0
  let ordersQuoted = 0

  for (const r of records) {
    if (r.status === 'cancelled') continue
    const created = new Date(r.created_at)
    if (created < start) continue
    if (end && created >= end) continue
    ordersReceived++
    if (r.estimated_price != null) {
      total += Number(r.estimated_price)
      ordersQuoted++
    }
  }

  return { total: round2(total), ordersReceived, ordersQuoted }
}

function combine(a: PeriodStats, b: PeriodStats): PeriodStats {
  return {
    total: round2(a.total + b.total),
    ordersReceived: a.ordersReceived + b.ordersReceived,
    ordersQuoted: a.ordersQuoted + b.ordersQuoted,
  }
}

const money = (n: number) => `$${n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

function daysBetween(start: Date, endExclusive: Date): Date[] {
  const days: Date[] = []
  let cur = startOfDay(start)
  const stop = startOfDay(endExclusive)
  while (cur < stop) {
    days.push(cur)
    cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1)
  }
  return days
}

function dailyLeadCounts(records: QuoteRecord[], days: Date[]): number[] {
  return days.map(day => {
    const next = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
    return records.filter(r => r.status !== 'cancelled' && new Date(r.created_at) >= day && new Date(r.created_at) < next).length
  })
}

function countDaysWithoutCompleted(records: QuoteRecord[], days: Date[]): number {
  let count = 0
  for (const day of days) {
    const next = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
    const hasCompleted = records.some(r => r.status === 'completed' && new Date(r.created_at) >= day && new Date(r.created_at) < next)
    if (!hasCompleted) count++
  }
  return count
}

export default async function StatisticsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month } = await searchParams
  const now = new Date()

  let selectedYear = now.getFullYear()
  let selectedMonthIndex = now.getMonth()
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split('-').map(Number)
    selectedYear = y
    selectedMonthIndex = m - 1
  }
  const selectedMonthStart = new Date(selectedYear, selectedMonthIndex, 1)
  const selectedMonthEnd = new Date(selectedYear, selectedMonthIndex + 1, 1)
  const yearStart = new Date(now.getFullYear(), now.getMonth() - 11, 1)
  // Widen the query window if the selected month falls outside the trailing 12 months
  const fetchStart = selectedMonthStart < yearStart ? selectedMonthStart : yearStart

  const supabase = createServiceClient()

  const [movingRes, junkRes] = await Promise.all([
    supabase.from('orders').select('estimated_price, created_at, status').gte('created_at', fetchStart.toISOString()),
    supabase.from('service_orders').select('estimated_price, created_at, status').eq('order_type', 'junk_removal').gte('created_at', fetchStart.toISOString()),
  ])

  const movingRecords = (movingRes.data ?? []) as QuoteRecord[]
  const junkRecords = (junkRes.data ?? []) as QuoteRecord[]
  const allRecords = [...movingRecords, ...junkRecords]

  const movingMonth = aggregate(movingRecords, selectedMonthStart, selectedMonthEnd)
  const movingYear = aggregate(movingRecords, yearStart)
  const junkMonth = aggregate(junkRecords, selectedMonthStart, selectedMonthEnd)
  const junkYear = aggregate(junkRecords, yearStart)
  const combinedMonth = combine(movingMonth, junkMonth)
  const combinedYear = combine(movingYear, junkYear)

  // Rolling "this week" / "last 2 weeks" windows, always relative to today
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
  const twoWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13)
  const todayEndExclusive = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  const movingWeek = aggregate(movingRecords, weekStart, todayEndExclusive)
  const junkWeek = aggregate(junkRecords, weekStart, todayEndExclusive)
  const combinedWeek = combine(movingWeek, junkWeek)

  const movingTwoWeek = aggregate(movingRecords, twoWeekStart, todayEndExclusive)
  const junkTwoWeek = aggregate(junkRecords, twoWeekStart, todayEndExclusive)
  const combinedTwoWeek = combine(movingTwoWeek, junkTwoWeek)

  // Lead activity for the selected month: daily counts + days with zero completed leads.
  // Capped at "today" when the selected month is the current, still-in-progress month.
  const isSelectedCurrentMonth = selectedYear === now.getFullYear() && selectedMonthIndex === now.getMonth()
  const activityEnd = isSelectedCurrentMonth ? todayEndExclusive : selectedMonthEnd
  const monthDays = daysBetween(selectedMonthStart, activityEnd)
  const dailyCounts = dailyLeadCounts(allRecords, monthDays)
  const daysWithoutCompleted = countDaysWithoutCompleted(allRecords, monthDays)
  const daysWithoutCompletedIsHigh = daysWithoutCompleted > 3

  const monthLabel = selectedMonthStart.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })
  const yearRangeLabel = `${yearStart.toLocaleDateString('en-CA', { month: 'short', year: 'numeric' })} – ${now.toLocaleDateString('en-CA', { month: 'short', year: 'numeric' })}`
  const weekRangeLabel = `${weekStart.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })} – ${now.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}`
  const twoWeekRangeLabel = `${twoWeekStart.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })} – ${now.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}`

  const monthValue = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}`
  const maxMonthValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const weekCards = [
    { label: 'Junk Removal', stats: junkWeek },
    { label: 'Moving', stats: movingWeek },
    { label: 'Combined', stats: combinedWeek, highlight: true },
  ]

  const twoWeekCards = [
    { label: 'Junk Removal', stats: junkTwoWeek },
    { label: 'Moving', stats: movingTwoWeek },
    { label: 'Combined', stats: combinedTwoWeek, highlight: true },
  ]

  const monthCards = [
    { label: 'Junk Removal', stats: junkMonth },
    { label: 'Moving', stats: movingMonth },
    { label: 'Combined', stats: combinedMonth, highlight: true },
  ]

  const yearCards = [
    { label: 'Junk Removal', stats: junkYear },
    { label: 'Moving', stats: movingYear },
    { label: 'Combined', stats: combinedYear, highlight: true },
  ]

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ color: '#254220', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Statistics</h1>
      <p style={{ fontSize: '13px', color: '#9A8E83', margin: '0 0 24px' }}>
        Revenue totals from quoted orders. Cancelled orders are excluded.
      </p>

      <StatSection title="This Week" subtitle={weekRangeLabel} cards={weekCards} />
      <StatSection title="Last 2 Weeks" subtitle={twoWeekRangeLabel} cards={twoWeekCards} />

      <StatSection
        title="Monthly Breakdown"
        subtitle={monthLabel}
        cards={monthCards}
        headerRight={<MonthFilter value={monthValue} max={maxMonthValue} />}
      />

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1714', margin: 0 }}>Lead Activity</h2>
          <span style={{ fontSize: '12px', color: '#9A8E83' }}>{monthLabel}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 220px) 1fr', gap: '16px' }}>
          <div
            style={{
              background: daysWithoutCompletedIsHigh ? '#FEF2F2' : 'white',
              borderRadius: '14px',
              padding: '20px',
              border: daysWithoutCompletedIsHigh ? '1px solid #FCA5A5' : '1px solid #F5F0EB',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
                color: daysWithoutCompletedIsHigh ? '#B91C1C' : '#9A8E83', marginBottom: '8px',
              }}
            >
              Days Without Completed Leads
            </div>
            <div
              style={{
                fontSize: '28px', fontWeight: 800, lineHeight: 1, marginBottom: '10px',
                color: daysWithoutCompletedIsHigh ? '#B91C1C' : '#1A1714',
              }}
            >
              {daysWithoutCompleted}
            </div>
            <div style={{ fontSize: '12px', color: daysWithoutCompletedIsHigh ? '#B91C1C' : '#9A8E83' }}>
              out of {monthDays.length} day{monthDays.length === 1 ? '' : 's'} so far
              {daysWithoutCompletedIsHigh ? ' - more than 3' : ''}
            </div>
          </div>
          <LeadsChart days={monthDays} counts={dailyCounts} />
        </div>
      </div>

      <StatSection title="Last 12 Months" subtitle={yearRangeLabel} cards={yearCards} />
    </div>
  )
}

function LeadsChart({ days, counts }: { days: Date[]; counts: number[] }) {
  const max = Math.max(1, ...counts)
  const showLabelEvery = Math.max(1, Math.ceil(days.length / 10))

  return (
    <div
      style={{
        background: 'white', borderRadius: '14px', padding: '20px',
        border: '1px solid #F5F0EB', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9A8E83', marginBottom: '14px' }}>
        Leads Received Per Day
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '140px' }}>
        {counts.map((c, i) => (
          <div
            key={i}
            title={`${days[i].toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}: ${c} lead${c === 1 ? '' : 's'}`}
            style={{ flex: 1, display: 'flex', alignItems: 'flex-end', height: '100%', minWidth: 0 }}
          >
            <div
              style={{
                width: '100%',
                height: c > 0 ? `${Math.max(4, (c / max) * 100)}%` : '2px',
                background: c > 0 ? '#254220' : '#E8E0D5',
                borderRadius: '2px 2px 0 0',
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '3px', marginTop: '6px' }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '9px', color: '#9A8E83', minWidth: 0 }}>
            {i % showLabelEvery === 0 ? d.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  )
}

function StatSection({
  title,
  subtitle,
  cards,
  headerRight,
}: {
  title: string
  subtitle: string
  cards: { label: string; stats: PeriodStats; highlight?: boolean }[]
  headerRight?: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1714', margin: 0 }}>{title}</h2>
          <span style={{ fontSize: '12px', color: '#9A8E83' }}>{subtitle}</span>
        </div>
        {headerRight}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {cards.map(card => (
          <div
            key={card.label}
            style={{
              background: card.highlight ? '#254220' : 'white',
              borderRadius: '14px',
              padding: '20px',
              border: card.highlight ? 'none' : '1px solid #F5F0EB',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: card.highlight ? 'rgba(255,255,255,0.6)' : '#9A8E83',
                marginBottom: '8px',
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: card.highlight ? 'white' : '#1A1714',
                marginBottom: '10px',
                lineHeight: 1,
              }}
            >
              {money(card.stats.total)}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: card.highlight ? 'rgba(255,255,255,0.7)' : '#9A8E83',
              }}
            >
              {card.stats.ordersQuoted} quoted &middot; {card.stats.ordersReceived} received
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
