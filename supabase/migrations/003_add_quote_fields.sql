-- Migration 003: Add quote fields to orders table

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 100 INCREMENT 1;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_number       INT            DEFAULT nextval('order_number_seq'),
  ADD COLUMN IF NOT EXISTS estimated_price    NUMERIC,
  ADD COLUMN IF NOT EXISTS estimated_hours    NUMERIC,
  ADD COLUMN IF NOT EXISTS quote_generated_at TIMESTAMPTZ;
