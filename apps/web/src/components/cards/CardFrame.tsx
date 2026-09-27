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
}

export function CardFrame({
  type,
  children,
  className,
  isHoverable = true,
  isSelected = false,
  onClick,
}: CardFrameProps) {
  const getThemeClasses = () => {
    switch (type) {
      case "RP":
        return {
          bg: "bg-[#2F6FED]",
          border: "border-[#7AA7FF]",
          shadow: "shadow-blue-900/30",
          selectedRing: "ring-4 ring-white shadow-[0_0_25px_rgba(47,111,237,0.8)]",
        };
      case "MECH":
        return {
          bg: "bg-[#E6A100]",
          border: "border-[#F2C14E]",
          shadow: "shadow-amber-900/30",
          selectedRing: "ring-4 ring-white shadow-[0_0_25px_rgba(230,161,0,0.8)]",
        };
      case "CASE":
        return {
          bg: "bg-[#E23B4A]",
          border: "border-[#F08A93]",
          shadow: "shadow-red-900/30",
          selectedRing: "ring-4 ring-white shadow-[0_0_25px_rgba(226,59,74,0.8)]",
        };
      case "CLUE":
        return {
          bg: "bg-[#1FA971]",
          border: "border-[#7DD3A8]",
          shadow: "shadow-emerald-900/30",
          selectedRing: "ring-4 ring-white shadow-[0_0_25px_rgba(31,169,113,0.8)]",
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative rounded-[18px] border-[3px] p-2 flex flex-col justify-between select-none overflow-hidden transition-all duration-200",
        theme.bg,
        theme.border,
        "shadow-card",
        isHoverable && "hover:-translate-y-2 hover:shadow-card-hover hover:scale-[1.02] cursor-pointer",
        isSelected && theme.selectedRing,
        className
      )}
      style={{
        aspectRatio: "63 / 88",
      }}
    >
      {/* Background Subtle Trefoil Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-48 h-48 fill-white">
          <circle cx="50" cy="50" r="10" />
          <path d="M50 35 L40 15 A40 40 0 0 1 60 15 Z" />
          <path d="M37 57 L17 50 A40 40 0 0 1 27 30 Z" />
          <path d="M63 57 L83 50 A40 40 0 0 0 73 30 Z" />
        </svg>
      </div>

      {/* Card Contents */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
