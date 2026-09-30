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

  // ASVS V2.2: enforce a small, deterministic bound on untrusted player submissions.
  // Three mechanisms are allowed; the accepted answer IDs remain alternatives, not a required count.
  const isExcessMech = cleanMechs.length > 3;
  const isExcessRp = cleanRps.length > 1;
  const isExcess = isExcessMech || isExcessRp;

  // Check if any submitted card is invalid
  const hasInvalidMech = cleanMechs.some(m => !caseCard.acceptedMechIds.includes(m));
  const hasInvalidRp = cleanRps.some(r => !caseCard.acceptedRpIds.includes(r));
  const hasDuplicateMech = new Set(cleanMechs).size !== cleanMechs.length;

  // Preserve anti-guessing: any unaccepted submitted card invalidates that answer set.
  if (isExcess || hasDuplicateMech || (cleanMechs.length > 1 && hasInvalidMech) || (cleanRps.length > 1 && hasInvalidRp)) {
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

  // A player may submit one to three mechanisms; all must be accepted, with no answer-key count exposed.
  const rpOk = Boolean(cleanRps.length === 1 && caseCard.acceptedRpIds.includes(cleanRps[0]));
  const mechOk = Boolean(cleanMechs.length >= 1 && cleanMechs.length <= 3 && cleanMechs.every(m => caseCard.acceptedMechIds.includes(m)));
  const correct = rpOk && mechOk;
  // Teacher rule: "คือไม่นับการ์ดฟ้าสิกฎอ่ะ เอาแค่การ์ดเหลืองที่ถูกก็ได้คะแนนครึ่งนึงง"
  // Partial score is awarded EXCLUSIVELY when Mechanism (yellow card) is correct.
  // Getting only RP (blue card) right with wrong/missing mechanism earns 0 points.
  const partialMech = !rpOk && mechOk;
  const partialRp = false;
  const isPartial = partialMech;

  let matchType: "full" | "mech_only" | "rp_only" | "none" = "none";
  if (correct) {
    matchType = "full";
  } else if (partialMech) {
    matchType = "mech_only";
  } else if (rpOk && !mechOk) {
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
    // Only Mechanism (yellow card) matched!
    // Teacher specification: "เอาแค่การ์ดเหลืองที่ถูกก็ได้คะแนนครึ่งนึงง"
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
