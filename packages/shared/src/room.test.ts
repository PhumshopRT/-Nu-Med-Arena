import { describe, expect, it } from "vitest";
import { upsertRoomPlayer } from "./room";
import type { PublicPlayer } from "./types";

function player(index: number): PublicPlayer {
  return {
    id: `p_${index}`,
    studentId: `S${index}`,
    name: `Player ${index}`,
    ready: true,
    locked: false,
    score: 0,
    handCount: 5,
  };
}

describe("classroom room capacity", () => {
  it("accepts 55 distinct participants and rejects the 56th", () => {
    const players = Array.from({ length: 55 }, (_, index) => player(index + 1));
    const joined = players.reduce(
      (current, participant) => upsertRoomPlayer(current, participant, 55),
      [] as PublicPlayer[]
    );

    expect(joined).toHaveLength(55);
    expect(upsertRoomPlayer(joined, player(56), 55)).toBe(joined);
  });

  it("deduplicates simultaneous join and state-request messages by student", () => {
    const firstJoin = player(1);
    const refreshed = { ...firstJoin, name: "Updated name" };
    const once = upsertRoomPlayer([], firstJoin, 55);
    const twice = upsertRoomPlayer(once, refreshed, 55);

    expect(twice).toHaveLength(1);
    expect(twice[0].name).toBe("Updated name");
  });

  it("does not reset score or answer lock when an existing player reconnects", () => {
    const existing = { ...player(1), score: 42, locked: true, streak: 3 };
    const rejoin = { ...player(1), name: "Player One" };
    const updated = upsertRoomPlayer([existing], rejoin, 55);

    expect(updated[0]).toMatchObject({ score: 42, locked: true, streak: 3 });
  });
});
