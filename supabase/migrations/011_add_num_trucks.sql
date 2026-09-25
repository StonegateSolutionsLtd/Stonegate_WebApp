-- Migration 011: Track number of trucks on a standard moving quote
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS num_trucks INTEGER DEFAULT 1;
