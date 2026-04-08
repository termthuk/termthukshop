# TermthukShop — คู่มือ Setup

## 📋 ขั้นตอนทั้งหมด

---

## STEP 1 — ตั้งค่า Supabase Database

1. เปิด https://supabase.com/dashboard
2. ไปที่ Project ของคุณ → **SQL Editor**
3. Copy SQL จากไฟล์ `supabase-schema.sql` ทั้งหมด
4. Paste แล้ว กด **Run**
5. ตรวจสอบใน **Table Editor** ว่ามี tables: `orders`, `refunds`, `stock`, `rates`, `stock_logs`, `rate_logs`

---

## STEP 2 — ติดตั้ง Dependencies

เปิด Terminal ในโฟลเดอร์ `termthukshop` แล้วรัน:

```bash
npm install
```

---

## STEP 3 — Push ขึ้น GitHub

```bash
# ตรวจสอบว่า git remote ถูกต้อง
git remote -v

# ถ้า remote ยังไม่มี ให้รัน:
git init
git branch -m main
git remote add origin https://github.com/termthuk/termthukshop.git
git add .
git commit -m "Initial commit — TermthukShop Dashboard"

# Push (ต้องใส่ GitHub Personal Access Token)
git push -u origin main
```

> **หมายเหตุ:** GitHub ต้องการ Personal Access Token (PAT)  
> สร้างได้ที่: https://github.com/settings/tokens/new  
> เลือก scope: **repo** แล้วใช้ token เป็น password ตอน push

---

## STEP 4 — Deploy บน Vercel

### วิธีที่ 1: ผ่าน Vercel Dashboard (แนะนำ)
1. ไปที่ https://vercel.com/new
2. กด **Import Git Repository**
3. เลือก repo `termthuk/termthukshop`
4. ตั้งค่า **Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://irqotybhiiiofengpzwl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. กด **Deploy** ✅

### วิธีที่ 2: ผ่าน Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## STEP 5 — ทดสอบ

หลัง deploy เสร็จ:
- เปิด URL จาก Vercel (เช่น `termthukshop.vercel.app`)
- ตรวจสอบว่าโหลดได้
- ลองเพิ่มรายการขายใหม่ → ตรวจสอบใน Supabase Table Editor

---

## 🗂️ โครงสร้างไฟล์

```
termthukshop/
├── .env.local              ← Supabase credentials (ไม่ push ขึ้น GitHub)
├── .env.example            ← Template สำหรับ reference
├── package.json            ← Dependencies
├── next.config.js          ← Next.js config
├── tailwind.config.js      ← Tailwind CSS config
├── supabase-schema.sql     ← รัน SQL นี้ใน Supabase ก่อน
├── app/
│   ├── layout.js           ← Root layout
│   ├── page.js             ← Redirect to /dashboard
│   ├── globals.css         ← Global styles
│   └── dashboard/page.js  ← Main dashboard page
├── components/
│   ├── Header.jsx          ← Top navigation bar
│   ├── Sidebar.jsx         ← Left sidebar
│   ├── ToastProvider.jsx   ← Toast notifications
│   ├── Overview.jsx        ← Dashboard overview + charts
│   ├── SalesForm.jsx       ← Add new sale form
│   ├── SalesTable.jsx      ← Sales records table
│   ├── DailySales.jsx      ← Daily sales view
│   ├── History.jsx         ← Full history with filters
│   ├── Refund.jsx          ← Refund/claim management
│   ├── Stock.jsx           ← Stock management
│   └── Rate.jsx            ← Rate management
└── lib/
    └── supabase.js         ← Supabase client + all CRUD functions
```

---

## 🔧 ปัญหาที่พบบ่อย

**Q: เปิดหน้าเว็บแล้วไม่มีข้อมูล?**  
A: ตรวจสอบว่าได้รัน `supabase-schema.sql` แล้ว และ env variables ถูกต้อง

**Q: Error "relation does not exist"?**  
A: ต้องรัน SQL schema ใน Supabase ก่อน

**Q: npm install error?**  
A: ต้องใช้ Node.js v18+ รัน `node --version` เพื่อตรวจสอบ
