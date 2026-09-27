"use client";

import React from "react";
import { CaseCard as CaseCardType } from "@nucmed/shared";
import { CardFrame } from "./CardFrame";
import { 
  LungIllustration, 
  BoneIllustration, 
  LiverSpleenIllustration,
  ThyroidIllustration 
} from "./illustrations/OrganIllustrations";

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
    if (card.organHint?.includes("thyroid")) {
      return <ThyroidIllustration />;
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
      <div className="flex flex-col h-full justify-between select-none">
        {/* 1. Top Header Capsule Bar (Matching card-prototype.jpg) */}
        <div>
          <div className="flex justify-between items-center mb-0.5">
            {/* Left ID Badge */}
            <div className="bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs border border-red-200">
              <span className="font-game font-bold text-[10px] md:text-[11px] tracking-wide">{card.id}</span>
            </div>

            {/* Right Medical Icon */}
            <div className="w-5 h-5 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center text-xs shadow-xs border border-red-200">
              📋
            </div>
          </div>

          {/* 2. Headline Clinical Case Prompt */}
          <div className="mt-0.5 mb-1 text-left">
            <h3 className="text-[11px] md:text-xs font-black text-slate-900 leading-tight">
              {card.titleTh}
            </h3>
            <div className="text-[9px] md:text-[10px] text-slate-600 font-medium leading-tight mt-0.5">
              {card.promptTh}
            </div>
          </div>
        </div>

        {/* 3. Center Area: Organ Illustration + Question Callout Box */}
        <div className="my-auto grid grid-cols-2 gap-2 items-center py-0.5">
          {/* Left: Organ pathology drawing */}
          <div className="w-full h-20 md:h-24 flex items-center justify-center">
            {renderIllustration()}
          </div>

          {/* Right: Soft Blue Question Callout Box (Matching prototype) */}
          <div className="bg-[#EBF5FF] border border-[#BFDBFE] rounded-2xl p-2 flex flex-col items-center text-center justify-center shadow-xs">
            <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-black text-xs mb-1 shadow-sm">
              ?
            </div>
            <div className="text-[8.5px] md:text-[9.5px] font-bold text-slate-800 leading-tight">
              สารเภสัชรังสีใดเหมาะสม และใช้กลไกในการ Localization?
            </div>
          </div>
        </div>

        {/* 4. Points & Difficulty Footer Tag inside white card */}
        <div className="border-t border-slate-200/90 pt-1 flex justify-between items-center text-[9px] md:text-[10px] text-slate-500 font-bold">
          <span>ความยาก: <strong className={card.difficulty === "CLINICAL" ? "text-rose-600" : "text-emerald-600"}>{card.difficulty}</strong></span>
          <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full border border-red-200 text-[9px]">
            {card.points} คะแนน
          </span>
        </div>
      </div>
    </CardFrame>
  );
}
