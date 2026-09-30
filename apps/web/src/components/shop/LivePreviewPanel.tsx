"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RpCard } from "../cards/RpCard";
import { CardBack } from "../cards/CardBack";
import { ALL_RP_CARDS } from "@nucmed/shared";
import { normalizeShopId } from "@/lib/user";
import { AvatarBadge } from "@/components/ui/AvatarBadge";
import { TrefoilIcon } from "@/components/ui/TrefoilIcon";
import { Sparkles, RefreshCw, Award, Smile, Shield, Layers, Zap, Lock, CheckCircle2 } from "lucide-react";
import { getAssetPath } from "@/lib/assets";

export interface LivePreviewPanelProps {
  frameId: string;
  backId: string;
  faceUp: boolean;
  fxId: string;
  titleId: string;
  avatarId?: string;
  tableId?: string;
  previewItemName?: string;
  activeTab?: "frame" | "cardback" | "avatar" | "fx" | "title" | "table";
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
  tableId = "table-wood",
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
  const normTable = normalizeShopId(tableId);

  // Card back theme
  const getCardBackTheme = (): "navy" | "hotcell" | "pet" | "cyclotron" | "nightlab" => {
    if (normBack === "back-hotcell") return "hotcell";
    if (normBack === "back-pet") return "pet";
    if (normBack === "back-cyclotron") return "cyclotron";
    if (normBack === "back-nightlab") return "nightlab";
    return "navy";
  };

  // Avatar descriptive name
  const getAvatarLabel = () => {
    switch (normAvatar) {
      case "avatar-niw": return "นิว (มาสคอตนักฟิสิกส์)";
      case "avatar-med": return "เมด (มาสคอตแพทย์รังสี)";
      case "avatar-gamma": return "แกมม่า (ลำแสงพลังงาน)";
      case "avatar-thyroid": return "ต่อมไทรอยด์ผีเสื้อ";
      case "avatar-lung": return "ปอดและหลอดเลือด";
      case "av-bone":
      case "av_bone": return "ผลึกกระดูก";
      case "avatar-default":
      default:
        return "โมเลกุล ¹⁸F-FDG";
    }
  };

  // Title name
  const getTitleDisplayName = () => {
    switch (normTitle) {
      case "title-master-halflife": return "ผู้พิทักษ์ครึ่งชีวิต (Half-life Master)";
      case "title-photon": return "ผู้ควบคุมโฟตอน (Photon Controller)";
      case "title-tumor": return "นักล่าเนื้องอกระดับโมเลกุล (Tumor Hunter)";
      case "title-theranostics": return "ปรมาจารย์เทอรานอสติกส์ (Theranostics Master)";
      case "title-perfusion": return "Lung Perfusion";
      case "title-fdg": return "FDG Reader";
      case "title-capillary": return "Capillary Blockader";
      case "title-none": return "ไม่มีฉายา (นักศึกษาใหม่)";
      default: return "ไม่มีฉายา";
    }
  };

  // Table theme styling helper
  const getTableThemeInfo = () => {
    switch (normTable) {
      case "table-cyber":
        return {
          name: "สังเวียนฮอตเซลล์นีออน (Cyber Hot Cell)",
          feltClass: "bg-radial from-[#053248] via-[#03151e] to-[#01080d] border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.4)]",
          glowColor: "text-cyan-300",
          badgeBg: "bg-cyan-950/90 border-cyan-500/70 text-cyan-200"
        };
      case "table-emerald":
        return {
          name: "โต๊ะกำมะหยี่สีมรกต (Emerald Casino Cloth)",
          feltClass: "bg-radial from-[#094e2e] via-[#042817] to-[#01140b] border-2 border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.4)]",
          glowColor: "text-emerald-300",
          badgeBg: "bg-emerald-950/90 border-emerald-500/70 text-emerald-200"
        };
      case "table-clinic":
        return {
          name: "โต๊ะห้องปลอดเชื้อคลินิก (Clinical Cleanroom)",
          feltClass: "bg-radial from-[#183850] via-[#0c1c28] to-[#050c12] border-2 border-sky-400/60 shadow-[0_0_25px_rgba(56,189,248,0.4)]",
          glowColor: "text-sky-300",
          badgeBg: "bg-slate-900/90 border-sky-500/70 text-sky-200"
        };
      case "table-cosmic":
        return {
          name: "สังเวียนเนบิวลาห้วงอวกาศ (Cosmic Nebula Void)",
          feltClass: "bg-radial from-[#220d4f] via-[#0e0724] to-[#04020a] border-2 border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.4)]",
          glowColor: "text-purple-300",
          badgeBg: "bg-purple-950/90 border-purple-500/70 text-purple-200"
        };
      case "table-wood":
      default:
        return {
          name: "โต๊ะไม้มะฮอกกานีคลาสสิก (Mahogany Felt)",
          feltClass: "bg-radial from-[#451f0f] via-[#2a1309] to-[#140803] border-2 border-amber-600/60 shadow-[0_0_20px_rgba(180,83,9,0.4)]",
          glowColor: "text-amber-300",
          badgeBg: "bg-amber-950/90 border-amber-500/70 text-amber-200"
        };
    }
  };

  // Frame outer presentation classes
  const getFrameContainerClasses = () => {
    switch (normFrame) {
      case "frame-gold":
        return "p-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 border-4 border-amber-300 shadow-[0_0_28px_rgba(245,158,11,0.85)] scale-102";
      case "frame-reactor":
        return "p-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 border-4 border-cyan-300 shadow-[0_0_28px_rgba(6,182,212,0.95)] animate-pulse scale-102";
      case "frame-clinic":
        return "p-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-red-400 to-rose-600 border-4 border-rose-300 shadow-[0_0_28px_rgba(244,63,94,0.85)] scale-102";
      case "frame-tracer":
        return "p-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 border-4 border-emerald-300 shadow-[0_0_28px_rgba(52,211,153,0.95)] animate-pulse scale-102";
      case "frame-graphite":
      default:
        return "p-1 rounded-2xl bg-[#2F6FED] border border-[#1E4FD7] shadow-lg";
    }
  };

  return (
    <div className="w-full wood-panel p-5 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col items-center select-none">
      {/* Header */}
      <div className="w-full flex flex-col items-center pb-2 border-b border-amber-900/60 mb-3 text-center">
        <h3 className="font-game font-black text-amber-200 text-sm md:text-base tracking-wide flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
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
            1. AVATAR SHOWCASE (แท็บอวตาร: โชว์รูปอวตารเวกเตอร์คมชัด)
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

            {/* Glowing Big Avatar Badge using pure SVG AvatarBadge */}
            <div className="relative mb-3">
              <div className="p-2 rounded-full bg-slate-950/80 border-4 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                <AvatarBadge avatarId={normAvatar} size={118} />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950 border border-amber-400 text-[10.5px] font-mono font-bold text-amber-200 whitespace-nowrap shadow-md">
                {getAvatarLabel()}
              </div>
            </div>

            {/* Mockup Profile Plaque showing this avatar */}
            <div className="wood-panel px-5 py-2.5 rounded-2xl flex items-center space-x-3 mt-4 border-2 border-amber-900 shadow-xl max-w-xs">
              <AvatarBadge avatarId={normAvatar} size={38} />
              <div>
                <div className="text-xs font-bold text-white font-game">นักศึกษา 7052</div>
                <div className="text-[10px] text-amber-300 font-mono">LV.1 • สังเวียนประลอง</div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ----------------------------------------------------
             2. CARD & TABLE SHOWCASE (หน้าการ์ด หรือ หลังไพ่ พร้อมกรอบ เอฟเฟกต์ และพื้นโต๊ะสังเวียน)
             ---------------------------------------------------- */
          <div className="relative flex flex-col items-center w-full">
            {/* View Mode Label */}
            <div className="flex items-center justify-between w-full px-2 mb-2">
              <span className="text-[10px] font-bold text-amber-300 uppercase">
                {activeTab === "table" ? "พื้นโต๊ะสังเวียน (ARENA FELT)" : faceUp ? "หน้าการ์ด (FACE)" : "หลังไพ่ (BACK)"}
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

            {/* Table Mat Felt Surface Container with Real Image Texture */}
            <div className={`w-full max-w-sm p-4 rounded-3xl transition-all duration-500 relative flex flex-col items-center overflow-hidden border-2 shadow-2xl ${getTableThemeInfo().feltClass}`}>
              {/* Actual Table Background Image Layer */}
              <img
                src={getAssetPath(normTable === "table-wood" ? "/scene/play-table.webp" : `/scene/${normTable}.webp`)}
                alt="Table Felt Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />

              {/* Table Atmosphere Tag */}
              <div className={`mb-3 px-3 py-1 rounded-full border text-[11px] font-game font-bold flex items-center space-x-1.5 shadow-md relative z-10 ${getTableThemeInfo().badgeBg}`}>
                <Layers className="w-3.5 h-3.5" />
                <span>{getTableThemeInfo().name}</span>
              </div>

              {/* Card Frame Wrapper with Strict Visual Stylings */}
              <div className="relative">
                {faceUp ? (
                  /* Card Face with Frame */
                  <div className={`transition-all duration-300 ${getFrameContainerClasses()}`}>
                    <RpCard card={sampleCard} size="md" isHoverable={false} frameId={normFrame} />
                  </div>
                ) : (
                  /* Card Back */
                  <div className="p-1 rounded-2xl shadow-xl">
                    <CardBack
                      size="md"
                      theme={getCardBackTheme()}
                      backId={normBack}
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
                        <span className="text-2xl font-black text-amber-200 filter drop-shadow-[0_0_12px_gold] animate-bounce tracking-wider">
                          ⚡ GAMMA WAVE ⚡
                        </span>
                      </div>
                    ) : normFx === "fx-lock" ? (
                      /* Neon Blue/Cyan Lock Confirmation Burst */
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute inset-2 rounded-2xl border-4 border-cyan-400 animate-pulse shadow-[0_0_25px_rgba(34,211,238,0.9)]" />
                        <div className="absolute w-36 h-36 rounded-full border-2 border-dashed border-cyan-300 animate-spin" />
                        <div className="px-3.5 py-1.5 rounded-full bg-cyan-950/95 border-2 border-cyan-400 text-cyan-200 text-xs font-game font-black flex items-center space-x-1.5 shadow-2xl animate-bounce">
                          <Lock className="w-3.5 h-3.5 text-cyan-300" />
                          <span>ANSWER LOCKED</span>
                        </div>
                      </div>
                    ) : normFx === "fx-win" ? (
                      /* Radiant Victory Emerald/Gold Sparkles Burst */
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-radial from-emerald-400/35 via-transparent to-transparent animate-pulse" />
                        <div className="absolute w-44 h-44 rounded-full border-2 border-emerald-300/80 animate-ping" />
                        <div className="px-3.5 py-1.5 rounded-full bg-emerald-950/95 border-2 border-emerald-400 text-emerald-200 text-xs font-game font-black flex items-center space-x-1.5 shadow-2xl animate-bounce">
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>CORRECT MATCH!</span>
                        </div>
                      </div>
                    ) : (
                      /* Default Subtle Motes */
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-radial from-amber-400/20 via-transparent to-transparent" />
                        <Sparkles className="w-12 h-12 text-amber-300 animate-spin" />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
