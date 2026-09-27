import { ClueCard } from "../types";

export const CLUE_DECK: ClueCard[] = [
  {
    id: "T-01",
    type: "CLUE",
    clueKind: "TARGET",
    titleTh: "เป้าหมาย: หลอดเลือดฝอยปอด",
    titleEn: "Target: Lung Capillaries",
    subtitle: "Pulmonary Microcirculation",
    body: [
      "อวัยวะ: หลอดเลือดฝอยปอด (Pulmonary capillaries)",
      "ขนาดของช่องหลอดเลือดฝอยเฉลี่ยประมาณ 7–10 μm",
      "มีเส้นเลือดแรกที่รับเลือดดำจากหัวใจห้องขวา"
    ],
    reveals: "สารที่มีขนาดอนุภาค 10–50 μm จะติดค้างในอวัยวะนี้เป็นจุดแรก",
    illustration: "lung",
    tags: ["lung", "capillary"]
  },
  {
    id: "T-02",
    type: "CLUE",
    clueKind: "TARGET",
    titleTh: "เป้าหมาย: เนื้อเยื่อไตส่วนนอก",
    titleEn: "Target: Renal Cortex",
    subtitle: "Proximal Tubules",
    body: [
      "อวัยวะ: เนื้อไตส่วนนอก (Cortex)",
      "บริเวณที่มีท่อไตส่วนต้น (Proximal convoluted tubules) หนาแน่น",
      "ใช้ดูแผลเป็น (Scar) จากการติดเชื้อกรวยไตซ้ำซาก"
    ],
    reveals: "สารที่มีการจับยึดในเนื้อไต เช่น ⁹⁹ᵐTc-DMSA",
    illustration: "kidney",
    tags: ["kidney", "cortex"]
  },
  {
    id: "T-03",
    type: "CLUE",
    clueKind: "TARGET",
    titleTh: "เป้าหมาย: ต่อมไทรอยด์",
    titleEn: "Target: Thyroid Gland",
    subtitle: "Thyroid Follicular Cells",
    body: [
      "อวัยวะ: ต่อมไทรอยด์รูปผีเสื้อบริเวณคอ",
      "ลักษณะเฉพาะ: มีการจับและสะสมไอโอไดด์เพื่อสร้างไทรอยด์ฮอร์โมน",
      "ความเกี่ยวข้อง: โปรตีนขนส่ง Na⁺/I⁻ symporter (NIS)"
    ],
    reveals: "สารใดบ้างที่เข้าสู่เซลล์ไทรอยด์ผ่าน Na⁺/I⁻ symporter?",
    illustration: "thyroid",
    tags: ["thyroid", "nis"]
  },
  {
    id: "T-04",
    type: "CLUE",
    clueKind: "TARGET",
    titleTh: "เป้าหมาย: กล้ามเนื้อหัวใจ",
    titleEn: "Target: Myocardium",
    subtitle: "Left Ventricular Wall",
    body: [
      "อวัยวะ: ผนังกล้ามเนื้อหัวใจห้องล่างซ้าย",
      "ลักษณะเฉพาะ: มีไมโทคอนเดรียหนาแน่น และต้องการพลังงาน ATP สูง",
      "ต้องการเลือดมาเลี้ยงผ่านหลอดเลือดโคโรนารี"
    ],
    reveals: "สารที่สะสมในไมโทคอนเดรียหรือผ่านปั๊ม Na⁺/K⁺ ATPase",
    illustration: "cell",
    tags: ["heart", "myocardium"]
  },
  {
    id: "T-05",
    type: "CLUE",
    clueKind: "TARGET",
    titleTh: "เป้าหมาย: ตัวรับเนื้องอก NET",
    titleEn: "Target: NET SSTR Receptors",
    subtitle: "Somatostatin Receptors",
    body: [
      "เป้าหมาย: ตัวรับ Somatostatin receptor บนผิวเซลล์เนื้องอก",
      "พบมากใน Neuroendocrine tumors (Carcinoid, Islet cell tumor)",
      "จับจำเพาะกับสายเปปไทด์ Octreotide / DOTATATE"
    ],
    reveals: "สารกลุ่ม Somatostatin analog เช่น ¹¹¹In-pentetreotide หรือ ⁶⁸Ga-DOTATATE",
    illustration: "receptor",
    tags: ["net", "sstr"]
  },
  {
    id: "T-06",
    type: "CLUE",
    clueKind: "TARGET",
    titleTh: "เป้าหมาย: ตับและม้าม",
    titleEn: "Target: Liver & Spleen",
    subtitle: "Reticuloendothelial System",
    body: [
      "อวัยวะ: ตับและม้าม",
      "ลักษณะเฉพาะ: มีเซลล์แมโครฟาจ (Kupffer cells) ในระบบ RES",
      "ความเกี่ยวข้อง: คอลลอยด์อนุภาคขนาดเล็ก 0.1–1.0 μm"
    ],
    reveals: "สารแขวนลอยคอลลอยด์ เช่น ⁹⁹ᵐTc-sulfur colloid",
    illustration: "liver_spleen",
    tags: ["liver", "spleen", "res"]
  },
  {
    id: "T-07",
    type: "CLUE",
    clueKind: "TARGET",
    titleTh: "เป้าหมาย: เซลล์ตับและทางเดินน้ำดี",
    titleEn: "Target: Hepatobiliary System",
    subtitle: "Hepatocytes & Gallbladder",
    body: [
      "อวัยวะ: เซลล์ตับและถุงน้ำดี",
      "กลไกการขับสารคล้ายคลึงกับบิลิรูบิน (Bilirubin clearance)",
      "ใช้ประเมินภาวะถุงน้ำดีอักเสบเฉียบพลัน (Acute cholecystitis)"
    ],
    reveals: "สารอนุพันธ์ IDA เช่น ⁹⁹ᵐTc-mebrofenin (HIDA)",
    illustration: "liver_spleen",
    tags: ["liver", "hida"]
  },
  {
    id: "T-08",
    type: "CLUE",
    clueKind: "TARGET",
    titleTh: "เป้าหมาย: แอ่งเลือดในหลอดเลือด",
    titleEn: "Target: Intravascular Blood Pool",
    subtitle: "Circulating Blood Volume",
    body: [
      "เป้าหมาย: ระบบไหลเวียนโลหิตปิด",
      "ไม่ควรมีการซึมรั่วออกจากหลอดเลือดในภาวะปกติ",
      "หากพบการสะสมนอกหลอดเลือด บ่งบอกถึงภาวะเลือดออก (Active bleeding)"
    ],
    reveals: "เม็ดเลือดแดงติดฉลากรังสี เช่น ⁹⁹ᵐTc-labeled RBC",
    illustration: "compartment",
    tags: ["blood_pool", "rbc"]
  },
  {
    id: "T-09",
    type: "CLUE",
    clueKind: "TARGET",
    titleTh: "เป้าหมาย: กระดูก",
    titleEn: "Target: Bone Remodeling",
    subtitle: "Osteoblastic Activity",
    body: [
      "อวัยวะ: โครงสร้างกระดูกทั่วร่างกาย",
      "ลักษณะเฉพาะ: ผลึกไฮดรอกซีอะพาไทต์และแคลเซียมฟอสเฟต",
      "มีการสะสมสูงในจุดที่มีการซ่อมแซมหรือมะเร็งกระดูก"
    ],
    reveals: "สารประกอบไดฟอสโฟเนต เช่น ⁹⁹ᵐTc-MDP หรือ ¹⁸F-NaF",
    illustration: "bone",
    tags: ["bone", "mdp"]
  },
  {
    id: "T-10",
    type: "CLUE",
    clueKind: "TARGET",
    titleTh: "เป้าหมาย: การกรองของม้าม",
    titleEn: "Target: Spleen Sequestration",
    subtitle: "Red Pulp Filtration",
    body: [
      "อวัยวะ: เนื้อม้ามส่วน Red pulp",
      "หน้าที่: ตรวจสอบและทำลายเม็ดเลือดแดงที่แก่หรือผิดรูป",
      "ไม่พบการสะสมในอวัยวะอื่นหากเม็ดเลือดแดงเสียรูปสมบูรณ์"
    ],
    reveals: "Heat-damaged ⁹⁹ᵐTc-RBC (เม็ดเลือดแดงอบความร้อน)",
    illustration: "spleen",
    tags: ["spleen", "sequestration"]
  },
  {
    id: "T-11",
    type: "CLUE",
    clueKind: "WHY",
    titleTh: "ทำไม MAA ไม่ไปสมอง?",
    titleEn: "Why MAA Does Not Reach Brain?",
    subtitle: "Venous Route & Capillary Filter",
    body: [
      "ฉีดเข้าหลอดเลือดดำแขน → วิ่งเข้าหัวใจห้องขวา → เข้าสู่หลอดเลือดแดงปอด",
      "อนุภาคขนาด 10–50 μm ติดค้างในหลอดเลือดฝอยปอดที่มีขนาดเพียง 10 μm",
      "หากพบสารไปสมองหรือไต แสดงว่ามี Right-to-Left Shunt ในหัวใจ!"
    ],
    reveals: "กลไก Capillary Blockade ในปอดทำหน้าที่เป็นตัวกรองทางกายภาพ",
    illustration: "capillary",
    tags: ["why", "maa", "lung"]
  },
  {
    id: "T-12",
    type: "CLUE",
    clueKind: "WHY",
    titleTh: "ทำไม ¹⁸F-FDG จึงสะสมในเซลล์?",
    titleEn: "Why ¹⁸F-FDG Is Trapped?",
    subtitle: "Metabolic Trapping",
    body: [
      "FDG เข้าเซลล์ผ่านตัวพา GLUT เหมือนน้ำตาลกลูโคสปกติ",
      "ถูกเติมฟอสเฟตโดยเอนไซม์ Hexokinase กลายเป็น FDG-6-Phosphate",
      "เนื่องจากขาดหมู่ 2'-OH จึงไม่สามารถทำปฏิกิริยาต่อได้และถูกกักขังในเซลล์"
    ],
    reveals: "กระบวนการ Metabolic Trapping ที่เกิดหลัง Facilitated Diffusion",
    illustration: "cell",
    tags: ["why", "fdg", "metabolism"]
  },
  {
    id: "T-13",
    type: "CLUE",
    clueKind: "WHY",
    titleTh: "ทำไม Sulfur Colloid ไปตับและม้าม?",
    titleEn: "Why Sulfur Colloid Targets Liver/Spleen?",
    subtitle: "Foreign Particle Phagocytosis",
    body: [
      "ร่างกายมองอนุภาคคอลลอยด์เป็นสิ่งแปลกปลอมขนาดจิ๋ว",
      "เซลล์ Kupffer ในตับทำหน้าที่เป็นด่านหน้าในการกรองเลือดดำจากทางเดินอาหาร",
      "ม้ามและไขกระดูกร่วมดักจับด้วยกลไกฟาโกไซโทซิส"
    ],
    reveals: "กลไก Phagocytosis ของระบบ Reticuloendothelial System (RES)",
    illustration: "liver_spleen",
    tags: ["why", "colloid", "liver"]
  },
  {
    id: "T-14",
    type: "CLUE",
    clueKind: "WHY",
    titleTh: "ทำไม MDP จึงไปจับที่กระดูก?",
    titleEn: "Why MDP Binds to Bone?",
    subtitle: "Phosphate-Calcium Affinity",
    body: [
      "โครงสร้าง P-C-P ของไดฟอสโฟเนตมีความเสถียร ไม่ถูกย่อยสลายด้วยเอนไซม์",
      "สร้างพันธะเคมีดูดซับกับแคลเซียมบนผิวผลึก Hydroxyapatite",
      "บริเวณที่มี Blood flow สูงและ Osteoblast สร้างกระดูกใหม่จะจับสารได้มากที่สุด"
    ],
    reveals: "กลไก Chemisorption (การดูดซับทางเคมีบนผลึกแร่)",
    illustration: "bone",
    tags: ["why", "mdp", "bone"]
  },
  {
    id: "T-15",
    type: "CLUE",
    clueKind: "TRAIT",
    titleTh: "ลักษณะกลไก: การกลืนกิน (Phagocytosis)",
    titleEn: "Trait: RES Phagocytosis",
    subtitle: "Immune Cell Clearance",
    body: [
      "ขึ้นอยู่กับขนาดอนุภาค: ขนาด 0.1–1.0 μm ไปตับม้าม, เล็กกว่า 0.1 μm ไปไขกระดูก",
      "หากอนุภาคใหญ่เกิน 10 μm จะติดค้างที่ปอดแทน",
      "ไม่เกิดในเนื้อเยื่อที่มีการทำลายของเซลล์ Kupffer (เช่น มะเร็งตับ เกิด Cold defect)"
    ],
    reveals: "เกี่ยวข้องกับอนุภาค ⁹⁹ᵐTc-sulfur colloid และเซลล์ Kupffer",
    illustration: "liver_spleen",
    tags: ["trait", "phagocytosis"]
  },
  {
    id: "T-16",
    type: "CLUE",
    clueKind: "TRAIT",
    titleTh: "ลักษณะกลไก: Receptor SSTR2",
    titleEn: "Trait: SSTR2 Receptor Specificity",
    subtitle: "Peptide-Receptor Agonist",
    body: [
      "Somatostatin Receptor Subtype 2 พบบนผิวเซลล์เนื้องอกต่อมไร้ท่อระบบประสาท",
      "จับกับเปปไทด์ Octreotide / DOTATATE ด้วยความจำเพาะสูงมาก (Nano-molar affinity)",
      "ใช้สำหรับทั้งการวินิจฉัย (Imaging) และการรักษามะเร็งแบบมุ่งเป้า (PRRT)"
    ],
    reveals: "กลไก Receptor Binding ในการตรวจ NET",
    illustration: "receptor",
    tags: ["trait", "sstr2", "net"]
  }
];
