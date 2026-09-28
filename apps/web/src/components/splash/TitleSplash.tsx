"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LabWorldBackground } from "./LabWorldBackground";
import { FloatingCardIcons } from "./FloatingCardIcons";
import { MascotNew, MascotMed, MascotGamma } from "./Mascots";
import { StudentLoginModal } from "./StudentLoginModal";
import { Play, LogIn, ShoppingBag, BookOpen, Volume2, VolumeX, Image as ImageIcon } from "lucide-react";
import { StudentUser } from "@nucmed/shared";
import { sounds } from "@/lib/sound";

interface TitleSplashProps {
  onLoginSuccess: (user: StudentUser) => void;
  onOpenGallery?: () => void;
  onOpenHowTo?: () => void;
  onOpenShop?: () => void;
}

export function TitleSplash({ onLoginSuccess, onOpenGallery, onOpenHowTo, onOpenShop }: TitleSplashProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);

  const triggerSpeech = (speaker: string, text: string) => {
    sounds.playSelect();
    setActiveSpeech(`${speaker}: ${text}`);
    setTimeout(() => {
      setActiveSpeech((prev) => (prev?.startsWith(speaker) ? null : prev));
    }, 2800);
  };

  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sounds.playClick();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none z-0">
      {/* 1. Background game world: Sky (0-58%) & Wooden Deck Table (58-100%) */}
      <LabWorldBackground />

      {/* 2. Side Floating 4-Color Prototype Cards: [ cards-left ] & [ cards-right ] */}
      <FloatingCardIcons />

      {/* ========================================================
          CENTER STAGE (x = 430 to 1010)
          Divided strictly into Sky Zone (0–58%) and Deck Zone (58–100%)
          Guaranteed zero overlap between cards, mascots, and buttons
          ======================================================== */}
      <div className="absolute inset-0 flex flex-col pointer-events-none z-20">
        {/* ----------------------------------------------------
            ZONE: [ sky 0–58% ]
            - Top status & controls bar
            - 3D Game title & wooden subtitle plaque
            - Single row of mascots strictly ABOVE the PLAY button
            ---------------------------------------------------- */}
        <div className="w-full h-[58%] flex flex-col justify-between items-center px-4 md:px-8 pt-3 pb-2 z-20 pointer-events-none">
          {/* Top Bar: Mode status & quick links */}
          <div className="w-full flex justify-between items-center pointer-events-auto z-30">
            {/* Left Mode Indicator */}
            <div className="bg-amber-950/85 backdrop-blur-md text-amber-200 text-xs px-4 py-1.5 rounded-full border-2 border-amber-500/60 flex items-center space-x-2.5 shadow-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold tracking-wider font-game">MODE 1: LOCALIZATION MATCH</span>
            </div>

            {/* Right Action Icons: Gallery & Sound Mute */}
            <div className="flex items-center space-x-2.5">
              {onOpenGallery && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenGallery();
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg border-2 border-blue-300 flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>อัลบั้มการ์ด 4 สี</span>
                </button>
              )}

              <button
                onClick={handleToggleMute}
                className="bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-all border-2 border-amber-500/40 shadow-lg hover:scale-110 active:scale-90 cursor-pointer"
                title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
              </button>
            </div>
          </div>

          {/* Central Logo & Wooden Subtitle Plaque */}
          <div className="flex flex-col items-center text-center my-auto pointer-events-auto">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
              className="relative flex flex-col items-center"
            >
              {/* Radioactive Badge on top */}
              <div className="relative mb-[-12px] z-30">
                <div className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-2 md:border-3 border-amber-800 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <span className="text-xl md:text-2xl filter drop-shadow">☢️</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-7xl lg:text-8xl font-black font-game text-amber-300 text-shadow-gold-title tracking-tight filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.7)] select-none">
                NucMed Arena
              </h1>

              {/* Wooden Subtitle Plaque */}
              <div className="wood-panel px-5 md:px-7 py-1.5 md:py-2 rounded-xl mt-1 text-center shadow-xl border-2 md:border-3 border-amber-950 flex flex-col items-center">
                <div className="text-amber-100 font-black text-xs md:text-base font-game tracking-wider">
                  จับคู่สาร · จับคู่กลไก · รอบโต๊ะไพ่
                </div>
                <div className="text-amber-300/90 text-[9px] md:text-xs font-black tracking-widest uppercase mt-0.5">
                  LEARN • MATCH • PLAY • NUCLEAR MEDICINE
                </div>
              </div>
            </motion.div>

            {/* Mascot Speech Bubble Toast */}
            <AnimatePresence>
              {activeSpeech && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="mt-2 bg-amber-950/95 text-amber-200 border-2 border-amber-400 px-4 py-1 rounded-full text-xs font-bold shadow-xl z-40"
                >
                  💬 {activeSpeech}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mascots Row (Strictly above deck border & PLAY button, with clear margin) */}
          <div className="flex items-end justify-center space-x-6 md:space-x-10 pointer-events-auto z-20 mb-3 md:mb-5">
            {/* Mascot 1: New (นิว) */}
            <motion.div
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => triggerSpeech("นิว", "พร้อมลุยตรวจ PET ด้วย ¹⁸F-FDG แล้วครับ!")}
              className="flex flex-col items-center cursor-pointer group"
              title="คลิกเพื่อนิวพูดคุย!"
            >
              <MascotNew className="w-22 md:w-30 h-28 md:h-38 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]" />
              {/* Name Tag: Exactly 22px high, zero clipping */}
              <div className="h-[22px] min-w-[54px] px-3 bg-[#0B3B36] border-2 border-emerald-400 rounded-full flex items-center justify-center shadow-md mt-1 group-hover:border-emerald-300 transition-colors">
                <span className="text-white text-xs font-bold leading-none">นิว</span>
              </div>
            </motion.div>

            {/* Mascot 2: Gamma (แกมม่า) */}
            <motion.div
              whileHover={{ scale: 1.12, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => triggerSpeech("แกมม่า", "โฮ่ง! ดมกลิ่นรังสีเจอแล้ว ☢️")}
              className="flex flex-col items-center cursor-pointer group mb-0.5"
              title="คลิกเพื่อแกมม่ากระดิกหาง!"
            >
              <MascotGamma className="w-18 md:w-22 h-22 md:h-26 drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]" />
              {/* Name Tag: Exactly 22px high, zero clipping */}
              <div className="h-[22px] min-w-[54px] px-3 bg-[#0B3B36] border-2 border-amber-400 rounded-full flex items-center justify-center shadow-md mt-1 group-hover:border-amber-300 transition-colors">
                <span className="text-white text-xs font-bold leading-none">แกมม่า</span>
              </div>
            </motion.div>

            {/* Mascot 3: Med (เมด) */}
            <motion.div
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => triggerSpeech("เมด", "วิเคราะห์กลไก Capillary Blockade ให้แม่นยำนะ!")}
              className="flex flex-col items-center cursor-pointer group"
              title="คลิกเพื่อเมดให้กำลังใจ!"
            >
              <MascotMed className="w-22 md:w-30 h-28 md:h-38 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]" />
              {/* Name Tag: Exactly 22px high, zero clipping */}
              <div className="h-[22px] min-w-[54px] px-3 bg-[#0B3B36] border-2 border-rose-400 rounded-full flex items-center justify-center shadow-md mt-1 group-hover:border-rose-300 transition-colors">
                <span className="text-white text-xs font-bold leading-none">เมด</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ----------------------------------------------------
            ZONE: [ deck 58–100% ]
            - Green 3D PLAY button sitting on horizon
            - 3 Secondary action buttons
            - Credits plaque at bottom
            ---------------------------------------------------- */}
        <div className="w-full h-[42%] flex flex-col justify-between items-center pt-1 pb-4 z-30 pointer-events-none">
          {/* PLAY Button: Straddling deck horizon */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="pointer-events-auto z-40 mt-1 md:mt-2"
          >
            <button
              onClick={() => {
                sounds.playClick();
                setIsLoginOpen(true);
              }}
              onMouseEnter={() => sounds.playSelect()}
              className="px-14 md:px-24 py-3.5 md:py-4.5 bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#047857] hover:from-[#4ade80] hover:to-[#059669] border-4 border-[#A7F3D0] rounded-2xl text-white font-game font-black text-2xl md:text-4xl tracking-widest shadow-[0_8px_0_#064e3b,0_14px_24px_rgba(0,0,0,0.65)] active:translate-y-2 active:shadow-[0_2px_0_#064e3b,0_6px_10px_rgba(0,0,0,0.4)] transition-all flex items-center space-x-3.5 cursor-pointer group"
            >
              <Play className="w-7 h-7 md:w-8 md:h-8 fill-white text-white group-hover:translate-x-1.5 transition-transform filter drop-shadow" />
              <span className="text-shadow-sub">PLAY</span>
            </button>
          </motion.div>

          {/* 3 Secondary Action Buttons below PLAY */}
          <div className="flex flex-wrap items-center justify-center gap-3 pointer-events-auto z-30 my-auto">
            <button
              onClick={() => {
                sounds.playClick();
                setIsLoginOpen(true);
              }}
              className="wood-panel px-4 py-2 rounded-xl text-amber-100 hover:text-white text-xs md:text-sm font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer border border-amber-600/50"
            >
              <LogIn className="w-4 h-4 text-emerald-300" />
              <span>เข้าห้องด้วยรหัส</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                if (onOpenShop) {
                  onOpenShop();
                } else {
                  setIsLoginOpen(true);
                }
              }}
              className="wood-panel px-4 py-2 rounded-xl text-amber-100 hover:text-white text-xs md:text-sm font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer border border-amber-600/50"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>ร้านค้า NucCoin</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                if (onOpenHowTo) onOpenHowTo();
              }}
              className="wood-panel px-4 py-2 rounded-xl text-amber-100 hover:text-white text-xs md:text-sm font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer border border-amber-600/50"
            >
              <BookOpen className="w-4 h-4 text-cyan-300" />
              <span>วิธีเล่น</span>
            </button>
          </div>

          {/* Bottom Credits Plaque */}
          <div className="w-full flex justify-center pointer-events-auto z-20">
            <div className="wood-panel px-6 py-1.5 rounded-lg border-2 border-amber-950 text-center shadow-lg">
              <span className="text-xs md:text-sm font-bold text-amber-200">
                พัฒนาสำหรับรายวิชานิวเคลียร์เมดิซีน (Nuclear Medicine Educational Card Game)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Student ID Login Modal */}
      <StudentLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setIsLoginOpen(false);
          onLoginSuccess(user);
        }}
      />
    </div>
  );
}
