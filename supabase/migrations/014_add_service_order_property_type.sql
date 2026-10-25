-- Property type from the public /book-service form. The elevator question is
-- only asked for apartments (has_elevator stays null otherwise), and the form
-- no longer asks for the floor: stairs come from the service chat instead.
-- Nullable: older orders and admin-created orders don't have it.
ALTER TABLE service_orders
  ADD COLUMN IF NOT EXISTS property_type TEXT
                            CHECK (property_type IN ('house', 'apartment', 'commercial', 'other'));
