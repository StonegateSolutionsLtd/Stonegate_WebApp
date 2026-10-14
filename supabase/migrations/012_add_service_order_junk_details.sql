-- Junk details from the public /book-service form. Values the customer marked
-- "Not sure" are filled in by the service chat before the order is submitted.
-- Nullable: older orders and admin-created orders don't have them.
ALTER TABLE service_orders
  ADD COLUMN IF NOT EXISTS load_size    TEXT
                            CHECK (load_size IN ('1/8 Truck', '1/4 Truck', '1/2 Truck', '3/4 Truck', 'Full Truck')),
  ADD COLUMN IF NOT EXISTS floor        INT CHECK (floor BETWEEN 1 AND 50),
  ADD COLUMN IF NOT EXISTS has_elevator BOOLEAN;
