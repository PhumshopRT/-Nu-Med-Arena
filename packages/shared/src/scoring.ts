/** Kahoot-style score: correct answers earn 1–100 based on remaining time. */
export function calculateKahootScore(
  correct: boolean,
  timeRemainingSeconds: number,
  totalTimeSeconds: number
): number {
  if (!correct) return 0;

  const total = Math.max(1, Number.isFinite(totalTimeSeconds) ? totalTimeSeconds : 1);
  const remaining = Math.min(
    total,
    Math.max(0, Number.isFinite(timeRemainingSeconds) ? timeRemainingSeconds : 0)
  );
  return Math.max(1, Math.ceil((remaining / total) * 100));
}
