export type CardType = "RP" | "MECH" | "CASE" | "CLUE";

export interface CardBase {
  id: string;            // R-01, M-03, C-05, T-03
  type: CardType;
  titleTh: string;
  titleEn: string;
  subtitle?: string;
  body: string[];        // bullet points
  illustration: string;  // svg key (e.g. 'thyroid', 'lung', 'bone', 'liver_spleen', 'cell', 'capillary')
  tags: string[];
  disabled?: boolean; // switch to enable/disable card from being dealt
}

export interface RadiopharmaceuticalCard extends CardBase {
  type: "RP";
  nuclide: string;       // 18F, 99mTc, 123I, 111In, 68Ga, 201Tl
  modality: "PET" | "SPECT" | "BOTH";
  target: string;
  transporter?: string;
  mechanismId: string;   // primary mechanism
  altMechanismIds?: string[];
  application: string;
}

export interface MechanismCard extends CardBase {
  type: "MECH";
  physicsNote?: string;
}

export interface CaseCard extends CardBase {
  type: "CASE";
  difficulty: "BASIC" | "CLINICAL";
  promptTh: string;
  organHint?: string;
  acceptedRpIds: string[];
  acceptedMechIds: string[];
  explanationTh: string;
  points: number; // 2, 4, 8, 16
  clueId?: string; // Mapped specific clue card ID from CLUE_DECK
}

export interface ClueCard extends CardBase {
  type: "CLUE";
  clueKind: "TARGET" | "WHY" | "TRAIT";
  reveals: string;
}

export type AnyCard = RadiopharmaceuticalCard | MechanismCard | CaseCard | ClueCard;

export interface RoomSettings {
  totalRounds: number;
  thinkSeconds: number;
  basicCount: number;
  clinicalCount: number;
  hintAtPercent: number;
  swapEvery: number;
  maxPlayers: number;
  minPlayersToStart: number;
  allowBots: boolean;
  spotlightMode?: "big-card" | "text";
}

export type MatchPhase =
  | "LOBBY"
  | "DEAL"
  | "SHOW_CASE"
  | "THINK"
  | "LOCKED"
  | "REVEAL"
  | "SWAP"
  | "NEXT_CASE"
  | "TIEBREAK"
  | "RESULT";

export interface PublicPlayer {
  id: string;
  name: string;
  studentId: string;
  ready: boolean;
  locked: boolean;
  score: number;
  handCount: number;
  selectedRpId?: string; // only revealed during REVEAL
  selectedMechId?: string; // only revealed during REVEAL
  usedClue?: boolean; // private to player or revealed in REVEAL
  lastAnswerResult?: {
    correct: boolean;
    points: number;
    rpOk: boolean;
    mechOk: boolean;
    usedClue?: boolean;
    cluePenalty?: number;
  };
  isBot?: boolean;
  avatar?: string;
  title?: string;
  frame?: string;
}

export interface PublicRoomState {
  code: string;
  hostId: string;
  phase: MatchPhase;
  roundIndex: number;
  totalRounds: number;
  caseCardId: string | null;
  clueCardId: string | null;
  sharedMechanisms: string[];
  endsAt: number;
  players: PublicPlayer[];
  settings: RoomSettings;
}

export interface StudentUser {
  studentId: string;
  displayName: string;
  xp: number;
  coins: number;
  equipped: {
    frame: string;
    cardback: string;
    avatar: string;
    fx: string;
    title: string;
  };
}

export interface ShopItem {
  id: string;
  nameTh: string;
  price: number;
  kind: "frame" | "cardback" | "avatar" | "fx" | "title";
  previewUrl?: string;
  descriptionTh?: string;
}
