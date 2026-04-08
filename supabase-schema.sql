-- TermthukShop — Supabase Schema
-- รัน SQL นี้ใน Supabase Dashboard → SQL Editor

-- ============== ORDERS TABLE ==============
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL,
  seller TEXT NOT NULL,
  game TEXT NOT NULL,
  buyer TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT 'FB',
  payment TEXT NOT NULL DEFAULT 'Banking',
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  profit NUMERIC(12,2) NOT NULL DEFAULT 0,
  note TEXT DEFAULT ''
);

-- ============== REFUNDS TABLE ==============
CREATE TABLE IF NOT EXISTS refunds (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL,
  buyer TEXT NOT NULL,
  game TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT 'FB',
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'refund',
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  slip_name TEXT DEFAULT ''
);

-- ============== STOCK TABLE ==============
CREATE TABLE IF NOT EXISTS stock (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  key_name TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🎮',
  quantity INTEGER NOT NULL DEFAULT 0,
  max_quantity INTEGER NOT NULL DEFAULT 1000,
  color TEXT NOT NULL DEFAULT 'var(--purple2)',
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 99
);

-- ============== STOCK LOGS TABLE ==============
CREATE TABLE IF NOT EXISTS stock_logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  stock_key TEXT NOT NULL,
  stock_name TEXT NOT NULL,
  action TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  note TEXT DEFAULT ''
);

-- ============== RATES TABLE ==============
CREATE TABLE IF NOT EXISTS rates (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  key_name TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🪙',
  cost_per_100 NUMERIC(10,2) NOT NULL DEFAULT 0,
  sell_per_100 NUMERIC(10,2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 99
);

-- ============== RATE LOGS TABLE ==============
CREATE TABLE IF NOT EXISTS rate_logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  cost_per_100 NUMERIC(10,2) NOT NULL,
  sell_per_100 NUMERIC(10,2) NOT NULL
);

-- ============== SEED DEFAULT STOCK ==============
INSERT INTO stock (key_name, name, icon, quantity, max_quantity, color, is_custom, sort_order)
VALUES
  ('razer', 'Razer Gold', '🪙', 4500, 5000, '#38bdf8', FALSE, 1),
  ('itune', 'iTunes / Apple', '🍎', 1509, 3500, '#4ade80', FALSE, 2),
  ('mycard', 'MyCard', '🃏', 0, 500, '#a78bfa', FALSE, 3),
  ('ooc', 'OOC / ROOC', '🌊', 0, 200, '#f472b6', FALSE, 4)
ON CONFLICT (key_name) DO NOTHING;

-- ============== SEED DEFAULT RATES ==============
INSERT INTO rates (key_name, name, icon, cost_per_100, sell_per_100, sort_order)
VALUES
  ('razer', 'Razer Gold', '🪙', 95.00, 100.00, 1),
  ('itune', 'iTunes / Apple', '🍎', 28.50, 30.00, 2),
  ('mycard', 'MyCard', '🃏', 92.00, 97.50, 3),
  ('ooc', 'OOC / ROOC', '🌊', 155.00, 161.00, 4)
ON CONFLICT (key_name) DO NOTHING;

-- ============== ROW LEVEL SECURITY ==============
-- เปิด RLS แต่อนุญาตให้ anon อ่าน/เขียนได้ (สำหรับ demo)
-- ถ้าต้องการ auth ให้เปลี่ยน policy ทีหลัง

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_logs ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (no auth required for now)
CREATE POLICY "Allow all for anon" ON orders FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON refunds FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON stock FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON stock_logs FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON rates FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON rate_logs FOR ALL TO anon USING (true) WITH CHECK (true);
