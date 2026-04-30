# 🚀 คู่มือติดตั้ง Termthukshop Cloud (Supabase)

ทำตามขั้นตามนี้ครั้งเดียว แล้วเว็บจะทำงานเป็นระบบหลายผู้ใช้พร้อม Real-time sync

---

## ขั้น 1 — สมัคร Supabase

1. เข้า https://supabase.com → กด **Start your project** หรือ **Sign in**
2. ล็อกอินด้วย GitHub (แนะนำ) หรือ Google
3. หน้าแรกจะเห็น Dashboard ของ Supabase

## ขั้น 2 — สร้าง Project ใหม่

1. กด **New Project**
2. ตั้งค่า
   - **Name**: `termthukshop` (หรืออะไรก็ได้)
   - **Database Password**: ตั้งรหัสผ่านที่จำได้ — **เก็บไว้ ห้ามลืม** (สำหรับ admin database)
   - **Region**: Singapore (ใกล้ไทยสุด)
3. กด **Create new project** → รอประมาณ 1-2 นาที

## ขั้น 3 — สร้างตารางในฐานข้อมูล

1. ที่เมนูซ้าย กด **SQL Editor**
2. กด **+ New query**
3. เปิดไฟล์ `supabase_schema.sql` (อยู่ในโฟลเดอร์ TTSHOP) → ก๊อปทั้งไฟล์
4. วางในช่อง SQL Editor → กดปุ่ม **Run** (หรือกด Ctrl+Enter)
5. เห็นข้อความเขียว "Success. No rows returned" → เสร็จ

## ขั้น 4 — เอาคีย์มาใส่ในเว็บ

1. ที่เมนูซ้าย กด **Settings** (รูปเฟือง) → **API**
2. คุณจะเห็น 2 ค่าสำคัญ
   - **Project URL** — เช่น `https://xxxxxxxxx.supabase.co`
   - **anon public key** — ขึ้นต้นด้วย `eyJ...` (ยาวมาก)
3. กลับมาที่ไฟล์ `index.html` ในโฟลเดอร์ TTSHOP → เปิดด้วย Notepad
4. หาบรรทัดนี้ (ประมาณบรรทัดที่ ~330)
   ```js
   const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
   ```
5. แทนที่ด้วยค่าจริง — เก็บ quote ไว้ เช่น
   ```js
   const SUPABASE_URL = 'https://abcdefg.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
   ```
6. Save ไฟล์

## ขั้น 5 — ตั้งค่าการสมัครสมาชิก

1. ที่ Supabase เมนูซ้าย → **Authentication** → **Providers**
2. หา **Email** → คลิกเปิด
3. ปิด **Confirm email** (เพื่อข้ามการยืนยันอีเมลครั้งแรก สะดวกกว่า — ปลอดภัยน้อยลงนิดหน่อย)
4. กด **Save**

## ขั้น 6 — ทดสอบเปิดเว็บในเครื่อง

1. ดับเบิลคลิกไฟล์ `index.html`
2. หน้า login จะเปิด → กดแท็บ **สมัครใหม่**
3. ใส่ email + password (>=6 ตัว) → กด **สมัครใหม่**
4. ถ้าตั้งค่า "Confirm email" ปิดไว้ จะเข้าระบบเลย
5. ลองบันทึกการขายในหน้า "เติมเกม" → เปิดอีก browser tab → เห็นข้อมูล sync ทันที

## ขั้น 7 — เพิ่มผู้ใช้คนอื่น

มี 2 วิธี

**วิธี A — สร้างให้แอดมิน (แนะนำ)**
1. ที่ Supabase → **Authentication** → **Users** → **Add user** → **Create new user**
2. กรอก email + password ของพนักงาน → สร้าง
3. ส่ง email + password ให้พนักงาน

**วิธี B — ให้พนักงานสมัครเอง**
ส่ง URL เว็บให้ → กดแท็บ "สมัครใหม่" → ใส่ email + password เอง

## ขั้น 8 — Deploy ไปออนไลน์ (อัปเดตไฟล์บน GitHub)

1. ไปที่ repo บน GitHub
2. กดที่ไฟล์ `index.html` → กดไอคอนปากกา (แก้ไข)
3. ลบเนื้อหาเดิมทิ้งทั้งหมด → ก๊อปเนื้อหาจาก `index.html` ในเครื่อง (ที่ใส่คีย์แล้ว) ไปวาง
4. เลื่อนล่าง → Commit changes
5. รอประมาณ 1-2 นาที → เปิด URL GitHub Pages → เห็นหน้า login

⚠️ **สำคัญ**: เมื่อใส่ anon key ไว้ในไฟล์ที่ public บน GitHub ก็โอเค — anon key ออกแบบมาให้ public ได้ ความปลอดภัยอยู่ที่ Row Level Security (RLS) ที่ schema.sql ตั้งไว้แล้ว

---

## วิธีดูข้อมูลในฐานข้อมูล

ที่ Supabase → **Table Editor** → เลือกตาราง `transactions`, `stocks`, `supplies`, `games`
- ดู / แก้ / ลบ ข้อมูลได้เหมือน Excel
- ทำ filter, sort ได้

## วิธี Backup ข้อมูล

Supabase free tier มี backup อัตโนมัติ 7 วัน นอกจากนี้ในเว็บมีปุ่ม Export CSV ที่หน้า "ประวัติการขาย"

## ราคา / ข้อจำกัด Supabase Free Tier

- 500 MB database (เก็บได้หลายแสน rows)
- 50,000 monthly active users
- 2 GB egress/เดือน
- 50 K reads / 20 K writes ต่อวัน

ร้านขนาด 1-3 คน ฟรีตลอด

---

## ปัญหาที่พบบ่อย

**"Invalid login credentials"** = email/password ผิด
**"Email not confirmed"** = ไปขั้น 5 ปิด Confirm email
**ข้อมูลไม่ sync** = เปิด Console (F12) ดู error — มักเป็น RLS policy
**หน้าขึ้น "ยังไม่ได้ตั้งค่า Supabase"** = ขั้น 4 ยังไม่ใส่ URL/Key
