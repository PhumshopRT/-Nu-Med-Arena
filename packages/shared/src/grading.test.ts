import { describe, it, expect } from "vitest";
import { grade } from "./grading";
import { CASE_DECK, validateCaseClues } from "./cards/cases";

describe("Rule Engine: Card Grading", () => {
  const c05 = CASE_DECK.find((c) => c.id === "C-05")!;
  const cb06 = CASE_DECK.find((c) => c.id === "C-B06")!;
  const c02 = CASE_DECK.find((c) => c.id === "C-02")!;

  it("PE case (C-05) + MAA (R-07) + Capillary Blockade (M-03) = 4 points", () => {
    const res = grade("R-07", "M-03", c05);
    expect(res.correct).toBe(true);
    expect(res.points).toBe(4);
    expect(res.rpOk).toBe(true);
    expect(res.mechOk).toBe(true);
  });

  it("PE case (C-05) + FDG (R-01) + Capillary Blockade (M-03) = 0 points", () => {
    const res = grade("R-01", "M-03", c05);
    expect(res.correct).toBe(false);
    expect(res.points).toBe(0);
    expect(res.rpOk).toBe(false);
    expect(res.mechOk).toBe(true);
  });

  it("PE case (C-05) + MAA (R-07) + Facilitated Diffusion (M-02) = 0 points", () => {
    const res = grade("R-07", "M-02", c05);
    expect(res.correct).toBe(false);
    expect(res.points).toBe(0);
    expect(res.rpOk).toBe(true);
    expect(res.mechOk).toBe(false);
  });

  it("BASIC Lung Perfusion (C-B06) + MAA (R-07) + Capillary Blockade (M-03) = 2 points", () => {
    const res = grade("R-07", "M-03", cb06);
    expect(res.correct).toBe(true);
    expect(res.points).toBe(2);
  });

  it("Bone metastasis case (C-02) + MDP (R-05) + Chemisorption (M-06) = 4 points", () => {
    const res = grade("R-05", "M-06", c02);
    expect(res.correct).toBe(true);
    expect(res.points).toBe(4);
  });

  it("Clue penalty on C-05: without clue gives 4 points, with clue gives 3 points, wrong with clue gives 0 points", () => {
    // 1. Without clue -> 4 points
    const resNoClue = grade("R-07", "M-03", c05, false);
    expect(resNoClue.correct).toBe(true);
    expect(resNoClue.points).toBe(4);
    expect(resNoClue.cluePenalty).toBe(0);

    // 2. With clue -> 3 points (-1 penalty)
    const resWithClue = grade("R-07", "M-03", c05, true);
    expect(resWithClue.correct).toBe(true);
    expect(resWithClue.points).toBe(3);
    expect(resWithClue.cluePenalty).toBe(1);

    // 3. With clue but wrong -> 0 points (penalty is 0)
    const resWrongWithClue = grade("R-01", "M-03", c05, true);
    expect(resWrongWithClue.correct).toBe(false);
    expect(resWrongWithClue.points).toBe(0);
    expect(resWrongWithClue.cluePenalty).toBe(0);
  });

  it("Clue penalty on BASIC case (C-B06): without clue = 2, with clue = 1, wrong = 0", () => {
    const resNoClue = grade("R-07", "M-03", cb06, false);
    expect(resNoClue.correct).toBe(true);
    expect(resNoClue.points).toBe(2);
    expect(resNoClue.cluePenalty).toBe(0);

    const resWithClue = grade("R-07", "M-03", cb06, true);
    expect(resWithClue.correct).toBe(true);
    expect(resWithClue.points).toBe(1);
    expect(resWithClue.cluePenalty).toBe(1);

    const resWrongWithClue = grade("R-01", "M-03", cb06, true);
    expect(resWrongWithClue.correct).toBe(false);
    expect(resWrongWithClue.points).toBe(0);
  });

  it("C-05 clue mapping: C-05 must map to lung capillary clue T-01, never thyroid", () => {
    expect(c05.clueId).toBe("T-01");
    expect(c05.clueId).not.toBe("T-03");
  });

  it("All cases in CASE_DECK must have valid clueId defined", () => {
    const { valid, missingClueCaseIds } = validateCaseClues();
    expect(valid).toBe(true);
    expect(missingClueCaseIds).toEqual([]);
  });
});

