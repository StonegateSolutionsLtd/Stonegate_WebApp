-- orders: stores move requests submitted via the public order form
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Customer contact
  customer_name         TEXT NOT NULL,
  customer_email        TEXT NOT NULL,
  phone                 TEXT NOT NULL,
  -- Pickup location
  pickup_address        TEXT NOT NULL,
  pickup_floor          INT DEFAULT 1,
  pickup_has_elevator   BOOLEAN DEFAULT FALSE,
  -- Drop-off location
  dropoff_address       TEXT NOT NULL,
  dropoff_floor         INT DEFAULT 1,
  dropoff_has_elevator  BOOLEAN DEFAULT FALSE,
  -- Move details
  apartment_size        TEXT NOT NULL CHECK (apartment_size IN ('studio','1br','2br','3br','4br+')),
  moving_date           DATE NOT NULL,
  moving_time           TIME NOT NULL,
  special_notes         TEXT,
  -- Status lifecycle
  status                TEXT DEFAULT 'pending'
                        CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled')),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- RLS enabled - only service_role key (used in API routes) can access orders.
-- Anon/public key is blocked by default when there are no permissive policies.
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ---- updated_at auto-update ------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
