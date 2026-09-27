"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LabWorldBackground } from "./LabWorldBackground";
import { FloatingCardIcons } from "./FloatingCardIcons";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

interface BootScreenProps {
  onComplete: () => void;
}

const TIPS = [
  "กำลังอุ่นเครื่อง generator ⁹⁹ᵐTc...",
  "กำลังสับการ์ด Capillary Blockade...",
  "กำลังตั้งกล้องตรวจ PET/CT...",
  "กำลังตรวจเช็กขนาดอนุภาค MAA 10–50 μm...",
  "กำลังเร่งอนุภาคไซโคลตรอนผลิต ¹⁸F...",
  "กำลังจัดเรียงสำรับกลไก 12 รูปแบบ...",
];

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Tip rotator
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 900);

    // Progress bar 0 to 100 in 3 seconds
    const start = Date.now();
    const duration = 2800;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressInterval);
        clearInterval(tipInterval);
        setTimeout(onComplete, 300);
      }
    }, 40);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [onComplete]);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between items-center z-50">
      {/* Game World Background */}
      <LabWorldBackground />

      {/* Floating 4-Color Prototype Cards */}
      <FloatingCardIcons />

      {/* Top Header / Mute control */}
      <div className="w-full flex justify-between items-center p-6 z-20">
        <div className="bg-black/30 backdrop-blur-xs text-amber-200 text-xs px-3 py-1.5 rounded-full border border-amber-400/40 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>INITIALIZING NUCLEAR MEDICINE ARENA</span>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="bg-black/40 hover:bg-black/60 p-2.5 rounded-full text-white/80 hover:text-white transition-colors border border-white/20"
          title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-300" /> : <Volume2 className="w-5 h-5 text-emerald-300" />}
        </button>
      </div>

      {/* Central 3D Logo Section */}
      <div className="flex flex-col items-center text-center my-auto z-20 px-4">
        {/* Radioactive Trefoil Icon Above Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mb-2 rounded-full bg-amber-400 border-4 border-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30"
        >
          <span className="text-2xl font-bold text-slate-900 select-none">☢️</span>
        </motion.div>

        {/* 3D Big Title */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-black text-amber-300 tracking-wider font-game text-shadow-gold-title filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
        >
          NucMed Arena
        </motion.h1>

        {/* Mode & Subtitle Plaque */}
        <div className="wood-panel px-6 py-2.5 rounded-xl mt-3 text-center max-w-lg shadow-2xl">
          <div className="text-amber-100 font-bold text-base md:text-xl font-game tracking-wide">
            จับคู่สาร · จับคู่กลไก · รอบโต๊ะไพ่
          </div>
          <div className="text-amber-300/80 text-[10px] md:text-xs font-semibold tracking-widest uppercase mt-0.5">
            LEARN • MATCH • PLAY • NUCLEAR MEDICINE
          </div>
        </div>
      </div>

      {/* Bottom Loading Progress Bar & Tips */}
      <div className="w-full max-w-xl px-6 pb-12 z-20 flex flex-col items-center">
        {/* Dynamic Tip Text */}
        <motion.div
          key={tipIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-amber-950 font-semibold text-xs md:text-sm mb-2 text-center bg-white/70 backdrop-blur-xs px-4 py-1 rounded-full shadow border border-amber-300/60"
        >
          {TIPS[tipIndex]}
        </motion.div>

        {/* Wood/Metal Progress Bar Frame */}
        <div className="w-full h-8 bg-wood-dark border-4 border-wood-light rounded-xl p-1 shadow-2xl relative overflow-hidden">
          <motion.div
            className="h-full rounded-lg bg-gradient-to-r from-emerald-500 via-green-400 to-amber-300 shadow-inner relative"
            style={{ width: `${progress}%` }}
          >
            {/* Striped animation overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[pulse_1.5s_infinite]" />
          </motion.div>
          
          {/* Centered Percentage */}
          <div className="absolute inset-0 flex items-center justify-center font-game font-bold text-xs text-white text-shadow-sub">
            {progress}%
          </div>
        </div>

        {/* Skip button for quick dev access */}
        <button
          onClick={onComplete}
          className="text-[11px] text-slate-800 font-semibold underline mt-3 hover:text-black transition-colors"
        >
          กดข้ามหน้ารอโหลด (Skip)
        </button>
      </div>
    </div>
  );
}
