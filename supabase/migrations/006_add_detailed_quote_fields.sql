-- Migration 006: Support a third "detailed" quote type (distance, load,
-- tough-job fee, team labour, rush fee, GST/PST) alongside the existing
-- custom/volume flow, which is now called 'standard'.
ALTER TABLE service_orders
  ADD COLUMN IF NOT EXISTS quote_type    TEXT NOT NULL DEFAULT 'standard'
                            CHECK (quote_type IN ('standard', 'detailed')),
  ADD COLUMN IF NOT EXISTS quote_details JSONB;
