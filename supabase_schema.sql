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

-- 5) Credits (เครดิต / ค้างชำระ)
create table if not exists public.credits (
  id uuid primary key default gen_random_uuid(),
  date timestamptz not null default now(),
  customer text,
  game text,
  sales numeric(12,2) default 0,
  cost numeric(12,2) default 0,
  status text default 'unpaid' check (status in ('unpaid','paid')),
  paid_at timestamptz,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 6) Shareholders (ผู้ถือหุ้น + ต้นทุนเริ่ม)
create table if not exists public.shareholders (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  percentage numeric(5,2) default 0,
  capital numeric(12,2) default 0,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 7) Expenses (ค่าใช้จ่าย)
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  item text,
  category text,
  amount numeric(12,2) default 0,
  note text,
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
create index if not exists idx_credits_date on public.credits(date desc);
create index if not exists idx_credits_status on public.credits(status);
create index if not exists idx_expenses_date on public.expenses(date desc);

-- =====================================================
-- Seed shareholders (รัน insert ครั้งเดียว — ถ้ามีอยู่แล้วจะข้าม)
-- =====================================================
insert into public.shareholders (name, percentage)
values ('พี่แต้ง', 33.33), ('พี่ที', 33.33), ('ออฟ', 33.34)
on conflict (name) do nothing;

-- =====================================================
-- Enable Row Level Security
-- =====================================================
alter table public.transactions enable row level security;
alter table public.stocks enable row level security;
alter table public.supplies enable row level security;
alter table public.games enable row level security;
alter table public.credits enable row level security;
alter table public.shareholders enable row level security;
alter table public.expenses enable row level security;

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

-- credits
create policy "auth users can read credits" on public.credits for select using (auth.role() = 'authenticated');
create policy "auth users can insert credits" on public.credits for insert with check (auth.role() = 'authenticated');
create policy "auth users can update credits" on public.credits for update using (auth.role() = 'authenticated');
create policy "auth users can delete credits" on public.credits for delete using (auth.role() = 'authenticated');

-- shareholders
create policy "auth users can read shareholders" on public.shareholders for select using (auth.role() = 'authenticated');
create policy "auth users can insert shareholders" on public.shareholders for insert with check (auth.role() = 'authenticated');
create policy "auth users can update shareholders" on public.shareholders for update using (auth.role() = 'authenticated');
create policy "auth users can delete shareholders" on public.shareholders for delete using (auth.role() = 'authenticated');

-- expenses
create policy "auth users can read expenses" on public.expenses for select using (auth.role() = 'authenticated');
create policy "auth users can insert expenses" on public.expenses for insert with check (auth.role() = 'authenticated');
create policy "auth users can update expenses" on public.expenses for update using (auth.role() = 'authenticated');
create policy "auth users can delete expenses" on public.expenses for delete using (auth.role() = 'authenticated');

-- =====================================================
-- Realtime — enable broadcasting changes to subscribers
-- =====================================================
alter publication supabase_realtime add table public.transactions;
alter publication supabase_realtime add table public.stocks;
alter publication supabase_realtime add table public.supplies;
alter publication supabase_realtime add table public.games;
alter publication supabase_realtime add table public.credits;
alter publication supabase_realtime add table public.shareholders;
alter publication supabase_realtime add table public.expenses;
