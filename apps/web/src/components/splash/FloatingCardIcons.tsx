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
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-10">
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
            y: [-18, 18, -18],
            x: [-10, 10, -10],
            opacity: [0.3, 0.9, 0.3],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* 1. Left Upper: R-01 18F-FDG (Exact Prototype Replica) */}
      <motion.div
        className="hidden md:block absolute top-14 left-4 lg:left-12 pointer-events-auto cursor-pointer"
        animate={{
          y: [-8, 8, -8],
          rotate: [-7, -2, -7],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.08, rotate: 0 }}
        onHoverStart={() => sounds.playSelect()}
      >
        <div className="transform scale-90 lg:scale-100 origin-top-left drop-shadow-[0_15px_25px_rgba(27,112,191,0.5)]">
          <RpCard card={PROTOTYPE_4_CARDS.rp} size="sm" isHoverable={false} />
        </div>
      </motion.div>

      {/* 2. Left Lower: M-03 Capillary Blockade (Exact Prototype Replica) */}
      <motion.div
        className="hidden md:block absolute top-[310px] left-6 lg:left-16 pointer-events-auto cursor-pointer"
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
        whileHover={{ scale: 1.08, rotate: 0 }}
        onHoverStart={() => sounds.playSelect()}
      >
        <div className="transform scale-90 lg:scale-100 origin-top-left drop-shadow-[0_15px_25px_rgba(239,163,22,0.5)]">
          <MechCard card={PROTOTYPE_4_CARDS.mech} size="sm" isHoverable={false} />
        </div>
      </motion.div>

      {/* 3. Right Upper: C-05 Pulmonary Embolism (Exact Prototype Replica) */}
      <motion.div
        className="hidden md:block absolute top-14 right-4 lg:right-12 pointer-events-auto cursor-pointer"
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
        whileHover={{ scale: 1.08, rotate: 0 }}
        onHoverStart={() => sounds.playSelect()}
      >
        <div className="transform scale-90 lg:scale-100 origin-top-right drop-shadow-[0_15px_25px_rgba(224,62,62,0.5)]">
          <CaseCard card={PROTOTYPE_4_CARDS.caseCard} size="sm" isHoverable={false} />
        </div>
      </motion.div>

      {/* 4. Right Lower: T-03 Target Thyroid (Exact Prototype Replica) */}
      <motion.div
        className="hidden md:block absolute top-[310px] right-6 lg:right-16 pointer-events-auto cursor-pointer"
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
        whileHover={{ scale: 1.08, rotate: 0 }}
        onHoverStart={() => sounds.playSelect()}
      >
        <div className="transform scale-90 lg:scale-100 origin-top-right drop-shadow-[0_15px_25px_rgba(0,168,107,0.5)]">
          <ClueCard card={PROTOTYPE_4_CARDS.clue} size="sm" isHoverable={false} />
        </div>
      </motion.div>
    </div>
  );
}
