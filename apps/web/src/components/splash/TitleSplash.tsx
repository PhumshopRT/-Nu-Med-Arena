"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LabWorldBackground } from "./LabWorldBackground";
import { FloatingCardIcons } from "./FloatingCardIcons";
import { MascotNew, MascotMed, MascotGamma } from "./Mascots";
import { StudentLoginModal } from "./StudentLoginModal";
import { Play, LogIn, ShoppingBag, BookOpen, Volume2, VolumeX, Sparkles, Image as ImageIcon } from "lucide-react";
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
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between items-center z-40 select-none">
      {/* 1. Background game world (Warm science laboratory scenery) */}
      <LabWorldBackground />

      {/* 2. Floating 4-Color Prototype Cards (Blue, Gold, Red, Green) with glowing motes */}
      <FloatingCardIcons />

      {/* 3. Top Navigation & Status Bar */}
      <div className="w-full flex justify-between items-center px-4 md:px-8 pt-4 z-20">
        {/* Left Badge: Version / Mode */}
        <div className="bg-amber-950/85 backdrop-blur-md text-amber-200 text-xs px-4 py-1.5 rounded-full border-2 border-amber-500/60 flex items-center space-x-2.5 shadow-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold tracking-wider font-game">MODE 1: LOCALIZATION MATCH</span>
        </div>

        {/* Right Action Icons: Gallery, Sound, Shop */}
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

      {/* 4. Center Area: Logo + Subtitle + Mascots Team */}
      <div className="flex flex-col items-center text-center my-auto z-20 w-full max-w-4xl px-4">
        {/* Central 3D Logo */}
        <motion.div
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="relative flex flex-col items-center"
        >
          {/* Radioactive Badge on top with rotating ray halo */}
          <div className="relative mb-[-14px] z-30">
            <motion.div
              className="absolute -inset-2 rounded-full bg-amber-400/30 blur-md pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <div className="w-13 h-13 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-3 border-amber-800 flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.5)]">
              <span className="text-2xl filter drop-shadow">☢️</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-8xl font-black font-game text-amber-300 text-shadow-gold-title tracking-tight filter drop-shadow-[0_14px_18px_rgba(0,0,0,0.7)] select-none">
            NucMed Arena
          </h1>

          {/* Wooden Subtitle Plaque */}
          <div className="wood-panel px-6 py-2 rounded-xl mt-1 text-center shadow-2xl border-3 border-amber-950 flex flex-col items-center">
            <div className="text-amber-100 font-black text-sm md:text-lg font-game tracking-wider">
              จับคู่สาร · จับคู่กลไก · รอบโต๊ะไพ่
            </div>
            <div className="text-amber-300/90 text-[10px] md:text-xs font-black tracking-widest uppercase mt-0.5">
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
              className="mt-3 bg-amber-950/90 text-amber-200 border-2 border-amber-400 px-4 py-1.5 rounded-full text-xs font-bold shadow-xl z-40"
            >
              💬 {activeSpeech}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Central Mascots: ทีม Hot Cell (นิว, เมด, แกมม่า) */}
        <div className="relative flex items-end justify-center mt-3 md:mt-5 space-x-2 md:space-x-8">
          {/* New (Male student) */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => triggerSpeech("นิว", "พร้อมลุยตรวจ PET ด้วย ¹⁸F-FDG แล้วครับ!")}
            className="cursor-pointer"
            title="คลิกเพื่อนิวพูดคุย!"
          >
            <MascotNew className="w-28 md:w-36 h-36 md:h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
          </motion.div>

          {/* Gamma (Lab dog) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.14, y: -6 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => triggerSpeech("แกมม่า", "โฮ่ง! ดมกลิ่นรังสีเจอแล้ว ☢️")}
            className="cursor-pointer mb-1"
            title="คลิกเพื่อแกมม่ากระดิกหาง!"
          >
            <MascotGamma className="w-22 md:w-28 h-26 md:h-32 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]" />
          </motion.div>

          {/* Med (Female student) */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => triggerSpeech("เมด", "วิเคราะห์กลไก Capillary Blockade ให้แม่นยำนะ!")}
            className="cursor-pointer"
            title="คลิกเพื่อเมดให้กำลังใจ!"
          >
            <MascotMed className="w-28 md:w-36 h-36 md:h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
          </motion.div>
        </div>

        {/* 6. Big Green 3D PLAY Button (Matching Reference Image) */}
        <motion.div
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          className="mt-5 md:mt-7 z-30"
        >
          <button
            onClick={() => {
              sounds.playClick();
              setIsLoginOpen(true);
            }}
            onMouseEnter={() => sounds.playSelect()}
            className="px-14 md:px-24 py-4 md:py-5 bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#047857] hover:from-[#4ade80] hover:to-[#059669] border-4 border-[#A7F3D0] rounded-2xl text-white font-game font-black text-2xl md:text-4xl tracking-widest shadow-[0_10px_0_#064e3b,0_16px_25px_rgba(0,0,0,0.6)] active:translate-y-2 active:shadow-[0_2px_0_#064e3b,0_6px_10px_rgba(0,0,0,0.4)] transition-all flex items-center space-x-4 cursor-pointer group"
          >
            <Play className="w-8 h-8 fill-white text-white group-hover:translate-x-1.5 transition-transform filter drop-shadow" />
            <span className="text-shadow-sub">PLAY</span>
          </button>
        </motion.div>

        {/* 7. Secondary Action Buttons: เข้าห้อง / ร้านค้า / วิธีเล่น */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 z-30">
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
      </div>

      {/* 8. Bottom Credit Plaque (Matching Reference Image) */}
      <div className="w-full flex flex-col items-center pb-4 z-20">
        <div className="wood-panel px-6 py-1.5 rounded-lg border-2 border-amber-950 text-center shadow-lg">
          <span className="text-xs md:text-sm font-bold text-amber-200">
            พัฒนาสำหรับรายวิชานิวเคลียร์เมดิซีน (Nuclear Medicine Educational Card Game)
          </span>
        </div>
      </div>

      {/* Student ID Login Modal */}
      <StudentLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          sounds.playWin();
          setIsLoginOpen(false);
          onLoginSuccess(user);
        }}
      />
    </div>
  );
}
