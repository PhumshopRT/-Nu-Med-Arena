import { CaseCard } from "./types";

export interface GradeResult {
  correct: boolean;
  points: number;
  rpOk: boolean;
  mechOk: boolean;
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
      usedClue: !!usedClue,
      cluePenalty: 0
    };
  }
  const rpOk = caseCard.acceptedRpIds.includes(rpId);
  const mechOk = caseCard.acceptedMechIds.includes(mechId);
  const correct = rpOk && mechOk;

  let points = 0;
  let cluePenalty = 0;

  if (correct) {
    if (usedClue) {
      cluePenalty = 1;
      points = Math.max(0, caseCard.points - 1);
    } else {
      points = caseCard.points;
    }
  }

  return {
    correct,
    points,
    rpOk,
    mechOk,
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
  };
}
