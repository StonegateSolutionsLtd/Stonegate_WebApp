-- calendar_jobs: manually-curated schedule of confirmed jobs (moving + junk removal).
-- Never populated automatically from orders/service_orders - owner adds entries by hand,
-- optionally linked back to the source order for reference.
CREATE TABLE IF NOT EXISTS calendar_jobs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type          TEXT NOT NULL CHECK (job_type IN ('moving', 'junk_removal')),
  event_date        DATE NOT NULL,
  event_time        TIME,
  is_subcontract    BOOLEAN NOT NULL DEFAULT FALSE,
  company_name      TEXT,
  pickup_address    TEXT,
  size              TEXT CHECK (size IS NULL OR size IN ('studio', '1br', '2br', '3br', '4br+')),
  customer_name     TEXT,
  notes             TEXT,
  order_id          UUID REFERENCES orders(id) ON DELETE SET NULL,
  service_order_id  UUID REFERENCES service_orders(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS calendar_jobs_event_date_idx ON calendar_jobs(event_date);

ALTER TABLE calendar_jobs ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS calendar_jobs_updated_at ON calendar_jobs;
CREATE TRIGGER calendar_jobs_updated_at
  BEFORE UPDATE ON calendar_jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
