import { 
  ALL_RP_CARDS, 
  ALL_MECH_CARDS, 
  ALL_CASE_CARDS, 
  ALL_CLUE_CARDS,
  RadiopharmaceuticalCard,
  MechanismCard,
  CaseCard,
  ClueCard,
  CardType
} from "@nucmed/shared";

const STORAGE_KEY_RP = "nucmed_deck_rp";
const STORAGE_KEY_MECH = "nucmed_deck_mech";
const STORAGE_KEY_CASE = "nucmed_deck_case";
const STORAGE_KEY_CLUE = "nucmed_deck_clue";

// 1. Get stored decks (initializes with shared seeds if empty)
export function getStoredRpCards(): RadiopharmaceuticalCard[] {
  if (typeof window === "undefined") return [...ALL_RP_CARDS];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RP);
    if (!raw) {
      saveStoredRpCards([...ALL_RP_CARDS]);
      return [...ALL_RP_CARDS];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load RP cards from storage", err);
    return [...ALL_RP_CARDS];
  }
}

export function saveStoredRpCards(cards: RadiopharmaceuticalCard[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_RP, JSON.stringify(cards));
  } catch (err) {
    console.error("Failed to save RP cards", err);
  }
}

export function getStoredMechCards(): MechanismCard[] {
  if (typeof window === "undefined") return [...ALL_MECH_CARDS];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MECH);
    if (!raw) {
      saveStoredMechCards([...ALL_MECH_CARDS]);
      return [...ALL_MECH_CARDS];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load Mech cards from storage", err);
    return [...ALL_MECH_CARDS];
  }
}

export function saveStoredMechCards(cards: MechanismCard[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_MECH, JSON.stringify(cards));
  } catch (err) {
    console.error("Failed to save Mech cards", err);
  }
}

export function getStoredCaseCards(): CaseCard[] {
  if (typeof window === "undefined") return [...ALL_CASE_CARDS];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CASE);
    if (!raw) {
      // Ensure canonical C-05 pairing on first initialization: R-07 + M-03 + T-01
      const initial = [...ALL_CASE_CARDS].map(c => {
        if (c.id === "C-05") {
          return {
            ...c,
            acceptedRpIds: ["R-07"],
            acceptedMechIds: ["M-03"],
            clueId: "T-01"
          };
        }
        return c;
      });
      saveStoredCaseCards(initial);
      return initial;
    }
    const parsed: CaseCard[] = JSON.parse(raw);
    let modified = false;
    parsed.forEach(c => {
      if (c.points === 8) { c.points = 2; modified = true; }
      if (c.points === 16) { c.points = 4; modified = true; }
    });
    // Guarantee C-05 integrity
    const c05 = parsed.find(c => c.id === "C-05");
    if (c05 && (!c05.acceptedRpIds.includes("R-07") || !c05.acceptedMechIds.includes("M-03") || c05.clueId !== "T-01")) {
      c05.acceptedRpIds = ["R-07"];
      c05.acceptedMechIds = ["M-03"];
      c05.clueId = "T-01";
      modified = true;
    }
    if (modified) {
      saveStoredCaseCards(parsed);
    }
    return parsed;
  } catch (err) {
    console.error("Failed to load Case cards from storage", err);
    return [...ALL_CASE_CARDS];
  }
}

export function saveStoredCaseCards(cards: CaseCard[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CASE, JSON.stringify(cards));
  } catch (err) {
    console.error("Failed to save Case cards", err);
  }
}

export function getStoredClueCards(): ClueCard[] {
  if (typeof window === "undefined") return [...ALL_CLUE_CARDS];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLUE);
    if (!raw) {
      saveStoredClueCards([...ALL_CLUE_CARDS]);
      return [...ALL_CLUE_CARDS];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load Clue cards from storage", err);
    return [...ALL_CLUE_CARDS];
  }
}

export function saveStoredClueCards(cards: ClueCard[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CLUE, JSON.stringify(cards));
  } catch (err) {
    console.error("Failed to save Clue cards", err);
  }
}

// 2. Playable Decks for Gameplay (Honors disabled flag & clue existence)
export function getPlayableCaseCards(): CaseCard[] {
  const allCases = getStoredCaseCards();
  const allClues = getStoredClueCards();
  
  // Rule: Disabled cards cannot be dealt; Cases without valid Clue cannot be dealt
  return allCases.filter(c => {
    if (c.disabled) return false;
    if (!c.clueId) return false;
    const clue = allClues.find(cl => cl.id === c.clueId);
    if (!clue || clue.disabled) return false;
    return true;
  });
}

export function getPlayableRpCards(): RadiopharmaceuticalCard[] {
  return getStoredRpCards().filter(c => !c.disabled);
}

export function getPlayableMechCards(): MechanismCard[] {
  return getStoredMechCards().filter(c => !c.disabled);
}

export function getPlayableClueCards(): ClueCard[] {
  return getStoredClueCards().filter(c => !c.disabled);
}

// 3. Card Modification Helpers
export function addRpCard(card: RadiopharmaceuticalCard): { success: boolean; error?: string } {
  const current = getStoredRpCards();
  const cleanId = card.id.trim().toUpperCase();
  if (current.some(c => c.id.toUpperCase() === cleanId)) {
    return { success: false, error: `รหัสการ์ด ${cleanId} มีอยู่ในระบบแล้ว` };
  }
  const updated = [...current, { ...card, id: cleanId, type: "RP" as const }];
  saveStoredRpCards(updated);
  return { success: true };
}

export function addMechCard(card: MechanismCard): { success: boolean; error?: string } {
  const current = getStoredMechCards();
  const cleanId = card.id.trim().toUpperCase();
  if (current.some(c => c.id.toUpperCase() === cleanId)) {
    return { success: false, error: `รหัสการ์ด ${cleanId} มีอยู่ในระบบแล้ว` };
  }
  const updated = [...current, { ...card, id: cleanId, type: "MECH" as const }];
  saveStoredMechCards(updated);
  return { success: true };
}

export function addCaseCard(card: CaseCard): { success: boolean; error?: string } {
  const current = getStoredCaseCards();
  const cleanId = card.id.trim().toUpperCase();
  if (current.some(c => c.id.toUpperCase() === cleanId)) {
    return { success: false, error: `รหัสการ์ด ${cleanId} มีอยู่ในระบบแล้ว` };
  }
  const updated = [...current, { ...card, id: cleanId, type: "CASE" as const }];
  saveStoredCaseCards(updated);
  return { success: true };
}

export function addClueCard(card: ClueCard): { success: boolean; error?: string } {
  const current = getStoredClueCards();
  const cleanId = card.id.trim().toUpperCase();
  if (current.some(c => c.id.toUpperCase() === cleanId)) {
    return { success: false, error: `รหัสการ์ด ${cleanId} มีอยู่ในระบบแล้ว` };
  }

  // Leak check: Clues must NOT contain RP or Mechanism names
  const leak = detectClueLeak(`${card.titleTh} ${card.titleEn} ${card.reveals} ${card.body.join(" ")}`);
  if (leak) {
    return { 
      success: false, 
      error: `ตรวจพบชื่อสารหรือกลไก "${leak}" ในคำใบ้ กรุณาปรับแก้ข้อความก่อนบันทึก` 
    };
  }

  const updated = [...current, { ...card, id: cleanId, type: "CLUE" as const }];
  saveStoredClueCards(updated);
  return { success: true };
}

export function toggleCardDisabled(type: CardType, id: string): boolean {
  if (type === "RP") {
    const list = getStoredRpCards();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) {
      list[idx].disabled = !list[idx].disabled;
      saveStoredRpCards(list);
      return true;
    }
  } else if (type === "MECH") {
    const list = getStoredMechCards();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) {
      list[idx].disabled = !list[idx].disabled;
      saveStoredMechCards(list);
      return true;
    }
  } else if (type === "CASE") {
    const list = getStoredCaseCards();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) {
      list[idx].disabled = !list[idx].disabled;
      saveStoredCaseCards(list);
      return true;
    }
  } else if (type === "CLUE") {
    const list = getStoredClueCards();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) {
      list[idx].disabled = !list[idx].disabled;
      saveStoredClueCards(list);
      return true;
    }
  }
  return false;
}

export function updateCasePairing(
  caseId: string, 
  acceptedRpIds: string[], 
  acceptedMechIds: string[], 
  clueId: string
): { success: boolean; error?: string } {
  if (!acceptedRpIds || acceptedRpIds.length < 1) {
    return { success: false, error: "ต้องเลือกสารรังสีอย่างน้อย 1 ใบ" };
  }
  if (!acceptedMechIds || acceptedMechIds.length < 1) {
    return { success: false, error: "ต้องเลือกกลไกอย่างน้อย 1 อย่าง" };
  }
  if (!clueId || !clueId.trim()) {
    return { success: false, error: "ต้องเลือกคำใบ้ 1 ใบ" };
  }

  const cases = getStoredCaseCards();
  const idx = cases.findIndex(c => c.id === caseId);
  if (idx < 0) {
    return { success: false, error: "ไม่พบเคสที่ระบุ" };
  }

  cases[idx].acceptedRpIds = acceptedRpIds;
  cases[idx].acceptedMechIds = acceptedMechIds;
  cases[idx].clueId = clueId;

  saveStoredCaseCards(cases);
  return { success: true };
}

// 4. Clue Leak Validator
export function detectClueLeak(text: string): string | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  // Known RP names, nuclides, abbreviations
  const rpKeywords = [
    "99mtc", "⁹⁹ᵐtc", "technetium", "เทคนีเชียม",
    "18f", "¹⁸f", "fluorine", "ฟลูออรีน",
    "123i", "¹²³i", "131i", "¹³¹i", "iodine", "iodide", "ไอโอดีน", "ไอโอไดด์",
    "68ga", "⁶⁸ga", "gallium", "แกลเลียม",
    "111in", "¹¹¹in", "indium", "อินเดียม",
    "201tl", "²⁰¹tl", "thallium", "ทัลเลียม",
    "fdg", "fluorodeoxyglucose", "เอฟดีจี",
    "mdp", "เอ็มดีพี", "methylene diphosphonate",
    "maa", "เอ็มเอเอ", "macroaggregated albumin",
    "mibi", "sestamibi", "เซสตามิบิ",
    "dmsa", "ดีเอ็มเอสเอ", "dimercaptosuccinic",
    "mag3", "แมกทรี", "dtpa", "ดีทีพีเอ",
    "hida", "ไฮด้า", "mebrofenin",
    "phytate", "sulfur colloid", "ซัลเฟอร์คอลลอยด์"
  ];

  // Known Mechanism terms
  const mechKeywords = [
    "active transport", "การลำเลียงแบบใช้พลังงาน",
    "capillary blockade", "การอุดกั้นในหลอดเลือดฝอย",
    "phagocytosis", "ฟาโกไซโทซิส",
    "chemisorption", "เคมีซอร์ปชัน",
    "ion exchange", "การแลกเปลี่ยนไอออน",
    "cell sequestration", "การกักเก็บและทำลายเซลล์",
    "receptor binding", "การจับกับตัวรับ",
    "metabolic trapping", "compartmental localization",
    "facilitated diffusion", "passive diffusion"
  ];

  for (const kw of rpKeywords) {
    if (lower.includes(kw)) {
      return kw;
    }
  }

  for (const kw of mechKeywords) {
    if (lower.includes(kw)) {
      return kw;
    }
  }

  return null;
}
