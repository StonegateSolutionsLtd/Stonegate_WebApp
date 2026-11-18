import type { createServiceClient } from '@/lib/supabase/server'
import { nowInBusinessZone } from '@/lib/scheduling'
import { groupRates, rateOn, type MoverRate } from '@/lib/mover-rates'

type Supabase = ReturnType<typeof createServiceClient>

/** The first Monday covered by a mover's starting rate, so every week they ever worked has a rate */
export const FIRST_RATE_DATE = '2000-01-03'

/** Keeps movers.hourly_rate equal to the rate in effect today */
export async function syncCurrentRate(supabase: Supabase, moverId: string) {
  const { data } = await supabase.from('mover_rates').select('*').eq('mover_id', moverId)
  const history = groupRates((data ?? []) as MoverRate[])[moverId]
  if (!history?.length) return
  await supabase.from('movers').update({ hourly_rate: rateOn(history, nowInBusinessZone().date, 0) }).eq('id', moverId)
}
