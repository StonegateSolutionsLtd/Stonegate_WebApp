/**
 * Mover pay rates over time. A rate change applies from a Monday onwards; hours are paid at the rate
 * in effect on the day they were worked, so raising a rate never changes weeks that are already done.
 */

export interface MoverRate {
  id: string
  mover_id: string
  hourly_rate: number
  /** Monday the rate starts on, YYYY-MM-DD */
  effective_from: string
}

/** Rates grouped by mover, oldest first */
export function groupRates(rates: MoverRate[]): Record<string, MoverRate[]> {
  const byMover: Record<string, MoverRate[]> = {}
  for (const r of rates) (byMover[r.mover_id] ??= []).push({ ...r, hourly_rate: Number(r.hourly_rate) })
  for (const list of Object.values(byMover)) list.sort((a, b) => a.effective_from.localeCompare(b.effective_from))
  return byMover
}

/** The rate in effect on a date; before the first change, the earliest rate; with no history, the fallback */
export function rateOn(history: MoverRate[] | undefined, date: string | null | undefined, fallback: number): number {
  if (!history?.length) return fallback
  if (!date) return history[history.length - 1].hourly_rate
  let rate = history[0].hourly_rate
  for (const r of history) {
    if (r.effective_from <= date) rate = r.hourly_rate
    else break
  }
  return rate
}

/** What an entry earns: a flat amount, or its hours at the rate on the day it was worked */
export function entryPay(
  entry: { hours: number | string | null; amount_override: number | string | null },
  date: string | null | undefined,
  history: MoverRate[] | undefined,
  fallback: number,
): number {
  if (entry.amount_override != null) return Number(entry.amount_override)
  return (entry.hours != null ? Number(entry.hours) : 0) * rateOn(history, date, fallback)
}

/** The Monday of the week a date falls in (payroll weeks run Monday to Sunday) */
export function mondayOf(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const day = new Date(Date.UTC(y, m - 1, d))
  day.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 6) % 7))
  return day.toISOString().slice(0, 10)
}
