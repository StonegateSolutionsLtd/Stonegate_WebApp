-- Mover pay rate history: a rate change applies from a given Monday onwards, and hours are paid at the
-- rate in effect on the day they were worked. Raising a rate no longer changes weeks already worked or paid.
-- movers.hourly_rate stays as the rate in effect today (kept in sync by the app).

CREATE TABLE IF NOT EXISTS mover_rates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mover_id        UUID NOT NULL REFERENCES movers(id) ON DELETE CASCADE,
  hourly_rate     NUMERIC(10,2) NOT NULL CHECK (hourly_rate >= 0),
  effective_from  DATE NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (mover_id, effective_from)
);

CREATE INDEX IF NOT EXISTS mover_rates_mover_idx ON mover_rates(mover_id, effective_from);

ALTER TABLE mover_rates ENABLE ROW LEVEL SECURITY;

-- Each mover's current rate covers everything so far; later changes are added from their week onwards.
-- If a rate was already raised, add the old rate back for the earlier weeks from the mover's Edit window.
INSERT INTO mover_rates (mover_id, hourly_rate, effective_from)
SELECT id, hourly_rate, DATE '2000-01-03' FROM movers
ON CONFLICT (mover_id, effective_from) DO NOTHING;
