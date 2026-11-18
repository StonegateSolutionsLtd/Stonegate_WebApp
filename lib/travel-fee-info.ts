/** Travel fee settings and result types, safe to use in the browser; the calculation itself is in travel-fee.ts (server only) */

export const TRAVEL_RATE_PER_HOUR = 100
export const DEPOT = {
  label: '11078 Spruce Rd, Surrey, BC V3V 3X6',
  /** [lng, lat] from Mapbox geocoding of the address above */
  coords: [-122.88517, 49.202686] as const,
}
/** When the customer has no start time yet, the move is planned for a 9am start */
export const DEFAULT_START = '09:00'
/** When no hours are estimated yet, the job length used for the return trip */
export const DEFAULT_JOB_HOURS = 5

export interface TravelLeg {
  minutes: number
  km: number
  /** Local departure time used for the traffic prediction, "YYYY-MM-DDThh:mm" */
  departAt: string
}

export interface TravelEstimate {
  out: TravelLeg
  back: TravelLeg
  totalMinutes: number
  fee: number
  rate: number
  /** How each address was understood, so a wrong match is easy to spot */
  pickupMatch: string
  dropoffMatch: string
  startTime: string
  jobHours: number
  computedAt: string
}
