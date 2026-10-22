import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { LEAD_SOURCES, type LeadSource } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface QuoteRecord {
  estimated_price: number | null
  created_at: string
  status: string
  lead_source: LeadSource | null
}

interface CalendarJobRecord {
  event_date: string
  job_type: 'moving' | 'junk_removal'
  is_subcontract: boolean
  lead_source: LeadSource | null
  // NUMERIC - PostgREST may return it as a string
  amount_paid: number | string | null
}

const sumPaid = (jobs: CalendarJobRecord[]) => round2(jobs.reduce((n, j) => n + (j.amount_paid != null ? Number(j.amount_paid) : 0), 0))

// One mover_assignments row, priced the same way as the Movers tab: a flat
// amount_override wins, otherwise hours * the mover's hourly rate.
interface PayrollEntry {
  moverId: string
  date: string
  // null = manual entry not tied to a calendar job (warehouse work, bonus, advance...)
  jobType: CalendarJobRecord['job_type'] | null
  hours: number
  cost: number
}

const sumPayroll = (entries: PayrollEntry[]) => round2(entries.reduce((n, e) => n + e.cost, 0))

interface PeriodStats {
  total: number
  ordersReceived: number
  ordersQuoted: number
  // From calendar jobs (by job date)
  paid: number
  jobsPaid: number
  // Mover pay earned in the period (by job / work date)
  payroll: number
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

// Everything passed in is already limited to the selected period.
function aggregate(records: QuoteRecord[]): PeriodStats {
  let total = 0
  let ordersReceived = 0
  let ordersQuoted = 0

  for (const r of records) {
    if (r.status === 'cancelled') continue
    ordersReceived++
    if (r.estimated_price != null) {
      total += Number(r.estimated_price)
      ordersQuoted++
    }
  }

  return { total: round2(total), ordersReceived, ordersQuoted, paid: 0, jobsPaid: 0, payroll: 0 }
}

function withPaid(stats: PeriodStats, jobs: CalendarJobRecord[], payroll: PayrollEntry[], jobType: CalendarJobRecord['job_type']): PeriodStats {
  const paidJobs = jobs.filter(j => j.job_type === jobType && j.amount_paid != null)
  const cost = sumPayroll(payroll.filter(e => e.jobType === jobType))
  return { ...stats, paid: sumPaid(paidJobs), jobsPaid: paidJobs.length, payroll: cost }
}

function combine(a: PeriodStats, b: PeriodStats): PeriodStats {
  return {
    total: round2(a.total + b.total),
    ordersReceived: a.ordersReceived + b.ordersReceived,
    ordersQuoted: a.ordersQuoted + b.ordersQuoted,
    paid: round2(a.paid + b.paid),
    jobsPaid: a.jobsPaid + b.jobsPaid,
    payroll: round2(a.payroll + b.payroll),
  }
}

const money = (n: number) => `$${n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

function parseDateLocal(s: string | undefined): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
  const [y, m, d] = s.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

const shortDate = (d: Date) => d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })

// ---- Period selection ----------------------------------------------------------

const PERIODS = [
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'week', label: 'Last Week' },
  { value: 'month', label: 'Last Month' },
  { value: 'quarter', label: 'Last Quarter' },
  { value: 'all', label: 'All Time' },
  { value: 'custom', label: 'Custom' },
] as const
type Period = typeof PERIODS[number]['value']

interface Range {
  period: Period
  start: Date | null       // null = all time (no lower bound)
  endExclusive: Date
}

// Calendar periods: "This ..." runs to today (inclusive), "Last ..." is the previous full
// week / month / quarter. Custom is from/to inclusive.
function resolveRange(params: { period?: string; from?: string; to?: string }, today: Date): Range {
  const tomorrow = addDays(today, 1)
  const period = (PERIODS.some(p => p.value === params.period) ? params.period : 'this_month') as Period

  if (period === 'all') return { period, start: null, endExclusive: tomorrow }

  // Monday-start weeks, same as the Movers tab's payroll weeks
  const thisMonday = addDays(today, -((today.getDay() + 6) % 7))
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)

  switch (period) {
    case 'this_week': return { period, start: thisMonday, endExclusive: tomorrow }
    case 'this_month': return { period, start: monthStart, endExclusive: tomorrow }
    // Previous full calendar week / month / quarter
    case 'week': return { period, start: addDays(thisMonday, -7), endExclusive: thisMonday }
    case 'month': return { period, start: new Date(today.getFullYear(), today.getMonth() - 1, 1), endExclusive: monthStart }
    case 'quarter': return { period, start: new Date(quarterStart.getFullYear(), quarterStart.getMonth() - 3, 1), endExclusive: quarterStart }
  }

  // Custom: from/to inclusive, defaulting to the last 30 days
  let from = parseDateLocal(params.from) ?? addDays(today, -29)
  let to = parseDateLocal(params.to) ?? today
  if (from > to) [from, to] = [to, from]
  return { period, start: from, endExclusive: addDays(to, 1) }
}

// ---- Chart bucketing -----------------------------------------------------------

interface Bucket {
  start: string       // YYYY-MM-DD inclusive
  end: string         // YYYY-MM-DD exclusive
  label: string       // axis label
  title: string       // hover text
}

// Daily bars up to ~2 months, weekly up to a year, monthly beyond that.
function buildBuckets(start: Date, endExclusive: Date): { buckets: Bucket[]; unit: 'day' | 'week' | 'month' } {
  const days = Math.round((endExclusive.getTime() - start.getTime()) / 86_400_000)
  const buckets: Bucket[] = []

  if (days <= 62) {
    for (let d = start; d < endExclusive; d = addDays(d, 1)) {
      buckets.push({ start: fmt(d), end: fmt(addDays(d, 1)), label: String(d.getDate()), title: d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) })
    }
    return { buckets, unit: 'day' }
  }

  if (days <= 366) {
    for (let d = start; d < endExclusive; d = addDays(d, 7)) {
      const next = addDays(d, 7) < endExclusive ? addDays(d, 7) : endExclusive
      buckets.push({ start: fmt(d), end: fmt(next), label: d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }), title: `Week of ${d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}` })
    }
    return { buckets, unit: 'week' }
  }

  for (let d = new Date(start.getFullYear(), start.getMonth(), 1); d < endExclusive; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    buckets.push({
      start: fmt(d < start ? start : d),
      end: fmt(next < endExclusive ? next : endExclusive),
      label: d.toLocaleDateString('en-CA', { month: 'short', year: '2-digit' }),
      title: d.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' }),
    })
  }
  return { buckets, unit: 'month' }
}

const countIn = (dates: string[], b: Bucket) => dates.filter(d => d >= b.start && d < b.end).length

export default async function StatisticsPage({ searchParams }: { searchParams: Promise<{ period?: string; from?: string; to?: string }> }) {
  const params = await searchParams
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const range = resolveRange(params, today)
  const startStr = range.start ? fmt(range.start) : null
  const endStr = fmt(range.endExclusive)

  const supabase = createServiceClient()

  let ordersQ = supabase.from('orders').select('estimated_price, created_at, status, lead_source').lt('created_at', range.endExclusive.toISOString())
  let serviceQ = supabase.from('service_orders').select('estimated_price, created_at, status, lead_source').eq('order_type', 'junk_removal').lt('created_at', range.endExclusive.toISOString())
  let jobsQ = supabase.from('calendar_jobs').select('event_date, job_type, is_subcontract, lead_source, amount_paid').lt('event_date', endStr)
  if (range.start && startStr) {
    ordersQ = ordersQ.gte('created_at', range.start.toISOString())
    serviceQ = serviceQ.gte('created_at', range.start.toISOString())
    jobsQ = jobsQ.gte('event_date', startStr)
  }

  const [movingRes, junkRes, calendarJobsRes, moversRes, jobAssignmentsRes, manualAssignmentsRes, moverPaymentsRes] = await Promise.all([
    ordersQ, serviceQ, jobsQ,
    supabase.from('movers').select('id, name, hourly_rate'),
    // Payroll is fetched unfiltered: a payment covers a pay week, and crediting it to the
    // right work days needs every entry in that week, even ones outside the period.
    supabase.from('mover_assignments').select('mover_id, hours, amount_override, calendar_jobs!inner(event_date, job_type)'),
    supabase.from('mover_assignments').select('mover_id, hours, amount_override, work_date').is('calendar_job_id', null),
    supabase.from('mover_payments').select('mover_id, amount'),
  ])

  const movingRecords = (movingRes.data ?? []) as QuoteRecord[]
  const junkRecords = (junkRes.data ?? []) as QuoteRecord[]
  const allRecords = [...movingRecords, ...junkRecords]
  const calendarJobs = (calendarJobsRes.data ?? []) as CalendarJobRecord[]

  const movers = (moversRes.data ?? []) as { id: string; name: string; hourly_rate: number | string }[]
  const moverRates: Record<string, number> = Object.fromEntries(movers.map(m => [m.id, Number(m.hourly_rate)]))
  const moverNames: Record<string, string> = Object.fromEntries(movers.map(m => [m.id, m.name]))
  type AssignmentRow = { mover_id: string; hours: number | string | null; amount_override: number | string | null }
  const toEntry = (a: AssignmentRow, date: string, jobType: PayrollEntry['jobType']): PayrollEntry => {
    const hours = a.hours != null ? Number(a.hours) : 0
    const cost = a.amount_override != null ? Number(a.amount_override) : hours * (moverRates[a.mover_id] ?? 0)
    return { moverId: a.mover_id, date, jobType, hours, cost }
  }
  const allPayrollEntries: PayrollEntry[] = [
    ...((jobAssignmentsRes.data ?? []) as unknown as (AssignmentRow & { calendar_jobs: { event_date: string; job_type: CalendarJobRecord['job_type'] } })[])
      .map(a => toEntry(a, a.calendar_jobs.event_date, a.calendar_jobs.job_type)),
    ...((manualAssignmentsRes.data ?? []) as (AssignmentRow & { work_date: string })[])
      .map(a => toEntry(a, a.work_date, null)),
  ]
  const inRange = (date: string) => (!startStr || date >= startStr) && date < endStr
  const payrollEntries = allPayrollEntries.filter(e => inRange(e.date))

  // Credit payments to the work they paid for, by work date. The Movers tab carries any
  // unpaid balance forward, so a payment settles the oldest unpaid work first - which
  // means each mover's total paid fills his entries oldest-first. Anything paid beyond
  // all logged work is an advance and isn't credited to any day.
  const totalPaidByMover: Record<string, number> = {}
  for (const p of (moverPaymentsRes.data ?? []) as { mover_id: string; amount: number | string }[]) {
    totalPaidByMover[p.mover_id] = (totalPaidByMover[p.mover_id] ?? 0) + Number(p.amount)
  }
  const paymentCredits: { moverId: string; date: string; amount: number }[] = []
  const remaining = { ...totalPaidByMover }
  for (const e of [...allPayrollEntries].sort((a, b) => a.date.localeCompare(b.date))) {
    const pool = remaining[e.moverId] ?? 0
    if (pool <= 0 || e.cost <= 0) continue
    const credit = Math.min(pool, e.cost)
    remaining[e.moverId] = pool - credit
    paymentCredits.push({ moverId: e.moverId, date: e.date, amount: credit })
  }

  // Orders by created date + amount paid / payroll by job date, per job type.
  // Manual payroll entries (no job) only count toward Combined.
  const moving = withPaid(aggregate(movingRecords), calendarJobs, payrollEntries, 'moving')
  const junk = withPaid(aggregate(junkRecords), calendarJobs, payrollEntries, 'junk_removal')
  const combinedBase = combine(moving, junk)
  const otherPayroll = sumPayroll(payrollEntries.filter(e => e.jobType === null))
  const combined = { ...combinedBase, payroll: round2(combinedBase.payroll + otherPayroll) }
  const cards = [
    { label: 'Junk Removal', stats: junk },
    { label: 'Moving', stats: moving },
    { label: 'Combined', stats: combined, highlight: true },
  ]

  // Payroll per mover: earned vs. paid for that work, both by work date
  const payrollByMover = new Map<string, PayrollMoverRow>()
  const moverRow = (id: string) => {
    if (!payrollByMover.has(id)) payrollByMover.set(id, { id, name: moverNames[id] ?? 'Unknown mover', hours: 0, earned: 0, paidOut: 0 })
    return payrollByMover.get(id)!
  }
  for (const e of payrollEntries) {
    const row = moverRow(e.moverId)
    row.hours += e.hours
    row.earned += e.cost
  }
  for (const c of paymentCredits) if (inRange(c.date)) moverRow(c.moverId).paidOut += c.amount
  const payrollRows = [...payrollByMover.values()]
    .map(r => ({ ...r, hours: round2(r.hours), earned: round2(r.earned), paidOut: round2(r.paidOut) }))
    .filter(r => r.hours > 0 || r.earned > 0 || r.paidOut > 0)
    .sort((a, b) => b.earned - a.earned)

  // For "All Time", the chart starts at the earliest record we have
  const orderDates = allRecords.filter(r => r.status !== 'cancelled').map(r => fmt(new Date(r.created_at)))
  const jobDates = calendarJobs.map(j => j.event_date)
  let chartStart = range.start
  if (!chartStart) {
    const earliest = [...orderDates, ...jobDates, ...payrollEntries.map(e => e.date)].sort()[0]
    chartStart = parseDateLocal(earliest) ?? addDays(today, -29)
  }
  const { buckets, unit } = buildBuckets(chartStart, range.endExclusive)
  const leadCounts = buckets.map(b => countIn(orderDates, b))
  const jobCounts = buckets.map(b => countIn(jobDates, b))
  const totalDays = Math.round((range.endExclusive.getTime() - chartStart.getTime()) / 86_400_000)
  const jobDateSet = new Set(jobDates)
  let daysWithoutJob = 0
  for (let d = chartStart; d < range.endExclusive; d = addDays(d, 1)) if (!jobDateSet.has(fmt(d))) daysWithoutJob++

  const jobsScheduled = calendarJobs.length
  const movingJobsCount = calendarJobs.filter(j => j.job_type === 'moving').length
  const junkJobsCount = calendarJobs.filter(j => j.job_type === 'junk_removal').length
  const subcontractJobsCount = calendarJobs.filter(j => j.is_subcontract).length
  const paidJobsCount = calendarJobs.filter(j => j.amount_paid != null).length

  const sourceRows = sourceBreakdown(allRecords, calendarJobs)
  const rangeLabel = `${shortDate(chartStart)} – ${shortDate(addDays(range.endExclusive, -1))}`

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ color: '#254220', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Statistics</h1>
      <p style={{ fontSize: '13px', color: '#9A8E83', margin: '0 0 18px' }}>
        Paid = what clients paid on calendar jobs (by job date). Payroll = mover pay from the Movers tab. Quoted = quotes on orders received in the period. Cancelled orders are excluded.
      </p>

      <PeriodPicker range={range} today={today} rangeLabel={rangeLabel} />

      <StatSection title="Revenue" subtitle={rangeLabel} cards={cards} />

      <PayrollSection rangeLabel={rangeLabel} rows={payrollRows} revenue={combined.paid} />

      <ClientSources rangeLabel={rangeLabel} rows={sourceRows} />

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1714', margin: 0 }}>Jobs &amp; Leads</h2>
          <span style={{ fontSize: '12px', color: '#9A8E83' }}>{rangeLabel} · jobs from the Calendar tab</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <SmallCard label="Jobs Scheduled" value={String(jobsScheduled)}>
            {movingJobsCount} moving · {junkJobsCount} junk removal
            {subcontractJobsCount > 0 ? ` · ${subcontractJobsCount} subcontract` : ''}
          </SmallCard>
          <SmallCard label="Jobs With Payment Recorded" value={`${paidJobsCount} / ${jobsScheduled}`}>
            {jobsScheduled - paidJobsCount > 0 ? `${jobsScheduled - paidJobsCount} still missing an amount` : 'all recorded'}
          </SmallCard>
          <SmallCard label="Days Without a Job" value={String(daysWithoutJob)}>
            out of {totalDays} day{totalDays === 1 ? '' : 's'}
          </SmallCard>
          <SmallCard label="Orders Received" value={String(orderDates.length)}>
            moving + junk removal, website and manual
          </SmallCard>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          <BarChart title={`Jobs Scheduled Per ${capitalize(unit)}`} unit="job" buckets={buckets} counts={jobCounts} />
          <BarChart title={`Orders Received Per ${capitalize(unit)}`} unit="order" buckets={buckets} counts={leadCounts} />
        </div>
      </div>
    </div>
  )
}

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

function PeriodPicker({ range, today, rangeLabel }: { range: Range; today: Date; rangeLabel: string }) {
  const customFrom = range.period === 'custom' && range.start ? fmt(range.start) : fmt(addDays(today, -29))
  const customTo = range.period === 'custom' ? fmt(addDays(range.endExclusive, -1)) : fmt(today)

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px', background: 'white', border: '1px solid #E8E0D5', borderRadius: '12px', padding: '4px' }}>
        {PERIODS.map(p => {
          const on = range.period === p.value
          return (
            <Link
              key={p.value}
              href={`/admin/statistics?period=${p.value}`}
              style={{
                padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
                background: on ? '#254220' : 'transparent', color: on ? 'white' : '#6B5E54',
              }}
            >
              {p.label}
            </Link>
          )
        })}
      </div>

      {range.period === 'custom' ? (
        <form method="get" action="/admin/statistics" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '10px', marginTop: '12px' }}>
          <input type="hidden" name="period" value="custom" />
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B5E54' }}>
            From
            <input type="date" name="from" defaultValue={customFrom} max={fmt(today)} style={dateInput} />
          </label>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B5E54' }}>
            To
            <input type="date" name="to" defaultValue={customTo} style={dateInput} />
          </label>
          <button type="submit" style={{ padding: '8px 18px', background: '#254220', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            Apply
          </button>
        </form>
      ) : (
        <div style={{ fontSize: '12px', color: '#9A8E83', marginTop: '8px' }}>{rangeLabel}</div>
      )}
    </div>
  )
}

const dateInput: React.CSSProperties = {
  display: 'block', marginTop: '4px', padding: '7px 10px', border: '1.5px solid #E8E0D5', borderRadius: '8px',
  fontSize: '13px', color: '#1A1714', background: 'white',
}

function SmallCard({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #F5F0EB', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9A8E83', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1, marginBottom: '10px', color: '#1A1714' }}>{value}</div>
      <div style={{ fontSize: '12px', color: '#9A8E83' }}>{children}</div>
    </div>
  )
}

interface SourceRow {
  label: string
  orders: number
  quoted: number
  jobs: number
  paid: number
}

// Orders (moving + junk) and calendar jobs grouped by where the client came from.
// Orders and jobs are counted separately: a calendar job added from an order copies the
// order's source, so summing them would count that client twice.
function sourceBreakdown(records: QuoteRecord[], jobs: CalendarJobRecord[]): SourceRow[] {
  const keys: (LeadSource | null)[] = [...LEAD_SOURCES.map(s => s.value), null]
  return keys.map(key => {
    const stats = aggregate(records.filter(r => (r.lead_source ?? null) === key))
    const mine = jobs.filter(j => (j.lead_source ?? null) === key)
    return {
      label: key ? LEAD_SOURCES.find(s => s.value === key)!.label : 'Not set / website',
      orders: stats.ordersReceived,
      quoted: stats.total,
      jobs: mine.length,
      paid: sumPaid(mine),
    }
  })
}

interface PayrollMoverRow {
  id: string
  name: string
  hours: number
  earned: number
  paidOut: number
}

function PayrollSection({ rangeLabel, rows, revenue }: { rangeLabel: string; rows: PayrollMoverRow[]; revenue: number }) {
  const earned = round2(rows.reduce((n, r) => n + r.earned, 0))
  const paidOut = round2(rows.reduce((n, r) => n + r.paidOut, 0))
  const hours = round2(rows.reduce((n, r) => n + r.hours, 0))
  const net = round2(revenue - earned)
  const card: React.CSSProperties = { background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #F5F0EB', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }
  const cardLabel: React.CSSProperties = { fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9A8E83', marginBottom: '8px' }
  const big: React.CSSProperties = { fontSize: '28px', fontWeight: 800, lineHeight: 1, marginBottom: '10px', color: '#1A1714' }
  const small: React.CSSProperties = { fontSize: '12px', color: '#9A8E83' }
  const th: React.CSSProperties = { fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9A8E83', textAlign: 'right', padding: '0 0 10px 12px', whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { fontSize: '14px', color: '#1A1714', textAlign: 'right', padding: '10px 0 10px 12px', borderTop: '1px solid #F5F0EB', whiteSpace: 'nowrap' }

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1714', margin: 0 }}>Payroll Expenses</h2>
        <span style={{ fontSize: '12px', color: '#9A8E83' }}>{rangeLabel} · from the Movers tab</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <div style={card}>
          <div style={cardLabel}>Payroll Expense</div>
          <div style={big}>{money(earned)}</div>
          <div style={small}>{hours.toLocaleString('en-CA')} hours logged</div>
        </div>
        <div style={card}>
          <div style={cardLabel}>Paid to Movers</div>
          <div style={big}>{money(paidOut)}</div>
          <div style={small}>
            for work done in this period ·{' '}
            {earned - paidOut >= 0.01 ? `${money(round2(earned - paidOut))} still owed`
              : paidOut - earned >= 0.01 ? `${money(round2(paidOut - earned))} overpaid`
              : 'all paid'}
          </div>
        </div>
        <div style={{ ...card, background: '#254220', border: 'none' }}>
          <div style={{ ...cardLabel, color: 'rgba(255,255,255,0.6)' }}>Paid − Payroll</div>
          <div style={{ ...big, color: net < 0 ? '#FCA5A5' : 'white' }}>{net < 0 ? '−' : ''}{money(Math.abs(net))}</div>
          <div style={{ ...small, color: 'rgba(255,255,255,0.7)' }}>
            {money(revenue)} paid by clients{revenue > 0 ? ` · payroll ${Math.round((earned / revenue) * 100)}%` : ''}
          </div>
        </div>
      </div>
      {rows.length > 0 && (
        <div style={{ ...card, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: 'left', paddingLeft: 0 }}>Mover</th>
                <th style={th}>Hours</th>
                <th style={th}>Payroll</th>
                <th style={th}>Paid For This Work</th>
                <th style={th}>Still Owed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ ...td, textAlign: 'left', paddingLeft: 0, fontWeight: 600 }}>{r.name}</td>
                  <td style={td}>{r.hours.toLocaleString('en-CA')}</td>
                  <td style={td}>{money(r.earned)}</td>
                  <td style={td}>{money(r.paidOut)}</td>
                  <td style={{ ...td, color: r.earned - r.paidOut >= 0.01 ? '#B91C1C' : r.paidOut - r.earned >= 0.01 ? '#9A4B12' : '#9A8E83' }}>
                    {r.paidOut - r.earned >= 0.01 ? `${money(round2(r.paidOut - r.earned))} over` : money(Math.max(0, round2(r.earned - r.paidOut)))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ClientSources({ rangeLabel, rows }: { rangeLabel: string; rows: SourceRow[] }) {
  const totalPaid = rows.reduce((n, r) => n + r.paid, 0)
  const th: React.CSSProperties = { fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9A8E83', textAlign: 'right', padding: '0 0 10px 12px', whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { fontSize: '14px', color: '#1A1714', textAlign: 'right', padding: '10px 0 10px 12px', borderTop: '1px solid #F5F0EB', whiteSpace: 'nowrap' }

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1714', margin: 0 }}>Where Clients Came From</h2>
        <span style={{ fontSize: '12px', color: '#9A8E83' }}>{rangeLabel}</span>
      </div>
      <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #F5F0EB', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: 'left', paddingLeft: 0 }}>Source</th>
              <th style={th}>Paid</th>
              <th style={th}>Calendar Jobs</th>
              <th style={th}>Orders</th>
              <th style={th}>Quoted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const share = totalPaid > 0 ? r.paid / totalPaid : 0
              return (
                <tr key={r.label}>
                  <td style={{ ...td, textAlign: 'left', paddingLeft: 0, width: '40%' }}>
                    <div style={{ fontWeight: 600, marginBottom: '6px' }}>{r.label}</div>
                    <div style={{ height: '6px', background: '#F5F0EB', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${share * 100}%`, height: '100%', background: '#254220' }} />
                    </div>
                  </td>
                  <td style={td}>
                    {money(r.paid)}
                    {totalPaid > 0 && <span style={{ color: '#9A8E83', fontSize: '12px' }}> · {Math.round(share * 100)}%</span>}
                  </td>
                  <td style={td}>{r.jobs}</td>
                  <td style={td}>{r.orders}</td>
                  <td style={td}>{money(r.quoted)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BarChart({ title, unit, buckets, counts }: { title: string; unit: string; buckets: Bucket[]; counts: number[] }) {
  const max = Math.max(1, ...counts)
  const showLabelEvery = Math.max(1, Math.ceil(buckets.length / 10))

  return (
    <div
      style={{
        background: 'white', borderRadius: '14px', padding: '20px',
        border: '1px solid #F5F0EB', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9A8E83', marginBottom: '14px' }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '140px' }}>
        {counts.map((c, i) => (
          <div
            key={i}
            title={`${buckets[i].title}: ${c} ${unit}${c === 1 ? '' : 's'}`}
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
        {buckets.map((b, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '9px', color: '#9A8E83', minWidth: 0, whiteSpace: 'nowrap', overflow: 'visible' }}>
            {i % showLabelEvery === 0 ? b.label : ''}
          </div>
        ))}
      </div>
    </div>
  )
}

function CardRow({ label, highlight, children }: { label: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: highlight ? 'rgba(255,255,255,0.6)' : '#9A8E83' }}>
        {label}
      </span>
      {children}
    </div>
  )
}

function StatSection({
  title,
  subtitle,
  cards,
}: {
  title: string
  subtitle: string
  cards: { label: string; stats: PeriodStats; highlight?: boolean }[]
}) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1714', margin: 0 }}>{title}</h2>
        <span style={{ fontSize: '12px', color: '#9A8E83' }}>{subtitle}</span>
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
              {money(card.stats.paid)}
            </div>
            <div style={{ fontSize: '12px', color: card.highlight ? 'rgba(255,255,255,0.7)' : '#9A8E83' }}>
              paid by clients &middot; {card.stats.jobsPaid} job{card.stats.jobsPaid === 1 ? '' : 's'}
            </div>
            <div
              style={{
                display: 'flex', flexDirection: 'column', gap: '8px',
                marginTop: '14px', paddingTop: '12px',
                borderTop: card.highlight ? '1px solid rgba(255,255,255,0.15)' : '1px solid #F5F0EB',
              }}
            >
              <CardRow label="Payroll" highlight={card.highlight}>
                <strong style={{ fontSize: '15px', fontWeight: 800, color: card.highlight ? '#FCA5A5' : '#B91C1C' }}>
                  {card.stats.payroll > 0 ? '−' : ''}{money(card.stats.payroll)}
                </strong>
              </CardRow>
              <CardRow label="After payroll" highlight={card.highlight}>
                <strong style={{ fontSize: '15px', fontWeight: 800, color: card.highlight ? 'white' : '#1A1714' }}>
                  {card.stats.paid - card.stats.payroll < 0 ? '−' : ''}{money(Math.abs(round2(card.stats.paid - card.stats.payroll)))}
                </strong>
              </CardRow>
              <CardRow label="Quoted" highlight={card.highlight}>
                <span style={{ fontSize: '12px', color: card.highlight ? 'rgba(255,255,255,0.7)' : '#9A8E83' }}>
                  {money(card.stats.total)} &middot; {card.stats.ordersQuoted} of {card.stats.ordersReceived} orders
                </span>
              </CardRow>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
