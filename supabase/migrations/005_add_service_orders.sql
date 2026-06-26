-- Service orders for junk removal and bin cleaning requests
CREATE SEQUENCE IF NOT EXISTS service_order_number_seq START 100;

CREATE TABLE IF NOT EXISTS service_orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        INT NOT NULL DEFAULT nextval('service_order_number_seq'),
  order_type          TEXT NOT NULL CHECK (order_type IN ('junk_removal', 'bin_cleaning')),
  customer_name       TEXT NOT NULL,
  customer_email      TEXT NOT NULL,
  phone               TEXT NOT NULL,
  address             TEXT NOT NULL,
  service_date        DATE NOT NULL,
  service_time        TIME NOT NULL,
  notes               TEXT,
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  estimated_price     NUMERIC,
  hourly_rate         NUMERIC DEFAULT 80,
  estimated_hours     NUMERIC,
  additional_fees     NUMERIC DEFAULT 0,
  quote_generated_at  TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS service_orders_updated_at ON service_orders;
CREATE TRIGGER service_orders_updated_at
  BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
