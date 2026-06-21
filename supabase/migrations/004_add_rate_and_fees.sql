-- Migration 004: Split quote pricing into rate, hours, and additional fees
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS hourly_rate     NUMERIC DEFAULT 80,
  ADD COLUMN IF NOT EXISTS additional_fees NUMERIC DEFAULT 0;
