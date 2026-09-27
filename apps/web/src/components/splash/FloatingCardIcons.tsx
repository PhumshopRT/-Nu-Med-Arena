"use client";

import React from "react";
import { motion } from "framer-motion";

export function FloatingCardIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-10">
      {/* 1. Left Upper: R-01 18F-FDG (Blue Card) */}
      <motion.div
        className="absolute top-20 left-6 md:left-20"
        animate={{
          y: [-8, 8, -8],
          rotate: [-6, -2, -6],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-24 md:w-28 h-32 md:h-36 rounded-xl bg-rp border-2 border-rp-line p-1 shadow-card flex flex-col justify-between">
          <div className="bg-rp-head rounded-lg px-1.5 py-0.5 flex justify-between items-center text-white">
            <span className="text-[10px] font-bold">☢️ R-01</span>
            <span className="text-[8px] bg-purple-600 px-1 rounded font-bold">PET</span>
          </div>
          <div className="bg-rp-body rounded-lg p-1.5 my-1 flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-xs font-bold text-blue-900 font-nuclide leading-tight">¹⁸F-FDG</div>
            <div className="text-[9px] text-blue-700">(Fluorodeoxyglucose)</div>
            <div className="text-[14px] mt-1">🧠 🫁 🧫</div>
          </div>
          <div className="text-[8px] text-white font-bold text-center uppercase tracking-wider py-0.5">
            Radiopharmaceutical
          </div>
        </div>
      </motion.div>

      {/* 2. Left Lower: M-03 Capillary Blockade (Gold Card) */}
      <motion.div
        className="absolute top-64 left-10 md:left-28"
        animate={{
          y: [6, -10, 6],
          rotate: [4, 8, 4],
        }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        <div className="w-24 md:w-28 h-32 md:h-36 rounded-xl bg-mech border-2 border-mech-line p-1 shadow-card flex flex-col justify-between">
          <div className="bg-mech-head rounded-lg px-1.5 py-0.5 flex justify-between items-center text-white">
            <span className="text-[10px] font-bold">⚙️ M-03</span>
            <span className="text-[8px] bg-amber-800 px-1 rounded font-bold">MECH</span>
          </div>
          <div className="bg-mech-body rounded-lg p-1.5 my-1 flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-[11px] font-bold text-amber-950 leading-tight">Capillary Blockade</div>
            <div className="text-[9px] text-amber-800">10–50 μm particle</div>
            <div className="text-[14px] mt-1">🔬 🩸 🫁</div>
          </div>
          <div className="text-[8px] text-white font-bold text-center uppercase tracking-wider py-0.5">
            Mechanism
          </div>
        </div>
      </motion.div>

      {/* 3. Right Upper: C-05 Pulmonary Embolism (Red Card) */}
      <motion.div
        className="absolute top-20 right-6 md:right-24"
        animate={{
          y: [8, -8, 8],
          rotate: [6, 2, 6],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      >
        <div className="w-24 md:w-28 h-32 md:h-36 rounded-xl bg-case border-2 border-case-line p-1 shadow-card flex flex-col justify-between">
          <div className="bg-case-head rounded-lg px-1.5 py-0.5 flex justify-between items-center text-white">
            <span className="text-[10px] font-bold">📋 C-05</span>
            <span className="text-[8px] bg-red-800 px-1 rounded font-bold">4 PTS</span>
          </div>
          <div className="bg-case-body rounded-lg p-1.5 my-1 flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-[10px] font-bold text-red-950 leading-tight">Pulmonary Embolism</div>
            <div className="text-[9px] text-red-700">Lung Perfusion Scan</div>
            <div className="text-[14px] mt-1">🫁 ⚠️ 🩺</div>
          </div>
          <div className="text-[8px] text-white font-bold text-center uppercase tracking-wider py-0.5">
            Clinical Case
          </div>
        </div>
      </motion.div>

      {/* 4. Right Lower: T-03 Target Thyroid (Green Card) */}
      <motion.div
        className="absolute top-64 right-10 md:right-32"
        animate={{
          y: [-6, 8, -6],
          rotate: [-5, -9, -5],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      >
        <div className="w-24 md:w-28 h-32 md:h-36 rounded-xl bg-clue border-2 border-clue-line p-1 shadow-card flex flex-col justify-between">
          <div className="bg-clue-head rounded-lg px-1.5 py-0.5 flex justify-between items-center text-white">
            <span className="text-[10px] font-bold">🎯 T-03</span>
            <span className="text-[8px] bg-emerald-900 px-1 rounded font-bold">HINT</span>
          </div>
          <div className="bg-clue-body rounded-lg p-1.5 my-1 flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-[11px] font-bold text-emerald-950 leading-tight">Target: Thyroid</div>
            <div className="text-[9px] text-emerald-700">Na+/I- Symporter</div>
            <div className="text-[14px] mt-1">🦋 💡 🧪</div>
          </div>
          <div className="text-[8px] text-white font-bold text-center uppercase tracking-wider py-0.5">
            Target / Clue
          </div>
        </div>
      </motion.div>

      {/* Floating Badges: PET, SPECT, ☢️ */}
      <motion.div
        className="hidden md:flex absolute top-12 left-1/4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full shadow-lg border border-blue-300 items-center space-x-1.5"
        animate={{ y: [-4, 4, -4], rotate: [-3, 3, -3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-amber-500 font-bold text-sm">☢️</span>
        <span className="text-xs font-bold text-slate-800">Radionuclides</span>
      </motion.div>

      <motion.div
        className="hidden md:flex absolute top-14 right-1/4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full shadow-lg border border-purple-300 items-center space-x-1.5"
        animate={{ y: [4, -4, 4], rotate: [3, -3, 3] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
        <span className="text-xs font-bold text-purple-900">PET/CT Ready</span>
      </motion.div>
    </div>
  );
}
