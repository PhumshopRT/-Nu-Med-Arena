# NucMed Arena — Mode 1: Localization Match ☢️🃏

เกมไพ่การศึกษาแพทย์นิวเคลียร์ (Nuclear Medicine Educational Card Game)
พัฒนาสำหรับรายวิชานิวเคลียร์เมดิซีน เพื่อการเรียนรู้กลไกการสะสมของสารเภสัชรังสีผ่านประสบการณ์บอร์ดเกมบนเว็บแบบเรียลไทม์

---

## 🎮 โครงสร้างเกมและกติกา
- **การ์ด 4 หมวด**:
  1. 🔵 **Radiopharmaceutical Card (น้ำเงิน)** — สารเภสัชรังสี (เช่น ¹⁸F-FDG, ⁹⁹ᵐTc-MAA, ¹²³I-NaI)
  2. 🟡 **Mechanism Card (เหลือง)** — กลไกการสะสมของสาร (เช่น Capillary Blockade, Active Transport, Phagocytosis)
  3. 🔴 **Clinical Case Card (แดง)** — โจทย์ทางคลินิก (Basic 2 แต้ม, Clinical 4 แต้ม)
  4. 🟢 **Target / Clue Card (เขียว)** — คำใบ้และเป้าหมายอวัยวะ
- **ระบบห้อง (Multiplayer)**: รหัสห้อง 6 ตัวอักษร รองรับ 2–6 ผู้เล่น หรือโหมดซ้อมกับ AI Bot
- **การล็อกอิน**: กรอกรหัสนักศึกษา เข้าเล่นได้ทันทีไม่ต้องมีรหัสผ่าน มีระบบสะสมคะแนน NucCoin และร้านค้าของตกแต่ง

---

## 📂 แผนการพัฒนาตามลำดับเฟส (Phase by Phase)
- **PHASE 0**: Bootstrap + หน้า Boot Loading & Title Splash สไตล์ปกเกม + ระบบล็อกอินรหัสนักศึกษา
- **PHASE 1**: Card System ตามต้นฉบับการ์ด 4 สี + Seed ข้อมูลการ์ดครบชุด + อัลบั้ม `/gallery`
- **PHASE 2**: Authentication รหัสนักศึกษา + ระบบโปรไฟล์ & เลเวล XP + โครงสร้างร้านค้า
- **PHASE 3**: ระบบห้อง Lobby เรียลไทม์ + ระบบพร้อม/เริ่มเกม + QR Code
- **PHASE 4**: Game Engine Mode 1 + ระบบแจกไพ่, เลือกสาร, เลือกกลไก, ล็อกคำตอบ, เฉลย & ระบบ Tie-break
- **PHASE 5**: Game Feel (เสียงประกอบ SFX, แอนิเมชันบิน/สั่น/เรืองแสง, นาฬิกา Timer Ring, Confetti)
- **PHASE 6**: ร้านค้าไอเทมคอสเมติก (กรอบไพ่, ลายหลังไพ่, อวาตาร์, ฉายา) + กระดานผู้นำ Leaderboard + หน้าระบบแอดมินอาจารย์
- **PHASE 7**: เนื้อหาเต็มครบชุด + คู่มือการเล่น + รองรับหน้าจอมือถือ Responsive + พร้อมขึ้น Production

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Development)

```bash
# 1. ติดตั้ง dependencies
pnpm install

# 2. ตั้งค่าไฟล์ Environment
cp .env.example .env

# 3. รัน Development Server
pnpm dev
```

---

## 📑 เอกสารอ้างอิง
- ภาพต้นฉบับการ์ด: `docs/refs/card-prototype.jpg`
- ภาพอ้างอิงหน้าปก/สแปลช: `docs/refs/splash-reference.jpg`
