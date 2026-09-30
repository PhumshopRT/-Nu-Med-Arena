import { CaseCard } from "./types";

export interface GradeResult {
  correct: boolean;
  points: number;
  rpOk: boolean;
  mechOk: boolean;
  partialMech?: boolean;
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
  if (!rpId || !mechId) {
    return { 
      correct: false, 
      points: 0, 
      rpOk: false, 
      mechOk: false,
      partialMech: false,
      matchType: "none",
      usedClue: !!usedClue,
      cluePenalty: 0
    };
  }
  const rpOk = caseCard.acceptedRpIds.includes(rpId);
  const mechOk = caseCard.acceptedMechIds.includes(mechId);
  const correct = rpOk && mechOk;
  const partialMech = !rpOk && mechOk;
  const partialRp = rpOk && !mechOk;

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
  } else if (partialMech) {
    // Mechanism matched! Award half points (50% from question) as requested
    const halfBase = Math.round(caseCard.points / 2);
    if (usedClue) {
      cluePenalty = 0.5;
      points = Math.max(1, Math.round(halfBase - 0.5));
    } else {
      points = Math.max(1, halfBase);
    }
  }

  return {
    correct,
    points,
    rpOk,
    mechOk,
    partialMech,
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
    matchType: res.matchType
  };
}
