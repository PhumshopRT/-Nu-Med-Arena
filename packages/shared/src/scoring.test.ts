import { describe, expect, it } from "vitest";
import { calculateKahootScore } from "./scoring";

describe("Kahoot score", () => {
  it("awards 100 for an immediate correct answer and decreases with time", () => {
    expect(calculateKahootScore(true, 30, 30)).toBe(100);
    expect(calculateKahootScore(true, 15, 30)).toBe(50);
    expect(calculateKahootScore(true, 1, 30)).toBe(4);
  });

  it("awards no points for an incorrect answer and at least one for a correct answer at timeout", () => {
    expect(calculateKahootScore(false, 30, 30)).toBe(0);
    expect(calculateKahootScore(true, 0, 30)).toBe(1);
  });

  it("clamps invalid or out-of-range times", () => {
    expect(calculateKahootScore(true, 99, 30)).toBe(100);
    expect(calculateKahootScore(true, Number.NaN, 30)).toBe(1);
    expect(calculateKahootScore(true, 30, 0)).toBe(100);
  });
});
