import { describe, expect, it } from "vitest";
import { getStartedRoomPath, isValidRoomState, upsertRoomPlayer } from "./room";
import type { PublicPlayer, PublicRoomState } from "./types";

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

describe("started classroom routing", () => {
  const startedRoom: PublicRoomState = {
    code: "609975",
    hostId: "p_teacher",
    phase: "DEAL",
    roundIndex: 1,
    totalRounds: 10,
    caseCardId: null,
    clueCardId: null,
    sharedMechanisms: [],
    endsAt: 0,
    players: [],
    settings: { totalRounds: 10, thinkSeconds: 30, basicCount: 6, clinicalCount: 4, hintAtPercent: 0, swapEvery: 3, maxPlayers: 55, minPlayersToStart: 1, allowBots: false, spotlightMode: "big-card" },
  };

  it("routes a student to the matching started classroom", () => {
    expect(getStartedRoomPath(startedRoom, "609975", "student")).toBe("/play/?code=609975&mode=kahoot");
    expect(isValidRoomState(startedRoom, "609975")).toBe(true);
    expect(isValidRoomState({ ...startedRoom, code: 123 }, "609975")).toBe(false);
  });

  it("does not route on lobby, a different room, invalid phase, or the host's device", () => {
    expect(getStartedRoomPath({ ...startedRoom, phase: "LOBBY" }, "609975", "student")).toBeNull();
    expect(getStartedRoomPath(startedRoom, "123456", "student")).toBeNull();
    expect(getStartedRoomPath({ ...startedRoom, phase: "UNKNOWN" }, "609975", "student")).toBeNull();
    expect(getStartedRoomPath(startedRoom, "609975", "teacher")).toBeNull();
  });

  it("keeps a started six-seat room in table mode", () => {
    const tableRoom = { ...startedRoom, settings: { ...startedRoom.settings, maxPlayers: 6, spotlightMode: undefined } };
    expect(getStartedRoomPath(tableRoom, "609975", "student")).toBe("/play/?code=609975&mode=table");
  });
});
