"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
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
  ChevronLeft,
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
import { 
  getLocalUser, 
  addRewards, 
  saveLocalUser, 
  getNaEquipped, 
  recordMatchPlayed, 
  getNaWallet,
  getAvatarIcon,
  getTitleBadge,
  getFrameStyle
} from "@/lib/user";
import { sounds } from "@/lib/sound";
import { createRoomSync, RoomSyncHandle, SyncMessage } from "@/lib/sync";
import { getAssetPath } from "@/lib/assets";
import { NucCoinIcon } from "@/components/ui/NucCoinIcon";

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
  const [showClueConfirm, setShowClueConfirm] = useState(false);

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
  const [matchReward, setMatchReward] = useState<{
    coinsEarned: number;
    totalCoins: number;
    reason: string;
    isWinner: boolean;
    isTie: boolean;
  } | null>(null);
  const userCorrectCountRef = useRef(0);
  const syncRef = useRef<RoomSyncHandle | null>(null);
  const mechScrollRef = useRef<HTMLDivElement>(null);
  const handScrollRef = useRef<HTMLDivElement>(null);
  const swapScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollMech = (direction: "left" | "right") => {
    sounds.playClick();
    if (mechScrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      mechScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScrollHand = (direction: "left" | "right") => {
    sounds.playClick();
    if (handScrollRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      handScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScrollSwap = (direction: "left" | "right") => {
    sounds.playClick();
    if (swapScrollRef.current) {
      const scrollAmount = direction === "left" ? -230 : 230;
      swapScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Initialize match
  useEffect(() => {
    const localUser = getLocalUser();
    setUser(localUser);

    const equipped = getNaEquipped();
    const myAvatar = getAvatarIcon(localUser.equipped?.avatar || equipped.avatar);
    const myTitle = getTitleBadge(localUser.equipped?.title || equipped.title);
    const myFrame = localUser.equipped?.frame || equipped.frame;

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
        matchPlayers = (parsed.players || []).map((p: PublicPlayer) => {
          if (p.studentId === localUser.studentId) {
            return {
              ...p,
              avatar: myAvatar,
              title: myTitle || p.title,
              frame: myFrame || p.frame
            };
          }
          return p;
        });
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
          avatar: myAvatar,
          title: myTitle || undefined,
          frame: myFrame
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

    // Setup multiplayer sync
    const handleSyncMessage = (msg: SyncMessage) => {
      switch (msg.type) {
        case "PLAYER_LOCK": {
          sounds.playClick();
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === msg.playerId
                ? {
                    ...p,
                    locked: msg.locked,
                    selectedRpId: msg.answer?.rpId,
                    selectedMechId: msg.answer?.mechId
                  }
                : p
            )
          );
          break;
        }
        case "ROUND_ADVANCE": {
          sounds.playDraw();
          setCurrentRound(msg.roundIndex);
          const nextCase = ALL_CASE_CARDS.find((c) => c.id === msg.caseId) || ALL_CASE_CARDS[(msg.roundIndex - 1) % ALL_CASE_CARDS.length];
          setCurrentCase(nextCase);
          setSelectedRp(null);
          setSelectedMech(null);
          setIsLocked(false);
          setShowExplanation(false);
          setTimeLeft(maxTime);
          setPhase("THINK");
          setPlayers((prev) =>
            prev.map((p) => ({
              ...p,
              locked: false,
              selectedRpId: undefined,
              selectedMechId: undefined
            }))
          );
          break;
        }
        case "ROUND_REVEAL": {
          revealAnswers();
          break;
        }
      }
    };

    const syncHandle = createRoomSync(roomCode, handleSyncMessage);
    syncRef.current = syncHandle;

    return () => {
      syncHandle.destroy();
    };
  }, [roomCode, maxTime]);

  // Setup a new round
  const setupRound = (roundNum: number, currentDeck: RadiopharmaceuticalCard[], currentHand: RadiopharmaceuticalCard[]) => {
    // Pick Case Card - ensure clueId exists, otherwise skip case
    let caseIndex = (roundNum - 1) % ALL_CASE_CARDS.length;
    let caseCard = ALL_CASE_CARDS[caseIndex];

    // Check clueId exists before dealing; if missing, skip case
    let attempts = 0;
    while ((!caseCard.clueId || !ALL_CLUE_CARDS.some(c => c.id === caseCard.clueId)) && attempts < ALL_CASE_CARDS.length) {
      console.warn(`[RTGAME] Case ${caseCard.id} has invalid or missing clueId: ${caseCard.clueId}. Skipping case.`);
      caseIndex = (caseIndex + 1) % ALL_CASE_CARDS.length;
      caseCard = ALL_CASE_CARDS[caseIndex];
      attempts++;
    }

    setCurrentCase(caseCard);

    // Exact 1-to-1 clue card matching via caseCard.clueId (strict, no random/fuzzy)
    const clueCard = ALL_CLUE_CARDS.find((c) => c.id === caseCard.clueId) || null;
    setCurrentClue(clueCard);
    setIsClueRevealed(false);
    setShowClueConfirm(false);

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

    if (user) {
      syncRef.current?.publish({
        type: "PLAYER_LOCK",
        playerId: `p_${user.studentId}`,
        locked: true,
        answer: {
          rpId: selectedRp?.id || "",
          mechId: selectedMech?.id || ""
        }
      });
    }

    // Transition to REVEAL after 1.2s delay
    setTimeout(() => {
      revealAnswers();
    }, 1200);
  };

  const revealAnswers = () => {
    setPhase("REVEAL");

    // Grade current user's answer (private clue reveal only affects player)
    const result = gradeAnswer(
      currentCase,
      selectedRp?.id || "",
      selectedMech?.id || "",
      isClueRevealed
    );

    setLastRoundResult(result);

    if (result.scoreAwarded > 0) {
      userCorrectCountRef.current += 1;
      sounds.playCorrect();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      sounds.playWrong();
    }

    // Grade and update all players' scores (Bots do NOT open clues!)
    setPlayers((prev) =>
      prev.map((p) => {
        const isMe = p.studentId === user?.studentId;
        const rpId = isMe ? selectedRp?.id || "" : p.selectedRpId || "";
        const mechId = isMe ? selectedMech?.id || "" : p.selectedMechId || "";
        const usedClue = isMe ? isClueRevealed : false; // Bots do not open clues!

        const grading = gradeAnswer(currentCase, rpId, mechId, usedClue);

        return {
          ...p,
          score: p.score + grading.scoreAwarded,
          usedClue,
          lastAnswerResult: {
            correct: grading.scoreAwarded > 0,
            points: grading.scoreAwarded,
            rpOk: grading.rpMatch,
            mechOk: grading.mechMatch,
            usedClue: grading.usedClue,
            cluePenalty: grading.cluePenalty
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
    const nextCase = ALL_CASE_CARDS[(nextRoundNum - 1) % ALL_CASE_CARDS.length];
    syncRef.current?.publish({
      type: "ROUND_ADVANCE",
      roundIndex: nextRoundNum,
      caseId: nextCase.id
    });
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

    if (!user) return;

    // Calculate match reward based on final standings:
    // "เข้าเส้นได้ 5 NucCoin, ชนะได้ 20, เสมออันดับ 1 ได้ 10"
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const topScore = sorted[0]?.score || 0;
    const winners = sorted.filter((p) => p.score === topScore);
    const myScore = players.find((p) => p.studentId === user.studentId)?.score || 0;
    const isWinner = winners.some((p) => p.studentId === user.studentId);
    const isTie = isWinner && winners.length > 1;

    let coinsEarned = 5; // เข้าเส้นได้ 5 NucCoin
    let reason = "เข้าเส้นชัยจบการแข่งขัน (+5 NucCoin)";
    if (isWinner && !isTie) {
      coinsEarned = 20; // ชนะได้ 20
      reason = "ชนะเลิศอันดับ 1 (+20 NucCoin)";
    } else if (isTie) {
      coinsEarned = 10; // เสมออันดับ 1 ได้ 10
      reason = "เสมออันดับ 1 (+10 NucCoin)";
    }

    const correctCases = userCorrectCountRef.current || 0;

    recordMatchPlayed({
      studentId: user.studentId,
      coinsEarned,
      correctCases,
      reason
    });

    const wallet = getNaWallet();
    const totalRemaining = wallet.coins;

    setMatchReward({
      coinsEarned,
      totalCoins: totalRemaining,
      reason,
      isWinner: isWinner && !isTie,
      isTie
    });

    setUser({
      ...user,
      coins: totalRemaining,
      xp: (user.xp || 0) + myScore * 10
    });
  };

  return (
    <div className="relative min-h-screen text-amber-50 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Fullscreen Casino Felt Table Background Layer */}
      <img
        src={getAssetPath("/scene/play-table.webp")}
        alt="Play Table Arena"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* 1. Top HUD Ribbon - Translucent Sleek HUD (~72% transparent) */}
      <header className="relative z-20 w-full flex justify-between items-center px-2 sm:px-4 md:px-8 py-2 bg-black/28 border-b border-amber-600/30 shadow-xl backdrop-blur-xs">
        {/* Left: Round & Exit */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          <button
            onClick={() => {
              sounds.playClick();
              if (confirm("ต้องการออกจากสังเวียนการประลองหรือไม่?")) {
                router.push("/");
              }
            }}
            className="p-1 sm:p-1.5 bg-amber-900/70 hover:bg-amber-800 rounded-lg sm:rounded-xl text-amber-200 border border-amber-600/80 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
            title="ออกจากเกม"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="bg-amber-950/60 border border-amber-500/60 px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl shadow-inner flex items-center space-x-1 sm:space-x-2 backdrop-blur-xs">
            <span className="text-[9px] sm:text-[10px] text-amber-300 font-game uppercase font-bold">รอบ</span>
            <span className="font-mono font-black text-amber-100 text-xs sm:text-sm md:text-base">
              {currentRound}/{totalRounds}
            </span>
          </div>

          <div className="hidden lg:flex bg-amber-950/50 px-3 py-1 rounded-full text-xs font-bold text-amber-200 border border-amber-700/50 items-center space-x-1.5 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>โจทย์: {currentCase.difficulty} ({currentCase.points} คะแนน)</span>
          </div>
        </div>

        {/* Center: Countdown Timer Progress */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${timeLeft <= 10 ? "text-rose-400 animate-bounce" : "text-amber-300"}`} />
            <span className={`font-mono font-black text-base sm:text-lg md:text-xl ${timeLeft <= 10 ? "text-rose-400" : "text-amber-100"}`}>
              {timeLeft}s
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-20 sm:w-28 md:w-44 h-1 sm:h-1.5 bg-black/40 rounded-full overflow-hidden border border-amber-500/30">
            <motion.div
              className={`h-full ${timeLeft <= 10 ? "bg-rose-500" : timeLeft <= 20 ? "bg-amber-400" : "bg-emerald-400"}`}
              style={{ width: `${(timeLeft / maxTime) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Right: Sound & Score Summary */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* My Score Badge */}
          <div className="bg-amber-950/60 border border-amber-500/60 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center space-x-1 sm:space-x-1.5 shadow-inner backdrop-blur-xs">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="font-mono font-bold text-xs sm:text-sm text-white">
              {players.find((p) => p.studentId === user?.studentId)?.score || 0} PTS
            </span>
          </div>

          <button
            onClick={() => {
              const muted = sounds.toggleMute();
              setIsMuted(muted);
            }}
            className="p-1 sm:p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white border border-amber-500/40 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
            title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />}
          </button>
        </div>
      </header>

      {/* Players Quick Ribbon - Translucent (72% transparent backdrop) */}
      <div className="relative z-10 w-full flex justify-center items-center py-1 sm:py-1.5 bg-black/28 border-b border-amber-900/30 gap-1.5 sm:gap-3 overflow-x-auto px-2 sm:px-4 backdrop-blur-xs scrollbar-none">
        {players.map((p) => {
          const isMe = p.studentId === user?.studentId;
          const frameClass = isMe && p.frame ? getFrameStyle(p.frame) : isMe ? "border-amber-400" : "border-amber-800/40";
          return (
            <div
              key={p.id}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-full border text-[10px] sm:text-[11px] font-bold backdrop-blur-xs shrink-0 transition-all ${
                isMe
                  ? `bg-amber-900/85 text-amber-100 shadow-md ${frameClass}`
                  : "bg-black/35 border-amber-800/40 text-amber-200/80"
              }`}
            >
              <span className="text-sm">{p.avatar || "👨‍🎓"}</span>
              <span className="truncate max-w-[75px] sm:max-w-[95px]">{p.name}</span>
              {p.title && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400/40 truncate max-w-[100px]">
                  {p.title}
                </span>
              )}
              <span className="font-mono text-amber-300">({p.score})</span>
              {p.locked ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" title="ตอบแล้ว" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-500/50 animate-pulse" title="กำลังคิด" />
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Main Arena Table */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-2 sm:px-4 py-2 sm:py-3 flex flex-col justify-between items-center">
        {/* Upper Center: Clinical Case Card + Clue Card Slot + Selection Slot */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 my-auto w-full px-1">
          {/* Desktop Clue Slot (hidden on phone, shown on md+) */}
          <div className="hidden md:flex flex-col items-center">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider mb-1 drop-shadow-md">
              คำใบ้ส่วนตัว (PRIVATE CLUE)
            </span>
            {isClueRevealed && currentClue ? (
              <motion.div initial={{ scale: 0.8, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }} transition={{ duration: 0.4 }}>
                <ClueCardComponent card={currentClue} size="md" />
              </motion.div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sounds.playSelect();
                  setShowClueConfirm(true);
                }}
                className="w-38 md:w-44 h-54 md:h-62 rounded-2xl border-2 border-dashed border-emerald-500/60 bg-black/28 hover:bg-emerald-950/40 backdrop-blur-xs p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-102 shadow-lg group"
              >
                <HelpCircle className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-emerald-200">«เปิดคำใบ้ -1 ถ้าตอบถูก»</span>
                <span className="text-[9px] text-emerald-300/80 mt-1">(เปิดแล้วไม่สามารถปิดได้ในตานี้)</span>
              </button>
            )}
          </div>

          {/* Clinical Case Card (Hero in Center on both Phone, iPad & Desktop) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs text-rose-300 font-bold uppercase tracking-wider mb-0.5 sm:mb-1 drop-shadow-md">
              โจทย์ทางคลินิก (CLINICAL CASE)
            </span>
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="scale-[0.74] xs:scale-[0.80] sm:scale-92 md:scale-100 origin-center -my-2 sm:my-0"
            >
              <CaseCardComponent card={currentCase} size="md" />
            </motion.div>
          </div>

          {/* Mobile Combined Row: Clue Slot (Left) + YOUR MATCH Slot (Right) */}
          <div className="flex md:hidden flex-row items-stretch justify-center gap-2 w-full max-w-sm px-1 mt-0.5">
            {/* Mobile Clue Slot */}
            <div className="flex-1 flex flex-col items-center justify-between p-2 rounded-2xl border border-emerald-500/50 bg-black/28 backdrop-blur-xs text-center shadow-lg">
              <span className="text-[9px] text-emerald-300 font-bold uppercase">
                คำใบ้ส่วนตัว (CLUE)
              </span>
              {isClueRevealed && currentClue ? (
                <div className="scale-75 origin-center my-auto">
                  <ClueCardComponent card={currentClue} size="sm" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playSelect();
                    setShowClueConfirm(true);
                  }}
                  className="w-full flex-1 min-h-[85px] rounded-xl border border-dashed border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/40 flex flex-col items-center justify-center p-1.5 cursor-pointer mt-1"
                >
                  <HelpCircle className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-[10px] font-bold text-emerald-200 leading-tight">«เปิดคำใบ้ -1 ถ้าตอบถูก»</span>
                </button>
              )}
            </div>

            {/* Mobile YOUR MATCH Slot */}
            <div className="flex-1 flex flex-col items-center justify-between p-2 rounded-2xl border border-amber-500/50 bg-black/28 backdrop-blur-xs shadow-lg">
              <span className="text-[9px] text-amber-300 font-bold uppercase">
                คำตอบของคุณ
              </span>
              {/* Mini cards preview */}
              <div className="flex space-x-1.5 my-1">
                {/* Mini RP */}
                <div className="w-13 h-18 rounded-lg border border-blue-400/60 bg-blue-950/40 flex flex-col items-center justify-center p-0.5 text-center">
                  <span className="text-[7px] text-blue-200 font-bold">RP</span>
                  {selectedRp ? (
                    <span className="text-[8px] font-black text-white truncate max-w-[48px]">{selectedRp.nuclide}</span>
                  ) : (
                    <span className="text-[9px] opacity-60">🃏</span>
                  )}
                </div>
                {/* Mini Mech */}
                <div className="w-13 h-18 rounded-lg border border-amber-400/60 bg-amber-950/40 flex flex-col items-center justify-center p-0.5 text-center">
                  <span className="text-[7px] text-amber-200 font-bold">MECH</span>
                  {selectedMech ? (
                    <span className="text-[7.5px] font-black text-amber-300 truncate max-w-[48px]">{selectedMech.id}</span>
                  ) : (
                    <span className="text-[9px] opacity-60">⚙️</span>
                  )}
                </div>
              </div>
              {/* Mobile LOCK Button */}
              <button
                onClick={lockAnswer}
                disabled={isLocked || !selectedRp || !selectedMech}
                className={`w-full py-1.5 px-2 rounded-xl font-game font-black text-[10px] flex items-center justify-center space-x-1 transition-all shadow-md cursor-pointer ${
                  isLocked
                    ? "bg-slate-700/80 text-slate-300 cursor-default"
                    : selectedRp && selectedMech
                    ? "bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 font-bold border border-amber-200 animate-pulse"
                    : "bg-black/40 text-amber-300/40 cursor-not-allowed border border-amber-800/40"
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>{isLocked ? "LOCKED" : "LOCK!"}</span>
              </button>
            </div>
          </div>

          {/* Desktop YOUR MATCH Slot (hidden on phone, shown on md+) */}
          <div className="hidden md:flex flex-col items-center bg-black/28 backdrop-blur-xs p-3.5 lg:p-4 rounded-3xl border border-amber-500/40 shadow-2xl min-w-[200px] lg:min-w-[220px]">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-2 drop-shadow-md">
              คำตอบของคุณ (YOUR MATCH)
            </span>

            {/* Selected RP & Mech Mini Cards (Authentic Prototype Replicas) */}
            <div className="flex space-x-3 my-2">
              {/* Selected RP Card */}
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-blue-300 font-bold mb-1">สารรังสี (RP)</span>
                {selectedRp ? (
                  <motion.div
                    initial={{ scale: 0.8, y: -5 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-22 lg:w-24 h-30 lg:h-34 rounded-2xl bg-[#1B70BF] p-1 flex flex-col justify-between shadow-2xl border-2 border-blue-300 transform hover:scale-105 transition-transform select-none"
                  >
                    <div className="w-full flex-1 bg-white rounded-xl p-1.5 flex flex-col justify-between items-center text-center">
                      <div className="w-full flex justify-between items-center">
                        <span className="text-[7.5px] font-black bg-blue-100 text-[#1B70BF] px-1 py-0.5 rounded">☢️ {selectedRp.id}</span>
                        <span className="text-[7.5px] font-bold bg-[#2EB8E6] text-white px-1 py-0.5 rounded">{selectedRp.modality}</span>
                      </div>
                      <div className="font-nuclide font-black text-xs md:text-sm text-slate-900 leading-tight">{selectedRp.nuclide}</div>
                      <div className="text-[7.5px] text-slate-500 font-medium truncate max-w-full">{selectedRp.subtitle || selectedRp.titleEn}</div>
                    </div>
                    <div className="text-center py-0.5 text-[8px] font-black text-white uppercase tracking-wider">
                      RP Card
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-22 lg:w-24 h-30 lg:h-34 rounded-2xl border-2 border-dashed border-blue-400/50 bg-black/25 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-xl mb-1 opacity-60">🃏</span>
                    <span className="text-[8.5px] text-blue-200/80 font-bold">เลือก 1 ใบจากมือ</span>
                  </div>
                )}
              </div>

              {/* Selected Mechanism Card */}
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-amber-300 font-bold mb-1">กลไก (MECH)</span>
                {selectedMech ? (
                  <motion.div
                    initial={{ scale: 0.8, y: -5 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-22 lg:w-24 h-30 lg:h-34 rounded-2xl bg-[#EFA316] p-1 flex flex-col justify-between shadow-2xl border-2 border-amber-300 transform hover:scale-105 transition-transform select-none"
                  >
                    <div className="w-full flex-1 bg-white rounded-xl p-1.5 flex flex-col justify-between items-center text-center">
                      <div className="w-full flex justify-between items-center">
                        <span className="text-[7.5px] font-black bg-amber-100 text-[#D97706] px-1 py-0.5 rounded">{selectedMech.id}</span>
                        <span className="text-xs">⚙️</span>
                      </div>
                      <div className="font-bold text-[10px] text-slate-900 leading-tight">{selectedMech.titleEn}</div>
                      <div className="text-[7.5px] text-amber-800 font-medium truncate max-w-full">{selectedMech.titleTh}</div>
                    </div>
                    <div className="text-center py-0.5 text-[8px] font-black text-white uppercase tracking-wider">
                      Mechanism
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-22 lg:w-24 h-30 lg:h-34 rounded-2xl border-2 border-dashed border-amber-400/50 bg-black/25 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-xl mb-1 opacity-60">⚙️</span>
                    <span className="text-[8.5px] text-amber-200/80 font-bold">เลือก 1 อย่างจากแถบ</span>
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
              className={`w-full mt-3 py-2.5 lg:py-3 px-4 rounded-2xl font-game font-black text-sm md:text-base tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl cursor-pointer ${
                isLocked
                  ? "bg-slate-700/80 border-2 border-slate-500 text-slate-300 cursor-default opacity-80"
                  : selectedRp && selectedMech
                  ? "bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 hover:from-amber-300 hover:to-amber-600 text-amber-950 border-3 border-amber-200 shadow-[0_6px_0_#78350f,0_10px_20px_rgba(0,0,0,0.5)] animate-pulse"
                  : "bg-black/40 border border-amber-800/40 text-amber-300/40 cursor-not-allowed"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isLocked ? "ล็อคแล้ว (LOCKED)" : "LOCK คำตอบ!"}</span>
            </motion.button>
          </div>
        </div>

        {/* Middle Rack: 12 Shared Mechanism Cards Bar with Arcade Controls */}
        <div className="w-full flex flex-col items-center my-1.5 sm:my-2">
          {/* Rack Header */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs text-amber-200 font-bold mb-1 drop-shadow-md">
            <span className="text-sm sm:text-base">⚙️</span>
            <span className="font-game tracking-wider uppercase">แถบกลไกการสะสมกลางโต๊ะ (MECHANISMS)</span>
            <span className="hidden sm:inline text-[10px] text-amber-300/80 font-normal">
              (แตะ 1 กลไกเพื่อจับคู่)
            </span>
          </div>

          {/* Arcade Console Bar */}
          <div className="relative w-full max-w-5xl flex items-center px-0.5 sm:px-2 gap-1 sm:gap-2">
            {/* Left Arcade 3D Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleScrollMech("left")}
              className="shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 hover:from-amber-200 hover:to-amber-400 active:scale-90 text-amber-950 flex items-center justify-center border-2 border-amber-200 shadow-[0_2px_0_#78350f,0_4px_10px_rgba(0,0,0,0.5)] cursor-pointer transition-all z-20 group"
              title="เลื่อนซ้าย"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] group-hover:-translate-x-0.5 transition-transform" />
            </motion.button>

            {/* Scrollable Track - Styled as Brass & Felt Casino Track */}
            <div
              ref={mechScrollRef}
              className="flex-1 overflow-x-auto py-1.5 sm:py-2 px-2 sm:px-3 flex space-x-2 sm:space-x-3 scrollbar-none scroll-smooth bg-black/35 backdrop-blur-md rounded-2xl border-2 border-amber-500/35 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6),0_4px_16px_rgba(0,0,0,0.35)] touch-pan-x"
              style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            >
              {ALL_MECH_CARDS.map((mech) => {
                const isSelected = selectedMech?.id === mech.id;
                return (
                  <motion.button
                    key={mech.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      sounds.playSelect();
                      setSelectedMech(mech);
                    }}
                    className={`flex-shrink-0 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-left border-2 transition-all cursor-pointer select-none ${
                      isSelected
                        ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 border-amber-100 text-amber-950 font-black shadow-[0_0_16px_rgba(245,158,11,0.7),0_4px_8px_rgba(0,0,0,0.4)] scale-104 -translate-y-0.5"
                        : "bg-black/45 hover:bg-amber-950/70 border-amber-600/40 hover:border-amber-400/70 text-amber-100 font-bold backdrop-blur-xs shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <span className={`text-[8.5px] sm:text-[9.5px] font-mono font-black px-1.5 py-0.5 rounded shadow-xs ${
                        isSelected ? "bg-amber-950 text-amber-300" : "bg-amber-900/80 text-amber-200 border border-amber-600/40"
                      }`}>
                        {mech.id}
                      </span>
                      <span className="text-[10px] sm:text-xs">⚙️</span>
                    </div>
                    <div className="text-[11px] sm:text-xs font-black truncate max-w-[110px] sm:max-w-[130px] leading-tight">
                      {mech.titleEn}
                    </div>
                    <div className={`text-[8.5px] sm:text-[9.5px] truncate max-w-[110px] sm:max-w-[130px] mt-0.5 ${
                      isSelected ? "text-amber-950 font-bold" : "text-amber-300/80 font-medium"
                    }`}>
                      {mech.titleTh}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Right Arcade 3D Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleScrollMech("right")}
              className="shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 hover:from-amber-200 hover:to-amber-400 active:scale-90 text-amber-950 flex items-center justify-center border-2 border-amber-200 shadow-[0_2px_0_#78350f,0_4px_10px_rgba(0,0,0,0.5)] cursor-pointer transition-all z-20 group"
              title="เลื่อนขวา"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>
        </div>

        {/* 3. Bottom: Player's 5-Card Hand */}
        <div className="w-full flex flex-col items-center mt-0.5 sm:mt-2 pb-2 sm:pb-3">
          <div className="text-[10px] sm:text-[11px] text-blue-200 font-bold uppercase tracking-wider mb-0.5 sm:mb-1 drop-shadow-md">
            ไพ่สารเภสัชรังสีในมือคุณ (YOUR HAND - 5 CARDS)
          </div>

          {/* MOBILE VIEW (< sm): Slidable & Scrollable Hand Carousel with Left/Right Buttons */}
          <div className="flex sm:hidden relative w-full items-center px-1">
            {/* Left Arcade Nav Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleScrollHand("left")}
              className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700 text-white flex items-center justify-center border-2 border-blue-200 shadow-[0_2px_0_#1e3a8a,0_4px_10px_rgba(0,0,0,0.5)] cursor-pointer transition-all z-20 active:scale-90"
              title="เลื่อนซ้าย"
              aria-label="Scroll hand left"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </motion.button>

            {/* Scrollable Hand Track */}
            <div
              ref={handScrollRef}
              className="flex-1 overflow-x-auto py-2 px-2 flex space-x-3 scrollbar-none scroll-smooth touch-pan-x snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            >
              {hand.map((card, index) => {
                const isSelected = selectedRp?.id === card.id;
                return (
                  <div
                    key={`${card.id}_${index}`}
                    className="shrink-0 snap-center flex flex-col items-center cursor-pointer transition-transform active:scale-95"
                    onClick={() => {
                      sounds.playSelect();
                      setSelectedRp(card);
                    }}
                  >
                    {/* Slot badge */}
                    <div className={`mb-1 px-2.5 py-0.5 rounded-full text-[9px] font-game font-bold flex items-center space-x-1 shadow-xs ${
                      isSelected
                        ? "bg-amber-400 text-amber-950 font-black border border-white"
                        : "bg-black/60 text-blue-200 border border-blue-400/40"
                    }`}>
                      <span>#{index + 1}</span>
                      {isSelected ? <span>✓ เลือกแล้ว</span> : <span>{card.id}</span>}
                    </div>

                    <div className={`transition-all rounded-[18px] ${
                      isSelected
                        ? "ring-4 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.9)] -translate-y-1"
                        : "opacity-95"
                    }`}>
                      <RpCard
                        card={card}
                        size="sm"
                        isSelected={isSelected}
                        isHoverable={false}
                        className="shadow-xl"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Arcade Nav Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleScrollHand("right")}
              className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700 text-white flex items-center justify-center border-2 border-blue-200 shadow-[0_2px_0_#1e3a8a,0_4px_10px_rgba(0,0,0,0.5)] cursor-pointer transition-all z-20 active:scale-90"
              title="เลื่อนขวา"
              aria-label="Scroll hand right"
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </motion.button>
          </div>

          {/* Mobile Swipe Hint & Slot Navigation Dots (< sm) */}
          <div className="flex sm:hidden items-center justify-center space-x-2 mt-1">
            <span className="text-[10px] text-blue-200/90 font-medium">◀ เลื่อนซ้าย-ขวา เพื่อเลือกไพ่ในมือ ▶</span>
            <div className="flex space-x-1.5 ml-1">
              {hand.map((c, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    sounds.playSelect();
                    setSelectedRp(c);
                    if (handScrollRef.current) {
                      handScrollRef.current.scrollTo({ left: i * 215, behavior: "smooth" });
                    }
                  }}
                  className={`h-2 rounded-full cursor-pointer transition-all ${
                    selectedRp?.id === c.id
                      ? "bg-amber-400 w-4 shadow-[0_0_8px_#fbbf24]"
                      : "bg-blue-300/40 w-2 hover:bg-blue-200"
                  }`}
                  title={`ไปที่การ์ดใบที่ ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* TABLET & DESKTOP VIEW (>= sm): Classic Arcade Fan Layout */}
          <div className="hidden sm:flex relative justify-center items-end h-44 md:h-56 w-full max-w-2xl px-2 sm:px-4 scale-90 md:scale-100 origin-bottom mb-2 sm:mb-0">
            {hand.map((card, index) => {
              const offsetFromCenter = index - 2; // -2, -1, 0, 1, 2
              const rotation = offsetFromCenter * 5; // Arc degrees
              const yOffset = Math.abs(offsetFromCenter) * 8; // Arc sag
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

      {/* Clue Confirmation Modal */}
      <AnimatePresence>
        {showClueConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="relative w-full max-w-sm wood-panel p-5 rounded-3xl border-3 border-amber-950 shadow-2xl flex flex-col items-center text-center select-none"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-2xl mb-3 shadow-inner">
                💡
              </div>
              <h3 className="font-game font-black text-xl text-emerald-200">
                ยืนยันการเปิดคำใบ้?
              </h3>
              <p className="text-xs text-amber-100/90 mt-2 mb-2 leading-relaxed">
                หากเปิดคำใบ้ คะแนนที่ได้จะถูก<strong className="text-rose-300">หัก 1 แต้ม</strong> (เมื่อตอบถูกเท่านั้น หากตอบผิดจะได้ 0 แต้มตามเดิม)
              </p>
              <div className="bg-amber-950/70 border border-amber-700/60 rounded-xl p-2 w-full text-[10px] text-amber-300/90 mb-4 leading-normal">
                <div>• Basic: 2 แต้ม → เหลือ 1 แต้ม</div>
                <div>• Clinical: 4 แต้ม → เหลือ 3 แต้ม</div>
                <div className="text-emerald-300 font-bold mt-0.5">*คำใบ้เป็นส่วนตัวเฉพาะคุณ และเปิดแล้วไม่สามารถปิดได้ในตานี้</div>
              </div>

              <div className="flex space-x-3 w-full">
                <button
                  type="button"
                  onClick={() => setShowClueConfirm(false)}
                  className="flex-1 py-2.5 bg-black/40 hover:bg-black/60 border border-amber-700/60 rounded-xl text-xs font-bold text-amber-300 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playSelect();
                    setIsClueRevealed(true);
                    setShowClueConfirm(false);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-400 rounded-xl text-xs font-game font-black text-white shadow-md cursor-pointer"
                >
                  เปิดคำใบ้ (-1 แต้ม)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {lastRoundResult.cluePenalty > 0 && (
                <div className="mt-1 px-3 py-1 bg-amber-950/90 border border-amber-500/70 rounded-full text-xs font-bold text-amber-300 inline-flex items-center space-x-1">
                  <span>💡 หัก 1 คะแนนจากการเปิดคำใบ้ส่วนตัว</span>
                </div>
              )}

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

      {/* 5. Swap Phase Modal (Arcade Card Swap Table) */}
      <AnimatePresence>
        {phase === "SWAP" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-[1220px] wood-panel p-4 sm:p-6 md:p-7 rounded-[32px] border-4 border-amber-950 shadow-[0_25px_70px_rgba(0,0,0,0.9)] ring-2 ring-amber-500/40 flex flex-col items-center text-center select-none my-auto"
            >
              {/* Arcade Header Badge */}
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 border-3 border-amber-200 shadow-[0_0_24px_rgba(245,158,11,0.6)] flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-amber-950 animate-spin" style={{ animationDuration: "10s" }} />
                </div>
                <div className="absolute -bottom-1 -right-2 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-game font-black text-[10px] tracking-wider uppercase border border-rose-300 shadow-md">
                  SWAP
                </div>
              </div>

              {/* Title */}
              <h2 className="font-game font-black text-2xl sm:text-3xl md:text-4xl text-amber-200 text-shadow-gold-title tracking-wide filter drop-shadow">
                ช่วงผลัดเปลี่ยนไพ่ (HAND SWAP PHASE)
              </h2>

              {/* Subtitle & Deck HUD Bar */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 mt-1.5 mb-4 text-xs">
                <span className="text-amber-200/90 font-medium">
                  แตะการ์ดในมือเพื่อทิ้งและจั่วใบใหม่จากสำรับกลางก่อนเริ่มประลองรอบต่อไป
                </span>
                <div className="bg-emerald-950/90 border-2 border-emerald-400/60 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-mono font-black flex items-center space-x-1.5 shadow-inner">
                  <span>🎴 ไพ่ในสำรับคงเหลือ:</span>
                  <span className="text-amber-300 text-sm">{deck.length} ใบ</span>
                </div>
              </div>

              {/* Cards in Hand Tray (Arcade Green Felt Table with Pedestals) */}
              <div className="w-full bg-[#081f15] border-3 border-emerald-600/70 rounded-2xl p-2.5 sm:p-5 shadow-[inset_0_4px_30px_rgba(0,0,0,0.85)] relative">
                {/* Mobile / Tablet Quick Navigation Bar */}
                <div className="flex xl:hidden justify-between items-center mb-2 px-1">
                  <button
                    type="button"
                    onClick={() => handleScrollSwap("left")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 text-xs font-bold flex items-center space-x-1 border border-emerald-400/50 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>ก่อนหน้า</span>
                  </button>
                  <span className="text-[11px] text-emerald-300 font-medium">◀ เลื่อนซ้าย-ขวาเพื่อดู 5 ช่อง ▶</span>
                  <button
                    type="button"
                    onClick={() => handleScrollSwap("right")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 text-xs font-bold flex items-center space-x-1 border border-emerald-400/50 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <span>ถัดไป</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div
                  ref={swapScrollRef}
                  className="flex items-stretch justify-start xl:justify-center overflow-x-auto gap-3.5 sm:gap-4.5 pb-2 pt-1 px-1 no-scrollbar touch-pan-x snap-x snap-mandatory scroll-smooth"
                  style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
                >
                  {hand.map((c, i) => (
                    <motion.div
                      key={`${c.id}_${i}`}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col items-center shrink-0 snap-center w-[206px] bg-gradient-to-b from-[#0e3323] via-[#092418] to-[#04120b] border-2 border-emerald-500/40 rounded-2xl p-2.5 shadow-xl ring-1 ring-emerald-400/20"
                    >
                      {/* Slot Badge */}
                      <div className="mb-2 px-3 py-0.5 rounded-full bg-emerald-900/90 border border-emerald-400/50 text-[10.5px] font-game font-bold text-emerald-300 tracking-wider flex items-center space-x-1.5 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>SLOT #{i + 1}</span>
                      </div>

                      {/* Card with Click & Hover to Swap */}
                      <div
                        onClick={() => deck.length > 0 && handleSwapCard(i)}
                        className="group relative cursor-pointer transition-transform duration-200 hover:-translate-y-1.5"
                        title={deck.length > 0 ? "คลิกเพื่อสลับการ์ดใบนี้" : "สำรับหมดแล้ว"}
                      >
                        <RpCard card={c} size="sm" isHoverable={false} className="shadow-2xl" />

                        {/* Hover Overlay Hint */}
                        {deck.length > 0 && (
                          <div className="absolute inset-0 rounded-[18px] bg-cyan-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-3 border-cyan-300 flex items-center justify-center pointer-events-none">
                            <div className="bg-black/90 text-cyan-200 px-3.5 py-1.5 rounded-full text-xs font-game font-bold flex items-center space-x-1.5 shadow-2xl backdrop-blur-xs border border-cyan-400/60">
                              <RefreshCw className="w-4 h-4 text-cyan-300 animate-spin" />
                              <span>แตะเพื่อสลับ</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3D Arcade Swap Button */}
                      <button
                        onClick={() => handleSwapCard(i)}
                        disabled={deck.length === 0}
                        className={clsx(
                          "mt-2.5 w-full py-2.5 px-3 rounded-xl font-game font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:translate-y-1",
                          deck.length > 0
                            ? "bg-gradient-to-b from-rose-500 via-rose-600 to-red-700 hover:from-rose-400 hover:to-red-600 text-white border-2 border-rose-300 shadow-[0_4px_0_#881337,0_6px_12px_rgba(0,0,0,0.5)] active:shadow-[0_1px_0_#881337] cursor-pointer"
                            : "bg-slate-700 text-slate-400 border border-slate-600 cursor-not-allowed shadow-none"
                        )}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{deck.length > 0 ? "สลับใบนี้" : "สำรับหมด"}</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Complete Swap Footer Button */}
              <div className="mt-5 w-full flex flex-col items-center">
                <button
                  onClick={handleCompleteSwap}
                  className="w-full sm:w-auto min-w-[320px] py-4 px-10 bg-play hover:bg-play-hover border-4 border-play-border rounded-2xl font-game font-black text-lg text-white tracking-widest shadow-play-btn active:shadow-play-btn-pressed active:translate-y-1 transition-all flex items-center justify-center space-x-3 cursor-pointer"
                >
                  <CheckCircle className="w-6 h-6 text-emerald-200" />
                  <span>เสร็จสิ้นการสับเปลี่ยนไพ่ (พร้อมลุยต่อ)</span>
                  <ChevronRight className="w-6 h-6 text-emerald-200" />
                </button>
                <p className="text-[11.5px] text-amber-200/80 mt-2.5 font-medium">
                  แตะที่ตัวการ์ดหรือกดปุ่ม &quot;สลับใบนี้&quot; ได้ตามต้องการ เมื่อพอใจแล้วกดปุ่มเพื่อเริ่มรอบถัดไป
                </p>
              </div>
            </motion.div>
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

              {/* Rewards Earned & Balance Display */}
              {matchReward && (
                <div className="w-full p-3.5 bg-amber-950/95 rounded-2xl border-2 border-amber-500 shadow-xl space-y-2.5 mb-5">
                  <div className="flex items-center justify-between text-xs font-game font-bold text-amber-200 border-b border-amber-700/60 pb-1.5">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{matchReward.reason}</span>
                    </span>
                    <span className="text-emerald-300 font-mono font-black text-sm">
                      +{matchReward.coinsEarned} NucCoin
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                    {/* 1. เหรียญที่ได้ในรอบนี้ */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-amber-600/50 flex flex-col items-center">
                      <span className="text-[10px] text-amber-300/90 font-bold uppercase tracking-wider mb-1">
                        เหรียญที่ได้ในรอบนี้
                      </span>
                      <div className="flex items-center space-x-1.5 text-sm font-mono font-black text-amber-200">
                        <NucCoinIcon size={18} />
                        <span>+{matchReward.coinsEarned}</span>
                      </div>
                    </div>

                    {/* 2. ยอดเหรียญคงเหลือทั้งหมด */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/50 flex flex-col items-center">
                      <span className="text-[10px] text-emerald-300/90 font-bold uppercase tracking-wider mb-1">
                        ยอดเหรียญคงเหลือทั้งหมด
                      </span>
                      <div className="flex items-center space-x-1.5 text-sm font-mono font-black text-emerald-200">
                        <NucCoinIcon size={18} />
                        <span>{matchReward.totalCoins}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[9.5px] text-amber-300/70 text-center">
                    ✓ ข้อมูลบันทึกลง na_accounts แล้ว รีเฟรชหรือกลับมาเล่นใหม่ยอดเหรียญจะไม่หาย
                  </div>
                </div>
              )}

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
