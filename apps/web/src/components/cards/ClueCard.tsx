"use client";

import React from "react";
import clsx from "clsx";
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

export const ClueCard = React.memo(function ClueCard({
  card,
  className,
  isHoverable = true,
  isSelected = false,
  onClick,
  size = "md",
}: ClueCardProps) {
  const renderIllustration = () => {
    const customImage = card.artUrl || (card.illustration?.startsWith("data:") || card.illustration?.startsWith("http") || card.illustration?.startsWith("/") ? card.illustration : null);
    if (customImage) {
      return (
        <img
          src={customImage}
          alt={card.titleEn || card.titleTh}
          className="w-full h-full object-contain rounded-lg"
        />
      );
    }
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
            <div className={clsx(
              "bg-[#E5F8EF] text-[#0E8A58] rounded-full flex items-center space-x-1 shadow-xs border border-emerald-300",
              size === "sm" ? "px-1.5 py-0.5" : "px-2 py-0.5"
            )}>
              <span className={size === "sm" ? "text-[10px]" : "text-xs"}>🎯</span>
              <span className={clsx(
                "font-game font-bold tracking-wide",
                size === "sm" ? "text-[9.5px]" : "text-[10px] md:text-[11px]"
              )}>{card.id}</span>
            </div>

            {/* Right Target / Clue Icon */}
            <div className={clsx(
              "rounded-full bg-[#E5F8EF] text-[#0E8A58] flex items-center justify-center shadow-xs border border-emerald-300",
              size === "sm" ? "w-4 h-4 text-[10px]" : "w-5 h-5 text-xs"
            )}>
              🎯
            </div>
          </div>

          {/* 2. Title Block (Centered matching prototype) */}
          <div className="text-center mt-0.5 mb-1">
            <h3 className={clsx(
              "font-black text-slate-900 leading-tight tracking-tight",
              size === "sm" ? "text-xs md:text-[13px]" : "text-sm md:text-base"
            )}>
              {card.id === "T-03" ? "Target: Thyroid" : card.titleEn}
            </h3>
          </div>
        </div>

        {/* 3. Illustration Area (Organ drawing) */}
        <div className={clsx(
          "w-full flex items-center justify-center my-0.5 shrink-0 rounded-xl bg-gradient-to-b from-emerald-50/70 via-white to-teal-50/50 border border-emerald-100 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden",
          size === "sm" ? "h-[64px] px-2 py-0.5" : "h-[88px] md:h-[100px] px-3 py-1.5"
        )}>
          <div className="w-full h-full flex items-center justify-center">
            {renderIllustration()}
          </div>
        </div>

        {/* 4. Bullet Points Details */}
        <div className={clsx(
          "border-t border-slate-200/90 text-slate-800 shrink-0",
          size === "sm" ? "pt-1 pb-0.5 space-y-[1px] text-[7.2px] leading-[1.22]" : "pt-0.5 space-y-[2px] text-[8px] md:text-[9px] leading-tight"
        )}>
          {(card.id === "T-03" ? [
            "อวัยวะ: ต่อมไทรอยด์",
            "ลักษณะเฉพาะ: มีการจับไอโอไดด์",
            "ความเกี่ยวข้อง: Na⁺/I⁻ symporter"
          ] : card.body).map((bullet, i) => (
            <div key={i} className="flex items-start space-x-1">
              <span className="text-emerald-700 font-black mt-0.5">•</span>
              <span className="text-slate-700 font-medium leading-tight">{bullet}</span>
            </div>
          ))}
        </div>

        {/* 5. Bottom Green Hint Callout Box (Matching prototype) */}
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg p-1 flex items-start space-x-1.5 mt-0.5 shadow-xs">
          <span className="text-xs leading-none mt-0.5">💡</span>
          <div className="text-[7.5px] md:text-[8.5px] text-slate-800 leading-tight">
            <strong className="text-emerald-800 font-bold block mb-0.5">Hint</strong>
            {card.id === "T-03" ? "สารใดบ้างที่เข้าสู่เซลล์ไทรอยด์ผ่าน Na⁺/I⁻ symporter?" : card.reveals}
          </div>
        </div>
      </div>
    </CardFrame>
  );
});
