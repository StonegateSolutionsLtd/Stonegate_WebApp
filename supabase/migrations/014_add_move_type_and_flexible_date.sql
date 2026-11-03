-- Free estimate form: the customer picks a move type and a size for that type, and a day
-- ("today", "this week" or a date) instead of an exact start time.
-- Older and admin-entered orders keep apartment_size and moving_time; their move_type is NULL.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS move_type TEXT
  CHECK (move_type IS NULL OR move_type IN ('house', 'apartment', 'commercial', 'storage', 'small'));

-- Bedrooms (1br..4br+), office size (home_office, small_office, medium_office, large_commercial)
-- or storage unit size (5x5..10x30), depending on move_type; NULL for a small move
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS move_size TEXT;

-- today: moving_date is the day it was requested; this_week: moving_date is the first day of the window
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS date_flexibility TEXT
  CHECK (date_flexibility IS NULL OR date_flexibility IN ('today', 'this_week', 'date'));

-- Offices, storage units and small moves have no bedroom count, and estimate requests have no start time
ALTER TABLE orders ALTER COLUMN apartment_size DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN moving_time DROP NOT NULL;
