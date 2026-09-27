# MASTER PROMPT — NucMed Arena: Localization Match
## ส่งไฟล์นี้ทั้งก้อนให้ AI ที่จะสร้างเว็บแอป (Cursor / Claude Code / Codex / Gemini / Copilot Workspace)
## อย่าสรุป อย่าข้ามเฟส ทำทีละเฟสแล้ว commit ขึ้น GitHub ทุกเฟส
## ฉบับละเอียดสุด: มี seed การ์ดครบ  state machine  payload  ต้นไม้ไฟล์  ข้อความ UI  ร้าน  เทส
## แพ็กไฟล์ที่ต้องแนบคู่กัน
## - refs/card-prototype.jpg = ต้นฉบับการ์ด 4 สี ทำใกล้เคียงเป๊ะ
## - refs/splash-reference.jpg = โทนหน้าโหลด/หน้าปกเกม (เอาโครงสร้างจอ ไม่ก๊อปพิซซ่า/มายคราฟต์)
## - ไฟล์ PDF คู่กันมีรูปฝังแล้ว ใช้ส่งคนอ่าน แต่ตอนสั่งโค้ดให้ยึดไฟล์ .md นี้เป็นหลัก

---

---

# 0) บทบาทและเป้าหมาย

คุณคือทีม full-stack + game designer + UI/UX ที่ได้รับมอบหมายให้สร้างเว็บเกมไพ่การศึกษาแพทย์นิวเคลียร์ชื่อ:

**NucMed Arena — Mode 1: Localization Match**

เป้าหมายไม่ใช่เว็บแบบฟอร์มควิซ แต่ต้องรู้สึกเหมือน **นั่งล้อมโต๊ะเล่นไพ่จริง** แบบ Board Game Arena / Uno online / Codenames / The Game:
- มีห้อง (room code 6 ตัว)
- มีโต๊ะกลาง
- มีมือไพ่ของตัวเองที่คนอื่นมองไม่เห็น
- มีแอนิเมชันจั่ว / วาง / พลิก / ส่งไพ่
- มีเสียง, เวลา, คะแนน, ร้านไอเทม
- การ์ดทุกใบต้องหน้าตา **ใกล้เคียงต้นฉบับเป๊ะ** (สี, มุม, ไอคอน, เลย์เอาต์, ฟอนต์วิทยาศาสตร์)

ผู้ใช้ล็อกอินด้วย **รหัสนักศึกษาเท่านั้น ไม่มีรหัสผ่าน** ระบบสร้างบัญชีให้อัตโนมัติถ้ายังไม่มี

ผู้ใช้จะส่งลิงก์ GitHub repo มาเองในข้อความถัดไป — พอได้ลิงก์ให้ `git remote add` แล้ว push ทุกเฟส

ภาษา UI หลัก: **ไทย**
เนื้อหาการ์ด: ไทย + สัญลักษณ์เคมีอังกฤษ (¹⁸F-FDG, ⁹⁹ᵐTc-MAA)
รองรับมือถือแนวนอนและเดสก์ท็อป (เกมไพ่เล่นดีสุดบนจอกว้าง)

---

# 0.5) ไฟล์อ้างอิงภาพที่ต้องยึด — ห้ามละ

คัดลอกโฟลเดอร์ `refs/` เข้าไปในรีโปเป็น `docs/refs/`

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| `docs/refs/card-prototype.jpg` | **ต้นฉบับการ์ด 4 สี** เลย์เอาต์ สี มุม ไอคอน ตัวอักษรต้องใกล้เคียงเป๊ะ |
| `docs/refs/splash-reference.jpg` | **โทนหน้าโหลด/หน้าปกเกม** ไม่ใช่ก๊อปพิซซ่า/มายคราฟต์คำต่อคำ แต่ลอกโครงสร้างจอสแปลช |

กฎการใช้รูป:
- การ์ดในเกมต้องเทียบ `card-prototype.jpg` รายใบ ไม่ improvis สีใหม่
- หน้าแรกของเว็บต้องรู้สึกเป็น **ปกเกม** แบบ `splash-reference.jpg` ไม่ใช่แลนดิ้ง SaaS
- ห้ามขโมยตัวละคร/โลโก้ File Type หรือ Minecraft
- เอาเฉพาะไวยากรณ์ภาพ: ฉากโลกกว้าง, โลโก้ 3D กลางจอ, ไอคอนลอย, ตัวละครมาสคอต, ปุ่ม PLAY ใหญ่, เครดิตล่าง

---

# 0.6) หน้าโหลดเกม + หน้าปก (ทำก่อนหน้าโฮม)

สร้าง 2 จอต่อกัน ห้ามข้าม:

## A) Boot / Loading  `/` ตอนเปิดครั้งแรก 2.5–4 วินาที
- พื้นหลังฉากแล็บนิวเคลียร์สไตล์โลกเกม (ท้องฟ้า, อาคาร hot cell, ต้นไม้บล็อกอ่อน ๆ หรือโลโววอกเซลก็ได้ แต่โทนวิทยาศาสตร์ไม่ใช่พิซซ่า)
- โลโก้ **NucMed Arena** แบบตัวอักษร 3D หนา เหลือง-เขียวหรือเหลือง-น้ำเงิน วางกลางบน
- ไม้ป้ายใต้โลโก้ข้อความไทย: **จับคู่สาร · จับคู่กลไก · รอบโต๊ะไพ่**
- อังกฤษเล็ก: LEARN • MATCH • PLAY • NUCLEAR MEDICINE
- แถบโหลดไม้/โลหะด้านล่าง มีเปอร์เซ็นต์ + ข้อความสุ่มเช่น
  - กำลังอุ่นเครื่อง generator ⁹⁹ᵐTc...
  - กำลังสับการ์ด Capillary Blockade...
  - กำลังตั้งกล้อง PET/CT...
- การ์ด 4 สีลอยหมุนช้า ๆ รอบโลโก้ (น้ำเงิน เหลือง แดง เขียว) แทนไอคอนไฟล์ในรูปอ้างอิง
- เสียงบูตสั้น 1 ครั้ง ปุ่มปิดเสียงมุมล่างขวา

## B) Title splash / หน้าปกเกม  หลังโหลดจบ
เลย์เอาต์เทียบรูปอ้างอิงทีละชิ้น:

```
[ท้องฟ้า + ฉากโลกเกม]
[ไอคอนการ์ด 4 สีลอยซ้าย-ขวา]
[โลโก้ 3D ใหญ่ NucMed Arena]
[ป้ายไม้ซับไตเติลภาษาไทย]
[มาสคอตกลางจอ 1-3 ตัว สไตล์เดียวกันทั้งเกม]
[ปุ่ม PLAY สีเขียวใหญ่มีไอคอนสามเหลี่ยม]
[ปุ่มรอง: เข้าห้อง / ร้านค้า / วิธีเล่น]
[ป้ายเครดิตล่าง: พัฒนาสำหรับรายวิชานิวเคลียร์เมดิซีน]
```

มาสคอตที่อนุญาต (เลือกชุดเดียวแล้วใช้ซ้ำทั้งเกม):
- นักศึกษาหมวกแก๊ป + เสื้อกาวน์
- นักเทคนิคการแพทย์ถือการ์ด FDG
- สุนัข/แมวแล็บถือไพ่ (optional ตัวประกอบ)

ปุ่ม PLAY:
- ใหญ่ เหมือนรูปอ้างอิง สีเขียวสด ขอบเข้ม ตัวอักษรขาว
- กดแล้วเด้ง แล้วไปหน้าใส่รหัส นศ. แบบ overlay การ์ดไม้ ไม่กระโดดไปหน้าฟอร์มขาว

หลังใส่รหัส นศ. สำเร็จ จึงเข้าโฮมฮับในฉากเดิม (ไม่เปลี่ยนธีมเป็นเว็บขาว)

รายละเอียดอาร์ตหน้าปกที่ต้องทำให้ใกล้เคียงพลังรูปอ้างอิง:
- มุมกล้องระดับสายตา ฉากลึก มีร้าน/แล็บซ้ายขวา
- ของลอยในอากาศเป็นการ์ด R-01, M-03, C-05, T-03 และไอคอน PET / SPECT / ☢️ ไม่ใช่ PDF/MP3
- ป้ายร้านขวาเขียน Nuc Lab / Hot Cell / Imaging Bay
- ป้ายซ้ายเป็นหมวดการ์ด 4 สี แทนหมวดไฟล์
- ปุ่มปิดเสียงมุมจอ
- รองรับจอ 16:9 เป็นหลัก และมือถือแนวตั้งให้ซูมโฟกัสโลโก้+ปุ่ม PLAY

อย่าทำหน้าโหลดเป็น spinner กลมบนพื้นขาว

---

# 1) สิ่งที่ต้องติดตั้ง / ไลบรารี / “สกิล” ที่ต้องโหลดก่อนลงมือ

ก่อนเขียนโค้ดเกม ให้ติดตั้งและอ่านสกิล/เอกสารเหล่านี้ในโปรเจกต์ (สร้างโฟลเดอร์ `docs/skills/` สรุปวิธีใช้สั้น ๆ แต่ละตัว):

## 1.1 เฟรมเวิร์กและเกม
- Next.js 15 App Router + TypeScript + React 19
- Tailwind CSS v4 + `clsx` + `tailwind-merge`
- Framer Motion (แอนิเมชันไพ่: deal, flip, fly-to-table, shake wrong, glow correct)
- Zustand (client UI state)
- Zod (validate payload)
- socket.io-client + socket.io (ห้องเรียลไทม์, authoritative server)
- howler (SFX: shuffle, draw, play, correct, wrong, tick, win)
- canvas-confetti (ชนะรอบ)
- qrcode.react (แชร์ห้อง)
- lucide-react + custom SVG ไอคอนนิวเคลียร์ (radiation trefoil)
- `html-to-image` หรือ `satori` ถ้าต้อง export การ์ดเป็น PNG
- Vitest + Playwright (เทสกฎเกม + ห้อง)

## 1.2 ฐานข้อมูล / ออธ
เลือกค่าเริ่มต้นนี้ **ห้ามใช้ Google Sheets เป็นเกมสเตตเรียลไทม์**

**แนะนำหลัก (ทำอันนี้):**
- Supabase (Postgres + Auth แบบ custom student-id + Realtime เสริม + Storage สำหรับอวาตาร์)
- เกมสเตตในห้องใช้ **Socket.IO ใน memory + persist สรุปแมตช์ลง Postgres** เมื่อจบเกม
- ถ้ายังไม่มีโปรเจกต์ Supabase ให้ทำโหมด dev ด้วย SQLite ผ่าน Prisma ก่อน แล้วสลับ adapter ได้

**ทางเลือกที่ผู้ใช้ยอมรับได้:**
- Google Apps Script + Google Sheet ใช้ได้แค่เป็น **CMS เนื้อหาการ์ด** (teacher แก้โจทย์) ไม่ใช่ห้องเล่นสด
- สร้าง `integrations/google-sheets.ts` อ่านชีท `Cards_RP / Cards_MECH / Cards_CASE / Cards_CLUE / Shop_Items` แล้ว sync เข้า DB

อย่าทำล็อกอินรหัสผ่าน. ทำ endpoint:

```
POST /api/auth/student
body: { studentId: string, displayName?: string }
```

กฎรหัส นศ:
- trim, uppercase
- ความยาว 6–16 ตัวอักษร/ตัวเลข
- ถ้ามีอยู่แล้ว → login
- ถ้าไม่มี → สร้างโปรไฟล์ใหม่ (XP=0, coins=0, equipped cosmetic default)
- ออก JWT httpOnly cookie 7 วัน
- ไม่มีหน้าสมัครยาว ไม่มีอีเมล

## 1.3 สกิลออกแบบการ์ด / ภาพ (ต้องสร้างในรีโป)
สร้างโฟลเดอร์สกิลในรีโปแล้วทำตาม:

`docs/skills/card-art/SKILL.md`
- การ์ดต้องเป็น **React component + SVG/HTML** ไม่ใช้รูป AI ทั้งใบเป็นหลัก
- ภาพอวัยวะ (ปอด ตับ ไทรอยด์ กระดูก สมอง) ใช้ SVG ลายเส้นสไตล์ต้นฉบับ: แบน, โทนพาสเทล, เส้นมน, ไม่สมจริงเกิน
- สีแบรนด์ล็อกนี้ ห้ามเปลี่ยนเพี้ยน:

```
RP Blue:        #2F6FED  header #1E4FD7  body #E8F1FF  border #7AA7FF
MECH Gold:      #E6A100  header #D49200  body #FFF6D9  border #F2C14E
CASE Red:       #E23B4A  header #C81E33  body #FFE8EA  border #F08A93
CLUE Green:     #1FA971  header #0E8A58  body #E5F8EF  border #7DD3A8
Table felt:     #0B3B36
Table felt deep:#072824
Wood rail:      #6B3E2E
Spotlight:      radial-gradient cream 5% opacity
Card back RP:   navy + trefoil watermark
Card radius:    18px
Card shadow:    0 10px 24px rgba(0,0,0,.28)
Aspect card:    63mm x 88mm  →  CSS aspect-[63/88]
```

`docs/skills/game-feel/SKILL.md`
- 60fps, ห้ามกระตุกตอน sync
- ไพ่อื่นในมือคนอื่นหงายหลัง
- มือตัวเองพัดเป็น arc ด้านล่างจอ
- คลิกไพ่ = ยกขึ้น 16px + เงา
- ยืนยันเล่น = ไพ่บินเข้าโซนกลาง 420ms cubic-bezier
- ผิด = สั่น 300ms + ขอบแดง
- ถูก = ขอบทอง + particle + เสียงชิง
- เทิร์นตัวเองมีวงแหวนเวลาที่ขอบจอ

`docs/skills/classroom-ux/SKILL.md`
- อาจารย์สร้างห้องได้ใน 2 คลิก
- นักเรียนเข้าด้วยรหัส 6 ตัว หรือสแกน QR
- โหมดฉายโปรเจกเตอร์ (spectator / board-only) สำหรับหน้าห้องเรียน
- ตัวหนังสือเคสอ่านออกจากระยะ 2 เมตรบนเดสก์ท็อป

ถ้าสภาพแวดล้อมของคุณมีสกิล UI แนว “Claude UI/UX” / shadcn / frontend-design ให้ติดตั้งและใช้เป็นฐานคอมโพเนนต์ แต่ **ธีมต้องเป็นคาสิโนห้องเรียนวิทยาศาสตร์** ไม่ใช่แดชบอร์ด SaaS ขาว ๆ

แพ็กเกจ UI ที่อนุญาต:
- shadcn/ui เฉพาะ input, dialog, toast, dropdown
- ไม่ใช้การ์ด shadcn เป็นตัวไพ่เกม

---

# 2) กติกาเกม Mode 1 ที่ต้องทำเป๊ะ

ชื่อโหมดในเกม: **Localization Match**

## 2.1 ชิ้นส่วนบนโต๊ะ
1. กอง **Radiopharmaceutical (น้ำเงิน)** — สำรับของเล่น
2. กอง **Mechanism (เหลือง)** — วางกลางโต๊ะหงายได้บางใบ / หรือเลือกจากแถบกลไกกลาง
3. กอง **Clinical Case (แดง)** — เปิดทีละ 1 ใบเป็นโจทย์
4. กอง **Target / Clue (เขียว)** — คำใบ้ที่ซื้อได้หรือสุ่มเปิดเมื่อหมดเวลาครึ่งหนึ่ง
5. มือผู้เล่นละ 5 ใบ (เฉพาะการ์ดน้ำเงิน RP)
6. โซนเล่นของแต่ละคน (play slot)
7. แผงคะแนน + รอบ + เวลา

## 2.2 ลำดับเล่นใน 1 รอบ (turn / question)
Host กดเริ่มแมตช์:
1. สับกองทุกสำรับ (seed จาก roomId + matchId)
2. แจก RP ให้ผู้เล่นคนละ 5 ใบ (แอนิเมชัน deal รอบโต๊ะ)
3. เปิด Case Card 1 ใบกลางโต๊ะ
   - 🟢 BASIC = โจทย์ตรง ๆ ชื่อการตรวจ / อวัยวะชัด → **2 คะแนน**
   - 🔴 CLINICAL = สถานการณ์ต้องวิเคราะห์ → **4 คะแนน**
4. เริ่มนาฬิกาคิด (ค่าเริ่ม 45 วินาที ตั้งในล็อบบี้ได้ 20/30/45/60)
5. ผู้เล่นเลือก RP จากมือตัวเอง 1 ใบ วางลงโซนตัวเอง (ยังไม่เผยต่อคนอื่นจนกด lock หรือหมดเวลา)
6. จากนั้นเลือก Mechanism จากแถบกลไกกลาง (ทุกคนเห็นกลไกชุดเดียวกันที่หงายไว้ 8–12 ใบ)
7. กด **LOCK คำตอบ** — หลัง lock แก้ไม่ได้
8. เมื่อทุกคน lock หรือหมดเวลา ระบบพลิกเฉลย
   - ถูกทั้งสาร + กลไก = ได้คะแนนตามระดับโจทย์
   - ถูกอย่างเดียว / ผิด / ไม่ทัน = **0**
9. แสดงเฉลยบนเคส: คำตอบหลัก + คำตอบรองที่ยอมรับได้ (acceptedAnswers[]) + เหตุผลสั้น 2–3 บรรทัด
10. ถ้าตั้งค่า hint ไว้: หลังเหลือเวลา 50% เปิด Clue เขียว 1 ใบอัตโนมัติ (ไม่บังคับใช้)
11. จบ 1 ข้อ → เปิดเคสใบใหม่
12. **ทุกครบ 1 เซตย่อย (เช่น ทุก 3 ข้อ)** มีเฟส **แลกการ์ด 1 ใบ**
    - แต่ละคนเลือกไพ่ในมือ 1 ใบส่งให้คนถัดไปตามเข็มนาฬิกา
    - แอนิเมชันไพ่บินไปมือเพื่อน
13. เล่นจนครบจำนวนข้อที่ตั้ง (ค่าเริ่ม 10)
14. สรุปคะแนน รวม + บอร์ดอันดับ
15. ถ้าเสมอที่ 1: โจทย์ Clinical ไทเบรก 1 ข้อ คนถูกได้คะแนนมากกว่าชนะ ถ้ายังเสมอยกโคแชมป์

## 2.3 กติกาเพิ่มที่ทำให้สมูทแบบเกมจริง
- Host เท่านั้นเริ่มเกม / เตะคน / ตั้งรอบ / ตั้งเวลา / สุ่มชุดการ์ด
- 2–6 คนต่อห้อง (1 คนก็เล่นโหมดซ้อมกับบอทได้)
- บอทในโหมดซ้อมสุ่มคำตอบด้วยน้ำหนักตามความยาก ไม่ใช่สุ่มทึบ
- คนเข้าสายระหว่างเกมเป็นผู้ชม จนกว่าจะจบแมตช์
- Disconnect < 20 วินาที เก็บที่นั่งและมือไพ่ไว้
- Server เป็นคนตัดสินคำตอบเท่านั้น ห้ามเชื่อ client
- ห้ามส่งไพ่ในมือคนอื่นผ่าน websocket
- Anti-spam: คล็อกคำตอบซ้ำไม่นับ

## 2.4 ร้านไอเทมหน้าโฮม (ต้องมี เฟสหลังเกมหลักเสร็จ)
คะแนนสะสมตลอดชีพแปลงเป็น **NucCoin**
อัตรา: 1 แต้มในแมตช์ = 3 NucCoin
ไอเทมตัวอย่าง (cosmetic เท่านั้น ไม่ซื้อคำตอบ):
- กรอบการ์ด: Graphite / Gold Foil / Reactor Glow
- หลังการ์ด: Classic Navy / Hot Cell / PET Ring
- อวาตาร์: ไทรอยด์, ปอด, กระดูก, FDG molecule
- เอฟเฟกต์ชนะ: confetti ปกติ / รังสีแกมมา
- ฉายา: “Capillary Blockader”, “FDG Hunter”

เก็บ inventory ในตาราง `user_items`, equipped ใน `users`

---

# 3) หน้าจอทั้งหมดที่ต้องมี

ออกแบบให้เป็น **เกม** ไม่ใช่เว็บมหาลัย

## 3.1 `/` Boot → Title Splash → Home Hub
ลำดับบังคับ: Loading ฉากเต็มจอ → หน้าปกเกมปุ่ม PLAY → overlay รหัส นศ. → ฮับในฉากเดียวกัน
อ้างอิงภาพ: `docs/refs/splash-reference.jpg` สำหรับจังหวะปกเกม
อ้างอิงภาพ: `docs/refs/card-prototype.jpg` สำหรับไพ่ที่ลอยในฉาก

องค์ประกอบฮับหลังล็อกอิน (ยังอยู่ในโลกเกม ไม่ใช่แดชบอร์ด):
- โลโก้ NucMed Arena แบบตัว 3D
- ปุ่มใหญ่: **PLAY / สร้างห้อง** / **เข้าห้อง**
- การ์ดตัวอย่าง 4 สีลอยรอบมาสคอต
- แผงโปรไฟล์ไม้: ชื่อ, รหัส นศ., XP bar, NucCoin, อันดับสัปดาห์
- ปุ่มร้านไอเทมเป็นป้ายร้านในฉาก
- How to play เป็นแผ่นการ์ดพลิก 4 สี
- Leaderboard สัปดาห์นี้ (filter ตาม prefix รหัสได้)

## 3.2 `/shop`
กริดไอเทม ราคา ทดลองสวม แล้วบันทึก

## 3.3 `/lobby/[code]`
คล้ายล็อบบี้ Among Us / Uno:
- รหัสห้องตัวใหญ่ + ปุ่มคัดลอก + QR
- ที่นั่ง 6 ช่องรอบโต๊ะ
- Host ตั้งค่า: จำนวนข้อ, เวลาต่อข้อ, เปิด hint, เปิดบอท, สัดส่วน Basic:Clinical (เช่น 6:4)
- พร้อม / ไม่พร้อม
- แชทสั้นหรืออิโมจิอย่างเดียว (👍 🔥 ❓)
- กดเริ่มเมื่อพร้อมอย่างน้อย 2 คน (หรือ 1+บอท)

## 3.4 `/play/[code]` หน้าเล่น — สำคัญสุด
เลย์เอาต์เดสก์ท็อป:
```
[ top bar: รอบ 3/10 | โหมด CLINICAL 4pts | timer ring | scores ]
[ opponents as card-backs around table felt ]
[ center: Case card big + mechanism row + clue slot ]
[ bottom: my fan of 5 RP cards + lock button ]
```

เลย์เอาต์มือถือ:
- แนวนอนแนะนำ
- เคสย่อได้
- มือไพ่เลื่อนซ้ายขวา

จอใครจอมัน:
- มือตัวเองเห็นหน้า
- คนอื่นเห็นแค่จำนวนใบ + หลังไพ่
- ตอน reveal ค่อยพลิกไพ่ที่เล่นของทุกคนพร้อมกัน

โหมดโปรเจกเตอร์ `/board/[code]`:
- ไม่มีมือไพ่
- โชว์เคสใหญ่ กลไก เฉลย คะแนน
- ไว้ขึ้นจอหน้าชั้น

## 3.5 `/result/[matchId]`
โพเดียม 3 อันดับ, ตารางถูก/ผิดรายข้อ, ปุ่มรีแมตช์, ปุ่มกลับโฮม, NucCoin ที่ได้

## 3.6 `/admin` (รหัส นศ. ที่อยู่ใน allowlist env `TEACHER_IDS`)
- แก้การ์ด
- ดูห้องที่กำลังเล่น
- export คะแนน CSV
- เปิด/ปิดการ์ดบางใบในสำรับคอร์สนี้

---

# 4) โมเดลข้อมูล

## 4.1 Card schema (Zod + DB)

```ts
type CardType = "RP" | "MECH" | "CASE" | "CLUE";

interface CardBase {
  id: string;            // R-01, M-03, C-05, T-03
  type: CardType;
  titleTh: string;
  titleEn: string;
  subtitle?: string;
  body: string[];        // bullet
  illustration: string;  // svg key
  tags: string[];
}

interface RadiopharmaceuticalCard extends CardBase {
  type: "RP";
  nuclide: string;       // 18F, 99mTc, 123I, 111In
  modality: "PET" | "SPECT" | "BOTH";
  target: string;
  transporter?: string;
  mechanismId: string;   // primary
  altMechanismIds?: string[];
  application: string;
}

interface MechanismCard extends CardBase {
  type: "MECH";
  physicsNote?: string;
}

interface CaseCard extends CardBase {
  type: "CASE";
  difficulty: "BASIC" | "CLINICAL";
  promptTh: string;
  organHint?: string;
  acceptedRpIds: string[];
  acceptedMechIds: string[];
  explanationTh: string;
  points: 2 | 4;
}

interface ClueCard extends CardBase {
  type: "CLUE";
  clueKind: "TARGET" | "WHY" | "TRAIT";
  reveals: string;
}
```

## 4.2 ตาราง DB
- users (student_id unique, display_name, coins, xp, equipped_json)
- user_items
- rooms (code, host_id, status: lobby|playing|ended, settings_json)
- matches
- match_players
- match_rounds (case_id, clue_id, started_at, revealed_at)
- match_answers (player_id, rp_id, mech_id, correct, points, locked_at)
- cards (json content + enabled)
- shop_items

Room runtime state อยู่ใน Socket room memory รูปนี้:

```ts
interface RuntimeState {
  phase: "deal" | "think" | "locked" | "reveal" | "swap" | "result";
  roundIndex: number;
  caseCardId: string;
  clueCardId?: string;
  sharedMechanisms: string[]; // face-up in center
  players: {
    id: string;
    hand: string[];          // server only
    selectedRp?: string;
    selectedMech?: string;
    locked: boolean;
    score: number;
  }[];
  endsAt: number; // epoch ms
}
```

Client ของแต่ละคนได้ hand ของตัวเองเท่านั้น

---

# 5) สำรับตั้งต้นที่ต้องใส่ใน seed (ทำครบ ห้ามมีแค่ตัวอย่าง 4 ใบ)

ต้องมีอย่างน้อย:
- RP 24 ใบ
- MECH 12 ใบ
- CASE 20 ใบ (10 BASIC + 10 CLINICAL)
- CLUE 16 ใบ

ด้านล่างคือชุดบังคับจากต้นฉบับ + ส่วนขยายมาตรฐานวิชานิวเคลียร์ ตรวจความถูกต้องทางการแพทย์ก่อนใส่ explanation

## 5.1 Mechanism สำรับ (เหลือง)
M-01 Active Transport
M-02 Facilitated Diffusion / Metabolic Trapping
M-03 Capillary Blockade
M-04 Phagocytosis
M-05 Simple / Exchange Diffusion
M-06 Chemisorption / Physicochemical Adsorption
M-07 Receptor Binding
M-08 Cellular Migration
M-09 Cell Sequestration
M-10 Compartmental Localization
M-11 Ion Exchange
M-12 Secretion / Tubular Secretion

เนื้อ M-03 ตามต้นฉบับ:
- อนุภาคขนาดใหญ่กว่าเส้นผ่านศูนย์กลางหลอดเลือดฝอย (~10 μm)
- physical trapping / microembolization
- ค้างที่ปอด pre-capillary arteriole และ capillary
- Particle size 10–50 μm

เนื้อ M-05:
- ไม่ใช้พลังงาน ATP
- ตามความต่างความเข้มข้น
- เช่น ⁹⁹ᵐTc-DTPA

เนื้อ M-08:
- เม็ดเลือดขาวเคลื่อนที่
- เช่น ¹¹¹In-leukocyte

## 5.2 Radiopharmaceutical สำรับ (น้ำเงิน) อย่างน้อย
R-01 ¹⁸F-FDG — PET — Cell metabolic activity — GLUT — Facilitated Diffusion / Metabolic Trapping — Tumor imaging
R-02 ¹²³I-NaI — SPECT — Thyroid — Na+/I- symporter — Active Transport — Thyroid imaging
R-03 ⁹⁹ᵐTc-pertechnetate — SPECT — Thyroid / salivary / Meckel — NIS — Active Transport
R-04 ¹³¹I-NaI — therapy/scan — Thyroid — NIS — Active Transport
R-05 ⁹⁹ᵐTc-MDP — SPECT — Bone (hydroxyapatite) — Chemisorption — Bone scan
R-06 ¹⁸F-NaF — PET — Bone hydroxyapatite — Chemisorption / Ion Exchange — Bone scan
R-07 ⁹⁹ᵐTc-MAA — SPECT — Lung capillary — Capillary Blockade — Lung perfusion
R-08 ⁹⁹ᵐTc-DTPA aerosol — SPECT — Alveoli — Sedimentation / compartment — Lung ventilation
R-09 ⁹⁹ᵐTc-sulfur colloid — SPECT — Liver/spleen RES — Phagocytosis — Liver/spleen
R-10 ⁹⁹ᵐTc-mebrofenin / HIDA — SPECT — Hepatocyte — Active transport / secretion — HIDA scan
R-11 ¹⁸F-NaF (ถ้าซ้ำกับ R-06 ให้รวมแล้วเพิ่ม ⁹⁹ᵐTc-HDP)
R-12 ⁹⁹ᵐTc-DMSA — SPECT — Renal cortex — Binding / proximal tubule — Cortical scan
R-13 ⁹⁹ᵐTc-MAG3 — SPECT — Renal tubule — Tubular secretion — Renogram
R-14 ⁹⁹ᵐTc-DTPA IV — SPECT — GFR — Glomerular filtration / simple diffusion
R-15 ¹¹¹In-pentetreotide — SPECT — NET — SSTR — Receptor Binding
R-16 ⁶⁸Ga-DOTATATE — PET — NET — SSTR — Receptor Binding
R-17 ⁹⁹ᵐTc-sestamibi — SPECT — Myocardium / parathyroid — Passive diffusion + mitochondrial binding
R-18 ²⁰¹Tl-chloride — SPECT — Myocardium — Na/K ATPase Active Transport
R-19 ⁹⁹ᵐTc-HMPAO / exametazime — SPECT — Brain perfusion — Lipophilic diffusion + trapping
R-20 ⁹⁹ᵐTc-ECD — SPECT — Brain perfusion — Lipophilic diffusion + enzymatic trapping
R-21 ¹¹¹In-WBC / ⁹⁹ᵐTc-HMPAO-WBC — Cellular Migration — Infection
R-22 Heat-damaged ⁹⁹ᵐTc-RBC — Cell Sequestration — Spleen
R-23 ⁹⁹ᵐTc-RBC (intact) — Compartmental Localization — GI bleed / MUGA
R-24 ¹²³I-MIBG — SPECT — Adrenal / NET — Active uptake (NET transporter)

เลย์เอาต์หน้าการ์ด RP ต้องเหมือนต้นฉบับ:
- มุมซ้ายบน รหัส R-xx + ไอคอนรังสี
- มุมขวาบน ป้าย PET/SPECT แคปซูล
- ชื่อสารใหญ่มี superscript นิวไคลด์ถูกต้อง
- ชื่อเต็มในวงเล็บ
- ซ้ายสูตร/ไอคอนโมเลกุล ขวาไอคอนอวัยวะ
- แถว Target / Transporter / Mechanism / Application
- แถบล่างคำว่า Radiopharmaceutical

ใช้ HTML/CSS ตามนี้ ห้ามทำเป็นการ์ดข้อความล้วน

## 5.3 Case สำรับ (แดง) ตัวอย่างบังคับ
BASIC (2 แต้ม) ตัวอย่าง:
- C-B01 Bone scan สำหรับประเมินกระดูก — ตอบ ⁹⁹ᵐTc-MDP หรือ ¹⁸F-NaF + Chemisorption
- C-B02 Thyroid imaging — ¹²³I หรือ ⁹⁹ᵐTcO4- + Active Transport
- C-B03 Liver/spleen scan — ⁹⁹ᵐTc-SC + Phagocytosis
- C-B04 Renal cortical scan — ⁹⁹ᵐTc-DMSA
- C-B05 Myocardial perfusion — sestamibi / tetrofosmin / ²⁰¹Tl
- … ครบ 10

CLINICAL (4 แต้ม) จากต้นฉบับต้องมี:
C-05 ผู้ป่วยสงสัย Pulmonary Embolism ต้องการประเมินการกระจายของเลือดในปอด (Lung Perfusion Scan)
- ตอบ R-07 ⁹⁹ᵐTc-MAA + M-03 Capillary Blockade

C-02 ผู้ป่วยมีอาการปวดหลัง และสงสัยการแพร่กระจายของมะเร็งไปยังกระดูก ควรเลือกสารใด?
- ⁹⁹ᵐTc-MDP / ¹⁸F-NaF + Chemisorption

C-07 ผู้ป่วยมีภาวะตับแข็งเรื้อรัง ต้องการประเมินการทำงานของตับและม้าม
- ⁹⁹ᵐTc-SC + Phagocytosis

C-11 ผู้ป่วยมีเนื้องอกระบบประสาท (neuroendocrine tumor) ต้องการตรวจวินิจฉัย ใช้สารและกลไกใด?
- ¹¹¹In-pentetreotide หรือ ⁶⁸Ga-DOTATATE + Receptor Binding

เติม CLINICAL อีกให้ครบ 10 เช่น GI bleed, Meckel, parathyroid adenoma, fever of unknown origin, brain death / perfusion, renal obstruction ฯลฯ

## 5.4 Clue สำรับ (เขียว) จากต้นฉบับ
T-03 Target: Thyroid
- อวัยวะ: ต่อมไทรอยด์
- ลักษณะเฉพาะ: มีการจับไอโอไดด์
- ความเกี่ยวข้อง: Na+/I- symporter
- Hint: สารใดบ้างที่เข้าสู่เซลล์ไทรอยด์ผ่าน Na+/I- symporter?

T-06 Target: Liver & Spleen — RES — ⁹⁹ᵐTc-SC
T-09 Target: Bone — bone remodeling — ⁹⁹ᵐTc-MDP
T-12 Why? ทำไม ¹⁸F-FDG จึงสะสมในเซลล์?
เติม Target อวัยวะอื่นและใบ้กลไกให้ครบ 16

ทุกเคสต้อง map ไป acceptedRpIds + acceptedMechIds ให้ครูแก้ใน admin ได้

---

# 6) ดีไซน์การ์ดให้เหมือนต้นฉบับเป๊ะ — สเปกคอมโพเนนต์

สร้าง `components/cards/`

- `CardFrame.tsx` (รับ variant สี)
- `RpCard.tsx`
- `MechCard.tsx`
- `CaseCard.tsx`
- `ClueCard.tsx`
- `CardBack.tsx`
- `illustrations/` SVG แยกไฟล์ต่ออวัยวะ

รายละเอียดวิชวลที่ต้องมี:
- มุมบนซ้ายรหัสการ์ดในแคปซูลสีเข้ม
- ไอคอนหมวด (รังสี / เฟือง / คลิปบอร์ด / เป้า)
- header โค้งสีทึบ ชื่อการ์ดขาว
- แผ่น illustration พื้นขาวมน
- typography: ชื่อสารใช้ font ที่รองรับ superscript เช่น `"Source Serif 4"` + `"IBM Plex Sans Thai"`
- นิวไคลด์ต้องเรนเดอร์เป็น ⁹⁹ᵐTc ไม่ใช่ 99mTc ถ้าอยู่บนการ์ด
- ป้าย PET สีม่วงอ่อน, SPECT สีฟ้าเทา
- ไพ่มีด้านหลังลายรัศมี + โลโก้ เมื่อยังไม่เปิด
- ขนาดบนโต๊ะกลางใหญ่กว่าไพ่ในมือ 1.35 เท่า
- hover บนเดสก์ท็อปมีเลนส์ขยายการ์ด (เหมือน Board Game Arena)

อย่าใช้รูปถ่ายอวัยวะจริง ใช้ลายเส้นแบนแบบต้นฉบับเท่านั้น

---

# 7) สถาปัตยกรรมเทคนิค

```
apps/web                Next.js UI
apps/server             Node + Socket.IO + game engine
packages/shared         types, card seed, rule engine, zod
```

หรือ monolith Next + custom server ใน `server.ts` ก็ได้ถ้า deploy ง่ายกว่า แต่แยก game engine เป็นไฟล์บริสุทธิ์ทดสอบได้

Deploy ที่รองรับ:
- Frontend: Vercel
- Socket server: Railway / Render / Fly.io
- DB: Supabase

ENV:
```
DATABASE_URL
JWT_SECRET
TEACHER_IDS
NEXT_PUBLIC_SOCKET_URL
GOOGLE_SHEETS_ID   (optional)
GOOGLE_SERVICE_ACCOUNT_JSON (optional)
```

Real-time events:
```
room:join room:leave room:state
game:start game:deal game:case
game:selectRp game:selectMech game:lock
game:reveal game:swap
game:next game:end
chat:emoji
```

Rule engine `packages/shared/engine.ts` ฟังก์ชันบริสุทธิ์:
- shuffle(seed)
- deal(deck, nPlayers, handSize=5)
- grade(answer, caseCard) => {correct, points}
- nextPhase(state, event)

เขียนเทสอย่างน้อย:
- PE case + MAA + Capillary Blockade = 4
- PE case + FDG + anything = 0
- BASIC bone + MDP + Chemisorption = 2
- lock หลังหมดเวลาไม่ได้นับ
- swap ส่งใบเดียวตามเข็มนาฬิกา

---

# 8) แผนงานแบ่งเฟส — ทำทีละเฟส commit + push

## PHASE 0 — Bootstrap + หน้าโหลด/หน้าปกเกม
- สร้างโมโนรีโป / รีโปเดียว
- Next.js + Tailwind + shadcn จำกัด + Framer Motion
- คัดลอก `docs/refs/card-prototype.jpg` และ `docs/refs/splash-reference.jpg` เข้าไปในรีโป
- README ภาษาไทยวิธีรัน
- ทำหน้า `/` ให้มี Loading แล้วตัดไป Title Splash ตามข้อ 0.6 ก่อนทำหน้าอื่น
- ปุ่ม PLAY เปิดโมดัลรหัส นศ.
- CI lint
- push ขึ้น GitHub ที่ผู้ใช้ให้มา
เกณฑ์ผ่าน: เปิดเว็บแล้วรู้สึกเป็นปกเกม ไม่ใช่เว็บโปรเจกต์นักศึกษา และมีรูปอ้างอิงอยู่ในรีโป

## PHASE 1 — Card system เหมือนต้นฉบับ
- component การ์ด 4 สีครบ
- seed การ์ดขั้นต่ำตามข้อ 5
- หน้า `/gallery` พลิกดูการ์ดทั้งหมดเหมือนอัลบั้ม
- SVG อวัยวะอย่างน้อย ไทรอยด์ ปอด กระดูก ตับ ม้าม สมอง NET
เกณฑ์ผ่าน: วางการ์ด R-01, M-03, C-05, T-03 เทียบต้นฉบับแล้วคนดูรู้ว่าเป็นชุดเดียวกัน

## PHASE 2 — Auth รหัส นศ. + โปรไฟล์ + ร้านเปล่า
- login ช่องเดียว
- cookie session
- หน้าโฮมมีเหรียญ/XP
เกณฑ์ผ่าน: ใส่รหัสแล้วรีเฟรชแล้วยังอยู่ในระบบ

## PHASE 3 — ห้อง + ล็อบบี้เรียลไทม์
- สร้างห้องได้รหัส 6 ตัว อ่านง่าย ไม่มี 0/O/1/I
- เข้าห้อง, host kick, พร้อม, QR
- presence ใครออนไลน์
เกณฑ์ผ่าน: เปิด 2 แท็บ คนละรหัส นศ. เห็นกันสด

## PHASE 4 — เกมเอนจิน Mode 1 ครบกติกา
- จั่ว 5 ใบ, เปิดเคส, เลือกสาร, เลือกกลไก, lock, เปิดเฉลย, คะแนน 2/4, สับเปลี่ยนไพ่, ครบรอบ, ไทเบรก
- จอใครจอมัน
- โหมดบอร์ดโปรเจกเตอร์
เกณฑ์ผ่าน: เล่น 10 ข้อ 2 คน จบแล้วคะแนนถูกต้องตามกติกาตัวอย่าง PE = 4

## PHASE 5 — Game feel
- เสียง, แอนิเมชัน deal/fly/flip, นาฬิกา, confetti, haptic บนมือถือถ้ามี
- มือไพ่โค้ง, เลนส์ขยาย, สถานะเทิร์นชัด
เกณฑ์ผ่าน: เล่นแล้วไม่รู้สึกเป็นฟอร์มเว็บ

## PHASE 6 — ร้านไอเทม + leaderboard + admin + CSV
- ซื้อกรอบ/หลังการ์ด/อวาตาร์
- อาจารย์ export คะแนน
เกณฑ์ผ่าน: เล่นจบแล้วเหรียญเพิ่ม ซื้อกรอบได้ เห็นในเกมรอบถัดไป

## PHASE 7 — เนื้อหาเต็ม + ชีทครู (ออปชัน) + ปรับมือถือ + ขึ้นโปรดักชัน
- การ์ดครบจำนวน
- optional sync Google Sheet
- หน้า how-to
- env ตัวอย่าง
- deploy script
เกณฑ์ผ่าน: เพื่อนเข้าจากมือถือด้วยรหัสห้องแล้วเล่นได้จริง

อย่าข้ามไปเฟส 4 ถ้าเฟส 1 การ์ดยังไม่สวย
ทุกเฟสต้องมี screenshot ใน PR/commit message

---

# 9) รายละเอียด UX ที่ห้ามลืม

- ปุ่ม LOCK ใหญ่สีทอง อยู่กลางล่าง
- ตอนเลือก RP ไพ่ที่เลือกมีแหวนขาว
- กลไกที่เลือกมีแสงเหลือง
- เคส BASIC มีป้ายเขียว 2 PTS, CLINICAL ป้ายแดง 4 PTS
- Timer เป็นวงแหวนรอบไอคอนนาฬิกา ไม่ใช่ตัวเลขลอยอย่างเดียว
- 10 วินาทีสุดท้ายตัวเลขสั่น + เสียงติ๊ก
- หลัง reveal มีป้าย ✓ สารถูกต้อง / ✓ กลไกถูกต้อง แยกจากกัน
- คนที่ยังไม่ lock มีจุดสถานะกระพริบบนอวาตาร์
- ห้าม modal รก ใช้ toast + banner บนโต๊ะ
- รองรับคีย์ลัดเดสก์ท็อป: 1-5 เลือกไพ่, Enter lock
- Accessibility: contrast การ์ดผ่าน, ชื่อสารอ่านด้วย screen reader

โทนภาพรวม:
- โต๊ะผ้าเขียวเข้มห้องไพ่
- ขอบโต๊ะไม้
- ไฟสปอตลงกลางเคส
- UI chrome ทองแดง + น้ำเงินรังสี
- ไม่ใช้พื้นขาวเต็มจอตอนเล่น

---

# 10) สิ่งที่ห้ามทำ

- ห้ามทำหน้าแรกเป็นเว็บขาวมีฟอร์มล็อกอินอย่างเดียว ต้องมีจอโหลดและจอสแปลชแบบเกม
- ห้ามก๊อปตัวละคร โลโก้ หรือชื่อเกมจากรูปอ้างอิงพิซซ่า/ไฟล์ไทป์
- ห้ามทำเว็บควิซตัวเลือกสี่เหลี่ยมธรรมดาแล้วเรียกว่าเกมไพ่
- ห้ามให้ client เป็นคนคิดคะแนน
- ห้ามโชว์มือคนอื่นก่อน reveal
- ห้ามล็อกอินอีเมล/รหัสผ่านเป็นทางหลัก
- ห้ามใช้ Google Sheet เป็น source of truth ของห้องที่กำลังเล่น
- ห้ามสร้างการ์ดด้วยรูป AI ทั้งใบที่ข้อความเพี้ยน/นิวไคลด์ผิด
- ห้ามละเว้น superscript นิวไคลด์บนการ์ด
- ห้ามเก็บรหัส นศ. เป็น plain text ใน localStorage อย่างเดียวโดยไม่มี cookie เซสชัน
- ห้ามเขียนกติกาคนละอย่างจากตัวอย่าง Pulmonary Embolism → ⁹⁹ᵐTc-MAA → Capillary Blockade = 4

---

# 11) ข้อความเริ่มงานที่คุณต้องทำทันทีเมื่อได้พรอมต์นี้

1. สร้างโครงสร้างโปรเจกต์ตามเฟส 0
2. สร้าง `packages/shared/cards/seed.ts` พร้อมการ์ดต้นฉบับ 4 ใบแรกให้เหมือนภาพเป๊ะก่อน
3. สร้างหน้า `/gallery` โชว์ 4 ใบนั้นคู่กัน
4. รอลิงก์ GitHub จากผู้ใช้ แล้ว push
5. เมื่อจบแต่ละเฟส พิมพ์สรุปว่าทำอะไร ไฟล์ไหน และวิธีเทส

ถ้าข้อมูลการ์ดบางใบทางการแพทย์คลุมเครือ ให้ใส่ `acceptedRpIds` หลายตัวและเขียน explanation ว่าทำไม ไม่ใช่เดายึดคำตอบเดียวผิดหลัก

เริ่ม PHASE 0 ทันที
---

---

# 12) ล็อกศิลปะและมาสคอต — ห้ามเปลี่ยนชุดกลางคัน

ชุดมาสคอตหลักชื่อ **ทีม Hot Cell** ใช้ชุดนี้ทั้งหน้าโหลด หน้าปก ล็อบบี้ ร้าน

1. **นิว** — นักศึกษาชาย ผมดำสั้น เสื้อกาวน์ทับเสื้อยืดน้ำเงิน ถือการ์ด R-01
2. **เมด** — นักศึกษาหญิงผมยาว มัดสูง หมวกเชฟห้ามใช้ ใช้หมวกแก๊ปแล็บขาว ถือการ์ด C-05
3. **แกมม่า** — สุนัขแล็บสีขาวเทา มีปลอกคอรูป trefoil นั่งข้างปุ่ม PLAY

สไตล์ตัวละคร: สัดส่วนหัวใหญ่เล็กน้อย เส้นชัด เงาแบน 2 ชั้น ไม่สมจริง ไม่ chibi เกินไป ไม่ voxel ก้อนมายคราฟต์ทั้งตัว ถ้าฉากพื้นหลังจะเป็นบล็อกอ่อนได้เฉพาะอาคารและต้นไม้ ไม่ใช่ตัวคน

โทนฉากหน้าปก:
- ฟ้า #7EC8E3
- หญ้า/ลาน #3F8F6B
- อาคารแล็บครีม #F3E6C8 หลังคาอิฐ #C15B4A
- ป้ายไม้ #8B5A2B
- ปุ่ม PLAY #2EAD4B ขอบ #166534 ตัวอักษรขาว
- แสงบ่าย ไม่มืด ไม่นีออน

---

# 13) ต้นไม้ไฟล์บังคับ ห้ามสลับชื่อ

```
nucmed-arena/
  README.md
  package.json
  pnpm-workspace.yaml
  .env.example
  docs/
    refs/card-prototype.jpg
    refs/splash-reference.jpg
    skills/card-art/SKILL.md
    skills/game-feel/SKILL.md
    skills/classroom-ux/SKILL.md
  apps/web/
    src/app/page.tsx                  # boot + splash + hub
    src/app/gallery/page.tsx
    src/app/lobby/[code]/page.tsx
    src/app/play/[code]/page.tsx
    src/app/board/[code]/page.tsx
    src/app/result/[matchId]/page.tsx
    src/app/shop/page.tsx
    src/app/admin/page.tsx
    src/components/cards/CardFrame.tsx
    src/components/cards/RpCard.tsx
    src/components/cards/MechCard.tsx
    src/components/cards/CaseCard.tsx
    src/components/cards/ClueCard.tsx
    src/components/cards/CardBack.tsx
    src/components/cards/illustrations/*.tsx
    src/components/splash/BootScreen.tsx
    src/components/splash/TitleSplash.tsx
    src/components/table/GameTable.tsx
    src/components/table/HandFan.tsx
    src/components/table/TimerRing.tsx
    src/lib/socket.ts
    src/lib/auth.ts
  apps/server/
    src/index.ts
    src/rooms.ts
    src/socket-handlers.ts
  packages/shared/
    src/types.ts
    src/engine.ts
    src/cards/seed.ts
    src/cards/rp.ts
    src/cards/mech.ts
    src/cards/cases.ts
    src/cards/clues.ts
    src/grading.ts
    src/shop.ts
```

เกณฑ์: ถ้าไฟล์ในลิสต์นี้ยังไม่มี ห้ามขึ้นเฟสถัดไป

---

# 14) Design tokens ล็อก

```css
:root {
  --rp: #2F6FED; --rp-head: #1E4FD7; --rp-body: #E8F1FF; --rp-line: #7AA7FF;
  --mech: #E6A100; --mech-head: #D49200; --mech-body: #FFF6D9; --mech-line: #F2C14E;
  --case: #E23B4A; --case-head: #C81E33; --case-body: #FFE8EA; --case-line: #F08A93;
  --clue: #1FA971; --clue-head: #0E8A58; --clue-body: #E5F8EF; --clue-line: #7DD3A8;
  --felt: #0B3B36; --felt-deep: #072824; --wood: #6B3E2E;
  --play: #2EAD4B; --gold: #D4A017; --navy: #0B1F2A;
  --card-radius: 18px;
  --card-aspect: 63 / 88;
  --shadow-card: 0 10px 24px rgba(0,0,0,.28);
}
```

ฟอนต์:
- ไทย UI: IBM Plex Sans Thai
- ชื่อสาร: Source Serif 4
- ปุ่มเกม: Prompt
- ห้ามใช้ Inter ทั้งแอป

จอเล่นเดสก์ท็อป 1440×900 เป็นมาสเตอร์
- ท็อปบาร์สูง 64px
- โซนคู่แข่งสูง 160px
- โซนกลางเคส 380×240px
- แถบกลไกสูง 150px
- มือไพ่ล่างสูง 220px พัดมุม -18° ถึง +18°
- ปุ่ม LOCK กว้าง 220px สูง 48px กลางล่างเหนือมือไพ่ 8px

มือถือแนวตั้ง: แนะนำหมุนแนวนอนด้วยแบนเนอร์ แต่ถ้าไม่หมุน ให้เคสย่อเหลือ 42% ความสูง จอ มือไพ่เลื่อนแนวนอน

---

# 15) State machine ของแมตช์ ห้ามข้ามสถานะ

```
LOBBY
  host:start -> DEAL
DEAL
  หลังแอนิเมชันแจก 900ms*จำนวนคน -> SHOW_CASE
SHOW_CASE
  เปิดเคส 700ms -> THINK
THINK
  timer running
  player:selectRp / selectMech / lock
  ถ้าทุกคน lock หรือ timer=0 -> REVEAL
REVEAL
  พลิกไพ่ทุกคน 800ms แสดงถูก/ผิด คะแนน
  3.5 วินาที -> (ถ้าถึงรอบแลกไพ่) SWAP มิฉะนั้น NEXT_CASE
SWAP
  แต่ละคนเลือก 1 ใบ 15 วินาที แล้วส่งตามเข็มนาฬิกา -> NEXT_CASE
NEXT_CASE
  ถ้า roundIndex == totalRounds -> RESULT
  ถ้าเสมอกันที่ 1 และยังไม่ไทเบรก -> TIEBREAK
  ไม่ใช่ -> SHOW_CASE
TIEBREAK
  เปิดเคส Clinical 1 ใบ กลับเข้า THINK
RESULT
  persist แมตช์ + เหรียญ
```

ค่าเริ่มต้นห้อง:
```
{
  totalRounds: 10,
  thinkSeconds: 45,
  basicCount: 6,
  clinicalCount: 4,
  hintAtPercent: 50,
  swapEvery: 3,
  maxPlayers: 6,
  minPlayersToStart: 2,
  allowBots: true
}
```

---

# 16) Socket events และ payload ล็อกชื่อนี้

Client → Server
```ts
{ event: "auth", payload: { token: string } }
{ event: "room:create", payload: { settings?: Partial<Settings> } }
{ event: "room:join", payload: { code: string } }
{ event: "room:leave", payload: {} }
{ event: "room:kick", payload: { userId: string } } // host only
{ event: "room:ready", payload: { ready: boolean } }
{ event: "room:settings", payload: Settings } // host only
{ event: "game:start", payload: {} }
{ event: "game:selectRp", payload: { cardId: string } }
{ event: "game:selectMech", payload: { cardId: string } }
{ event: "game:lock", payload: {} }
{ event: "game:swapPick", payload: { cardId: string } }
{ event: "chat:emoji", payload: { emoji: "👍"|"🔥"|"❓"|"😂" } }
```

Server → Client
```ts
{ event: "room:state", payload: PublicRoomState }
{ event: "game:private", payload: { hand: string[] } } // เฉพาะเจ้าของ
{ event: "game:error", payload: { code: string, messageTh: string } }
{ event: "game:tick", payload: { endsAt: number, now: number } }
```

PublicRoomState ที่ส่งให้ทุกคน ห้ามมี hand คนอื่น:
```ts
{
  code: "7K3Q2P",
  phase: "THINK",
  roundIndex: 2,
  totalRounds: 10,
  caseCardId: "C-05",
  clueCardId: null,
  sharedMechanisms: ["M-01","M-03","M-05","M-06","M-07","M-08"],
  endsAt: 1730000000000,
  players: [
    { id: "u1", name: "ภูมิ", ready: true, locked: false, score: 6, handCount: 5, selected: false }
  ]
}
```

หลัง lock ของตัวเอง client ส่งได้แค่สถานะตัวเอง เซิร์ฟเวอร์ไม่บรอดคาสต์ cardId จนกว่า REVEAL

รหัสห้อง: 6 ตัวจากชุด `ABCDEFGHJKMNPQRSTUVWXYZ23456789` ไม่มี 0 O 1 I L

---

# 17) REST ที่ต้องมี

```
POST /api/auth/student          { studentId, displayName? } → Set-Cookie
POST /api/auth/logout
GET  /api/me
GET  /api/leaderboard?prefix=
GET  /api/shop
POST /api/shop/buy              { itemId }
POST /api/shop/equip            { itemId }
GET  /api/admin/cards           teacher only
PUT  /api/admin/cards/:id
GET  /api/admin/export.csv
GET  /api/health
```

studentId: `^[A-Za-z0-9]{6,16}$` เก็บเป็น uppercase

JWT cookie ชื่อ `na_session` HttpOnly Secure SameSite=Lax อายุ 7 วัน

---

# 18) สำรับเต็ม — วางใน packages/shared/src/cards/

กลไกใช้ id ตามนี้เท่านั้นเวลาเกรด

## 18.1 Mechanisms
M-01 Active Transport
M-02 Facilitated Diffusion / Metabolic Trapping
M-03 Capillary Blockade
M-04 Phagocytosis
M-05 Simple / Exchange Diffusion
M-06 Chemisorption
M-07 Receptor Binding
M-08 Cellular Migration
M-09 Cell Sequestration
M-10 Compartmental Localization
M-11 Ion Exchange
M-12 Tubular Secretion

M-03 เนื้อตามต้นฉบับ:
- อนุภาคใหญ่กว่าเส้นผ่านศูนย์กลางหลอดเลือดฝอย (~10 μm)
- physical trapping หรือ microembolization
- ค้างที่ปอด pre-capillary arteriole และ capillary
- Particle size 10–50 μm

M-05:
- ไม่ใช้ ATP
- ตามความต่างความเข้มข้น
- เช่น ⁹⁹ᵐTc-DTPA

M-08:
- เม็ดเลือดขาวเคลื่อนที่
- เช่น ¹¹¹In-leukocyte

## 18.2 Radiopharmaceuticals 24 ใบ

R-01 ¹⁸F-FDG | PET | Cell metabolic activity | GLUT | M-02 | Tumor imaging whole body PET/CT
R-02 ¹²³I-NaI | SPECT | Thyroid | NIS | M-01 | Thyroid imaging
R-03 ⁹⁹ᵐTc-pertechnetate | SPECT | Thyroid/salivary/Meckel | NIS | M-01 | Thyroid / Meckel
R-04 ¹³¹I-NaI | SPECT/therapy | Thyroid | NIS | M-01 | Uptake/therapy
R-05 ⁹⁹ᵐTc-MDP | SPECT | Bone hydroxyapatite | — | M-06 | Bone scan
R-06 ⁹⁹ᵐTc-HDP | SPECT | Bone hydroxyapatite | — | M-06 | Bone scan
R-07 ⁹⁹ᵐTc-MAA | SPECT | Lung capillary | — | M-03 | Lung perfusion
R-08 ⁹⁹ᵐTc-DTPA aerosol | SPECT | Bronchioles/alveoli | — | M-10 | Lung ventilation
R-09 ⁹⁹ᵐTc-sulfur colloid | SPECT | Liver spleen RES | — | M-04 | Liver/spleen
R-10 ⁹⁹ᵐTc-mebrofenin | SPECT | Hepatocyte | OATP/MRP2 | M-01 | HIDA
R-11 ¹⁸F-NaF | PET | Bone hydroxyapatite | — | M-06, alt M-11 | Bone scan
R-12 ⁹⁹ᵐTc-DMSA | SPECT | Renal cortex | — | M-06 | Cortical scan
R-13 ⁹⁹ᵐTc-MAG3 | SPECT | Renal tubule | — | M-12 | Renogram
R-14 ⁹⁹ᵐTc-DTPA IV | SPECT | GFR | — | M-05 | Renogram/GFR
R-15 ¹¹¹In-pentetreotide | SPECT | NET | SSTR | M-07 | Tumor imaging
R-16 ⁶⁸Ga-DOTATATE | PET | NET | SSTR | M-07 | NET PET
R-17 ⁹⁹ᵐTc-sestamibi | SPECT | Myocardium/parathyroid | — | M-05 | MPI / parathyroid
R-18 ²⁰¹Tl-chloride | SPECT | Myocardium | Na/K ATPase | M-01 | MPI
R-19 ⁹⁹ᵐTc-HMPAO | SPECT | Brain perfusion | — | M-05 | Brain perfusion
R-20 ⁹⁹ᵐTc-ECD | SPECT | Brain perfusion | — | M-05 | Brain perfusion
R-21 ¹¹¹In-WBC | SPECT | Infection | — | M-08 | Infection
R-22 Heat-damaged ⁹⁹ᵐTc-RBC | SPECT | Spleen | — | M-09 | Spleen
R-23 ⁹⁹ᵐTc-RBC intact | SPECT | Blood pool | — | M-10 | GI bleed / MUGA
R-24 ¹²³I-MIBG | SPECT | Adrenal/NET | NET transporter | M-01 | Pheo/NET

## 18.3 Cases 20 ใบ ต้องเกรดตามตารางนี้เท่านั้น

BASIC 2 แต้ม
C-B01 Bone scan ประเมินกระดูกทั่วตัว → RP R-05,R-06,R-11 / MECH M-06,M-11
C-B02 Thyroid imaging ต่อมไทรอยด์ → R-02,R-03 / M-01
C-B03 Liver-spleen scan → R-09 / M-04
C-B04 Renal cortical scan หา scar → R-12 / M-06
C-B05 Myocardial perfusion → R-17,R-18 / M-05,M-01
C-B06 Lung perfusion scan ชื่อการตรวจตรง ๆ → R-07 / M-03
C-B07 Hepatobiliary scan (HIDA) → R-10 / M-01
C-B08 Brain perfusion SPECT → R-19,R-20 / M-05
C-B09 Infection scan ด้วยเม็ดเลือดขาว → R-21 / M-08
C-B10 NET scan ด้วย somatostatin analog → R-15,R-16 / M-07

CLINICAL 4 แต้ม
C-05 ผู้ป่วยสงสัย Pulmonary Embolism ต้องการประเมินการกระจายเลือดในปอด (Lung Perfusion Scan) → R-07 / M-03
C-02 ผู้ป่วยปวดหลัง สงสัยมะเร็งแพร่ไปกระดูก ควรเลือกสารใด? → R-05,R-06,R-11 / M-06,M-11
C-07 ผู้ป่วยตับแข็งเรื้อรัง ต้องการประเมินการทำงานตับและม้าม → R-09 / M-04
C-11 ผู้ป่วยเนื้องอกระบบประสาท (neuroendocrine tumor) ต้องการตรวจวินิจฉัย ใช้สารและกลไกใด? → R-15,R-16 / M-07
C-C05 ถ่ายอุจจาระเป็นเลือด สงสัย GI bleeding ต้องการหาจุดเลือดออก → R-23 / M-10
C-C06 เด็กมีเลือดออกในอุจจาระ สงสัย Meckel diverticulum → R-03 / M-01
C-C07 PTH สูง หินปูนสูง สงสัย parathyroid adenoma → R-17 / M-05
C-C08 ไข้ไม่ทราบสาเหตุ สงสัย abscess ซ่อน → R-21 / M-08
C-C09 ไตบวมน้ำ สงสัยทางเดินปัสสาวะอุดกั้น ทำ renogram → R-13,R-14 / M-12,M-05
C-C10 สงสัย pheochromocytoma ต้องการถ่ายภาพต่อมหมวกไตส่วนใน → R-24 / M-01

คำอธิบาย C-05 ที่ต้องโชว์หลังเฉลย:
"อนุภาค MAA ขนาด 10–50 μm ติดค้างที่หลอดเลือดฝอยปอดด้วยกลไก Capillary Blockade จึงใช้ดู perfusion เพื่อช่วยวินิจฉัย PE"

## 18.4 Clues 16 ใบ
T-03 Target Thyroid — NIS — hint สารใดเข้าเซลล์ไทรอยด์ผ่าน Na+/I- symporter
T-06 Target Liver & Spleen — RES — ⁹⁹ᵐTc-SC
T-09 Target Bone — remodeling — ⁹⁹ᵐTc-MDP
T-12 Why ทำไม ¹⁸F-FDG จึงสะสมในเซลล์ — GLUT + hexokinase trap
T-01 Target Lung capillary — particle 10–50 μm
T-02 Target Renal cortex
T-04 Target Myocardium
T-05 Target NET / SSTR
T-07 Target Hepatocyte / biliary
T-08 Target Blood pool
T-10 Target Spleen sequestration
T-11 Why ทำไม MAA ไม่ไปสมองหลังฉีดหลอดเลือดดำ
T-13 Why ทำไม sulfur colloid ไปตับม้าม
T-14 Why ทำไม MDP ไปกระดูก
T-15 Trait RES phagocytosis
T-16 Trait receptor SSTR2

ตอน THINK ถ้า hintAtPercent ถึง 50 และ settings.hint=true ให้สุ่มเปิดใบที่ tag ตรงอวัยวะของเคส ไม่เปิดเฉลยตรง ๆ

---

# 19) ฟังก์ชันเกรด ล็อกนี้

```ts
function grade(rpId: string | null, mechId: string | null, caseCard: CaseCard) {
  if (!rpId || !mechId) return { correct: false, points: 0, rpOk: false, mechOk: false };
  const rpOk = caseCard.acceptedRpIds.includes(rpId);
  const mechOk = caseCard.acceptedMechIds.includes(mechId);
  const correct = rpOk && mechOk;
  return { correct, points: correct ? caseCard.points : 0, rpOk, mechOk };
}
```

ห้ามให้คะแนนครึ่งข้อ

---

# 20) ข้อความ UI ภาษาไทย ล็อกประโยคหลัก

Boot tips สุ่ม:
- กำลังอุ่นเครื่อง generator ⁹⁹ᵐTc...
- กำลังสับการ์ด Capillary Blockade...
- กำลังตั้งวงแหวน PET...
- กำลังตรวจคุณภาพ MAA 10–50 μm...

Splash:
- โลโก้ NucMed Arena
- จับคู่สาร · จับคู่กลไก · รอบโต๊ะไพ่
- LEARN • MATCH • PLAY • NUCLEAR MEDICINE
- ปุ่ม PLAY
- พัฒนาสำหรับรายวิชานิวเคลียร์เมดิซีน

โมดัลล็อกอิน:
- ใส่รหัสนักศึกษา
- ไม่ต้องตั้งรหัสผ่าน
- ปุ่ม เข้าเล่น

ล็อบบี้:
- รหัสห้อง
- คัดลอก / โชว์ QR
- จำนวนข้อ / วินาทีต่อข้อ / เปิดคำใบ้
- พร้อมแล้ว
- เริ่มเกม (host)

โต๊ะ:
- รอบ x/y
- BASIC 2 แต้ม / CLINICAL 4 แต้ม
- เลือกสารจากมือ
- เลือกกลไกกลางโต๊ะ
- ล็อกคำตอบ
- รอผู้เล่นอื่น...
- ถูกทั้งคู่ +2 หรือ +4
- ผิด 0

ผล:
- กระดานคะแนน
- ได้ NucCoin
- เล่นอีกครั้ง
- กลับโฮม

---

# 21) ร้านไอเทมตั้งต้น

อัตรา 1 แต้มในแมตช์ = 3 NucCoin

| id | ชื่อ | ราคา | ชนิด |
|---|---|---|---|
| frame_graphite | กรอบ Graphite | 0 (default) | frame |
| frame_gold | กรอบ Gold Foil | 60 | frame |
| frame_reactor | กรอบ Reactor Glow | 90 | frame |
| back_navy | หลังไพ่ Classic Navy | 0 | cardback |
| back_hotcell | หลังไพ่ Hot Cell | 45 | cardback |
| back_pet | หลังไพ่ PET Ring | 75 | cardback |
| av_thyroid | อวาตาร์ไทรอยด์ | 30 | avatar |
| av_lung | อวาตาร์ปอด | 30 | avatar |
| av_bone | อวาตาร์กระดูก | 30 | avatar |
| av_fdg | อวาตาร์โมเลกุล FDG | 50 | avatar |
| fx_confetti | เอฟเฟกต์ชนะธรรมดา | 0 | fx |
| fx_gamma | เอฟเฟกต์รังสีแกมมา | 80 | fx |
| title_blockader | ฉายา Capillary Blockader | 40 | title |
| title_fdg | ฉายา FDG Hunter | 40 | title |

ห้ามขายคำใบ้หรือคำตอบ

---

# 22) บอทโหมดซ้อม

ชื่อบอท: บอท-เรซิน, บอท-คอลลอยด์, บอท-เจนเนอเรเตอร์
ความถูกต้องตามระดับ:
- BASIC: 70% ถูกทั้งคู่, 20% ถูกสารผิดกลไก, 10% มั่ว
- CLINICAL: 45% ถูกทั้งคู่, 30% ถูกสารผิดกลไก, 25% มั่ว
ล็อกเมื่อเหลือเวลาสุ่ม 8–20 วินาที
ห้ามบอทเห็นเฉลยผ่านทางลัด ต้องสุ่มจากน้ำหนักของ accepted set

---

# 23) เทสที่ต้องมีก่อนปิดเฟส 4

```
grade(C-05, R-07, M-03) == 4
grade(C-05, R-01, M-03) == 0
grade(C-05, R-07, M-02) == 0
grade(C-B06, R-07, M-03) == 2
grade(C-02, R-05, M-06) == 4
grade(C-02, R-11, M-11) == 4
lock after endsAt rejected
hand of player B never appears in A's room:state
swap clockwise A->B->C->A one card
room code never contains 0 O 1 I L
student first login creates user coins=0
```

---

# 24) .env.example

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nucmed
JWT_SECRET=change_me
TEACHER_IDS=651234567,TEACHER01
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
SOCKET_PORT=3001
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_JSON=
```

---

# 25) Definition of Done ทั้งโปรเจกต์

ต้องจริงทุกข้อ:
- เปิดโดเมนแล้วเห็นจอโหลดและปุ่ม PLAY ใน 4 วินาที
- การ์ด 4 ใบต้นฉบับเทียบรูปแล้วคนนอกบอกรู้ว่าชุดเดียวกัน
- สองเครื่องเล่นด้วยรหัสห้องเดียวกัน จบ 10 ข้อ คะแนนตรงตารางเกรด
- มือคนอื่นไม่รั่วใน devtools network ก่อน reveal
- ซื้อกรอบแล้วขึ้นในแมตช์ถัดไป
- อาจารย์โหลด CSV ได้
- README รันได้ในเครื่องใหม่ด้วยคำสั่งไม่เกิน 5 บรรทัด

---

# 26) คำสั่งเริ่มงานรอบละเอียดนี้

อย่าเริ่มมั่วทั้งแอป
ทำตามลำดับไฟล์:
1. packages/shared/src/types.ts
2. packages/shared/src/cards/* seed ตามข้อ 18
3. packages/shared/src/grading.ts + เทสข้อ 23
4. apps/web splash ตามข้อ 0.6 และ 12
5. การ์ดคอมโพเนนต์เทียบ docs/refs/card-prototype.jpg
6. server socket ตามข้อ 16
7. หน้าเล่นตาม tokens ข้อ 14
8. ร้านตามข้อ 21

เมื่อจบแต่ละข้อพิมพ์รายชื่อไฟล์ที่แตะและผลเทส

เริ่มข้อ 1 ทันที
