# Skill: Card Art & Design Specifications

## ภาพรวม
การ์ดทุกใบในเกม NucMed Arena ต้องเป็น React component + SVG/HTML เท่านั้น ไม่ใช้รูป AI ทั้งใบ เพื่อให้ข้อความ สัญลักษณ์เคมี และนิวไคลด์ถูกต้องแม่นยำ 100%

## โทนสีและ Design Tokens
- **RP Blue (Radiopharmaceutical)**:
  - Base: `#2F6FED`
  - Header: `#1E4FD7`
  - Body: `#E8F1FF`
  - Border: `#7AA7FF`
- **MECH Gold (Mechanism)**:
  - Base: `#E6A100`
  - Header: `#D49200`
  - Body: `#FFF6D9`
  - Border: `#F2C14E`
- **CASE Red (Clinical Case)**:
  - Base: `#E23B4A`
  - Header: `#C81E33`
  - Body: `#FFE8EA`
  - Border: `#F08A93`
- **CLUE Green (Target / Clue)**:
  - Base: `#1FA971`
  - Header: `#0E8A58`
  - Body: `#E5F8EF`
  - Border: `#7DD3A8`

## กฎสัดส่วนและฟอนต์
- Aspect Ratio: `63mm x 88mm` (สัดส่วนโป๊กเกอร์ standard `63 / 88`)
- Border Radius: `18px`
- Drop Shadow: `0 10px 24px rgba(0, 0, 0, 0.28)`
- Typography:
  - Thai UI: `IBM Plex Sans Thai`
  - Chemical & Radionuclides: `Source Serif 4` (รองรับ superscript ชัดเจน เช่น ¹⁸F, ⁹⁹ᵐTc, ¹²³I, ¹¹¹In)
  - Game buttons / badges: `Prompt`
