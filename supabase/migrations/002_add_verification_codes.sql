-- verification_codes: short-lived codes for email verification before order submission
CREATE TABLE IF NOT EXISTS verification_codes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT NOT NULL,
  code       TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS enabled — only service_role key (used in API routes) can access this table
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
