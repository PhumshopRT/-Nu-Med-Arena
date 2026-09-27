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
import { Target, Lightbulb } from "lucide-react";

interface ClueCardProps {
  card: ClueCardType;
  className?: string;
  isHoverable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ClueCard({
  card,
  className,
  isHoverable = true,
  isSelected = false,
  onClick,
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
    >
      <div className="flex flex-col h-full justify-between">
        {/* Top Header Capsule Bar */}
        <div>
          <div className="flex justify-between items-center px-1 mb-1">
            {/* Left ID Badge */}
            <div className="bg-[#0E8A58] text-white px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm border border-emerald-300">
              <span className="text-[10px] font-bold font-mono">{card.id}</span>
            </div>

            {/* Right Target Icon */}
            <div className="bg-emerald-950 text-white p-1 rounded-full shadow-sm">
              <Target className="w-3.5 h-3.5 text-emerald-300" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center px-1">
            <h3 className="font-game font-black text-base md:text-lg text-white tracking-tight leading-tight drop-shadow-xs">
              {card.titleEn}
            </h3>
            {card.subtitle && (
              <p className="text-[10px] text-emerald-100 font-medium">
                ({card.subtitle})
              </p>
            )}
          </div>
        </div>

        {/* Illustration Container Box */}
        <div className="bg-[#E5F8EF] rounded-xl border border-[#7DD3A8] p-1.5 my-1 flex items-center justify-center h-28 md:h-32 shadow-inner overflow-hidden">
          {renderIllustration()}
        </div>

        {/* Clue Properties & Hint Box */}
        <div className="bg-white/95 rounded-xl p-2 text-emerald-950 text-[10px] leading-tight space-y-1.5 shadow-sm border border-emerald-200">
          <ul className="list-disc pl-4 space-y-0.5">
            {card.body.map((item, idx) => (
              <li key={idx} className="font-medium text-slate-800">
                {item}
              </li>
            ))}
          </ul>

          {/* Hint callout */}
          <div className="bg-emerald-50 rounded-lg p-1.5 border border-emerald-200 flex items-start space-x-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[9.5px] font-semibold text-emerald-900 leading-snug">
              <span className="font-bold">Hint: </span>
              {card.reveals}
            </div>
          </div>
        </div>

        {/* Bottom Strip Category Label */}
        <div className="mt-1 text-center">
          <span className="text-[9px] font-bold text-white uppercase tracking-widest drop-shadow-xs">
            Target / Clue
          </span>
        </div>
      </div>
    </CardFrame>
  );
}
