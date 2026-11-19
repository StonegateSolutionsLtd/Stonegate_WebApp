-- Travel fee charged in a quote, only when the admin ticks "Include travel fee" on the Hourly Rate quote.
-- NULL: travel is not charged and the quote shows "Included". Minutes are kept so the PDF shows the hours that were quoted,
-- even if the travel estimate is recalculated later.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS quote_travel_fee NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS quote_travel_minutes INT;
