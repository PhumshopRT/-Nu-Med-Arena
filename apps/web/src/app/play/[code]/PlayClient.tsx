"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Lock, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  ChevronRight, 
  Coins, 
  Sparkles, 
  Award, 
  Layers, 
  Info 
} from "lucide-react";
import { 
  ALL_RP_CARDS, 
  ALL_MECH_CARDS, 
  ALL_CASE_CARDS, 
  ALL_CLUE_CARDS,
  RadiopharmaceuticalCard,
  MechanismCard,
  CaseCard,
  ClueCard,
  PublicRoomState,
  PublicPlayer,
  StudentUser,
  gradeAnswer,
  BOTS,
  simulateBotAnswer
} from "@nucmed/shared";
import { RpCard } from "@/components/cards/RpCard";
import { MechCard } from "@/components/cards/MechCard";
import { CaseCard as CaseCardComponent } from "@/components/cards/CaseCard";
import { ClueCard as ClueCardComponent } from "@/components/cards/ClueCard";
import { CardBack } from "@/components/cards/CardBack";
import { getLocalUser, addRewards, saveLocalUser } from "@/lib/user";
import { sounds } from "@/lib/sound";
import { createRoomSync, RoomSyncHandle, SyncMessage } from "@/lib/sync";

export function PlayClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawCode = (searchParams?.get("code") || params?.code || "ROOM01") as string;
  const roomCode = rawCode.toUpperCase();

  const [user, setUser] = useState<StudentUser | null>(null);
  const [room, setRoom] = useState<PublicRoomState | null>(null);

  // Match State
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(10);
  const [phase, setPhase] = useState<"DEAL" | "SHOW_CASE" | "THINK" | "LOCKED" | "REVEAL" | "SWAP" | "RESULT">("THINK");
  
  // Cards in play
  const [deck, setDeck] = useState<RadiopharmaceuticalCard[]>([]);
  const [hand, setHand] = useState<RadiopharmaceuticalCard[]>([]);
  const [currentCase, setCurrentCase] = useState<CaseCard>(ALL_CASE_CARDS[0]);
  const [currentClue, setCurrentClue] = useState<ClueCard | null>(null);
  const [isClueRevealed, setIsClueRevealed] = useState(false);

  // Player Selection
  const [selectedRp, setSelectedRp] = useState<RadiopharmaceuticalCard | null>(null);
  const [selectedMech, setSelectedMech] = useState<MechanismCard | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(45);
  const [maxTime, setMaxTime] = useState(45);

  // Players & Bots in match
  const [players, setPlayers] = useState<PublicPlayer[]>([]);
  const [lastRoundResult, setLastRoundResult] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [showExplanation, setShowExplanation] = useState(false);

  // Initialize match
  useEffect(() => {
    const localUser = getLocalUser();
    setUser(localUser);

    // Shuffle RP deck and deal 5 cards to player
    const shuffledRp = [...ALL_RP_CARDS].sort(() => Math.random() - 0.5);
    const initialHand = shuffledRp.slice(0, 5);
    const remainingDeck = shuffledRp.slice(5);

    setDeck(remainingDeck);
    setHand(initialHand);

    // Retrieve or initialize players
    const savedRoomKey = `nucmed_room_${roomCode}`;
    const saved = localStorage.getItem(savedRoomKey);
    let matchPlayers: PublicPlayer[] = [];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        matchPlayers = parsed.players;
        setTotalRounds(parsed.totalRounds || 10);
        setMaxTime(parsed.settings?.thinkSeconds || 45);
        setTimeLeft(parsed.settings?.thinkSeconds || 45);
      } catch {
        // fallback
      }
    }

    if (matchPlayers.length === 0) {
      // Create solo practice with 2 bots
      matchPlayers = [
        {
          id: `p_${localUser.studentId}`,
          name: localUser.displayName,
          studentId: localUser.studentId,
          ready: true,
          locked: false,
          score: 0,
          handCount: 5,
          avatar: "☢️"
        },
        {
          id: "bot_1",
          name: "บอท-เรซิน",
          studentId: "BOT-101",
          ready: true,
          locked: false,
          score: 0,
          handCount: 5,
          isBot: true,
          avatar: "🧪"
        },
        {
          id: "bot_2",
          name: "บอท-คอลลอยด์",
          studentId: "BOT-102",
          ready: true,
          locked: false,
          score: 0,
          handCount: 5,
          isBot: true,
          avatar: "🔬"
        }
      ];
    }

    setPlayers(matchPlayers);
    setupRound(1, shuffledRp.slice(5), initialHand);
  }, [roomCode]);

  // Setup a new round
  const setupRound = (roundNum: number, currentDeck: RadiopharmaceuticalCard[], currentHand: RadiopharmaceuticalCard[]) => {
    // Pick Case Card
    const caseIndex = (roundNum - 1) % ALL_CASE_CARDS.length;
    const caseCard = ALL_CASE_CARDS[caseIndex];
    setCurrentCase(caseCard);

    // Clue card matching
    const clueCard = ALL_CLUE_CARDS.find((c) => c.titleEn.toLowerCase().includes(caseCard.titleEn.split(" ")[0].toLowerCase())) || ALL_CLUE_CARDS[0];
    setCurrentClue(clueCard);
    setIsClueRevealed(false);

    // Reset selection & timer
    setSelectedRp(null);
    setSelectedMech(null);
    setIsLocked(false);
    setShowExplanation(false);
    setTimeLeft(maxTime);
    setPhase("THINK");

    // Reset player lock states
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        locked: false,
        selectedRpId: undefined,
        selectedMechId: undefined
      }))
    );

    sounds.playDraw();
  };

  // Timer countdown hook
  useEffect(() => {
    if (phase !== "THINK" && phase !== "LOCKED") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }

        // Play tick in last 5 seconds
        if (prev <= 6 && prev > 1) {
          sounds.playTick();
        }

        // Auto reveal clue at 50%
        if (prev === Math.floor(maxTime / 2) && !isClueRevealed) {
          setIsClueRevealed(true);
        }

        // Simulate bots locking in over time
        simulateBotsLocking(prev);

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, maxTime, isClueRevealed]);

  const simulateBotsLocking = (currentSeconds: number) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.isBot && !p.locked) {
          // Bot locks in randomly around 10-30s left
          const shouldLock = Math.random() < 0.12 || currentSeconds < 10;
          if (shouldLock) {
            const botTemplate = BOTS.find((b) => b.avatar === p.avatar) || BOTS[0];
            const botAnswer = simulateBotAnswer(botTemplate, currentCase, ALL_RP_CARDS);
            return {
              ...p,
              locked: true,
              selectedRpId: botAnswer.rpId,
              selectedMechId: botAnswer.mechId
            };
          }
        }
        return p;
      })
    );
  };

  const handleTimeUp = () => {
    lockAnswer();
  };

  const lockAnswer = () => {
    if (isLocked) return;
    sounds.playClick();
    setIsLocked(true);
    setPhase("LOCKED");

    // Ensure all bots lock
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.isBot && !p.locked) {
          const botTemplate = BOTS.find((b) => b.avatar === p.avatar) || BOTS[0];
          const botAnswer = simulateBotAnswer(botTemplate, currentCase, ALL_RP_CARDS);
          return {
            ...p,
            locked: true,
            selectedRpId: botAnswer.rpId,
            selectedMechId: botAnswer.mechId
          };
        }
        if (p.studentId === user?.studentId) {
          return {
            ...p,
            locked: true,
            selectedRpId: selectedRp?.id,
            selectedMechId: selectedMech?.id
          };
        }
        return p;
      })
    );

    // Transition to REVEAL after 1.2s delay
    setTimeout(() => {
      revealAnswers();
    }, 1200);
  };

  const revealAnswers = () => {
    setPhase("REVEAL");

    // Grade current user's answer
    const result = gradeAnswer(
      currentCase,
      selectedRp?.id || "",
      selectedMech?.id || ""
    );

    setLastRoundResult(result);

    if (result.scoreAwarded > 0) {
      sounds.playCorrect();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      sounds.playWrong();
    }

    // Grade and update all players' scores
    setPlayers((prev) =>
      prev.map((p) => {
        const rpId = p.studentId === user?.studentId ? selectedRp?.id || "" : p.selectedRpId || "";
        const mechId = p.studentId === user?.studentId ? selectedMech?.id || "" : p.selectedMechId || "";

        const grading = gradeAnswer(currentCase, rpId, mechId);

        return {
          ...p,
          score: p.score + grading.scoreAwarded,
          lastAnswerResult: {
            correct: grading.scoreAwarded > 0,
            points: grading.scoreAwarded,
            rpOk: grading.rpMatch,
            mechOk: grading.mechMatch
          }
        };
      })
    );
  };

  const handleNextRound = () => {
    sounds.playClick();
    if (currentRound >= totalRounds) {
      finishMatch();
      return;
    }

    // Check if swap phase (every 3 rounds: after round 3, 6, 9)
    if (currentRound % 3 === 0) {
      setPhase("SWAP");
      return;
    }

    // Next round
    const nextRoundNum = currentRound + 1;
    setCurrentRound(nextRoundNum);
    setupRound(nextRoundNum, deck, hand);
  };

  const handleSwapCard = (indexToSwap: number) => {
    if (deck.length === 0) return;
    sounds.playDraw();
    const newCard = deck[0];
    const newDeck = deck.slice(1);
    const newHand = [...hand];
    newHand[indexToSwap] = newCard;

    setDeck(newDeck);
    setHand(newHand);
  };

  const handleCompleteSwap = () => {
    sounds.playClick();
    const nextRoundNum = currentRound + 1;
    setCurrentRound(nextRoundNum);
    setupRound(nextRoundNum, deck, hand);
  };

  const finishMatch = () => {
    sounds.playWin();
    setPhase("RESULT");

    // Add match rewards to local user
    if (user) {
      const myScore = players.find((p) => p.studentId === user.studentId)?.score || 0;
      const updated = addRewards(user, myScore);
      setUser(updated);
    }
  };

  return (
    <div className="relative min-h-screen bg-felt-table text-amber-50 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Felt Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-radial-vignette opacity-80 z-0" />

      {/* 1. Top HUD Ribbon */}
      <header className="relative z-20 w-full flex justify-between items-center px-4 md:px-8 py-2.5 bg-amber-950/90 border-b-4 border-amber-900 shadow-2xl backdrop-blur-md">
        {/* Left: Round & Exit */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              sounds.playClick();
              if (confirm("ต้องการออกจากสังเวียนการประลองหรือไม่?")) {
                router.push("/");
              }
            }}
            className="p-1.5 bg-amber-900/80 hover:bg-amber-800 rounded-xl text-amber-200 border border-amber-600 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="ออกจากเกม"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="bg-amber-900/90 border-2 border-amber-500/80 px-3 py-1 rounded-xl shadow-inner flex items-center space-x-2">
            <span className="text-[10px] text-amber-300 font-game uppercase font-bold">รอบที่</span>
            <span className="font-mono font-black text-amber-100 text-sm md:text-base">
              {currentRound} / {totalRounds}
            </span>
          </div>

          <div className="hidden md:flex bg-amber-950/80 px-3 py-1 rounded-full text-xs font-bold text-amber-200 border border-amber-700/60 items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>โจทย์: {currentCase.difficulty} ({currentCase.points} คะแนน)</span>
          </div>
        </div>

        {/* Center: Countdown Timer Progress */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1.5">
            <Clock className={`w-4 h-4 ${timeLeft <= 10 ? "text-rose-400 animate-bounce" : "text-amber-300"}`} />
            <span className={`font-mono font-black text-lg md:text-xl ${timeLeft <= 10 ? "text-rose-400" : "text-amber-100"}`}>
              {timeLeft}s
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-28 md:w-44 h-1.5 bg-black/40 rounded-full overflow-hidden border border-amber-500/30">
            <motion.div
              className={`h-full ${timeLeft <= 10 ? "bg-rose-500" : timeLeft <= 20 ? "bg-amber-400" : "bg-emerald-400"}`}
              style={{ width: `${(timeLeft / maxTime) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Right: Sound & Score Summary */}
        <div className="flex items-center space-x-2">
          {/* My Score Badge */}
          <div className="bg-amber-900/90 border-2 border-amber-500/80 px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-inner">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-xs md:text-sm text-white">
              {players.find((p) => p.studentId === user?.studentId)?.score || 0} PTS
            </span>
          </div>

          <button
            onClick={() => {
              const muted = sounds.toggleMute();
              setIsMuted(muted);
            }}
            className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white border border-amber-500/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          </button>
        </div>
      </header>

      {/* Players Quick Ribbon */}
      <div className="relative z-10 w-full flex justify-center items-center py-1.5 bg-amber-950/60 border-b border-amber-900/60 gap-2 md:gap-4 overflow-x-auto px-4">
        {players.map((p) => {
          const isMe = p.studentId === user?.studentId;
          return (
            <div
              key={p.id}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${
                isMe
                  ? "bg-amber-900/90 border-amber-400 text-amber-100 shadow-md"
                  : "bg-black/40 border-amber-800/50 text-amber-200/80"
              }`}
            >
              <span>{p.avatar || "👨‍🎓"}</span>
              <span className="truncate max-w-[80px]">{p.name}</span>
              <span className="font-mono text-amber-300">({p.score})</span>
              {p.locked ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="ตอบแล้ว" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-500/50 animate-pulse" title="กำลังคิด" />
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Main Arena Table */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 py-4 flex flex-col justify-between items-center">
        {/* Upper Center: Clinical Case Card + Clue Card Slot */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 my-auto">
          {/* Clue Slot */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider mb-1">
              คำใบ้ / เป้าหมาย (CLUE)
            </span>
            {isClueRevealed && currentClue ? (
              <motion.div initial={{ scale: 0.8, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }} transition={{ duration: 0.4 }}>
                <ClueCardComponent card={currentClue} size="md" />
              </motion.div>
            ) : (
              <div
                onClick={() => {
                  sounds.playSelect();
                  setIsClueRevealed(true);
                }}
                className="w-44 h-62 rounded-2xl border-2 border-dashed border-emerald-500/60 bg-emerald-950/20 hover:bg-emerald-950/40 p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-102 shadow-lg group"
              >
                <HelpCircle className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-emerald-200">แตะเพื่อเปิดคำใบ้</span>
                <span className="text-[9px] text-emerald-300/70 mt-1">(เปิดอัตโนมัติเมื่อเหลือเวลาครึ่งหนึ่ง)</span>
              </div>
            )}
          </div>

          {/* Clinical Case Card */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider mb-1">
              โจทย์ทางคลินิก (CLINICAL CASE)
            </span>
            <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <CaseCardComponent card={currentCase} size="md" />
            </motion.div>
          </div>

          {/* Current Selection Slot & Giant LOCK Button */}
          <div className="flex flex-col items-center bg-black/40 p-4 rounded-3xl border-2 border-amber-600/60 shadow-2xl min-w-[220px]">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-2">
              คำตอบของคุณ (YOUR MATCH)
            </span>

            {/* Selected RP & Mech Mini Cards */}
            <div className="flex space-x-2 my-2">
              {/* Selected RP */}
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-blue-300 font-bold mb-0.5">สารรังสี (RP)</span>
                {selectedRp ? (
                  <div className="w-20 h-28 rounded-xl bg-gradient-to-b from-blue-600 to-blue-800 border-2 border-blue-300 p-1 flex flex-col justify-between text-center shadow-lg">
                    <span className="text-[9px] font-bold text-white bg-blue-900 rounded">{selectedRp.id}</span>
                    <span className="text-[10px] font-black font-nuclide text-white leading-tight">{selectedRp.nuclide}</span>
                    <span className="text-[7px] text-blue-100 truncate">{selectedRp.titleEn}</span>
                  </div>
                ) : (
                  <div className="w-20 h-28 rounded-xl border-2 border-dashed border-blue-400/60 bg-blue-950/20 flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-[9px] text-blue-300/60">เลือกจากมือ</span>
                  </div>
                )}
              </div>

              {/* Selected Mechanism */}
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-amber-300 font-bold mb-0.5">กลไก (MECH)</span>
                {selectedMech ? (
                  <div className="w-20 h-28 rounded-xl bg-gradient-to-b from-amber-600 to-amber-800 border-2 border-amber-300 p-1 flex flex-col justify-between text-center shadow-lg">
                    <span className="text-[9px] font-bold text-white bg-amber-900 rounded">{selectedMech.id}</span>
                    <span className="text-[9px] font-black text-white leading-tight">{selectedMech.titleEn}</span>
                    <span className="text-[7px] text-amber-100 truncate">{selectedMech.titleTh}</span>
                  </div>
                ) : (
                  <div className="w-20 h-28 rounded-xl border-2 border-dashed border-amber-400/60 bg-amber-950/20 flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-[9px] text-amber-300/60">เลือกจากแถบ</span>
                  </div>
                )}
              </div>
            </div>

            {/* Giant 3D LOCK Button */}
            <motion.button
              whileHover={!isLocked && selectedRp && selectedMech ? { scale: 1.05 } : {}}
              whileTap={!isLocked && selectedRp && selectedMech ? { scale: 0.95 } : {}}
              onClick={lockAnswer}
              disabled={isLocked || !selectedRp || !selectedMech}
              className={`w-full mt-3 py-3 px-4 rounded-2xl font-game font-black text-sm md:text-base tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl cursor-pointer ${
                isLocked
                  ? "bg-slate-700 border-2 border-slate-500 text-slate-300 cursor-default opacity-80"
                  : selectedRp && selectedMech
                  ? "bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 hover:from-amber-300 hover:to-amber-600 text-amber-950 border-3 border-amber-200 shadow-[0_6px_0_#78350f,0_10px_20px_rgba(0,0,0,0.5)] animate-pulse"
                  : "bg-amber-950/60 border border-amber-800/40 text-amber-300/40 cursor-not-allowed"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isLocked ? "ล็อคแล้ว (LOCKED)" : "LOCK คำตอบ!"}</span>
            </motion.button>
          </div>
        </div>

        {/* Middle Rack: 12 Shared Mechanism Cards Bar */}
        <div className="w-full flex flex-col items-center my-2">
          <div className="flex items-center space-x-1.5 text-xs text-amber-200 font-bold mb-1">
            <span>⚙️ แถบกลไกการสะสมกลางโต๊ะ (MECHANISMS)</span>
            <span className="text-[10px] text-amber-300/70 font-normal">(คลิก 1 อย่างที่ตรงกับเคส)</span>
          </div>

          <div className="w-full overflow-x-auto py-1 px-2 flex space-x-2 scrollbar-thin">
            {ALL_MECH_CARDS.map((mech) => {
              const isSelected = selectedMech?.id === mech.id;
              return (
                <button
                  key={mech.id}
                  onClick={() => {
                    sounds.playSelect();
                    setSelectedMech(mech);
                  }}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl text-left border-2 transition-all hover:scale-104 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 border-amber-200 text-amber-950 font-black shadow-lg scale-104"
                      : "bg-amber-950/80 hover:bg-amber-900 border-amber-700/60 text-amber-100 font-bold"
                  }`}
                >
                  <div className="text-[10px] font-mono text-amber-300">{mech.id}</div>
                  <div className="text-xs truncate max-w-[130px]">{mech.titleEn}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Bottom: Player's 5-Card Hand */}
        <div className="w-full flex flex-col items-center mt-2">
          <div className="text-[11px] text-blue-200 font-bold uppercase tracking-wider mb-1">
            ไพ่สารเภสัชรังสีในมือคุณ (YOUR HAND - 5 CARDS)
          </div>

          {/* Arc Fan Container */}
          <div className="relative flex justify-center items-end h-48 md:h-56 w-full max-w-2xl px-4">
            {hand.map((card, index) => {
              const offsetFromCenter = index - 2; // -2, -1, 0, 1, 2
              const rotation = offsetFromCenter * 6; // Arc degrees
              const yOffset = Math.abs(offsetFromCenter) * 10; // Arc sag
              const isSelected = selectedRp?.id === card.id;

              return (
                <motion.div
                  key={`${card.id}_${index}`}
                  className="relative -mx-3 md:-mx-4 cursor-pointer"
                  style={{
                    transformOrigin: "bottom center",
                  }}
                  animate={{
                    rotate: rotation,
                    y: isSelected ? -30 : yOffset,
                    zIndex: isSelected ? 40 : 10 + index,
                  }}
                  whileHover={{
                    scale: 1.15,
                    y: -35,
                    zIndex: 50,
                  }}
                  onClick={() => {
                    sounds.playSelect();
                    setSelectedRp(card);
                  }}
                >
                  <RpCard
                    card={card}
                    size="sm"
                    isSelected={isSelected}
                    className="shadow-2xl"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 4. Reveal Modal */}
      <AnimatePresence>
        {phase === "REVEAL" && lastRoundResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-xl wood-panel p-6 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col items-center text-center"
            >
              {/* Result Icon */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-xl -mt-12 mb-3 bg-gradient-to-br from-amber-400 to-amber-600 border-3 border-amber-200">
                {lastRoundResult.scoreAwarded > 0 ? "🎉" : "❌"}
              </div>

              <h2 className="font-game font-black text-2xl md:text-3xl text-amber-200">
                {lastRoundResult.scoreAwarded > 0
                  ? `ยอดเยี่ยม! +${lastRoundResult.scoreAwarded} คะแนน`
                  : "ยังไม่ถูกต้อง (0 คะแนน)"}
              </h2>

              {/* Breakdown */}
              <div className="w-full grid grid-cols-2 gap-3 my-4">
                {/* RP Result */}
                <div className={`p-3 rounded-2xl border-2 flex items-center space-x-2 ${
                  lastRoundResult.rpMatch
                    ? "bg-emerald-950/60 border-emerald-400 text-emerald-200"
                    : "bg-rose-950/60 border-rose-400 text-rose-200"
                }`}>
                  {lastRoundResult.rpMatch ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold">สารเภสัชรังสี (RP)</div>
                    <div className="text-xs font-bold">{selectedRp?.id || "ไม่ได้เลือก"}</div>
                  </div>
                </div>

                {/* Mech Result */}
                <div className={`p-3 rounded-2xl border-2 flex items-center space-x-2 ${
                  lastRoundResult.mechMatch
                    ? "bg-emerald-950/60 border-emerald-400 text-emerald-200"
                    : "bg-rose-950/60 border-rose-400 text-rose-200"
                }`}>
                  {lastRoundResult.mechMatch ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold">กลไกการสะสม (MECH)</div>
                    <div className="text-xs font-bold">{selectedMech?.id || "ไม่ได้เลือก"}</div>
                  </div>
                </div>
              </div>

              {/* Rationale & Explanation */}
              <div className="w-full bg-amber-950/80 p-3.5 rounded-2xl border border-amber-700/60 text-left text-xs text-amber-100/90 leading-relaxed mb-4">
                <div className="font-bold text-amber-300 flex items-center space-x-1.5 mb-1">
                  <Info className="w-4 h-4" />
                  <span>คำอธิบายทางการแพทย์ (CLINICAL RATIONALE):</span>
                </div>
                <p>{currentCase.explanationTh}</p>
                <div className="mt-2 text-[11px] text-amber-300/80">
                  <strong>สารที่ถูกต้อง:</strong> {currentCase.acceptedRpIds.join(", ")} | <strong>กลไกที่ถูกต้อง:</strong> {currentCase.acceptedMechIds.join(", ")}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextRound}
                className="w-full py-3.5 bg-play hover:bg-play-hover border-3 border-play-border rounded-2xl font-game font-black text-lg text-white tracking-wider shadow-play-btn active:shadow-play-btn-pressed transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>ไปรอบถัดไป</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Swap Phase Modal */}
      <AnimatePresence>
        {phase === "SWAP" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          >
            <div className="relative w-full max-w-lg wood-panel p-6 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col items-center text-center">
              <RefreshCw className="w-12 h-12 text-cyan-400 mb-2 animate-spin" />
              <h2 className="font-game font-black text-2xl text-amber-200">
                ช่วงผลัดเปลี่ยนไพ่ (HAND SWAP PHASE)
              </h2>
              <p className="text-xs text-amber-300/80 mt-1 mb-4">
                คุณสามารถเลือกทิ้งการ์ด RP ในมือเพื่อจั่วการ์ดใหม่จากสำรับก่อนเริ่มรอบต่อไป
              </p>

              {/* Cards in hand to swap */}
              <div className="grid grid-cols-5 gap-2 my-2 w-full">
                {hand.map((c, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <RpCard card={c} size="sm" isHoverable={false} />
                    <button
                      onClick={() => handleSwapCard(i)}
                      className="mt-2 px-2 py-1 bg-rose-700 hover:bg-rose-600 rounded-lg text-[10px] text-white font-bold cursor-pointer"
                    >
                      แลกใบนี้
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCompleteSwap}
                className="mt-6 w-full py-3 bg-play hover:bg-play-hover border-3 border-play-border rounded-2xl font-game font-black text-base text-white tracking-wider shadow-play-btn cursor-pointer"
              >
                เสร็จสิ้นการสับเปลี่ยนไพ่
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Match Result / Podium Modal */}
      <AnimatePresence>
        {phase === "RESULT" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-xl wood-panel p-6 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col items-center text-center"
            >
              <Trophy className="w-16 h-16 text-amber-400 animate-bounce mb-2" />
              <h2 className="font-game font-black text-3xl md:text-4xl text-amber-200">
                จบการประลอง (MATCH FINISHED)
              </h2>
              <p className="text-xs text-amber-300/90 mb-4">
                สรุปอันดับและคะแนนรวมจาก {totalRounds} ข้อ
              </p>

              {/* Podium Leaderboard */}
              <div className="w-full space-y-2 mb-4">
                {[...players]
                  .sort((a, b) => b.score - a.score)
                  .map((p, rank) => {
                    const isWinner = rank === 0;
                    return (
                      <div
                        key={p.id}
                        className={`flex justify-between items-center px-4 py-2.5 rounded-2xl border-2 ${
                          isWinner
                            ? "bg-amber-900/90 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                            : "bg-black/40 border-amber-800/60"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-game font-black text-base text-amber-300">
                            #{rank + 1}
                          </span>
                          <span className="text-lg">{p.avatar || "👨‍🎓"}</span>
                          <div className="text-left">
                            <div className="font-bold text-sm text-white">{p.name}</div>
                            <div className="text-[10px] text-amber-300/70 font-mono">{p.studentId}</div>
                          </div>
                        </div>
                        <div className="font-mono font-black text-lg text-amber-200">
                          {p.score} PTS
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Rewards Earned */}
              <div className="w-full p-3 bg-amber-950/90 rounded-2xl border border-amber-500/60 flex justify-around items-center mb-5">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold text-amber-200">
                    +{(players.find((p) => p.studentId === user?.studentId)?.score || 0) * 3} NucCoins
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-200">
                    +{(players.find((p) => p.studentId === user?.studentId)?.score || 0) * 10} XP
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex space-x-3">
                <button
                  onClick={() => router.push("/shop")}
                  className="flex-1 py-3 bg-amber-800 hover:bg-amber-700 rounded-2xl font-game font-bold text-xs text-white border border-amber-500 cursor-pointer"
                >
                  ไปร้านค้า NucCoin
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex-1 py-3 bg-play hover:bg-play-hover border-2 border-play-border rounded-2xl font-game font-black text-sm text-white shadow-play-btn cursor-pointer"
                >
                  กลับสู่หน้าหลัก
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
