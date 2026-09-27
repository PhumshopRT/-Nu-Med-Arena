import { describe, it, expect } from "vitest";
import { grade } from "./grading";
import { CASE_DECK } from "./cards/cases";

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

  it("Bone metastasis case (C-02) + NaF (R-11) + Ion Exchange (M-11) = 4 points", () => {
    const res = grade("R-11", "M-11", c02);
    expect(res.correct).toBe(true);
    expect(res.points).toBe(4);
  });
});
