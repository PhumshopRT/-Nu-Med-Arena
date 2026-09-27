"use client";

import React from "react";
import clsx from "clsx";

interface CardBackProps {
  className?: string;
  theme?: "navy" | "hotcell" | "pet";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function CardBack({ className, theme = "navy", size = "md", onClick }: CardBackProps) {
  const sizeClasses = {
    sm: "w-28 h-[156px]",
    md: "w-48 h-[268px]",
    lg: "w-64 h-[357px]",
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative rounded-[18px] border-[3px] border-amber-400/80 p-2 flex flex-col justify-between items-center select-none overflow-hidden shadow-card cursor-pointer transition-all hover:scale-[1.02]",
        sizeClasses[size],
        theme === "navy" && "bg-gradient-to-br from-[#0B1F2A] via-[#0F2D3D] to-[#08151D]",
        theme === "hotcell" && "bg-gradient-to-br from-[#4A1515] via-[#661E1E] to-[#2D0A0A]",
        theme === "pet" && "bg-gradient-to-br from-[#2E1065] via-[#4C1D95] to-[#1E0B36]",
        className
      )}
      style={{
        aspectRatio: "63 / 88",
      }}
    >
      {/* Intricate Card Back Border Patterns */}
      <div className="absolute inset-1.5 rounded-[14px] border border-amber-300/40 pointer-events-none" />
      <div className="absolute inset-2.5 rounded-[10px] border border-dashed border-amber-300/30 pointer-events-none" />

      {/* Top Badge */}
      <div className="text-[9px] font-bold text-amber-300 uppercase tracking-widest pt-2">
        NucMed Arena
      </div>

      {/* Central Trefoil + Atom Icon */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Glowing rings */}
        <div className="w-20 h-20 rounded-full border border-amber-400/30 flex items-center justify-center animate-[spin_20s_linear_infinite]">
          <div className="w-14 h-14 rounded-full border border-dashed border-cyan-400/50" />
        </div>

        {/* Central Core Trefoil */}
        <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-200 flex items-center justify-center shadow-lg">
          <span className="text-xl">☢️</span>
        </div>
      </div>

      {/* Bottom Subtitle */}
      <div className="text-[8px] text-amber-200/70 font-semibold uppercase tracking-wider pb-2">
        Localization Match
      </div>
    </div>
  );
}
