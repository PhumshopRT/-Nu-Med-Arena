"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Sparkles, 
  Zap, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Award,
  Layers,
  Shield,
  Smile,
  Flame,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { NucCoinIcon } from "@/components/ui/NucCoinIcon";
import { TrefoilIcon } from "@/components/ui/TrefoilIcon";
import { sounds } from "@/lib/sound";
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
  const [pullCount, setPullCount] = useState<1 | 10>(1);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [results, setResults] = useState<GachaResult[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pityCount, setPityCount] = useState<number>(getNaGachaPity());
  const [shards, setShards] = useState<number>(getNaShards());
  const [exchangeNotice, setExchangeNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePull = (count: 1 | 10) => {
    setErrorMessage(null);
    setExchangeNotice(null);
    sounds.playClick();

    const cost = count === 1 ? 35 : 315;
    if (activeWallet.coins < cost) {
      setErrorMessage(`เหรียญ NucCoins ไม่พอ ต้องการ ${cost} เหรียญ (ปัจจุบันมี ${activeWallet.coins} เหรียญ)`);
      return;
    }

    setIsPulling(true);
    setResults(null);

    // Simulate atmospheric chamber release animation
    setTimeout(() => {
      const outcome = executeGachaPull(count);
      if (!outcome.success) {
        setErrorMessage(outcome.error || "ไม่สามารถเปิดตู้สุ่มได้");
        setIsPulling(false);
        return;
      }

      onUpdateWallet?.({ coins: outcome.newBalance });
      onRewardReceived?.();
      setPityCount(getNaGachaPity());
      setShards(outcome.newShards);
      setResults(outcome.results);
      setIsPulling(false);

      const hasLegendary = outcome.results.some(r => r.rarity === "legendary");
      const hasEpic = outcome.results.some(r => r.rarity === "epic");

      if (hasLegendary) {
        sounds.playCombo(3);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } else if (hasEpic) {
        sounds.playCorrect();
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        sounds.playDraw();
      }
    }, 1200);
  };

  const handleExchangeShards = () => {
    sounds.playClick();
    const res = exchangeShardsForCoins(100);
    if (!res.success) {
      setExchangeNotice(res.error || "แลกเศษไอโซโทปไม่สำเร็จ");
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
          shadow: "shadow-[0_0_16px_rgba(245,158,11,0.8)]"
        };
      case "epic":
        return {
          bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
          text: "text-white font-bold",
          border: "border-purple-300",
          label: "EPIC",
          shadow: "shadow-[0_0_14px_rgba(168,85,247,0.7)]"
        };
      case "rare":
        return {
          bg: "bg-gradient-to-r from-cyan-500 to-blue-600",
          text: "text-white font-bold",
          border: "border-cyan-300",
          label: "RARE",
          shadow: "shadow-[0_0_12px_rgba(6,182,212,0.6)]"
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        className="w-full max-w-2xl bg-gradient-to-b from-[#0f2421] via-[#091b19] to-[#040e0c] border-2 border-amber-500/70 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-amber-100 my-6 relative overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Hazard Warning Stripe */}
        <div className="absolute top-0 inset-x-0 h-2 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_10px,#000_10px,#000_20px)] opacity-80" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border-2 border-amber-400/70 flex items-center justify-center text-amber-300 shadow-md">
              <TrefoilIcon className="w-6 h-6 animate-spin-slow text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black font-game text-white tracking-wide">
                  เตาปฏิกรณ์ Hot Cell (Mystery Gacha)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70">
                สุ่มไอเทมรังสีหายาก กรอบการ์ด ธีมโต๊ะแข่งขัน และฉายาลับ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency & Pity Dashboard */}
        <div className="grid grid-cols-3 gap-2.5 mb-4 text-xs">
          <div className="p-2.5 rounded-xl bg-black/50 border border-amber-500/30 flex items-center space-x-2">
            <NucCoinIcon className="w-5 h-5 shrink-0" />
            <div>
              <div className="text-[9px] text-amber-300/70 uppercase">เหรียญ NucCoins</div>
              <div className="font-mono font-black text-amber-300 text-sm">{activeWallet.coins}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/50 border border-cyan-500/30 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[9px] text-cyan-300/70 uppercase">เศษไอโซโทป (Shards)</div>
              <div className="font-mono font-black text-cyan-300 text-sm">{shards}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/50 border border-purple-500/30 flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-[9px] text-purple-300/70 uppercase">การันตี Epic (Pity)</div>
              <div className="font-mono font-black text-purple-300 text-sm">{pityCount}/10</div>
            </div>
          </div>
        </div>

        {/* Feedback / Error Notices */}
        {errorMessage && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {exchangeNotice && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{exchangeNotice}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* While Pulling Animation */}
          {isPulling && (
            <div className="py-14 flex flex-col items-center justify-center space-y-4">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1 shadow-[0_0_40px_rgba(245,158,11,0.9)] flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full bg-black/90 flex items-center justify-center">
                  <TrefoilIcon className="w-12 h-12 text-amber-400 animate-pulse" />
                </div>
              </motion.div>
              <div className="text-center">
                <div className="text-sm font-black text-amber-200 uppercase tracking-widest animate-pulse">
                  กำลังปลดล็อกเตาปฏิกรณ์ Hot Cell...
                </div>
                <div className="text-xs text-amber-300/60 mt-1">ปล่อยไอโซโทปรังสีความบริสุทธิ์สูง</div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {!isPulling && results && (
            <div className="space-y-4 py-2">
              <div className="text-center mb-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  ผลลัพธ์การสุ่มรังสี ({results.length} รายการ)
                </span>
              </div>

              <div className={`grid gap-3 ${results.length > 1 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 max-w-sm mx-auto"}`}>
                {results.map((res, idx) => {
                  const badge = getRarityBadge(res.rarity);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.8, opacity: 0, y: 15 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className={`p-3.5 rounded-2xl bg-black/60 border-2 ${badge.border} ${badge.shadow} flex flex-col justify-between relative overflow-hidden`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[8.5px] px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] uppercase font-mono text-slate-400">
                            {res.item.kind}
                          </span>
                        </div>

                        <div className="font-bold text-white text-xs leading-snug line-clamp-1 mb-1">
                          {res.item.nameTh}
                        </div>
                        <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                          {res.item.descriptionTh}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                        {res.isDuplicate ? (
                          <span className="text-cyan-300 font-bold flex items-center space-x-1">
                            <span>ซ้ำ!</span>
                            <span className="text-cyan-400 font-mono">+{res.shardsEarned} เศษ</span>
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>ได้รับของใหม่!</span>
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setResults(null)}
                  className="px-5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  กลับสู่หน้าตู้สุ่ม
                </button>
              </div>
            </div>
          )}

          {/* Machine Chamber Standby View */}
          {!isPulling && !results && (
            <div className="space-y-4">
              {/* Hot Cell Visual Chamber */}
              <div className="relative rounded-2xl bg-black/60 border-2 border-amber-500/40 p-5 flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none" />
                <div className="w-20 h-20 rounded-3xl bg-amber-950/60 border border-amber-400/40 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Flame className="w-10 h-10 text-amber-400 animate-bounce-gentle" />
                </div>
                <h4 className="text-base font-black text-amber-200">
                  เตาหลอมไอโซโทปรังสีความเข้มข้นสูง
                </h4>
                <p className="text-xs text-amber-300/70 max-w-md mt-1 leading-relaxed">
                  สุ่มปลดล็อกไอเทมตกแต่งระดับ Common, Rare, Epic จนถึง <strong>Legendary</strong> หากได้ไอเทมซ้ำจะเปลี่ยนเป็น <strong>เศษไอโซโทป</strong> เพื่อนำไปแลกเหรียญหรือของรางวัลพิเศษ
                </p>

                {/* Drop Rate Legend */}
                <div className="flex flex-wrap justify-center gap-2 mt-4 text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-600">
                    Common 50%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-600">
                    Rare 35%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-600">
                    Epic 12%
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500 font-bold">
                    Legendary 3%
                  </span>
                </div>
              </div>

              {/* Shard Exchange Banner */}
              <div className="p-3 bg-cyan-950/30 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-xs">
                    <span className="text-cyan-200 font-bold">รีไซเคิลเศษไอโซโทป: </span>
                    <span className="text-cyan-300/80">ใช้ 100 เศษ แลกรับ 50 NucCoins</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExchangeShards}
                  disabled={shards < 100}
                  className="px-3 py-1.5 rounded-xl bg-cyan-900/60 hover:bg-cyan-800/80 border border-cyan-400/50 text-cyan-200 text-[11px] font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  แลกเหรียญ (100 เศษ)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-3 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-amber-300/70">
            * สุ่มครบ 10 ครั้ง การันตีไอเทมระดับ Epic หรือสูงกว่าแน่นอน
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={isPulling}
              onClick={() => handlePull(1)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs shadow-lg cursor-pointer transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-1.5"
            >
              <NucCoinIcon className="w-4 h-4" />
              <span>สุ่ม 1 ครั้ง (35)</span>
            </button>

            <button
              type="button"
              disabled={isPulling}
              onClick={() => handlePull(10)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg cursor-pointer transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-950" />
              <span>สุ่ม 10 ครั้ง (315)</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
