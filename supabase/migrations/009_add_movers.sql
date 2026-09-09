-- movers: roster of moving crew used for calendar assignment and payroll tracking
CREATE TABLE IF NOT EXISTS movers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  phone         TEXT,
  hourly_rate   NUMERIC(10,2) NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE movers ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS movers_updated_at ON movers;
CREATE TRIGGER movers_updated_at BEFORE UPDATE ON movers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- mover_assignments: which movers worked which calendar job, and hours logged for payroll
CREATE TABLE IF NOT EXISTS mover_assignments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mover_id         UUID NOT NULL REFERENCES movers(id) ON DELETE CASCADE,
  calendar_job_id  UUID NOT NULL REFERENCES calendar_jobs(id) ON DELETE CASCADE,
  hours            NUMERIC(5,2),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (mover_id, calendar_job_id)
);

CREATE INDEX IF NOT EXISTS mover_assignments_mover_idx ON mover_assignments(mover_id);
CREATE INDEX IF NOT EXISTS mover_assignments_job_idx ON mover_assignments(calendar_job_id);

ALTER TABLE mover_assignments ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS mover_assignments_updated_at ON mover_assignments;
CREATE TRIGGER mover_assignments_updated_at BEFORE UPDATE ON mover_assignments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- mover_payments: payroll payments made to a mover against a given pay-period (week)
CREATE TABLE IF NOT EXISTS mover_payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mover_id       UUID NOT NULL REFERENCES movers(id) ON DELETE CASCADE,
  period_start   DATE NOT NULL,
  period_end     DATE NOT NULL,
  amount         NUMERIC(10,2) NOT NULL,
  paid_date      DATE NOT NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS mover_payments_mover_idx ON mover_payments(mover_id);
CREATE INDEX IF NOT EXISTS mover_payments_period_idx ON mover_payments(period_start);

ALTER TABLE mover_payments ENABLE ROW LEVEL SECURITY;
