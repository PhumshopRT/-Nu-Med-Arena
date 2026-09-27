"use client";

import React from "react";
import { motion } from "framer-motion";
import { sounds } from "@/lib/sound";

export function FloatingCardIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-10">
      {/* Ambient Drifting Glowing Particles / Motes */}
      {[
        { x: "15%", y: "25%", size: 6, color: "bg-blue-400", duration: 7, delay: 0 },
        { x: "25%", y: "65%", size: 8, color: "bg-amber-300", duration: 9, delay: 1 },
        { x: "75%", y: "30%", size: 7, color: "bg-emerald-400", duration: 8, delay: 2 },
        { x: "85%", y: "70%", size: 5, color: "bg-rose-400", duration: 6, delay: 0.5 },
        { x: "50%", y: "15%", size: 6, color: "bg-cyan-300", duration: 10, delay: 1.5 },
      ].map((p, idx) => (
        <motion.div
          key={idx}
          className={`absolute rounded-full ${p.color} blur-[1px] shadow-[0_0_8px_currentColor] pointer-events-none`}
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-12, 12, -12],
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* 1. Left Upper: R-01 18F-FDG (Blue Card) */}
      <motion.div
        className="absolute top-20 left-4 md:left-16 pointer-events-auto cursor-pointer"
        animate={{
          y: [-8, 8, -8],
          rotate: [-7, -2, -7],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.12, rotate: 0 }}
        onHoverStart={() => sounds.playSelect()}
      >
        <div className="w-24 md:w-30 h-34 md:h-40 rounded-xl bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] border-2 border-[#93C5FD] p-1.5 shadow-[0_12px_24px_rgba(30,64,175,0.45)] flex flex-col justify-between transform transition-transform">
          <div className="bg-[#1E40AF] rounded-lg px-2 py-0.5 flex justify-between items-center text-white border border-blue-400/40">
            <span className="text-[10px] font-black font-game">☢️ R-01</span>
            <span className="text-[8px] bg-purple-600 px-1 py-0.2 rounded font-black tracking-wider">PET</span>
          </div>
          <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-1.5 my-1 flex-1 flex flex-col justify-center items-center text-center shadow-inner border border-blue-200">
            <div className="text-xs md:text-sm font-black text-blue-950 font-nuclide leading-tight">¹⁸F-FDG</div>
            <div className="text-[8px] text-blue-800 font-semibold">(Fluorodeoxyglucose)</div>
            <div className="text-[15px] mt-1 drop-shadow">🧠 🫁 🧫</div>
          </div>
          <div className="text-[7px] text-blue-100 font-black text-center uppercase tracking-wider py-0.5 bg-blue-900/60 rounded">
            Radiopharmaceutical
          </div>
        </div>
      </motion.div>

      {/* 2. Left Lower: M-03 Capillary Blockade (Gold Card) */}
      <motion.div
        className="absolute top-68 left-8 md:left-24 pointer-events-auto cursor-pointer"
        animate={{
          y: [8, -8, 8],
          rotate: [5, 9, 5],
        }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
        whileHover={{ scale: 1.12, rotate: 0 }}
        onHoverStart={() => sounds.playSelect()}
      >
        <div className="w-24 md:w-30 h-34 md:h-40 rounded-xl bg-gradient-to-b from-[#F59E0B] to-[#D97706] border-2 border-[#FDE68A] p-1.5 shadow-[0_12px_24px_rgba(180,83,9,0.45)] flex flex-col justify-between transform transition-transform">
          <div className="bg-[#B45309] rounded-lg px-2 py-0.5 flex justify-between items-center text-white border border-amber-300/40">
            <span className="text-[10px] font-black font-game">⚙️ M-03</span>
            <span className="text-[8px] bg-amber-950 px-1 py-0.2 rounded font-black tracking-wider">MECH</span>
          </div>
          <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg p-1.5 my-1 flex-1 flex flex-col justify-center items-center text-center shadow-inner border border-amber-200">
            <div className="text-[10px] md:text-xs font-black text-amber-950 leading-tight">Capillary Blockade</div>
            <div className="text-[8px] text-amber-800 font-semibold">10–50 μm particle</div>
            <div className="text-[15px] mt-1 drop-shadow">🔬 🩸 🫁</div>
          </div>
          <div className="text-[7px] text-amber-100 font-black text-center uppercase tracking-wider py-0.5 bg-amber-900/60 rounded">
            Localization Mechanism
          </div>
        </div>
      </motion.div>

      {/* 3. Right Upper: C-05 Pulmonary Embolism (Red Card) */}
      <motion.div
        className="absolute top-20 right-4 md:right-20 pointer-events-auto cursor-pointer"
        animate={{
          y: [8, -8, 8],
          rotate: [6, 1, 6],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
        whileHover={{ scale: 1.12, rotate: 0 }}
        onHoverStart={() => sounds.playSelect()}
      >
        <div className="w-24 md:w-30 h-34 md:h-40 rounded-xl bg-gradient-to-b from-[#EF4444] to-[#B91C1C] border-2 border-[#FECACA] p-1.5 shadow-[0_12px_24px_rgba(185,28,28,0.45)] flex flex-col justify-between transform transition-transform">
          <div className="bg-[#991B1B] rounded-lg px-2 py-0.5 flex justify-between items-center text-white border border-red-300/40">
            <span className="text-[10px] font-black font-game">📋 C-05</span>
            <span className="text-[8px] bg-red-950 px-1.5 py-0.2 rounded font-black tracking-wider text-amber-300">4 PTS</span>
          </div>
          <div className="bg-gradient-to-b from-rose-50 to-rose-100 rounded-lg p-1.5 my-1 flex-1 flex flex-col justify-center items-center text-center shadow-inner border border-rose-200">
            <div className="text-[10px] md:text-xs font-black text-rose-950 leading-tight">Pulmonary Embolism</div>
            <div className="text-[8px] text-rose-800 font-semibold">Lung Perfusion Scan</div>
            <div className="text-[15px] mt-1 drop-shadow">🫁 ⚠️ 🩺</div>
          </div>
          <div className="text-[7px] text-rose-100 font-black text-center uppercase tracking-wider py-0.5 bg-rose-950/60 rounded">
            Clinical Case
          </div>
        </div>
      </motion.div>

      {/* 4. Right Lower: T-03 Target Thyroid (Green Card) */}
      <motion.div
        className="absolute top-68 right-8 md:right-28 pointer-events-auto cursor-pointer"
        animate={{
          y: [-7, 9, -7],
          rotate: [-4, -8, -4],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
        whileHover={{ scale: 1.12, rotate: 0 }}
        onHoverStart={() => sounds.playSelect()}
      >
        <div className="w-24 md:w-30 h-34 md:h-40 rounded-xl bg-gradient-to-b from-[#10B981] to-[#047857] border-2 border-[#A7F3D0] p-1.5 shadow-[0_12px_24px_rgba(4,120,87,0.45)] flex flex-col justify-between transform transition-transform">
          <div className="bg-[#065F46] rounded-lg px-2 py-0.5 flex justify-between items-center text-white border border-emerald-300/40">
            <span className="text-[10px] font-black font-game">🎯 T-03</span>
            <span className="text-[8px] bg-emerald-950 px-1 py-0.2 rounded font-black tracking-wider text-emerald-200">HINT</span>
          </div>
          <div className="bg-gradient-to-b from-emerald-50 to-emerald-100 rounded-lg p-1.5 my-1 flex-1 flex flex-col justify-center items-center text-center shadow-inner border border-emerald-200">
            <div className="text-[10px] md:text-xs font-black text-emerald-950 leading-tight">Target: Thyroid</div>
            <div className="text-[8px] text-emerald-800 font-semibold">Na+/I- Symporter (NIS)</div>
            <div className="text-[15px] mt-1 drop-shadow">🦋 💡 🧪</div>
          </div>
          <div className="text-[7px] text-emerald-100 font-black text-center uppercase tracking-wider py-0.5 bg-emerald-950/60 rounded">
            Target / Clue
          </div>
        </div>
      </motion.div>
    </div>
  );
}
