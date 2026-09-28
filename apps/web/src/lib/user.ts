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

  // Avatars
  {
    id: "avatar-default",
    nameTh: "อวาตาร์โมเลกุล ¹⁸F-FDG",
    price: 0,
    kind: "avatar",
    descriptionTh: "โมเลกุลน้ำตาลติดฉลากรังสีฟลูออรีน-18"
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
  }
];

// Helper to normalize and match IDs between hyphen and underscore conventions
export function normalizeShopId(id: string): string {
  const map: Record<string, string> = {
    "frame_graphite": "frame-graphite",
    "frame_gold": "frame-gold",
    "frame_reactor": "frame-reactor",
    "back_navy": "back-default",
    "av_fdg": "avatar-default",
    "av_thyroid": "avatar-thyroid",
    "av_lung": "avatar-lung",
    "fx_confetti": "fx-none",
    "title_none": "title-none",
    "title_blockader": "title-capillary",
    "title_fdg": "title-capillary"
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

  // Check legacy user wallet
  const currentUserRaw = localStorage.getItem("nucmed_current_user");
  let coins = 120;
  if (currentUserRaw) {
    try {
      const u = JSON.parse(currentUserRaw);
      if (typeof u.coins === "number") {
        coins = u.coins;
      }
    } catch {
      // fallback
    }
  }

  const wallet: NaWallet = { coins };
  localStorage.setItem("na_wallet", JSON.stringify(wallet));
  return wallet;
}

export function setNaWallet(wallet: NaWallet): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("na_wallet", JSON.stringify(wallet));

  // Sync with legacy currentUser
  const currentUserRaw = localStorage.getItem("nucmed_current_user");
  if (currentUserRaw) {
    try {
      const u = JSON.parse(currentUserRaw);
      u.coins = wallet.coins;
      localStorage.setItem("nucmed_current_user", JSON.stringify(u));
      localStorage.setItem(`nucmed_user_${u.studentId}`, JSON.stringify(u));
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
}

// na_equipped: frame, back, avatar, fx, title
export function getNaEquipped(): NaEquipped {
  if (typeof window === "undefined") {
    return DEFAULT_EQUIPPED;
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

  // Sync with legacy currentUser
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
    } catch {
      // fallback
    }
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

export function getLocalUser(): StudentUser {
  if (typeof window === "undefined") {
    return createDefaultUser("68208307052", "นักศึกษา 7052");
  }
  const saved = localStorage.getItem("nucmed_current_user");
  if (saved) {
    try {
      const u = JSON.parse(saved);
      // Ensure sync with na_wallet
      const wallet = getNaWallet();
      u.coins = wallet.coins;
      return u;
    } catch {
      // fallback
    }
  }
  const newUser = createDefaultUser("68208307052", "นักศึกษา 7052");
  saveLocalUser(newUser);
  return newUser;
}

export function saveLocalUser(user: StudentUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`nucmed_user_${user.studentId}`, JSON.stringify(user));
    localStorage.setItem("nucmed_current_user", JSON.stringify(user));
    setNaWallet({ coins: user.coins });
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
