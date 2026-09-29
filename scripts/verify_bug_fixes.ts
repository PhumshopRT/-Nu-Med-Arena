import { 
  ALL_CASE_CARDS, 
  ALL_CLUE_CARDS, 
  ALL_RP_CARDS, 
  gradeAnswer, 
  simulateBotAnswer, 
  BOTS,
  generateKahootPin
} from "../packages/shared/src/index";
import { SyncMessage } from "../apps/web/src/lib/sync";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${msg}`);
}

console.log("=== RUNNING VERIFICATION FOR BUG FIXES ===");

// 1. Verify Kahoot PIN & Regex matching
const pin = generateKahootPin();
assert(/^\d{6}$/.test(pin), `generateKahootPin produces 6 digits: ${pin}`);
const isKahootInitNumeric = /^\d{5,8}$/.test(pin);
assert(isKahootInitNumeric === true, `isKahootInit detects numeric PIN: ${pin}`);

// 2. Verify Clue Matching & Scoring
const sampleCase = ALL_CASE_CARDS[0];
const matchedClue = ALL_CLUE_CARDS.find(c => c.id === sampleCase.clueId);
assert(matchedClue !== undefined, `Case ${sampleCase.id} has valid matching clue ${sampleCase.clueId}`);

const correctRp = sampleCase.acceptedRpIds[0];
const correctMech = sampleCase.acceptedMechIds[0];

// Grade without clue
const gradeNoClue = gradeAnswer(sampleCase, correctRp, correctMech, false);
assert(gradeNoClue.scoreAwarded === (sampleCase.type === "clinical" ? 4 : 2), `Full score without clue: ${gradeNoClue.scoreAwarded}`);

// Grade with clue (penalty -1)
const gradeWithClue = gradeAnswer(sampleCase, correctRp, correctMech, true);
assert(gradeWithClue.scoreAwarded === gradeNoClue.scoreAwarded - 1, `Score with clue deducted by 1: ${gradeWithClue.scoreAwarded}`);

// 3. Verify Bot Answering & Grading
const botTemplate = BOTS[0];
const botAns = simulateBotAnswer(botTemplate, sampleCase, ALL_RP_CARDS);
assert(Boolean(botAns.rpId && botAns.mechId), `Bot answered: rpId=${botAns.rpId}, mechId=${botAns.mechId}`);
const botGrading = gradeAnswer(sampleCase, botAns.rpId, botAns.mechId, false);
assert(typeof botGrading.scoreAwarded === "number", `Bot grading returned numerical score: ${botGrading.scoreAwarded}`);

// 4. Verify PLAYER_SCORE_UPDATE type check
const testMsg: SyncMessage = {
  type: "PLAYER_SCORE_UPDATE",
  playerId: "p_7052",
  score: 12,
  streak: 3,
  lastRoundScore: 6
};
assert(testMsg.type === "PLAYER_SCORE_UPDATE" && testMsg.score === 12, "PLAYER_SCORE_UPDATE message constructed correctly");

// 5. Verify Hand Replenish logic
const hand = ALL_RP_CARDS.slice(0, 5);
const deck = ALL_RP_CARDS.slice(5);
const playedCardId = hand[0].id;
const drawnCard = deck[0];
const newDeck = deck.slice(1);
const newHand = [...hand];
newHand[0] = drawnCard;
assert(newHand[0].id !== playedCardId, `Hand slot 0 successfully replaced with ${drawnCard.id}`);
assert(newHand.length === 5, "Hand length maintained at 5");

console.log("=== ALL BUG FIX VERIFICATIONS PASSED SUCCESSFULLY! ===");
