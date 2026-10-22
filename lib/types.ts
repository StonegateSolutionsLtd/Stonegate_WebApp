export type ApartmentSize = 'studio' | '1br' | '2br' | '3br' | '4br+'

export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export interface OrderFormData {
  // Step 1 - Pickup
  pickupAddress: string
  pickupFloor: number
  pickupHasElevator: boolean
  // Step 2 - Dropoff & move details
  dropoffAddress: string
  dropoffFloor: number
  dropoffHasElevator: boolean
  apartmentSize: ApartmentSize | ''
  movingDate: string
  movingTime: string
  // Step 3 - Contact
  customerName: string
  customerEmail: string
  phone: string
  specialNotes: string
  // Admin-entered orders only
  leadSource?: LeadSource | ''
}

export const APARTMENT_SIZE_LABELS: Record<ApartmentSize, string> = {
  studio: 'Studio',
  '1br': '1 Bedroom',
  '2br': '2 Bedrooms',
  '3br': '3 Bedrooms',
  '4br+': '4+ Bedrooms',
}

export const EMPTY_ORDER_FORM: OrderFormData = {
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
