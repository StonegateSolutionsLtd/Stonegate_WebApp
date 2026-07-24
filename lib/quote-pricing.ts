// Shared pricing logic for the "Detailed Quote" calculator — used by the admin
// editor (live preview), the save API route (authoritative total), and the
// print/PDF page (line-item rendering). Keeping one source of truth avoids the
// three surfaces drifting out of sync.

export const KM_RATE = 1.2 // $ per km of driving, charged for one leg
export const FULL_TRUCK_PRICE = 700
export const WEIGHT_RATE_PER_KG = 550 / 1000 // $550 per 1000kg
export const RUSH_JOB_RATE = 0.25
export const STAIRS_FEE_RATE_PER_FLOOR = 0.10 // +10% of the base subtotal per floor with no elevator
export const GST_RATE = 0.05

export const TRUCK_FRACTIONS = [
  { label: '1/8 Truck', fraction: 1 / 8 },
  { label: '1/4 Truck', fraction: 1 / 4 },
  { label: '1/2 Truck', fraction: 1 / 2 },
  { label: '3/4 Truck', fraction: 3 / 4 },
  { label: 'Full Truck', fraction: 1 },
] as const

export type TruckFractionLabel = typeof TRUCK_FRACTIONS[number]['label']

export interface QuoteLineItem {
  label: string
  amount: number
}

export interface DetailedQuoteInputs {
  distanceKm: number
  loadMode: 'fraction' | 'weight'
  loadFractionLabel: TruckFractionLabel | null
  loadWeightKg: number
  toughJobFee: number
  laborWorkers: number
  laborRate: number
  laborHours: number
  stairsFloors: number
  rushJob: boolean
  gst: boolean
}

export const EMPTY_DETAILED_INPUTS: DetailedQuoteInputs = {
  distanceKm: 0,
  loadMode: 'fraction',
  loadFractionLabel: null,
  loadWeightKg: 0,
  toughJobFee: 0,
  laborWorkers: 0,
  laborRate: 0,
  laborHours: 0,
  stairsFloors: 0,
  rushJob: false,
  gst: false,
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

export function truckFractionPrice(label: string | null): number {
  const f = TRUCK_FRACTIONS.find(t => t.label === label)
  return f ? round2(f.fraction * FULL_TRUCK_PRICE) : 0
}

export interface DetailedQuoteResult {
  travelFee: number
  loadFee: number
  toughJobFee: number
  laborFee: number
  subtotal: number
  stairsFee: number
  rushFee: number
  preTax: number
  gstAmount: number
  total: number
  lineItems: QuoteLineItem[]
}

export function calcDetailedQuote(inputs: DetailedQuoteInputs): DetailedQuoteResult {
  const distanceKm = Math.max(0, inputs.distanceKm || 0)
  const loadWeightKg = Math.max(0, inputs.loadWeightKg || 0)
  const toughJobFeeIn = Math.max(0, inputs.toughJobFee || 0)
  const laborWorkers = Math.max(0, inputs.laborWorkers || 0)
  const laborRate = Math.max(0, inputs.laborRate || 0)
  const laborHours = Math.max(0, inputs.laborHours || 0)
  const stairsFloors = Math.max(0, inputs.stairsFloors || 0)

  const travelFee = round2(distanceKm * KM_RATE * 2)
  const loadFee = inputs.loadMode === 'weight'
    ? round2(loadWeightKg * WEIGHT_RATE_PER_KG)
    : truckFractionPrice(inputs.loadFractionLabel)
  const toughJobFee = round2(toughJobFeeIn)
  const laborFee = round2(laborWorkers * laborRate * laborHours)

  const subtotal = round2(travelFee + loadFee + toughJobFee + laborFee)
  const stairsFee = stairsFloors > 0 ? round2(subtotal * STAIRS_FEE_RATE_PER_FLOOR * stairsFloors) : 0
  const rushFee = inputs.rushJob ? round2(subtotal * RUSH_JOB_RATE) : 0
  const preTax = round2(subtotal + stairsFee + rushFee)
  const gstAmount = inputs.gst ? round2(preTax * GST_RATE) : 0
  const total = round2(preTax + gstAmount)

  const lineItems: QuoteLineItem[] = []
  if (travelFee > 0) {
    lineItems.push({ label: `Travel Fee - Gas (${distanceKm} km one-way × 2, $${KM_RATE}/km)`, amount: travelFee })
  }
  if (loadFee > 0) {
    lineItems.push({
      label: inputs.loadMode === 'weight' ? `Load Fee (${loadWeightKg} kg)` : `Load Fee (${inputs.loadFractionLabel})`,
      amount: loadFee,
    })
  }
  if (toughJobFee > 0) lineItems.push({ label: 'Tough Job Fee', amount: toughJobFee })
  if (laborFee > 0) {
    lineItems.push({ label: `Team Labour (${laborWorkers} × $${laborRate}/hr × ${laborHours} hrs)`, amount: laborFee })
  }
  if (stairsFee > 0) {
    lineItems.push({ label: `No-Elevator Fee (${stairsFloors} floor${stairsFloors === 1 ? '' : 's'} × 10%)`, amount: stairsFee })
  }
  if (rushFee > 0) lineItems.push({ label: 'Rush Job Fee (+25%)', amount: rushFee })
  if (gstAmount > 0) lineItems.push({ label: 'GST (5%)', amount: gstAmount })

  return { travelFee, loadFee, toughJobFee, laborFee, subtotal, stairsFee, rushFee, preTax, gstAmount, total, lineItems }
}

export function isValidDetailedQuoteInputs(v: unknown): v is DetailedQuoteInputs {
  if (typeof v !== 'object' || v === null) return false
  const i = v as Record<string, unknown>
  if (typeof i.distanceKm !== 'number' || i.distanceKm < 0) return false
  if (i.loadMode !== 'fraction' && i.loadMode !== 'weight') return false
  if (i.loadMode === 'fraction') {
    if (i.loadFractionLabel !== null && !TRUCK_FRACTIONS.some(t => t.label === i.loadFractionLabel)) return false
  }
  if (typeof i.loadWeightKg !== 'number' || i.loadWeightKg < 0) return false
  if (typeof i.toughJobFee !== 'number' || i.toughJobFee < 0) return false
  if (typeof i.laborWorkers !== 'number' || i.laborWorkers < 0) return false
  if (typeof i.laborRate !== 'number' || i.laborRate < 0) return false
  if (typeof i.laborHours !== 'number' || i.laborHours < 0) return false
  if (typeof i.stairsFloors !== 'number' || i.stairsFloors < 0) return false
  if (typeof i.rushJob !== 'boolean') return false
  if (typeof i.gst !== 'boolean') return false
  return true
}
