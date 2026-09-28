"use client";

import React from "react";
import { motion } from "framer-motion";
import { sounds } from "@/lib/sound";
import { PROTOTYPE_4_CARDS } from "@nucmed/shared";
import { RpCard } from "@/components/cards/RpCard";
import { MechCard } from "@/components/cards/MechCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { ClueCard } from "@/components/cards/ClueCard";

export function FloatingCardIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-visible z-10">
      {/* Ambient Drifting Glowing Radiation Motes */}
      {[
        { x: "12%", y: "22%", size: 6, color: "bg-blue-400", duration: 7, delay: 0 },
        { x: "20%", y: "70%", size: 8, color: "bg-amber-300", duration: 9, delay: 1 },
        { x: "78%", y: "26%", size: 7, color: "bg-emerald-400", duration: 8, delay: 2 },
        { x: "86%", y: "68%", size: 6, color: "bg-rose-400", duration: 6, delay: 0.5 },
        { x: "50%", y: "12%", size: 5, color: "bg-cyan-300", duration: 10, delay: 1.5 },
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
            y: [-12, 12, -12],
            x: [-8, 8, -8],
            opacity: [0.3, 0.85, 0.3],
            scale: [0.85, 1.2, 0.85],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* ========================================================
          ZONE: [ cards-left ]  x 24–210
          Two cards arranged vertically (R-01 & M-03), rotation <= 6 deg
          Zero overlap guarantee via flex column with explicit gap
          Height constrained to guarantee 100% on-screen visibility
          ======================================================== */}
      <div 
        className="hidden md:flex absolute left-4 lg:left-8 top-[6%] max-h-[88vh] w-[210px] flex-col justify-start gap-4 lg:gap-5 items-center pointer-events-auto overflow-visible z-10 scale-[0.80] lg:scale-[0.88] xl:scale-[0.95] origin-top-left"
      >
        {/* Upper Card: R-01 ¹⁸F-FDG */}
        <motion.div
          animate={{
            y: [-4, 4, -4],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ rotate: -2 }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          onHoverStart={() => sounds.playSelect()}
          className="cursor-pointer drop-shadow-[0_12px_22px_rgba(47,111,237,0.45)] overflow-visible shrink-0"
        >
          <RpCard card={PROTOTYPE_4_CARDS.rp} size="sm" isHoverable={false} />
        </motion.div>

        {/* Lower Card: M-03 Capillary Blockade */}
        <motion.div
          animate={{
            y: [4, -4, 4],
          }}
          transition={{
            duration: 5.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
          style={{ rotate: 2 }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          onHoverStart={() => sounds.playSelect()}
          className="cursor-pointer drop-shadow-[0_12px_22px_rgba(230,161,0,0.45)] overflow-visible shrink-0"
        >
          <MechCard card={PROTOTYPE_4_CARDS.mech} size="sm" isHoverable={false} />
        </motion.div>
      </div>

      {/* ========================================================
          ZONE: [ cards-right ] x 1230–1416
          Two cards arranged vertically (C-05 & T-03), rotation <= 6 deg
          Zero overlap guarantee via flex column with explicit gap
          Height constrained to guarantee 100% on-screen visibility
          ======================================================== */}
      <div 
        className="hidden md:flex absolute right-4 lg:right-8 top-[6%] max-h-[88vh] w-[210px] flex-col justify-start gap-4 lg:gap-5 items-center pointer-events-auto overflow-visible z-10 scale-[0.80] lg:scale-[0.88] xl:scale-[0.95] origin-top-right"
      >
        {/* Upper Card: C-05 Suspected PE */}
        <motion.div
          animate={{
            y: [4, -4, 4],
          }}
          transition={{
            duration: 5.0,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          style={{ rotate: 2 }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          onHoverStart={() => sounds.playSelect()}
          className="cursor-pointer drop-shadow-[0_12px_22px_rgba(200,30,51,0.45)] overflow-visible shrink-0"
        >
          <CaseCard card={PROTOTYPE_4_CARDS.caseCard} size="sm" isHoverable={false} />
        </motion.div>

        {/* Lower Card: T-03 Target: Thyroid */}
        <motion.div
          animate={{
            y: [-4, 4, -4],
          }}
          transition={{
            duration: 5.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          }}
          style={{ rotate: -2 }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          onHoverStart={() => sounds.playSelect()}
          className="cursor-pointer drop-shadow-[0_12px_22px_rgba(14,138,88,0.45)] overflow-visible shrink-0"
        >
          <ClueCard card={PROTOTYPE_4_CARDS.clue} size="sm" isHoverable={false} />
        </motion.div>
      </div>
    </div>
  );
}
