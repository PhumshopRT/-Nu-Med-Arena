"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RpCard } from "../cards/RpCard";
import { CardBack } from "../cards/CardBack";
import { ALL_RP_CARDS } from "@nucmed/shared";
import { normalizeShopId } from "@/lib/user";
import { Sparkles, RefreshCw, Award, Smile, Shield, Layers, Zap } from "lucide-react";

export interface LivePreviewPanelProps {
  frameId: string;
  backId: string;
  faceUp: boolean;
  fxId: string;
  titleId: string;
  avatarId?: string;
  previewItemName?: string;
  activeTab?: "frame" | "cardback" | "avatar" | "fx" | "title";
  onToggleFlip?: () => void;
  isFxPlaying?: boolean;
  onPlayFx?: () => void;
}

export function LivePreviewPanel({
  frameId,
  backId,
  faceUp,
  fxId,
  titleId,
  avatarId = "avatar-default",
  previewItemName,
  activeTab = "frame",
  onToggleFlip,
  isFxPlaying = false,
  onPlayFx
}: LivePreviewPanelProps) {
  const sampleCard = ALL_RP_CARDS[0]; // R-01 18F-FDG

  const normFrame = normalizeShopId(frameId);
  const normBack = normalizeShopId(backId);
  const normAvatar = normalizeShopId(avatarId);
  const normTitle = normalizeShopId(titleId);
  const normFx = normalizeShopId(fxId);

  // Card back theme
  const getCardBackTheme = (): "navy" | "hotcell" | "pet" => {
    if (normBack === "back-hotcell") return "hotcell";
    if (normBack === "back-pet") return "pet";
    return "navy";
  };

  // Avatar config
  const getAvatarInfo = () => {
    switch (normAvatar) {
      case "avatar-thyroid":
        return { icon: "🦋", name: "ต่อมไทรอยด์ผีเสื้อ", color: "from-amber-400 to-orange-500", glow: "shadow-amber-500/50" };
      case "avatar-lung":
        return { icon: "🫁", name: "ปอดและหลอดเลือด", color: "from-cyan-400 to-blue-600", glow: "shadow-cyan-500/50" };
      case "av_bone":
        return { icon: "🦴", name: "ผลึกกระดูก", color: "from-slate-200 to-slate-400", glow: "shadow-slate-400/50" };
      case "avatar-default":
      default:
        return { icon: "☢️", name: "โมเลกุล ¹⁸F-FDG", color: "from-amber-300 via-amber-400 to-amber-600", glow: "shadow-amber-400/50" };
    }
  };

  // Title name
  const getTitleDisplayName = () => {
    if (normTitle === "title-capillary") return "Capillary Blockader";
    if (normTitle === "title_fdg") return "FDG Hunter";
    if (normTitle === "title-none") return "ไม่มีฉายา (นักศึกษาใหม่)";
    return "Capillary Blockader";
  };

  const avatarInfo = getAvatarInfo();

  return (
    <div className="w-full wood-panel p-5 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col items-center select-none">
      {/* Header */}
      <div className="w-full flex flex-col items-center pb-2 border-b border-amber-900/60 mb-3 text-center">
        <h3 className="font-game font-black text-amber-200 text-sm md:text-base tracking-wide flex items-center space-x-1.5">
          <span>🎨</span>
          <span>ตัวอย่างสด (LIVE PREVIEW)</span>
        </h3>
        {/* Dynamic preview item name badge */}
        <div className="mt-1 px-3 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/60 text-[11px] font-bold text-amber-300 flex items-center space-x-1.5 shadow-inner">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
          <span>กำลังดูตัวอย่าง: <strong className="text-white font-game">{previewItemName || "ชิ้นที่เลือก"}</strong></span>
        </div>
      </div>

      {/* Main Preview Zone based on active tab / preview state */}
      <div className="w-full flex flex-col items-center justify-center min-h-[360px] relative py-2">
        {/* ----------------------------------------------------
            1. AVATAR SHOWCASE (แท็บอวตาร: โชว์รูปอวตาร ไม่ใช่การ์ด R-01 ค้าง)
            ---------------------------------------------------- */}
        {activeTab === "avatar" ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center w-full py-4"
          >
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-3">
              อวตารประจำตัวผู้เล่น (PLAYER AVATAR)
            </span>

            {/* Glowing Big Avatar Badge */}
            <div className="relative mb-3">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${avatarInfo.color} border-4 border-amber-200 flex items-center justify-center shadow-2xl ${avatarInfo.glow}`}>
                <span className="text-6xl filter drop-shadow-md select-none">{avatarInfo.icon}</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950 border border-amber-400 text-[10px] font-mono font-bold text-amber-200 whitespace-nowrap shadow-md">
                {avatarInfo.name}
              </div>
            </div>

            {/* Mockup Profile Plaque showing this avatar */}
            <div className="wood-panel px-5 py-2.5 rounded-2xl flex items-center space-x-3 mt-4 border-2 border-amber-900 shadow-xl max-w-xs">
              <div className="w-10 h-10 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center text-xl shadow-inner">
                {avatarInfo.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-white font-game">นักศึกษา 7052</div>
                <div className="text-[10px] text-amber-300 font-mono">LV.1 • สังเวียนประลอง</div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ----------------------------------------------------
             2. CARD SHOWCASE (หน้าการ์ด หรือ หลังไพ่ พร้อมกรอบและเอฟเฟกต์)
             ---------------------------------------------------- */
          <div className="relative flex flex-col items-center">
            {/* View Mode Label */}
            <div className="flex items-center justify-between w-full px-2 mb-2">
              <span className="text-[10px] font-bold text-amber-300 uppercase">
                {faceUp ? "หน้าการ์ด (FACE)" : "หลังไพ่ (BACK)"}
              </span>
              {onToggleFlip && (
                <button
                  onClick={onToggleFlip}
                  className="px-2.5 py-1 rounded-lg bg-amber-900/60 hover:bg-amber-800 border border-amber-600/50 text-[10px] font-bold text-amber-200 flex items-center space-x-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>พลิกดู{faceUp ? "หลังไพ่" : "หน้าการ์ด"}</span>
                </button>
              )}
            </div>

            {/* Card Frame Wrapper with Strict Visual Stylings */}
            <div className="relative">
              {faceUp ? (
                /* Card Face with Frame */
                <div
                  className={`transition-all duration-300 ${
                    normFrame === "frame-gold"
                      ? "p-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 border-4 border-amber-300 shadow-[0_0_28px_rgba(245,158,11,0.85)] scale-102"
                      : normFrame === "frame-reactor"
                      ? "p-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 border-4 border-cyan-300 shadow-[0_0_28px_rgba(6,182,212,0.95)] animate-pulse scale-102"
                      : "p-1 rounded-2xl bg-[#2F6FED] border border-[#1E4FD7] shadow-lg"
                  }`}
                >
                  <RpCard card={sampleCard} size="md" isHoverable={false} />
                </div>
              ) : (
                /* Card Back */
                <div className="p-1 rounded-2xl shadow-xl">
                  <CardBack
                    size="md"
                    theme={getCardBackTheme()}
                    onClick={onToggleFlip}
                  />
                </div>
              )}

              {/* 2-Second FX Sparkle Overlay */}
              <AnimatePresence>
                {isFxPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden rounded-2xl"
                  >
                    {normFx === "fx-gamma" ? (
                      /* Golden Gamma Radiation Waves Burst */
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute w-48 h-48 rounded-full border-4 border-amber-300/80 animate-ping" />
                        <div className="absolute w-60 h-60 rounded-full border-2 border-yellow-400/60 animate-pulse" />
                        <div className="absolute inset-0 bg-radial from-amber-400/40 via-transparent to-transparent animate-pulse" />
                        <span className="text-3xl font-black text-amber-200 filter drop-shadow-[0_0_12px_gold] animate-bounce">
                          ⚡ GAMMA WAVE ⚡
                        </span>
                      </div>
                    ) : (
                      /* Confetti Victory Sparkles */
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-radial from-cyan-400/30 via-transparent to-transparent" />
                        {[...Array(12)].map((_, i) => (
                          <motion.span
                            key={i}
                            animate={{
                              y: [-20, 20, -20],
                              x: [-15, 15, -15],
                              opacity: [0, 1, 0],
                              scale: [0.5, 1.3, 0.5]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                            className="absolute text-xl"
                            style={{
                              top: `${15 + (i * 7)}%`,
                              left: `${10 + (i * 7)}%`,
                            }}
                          >
                            {["✨", "🎉", "🌟", "⭐", "🎊"][i % 5]}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------
          3. TITLE SHOWCASE (แท็บฉายา: โชว์แถบฉายาใต้ชื่อจำลอง)
          ---------------------------------------------------- */}
      <div className="w-full mt-3 p-3 bg-amber-950/85 rounded-2xl border-2 border-amber-700/60 text-center shadow-lg">
        <div className="text-[10px] text-amber-300/90 uppercase font-black tracking-wider flex items-center justify-center space-x-1">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>แถบฉายาใต้ชื่อจำลอง (PLAYER TITLE BANNER)</span>
        </div>
        <div className="text-xs text-white/90 font-mono mt-0.5">
          นักศึกษา 7052
        </div>
        <div className="inline-block mt-1 px-4 py-1 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-game font-black text-xs md:text-sm tracking-wide shadow border border-amber-300">
          « {getTitleDisplayName()} »
        </div>
      </div>

      {/* Action / Replay FX Button for FX tab */}
      {activeTab === "fx" && onPlayFx && (
        <button
          onClick={onPlayFx}
          className="mt-3 px-4 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold font-game flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-300" />
          <span>เล่นประกายเอฟเฟกต์ (2 วินาที)</span>
        </button>
      )}
    </div>
  );
}
