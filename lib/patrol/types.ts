export type MunicipalitySlug =
  | 'vancouver'
  | 'burnaby'
  | 'new-westminster'
  | 'coquitlam'

export interface Municipality {
  slug: MunicipalitySlug
  name: string
  /** Accent color used for map fill, badges, and status card border. */
  color: string
}

export type PatrolStatus =
  | 'scheduled'
  | 'filling'
  | 'almost_full'
  | 'full'
  | 'completed'
  | 'cancelled'

/**
 * Mirrors the future API shape. Presentational components only ever see this
 * type (or values derived from it via lib/patrol/selectors.ts) — never raw
 * business logic.
 */
export interface Patrol {
  id: string
  municipality: MunicipalitySlug
  /** ISO date, e.g. "2026-09-24" */
  date: string
  /** 24h "HH:mm" */
  startTime: string
  /** 24h "HH:mm" */
  endTime: string
  maxStops: number
  bookedStops: number
  /** Abstract capacity units (e.g. cubic ft of cargo space). */
  truckCapacity: number
  capacityUsed: number
  status: PatrolStatus
}
