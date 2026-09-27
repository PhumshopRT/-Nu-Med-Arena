"use client";

import React from "react";
import { CardType } from "@nucmed/shared";
import clsx from "clsx";

interface CardFrameProps {
  type: CardType;
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  scale?: number;
  size?: "sm" | "md" | "lg";
}

export function CardFrame({
  type,
  children,
  className,
  isHoverable = true,
  isSelected = false,
  onClick,
  size = "md",
}: CardFrameProps) {
  // Size presets respecting standard 63/88 trading card ratio
  const sizeClasses = {
    sm: "w-48 h-[268px]",
    md: "w-64 h-[357px]",
    lg: "w-80 h-[447px]",
  };

  const getThemeConfig = () => {
    switch (type) {
      case "RP":
        return {
          bg: "bg-[#1B70BF]", // Vibrant Medical Cobalt Blue from card-prototype.jpg
          border: "border-[#155A9C]",
          categoryLabel: "Radiopharmaceutical",
          selectedGlow: "ring-4 ring-white shadow-[0_0_25px_rgba(27,112,191,0.9)]",
        };
      case "MECH":
        return {
          bg: "bg-[#EFA316]", // Warm Golden Amber from card-prototype.jpg
          border: "border-[#C7850D]",
          categoryLabel: "Mechanism",
          selectedGlow: "ring-4 ring-white shadow-[0_0_25px_rgba(239,163,22,0.9)]",
        };
      case "CASE":
        return {
          bg: "bg-[#E03E3E]", // Clinical Crimson Red from card-prototype.jpg
          border: "border-[#B92B2B]",
          categoryLabel: "Clinical Case",
          selectedGlow: "ring-4 ring-white shadow-[0_0_25px_rgba(224,62,62,0.9)]",
        };
      case "CLUE":
        return {
          bg: "bg-[#00A86B]", // Target Clue Emerald Green from card-prototype.jpg
          border: "border-[#008755]",
          categoryLabel: "Target / Clue",
          selectedGlow: "ring-4 ring-white shadow-[0_0_25px_rgba(0,168,107,0.9)]",
        };
    }
  };

  const theme = getThemeConfig();

  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative rounded-[22px] p-[6px] pb-[4px] flex flex-col justify-between select-none overflow-hidden transition-all duration-200 shadow-xl",
        sizeClasses[size],
        theme.bg,
        isHoverable && "hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] cursor-pointer",
        isSelected && theme.selectedGlow,
        className
      )}
      style={{
        aspectRatio: "63 / 88",
      }}
    >
      {/* 1. Inner White Card Container (Houses all contents exactly as in prototype) */}
      <div className="relative z-10 w-full flex-1 min-h-0 bg-white rounded-[16px] p-2 md:p-2.5 flex flex-col justify-between overflow-hidden shadow-inner text-slate-900">
        {children}
      </div>

      {/* 2. Bottom Colored Footer with White Category Title (matching card-prototype.jpg) */}
      <div className="w-full h-[22px] shrink-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-white font-black text-[9px] md:text-[11px] tracking-wider font-sans uppercase drop-shadow-xs">
          {theme.categoryLabel}
        </span>
      </div>
    </div>
  );
}
