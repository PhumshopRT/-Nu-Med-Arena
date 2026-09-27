import { RADIOPHARMACEUTICAL_DECK } from "./rp";
import { MECHANISM_DECK } from "./mech";
import { CASE_DECK } from "./cases";
import { CLUE_DECK } from "./clues";
import { AnyCard } from "../types";

export * from "./rp";
export * from "./mech";
export * from "./cases";
export * from "./clues";

export const ALL_CARDS: AnyCard[] = [
  ...RADIOPHARMACEUTICAL_DECK,
  ...MECHANISM_DECK,
  ...CASE_DECK,
  ...CLUE_DECK
];

export const CARD_MAP = new Map<string, AnyCard>(
  ALL_CARDS.map((card) => [card.id, card])
);

export const ALL_RP_CARDS = RADIOPHARMACEUTICAL_DECK;
export const ALL_MECH_CARDS = MECHANISM_DECK;
export const ALL_CASE_CARDS = CASE_DECK;
export const ALL_CLUE_CARDS = CLUE_DECK;

export const PROTOTYPE_4_CARDS = {
  rp: RADIOPHARMACEUTICAL_DECK.find((c) => c.id === "R-01")!,
  mech: MECHANISM_DECK.find((c) => c.id === "M-03")!,
  caseCard: CASE_DECK.find((c) => c.id === "C-05")!,
  clue: CLUE_DECK.find((c) => c.id === "T-03")!,
};
