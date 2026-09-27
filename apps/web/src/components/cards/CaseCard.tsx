"use client";

import React from "react";
import { CaseCard as CaseCardType } from "@nucmed/shared";
import { CardFrame } from "./CardFrame";
import { LungIllustration, BoneIllustration, LiverSpleenIllustration } from "./illustrations/OrganIllustrations";
import { ClipboardList, HelpCircle } from "lucide-react";

interface CaseCardProps {
  card: CaseCardType;
  className?: string;
  isHoverable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export function CaseCard({
  card,
  className,
  isHoverable = true,
  isSelected = false,
  onClick,
  size = "md",
}: CaseCardProps) {
  const renderIllustration = () => {
    if (card.id.includes("05") || card.organHint?.includes("lung")) {
      return <LungIllustration />;
    }
    if (card.organHint?.includes("bone")) {
      return <BoneIllustration />;
    }
    if (card.organHint?.includes("liver")) {
      return <LiverSpleenIllustration />;
    }
    return <LungIllustration />;
  };

  return (
    <CardFrame
      type="CASE"
      className={className}
      isHoverable={isHoverable}
      isSelected={isSelected}
      onClick={onClick}
      size={size}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Top Header Capsule Bar */}
        <div>
          <div className="flex justify-between items-center px-1 mb-1">
            {/* Left ID Badge */}
            <div className="bg-[#C81E33] text-white px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm border border-red-300">
              <span className="text-[10px] font-bold font-mono">{card.id}</span>
            </div>

            {/* Right Badge: Points (2 PTS or 4 PTS) */}
            <div className="bg-red-950 text-white px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider shadow-sm border border-red-400 flex items-center space-x-1">
              <ClipboardList className="w-3 h-3 text-red-300" />
              <span>{card.points} PTS</span>
            </div>
          </div>

          {/* Clinical Scenario Header */}
          <div className="bg-[#FFE8EA] border border-[#F08A93] rounded-lg p-2 my-1 text-center shadow-inner">
            <p className="text-xs font-bold text-red-950 leading-snug">
              {card.promptTh}
            </p>
          </div>
        </div>

        {/* Center Illustration & Challenge Question */}
        <div className="bg-[#FFE8EA] rounded-xl border border-[#F08A93] p-1.5 my-1 grid grid-cols-2 gap-1 items-center h-28 md:h-32 shadow-inner overflow-hidden">
          <div className="h-full flex items-center justify-center">
            {renderIllustration()}
          </div>
          <div className="bg-white/90 rounded-lg p-2 flex flex-col justify-center items-center text-center border border-red-200 shadow-sm h-full">
            <HelpCircle className="w-6 h-6 text-red-500 mb-1" />
            <span className="text-[10px] font-bold text-red-950 leading-tight">
              สารเภสัชรังสีใดเหมาะสม และใช้กลไกใด?
            </span>
          </div>
        </div>

        {/* Difficulty Badge & Helper */}
        <div className="bg-white/95 rounded-xl p-2 text-[10px] leading-tight flex justify-between items-center shadow-sm border border-red-200">
          <span className="font-bold text-red-900">ระดับโจทย์ :</span>
          <span
            className={`font-black px-2 py-0.5 rounded text-[9px] ${
              card.difficulty === "CLINICAL"
                ? "bg-red-600 text-white"
                : "bg-emerald-600 text-white"
            }`}
          >
            {card.difficulty} ({card.points} คะแนน)
          </span>
        </div>

        {/* Bottom Strip Category Label */}
        <div className="mt-1 text-center">
          <span className="text-[9px] font-bold text-white uppercase tracking-widest drop-shadow-xs">
            Clinical Case
          </span>
        </div>
      </div>
    </CardFrame>
  );
}
