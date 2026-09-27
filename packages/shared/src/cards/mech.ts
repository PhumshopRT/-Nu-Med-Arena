import { MechanismCard } from "../types";

export const MECHANISM_DECK: MechanismCard[] = [
  {
    id: "M-01",
    type: "MECH",
    titleTh: "การลำเลียงแบบใช้พลังงาน",
    titleEn: "Active Transport",
    subtitle: "Cellular Energy Dependent",
    body: [
      "ใช้พลังงานจากเซลล์ (ATP) ในการลำเลียงสารต้าน gradient",
      "ผ่านโปรตีนขนส่งเฉพาะ เช่น Na⁺/I⁻ symporter (NIS), Na⁺/K⁺ ATPase",
      "เช่น การจับไอโอไดด์ของต่อมไทรอยด์ และการสะสมในกล้ามเนื้อหัวใจ"
    ],
    illustration: "active_transport",
    tags: ["transport", "atp", "thyroid", "heart"]
  },
  {
    id: "M-02",
    type: "MECH",
    titleTh: "การแพร่แบบฟาซิลิเทต / เมแทบอลิกแทรปปิง",
    titleEn: "Facilitated Diffusion / Metabolic Trapping",
    subtitle: "Glucose Transporter & Phosphorylation",
    body: [
      "เข้าสู่เซลล์ผ่านตัวพาโปรตีน GLUT โดยไม่ต้องใช้ ATP โดยตรง",
      "เกิดปฏิกิริยาฟอสโฟรีเลชันโดยเอนไซม์ Hexokinase กลายเป็น FDG-6-P",
      "ไม่สามารถผ่านกระบวนการ Glycolysis ต่อได้ จึงถูกกักขัง (trapped) ภายในเซลล์"
    ],
    illustration: "cell",
    tags: ["glucose", "glut", "pet", "tumor"]
  },
  {
    id: "M-03",
    type: "MECH",
    titleTh: "การอุดกั้นหลอดเลือดฝอย",
    titleEn: "Capillary Blockade",
    subtitle: "Physical Trapping / Microembolization",
    body: [
      "อนุภาคมีขนาดใหญ่กว่าเส้นผ่านศูนย์กลางของหลอดเลือดฝอย (≈ 10 μm)",
      "เกิดการอุดกั้นทางกายภาพ (physical trapping) ชั่วคราว",
      "มักพบในปอด (pre-capillary arteriole และ capillary) เช่น ⁹⁹ᵐTc-MAA"
    ],
    illustration: "capillary",
    tags: ["lung", "perfusion", "particle"]
  },
  {
    id: "M-04",
    type: "MECH",
    titleTh: "การกลืนกินของเซลล์",
    titleEn: "Phagocytosis",
    subtitle: "Reticuloendothelial System (RES)",
    body: [
      "เซลล์เม็ดเลือดขาวและ Kupffer cells กลืนกินอนุภาคคอลลอยด์",
      "อนุภาคขนาด 0.1–1.0 μm ถูกจับโดยระบบ RES",
      "สะสมมากที่สุดที่ตับ (80-85%), ม้าม (10%), และไขกระดูก เช่น ⁹⁹ᵐTc-Sulfur Colloid"
    ],
    illustration: "liver_spleen",
    tags: ["liver", "spleen", "res", "colloid"]
  },
  {
    id: "M-05",
    type: "MECH",
    titleTh: "การแพร่แบบธรรมดา / การแลกเปลี่ยน",
    titleEn: "Simple / Exchange Diffusion",
    subtitle: "Passive Concentration Gradient",
    body: [
      "ไม่ใช้พลังงาน (ATP) เคลื่อนที่ตามความต่างความเข้มข้น",
      "ผ่านช่องเยื่อหุ้มเซลล์ หรือช่องว่างระหว่างเซลล์ endothelium",
      "เช่น ⁹⁹ᵐTc-DTPA ในการวัดอัตราการกรองของไต (GFR) และประเมิน Blood-Brain Barrier"
    ],
    illustration: "diffusion",
    tags: ["passive", "gfr", "kidney"]
  },
  {
    id: "M-06",
    type: "MECH",
    titleTh: "การดูดซับทางเคมี",
    titleEn: "Chemisorption / Physicochemical Adsorption",
    subtitle: "Hydroxyapatite Crystal Binding",
    body: [
      "สารประกอบฟอสเฟตสร้างพันธะเคมีบนผลึกไฮดรอกซีอะพาไทต์ของกระดูก",
      "สะสมบริเวณที่มีการสร้างและซ่อมแซมกระดูกสูง (osteoblastic activity)",
      "เช่น ⁹⁹ᵐTc-MDP และ ⁹⁹ᵐTc-HDP ในการตรวจ Bone Scan"
    ],
    illustration: "bone",
    tags: ["bone", "hydroxyapatite", "mdp"]
  },
  {
    id: "M-07",
    type: "MECH",
    titleTh: "การจับกับตัวรับจำเพาะ",
    titleEn: "Receptor Binding",
    subtitle: "High Affinity Peptide-Receptor Interaction",
    body: [
      "โมเลกุลเปปไทด์หรือลิแกนด์จับจำเพาะกับตัวรับบนผิวเซลล์ (Receptor)",
      "เช่น Somatostatin Receptor (SSTR) บนผิวเซลล์ Neuroendocrine Tumor (NET)",
      "เช่น ¹¹¹In-pentetreotide (Octreoscan) และ ⁶⁸Ga-DOTATATE"
    ],
    illustration: "receptor",
    tags: ["receptor", "net", "sstr", "peptide"]
  },
  {
    id: "M-08",
    type: "MECH",
    titleTh: "การเคลื่อนที่ของเซลล์",
    titleEn: "Cellular Migration",
    subtitle: "Chemotaxis & Leukocyte Homing",
    body: [
      "เม็ดเลือดขาวที่ถูกติดฉลากรังสีเคลื่อนที่ไปยังตำแหน่งที่มีการอักเสบหรือติดเชื้อ",
      "ตามสัญญาณเคมี (Chemotactic factors) ในร่างกาย",
      "เช่น ¹¹¹In-oxine labeled leukocytes (WBC) ในการหาฝีหนองและการติดเชื้อ"
    ],
    illustration: "migration",
    tags: ["wbc", "infection", "inflammation"]
  },
  {
    id: "M-09",
    type: "MECH",
    titleTh: "การกักเก็บและทำลายเซลล์",
    titleEn: "Cell Sequestration",
    subtitle: "Splenic Filtration of Damaged RBCs",
    body: [
      "เม็ดเลือดแดงที่ถูกทำให้เสียหายด้วยความร้อน (Heat-damaged RBC) ถูกม้ามกรองและดักจับ",
      "ใช้ระบุตำแหน่งของเนื้อม้ามปกติและม้ามเสริม (Accessory spleen)",
      "เช่น Heat-damaged ⁹⁹ᵐTc-RBC"
    ],
    illustration: "spleen",
    tags: ["spleen", "rbc", "sequestration"]
  },
  {
    id: "M-10",
    type: "MECH",
    titleTh: "การกักกันในช่องว่างทางกายวิภาค",
    titleEn: "Compartmental Localization",
    subtitle: "Anatomical Space Trapping",
    body: [
      "สารคงอยู่ในช่องว่างหรือระบบหลอดเลือดปิดตามกายวิภาค",
      "เช่น การตรวจเลือดออกในทางเดินอาหาร (GI bleeding) หรือการทำงานของหัวใจ (MUGA)",
      "เช่น ⁹⁹ᵐTc-labeled RBC หรือแก๊ส ⁹⁹ᵐTc-DTPA aerosol ในถุงลมปอด"
    ],
    illustration: "compartment",
    tags: ["blood_pool", "muga", "gi_bleed"]
  },
  {
    id: "M-11",
    type: "MECH",
    titleTh: "การแลกเปลี่ยนไอออน",
    titleEn: "Ion Exchange",
    subtitle: "Fluoride-Hydroxyl Substitution",
    body: [
      "ไอออนฟลูออไรด์ (¹⁸F⁻) แลกเปลี่ยนตำแหน่งกับไอออนไฮดรอกซิล (OH⁻) ในผลึกกระดูก",
      "เปลี่ยนเป็นฟลูออโรอะพาไทต์ (Fluorapatite)",
      "ให้ภาพความคมชัดสูงมากในระดับ PET Scan เช่น ¹⁸F-NaF"
    ],
    illustration: "bone",
    tags: ["bone", "pet", "fluoride"]
  },
  {
    id: "M-12",
    type: "MECH",
    titleTh: "การหลั่งผ่านท่อไต",
    titleEn: "Tubular Secretion",
    subtitle: "Renal Tubular Transport",
    body: [
      "สารเภสัชรังสีถูกขับออกจากเลือดเข้าสู่ท่อไตส่วนต้น (Proximal tubule) โดยตรง",
      "มีอัตราการขจัดสูง สะท้อน Effective Renal Plasma Flow (ERPF)",
      "เช่น ⁹⁹ᵐTc-MAG3 ในการประเมินการทำงานและการอุดกั้นของระบบทางเดินปัสสาวะ"
    ],
    illustration: "kidney",
    tags: ["kidney", "renal", "mag3"]
  }
];
