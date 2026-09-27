import { RoomSettings, PublicPlayer, CaseCard, RadiopharmaceuticalCard } from "./types";
import { ALL_RP_CARDS, ALL_MECH_CARDS } from "./cards/seed";

// Room code alphabet excluding ambiguous characters: 0, O, 1, I, L
const SAFE_ROOM_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateRoomCode(length: number = 6): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * SAFE_ROOM_CHARS.length);
    result += SAFE_ROOM_CHARS[randomIndex];
  }
  return result;
}

export const DEFAULT_ROOM_SETTINGS: RoomSettings = {
  totalRounds: 10,
  thinkSeconds: 45,
  basicCount: 6,
  clinicalCount: 4,
  hintAtPercent: 50,
  swapEvery: 3,
  maxPlayers: 6,
  minPlayersToStart: 1,
  allowBots: true,
};

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
