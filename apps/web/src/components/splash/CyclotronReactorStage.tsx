"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sounds } from "@/lib/sound";
import { Sparkles, Zap, Shield, Activity, Radio } from "lucide-react";

interface IsotopeOrb {
  symbol: string;
  name: string;
  energy: string;
  color: string;
  glow: string;
  textColor: string;
  borderColor: string;
  fact: string;
}

const ISOTOPES: IsotopeOrb[] = [
  {
    symbol: "¹⁸F",
    name: "Fluorine-18",
    energy: "511 keV (β⁺)",
    color: "from-blue-600 via-cyan-500 to-blue-400",
    glow: "rgba(56, 189, 248, 0.6)",
    textColor: "text-cyan-200",
    borderColor: "border-cyan-400",
    fact: "ครึ่งชีวิต 110 นาที • ตรวจ PET metabolism ผ่าน GLUT transporter",
  },
  {
    symbol: "⁹⁹ᵐTc",
    name: "Technetium-99m",
    energy: "140 keV (γ)",
    color: "from-amber-600 via-yellow-500 to-amber-300",
    glow: "rgba(250, 204, 21, 0.6)",
    textColor: "text-amber-200",
    borderColor: "border-amber-400",
    fact: "ครึ่งชีวิต 6 ชั่วโมง • สารตรวจหลักใน Gamma Camera / SPECT",
  },
  {
    symbol: "¹³¹I",
    name: "Iodine-131",
    energy: "364 keV (γ, β⁻)",
    color: "from-rose-600 via-red-500 to-rose-400",
    glow: "rgba(244, 63, 94, 0.6)",
    textColor: "text-rose-200",
    borderColor: "border-rose-400",
    fact: "ครึ่งชีวิต 8 วัน • ใช้ตรวจและทำลายมะเร็งต่อมไทรอยด์ด้วยรังสีบีตา",
  },
  {
    symbol: "⁶⁸Ga",
    name: "Gallium-68",
    energy: "511 keV (β⁺)",
    color: "from-emerald-600 via-teal-500 to-emerald-400",
    glow: "rgba(52, 211, 153, 0.6)",
    textColor: "text-emerald-200",
    borderColor: "border-emerald-400",
    fact: "ครึ่งชีวิต 68 นาที • จับคู่เปปไทด์ตรวจต่อมไร้ท่อและเซลล์เฉพาะจุด",
  },
];

export function CyclotronReactorStage() {
  const [selectedIsotope, setSelectedIsotope] = useState<IsotopeOrb | null>(null);
  const [isHyperdrive, setIsHyperdrive] = useState(false);

  const handlePulse = (isotope: IsotopeOrb) => {
    sounds.playSelect();
    setSelectedIsotope(isotope);
    setIsHyperdrive(true);
    setTimeout(() => setIsHyperdrive(false), 800);
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-auto pointer-events-auto select-none">
      {/* Reactor Centerpiece Chamber */}
      <div className="relative w-64 md:w-80 h-28 md:h-34 flex items-center justify-center">
        {/* Outer Pulsing Magnetic Rings */}
        <motion.div
          animate={{
            rotate: isHyperdrive ? 360 : 360,
            scale: isHyperdrive ? [1, 1.08, 1] : 1,
          }}
          transition={{
            rotate: { duration: isHyperdrive ? 3 : 24, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.6 },
          }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/40 pointer-events-none"
        />

        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-2 md:inset-3 rounded-full border border-cyan-400/35 pointer-events-none"
        />

        {/* Ambient Core Glow */}
        <div className="absolute w-28 md:w-36 h-28 md:h-36 rounded-full bg-gradient-to-r from-amber-500/20 via-cyan-500/25 to-emerald-500/20 blur-xl pointer-events-none" />

        {/* Holographic Arena Dais Platform */}
        <div className="relative z-10 flex items-center justify-center px-4 py-2.5 bg-gradient-to-b from-slate-900/90 via-amber-950/90 to-slate-950/95 border-2 border-amber-400/70 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.35)] backdrop-blur-md">
          {/* 4 Isotope Orbs Array */}
          <div className="flex items-center space-x-2.5 md:space-x-3.5">
            {ISOTOPES.map((iso, idx) => (
              <motion.button
                key={iso.symbol}
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handlePulse(iso)}
                className={`relative group flex flex-col items-center p-1.5 md:p-2 rounded-xl bg-black/50 border-2 ${iso.borderColor} shadow-md transition-all cursor-pointer`}
                title={`${iso.name} (${iso.energy})`}
              >
                {/* Glow ring */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xs pointer-events-none"
                  style={{ backgroundColor: iso.glow }}
                />

                {/* Isotope Badge */}
                <div
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-lg bg-gradient-to-br ${iso.color} flex items-center justify-center text-white font-game font-black text-xs md:text-sm shadow-inner`}
                >
                  <span className="drop-shadow-md">{iso.symbol}</span>
                </div>

                {/* Subtitle Label */}
                <span className={`text-[8.5px] md:text-[9.5px] font-bold ${iso.textColor} mt-1 leading-none font-mono`}>
                  {iso.name.split("-")[0]}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Small Tactical Status Beacon */}
        <div className="absolute -bottom-3 z-20 flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-slate-950/90 border border-amber-400/60 shadow-md text-[9px] font-mono text-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>CYCLOTRON REACTOR • 511 keV</span>
        </div>
      </div>

      {/* Hologram Fact Card Callout */}
      <div className="h-6 mt-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {selectedIsotope ? (
            <motion.div
              key={selectedIsotope.symbol}
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              className="px-3.5 py-0.5 rounded-full bg-amber-950/90 border border-amber-400 text-[10px] md:text-xs text-amber-200 font-bold shadow-lg flex items-center space-x-1.5"
            >
              <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>
                <strong className="text-white">{selectedIsotope.symbol} ({selectedIsotope.name}):</strong>{" "}
                {selectedIsotope.fact}
              </span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              className="text-[9.5px] md:text-[10.5px] text-amber-200/70 font-medium flex items-center space-x-1.5"
            >
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>คลิกที่อนุภาคไอโซโทปเพื่อดูพลังงานและการประยุกต์ใช้ในคลินิก</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
