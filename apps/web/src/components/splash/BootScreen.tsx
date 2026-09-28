"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FloatingCardIcons } from "./FloatingCardIcons";
import { Volume2, VolumeX, Sparkles, Zap, Radio, Activity, ShieldCheck } from "lucide-react";
import { getAssetPath } from "@/lib/assets";

interface BootScreenProps {
  onComplete: () => void;
}

const TIPS = [
  "กำลังอุ่นเครื่อง generator ⁹⁹ᵐTc จากแม่สาร ⁹⁹Mo...",
  "กำลังสับการ์ดกลไก Capillary Blockade (ขนาดอนุภาค MAA 10–50 μm)...",
  "กำลังเร่งอนุภาคไซโคลตรอนผลิต ¹⁸F สำหรับ PET Scan 511 keV...",
  "กำลังจัดเรียงสำรับการ์ด 4 หมวด (RP, MECH, CASE, CLUE)...",
  "กำลังปรับเทียบตัวตรวจจับ Coincidence Detection ในระบบ PET...",
  "JEV Engine กำลังวิเคราะห์สิทธิ์และตรวจสอบความพร้อมระบบ...",
];

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Tip rotator
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 850);

    // Progress bar 0 to 100 in 2.6 seconds
    const start = Date.now();
    const duration = 2600;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressInterval);
        clearInterval(tipInterval);
        setTimeout(onComplete, 250);
      }
    }, 35);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [onComplete]);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between items-center z-50 select-none">
      {/* Game World Background: splash-bg.webp full screen object-fit cover [z-0] */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <img
          src={getAssetPath("/scene/splash-bg.webp")}
          alt="Loading Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Floating 4-Color Prototype Cards */}
      <FloatingCardIcons />

      {/* Top Header / Telemetry Bar & Audio Control */}
      <div className="w-full flex justify-between items-center p-4 md:p-6 z-20">
        <div className="bg-slate-950/85 backdrop-blur-md text-amber-200 text-xs px-3.5 py-1.5 rounded-full border border-amber-400/40 flex items-center space-x-2 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono tracking-wider font-bold">CYCLOTRON REACTOR LAB • JEV SYSTEM ONE ONLINE</span>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="bg-black/50 hover:bg-black/70 p-2.5 rounded-full text-white/90 hover:text-white transition-all border border-amber-500/40 shadow-lg cursor-pointer"
          title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-300" /> : <Volume2 className="w-5 h-5 text-emerald-300" />}
        </button>
      </div>

      {/* Central High-Tech Ionization Core & Title Section */}
      <div className="flex flex-col items-center text-center my-auto z-20 px-4">
        {/* Animated Concentric Cyclotron Energy Rings */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center mb-1.5 sm:mb-2">
          {/* Ring 1 - Outer amber dashed counter-clockwise */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          />

          {/* Ring 2 - Middle cyan pulse */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute inset-3 rounded-full border border-cyan-400/70"
          />

          {/* Ring 3 - Inner emerald glow */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 rounded-full border border-emerald-400/80"
          />

          {/* Core Trefoil Glow */}
          <motion.div
            animate={{ scale: [0.95, 1.08, 0.95] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 border-2 border-amber-600 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.8)] z-10"
          >
            <span className="text-xl sm:text-2xl filter drop-shadow">☢️</span>
          </motion.div>
        </div>

        {/* 3D Big Title */}
        <motion.h1
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black text-amber-300 tracking-tight font-game text-shadow-gold-title filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.7)] select-none"
        >
          NucMed Arena
        </motion.h1>

        {/* Mode & Subtitle Plaque */}
        <div className="wood-panel px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl mt-1.5 text-center max-w-lg shadow-2xl border-2 border-amber-950 flex flex-col items-center">
          <div className="text-amber-100 font-black text-xs sm:text-sm md:text-base font-game tracking-wider">
            จับคู่สาร · จับคู่กลไก · รอบโต๊ะไพ่
          </div>
          <div className="text-amber-300/90 text-[8.5px] sm:text-[9px] md:text-[10px] font-black tracking-widest uppercase mt-0.5">
            LEARN • MATCH • PLAY • NUCLEAR MEDICINE
          </div>
        </div>

        {/* High-Tech Telemetry Stats Grid */}
        <div className="mt-2 sm:mt-3 px-3 sm:px-4 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/40 backdrop-blur-md flex items-center space-x-2 sm:space-x-3 text-[9px] sm:text-[10px] md:text-[11px] font-mono text-amber-200">
          <div className="flex items-center space-x-1 text-cyan-300">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>BEAM: 18 MeV</span>
          </div>
          <span className="text-amber-600">•</span>
          <div className="flex items-center space-x-1 text-emerald-300">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>FLUX: 511 keV</span>
          </div>
          <span className="text-amber-600">•</span>
          <div className="flex items-center space-x-1 text-amber-300 font-bold">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>JEV ORCHESTRATION</span>
          </div>
        </div>
      </div>

      {/* Mascots Layer: separate layer bottom-center [z-25]
          บนมือถือ (portrait): ดันตำแหน่งขึ้นเหนือแถบโหลด (bottom-[25%]) ไม่ให้แถบโหลดและทิปทับตัวละคร
          -------------------------------------------------------- */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[25%] xs:bottom-[23%] sm:bottom-[20%] md:bottom-[18%] pointer-events-none z-25 flex flex-col items-center">
        <motion.img
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          src={getAssetPath("/scene/mascots.webp")}
          alt="NucMed Arena Mascots"
          className="h-[17vh] min-h-[100px] max-h-[24vh] sm:h-[22vmin] md:h-[26vmin] lg:h-[30vmin] [@media(max-height:700px)]:max-h-[20vh] [@media(max-height:600px)]:max-h-[16vh] w-auto max-w-[85vw] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
        />
      </div>

      {/* Bottom Loading Progress Bar & Nuclear Medicine Tips */}
      <div className="w-full max-w-xl px-6 pb-10 z-20 flex flex-col items-center">
        {/* Dynamic Tip Text with smooth fade */}
        <motion.div
          key={tipIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-amber-100 font-semibold text-xs md:text-sm mb-2 text-center bg-slate-950/85 backdrop-blur-md px-5 py-1.5 rounded-full shadow-lg border border-amber-400/50 min-h-[32px] flex items-center justify-center"
        >
          {TIPS[tipIndex]}
        </motion.div>

        {/* High-Tech Cyclotron Progress Bar Frame */}
        <div className="w-full h-8 bg-slate-950/90 border-3 border-amber-500/80 rounded-xl p-1 shadow-[0_0_20px_rgba(245,158,11,0.25)] relative overflow-hidden backdrop-blur-md">
          <motion.div
            className="h-full rounded-lg bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-300 shadow-[0_0_12px_rgba(52,211,153,0.8)] relative"
            style={{ width: `${progress}%` }}
          >
            {/* Animated Particle Beam Shimmer */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.3)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0.3)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[pulse_1.2s_infinite]" />
          </motion.div>

          {/* Centered Percentage & Status */}
          <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-xs text-white text-shadow-sub tracking-wider">
            <span>CHARGING REACTOR... {progress}%</span>
          </div>
        </div>

        {/* Skip button for quick dev access */}
        <button
          onClick={onComplete}
          className="text-xs text-amber-300/80 font-bold hover:text-white transition-colors underline mt-3 cursor-pointer"
        >
          กดข้ามหน้ารอโหลด (Skip to Arena)
        </button>
      </div>
    </div>
  );
}
