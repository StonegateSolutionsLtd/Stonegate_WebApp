-- A cheaper slot the customer accepted when booking (/api/quote-options): the
-- estimated price they were promised, the normal price for their load size,
-- and the slot they picked first. NULL when no offer was taken.
ALTER TABLE service_orders
  ADD COLUMN IF NOT EXISTS offer_price          NUMERIC,
  ADD COLUMN IF NOT EXISTS offer_base_price     NUMERIC,
  ADD COLUMN IF NOT EXISTS offer_original_time  TIME;
