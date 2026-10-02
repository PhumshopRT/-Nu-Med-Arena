import { RoomSettings, PublicPlayer, CaseCard, RadiopharmaceuticalCard, PublicRoomState, MatchPhase } from "./types";
import { ALL_RP_CARDS, ALL_MECH_CARDS } from "./cards/seed";

// Room code alphabet excluding ambiguous characters: 0, O, 1, I, L
const SAFE_ROOM_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

const MATCH_PHASES: MatchPhase[] = [
  "LOBBY", "DEAL", "SHOW_CASE", "THINK", "LOCKED", "REVEAL", "SWAP", "NEXT_CASE", "TIEBREAK", "RESULT",
];

/** Validate the minimum room envelope used for state-driven client decisions. */
export function isValidRoomState(candidate: unknown, expectedCode: string): candidate is PublicRoomState {
  if (!candidate || typeof candidate !== "object") return false;
  const room = candidate as Partial<PublicRoomState>;
  return Boolean(
    typeof room.code === "string" && room.code.trim().toUpperCase() === expectedCode.trim().toUpperCase() &&
    typeof room.hostId === "string" && room.hostId.length > 0 &&
    typeof room.phase === "string" && MATCH_PHASES.includes(room.phase as MatchPhase) &&
    Number.isInteger(room.roundIndex) && Number.isInteger(room.totalRounds) &&
    room.settings && Number.isFinite(room.settings.maxPlayers) &&
    Array.isArray(room.players) && room.players.every((player) =>
      Boolean(player && typeof player.id === "string" && typeof player.studentId === "string")
    )
  );
}

/** Resolve the student destination only from a started room with a matching identity. */
export function getStartedRoomPath(
  candidate: unknown,
  expectedCode: string,
  studentId: string
): string | null {
  if (!isValidRoomState(candidate, expectedCode) || candidate.phase === "LOBBY") return null;
  const room = candidate;
  const code = expectedCode.trim().toUpperCase();

  if (room.hostId === `p_${studentId}`) return null;
  const isClassroom = room.settings.spotlightMode === "big-card" || room.settings.maxPlayers > 6;
  return isClassroom
    ? `/play/?code=${encodeURIComponent(code)}&mode=kahoot`
    : `/play/?code=${encodeURIComponent(code)}&mode=table`;
}

/**
 * Generate a 6-digit numeric Game PIN for Kahoot classroom mode (e.g. "482915")
 */
export function generateKahootPin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateRoomCode(mode: "kahoot" | "table" = "table", length: number = 6): string {
  if (mode === "kahoot") {
    return generateKahootPin();
  }
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * SAFE_ROOM_CHARS.length);
    result += SAFE_ROOM_CHARS[randomIndex];
  }
  return result;
}

export const DEFAULT_ROOM_SETTINGS: RoomSettings = {
  totalRounds: 10,
  thinkSeconds: 30,
  basicCount: 6,
  clinicalCount: 4,
  hintAtPercent: 0,
  swapEvery: 3,
  maxPlayers: 55,
  minPlayersToStart: 1,
  allowBots: false,
  spotlightMode: "big-card",
};

/** Add or refresh one participant without exceeding the room's actual capacity. */
export function upsertRoomPlayer(
  players: PublicPlayer[],
  incoming: PublicPlayer,
  capacity: number
): PublicPlayer[] {
  const existingIndex = players.findIndex(
    (player) => player.studentId === incoming.studentId || player.id === incoming.id
  );

  if (existingIndex >= 0) {
    const updated = [...players];
    const existing = updated[existingIndex];
    updated[existingIndex] = {
      ...existing,
      name: incoming.name,
      avatar: incoming.avatar ?? existing.avatar,
      title: incoming.title ?? existing.title,
      frame: incoming.frame ?? existing.frame,
    };
    return updated;
  }

  if (players.length >= Math.max(0, capacity)) return players;
  return [...players, incoming];
}

export interface BotProfile {
  id: string;
  name: string;
  avatar: string;
  accuracy: number; // 0 to 1
  delayRangeMs: [number, number];
}

export const BOTS: BotProfile[] = [
  {
    id: "bot_resin",
    name: "บอท-เรซิน",
    avatar: "🧪",
    accuracy: 0.65,
    delayRangeMs: [10000, 25000],
  },
  {
    id: "bot_colloid",
    name: "บอท-คอลลอยด์",
    avatar: "🔬",
    accuracy: 0.85,
    delayRangeMs: [6000, 18000],
  },
  {
    id: "bot_gamma",
    name: "บอท-แกมม่า",
    avatar: "🐶",
    accuracy: 0.50,
    delayRangeMs: [12000, 30000],
  },
];

export function simulateBotAnswer(
  bot: BotProfile,
  caseCard: CaseCard,
  botHand: RadiopharmaceuticalCard[]
): { rpId: string; mechId: string } {
  const isAccurate = Math.random() < bot.accuracy;

  let chosenRpId: string;
  let chosenMechId: string;

  if (isAccurate && caseCard.acceptedRpIds.length > 0) {
    // Pick an accepted RP from hand if available, else pick first accepted RP
    const matchedInHand = botHand.find((c) => caseCard.acceptedRpIds.includes(c.id));
    chosenRpId = matchedInHand ? matchedInHand.id : caseCard.acceptedRpIds[0];
    chosenMechId = caseCard.acceptedMechIds[0];
  } else {
    // Pick random from hand
    chosenRpId = botHand.length > 0 ? botHand[Math.floor(Math.random() * botHand.length)].id : ALL_RP_CARDS[0].id;
    // Pick random mech
    chosenMechId = ALL_MECH_CARDS[Math.floor(Math.random() * ALL_MECH_CARDS.length)].id;
  }

  return { rpId: chosenRpId, mechId: chosenMechId };
}
