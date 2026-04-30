-- =====================================================
-- Termthukshop — Supabase Database Schema
-- รัน SQL นี้ครั้งเดียวใน Supabase SQL Editor หลังสร้างโปรเจกต์
-- =====================================================

-- 1) Transactions (ประวัติการขาย)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  date timestamptz not null default now(),
  buyer text,
  seller text,
  game text,
  channel text,
  stock_type text,
  cost numeric(12,2) default 0,
  sales numeric(12,2) default 0,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 2) Stocks (สต๊อก iTunes/Razer/Mycard/USDT)
create table if not exists public.stocks (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('itunes','razer','mycard','usdt')),
  date date not null default current_date,
  qty numeric(12,2) default 0,
  cost numeric(12,2) default 0,
  source text,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 3) Supplies (Supply ส่งสินค้า)
create table if not exists public.supplies (
  id uuid primary key default gen_random_uuid(),
  supplier text not null,
  date date not null default current_date,
  item text,
  value numeric(12,2) default 0,
  cost numeric(12,2) default 0,
  status text default 'รอจัดส่ง',
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 4) Games (รายชื่อเกม)
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- =====================================================
-- Indexes
-- =====================================================
create index if not exists idx_tx_date on public.transactions(date desc);
create index if not exists idx_tx_game on public.transactions(game);
create index if not exists idx_stocks_type_date on public.stocks(type, date desc);
create index if not exists idx_supplies_supplier_date on public.supplies(supplier, date desc);

-- =====================================================
-- Enable Row Level Security
-- =====================================================
alter table public.transactions enable row level security;
alter table public.stocks enable row level security;
alter table public.supplies enable row level security;
alter table public.games enable row level security;

-- =====================================================
-- RLS Policies — authenticated users see/edit all data (single shop)
-- =====================================================

-- transactions
create policy "auth users can read tx" on public.transactions for select using (auth.role() = 'authenticated');
create policy "auth users can insert tx" on public.transactions for insert with check (auth.role() = 'authenticated');
create policy "auth users can update tx" on public.transactions for update using (auth.role() = 'authenticated');
create policy "auth users can delete tx" on public.transactions for delete using (auth.role() = 'authenticated');

-- stocks
create policy "auth users can read stocks" on public.stocks for select using (auth.role() = 'authenticated');
create policy "auth users can insert stocks" on public.stocks for insert with check (auth.role() = 'authenticated');
create policy "auth users can update stocks" on public.stocks for update using (auth.role() = 'authenticated');
create policy "auth users can delete stocks" on public.stocks for delete using (auth.role() = 'authenticated');

-- supplies
create policy "auth users can read sup" on public.supplies for select using (auth.role() = 'authenticated');
create policy "auth users can insert sup" on public.supplies for insert with check (auth.role() = 'authenticated');
create policy "auth users can update sup" on public.supplies for update using (auth.role() = 'authenticated');
create policy "auth users can delete sup" on public.supplies for delete using (auth.role() = 'authenticated');

-- games
create policy "auth users can read games" on public.games for select using (auth.role() = 'authenticated');
create policy "auth users can insert games" on public.games for insert with check (auth.role() = 'authenticated');
create policy "auth users can update games" on public.games for update using (auth.role() = 'authenticated');
create policy "auth users can delete games" on public.games for delete using (auth.role() = 'authenticated');

-- =====================================================
-- Realtime — enable broadcasting changes to subscribers
-- =====================================================
alter publication supabase_realtime add table public.transactions;
alter publication supabase_realtime add table public.stocks;
alter publication supabase_realtime add table public.supplies;
alter publication supabase_realtime add table public.games;
