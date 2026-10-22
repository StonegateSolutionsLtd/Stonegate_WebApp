-- amount_paid: what the client actually paid for a calendar job, entered by the admin
-- after the job. Nullable - NULL means not recorded yet (distinct from $0).
ALTER TABLE calendar_jobs
  ADD COLUMN IF NOT EXISTS amount_paid NUMERIC(10, 2)
  CHECK (amount_paid IS NULL OR amount_paid >= 0);
