"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LabWorldBackground } from "./LabWorldBackground";
import { FloatingCardIcons } from "./FloatingCardIcons";
import { MascotNew, MascotMed, MascotGamma } from "./Mascots";
import { StudentLoginModal } from "./StudentLoginModal";
import { Play, LogIn, ShoppingBag, BookOpen, Volume2, VolumeX, Sparkles, Image as ImageIcon } from "lucide-react";
import { StudentUser } from "@nucmed/shared";

interface TitleSplashProps {
  onLoginSuccess: (user: StudentUser) => void;
  onOpenGallery?: () => void;
  onOpenHowTo?: () => void;
}

export function TitleSplash({ onLoginSuccess, onOpenGallery, onOpenHowTo }: TitleSplashProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between items-center z-40 select-none">
      {/* 1. Background game world (Warm science laboratory scenery) */}
      <LabWorldBackground />

      {/* 2. Floating 4-Color Prototype Cards (Blue, Gold, Red, Green) */}
      <FloatingCardIcons />

      {/* 3. Top Navigation & Status Bar */}
      <div className="w-full flex justify-between items-center px-4 md:px-8 pt-4 z-20">
        {/* Left Badge: Version / Mode */}
        <div className="bg-amber-950/80 backdrop-blur-xs text-amber-200 text-xs px-3.5 py-1.5 rounded-full border border-amber-500/50 flex items-center space-x-2 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold tracking-wider">MODE 1: LOCALIZATION MATCH</span>
        </div>

        {/* Right Action Icons: Gallery, Sound, Info */}
        <div className="flex items-center space-x-2.5">
          {onOpenGallery && (
            <button
              onClick={onOpenGallery}
              className="bg-rp-head hover:bg-rp text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-blue-400 flex items-center space-x-1.5 transition-transform hover:scale-105"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>อัลบั้มการ์ด 4 สี</span>
            </button>
          )}

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-black/40 hover:bg-black/60 p-2 rounded-full text-white transition-colors border border-white/20 shadow-md"
            title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          </button>
        </div>
      </div>

      {/* 4. Center Area: Logo + Subtitle + Mascots Team */}
      <div className="flex flex-col items-center text-center my-auto z-20 w-full max-w-4xl px-4">
        {/* Central 3D Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative flex flex-col items-center"
        >
          {/* Radioactive Badge on top */}
          <div className="w-12 h-12 rounded-full bg-amber-400 border-3 border-amber-600 flex items-center justify-center shadow-lg -mb-3 z-30">
            <span className="text-xl">☢️</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black font-game text-amber-300 text-shadow-gold-title tracking-tight filter drop-shadow-[0_12px_14px_rgba(0,0,0,0.6)]">
            NucMed Arena
          </h1>

          {/* Wooden Subtitle Plaque */}
          <div className="wood-panel px-6 py-2 rounded-xl mt-1 text-center shadow-2xl border-3 border-amber-950">
            <div className="text-amber-100 font-black text-sm md:text-lg font-game tracking-wider">
              จับคู่สาร · จับคู่กลไก · รอบโต๊ะไพ่
            </div>
            <div className="text-amber-300/80 text-[10px] md:text-xs font-semibold tracking-widest uppercase">
              LEARN • MATCH • PLAY • NUCLEAR MEDICINE
            </div>
          </div>
        </motion.div>

        {/* 5. Central Mascots: ทีม Hot Cell (นิว, เมด, แกมม่า) */}
        <div className="relative flex items-end justify-center mt-4 md:mt-6 space-x-2 md:space-x-8">
          {/* New (Male student) */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="transform hover:scale-105 transition-transform"
          >
            <MascotNew className="w-28 md:w-36 h-36 md:h-48 drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
          </motion.div>

          {/* Gamma (Lab dog) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="transform hover:scale-110 transition-transform mb-1"
          >
            <MascotGamma className="w-20 md:w-28 h-24 md:h-32 drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]" />
          </motion.div>

          {/* Med (Female student) */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="transform hover:scale-105 transition-transform"
          >
            <MascotMed className="w-28 md:w-36 h-36 md:h-48 drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
          </motion.div>
        </div>

        {/* 6. Big Green PLAY Button (Matching Reference Image) */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="mt-6 md:mt-8 z-30"
        >
          <button
            onClick={() => setIsLoginOpen(true)}
            className="px-12 md:px-20 py-4 md:py-5 bg-play hover:bg-play-hover border-4 border-play-border rounded-2xl text-white font-game font-black text-2xl md:text-3xl tracking-widest shadow-play-btn active:shadow-play-btn-pressed transition-all flex items-center space-x-4 cursor-pointer group"
          >
            <Play className="w-8 h-8 fill-white text-white group-hover:translate-x-1 transition-transform" />
            <span className="text-shadow-sub">PLAY</span>
          </button>
        </motion.div>

        {/* 7. Secondary Action Buttons: เข้าห้อง / ร้านค้า / วิธีเล่น */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 z-30">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="wood-panel px-4 py-2 rounded-xl text-amber-100 hover:text-white text-xs md:text-sm font-bold flex items-center space-x-1.5 hover:scale-105 transition-transform shadow-md"
          >
            <LogIn className="w-4 h-4 text-emerald-300" />
            <span>เข้าห้องด้วยรหัส</span>
          </button>

          <button
            onClick={() => setIsLoginOpen(true)}
            className="wood-panel px-4 py-2 rounded-xl text-amber-100 hover:text-white text-xs md:text-sm font-bold flex items-center space-x-1.5 hover:scale-105 transition-transform shadow-md"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>ร้านค้า NucCoin</span>
          </button>

          <button
            onClick={onOpenHowTo}
            className="wood-panel px-4 py-2 rounded-xl text-amber-100 hover:text-white text-xs md:text-sm font-bold flex items-center space-x-1.5 hover:scale-105 transition-transform shadow-md"
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
          setIsLoginOpen(false);
          onLoginSuccess(user);
        }}
      />
    </div>
  );
}
