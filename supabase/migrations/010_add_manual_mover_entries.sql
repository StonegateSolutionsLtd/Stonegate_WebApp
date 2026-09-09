-- Allow mover_assignments to exist without a calendar job, for hours or a flat
-- amount owed that isn't tied to a scheduled job (e.g. warehouse work, a bonus,
-- an advance). work_date positions the entry within a payroll week; label is a
-- free-text description shown in place of job details; amount_override, when
-- set, is added to "owed" directly instead of hours * hourly_rate.
ALTER TABLE mover_assignments ALTER COLUMN calendar_job_id DROP NOT NULL;
ALTER TABLE mover_assignments ADD COLUMN IF NOT EXISTS work_date DATE;
ALTER TABLE mover_assignments ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE mover_assignments ADD COLUMN IF NOT EXISTS amount_override NUMERIC(10,2);

ALTER TABLE mover_assignments DROP CONSTRAINT IF EXISTS mover_assignments_source_chk;
ALTER TABLE mover_assignments ADD CONSTRAINT mover_assignments_source_chk
  CHECK (calendar_job_id IS NOT NULL OR work_date IS NOT NULL);

CREATE INDEX IF NOT EXISTS mover_assignments_work_date_idx ON mover_assignments(work_date);
