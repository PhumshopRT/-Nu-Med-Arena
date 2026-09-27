import { StudentUser, ShopItem } from "@nucmed/shared";

export const SHOP_CATALOG: ShopItem[] = [
  // Frames
  {
    id: "frame_graphite",
    nameTh: "กรอบ Graphite ดั้งเดิม",
    price: 0,
    kind: "frame",
    descriptionTh: "กรอบการ์ดมาตรฐานสีเทาแกรไฟต์คลาสสิก"
  },
  {
    id: "frame_gold",
    nameTh: "กรอบ Gold Foil ทองคำ",
    price: 60,
    kind: "frame",
    descriptionTh: "ขอบการ์ดเคลือบทองประกาย สะท้อนแสงหรูหรา"
  },
  {
    id: "frame_reactor",
    nameTh: "กรอบ Reactor Glow เรืองแสง",
    price: 90,
    kind: "frame",
    descriptionTh: "ขอบการ์ดแผ่รังสีสีเขียวนีออนสว่างวาบ"
  },

  // Cardbacks
  {
    id: "back_navy",
    nameTh: "หลังไพ่ Classic Navy",
    price: 0,
    kind: "cardback",
    descriptionTh: "หลังการ์ดสีกรมท่าพิมพ์ลายสัญลักษณ์ Trefoil ประจำสถาบัน"
  },
  {
    id: "back_hotcell",
    nameTh: "หลังไพ่ Hot Cell แดงเข้ม",
    price: 45,
    kind: "cardback",
    descriptionTh: "หลังการ์ดสีแดงอิฐเตาหลอมไอโซโทปรังสี"
  },
  {
    id: "back_pet",
    nameTh: "หลังไพ่ PET Ring สีม่วงคอสมิก",
    price: 75,
    kind: "cardback",
    descriptionTh: "หลังการ์ดวงแหวนเครื่องสแกน PET/CT ทรงพลัง"
  },

  // Avatars
  {
    id: "av_fdg",
    nameTh: "อวาตาร์โมเลกุล ¹⁸F-FDG",
    price: 0,
    kind: "avatar",
    descriptionTh: "โมเลกุลน้ำตาลติดฉลากรังสีฟลูออรีน-18"
  },
  {
    id: "av_thyroid",
    nameTh: "อวาตาร์ต่อมไทรอยด์ผีเสื้อ",
    price: 30,
    kind: "avatar",
    descriptionTh: "ต่อมไทรอยด์สีส้มสว่างกำลังจับไอโอไดด์"
  },
  {
    id: "av_lung",
    nameTh: "อวาตาร์ปอดและหลอดเลือด",
    price: 30,
    kind: "avatar",
    descriptionTh: "ปอดสีฟ้าสดใสพร้อมระบบการไหลเวียนเลือด"
  },
  {
    id: "av_bone",
    nameTh: "อวาตาร์ผลึกกระดูก",
    price: 30,
    kind: "avatar",
    descriptionTh: "ผลึกกระดูกไฮดรอกซีอะพาไทต์แข็งแกร่ง"
  },

  // FX & Titles
  {
    id: "fx_confetti",
    nameTh: "เอฟเฟกต์ Confetti ฉลองชัย",
    price: 0,
    kind: "fx",
    descriptionTh: "พลุกระดาษสีโปรยปรายเมื่อตอบถูก"
  },
  {
    id: "fx_gamma",
    nameTh: "เอฟเฟกต์รังสีแกมมาเรืองรอง",
    price: 80,
    kind: "fx",
    descriptionTh: "คลื่นรังสีแกมมาสีทองระเบิดกระจายเมื่อชนะรอบ"
  },
  {
    id: "title_blockader",
    nameTh: "ฉายา Capillary Blockader",
    price: 40,
    kind: "title",
    descriptionTh: "จอมอุดกั้นหลอดเลือดฝอยปอดระดับเซียน"
  },
  {
    id: "title_fdg",
    nameTh: "ฉายา FDG Hunter",
    price: 40,
    kind: "title",
    descriptionTh: "นักล่าเซลล์เมแทบอลิซึมสูงแห่งวงการ PET"
  }
];

export function getLocalUser(): StudentUser {
  if (typeof window === "undefined") {
    return createDefaultUser("651000000", "นักศึกษา");
  }
  const saved = localStorage.getItem("nucmed_current_user");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  const newUser = createDefaultUser("651000000", "นักศึกษา");
  saveLocalUser(newUser);
  return newUser;
}

export function saveLocalUser(user: StudentUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`nucmed_user_${user.studentId}`, JSON.stringify(user));
    localStorage.setItem("nucmed_current_user", JSON.stringify(user));
  }
}

export function createDefaultUser(id: string, name?: string): StudentUser {
  return {
    studentId: id.trim().toUpperCase(),
    displayName: name?.trim() || `นักศึกษา ${id.slice(-4)}`,
    xp: 60,
    coins: 120, // Give some starter NucCoins to test shop
    equipped: {
      frame: "frame_graphite",
      cardback: "back_navy",
      avatar: "av_fdg",
      fx: "fx_confetti",
      title: "title_blockader"
    }
  };
}

export function addRewards(user: StudentUser, matchPoints: number): StudentUser {
  // 1 match point = 3 NucCoins, 10 XP
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
