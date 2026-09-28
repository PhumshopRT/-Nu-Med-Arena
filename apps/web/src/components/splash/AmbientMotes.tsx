"use client";

import React from "react";
import { motion } from "framer-motion";

export function AmbientMotes() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-10">
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
    </div>
  );
}
