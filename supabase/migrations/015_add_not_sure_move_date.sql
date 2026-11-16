-- Free estimate form: "Not sure yet" for the move date.
-- not_sure: no day chosen yet; moving_date holds the day it was requested (the column is NOT NULL) and is agreed later.
-- These orders have no moving_time, so they never block a slot in availability.

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_date_flexibility_check;
ALTER TABLE orders
  ADD CONSTRAINT orders_date_flexibility_check
  CHECK (date_flexibility IS NULL OR date_flexibility IN ('today', 'this_week', 'date', 'not_sure'));
