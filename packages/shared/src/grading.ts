import { CaseCard } from "./types";

export interface GradeResult {
  correct: boolean;
  points: number;
  rpOk: boolean;
  mechOk: boolean;
  partialMech?: boolean;
  partialRp?: boolean;
  isPartial?: boolean;
  matchType?: "full" | "mech_only" | "rp_only" | "none";
  usedClue?: boolean;
  cluePenalty?: number;
  isExcess?: boolean;
  hasInvalidMech?: boolean;
  hasInvalidRp?: boolean;
}

export function grade(
  rpId: string | string[] | null | undefined,
  mechId: string | string[] | null | undefined,
  caseCard: CaseCard,
  usedClue?: boolean
): GradeResult {
  const cleanRps = Array.isArray(rpId)
    ? (rpId.flatMap(r => (r ? String(r).split(",") : [])).map(r => r.trim()).filter(Boolean))
    : (rpId && String(rpId).trim() ? String(rpId).split(",").map(r => r.trim()).filter(Boolean) : []);

  const cleanMechs = Array.isArray(mechId)
    ? (mechId.flatMap(m => (m ? String(m).split(",") : [])).map(m => m.trim()).filter(Boolean))
    : (mechId && String(mechId).trim() ? String(mechId).split(",").map(m => m.trim()).filter(Boolean) : []);

  if (cleanRps.length === 0 && cleanMechs.length === 0) {
    return { 
      correct: false, 
      points: 0, 
      rpOk: false, 
      mechOk: false,
      partialMech: false,
      partialRp: false,
      isPartial: false,
      matchType: "none",
      usedClue: !!usedClue,
      cluePenalty: 0,
      isExcess: false,
      hasInvalidMech: false,
      hasInvalidRp: false
    };
  }

  // Check if student submitted excess cards (>1 mech or >1 RP)
  const isExcessMech = cleanMechs.length > 1;
  const isExcessRp = cleanRps.length > 1;
  const isExcess = isExcessMech || isExcessRp;

  // Check if any submitted card is invalid
  const hasInvalidMech = cleanMechs.some(m => !caseCard.acceptedMechIds.includes(m));
  const hasInvalidRp = cleanRps.some(r => !caseCard.acceptedRpIds.includes(r));

  // Anti-guessing rule:
  // If excess cards submitted (>1 mech or >1 RP), or if multiple mechanisms contain invalid one:
  // Teacher specification: "ถ้าแบบตอบมาเกินหรือมีกลไกลที่ผิดและถูกเอาเป็นหักคะแนนหรือได้ 0 ไปเลยนะ"
  if (isExcess || (cleanMechs.length > 1 && hasInvalidMech) || (cleanRps.length > 1 && hasInvalidRp)) {
    return {
      correct: false,
      points: 0,
      rpOk: false,
      mechOk: false,
      partialMech: false,
      partialRp: false,
      isPartial: false,
      matchType: "none",
      usedClue: !!usedClue,
      cluePenalty: 0,
      isExcess,
      hasInvalidMech,
      hasInvalidRp
    };
  }

  // Normal submission (at most 1 RP and at most 1 Mech):
  // For mechanism, even if the case has multiple valid mechanisms (e.g. 2 or 3),
  // answering ANY 1 valid mechanism satisfies mechOk!
  const rpOk = Boolean(cleanRps.length === 1 && caseCard.acceptedRpIds.includes(cleanRps[0]));
  const mechOk = Boolean(cleanMechs.length === 1 && caseCard.acceptedMechIds.includes(cleanMechs[0]));
  const correct = rpOk && mechOk;
  const partialMech = !rpOk && mechOk;
  const partialRp = rpOk && !mechOk;
  const isPartial = partialMech || partialRp;

  let matchType: "full" | "mech_only" | "rp_only" | "none" = "none";
  if (correct) {
    matchType = "full";
  } else if (partialMech) {
    matchType = "mech_only";
  } else if (partialRp) {
    matchType = "rp_only";
  }

  let points = 0;
  let cluePenalty = 0;

  if (correct) {
    if (usedClue) {
      cluePenalty = 1;
      points = Math.max(0, caseCard.points - 1);
    } else {
      points = caseCard.points;
    }
  } else if (isPartial) {
    // Either one matched! (RP only or MECH only)
    // Teacher specification: "เลือกอันใดอันหนึ่งก็จะได้คะแนนหนึ่งคะแนน... ถ้าฟ้าผิดก็หักครึ่งตามกฎเดิมนะ"
    const halfBase = Math.max(1, Math.round(caseCard.points / 2));
    if (usedClue) {
      cluePenalty = 0.5;
      points = Math.max(1, Math.round(halfBase - 0.5));
    } else {
      points = halfBase;
    }
  }

  return {
    correct,
    points,
    rpOk,
    mechOk,
    partialMech,
    partialRp,
    isPartial,
    matchType,
    usedClue: !!usedClue,
    cluePenalty,
    isExcess,
    hasInvalidMech,
    hasInvalidRp
  };
}

export function gradeAnswer(
  caseCard: CaseCard,
  rpId: string | string[] | null | undefined,
  mechId: string | string[] | null | undefined,
  usedClue?: boolean
) {
  const res = grade(rpId, mechId, caseCard, usedClue);
  return {
    ...res,
    scoreAwarded: res.points,
    rpMatch: res.rpOk,
    mechMatch: res.mechOk,
    partialMech: res.partialMech,
    partialRp: res.partialRp,
    isPartial: res.isPartial,
    matchType: res.matchType
  };
}
