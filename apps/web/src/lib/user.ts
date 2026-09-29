import { StudentUser, ShopItem } from "@nucmed/shared";

/**
 * Locked Catalog Definitions with Canonical IDs and Aliases
 * frame-graphite ฟรี มีอยู่แล้ว
 * frame-gold Gold Foil 60
 * frame-reactor Reactor Glow 90
 * back-default ฟรี
 * back-hotcell 45
 * back-pet 75
 * avatar-default ฟรี
 * avatar-thyroid 30
 * avatar-lung 30
 * fx-none ฟรี
 * fx-gamma 80
 * title-none ฟรี
 * title-capillary 40
 */
export const SHOP_CATALOG: ShopItem[] = [
  // Frames
  {
    id: "frame-graphite",
    nameTh: "กรอบ Graphite ดั้งเดิม",
    price: 0,
    kind: "frame",
    descriptionTh: "กรอบการ์ดมาตรฐานสีเทาแกรไฟต์คลาสสิก"
  },
  {
    id: "frame-gold",
    nameTh: "กรอบ Gold Foil ทองคำ",
    price: 60,
    kind: "frame",
    descriptionTh: "ขอบการ์ดเคลือบทองประกาย สะท้อนแสงหรูหรา"
  },
  {
    id: "frame-reactor",
    nameTh: "กรอบ Reactor Glow เรืองแสง",
    price: 90,
    kind: "frame",
    descriptionTh: "ขอบการ์ดแผ่รังสีสีฟ้าเรืองแสงนีออนสว่างวาบ"
  },
  {
    id: "frame-clinic",
    nameTh: "กรอบคลินิกแดง",
    price: 70,
    kind: "frame",
    descriptionTh: "ขอบการ์ดโทนสีแดงทับทิมคลินิกสะท้อนแสงทรงพลัง"
  },
  {
    id: "frame-tracer",
    nameTh: "กรอบสารเรือง",
    price: 85,
    kind: "frame",
    descriptionTh: "ขอบการ์ดรังสีเขียวมรกตเรืองแสงพัลส์ไอโซโทป"
  },

  // Cardbacks
  {
    id: "back-default",
    nameTh: "หลังไพ่ Classic Navy",
    price: 0,
    kind: "cardback",
    descriptionTh: "หลังการ์ดสีกรมท่าพิมพ์ลายสัญลักษณ์ Trefoil ประจำสถาบัน"
  },
  {
    id: "back-hotcell",
    nameTh: "หลังไพ่ Hot Cell แดงเข้ม",
    price: 45,
    kind: "cardback",
    descriptionTh: "หลังการ์ดสีแดงอิฐเตาหลอมไอโซโทปรังสี"
  },
  {
    id: "back-pet",
    nameTh: "หลังไพ่ PET Ring สีม่วงคอสมิก",
    price: 75,
    kind: "cardback",
    descriptionTh: "หลังการ์ดวงแหวนเครื่องสแกน PET/CT ทรงพลัง"
  },
  {
    id: "back-cyclotron",
    nameTh: "หลังไซโคลตรอน",
    price: 55,
    kind: "cardback",
    descriptionTh: "หลังการ์ดวงแหวนเครื่องเร่งอนุภาคไซโคลตรอนสีฟ้าเข้ม"
  },
  {
    id: "back-nightlab",
    nameTh: "หลังแล็บกลางคืน",
    price: 65,
    kind: "cardback",
    descriptionTh: "หลังการ์ดห้องแล็บปฏิบัติการรังสีเวรดึกสีเขียวเข้ม"
  },

  // Avatars
  {
    id: "avatar-default",
    nameTh: "อวาตาร์โมเลกุล ¹⁸F-FDG",
    price: 0,
    kind: "avatar",
    descriptionTh: "โมเลกุลน้ำตาลติดฉลากรังสีฟลูออรีน-18"
  },
  {
    id: "avatar-niw",
    nameTh: "นิว",
    price: 40,
    kind: "avatar",
    descriptionTh: "มาสคอตหนุ่มน้อยนักฟิสิกส์นิวเคลียร์แว่นตากลมรอบวงโคจร"
  },
  {
    id: "avatar-med",
    nameTh: "เมด",
    price: 40,
    kind: "avatar",
    descriptionTh: "มาสคอตแพทย์หญิงรังสีรักษาพร้อมหูฟังตรวจการไหลเวียนเลือด"
  },
  {
    id: "avatar-gamma",
    nameTh: "แกมม่า",
    price: 35,
    kind: "avatar",
    descriptionTh: "สัญลักษณ์ลำแสงรังสีแกมมาพลังงานสูงเปล่งประกายสีทอง"
  },
  {
    id: "avatar-thyroid",
    nameTh: "อวาตาร์ต่อมไทรอยด์ผีเสื้อ",
    price: 30,
    kind: "avatar",
    descriptionTh: "ต่อมไทรอยด์สีส้มสว่างกำลังจับไอโอไดด์"
  },
  {
    id: "avatar-lung",
    nameTh: "อวาตาร์ปอดและหลอดเลือด",
    price: 30,
    kind: "avatar",
    descriptionTh: "ปอดสีฟ้าสดใสพร้อมระบบการไหลเวียนเลือด"
  },

  // FX & Titles
  {
    id: "fx-none",
    nameTh: "เอฟเฟกต์ Confetti ฉลองชัย",
    price: 0,
    kind: "fx",
    descriptionTh: "พลุกระดาษสีโปรยปรายเมื่อตอบถูก"
  },
  {
    id: "fx-gamma",
    nameTh: "เอฟเฟกต์รังสีแกมมาเรืองรอง",
    price: 80,
    kind: "fx",
    descriptionTh: "คลื่นรังสีแกมมาสีทองระเบิดกระจายเมื่อชนะรอบ"
  },
  {
    id: "fx-lock",
    nameTh: "แสงตอนล็อกคำตอบ",
    price: 50,
    kind: "fx",
    descriptionTh: "ลำแสงพลังงานนีออนสว่างวาบขณะกดล็อกส่งคำตอบ"
  },
  {
    id: "fx-win",
    nameTh: "ประกายตอนตอบถูก",
    price: 70,
    kind: "fx",
    descriptionTh: "ประกายละอองแสงระยิบระยับรอบโต๊ะเมื่อตรวจคำตอบถูกต้อง"
  },
  {
    id: "title-none",
    nameTh: "ฉายาเริ่มต้น (ไม่มี)",
    price: 0,
    kind: "title",
    descriptionTh: "ฉายาเริ่มต้นสำหรับนักศึกษาใหม่"
  },
  {
    id: "title-capillary",
    nameTh: "ฉายา Capillary Blockader",
    price: 40,
    kind: "title",
    descriptionTh: "จอมอุดกั้นหลอดเลือดฝอยปอดระดับเซียน"
  },
  {
    id: "title-perfusion",
    nameTh: "Lung Perfusion",
    price: 45,
    kind: "title",
    descriptionTh: "ผู้เชี่ยวชาญการประเมินการไหลเวียนเลือดในปอด"
  },
  {
    id: "title-fdg",
    nameTh: "FDG Reader",
    price: 45,
    kind: "title",
    descriptionTh: "ยอดนักวิเคราะห์ภาพการเผาผลาญกลูโคสด้วยเพ็ทสแกน"
  }
];

// Helper to normalize and match IDs between hyphen and underscore conventions
export function normalizeShopId(id: string): string {
  const map: Record<string, string> = {
    "frame_graphite": "frame-graphite",
    "frame_gold": "frame-gold",
    "frame_reactor": "frame-reactor",
    "frame_clinic": "frame-clinic",
    "frame_tracer": "frame-tracer",
    "back_navy": "back-default",
    "back_cyclotron": "back-cyclotron",
    "back_nightlab": "back-nightlab",
    "av_fdg": "avatar-default",
    "av_thyroid": "avatar-thyroid",
    "av_lung": "avatar-lung",
    "av_niw": "avatar-niw",
    "av_med": "avatar-med",
    "av_gamma": "avatar-gamma",
    "fx_confetti": "fx-none",
    "fx_lock": "fx-lock",
    "fx_win": "fx-win",
    "title_none": "title-none",
    "title_blockader": "title-capillary",
    "title_perfusion": "title-perfusion",
    "title_fdg": "title-fdg"
  };
  return map[id] || id;
}

export function isItemMatching(id1?: string, id2?: string): boolean {
  if (!id1 || !id2) return false;
  if (id1 === id2) return true;
  return normalizeShopId(id1) === normalizeShopId(id2);
}

export interface NaWallet {
  coins: number;
}

export interface NaInventory {
  ownedIds: string[];
}

export interface NaEquipped {
  frame: string;
  back: string;
  avatar: string;
  fx: string;
  title: string;
}

export interface NaPreview {
  frame?: string;
  back?: string;
  avatar?: string;
  fx?: string;
  title?: string;
  faceUp?: boolean;
  previewItemName?: string;
}

export type ShopCategory = "frame" | "cardback" | "avatar" | "fx" | "title";

export function getEquippedSlot(equipped: NaEquipped, kind: ShopCategory): string {
  if (kind === "cardback") return equipped.back;
  return (equipped as unknown as Record<string, string>)[kind] || "";
}

export function setEquippedSlot(equipped: NaEquipped, kind: ShopCategory, id: string): NaEquipped {
  if (kind === "cardback") {
    return { ...equipped, back: id };
  }
  return { ...equipped, [kind]: id };
}

export function getPreviewSlot(preview: NaPreview, kind: ShopCategory): string {
  if (kind === "cardback") return preview.back || "";
  return (preview as unknown as Record<string, string | undefined>)[kind] || "";
}

export function setPreviewSlot(preview: NaPreview, kind: ShopCategory, id: string): NaPreview {
  if (kind === "cardback") {
    return { ...preview, back: id };
  }
  return { ...preview, [kind]: id };
}

const DEFAULT_OWNED_IDS = [
  "frame-graphite",
  "frame_graphite",
  "back-default",
  "back_navy",
  "avatar-default",
  "av_fdg",
  "fx-none",
  "fx_confetti",
  "title-none",
  "title_none"
];

const DEFAULT_EQUIPPED: NaEquipped = {
  frame: "frame-graphite",
  back: "back-default",
  avatar: "avatar-default",
  fx: "fx-none",
  title: "title-none"
};

// na_wallet.coins: starts at 120 if not existing
export function getNaWallet(): NaWallet {
  if (typeof window === "undefined") {
    return { coins: 120 };
  }

  // Check current logged-in user in na_accounts first
  const currentUserRaw = localStorage.getItem("nucmed_current_user");
  if (currentUserRaw) {
    try {
      const u = JSON.parse(currentUserRaw);
      const accounts = getNaAccounts();
      const acc = accounts.find(a => a.studentId === u.studentId);
      if (acc && typeof acc.coins === "number") {
        return { coins: acc.coins };
      }
      if (typeof u.coins === "number") {
        return { coins: u.coins };
      }
    } catch {
      // fallback
    }
  }

  const raw = localStorage.getItem("na_wallet");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.coins === "number") {
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  const wallet: NaWallet = { coins: 120 };
  localStorage.setItem("na_wallet", JSON.stringify(wallet));
  return wallet;
}

export function setNaWallet(wallet: NaWallet): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("na_wallet", JSON.stringify(wallet));

  // Sync with current user and na_accounts
  const currentUserRaw = localStorage.getItem("nucmed_current_user");
  if (currentUserRaw) {
    try {
      const u = JSON.parse(currentUserRaw);
      u.coins = wallet.coins;
      localStorage.setItem("nucmed_current_user", JSON.stringify(u));
      localStorage.setItem(`nucmed_user_${u.studentId}`, JSON.stringify(u));

      // Sync to na_accounts
      const accounts = getNaAccounts();
      const acc = accounts.find(a => a.studentId === u.studentId);
      if (acc) {
        acc.coins = wallet.coins;
        saveNaAccounts(accounts);
      }
    } catch {
      // fallback
    }
  }
}

// na_inventory.ownedIds: contains frame-graphite from start
export function getNaInventory(): NaInventory {
  if (typeof window === "undefined") {
    return { ownedIds: DEFAULT_OWNED_IDS };
  }

  // Check current logged-in user in na_accounts first
  const currentUserRaw = localStorage.getItem("nucmed_current_user");
  if (currentUserRaw) {
    try {
      const u = JSON.parse(currentUserRaw);
      const accounts = getNaAccounts();
      const acc = accounts.find(a => a.studentId === u.studentId);
      if (acc && Array.isArray(acc.inventory)) {
        const merged = Array.from(new Set([...DEFAULT_OWNED_IDS, ...acc.inventory]));
        return { ownedIds: merged };
      }
    } catch {}
  }

  const raw = localStorage.getItem("na_inventory");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.ownedIds)) {
        const merged = Array.from(new Set([...DEFAULT_OWNED_IDS, ...parsed.ownedIds]));
        return { ownedIds: merged };
      }
    } catch {
      // fallback
    }
  }

  const inventory: NaInventory = { ownedIds: DEFAULT_OWNED_IDS };
  localStorage.setItem("na_inventory", JSON.stringify(inventory));
  return inventory;
}

export function setNaInventory(inventory: NaInventory): void {
  if (typeof window === "undefined") return;
  const normalized = Array.from(new Set([...DEFAULT_OWNED_IDS, ...inventory.ownedIds]));
  localStorage.setItem("na_inventory", JSON.stringify({ ownedIds: normalized }));

  // Sync with current user and na_accounts
  const currentUserRaw = localStorage.getItem("nucmed_current_user");
  if (currentUserRaw) {
    try {
      const u = JSON.parse(currentUserRaw);
      const accounts = getNaAccounts();
      const acc = accounts.find(a => a.studentId === u.studentId);
      if (acc) {
        acc.inventory = normalized;
        saveNaAccounts(accounts);
      }
    } catch {}
  }
}

// na_equipped: frame, back, avatar, fx, title
export function getNaEquipped(): NaEquipped {
  if (typeof window === "undefined") {
    return DEFAULT_EQUIPPED;
  }

  // Check current logged-in user in na_accounts first
  const currentUserRaw = localStorage.getItem("nucmed_current_user");
  if (currentUserRaw) {
    try {
      const u = JSON.parse(currentUserRaw);
      const accounts = getNaAccounts();
      const acc = accounts.find(a => a.studentId === u.studentId);
      if (acc && acc.equipped) {
        return {
          frame: acc.equipped.frame || DEFAULT_EQUIPPED.frame,
          back: acc.equipped.back || DEFAULT_EQUIPPED.back,
          avatar: acc.equipped.avatar || acc.avatarId || DEFAULT_EQUIPPED.avatar,
          fx: acc.equipped.fx || DEFAULT_EQUIPPED.fx,
          title: acc.equipped.title || DEFAULT_EQUIPPED.title
        };
      }
    } catch {}
  }

  const raw = localStorage.getItem("na_equipped");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return {
        frame: parsed.frame || DEFAULT_EQUIPPED.frame,
        back: parsed.back || DEFAULT_EQUIPPED.back,
        avatar: parsed.avatar || DEFAULT_EQUIPPED.avatar,
        fx: parsed.fx || DEFAULT_EQUIPPED.fx,
        title: parsed.title || DEFAULT_EQUIPPED.title
      };
    } catch {
      // fallback
    }
  }

  const equipped = { ...DEFAULT_EQUIPPED };
  localStorage.setItem("na_equipped", JSON.stringify(equipped));
  return equipped;
}

export function setNaEquipped(equipped: NaEquipped): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("na_equipped", JSON.stringify(equipped));

  // Sync with legacy currentUser and na_accounts
  const currentUserRaw = localStorage.getItem("nucmed_current_user");
  if (currentUserRaw) {
    try {
      const u = JSON.parse(currentUserRaw);
      u.equipped = {
        frame: equipped.frame,
        cardback: equipped.back,
        avatar: equipped.avatar,
        fx: equipped.fx,
        title: equipped.title
      };
      localStorage.setItem("nucmed_current_user", JSON.stringify(u));
      localStorage.setItem(`nucmed_user_${u.studentId}`, JSON.stringify(u));

      // Sync to na_accounts
      const accounts = getNaAccounts();
      const acc = accounts.find(a => a.studentId === u.studentId);
      if (acc) {
        acc.equipped = { ...equipped };
        acc.avatarId = equipped.avatar;
        saveNaAccounts(accounts);
      }
    } catch {
      // fallback
    }
  }
}

export function getAvatarIcon(avatarId?: string): string {
  const norm = avatarId ? normalizeShopId(avatarId) : "";
  switch (norm) {
    case "avatar-niw": return "👨‍🔬";
    case "avatar-med": return "👩‍⚕️";
    case "avatar-gamma": return "⚡";
    case "avatar-thyroid": return "🦋";
    case "avatar-lung": return "🫁";
    case "av-bone":
    case "av_bone": return "🦴";
    case "avatar-default":
    default: return "☢️";
  }
}

export function getTitleBadge(titleId?: string): string | null {
  const norm = titleId ? normalizeShopId(titleId) : "";
  if (norm === "title-capillary") return "Capillary Blockader";
  if (norm === "title-perfusion") return "Lung Perfusion";
  if (norm === "title-fdg") return "FDG Reader";
  return null;
}

export function getFrameStyle(frameId?: string): string {
  const norm = frameId ? normalizeShopId(frameId) : "";
  switch (norm) {
    case "frame-gold":
      return "border-amber-300 ring-2 ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]";
    case "frame-reactor":
      return "border-cyan-400 ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse";
    case "frame-clinic":
      return "border-rose-500 ring-2 ring-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.7)]";
    case "frame-tracer":
      return "border-emerald-400 ring-2 ring-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)] animate-pulse";
    case "frame-graphite":
    default:
      return "border-amber-600/60 shadow-md";
  }
}

// na_preview: separate from equipped, clearable on shop close
export function getNaPreview(): NaPreview | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("na_preview");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

export function setNaPreview(preview: NaPreview): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("na_preview", JSON.stringify(preview));
}

export function clearNaPreview(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("na_preview");
}

export interface NaCoinLog {
  timestamp: string;
  delta: number;
  reason: string;
}

export interface NaAccount {
  studentId: string;
  displayName: string;
  password: string;
  coins: number;
  xp: number;
  correctCount: number;
  createdAt: string;
  lastLoginAt: string;
  lastPlayedAt?: string;
  disabled?: boolean;
  avatarId?: string;
  inventory?: string[];
  equipped?: NaEquipped;
  coinHistory?: NaCoinLog[];
}

const DEFAULT_SEED_ACCOUNTS: NaAccount[] = [
  {
    studentId: "68208307037",
    displayName: "ภูมิ ภูวนาถ",
    password: "ภูมิ",
    coins: 120,
    xp: 60,
    correctCount: 0,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    disabled: false,
    avatarId: "avatar-default",
    inventory: DEFAULT_OWNED_IDS,
    equipped: DEFAULT_EQUIPPED
  },
  {
    studentId: "67208307015",
    displayName: "นศ. ธันวา",
    password: "1234",
    coins: 120,
    xp: 60,
    correctCount: 0,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    disabled: false,
    avatarId: "avatar-thyroid",
    inventory: DEFAULT_OWNED_IDS,
    equipped: { ...DEFAULT_EQUIPPED, avatar: "avatar-thyroid" }
  },
  {
    studentId: "66208307052",
    displayName: "นักศึกษา 7052",
    password: "7052",
    coins: 120,
    xp: 60,
    correctCount: 0,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    disabled: false,
    avatarId: "avatar-lung",
    inventory: DEFAULT_OWNED_IDS,
    equipped: { ...DEFAULT_EQUIPPED, avatar: "avatar-lung" }
  }
];

export function getNaAccounts(): NaAccount[] {
  if (typeof window === "undefined") return DEFAULT_SEED_ACCOUNTS;
  try {
    const raw = localStorage.getItem("na_accounts");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((acc: any) => {
          let decoded = acc.password;
          if (typeof decoded === "string" && decoded.startsWith("b64:")) {
            try { const b64 = decoded.substring(4); try { decoded = decodeURIComponent(atob(b64)); } catch { decoded = atob(b64); } } catch {}
          }
          return { ...acc, password: decoded };
        });
      }
    }

    // Migrate from legacy registered accounts if present
    const legacyRaw = localStorage.getItem("nucmed_registered_accounts");
    if (legacyRaw) {
      try {
        const legacy = JSON.parse(legacyRaw);
        if (Array.isArray(legacy) && legacy.length > 0) {
          const migrated: NaAccount[] = legacy.map((acc: any) => ({
            studentId: acc.studentId,
            displayName: acc.displayName || `นักศึกษา ${acc.studentId.slice(-4)}`,
            password: acc.displayName || acc.studentId.slice(-4),
            coins: typeof acc.coins === "number" ? acc.coins : 120,
            xp: typeof acc.xp === "number" ? acc.xp : 60,
            correctCount: 0,
            createdAt: acc.registeredAt || new Date().toISOString(),
            lastLoginAt: acc.lastLoginAt || new Date().toISOString(),
            disabled: false,
            avatarId: acc.avatarId || "avatar-default",
            inventory: DEFAULT_OWNED_IDS,
            equipped: { ...DEFAULT_EQUIPPED, avatar: acc.avatarId || "avatar-default" }
          }));
          saveNaAccounts(migrated);
          return migrated;
        }
      } catch {}
    }

    // Seed defaults
    saveNaAccounts(DEFAULT_SEED_ACCOUNTS);
    return DEFAULT_SEED_ACCOUNTS;
  } catch {
    return DEFAULT_SEED_ACCOUNTS;
  }
}

export function saveNaAccounts(accounts: NaAccount[], skipBroadcast: boolean = false): void {
  if (typeof window === "undefined") return;
  try {
    const obfuscated = accounts.map(acc => ({
      ...acc,
      password: acc.password && !acc.password.startsWith("b64:") ? `b64:${btoa(encodeURIComponent(acc.password))}` : acc.password
    }));
    localStorage.setItem("na_accounts", JSON.stringify(obfuscated));
    if (!skipBroadcast) {
      window.dispatchEvent(new CustomEvent("na_accounts_saved", { detail: accounts }));
    }
  } catch {}
}

export function findNaAccount(studentId: string): NaAccount | undefined {
  const clean = studentId.trim().toUpperCase();
  return getNaAccounts().find(a => a.studentId === clean);
}

export interface RegisterResult {
  success: boolean;
  error?: string;
  user?: StudentUser;
}

export function registerNaAccount(params: {
  studentId: string;
  displayName: string;
  password: string;
  avatarId?: string;
  rememberMe?: boolean;
}): RegisterResult {
  const cleanId = params.studentId.trim().toUpperCase();
  const name = params.displayName.trim();
  const password = params.password.trim();
  const avatarId = params.avatarId || "avatar-default";

  if (!cleanId) {
    return { success: false, error: "กรุณากรอกรหัสนักศึกษา" };
  }
  if (!name) {
    return { success: false, error: "กรุณากรอกชื่อที่ต้องการแสดง" };
  }
  if (!password) {
    return { success: false, error: "กรุณาตั้งรหัสผ่าน" };
  }

  const accounts = getNaAccounts();
  const existing = accounts.find(a => a.studentId === cleanId);
  if (existing) {
    return {
      success: false,
      error: "มีบัญชีแล้ว ให้เข้าสู่ระบบ"
    };
  }

  const newAccount: NaAccount = {
    studentId: cleanId,
    displayName: name,
    password: password,
    coins: 120, // New student starting balance
    xp: 60,
    correctCount: 0,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    disabled: false,
    avatarId: avatarId,
    inventory: [...DEFAULT_OWNED_IDS, avatarId],
    equipped: {
      ...DEFAULT_EQUIPPED,
      avatar: avatarId
    },
    coinHistory: [
      {
        timestamp: new Date().toISOString(),
        delta: 120,
        reason: "โบนัสนักศึกษาใหม่เริ่มต้น (Welcome bonus)"
      }
    ]
  };

  accounts.unshift(newAccount);
  saveNaAccounts(accounts);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("na_account_upserted", { detail: newAccount }));
  }

  const user: StudentUser = {
    studentId: cleanId,
    displayName: name,
    xp: 60,
    coins: 120,
    equipped: {
      frame: "frame-graphite",
      cardback: "back-default",
      avatar: avatarId,
      fx: "fx-none",
      title: "title-none"
    }
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(`nucmed_user_${cleanId}`, JSON.stringify(user));
    localStorage.setItem("nucmed_current_user", JSON.stringify(user));
    if (params.rememberMe ?? true) {
      localStorage.setItem("nucmed_remembered_id", cleanId);
    }
    setNaWallet({ coins: 120 });
    setNaInventory({ ownedIds: [...DEFAULT_OWNED_IDS, avatarId] });
    setNaEquipped(newAccount.equipped!);
  }

  return { success: true, user };
}

export interface LoginResult {
  success: boolean;
  isAdmin?: boolean;
  error?: string;
  user?: StudentUser;
}

export function loginNaAccount(studentId: string, password: string, rememberMe: boolean = true): LoginResult {
  const cleanId = studentId.trim();
  const cleanPass = password.trim();

  // Admin login check (username "admin" and password "rtkmpht")
  if (cleanId.toLowerCase() === "admin" && cleanPass === "rtkmpht") {
    if (typeof window !== "undefined") {
      localStorage.setItem("na_admin_auth", "true");
    }
    return { success: true, isAdmin: true };
  }

  if (cleanId.toLowerCase() === "admin") {
    return { success: false, error: "รหัสผ่านแอดมินไม่ถูกต้อง" };
  }

  const accounts = getNaAccounts();
  const account = accounts.find(a => a.studentId === cleanId.toUpperCase());

  if (!account) {
    return {
      success: false,
      error: "ไม่พบรหัสนักศึกษานี้ในระบบ กรุณากดแท็บ 'สมัครใหม่' เพื่อลงทะเบียน"
    };
  }

  if (account.disabled) {
    return {
      success: false,
      error: "บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่ออาจารย์ผู้สอน"
    };
  }

  // Check password strictly
    const isMatch = account.password === cleanPass;

  if (!isMatch) {
    return {
      success: false,
      error: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง"
    };
  }

  // Successful login
  account.lastLoginAt = new Date().toISOString();
  saveNaAccounts(accounts);

  const user: StudentUser = {
    studentId: account.studentId,
    displayName: account.displayName,
    xp: account.xp,
    coins: account.coins,
    equipped: {
      frame: account.equipped?.frame || "frame-graphite",
      cardback: account.equipped?.back || "back-default",
      avatar: account.equipped?.avatar || account.avatarId || "avatar-default",
      fx: account.equipped?.fx || "fx-none",
      title: account.equipped?.title || "title-none"
    }
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(`nucmed_user_${account.studentId}`, JSON.stringify(user));
    localStorage.setItem("nucmed_current_user", JSON.stringify(user));
    if (rememberMe) {
      localStorage.setItem("nucmed_remembered_id", account.studentId);
    } else {
      localStorage.removeItem("nucmed_remembered_id");
    }

    setNaWallet({ coins: account.coins });
    if (account.inventory) {
      setNaInventory({ ownedIds: account.inventory });
    }
    if (account.equipped) {
      setNaEquipped(account.equipped);
    }
  }

  return { success: true, user };
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("na_admin_auth") === "true";
}

export function setAdminAuthenticated(auth: boolean): void {
  if (typeof window === "undefined") return;
  if (auth) {
    localStorage.setItem("na_admin_auth", "true");
  } else {
    localStorage.removeItem("na_admin_auth");
  }
}

export function adminUpdateCoins(studentId: string, delta: number, reason: string): { success: boolean; error?: string } {
  if (!reason.trim()) {
    return { success: false, error: "กรุณาระบุเหตุผลในการปรับยอดเหรียญ" };
  }
  const accounts = getNaAccounts();
  const idx = accounts.findIndex(a => a.studentId === studentId);
  if (idx < 0) {
    return { success: false, error: "ไม่พบข้อมูลนักศึกษา" };
  }

  const account = accounts[idx];
  account.coins = Math.max(0, account.coins + delta);
  if (!account.coinHistory) account.coinHistory = [];
  account.coinHistory.unshift({
    timestamp: new Date().toISOString(),
    delta,
    reason: reason.trim()
  });

  saveNaAccounts(accounts);

  // Sync if this student is currently active session
  if (typeof window !== "undefined") {
    const currentRaw = localStorage.getItem("nucmed_current_user");
    if (currentRaw) {
      try {
        const cur = JSON.parse(currentRaw);
        if (cur.studentId === studentId) {
          cur.coins = account.coins;
          localStorage.setItem("nucmed_current_user", JSON.stringify(cur));
          setNaWallet({ coins: account.coins });
        }
      } catch {}
    }
  }

  return { success: true };
}

export function adminResetCoins(studentId: string): { success: boolean; error?: string } {
  const accounts = getNaAccounts();
  const idx = accounts.findIndex(a => a.studentId === studentId);
  if (idx < 0) {
    return { success: false, error: "ไม่พบข้อมูลนักศึกษา" };
  }

  const account = accounts[idx];
  const oldCoins = account.coins;
  account.coins = 120;
  if (!account.coinHistory) account.coinHistory = [];
  account.coinHistory.unshift({
    timestamp: new Date().toISOString(),
    delta: 120 - oldCoins,
    reason: "อาจารย์รีเซ็ตยอดเหรียญเริ่มต้น (120)"
  });

  saveNaAccounts(accounts);

  if (typeof window !== "undefined") {
    const currentRaw = localStorage.getItem("nucmed_current_user");
    if (currentRaw) {
      try {
        const cur = JSON.parse(currentRaw);
        if (cur.studentId === studentId) {
          cur.coins = 120;
          localStorage.setItem("nucmed_current_user", JSON.stringify(cur));
          setNaWallet({ coins: 120 });
        }
      } catch {}
    }
  }

  return { success: true };
}

export function adminToggleDisable(studentId: string): { success: boolean; error?: string } {
  if (studentId.toLowerCase() === "admin") {
    return { success: false, error: "ไม่อนุญาตให้ระงับบัญชีผู้ดูแลระบบ (admin)" };
  }

  const accounts = getNaAccounts();
  const idx = accounts.findIndex(a => a.studentId === studentId);
  if (idx < 0) {
    return { success: false, error: "ไม่พบข้อมูลนักศึกษา" };
  }

  accounts[idx].disabled = !accounts[idx].disabled;
  saveNaAccounts(accounts);
  return { success: true };
}

export function recordMatchPlayed(params: {
  studentId: string;
  coinsEarned: number;
  correctCases: number;
  reason: string;
}): void {
  const accounts = getNaAccounts();
  const idx = accounts.findIndex(a => a.studentId === params.studentId);
  if (idx >= 0) {
    const acc = accounts[idx];
    acc.coins += params.coinsEarned;
    acc.correctCount = (acc.correctCount || 0) + params.correctCases;
    acc.lastPlayedAt = new Date().toISOString();
    if (!acc.coinHistory) acc.coinHistory = [];
    acc.coinHistory.unshift({
      timestamp: new Date().toISOString(),
      delta: params.coinsEarned,
      reason: params.reason
    });
    saveNaAccounts(accounts);

    setNaWallet({ coins: acc.coins });
    if (typeof window !== "undefined") {
      const currentRaw = localStorage.getItem("nucmed_current_user");
      if (currentRaw) {
        try {
          const cur = JSON.parse(currentRaw);
          cur.coins = acc.coins;
          localStorage.setItem("nucmed_current_user", JSON.stringify(cur));
        } catch {}
      }
    }
  }
}

// Backward-compatible adapters
export interface RegisteredAccount {
  studentId: string;
  displayName: string;
  avatarId: string;
  coins: number;
  xp: number;
  registeredAt: string;
  lastLoginAt: string;
  rememberMe: boolean;
}

export function getRegisteredAccounts(): RegisteredAccount[] {
  return getNaAccounts().map(a => ({
    studentId: a.studentId,
    displayName: a.displayName,
    avatarId: a.avatarId || a.equipped?.avatar || "avatar-default",
    coins: a.coins,
    xp: a.xp,
    registeredAt: a.createdAt,
    lastLoginAt: a.lastLoginAt,
    rememberMe: true
  }));
}

export function saveRegisteredAccounts(accounts: RegisteredAccount[]): void {
  // na_accounts is source of truth
}

export function registerAccount(params: {
  studentId: string;
  password?: string;
  displayName?: string;
  avatarId?: string;
  rememberMe?: boolean;
}): StudentUser {
  const name = params.displayName?.trim() || `นักศึกษา ${params.studentId.slice(-4)}`;
  const pass = params.password?.trim() || name;
  const res = registerNaAccount({
    studentId: params.studentId,
    displayName: name,
    password: pass,
    avatarId: params.avatarId,
    rememberMe: params.rememberMe
  });
  if (res.user) return res.user;
  return createDefaultUser(params.studentId, params.displayName);
}

export function loginAccount(studentId: string, rememberMe: boolean = true): StudentUser {
  const account = findNaAccount(studentId);
  if (account) {
    const res = loginNaAccount(studentId, account.password, rememberMe);
    if (res.user) return res.user;
  }
  return createDefaultUser(studentId);
}

export function logoutAccount(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("nucmed_current_user");
    localStorage.removeItem("nucmed_remembered_id");
    localStorage.removeItem("na_admin_auth");
  }
}

export function getRememberedUser(): StudentUser | null {
  if (typeof window === "undefined") return null;

  const currentRaw = localStorage.getItem("nucmed_current_user");
  if (currentRaw) {
    try {
      const u = JSON.parse(currentRaw);
      const wallet = getNaWallet();
      u.coins = wallet.coins;
      return u;
    } catch {}
  }

  const rememberedId = localStorage.getItem("nucmed_remembered_id");
  if (rememberedId) {
    const userRaw = localStorage.getItem(`nucmed_user_${rememberedId}`);
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        const wallet = getNaWallet();
        u.coins = wallet.coins;
        localStorage.setItem("nucmed_current_user", JSON.stringify(u));
        return u;
      } catch {}
    }
  }

  return null;
}

export function removeRegisteredAccount(studentId: string): void {
  if (typeof window === "undefined") return;
  const cleanId = studentId.trim().toUpperCase();
  const accounts = getNaAccounts().filter(a => a.studentId !== cleanId);
  saveNaAccounts(accounts);

  const rememberedId = localStorage.getItem("nucmed_remembered_id");
  if (rememberedId === cleanId) {
    localStorage.removeItem("nucmed_remembered_id");
  }

  const currentRaw = localStorage.getItem("nucmed_current_user");
  if (currentRaw) {
    try {
      const u = JSON.parse(currentRaw);
      if (u.studentId === cleanId) {
        localStorage.removeItem("nucmed_current_user");
      }
    } catch {}
  }
}

export function getLocalUser(): StudentUser {
  const remembered = getRememberedUser();
  if (remembered) {
    return remembered;
  }
  const accounts = getNaAccounts();
  const first = accounts[0];
  if (first) {
    return {
      studentId: first.studentId,
      displayName: first.displayName,
      xp: first.xp,
      coins: first.coins,
      equipped: {
        frame: first.equipped?.frame || "frame-graphite",
        cardback: first.equipped?.back || "back-default",
        avatar: first.equipped?.avatar || first.avatarId || "avatar-default",
        fx: first.equipped?.fx || "fx-none",
        title: first.equipped?.title || "title-none"
      }
    };
  }
  const newUser = createDefaultUser("68208307037", "ภูมิ ภูวนาถ");
  saveLocalUser(newUser);
  return newUser;
}

export function saveLocalUser(user: StudentUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`nucmed_user_${user.studentId}`, JSON.stringify(user));
    localStorage.setItem("nucmed_current_user", JSON.stringify(user));
    setNaWallet({ coins: user.coins });

    // Update in na_accounts if exists
    const accounts = getNaAccounts();
    const idx = accounts.findIndex(a => a.studentId === user.studentId);
    if (idx >= 0) {
      accounts[idx].coins = user.coins;
      accounts[idx].xp = user.xp;
      accounts[idx].displayName = user.displayName;
      saveNaAccounts(accounts);
    }
  }
}

export function createDefaultUser(id: string, name?: string): StudentUser {
  const wallet = typeof window !== "undefined" ? getNaWallet() : { coins: 120 };
  return {
    studentId: id.trim().toUpperCase(),
    displayName: name?.trim() || `นักศึกษา ${id.slice(-4)}`,
    xp: 60,
    coins: wallet.coins ?? 120,
    equipped: {
      frame: "frame-graphite",
      cardback: "back-default",
      avatar: "avatar-default",
      fx: "fx-none",
      title: "title-none"
    }
  };
}

export function addRewards(user: StudentUser, matchPoints: number): StudentUser {
  const earnedCoins = matchPoints * 3;
  const earnedXp = matchPoints * 10;

  const updated: StudentUser = {
    ...user,
    coins: user.coins + earnedCoins,
    xp: user.xp + earnedXp
  };
  saveLocalUser(updated);
  return updated;
}
