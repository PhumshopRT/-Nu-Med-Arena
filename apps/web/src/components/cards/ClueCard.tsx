"use client";

import React from "react";
import { ClueCard as ClueCardType } from "@nucmed/shared";
import { CardFrame } from "./CardFrame";
import { 
  ThyroidIllustration, 
  BoneIllustration, 
  LiverSpleenIllustration,
  LungIllustration 
} from "./illustrations/OrganIllustrations";

interface ClueCardProps {
  card: ClueCardType;
  className?: string;
  isHoverable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export function ClueCard({
  card,
  className,
  isHoverable = true,
  isSelected = false,
  onClick,
  size = "md",
}: ClueCardProps) {
  const renderIllustration = () => {
    switch (card.illustration) {
      case "thyroid":
        return <ThyroidIllustration />;
      case "bone":
        return <BoneIllustration />;
      case "liver_spleen":
        return <LiverSpleenIllustration />;
      case "lung":
        return <LungIllustration />;
      default:
        if (card.id === "T-03") return <ThyroidIllustration />;
        if (card.id === "T-06") return <LiverSpleenIllustration />;
        if (card.id === "T-09") return <BoneIllustration />;
        return <ThyroidIllustration />;
    }
  };

  return (
    <CardFrame
      type="CLUE"
      className={className}
      isHoverable={isHoverable}
      isSelected={isSelected}
      onClick={onClick}
      size={size}
    >
      <div className="flex flex-col h-full justify-between select-none">
        {/* 1. Top Header Capsule Bar (Matching card-prototype.jpg) */}
        <div>
          <div className="flex justify-between items-center mb-0.5">
            {/* Left ID Badge */}
            <div className="bg-[#D1FAE5] text-[#00A86B] px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs border border-emerald-300">
              <span className="text-xs">🎯</span>
              <span className="font-game font-bold text-[10px] md:text-[11px] tracking-wide">{card.id}</span>
            </div>

            {/* Right Target / Clue Icon */}
            <div className="w-5 h-5 rounded-full bg-[#D1FAE5] text-[#00A86B] flex items-center justify-center text-xs shadow-xs border border-emerald-300">
              🎯
            </div>
          </div>

          {/* 2. Title Block (Centered matching prototype) */}
          <div className="text-center mt-0.5 mb-1">
            <h3 className="text-sm md:text-base font-black text-slate-900 leading-tight tracking-tight">
              {card.titleEn}
            </h3>
          </div>
        </div>

        {/* 3. Illustration Area (Organ drawing) */}
        <div className="my-auto w-full h-18 md:h-22 flex items-center justify-center py-0.5">
          {renderIllustration()}
        </div>

        {/* 4. Bullet Points Details */}
        <div className="border-t border-slate-200/90 pt-1 space-y-0.5 text-[9px] md:text-[10px] leading-tight text-slate-800">
          {card.body.map((bullet, i) => (
            <div key={i} className="flex items-start space-x-1.5">
              <span className="text-slate-900 font-black mt-0.5">•</span>
              <span className="text-slate-700 font-medium leading-tight">{bullet}</span>
            </div>
          ))}
        </div>

        {/* 5. Bottom Green Hint Callout Box (Matching prototype) */}
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-1.5 flex items-start space-x-1.5 mt-1 shadow-xs">
          <span className="text-sm leading-none mt-0.5">💡</span>
          <div className="text-[8.5px] md:text-[9.5px] text-slate-800 leading-tight">
            <strong className="text-emerald-800 font-bold block mb-0.5">Hint</strong>
            {card.reveals}
          </div>
        </div>
      </div>
    </CardFrame>
  );
}
