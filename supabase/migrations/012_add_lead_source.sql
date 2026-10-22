-- lead_source: where the client came from, picked by the admin when adding an order or
-- calendar job by hand. Nullable - public website orders and older rows are "Not set".
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS lead_source TEXT
  CHECK (lead_source IS NULL OR lead_source IN ('google_ads', 'facebook_ads', 'word_of_mouth', 'organic_seo'));

ALTER TABLE service_orders
  ADD COLUMN IF NOT EXISTS lead_source TEXT
  CHECK (lead_source IS NULL OR lead_source IN ('google_ads', 'facebook_ads', 'word_of_mouth', 'organic_seo'));

ALTER TABLE calendar_jobs
  ADD COLUMN IF NOT EXISTS lead_source TEXT
  CHECK (lead_source IS NULL OR lead_source IN ('google_ads', 'facebook_ads', 'word_of_mouth', 'organic_seo'));
