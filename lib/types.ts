export type ApartmentSize = 'studio' | '1br' | '2br' | '3br' | '4br+'

export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export type MoveType = 'house' | 'apartment' | 'commercial' | 'storage' | 'small'

/** When the customer wants to move: today, some day this week, or a picked date */
export type DateFlex = 'today' | 'this_week' | 'date'

export interface OrderFormData {
  // Public estimate form: type, size, date, pickup, drop-off, contact
  moveType?: MoveType | ''
  /** A HOME_SIZES, OFFICE_SIZES or STORAGE_SIZES value, depending on moveType; empty for a small move */
  moveSize?: string
  dateFlex?: DateFlex | ''
  pickupAddress: string
  pickupFloor: number
  pickupHasElevator: boolean
  /** May be just a city or postal code */
  dropoffAddress: string
  dropoffFloor: number
  dropoffHasElevator: boolean
  /** Bedrooms for house and apartment moves; set on every admin-entered order */
  apartmentSize: ApartmentSize | ''
  movingDate: string
  /** Only admin-entered orders have an exact time; estimate requests leave it empty */
  movingTime: string
  customerName: string
  customerEmail: string
  phone: string
  specialNotes: string
  // Admin-entered orders only
  leadSource?: LeadSource | ''
}

export const MOVE_TYPES: { value: MoveType; label: string }[] = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment / Condo' },
  { value: 'commercial', label: 'Commercial / Office' },
  { value: 'storage', label: 'Storage Unit' },
  { value: 'small', label: 'Small Move' },
]

export const HOME_SIZES: { value: ApartmentSize; short: string; label: string }[] = [
  { value: '1br', short: '1', label: '1 Bedroom' },
  { value: '2br', short: '2', label: '2 Bedrooms' },
  { value: '3br', short: '3', label: '3 Bedrooms' },
  { value: '4br+', short: '4+', label: '4+ Bedrooms' },
]

export const OFFICE_SIZES = [
  { value: 'home_office', short: 'H', label: 'Home Office' },
  { value: 'small_office', short: 'S', label: 'Small Office (<1000 sqft)' },
  { value: 'medium_office', short: 'M', label: 'Medium Office (1000-3000 sqft)' },
  { value: 'large_commercial', short: 'L', label: 'Large Commercial' },
]

export const STORAGE_SIZES = [
  { value: '5x5', short: '25', label: '5x5 (Walk-in Closet)' },
  { value: '5x10', short: '50', label: '5x10 (Mid-size Walk-in)' },
  { value: '10x10', short: '100', label: '10x10 (Small Bedroom)' },
  { value: '10x15', short: '150', label: '10x15 (Large Bedroom)' },
  { value: '10x20', short: '200', label: '10x20 (Single Car Garage)' },
  { value: '10x30', short: '300', label: '10x30 (Double Car Garage)' },
]

/** The size choices for a move type; a small move has none */
export function sizesFor(type: MoveType | '' | null | undefined): { value: string; short: string; label: string }[] {
  if (type === 'house' || type === 'apartment') return HOME_SIZES
  if (type === 'commercial') return OFFICE_SIZES
  if (type === 'storage') return STORAGE_SIZES
  return []
}

export function moveTypeLabel(type: string | null | undefined): string {
  return MOVE_TYPES.find(t => t.value === type)?.label ?? 'Move'
}

/** Size as shown to people; falls back to the bedroom size older and admin-entered orders carry */
export function moveSizeLabel(type: string | null | undefined, size: string | null | undefined, apartmentSize?: string | null): string {
  if (type === 'small') return 'Small move'
  const match = sizesFor(type as MoveType)?.find(s => s.value === size)
  if (match) return type === 'storage' ? `${match.label}, ${match.short} sqft` : match.label
  if (apartmentSize) return APARTMENT_SIZE_LABELS[apartmentSize as ApartmentSize] ?? apartmentSize
  return 'Not set'
}

/** "House · 3 Bedrooms", "Storage Unit · 10x10 (Small Bedroom), 100 sqft", "Small Move"; older orders show just the bedrooms */
export function moveSummary(type: string | null | undefined, size: string | null | undefined, apartmentSize?: string | null): string {
  if (type === 'small') return moveTypeLabel(type)
  const sizeLabel = moveSizeLabel(type, size, apartmentSize)
  return type ? `${moveTypeLabel(type)} · ${sizeLabel}` : sizeLabel
}

/** Compact date for admin tables: "Today, 2026-11-02", "Week of 2026-11-02" or "2026-11-02" */
export function moveDateShort(flex: string | null | undefined, date: string | null | undefined): string {
  if (!date) return 'Not set'
  return `${flex === 'today' ? 'Today, ' : flex === 'this_week' ? 'Week of ' : ''}${date}`
}

function longDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

/** "Today (Mon, Nov 2, 2026)", "Any day this week (from ...)", or the date with the arrival time when there is one */
export function moveDateLabel(flex: string | null | undefined, date: string | null | undefined, time?: string | null): string {
  if (!date) return 'Not set'
  if (flex === 'today') return `Today (${longDate(date)})`
  if (flex === 'this_week') return `Any day this week (from ${longDate(date)})`
  if (!time) return longDate(date)
  const t = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${longDate(date)}, ${t}`
}

export const APARTMENT_SIZE_LABELS: Record<ApartmentSize, string> = {
  studio: 'Studio',
  '1br': '1 Bedroom',
  '2br': '2 Bedrooms',
  '3br': '3 Bedrooms',
  '4br+': '4+ Bedrooms',
}

/** sessionStorage key the service pages' booking-start form uses to prefill /order */
export const ORDER_START_KEY = 'orderStart'

export type OrderStart = Partial<Pick<OrderFormData, 'pickupAddress' | 'dropoffAddress' | 'apartmentSize'>>

export const EMPTY_ORDER_FORM: OrderFormData = {
  moveType: '',
  moveSize: '',
  dateFlex: '',
  pickupAddress: '',
  pickupFloor: 1,
  pickupHasElevator: false,
  dropoffAddress: '',
  dropoffFloor: 1,
  dropoffHasElevator: false,
  apartmentSize: '',
  movingDate: '',
  movingTime: '',
  customerName: '',
  customerEmail: '',
  phone: '',
  specialNotes: '',
}

export type CalendarJobType = 'moving' | 'junk_removal'

export type LeadSource = 'google_ads' | 'facebook_ads' | 'word_of_mouth' | 'organic_seo'

export const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'facebook_ads', label: 'Facebook Ads' },
  { value: 'word_of_mouth', label: 'Word of Mouth' },
  { value: 'organic_seo', label: 'Natural SEO' },
]

/** Parses a dollar amount from a form value; blank or invalid → null (not recorded). */
export function parseAmount(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null
  const n = Number(String(value).replace(/[$,\s]/g, ''))
  if (!Number.isFinite(n) || n < 0 || n > 99_999_999) return null
  return Math.round(n * 100) / 100
}

/** Returns the value if it's a known lead source, otherwise null (unset / invalid). */
export function parseLeadSource(value: unknown): LeadSource | null {
  return LEAD_SOURCES.some(s => s.value === value) ? (value as LeadSource) : null
}

export interface CalendarJob {
  id: string
  job_type: CalendarJobType
  event_date: string
  event_time: string | null
  duration_minutes: number | null
  is_subcontract: boolean
  company_name: string | null
  pickup_address: string | null
  size: ApartmentSize | null
  customer_name: string | null
  notes: string | null
  lead_source: LeadSource | null
  amount_paid: number | null
  order_id: string | null
  service_order_id: string | null
  created_at: string
  updated_at: string
}

export interface Mover {
  id: string
  name: string
  phone: string | null
  hourly_rate: number
  active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface MoverAssignment {
  id: string
  mover_id: string
  calendar_job_id: string | null
  hours: number | null
  work_date: string | null
  label: string | null
  amount_override: number | null
  created_at: string
  updated_at: string
}

export interface MoverAssignmentWithJob extends MoverAssignment {
  calendar_jobs: CalendarJob | null
}

export interface MoverPayment {
  id: string
  mover_id: string
  period_start: string
  period_end: string
  amount: number
  paid_date: string
  notes: string | null
  created_at: string
}
