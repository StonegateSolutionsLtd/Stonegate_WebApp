-- Job durations drive public booking availability: a slot is offered only when the
-- whole [start, start + duration) window is free. Moving jobs default to 5h, junk
-- removal to 2h; the admin can override per order.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS duration_minutes INT NOT NULL DEFAULT 300;

ALTER TABLE service_orders
  ADD COLUMN IF NOT EXISTS duration_minutes INT NOT NULL DEFAULT 120;

-- Nullable: calendar_jobs mixes both job types, so NULL falls back to the
-- per-job-type default in application code.
ALTER TABLE calendar_jobs
  ADD COLUMN IF NOT EXISTS duration_minutes INT;

CREATE INDEX IF NOT EXISTS orders_moving_date_idx ON orders(moving_date);
CREATE INDEX IF NOT EXISTS service_orders_service_date_idx ON service_orders(service_date);
