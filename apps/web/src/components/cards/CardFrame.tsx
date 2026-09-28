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
  // Size presets respecting standard 63/88 trading card ratio with comfortable breathing room
  const sizeClasses = {
    sm: "w-[196px] h-[282px]",
    md: "w-[252px] h-[352px]",
    lg: "w-[297px] h-[415px]",
  };

  const getThemeConfig = () => {
    switch (type) {
      case "RP":
        return {
          bg: "bg-[#2F6FED]", // Locked RP Blue
          border: "border-[#1E4FD7]",
          categoryLabel: "Radiopharmaceutical",
          selectedGlow: "ring-4 ring-white shadow-[0_0_25px_rgba(47,111,237,0.9)]",
        };
      case "MECH":
        return {
          bg: "bg-[#E6A100]", // Locked MECH Gold
          border: "border-[#B45309]",
          categoryLabel: "Mechanism",
          selectedGlow: "ring-4 ring-white shadow-[0_0_25px_rgba(230,161,0,0.9)]",
        };
      case "CASE":
        return {
          bg: "bg-[#C81E33]", // Locked CASE Red
          border: "border-[#991B1B]",
          categoryLabel: "Clinical Case",
          selectedGlow: "ring-4 ring-white shadow-[0_0_25px_rgba(200,30,51,0.9)]",
        };
      case "CLUE":
        return {
          bg: "bg-[#0E8A58]", // Locked CLUE Green
          border: "border-[#065F46]",
          categoryLabel: "Target / Clue",
          selectedGlow: "ring-4 ring-white shadow-[0_0_25px_rgba(14,138,88,0.9)]",
        };
    }
  };

  const theme = getThemeConfig();

  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative rounded-[18px] p-[5px] pb-[3px] flex flex-col justify-between select-none overflow-visible transition-all duration-200 shadow-xl",
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
      <div className={clsx(
        "relative z-10 w-full flex-1 min-h-0 bg-white rounded-[13px] flex flex-col justify-between overflow-hidden shadow-inner text-slate-900",
        size === "sm" ? "p-2" : "p-2 md:p-2.5"
      )}>
        {children}
      </div>

      {/* 2. Bottom Colored Footer with White Category Title (matching card-prototype.jpg) */}
      <div className={clsx(
        "w-full shrink-0 flex items-center justify-center pointer-events-none select-none",
        size === "sm" ? "h-[18px]" : "h-[20px] md:h-[22px]"
      )}>
        <span className={clsx(
          "text-white font-black tracking-wider font-game uppercase drop-shadow-xs",
          size === "sm" ? "text-[8.5px]" : "text-[9px] md:text-[10.5px]"
        )}>
          {theme.categoryLabel}
        </span>
      </div>
    </div>
  );
}
