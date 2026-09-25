-- Migration 012: Allow GST (5%) to be added to a standard (hourly rate) moving quote
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS gst BOOLEAN DEFAULT false;
