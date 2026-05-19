-- ============================================================
-- 001_initial_schema.sql
-- Run this in your Supabase project: SQL Editor > New Query
-- ============================================================

-- profiles: extends auth.users, auto-populated via trigger
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT NOT NULL,
  full_name   TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- orders
CREATE TABLE IF NOT EXISTS orders (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID REFERENCES profiles(id) ON DELETE SET NULL,
  -- Contact
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
  special_notes         TEXT,
  -- Status lifecycle
  status                TEXT DEFAULT 'pending'
                        CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled')),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Row Level Security --------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile read"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile update" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "own orders read"   ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own orders insert" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ---- Auto-create profile on sign-up -------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ---- updated_at auto-update ---------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
