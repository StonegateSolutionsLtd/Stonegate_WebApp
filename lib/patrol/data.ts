import type { MunicipalitySlug, Patrol } from './types'
import { MUNICIPALITY_ORDER } from './municipalities'

/**
 * Mock patrol data standing in for a future `GET /api/patrols` endpoint.
 * Every consumer in this app reads patrols through the functions below
 * (never this array directly), so swapping this file for a real fetch is
 * the only change needed once the backend exists.
 */
const MOCK_PATROLS: Patrol[] = [
  {
    id: 'van-2026-09-24',
    municipality: 'vancouver',
    date: '2026-09-24',
    startTime: '13:00',
    endTime: '17:00',
    maxStops: 8,
    bookedStops: 5,
    truckCapacity: 100,
    capacityUsed: 48,
    status: 'filling',
  },
  {
    id: 'van-2026-10-01',
    municipality: 'vancouver',
    date: '2026-10-01',
    startTime: '13:00',
    endTime: '17:00',
    maxStops: 8,
    bookedStops: 1,
    truckCapacity: 100,
    capacityUsed: 9,
    status: 'scheduled',
  },
  {
    id: 'bur-2026-09-23',
    municipality: 'burnaby',
    date: '2026-09-23',
    startTime: '12:00',
    endTime: '16:00',
    maxStops: 8,
    bookedStops: 6,
    truckCapacity: 100,
    capacityUsed: 37,
    status: 'almost_full',
  },
  {
    id: 'bur-2026-09-30',
    municipality: 'burnaby',
    date: '2026-09-30',
    startTime: '12:00',
    endTime: '16:00',
    maxStops: 8,
    bookedStops: 0,
    truckCapacity: 100,
    capacityUsed: 0,
    status: 'scheduled',
  },
  {
    id: 'nwe-2026-09-25',
    municipality: 'new-westminster',
    date: '2026-09-25',
    startTime: '09:00',
    endTime: '13:00',
    maxStops: 6,
    bookedStops: 2,
    truckCapacity: 100,
    capacityUsed: 20,
    status: 'scheduled',
  },
  {
    id: 'nwe-2026-10-02',
    municipality: 'new-westminster',
    date: '2026-10-02',
    startTime: '09:00',
    endTime: '13:00',
    maxStops: 6,
    bookedStops: 0,
    truckCapacity: 100,
    capacityUsed: 0,
    status: 'scheduled',
  },
  {
    id: 'coq-2026-09-22',
    municipality: 'coquitlam',
    date: '2026-09-22',
    startTime: '10:00',
    endTime: '14:00',
    maxStops: 7,
    bookedStops: 7,
    truckCapacity: 100,
    capacityUsed: 96,
    status: 'full',
  },
  {
    id: 'coq-2026-09-29',
    municipality: 'coquitlam',
    date: '2026-09-29',
    startTime: '10:00',
    endTime: '14:00',
    maxStops: 7,
    bookedStops: 1,
    truckCapacity: 100,
    capacityUsed: 12,
    status: 'scheduled',
  },
]

function sortByDate(patrols: Patrol[]): Patrol[] {
  return [...patrols].sort((a, b) => a.date.localeCompare(b.date))
}

export async function getPatrolsByMunicipality(municipality: MunicipalitySlug): Promise<Patrol[]> {
  return sortByDate(MOCK_PATROLS.filter(p => p.municipality === municipality && p.status !== 'cancelled'))
}

export interface MunicipalityPatrolSummary {
  municipality: MunicipalitySlug
  next: Patrol | undefined
  following: Patrol | undefined
}

export async function getPatrolSummary(municipality: MunicipalitySlug): Promise<MunicipalityPatrolSummary> {
  const [next, following] = await getPatrolsByMunicipality(municipality)
  return { municipality, next, following }
}

export async function getAllPatrolSummaries(): Promise<MunicipalityPatrolSummary[]> {
  return Promise.all(MUNICIPALITY_ORDER.map(getPatrolSummary))
}
