-- Travel fee worked out when an estimate request comes in: the truck's drive from the parking spot
-- (11078 Spruce Rd, Surrey) to the pickup, and from the drop-off back, at $100/hour.
-- travel_fee: the amount in CAD; travel_estimate: both legs (minutes, km, departure times used for traffic)
-- and how each address was matched. Both are NULL until calculated or when an address could not be found.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS travel_fee NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS travel_estimate JSONB;
