-- Customer photos of the junk from the public /book-service form, stored in a
-- private Storage bucket as <service order id>/<n>.<ext>. Only the service
-- role (API routes) reads or writes them; admins see them via signed URLs.
ALTER TABLE service_orders
  ADD COLUMN IF NOT EXISTS photo_paths TEXT[] NOT NULL DEFAULT '{}';

INSERT INTO storage.buckets (id, name, public)
VALUES ('service-order-photos', 'service-order-photos', false)
ON CONFLICT (id) DO NOTHING;
