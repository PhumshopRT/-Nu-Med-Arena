import { CaseCard } from "./types";

export interface GradeResult {
  correct: boolean;
  points: number;
  rpOk: boolean;
  mechOk: boolean;
}

export function grade(
  rpId: string | null | undefined,
  mechId: string | null | undefined,
  caseCard: CaseCard
): GradeResult {
  if (!rpId || !mechId) {
    return { correct: false, points: 0, rpOk: false, mechOk: false };
  }
  const rpOk = caseCard.acceptedRpIds.includes(rpId);
  const mechOk = caseCard.acceptedMechIds.includes(mechId);
  const correct = rpOk && mechOk;

  return {
    correct,
    points: correct ? caseCard.points : 0,
    rpOk,
    mechOk,
  };
}
