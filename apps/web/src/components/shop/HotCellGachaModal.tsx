"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Sparkles, 
  Zap, 
  Check, 
  AlertCircle, 
  Award,
  Layers,
  Shield,
  Smile,
  Flame,
  Volume2,
  VolumeX,
  FastForward,
  RotateCcw
} from "lucide-react";
import confetti from "canvas-confetti";
import { NucCoinIcon } from "@/components/ui/NucCoinIcon";
import { TrefoilIcon } from "@/components/ui/TrefoilIcon";
import { sounds } from "@/lib/sound";
import { ShopItem } from "@nucmed/shared";
import { 
  executeGachaPull, 
  exchangeShardsForCoins, 
  getNaGachaPity, 
  getNaShards, 
  getNaWallet,
  GachaResult, 
  NaWallet, 
  NaInventory
} from "@/lib/user";

export interface HotCellGachaModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet?: NaWallet;
  inventory?: NaInventory;
  onUpdateWallet?: (wallet: NaWallet) => void;
  onUpdateInventory?: (inventory: NaInventory) => void;
  onRewardReceived?: () => void;
}

// Reel symbols representing radioactive hot-cell isotopes & cosmetic categories
interface SlotSymbol {
  id: string;
  icon: string;
  label: string;
  sub: string;
  gradient: string;
  glow: string;
}

const SLOT_SYMBOLS: SlotSymbol[] = [
  { id: "fdg", icon: "🧪", label: "¹⁸F-FDG", sub: "Positron Core", gradient: "from-emerald-500 to-teal-700", glow: "text-emerald-300" },
  { id: "tc99", icon: "☢️", label: "⁹⁹ᵐTc", sub: "Gamma Emitter", gradient: "from-amber-400 to-amber-600", glow: "text-amber-300" },
  { id: "i131", icon: "⚡", label: "¹³¹I", sub: "Beta Radiation", gradient: "from-cyan-400 to-blue-600", glow: "text-cyan-300" },
  { id: "crown", icon: "👑", label: "LEGENDARY", sub: "Theranostics", gradient: "from-yellow-300 via-amber-400 to-yellow-600", glow: "text-yellow-200" },
  { id: "gem", icon: "💎", label: "EPIC CORE", sub: "High Activity", gradient: "from-purple-400 to-indigo-600", glow: "text-purple-300" },
  { id: "felt", icon: "🎲", label: "ARENA FELT", sub: "Table Theme", gradient: "from-rose-500 to-pink-700", glow: "text-rose-300" },
  { id: "reactor", icon: "🛡️", label: "REACTOR", sub: "Shield Frame", gradient: "from-sky-400 to-blue-700", glow: "text-sky-300" },
  { id: "jackpot", icon: "💥", label: "JACKPOT", sub: "Triple Match", gradient: "from-amber-300 via-rose-500 to-purple-600", glow: "text-amber-200" }
];

export function HotCellGachaModal({
  isOpen,
  onClose,
  wallet: propWallet,
  inventory: propInventory,
  onUpdateWallet,
  onUpdateInventory,
  onRewardReceived
}: HotCellGachaModalProps) {
  const activeWallet = propWallet || getNaWallet();
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [pullType, setPullType] = useState<1 | 10>(1);
  const [results, setResults] = useState<GachaResult[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pityCount, setPityCount] = useState<number>(getNaGachaPity());
  const [shards, setShards] = useState<number>(getNaShards());
  const [exchangeNotice, setExchangeNotice] = useState<string | null>(null);
  const [isLeverPulled, setIsLeverPulled] = useState<boolean>(false);
  const [isFastForward, setIsFastForward] = useState<boolean>(false);

  // Slot Reels State (Indices of symbols for 3 reels)
  const [reel1Index, setReel1Index] = useState<number>(0);
  const [reel2Index, setReel2Index] = useState<number>(1);
  const [reel3Index, setReel3Index] = useState<number>(2);

  const [reel1Spinning, setReel1Spinning] = useState<boolean>(false);
  const [reel2Spinning, setReel2Spinning] = useState<boolean>(false);
  const [reel3Spinning, setReel3Spinning] = useState<boolean>(false);

  // Jackpot marquee lights sequence (0-7)
  const [lightPhase, setLightPhase] = useState<number>(0);

  // Ref to hold pending outcome while reels spin
  const pendingOutcomeRef = useRef<{
    results: GachaResult[];
    newBalance: number;
    newShards: number;
    newPity: number;
  } | null>(null);

  // Chase lights animation
  useEffect(() => {
    if (!isOpen) return;
    const lightTimer = setInterval(() => {
      setLightPhase((prev) => (prev + 1) % 8);
    }, isPulling ? 80 : 350);
    return () => clearInterval(lightTimer);
  }, [isOpen, isPulling]);

  // Reel 1 Spinning Loop
  useEffect(() => {
    if (!reel1Spinning) return;
    const interval = setInterval(() => {
      setReel1Index((prev) => (prev + 1) % SLOT_SYMBOLS.length);
      sounds.playSlotReelTick();
    }, 65);
    return () => clearInterval(interval);
  }, [reel1Spinning]);

  // Reel 2 Spinning Loop
  useEffect(() => {
    if (!reel2Spinning) return;
    const interval = setInterval(() => {
      setReel2Index((prev) => (prev + 1) % SLOT_SYMBOLS.length);
    }, 65);
    return () => clearInterval(interval);
  }, [reel2Spinning]);

  // Reel 3 Spinning Loop
  useEffect(() => {
    if (!reel3Spinning) return;
    const interval = setInterval(() => {
      setReel3Index((prev) => (prev + 1) % SLOT_SYMBOLS.length);
    }, 65);
    return () => clearInterval(interval);
  }, [reel3Spinning]);

  if (!isOpen) return null;

  const triggerLeverAnimation = () => {
    setIsLeverPulled(true);
    sounds.playSlotLever();
    setTimeout(() => {
      setIsLeverPulled(false);
    }, 380);
  };

  const handlePull = (count: 1 | 10) => {
    if (isPulling) return;
    setErrorMessage(null);
    setExchangeNotice(null);

    const cost = count === 1 ? 35 : 315;
    if (activeWallet.coins < cost) {
      setErrorMessage(`เหรียญ NucCoins ไม่พอ ต้องการ ${cost} เหรียญ (ปัจจุบันมี ${activeWallet.coins} เหรียญ)`);
      sounds.playWrong();
      return;
    }

    triggerLeverAnimation();
    setPullType(count);
    setIsPulling(true);
    setResults(null);

    // Compute backend outcome deterministically
    const outcome = executeGachaPull(count);
    if (!outcome.success) {
      setErrorMessage(outcome.error || "เกิดข้อผิดพลาดในการเชื่อมต่อเตาปฏิกรณ์");
      setIsPulling(false);
      sounds.playWrong();
      return;
    }

    const newPity = getNaGachaPity();
    pendingOutcomeRef.current = {
      results: outcome.results,
      newBalance: outcome.newBalance,
      newShards: outcome.newShards,
      newPity
    };

    // Start all 3 reels spinning
    setReel1Spinning(true);
    setReel2Spinning(true);
    setReel3Spinning(true);

    const hasLegendary = outcome.results.some((r) => r.rarity === "legendary");
    const hasEpic = outcome.results.some((r) => r.rarity === "epic");

    // Timing profile: standard vs fast forward
    const tReel1 = isFastForward ? 250 : 900;
    const tReel2 = isFastForward ? 450 : 1550;
    const tReel3 = isFastForward ? 700 : 2300;
    const tFinal = isFastForward ? 850 : 2700;

    // Reel 1 stop
    setTimeout(() => {
      setReel1Spinning(false);
      sounds.playSlotStop();
      // Match symbol to target rarity or category
      if (hasLegendary) setReel1Index(3); // Crown
      else if (hasEpic) setReel1Index(4); // Gem
      else setReel1Index(1); // Tc-99m
    }, tReel1);

    // Reel 2 stop
    setTimeout(() => {
      setReel2Spinning(false);
      sounds.playSlotStop();
      if (hasLegendary) setReel2Index(3); // Crown
      else if (hasEpic) setReel2Index(4); // Gem
      else setReel2Index(0); // FDG
    }, tReel2);

    // Reel 3 stop (Heightened anticipation)
    setTimeout(() => {
      setReel3Spinning(false);
      sounds.playSlotStop();
      if (hasLegendary) {
        setReel3Index(3); // Triple Crown Jackpot!
      } else if (hasEpic) {
        setReel3Index(4); // Triple Gem!
      } else {
        setReel3Index(2); // I-131
      }
    }, tReel3);

    // Final reveal & rewards commit
    setTimeout(() => {
      if (!pendingOutcomeRef.current) return;
      const data = pendingOutcomeRef.current;
      onUpdateWallet?.({ coins: data.newBalance });
      onRewardReceived?.();
      setPityCount(data.newPity);
      setShards(data.newShards);
      setResults(data.results);
      setIsPulling(false);

      if (hasLegendary) {
        sounds.playJackpot();
        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.5 },
          colors: ["#fbbf24", "#f59e0b", "#ec4899", "#3b82f6"]
        });
      } else if (hasEpic) {
        sounds.playCorrect();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#a855f7", "#ec4899", "#3b82f6"]
        });
      } else {
        sounds.playDraw();
      }
    }, tFinal);
  };

  const handleExchangeShards = () => {
    sounds.playClick();
    const res = exchangeShardsForCoins(100);
    if (!res.success) {
      setExchangeNotice(res.error || "แลกเศษไอโซโทปไม่สำเร็จ");
      sounds.playWrong();
    } else {
      setShards(res.newShards);
      onUpdateWallet?.({ coins: activeWallet.coins + res.coinsAdded });
      onRewardReceived?.();
      setExchangeNotice(`แลกสำเร็จ! ได้รับ +${res.coinsAdded} NucCoins เข้ากระเป๋าแล้ว`);
      sounds.playCorrect();
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return {
          bg: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500",
          text: "text-amber-950 font-black",
          border: "border-amber-300",
          label: "LEGENDARY",
          shadow: "shadow-[0_0_20px_rgba(245,158,11,0.9)]"
        };
      case "epic":
        return {
          bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
          text: "text-white font-bold",
          border: "border-purple-300",
          label: "EPIC",
          shadow: "shadow-[0_0_16px_rgba(168,85,247,0.8)]"
        };
      case "rare":
        return {
          bg: "bg-gradient-to-r from-cyan-500 to-blue-600",
          text: "text-white font-bold",
          border: "border-cyan-300",
          label: "RARE",
          shadow: "shadow-[0_0_12px_rgba(6,182,212,0.7)]"
        };
      default:
        return {
          bg: "bg-slate-700",
          text: "text-slate-200 font-medium",
          border: "border-slate-500",
          label: "COMMON",
          shadow: ""
        };
    }
  };

  const s1 = SLOT_SYMBOLS[reel1Index];
  const s2 = SLOT_SYMBOLS[reel2Index];
  const s3 = SLOT_SYMBOLS[reel3Index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 25 }}
        className="w-full max-w-3xl bg-gradient-to-b from-[#1c1206] via-[#0d1c18] to-[#040e0c] border-4 border-amber-500/80 rounded-[32px] p-4 sm:p-6 shadow-[0_0_80px_rgba(245,158,11,0.35)] text-amber-100 my-auto relative overflow-hidden flex flex-col max-h-[96vh]"
      >
        {/* Animated Marquee Bulb Chase Border */}
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/40 flex items-center justify-around px-4">
          {Array.from({ length: 16 }).map((_, idx) => {
            const isLit = (idx + lightPhase) % 4 === 0;
            return (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-150 ${
                  isLit
                    ? "bg-amber-300 shadow-[0_0_10px_#fde047] scale-125"
                    : "bg-amber-950/70 border border-amber-700/50"
                }`}
              />
            );
          })}
        </div>

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between mt-2 pt-2 pb-3 mb-2 border-b border-amber-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <TrefoilIcon className="w-6 h-6 text-amber-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-xl font-black font-game text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 tracking-wider">
                  HOT CELL ATOMIC SLOTS
                </h3>
                <span className="hidden xs:inline-block text-[9px] px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400/50 font-bold uppercase">
                  Reactor Gacha
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-amber-200/70">
                สุ่มไอเทมรังสีระดับตำนาน สังเวียนโต๊ะ และกรอบการ์ดพิเศษด้วยวงล้อปฏิกรณ์
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Speed Toggle */}
            <button
              type="button"
              onClick={() => setIsFastForward(!isFastForward)}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold border flex items-center space-x-1 cursor-pointer transition-all ${
                isFastForward
                  ? "bg-amber-500 text-amber-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                  : "bg-black/50 text-amber-300/70 border-amber-500/30 hover:bg-amber-950/60"
              }`}
              title="สลับโหมดหมุนเร็ว (Fast Spin)"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">{isFastForward ? "FAST ON" : "FAST OFF"}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Currency & Pity Status Strip */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          {/* Wallet */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/40 flex items-center space-x-2 shadow-inner">
            <NucCoinIcon className="w-5 h-5 shrink-0" />
            <div className="min-w-0">
              <div className="text-[8.5px] sm:text-[9.5px] text-amber-300/80 uppercase font-bold truncate">เหรียญ NucCoins</div>
              <div className="font-mono font-black text-amber-300 text-xs sm:text-sm">{activeWallet.coins}</div>
            </div>
          </div>

          {/* Shards */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/40 flex items-center space-x-2 shadow-inner">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-[8.5px] sm:text-[9.5px] text-cyan-300/80 uppercase font-bold truncate">เศษไอโซโทป</div>
              <div className="font-mono font-black text-cyan-300 text-xs sm:text-sm">{shards}</div>
            </div>
          </div>

          {/* Pity Progress Gauge */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-purple-500/40 flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] sm:text-[9.5px] text-purple-300/80 uppercase font-bold">
                การันตี EPIC
              </span>
              <span className="font-mono font-black text-purple-300 text-[10px] sm:text-xs">
                {pityCount}/10
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/80 rounded-full overflow-hidden border border-purple-500/40 mt-1">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (pityCount / 10) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Feedback / Alert Notice */}
        {errorMessage && (
          <div className="mb-2 p-2 rounded-xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {exchangeNotice && (
          <div className="mb-2 p-2 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs font-bold flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{exchangeNotice}</span>
          </div>
        )}

        {/* ----------------------------------------------------
            THE ATOMIC SLOT MACHINE CABINET
            ---------------------------------------------------- */}
        <div className="flex-1 flex flex-col justify-center items-center py-2 sm:py-3 relative">
          <div className="w-full max-w-xl relative flex items-center justify-center">
            {/* Slot Machine Main Frame */}
            <div className="w-full bg-gradient-to-b from-slate-900 via-[#101e19] to-slate-950 rounded-3xl p-3 sm:p-5 border-4 border-amber-500/70 shadow-[0_0_35px_rgba(245,158,11,0.3),inset_0_2px_15px_rgba(0,0,0,0.8)] flex flex-col items-center relative">
              
              {/* Top Slot Header Decal */}
              <div className="w-full flex items-center justify-between px-3 py-1 mb-3 rounded-xl bg-black/60 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300">
                <span className="flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${isPulling ? "bg-rose-500 animate-ping" : "bg-emerald-400"}`} />
                  <span>{isPulling ? "SPINNING REELS..." : "READY TO SPIN"}</span>
                </span>
                <span className="text-amber-200 font-game">ISOTOPE REELS V2</span>
                <span className="text-yellow-400">WIN UP TO 360 COIN VAL</span>
              </div>

              {/* 3 Physical Slot Reels Container */}
              <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-2xl bg-black/80 border-3 border-amber-600/70 shadow-[inset_0_6px_20px_rgba(0,0,0,0.95)] relative overflow-hidden">
                {/* Horizontal Win Line Laser Guide */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none z-20 opacity-60" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-amber-400/5 pointer-events-none z-10" />

                {/* Reel 1 */}
                <div className="relative h-28 sm:h-36 rounded-xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/50 shadow-inner flex flex-col items-center justify-center p-2 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />

                  <motion.div
                    key={reel1Index}
                    initial={reel1Spinning ? { y: -25, opacity: 0.6 } : { scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.08 }}
                    className="flex flex-col items-center text-center select-none"
                  >
                    <span className="text-3xl sm:text-5xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-1">
                      {s1.icon}
                    </span>
                    <span className="font-game font-black text-xs sm:text-sm text-amber-200 truncate max-w-[85px] sm:max-w-[120px]">
                      {s1.label}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-mono text-slate-400">
                      {s1.sub}
                    </span>
                  </motion.div>
                </div>

                {/* Reel 2 */}
                <div className="relative h-28 sm:h-36 rounded-xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/50 shadow-inner flex flex-col items-center justify-center p-2 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />

                  <motion.div
                    key={reel2Index}
                    initial={reel2Spinning ? { y: -25, opacity: 0.6 } : { scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.08 }}
                    className="flex flex-col items-center text-center select-none"
                  >
                    <span className="text-3xl sm:text-5xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-1">
                      {s2.icon}
                    </span>
                    <span className="font-game font-black text-xs sm:text-sm text-amber-200 truncate max-w-[85px] sm:max-w-[120px]">
                      {s2.label}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-mono text-slate-400">
                      {s2.sub}
                    </span>
                  </motion.div>
                </div>

                {/* Reel 3 */}
                <div className="relative h-28 sm:h-36 rounded-xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/50 shadow-inner flex flex-col items-center justify-center p-2 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />

                  <motion.div
                    key={reel3Index}
                    initial={reel3Spinning ? { y: -25, opacity: 0.6 } : { scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.08 }}
                    className="flex flex-col items-center text-center select-none"
                  >
                    <span className="text-3xl sm:text-5xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-1">
                      {s3.icon}
                    </span>
                    <span className="font-game font-black text-xs sm:text-sm text-amber-200 truncate max-w-[85px] sm:max-w-[120px]">
                      {s3.label}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-mono text-slate-400">
                      {s3.sub}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Bottom Paytable & Drop Rates Info */}
              <div className="w-full flex flex-wrap justify-between items-center px-2 pt-2.5 mt-1 text-[9.5px] sm:text-[10px] text-amber-300/80">
                <span className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Common: 50%</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Rare: 35%</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Epic: 12%</span>
                </span>
                <span className="flex items-center space-x-1 font-bold text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                  <span>Legendary: 3%</span>
                </span>
              </div>
            </div>

            {/* 3D Physical Slot Lever on Machine's Right Flank (Desktop & Tablet) */}
            <div className="hidden sm:flex flex-col items-center ml-2 relative">
              {/* Lever Pivot Base */}
              <div className="w-5 h-8 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-900 rounded-md border-2 border-amber-400 shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-900" />
              </div>

              {/* Lever Shaft + Golden Ball Handle */}
              <motion.button
                type="button"
                disabled={isPulling}
                onClick={() => handlePull(1)}
                whileHover={{ scale: 1.05 }}
                animate={isLeverPulled ? { rotateX: 60, y: 35 } : { rotateX: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="origin-bottom cursor-pointer group flex flex-col items-center -mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
                title="คลิกเพื่อโยกคันโยกสล็อต!"
              >
                {/* Golden Knob */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-400 border-2 border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.8)] group-hover:shadow-[0_0_22px_rgba(245,158,11,1)] transition-shadow flex items-center justify-center">
                  <TrefoilIcon className="w-3.5 h-3.5 text-amber-950 opacity-80" />
                </div>
                {/* Steel Rod */}
                <div className="w-2 h-14 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 rounded-full shadow-md" />
              </motion.button>
              <span className="text-[8px] font-game font-black text-amber-400/80 mt-1 uppercase tracking-wider">
                PULL
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------
            RESULTS MODAL OVERLAY (1-PULL & 10-PULL TRAY)
            ---------------------------------------------------- */}
        <AnimatePresence>
          {!isPulling && results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/88 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-500/40">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-base sm:text-lg font-black font-game text-amber-200">
                      ผลลัพธ์การสุ่มรังสี ({results.length} รายการ)
                    </span>
                  </div>
                  <button
                    onClick={() => setResults(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-900/60 border border-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 1-Pull Spotlight Hero Result */}
                {results.length === 1 && (
                  <motion.div
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="max-w-sm mx-auto p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-3 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] flex flex-col items-center text-center my-3"
                  >
                    {(() => {
                      const res = results[0];
                      const badge = getRarityBadge(res.rarity);
                      return (
                        <>
                          <div className={`px-3 py-1 rounded-full text-xs mb-3 ${badge.bg} ${badge.text} ${badge.shadow}`}>
                            {badge.label}
                          </div>

                          <div className="w-20 h-20 rounded-2xl bg-amber-950/60 border-2 border-amber-400/50 flex items-center justify-center mb-3 shadow-inner">
                            <span className="text-4xl">
                              {res.item.kind === "frame" ? "🖼️" : res.item.kind === "avatar" ? "👤" : res.item.kind === "table" ? "🎲" : res.item.kind === "cardback" ? "🎴" : "✨"}
                            </span>
                          </div>

                          <h4 className="text-base sm:text-lg font-black text-white mb-1">
                            {res.item.nameTh}
                          </h4>
                          <span className="text-[10px] text-amber-300 uppercase tracking-widest font-mono mb-2">
                            หมวดหมู่: {res.item.kind}
                          </span>
                          <p className="text-xs text-amber-200/80 leading-relaxed mb-4">
                            {res.item.descriptionTh}
                          </p>

                          <div className="w-full pt-3 border-t border-white/10 flex items-center justify-center text-xs">
                            {res.isDuplicate ? (
                              <span className="text-cyan-300 font-bold flex items-center space-x-1.5 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/50">
                                <span>มีไอเทมนี้แล้ว!</span>
                                <span className="text-cyan-400 font-mono">+{res.shardsEarned} เศษไอโซโทป</span>
                              </span>
                            ) : (
                              <span className="text-emerald-300 font-bold flex items-center space-x-1.5 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/50">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>ปลดล็อกไอเทมใหม่สำเร็จ!</span>
                              </span>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                )}

                {/* 10-Pull Grid Result */}
                {results.length > 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-2">
                    {results.map((res, idx) => {
                      const badge = getRarityBadge(res.rarity);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0.7, opacity: 0, y: 15 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`p-2.5 rounded-2xl bg-black/75 border-2 ${badge.border} ${badge.shadow} flex flex-col justify-between relative overflow-hidden`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-[7.5px] px-1.5 py-0.2 rounded-full ${badge.bg} ${badge.text}`}>
                                {badge.label}
                              </span>
                              <span className="text-[9px] uppercase font-mono text-slate-400">
                                #{idx + 1}
                              </span>
                            </div>

                            <div className="font-bold text-white text-[11px] leading-snug line-clamp-1 mb-0.5">
                              {res.item.nameTh}
                            </div>
                            <p className="text-[9px] text-slate-300 line-clamp-2 leading-tight">
                              {res.item.descriptionTh}
                            </p>
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px]">
                            {res.isDuplicate ? (
                              <span className="text-cyan-300 font-bold">
                                +{res.shardsEarned} เศษ
                              </span>
                            ) : (
                              <span className="text-emerald-400 font-bold">
                                ใหม่!
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Results Action Buttons */}
              <div className="flex items-center justify-center space-x-3 pt-3 border-t border-amber-500/30">
                <button
                  type="button"
                  onClick={() => setResults(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 cursor-pointer transition-colors"
                >
                  กลับสู่ตู้สล็อต
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResults(null);
                    handlePull(pullType);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-amber-950 text-xs font-black shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>สุ่มอีกครั้ง ({pullType === 1 ? "35" : "315"} เหรียญ)</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shard Recycle Banner */}
        <div className="p-2 sm:p-2.5 bg-cyan-950/40 rounded-xl border border-cyan-500/40 flex items-center justify-between mt-2 mb-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-[11px] sm:text-xs">
              <span className="text-cyan-200 font-bold">รีไซเคิลเศษไอโซโทป: </span>
              <span className="text-cyan-300/80">100 เศษ = 50 NucCoins</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExchangeShards}
            disabled={shards < 100}
            className="px-3 py-1 rounded-lg bg-cyan-900/70 hover:bg-cyan-800 border border-cyan-400/50 text-cyan-200 text-[10px] sm:text-[11px] font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            แลก 50 เหรียญ
          </button>
        </div>

        {/* ----------------------------------------------------
            FOOTER ARCADE CONTROL PANEL (3D PUSH BUTTONS)
            ---------------------------------------------------- */}
        <div className="pt-2 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[10px] text-amber-300/70">
            * สุ่มครบ 10 ครั้ง การันตีไอเทมระดับ Epic ขึ้นไปทันที
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            {/* 1x Spin Button */}
            <motion.button
              type="button"
              disabled={isPulling}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handlePull(1)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 hover:from-amber-400 hover:to-amber-700 text-amber-950 font-black text-xs md:text-sm border-2 border-amber-200 shadow-[0_4px_0_#451a03,0_8px_16px_rgba(0,0,0,0.5)] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5"
            >
              <NucCoinIcon className="w-4 h-4" />
              <span>SPIN 1x (35)</span>
            </motion.button>

            {/* 10x Mega Spin Button (With Golden Glow) */}
            <motion.button
              type="button"
              disabled={isPulling}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handlePull(10)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 hover:from-yellow-200 hover:to-amber-400 text-slate-950 font-black text-xs md:text-sm border-3 border-amber-100 shadow-[0_5px_0_#78350f,0_10px_20px_rgba(245,158,11,0.6)] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5 animate-pulse"
            >
              <Sparkles className="w-4 h-4 text-amber-950" />
              <span>MEGA 10x (315)</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
