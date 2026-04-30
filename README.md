# 🎮 Termthukshop Dashboard

ระบบแดชบอร์ดบริหารร้านเติมเกม Termthukshop พร้อมระบบบันทึกการขาย, สต๊อก, Supply และวิเคราะห์ SKU อัตโนมัติ

## 📦 ไฟล์ในโปรเจกต์

| ไฟล์ | คำอธิบาย |
| --- | --- |
| `Termthukshop_Dashboard.html` | เว็บแอป Dashboard (เปิดในเบราว์เซอร์ — เก็บข้อมูลใน localStorage) |
| `Termthukshop_Dashboard.xlsx` | Excel template พร้อมสูตรคำนวณ Profit / Margin / สรุปสต๊อกอัตโนมัติ |

## 🧭 เมนูที่มี

1. **ภาพรวม** — KPI ต้นทุน / ยอดขาย / กำไร + กราฟเกมขายดี + กราฟยอดขายรายวัน
2. **เติมเกม** — ฟอร์มบันทึกการขาย คำนวนกำไรขณะพิมพ์
3. **ประวัติการขาย** — ตารางอ่านอย่างเดียว, Filter, Export CSV
4. **สต๊อก / Rate** — iTunes, Razer, Mycard, USDT/PHP (คำนวนราคาเฉลี่ย/หน่วย)
5. **Supply** — จอนชาวไร่, Kingpro, Over, 24BuyM
6. **วิเคราะห์ SKU** — Top 20 เกมขายดี + บทวิเคราะห์ + Trend 7 วัน
7. **รายชื่อเกม / คำนวนต้นทุน** — สรุปเกม + เครื่องมือคำนวณราคาขายแนะนำ

## 🚀 วิธีใช้

### HTML Dashboard
ดับเบิลคลิก `Termthukshop_Dashboard.html` เพื่อเปิดในเบราว์เซอร์ — ข้อมูลทั้งหมดเก็บใน browser (localStorage) ของเครื่องเอง

ส่งออก/นำเข้าข้อมูลเป็น JSON ผ่านปุ่มที่ Sidebar เพื่อ backup หรือย้ายเครื่อง

### Excel Template
เปิด `Termthukshop_Dashboard.xlsx` ใน Excel หรือ LibreOffice — กรอกข้อมูลในชีท "ประวัติการขาย" ระบบจะคำนวน Dashboard, สรุปเกม, และบทวิเคราะห์อัตโนมัติ

คอลัมน์สีน้ำเงิน = ช่องที่กรอกเอง / สีดำ = สูตร (อย่าแก้)

## 🛠 เทคโนโลยี

- HTML Dashboard: Tailwind CSS, Chart.js, vanilla JavaScript, localStorage
- Excel Template: openpyxl + LibreOffice recalc

## 📄 License

Personal use — Termthukshop

