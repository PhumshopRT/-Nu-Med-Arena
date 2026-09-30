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

  it("PE case (C-05) + FDG (R-01) + Capillary Blockade (M-03) = 2 points (half score for correct mechanism)", () => {
    const res = grade("R-01", "M-03", c05);
    expect(res.correct).toBe(false);
    expect(res.partialMech).toBe(true);
    expect(res.points).toBe(2);
    expect(res.rpOk).toBe(false);
    expect(res.mechOk).toBe(true);
  });

  it("PE case (C-05) + MAA (R-07) + Facilitated Diffusion (M-02) = 2 points (half score for correct RP)", () => {
    const res = grade("R-07", "M-02", c05);
    expect(res.correct).toBe(false);
    expect(res.isPartial).toBe(true);
    expect(res.partialRp).toBe(true);
    expect(res.points).toBe(2);
    expect(res.rpOk).toBe(true);
    expect(res.mechOk).toBe(false);
  });

  it("Single-card submission: RP only correct (R-07, null) on C-05 = 2 points", () => {
    const res = grade("R-07", null, c05);
    expect(res.correct).toBe(false);
    expect(res.isPartial).toBe(true);
    expect(res.partialRp).toBe(true);
    expect(res.points).toBe(2);
  });

  it("Single-card submission: MECH only correct (null, M-03) on C-05 = 2 points", () => {
    const res = grade(null, "M-03", c05);
    expect(res.correct).toBe(false);
    expect(res.isPartial).toBe(true);
    expect(res.partialMech).toBe(true);
    expect(res.points).toBe(2);
  });

  it("Single-card submission on BASIC case (C-B06): RP only (R-07, '') = 1 point", () => {
    const res = grade("R-07", "", cb06);
    expect(res.correct).toBe(false);
    expect(res.isPartial).toBe(true);
    expect(res.points).toBe(1);
  });

  it("Single-card submission on BASIC case (C-B06): MECH only ('', M-03) = 1 point", () => {
    const res = grade("", "M-03", cb06);
    expect(res.correct).toBe(false);
    expect(res.isPartial).toBe(true);
    expect(res.points).toBe(1);
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

    // 3. With clue and correct mech only -> half points with partial clue penalty
    const resMechOnlyWithClue = grade("R-01", "M-03", c05, true);
    expect(resMechOnlyWithClue.correct).toBe(false);
    expect(resMechOnlyWithClue.partialMech).toBe(true);
    expect(resMechOnlyWithClue.points).toBe(2);

    // 4. Totally wrong with clue -> 0 points
    const resWrongWithClue = grade("R-01", "M-02", c05, true);
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

    // Partial match on cb06 (points: 2) -> gives 1 point (half)
    const resPartialWithClue = grade("R-01", "M-03", cb06, true);
    expect(resPartialWithClue.correct).toBe(false);
    expect(resPartialWithClue.partialMech).toBe(true);
    expect(resPartialWithClue.points).toBe(1);

    // Totally wrong on cb06 -> gives 0 points
    const resWrongWithClue = grade("R-01", "M-02", cb06, true);
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

