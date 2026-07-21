-- Migration 007: Bring the same detailed-quote support (distance, load,
-- tough-job fee, team labour, rush fee, GST/PST) from service_orders to the
-- moving `orders` table.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS quote_type    TEXT NOT NULL DEFAULT 'standard'
                            CHECK (quote_type IN ('standard', 'detailed')),
  ADD COLUMN IF NOT EXISTS quote_details JSONB;
