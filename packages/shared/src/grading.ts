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
}

export function grade(
  rpId: string | null | undefined,
  mechId: string | null | undefined,
  caseCard: CaseCard,
  usedClue?: boolean
): GradeResult {
  const cleanRp = rpId && rpId.trim() ? rpId.trim() : null;
  const cleanMech = mechId && mechId.trim() ? mechId.trim() : null;

  if (!cleanRp && !cleanMech) {
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
      cluePenalty: 0
    };
  }

  const rpOk = Boolean(cleanRp && caseCard.acceptedRpIds.includes(cleanRp));
  const mechOk = Boolean(cleanMech && caseCard.acceptedMechIds.includes(cleanMech));
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
    // Teacher specification: "เลือกอันใดอันหนึ่งก็จะได้คะแนนหนึ่งคะแนน... แต่ถ้าใครเลือกสองใบพร้อมกันจะได้คะแนนเต็ม"
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
  };
}

export function gradeAnswer(
  caseCard: CaseCard,
  rpId: string | null | undefined,
  mechId: string | null | undefined,
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
