"use client";

import React from "react";
import { RadiopharmaceuticalCard } from "@nucmed/shared";
import { CardFrame } from "./CardFrame";
import { 
  CellMetabolismIllustration, 
  ThyroidIllustration, 
  LungIllustration, 
  BoneIllustration, 
  LiverSpleenIllustration 
} from "./illustrations/OrganIllustrations";

interface RpCardProps {
  card: RadiopharmaceuticalCard;
  className?: string;
  isHoverable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export function RpCard({
  card,
  className,
  isHoverable = true,
  isSelected = false,
  onClick,
  size = "md",
}: RpCardProps) {
  // Render matching SVG illustration based on card id or illustration key
  const renderIllustration = () => {
    switch (card.illustration) {
      case "cell":
        return <CellMetabolismIllustration />;
      case "thyroid":
        return <ThyroidIllustration />;
      case "lung":
        return <LungIllustration />;
      case "bone":
        return <BoneIllustration />;
      case "liver_spleen":
        return <LiverSpleenIllustration />;
      default:
        if (card.id === "R-01") return <CellMetabolismIllustration />;
        if (card.id === "R-02" || card.id === "R-03" || card.id === "R-04") return <ThyroidIllustration />;
        if (card.id === "R-07" || card.id === "R-08") return <LungIllustration />;
        if (card.id === "R-05" || card.id === "R-06" || card.id === "R-11") return <BoneIllustration />;
        if (card.id === "R-09") return <LiverSpleenIllustration />;
        return <CellMetabolismIllustration />;
    }
  };

  return (
    <CardFrame
      type="RP"
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
            <div className="bg-[#1E4FD7] text-white px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm border border-blue-400">
              <span className="text-[10px]">☢️</span>
              <span className="text-[10px] font-bold font-mono tracking-tight">{card.id}</span>
            </div>

            {/* Right Modality Capsule (PET / SPECT) */}
            <div className="bg-[#0284C7] text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider shadow-sm border border-cyan-300">
              {card.modality}
            </div>
          </div>

          {/* Title and Full Name */}
          <div className="text-center px-1">
            <h3 className="font-nuclide font-bold text-lg md:text-xl text-white tracking-wide leading-tight drop-shadow-sm">
              {card.titleEn}
            </h3>
            {card.subtitle && (
              <p className="text-[10px] text-blue-100 font-medium tracking-tight">
                ({card.subtitle})
              </p>
            )}
          </div>
        </div>

        {/* Illustration Container Box */}
        <div className="bg-[#E8F1FF] rounded-xl border border-[#7AA7FF] p-1.5 my-1.5 flex items-center justify-center h-28 md:h-32 shadow-inner overflow-hidden">
          {renderIllustration()}
        </div>

        {/* Medical Properties Table */}
        <div className="bg-white/95 rounded-xl p-2 text-slate-800 text-[10px] leading-tight space-y-1 shadow-sm border border-blue-200">
          <div className="grid grid-cols-[72px_1fr] gap-1 items-start">
            <span className="font-bold text-blue-900">Target :</span>
            <span className="font-medium text-slate-700 truncate">{card.target}</span>
          </div>

          {card.transporter && (
            <div className="grid grid-cols-[72px_1fr] gap-1 items-start">
              <span className="font-bold text-blue-900">Transporter :</span>
              <span className="font-medium text-slate-700 truncate">{card.transporter}</span>
            </div>
          )}

          <div className="grid grid-cols-[72px_1fr] gap-1 items-start">
            <span className="font-bold text-blue-900">Mechanism :</span>
            <span className="font-medium text-slate-700 truncate">{card.titleTh}</span>
          </div>

          <div className="grid grid-cols-[72px_1fr] gap-1 items-start">
            <span className="font-bold text-blue-900">Application :</span>
            <span className="font-medium text-slate-700 line-clamp-2">{card.application}</span>
          </div>
        </div>

        {/* Bottom Strip Category Label */}
        <div className="mt-1 text-center">
          <span className="text-[9px] font-bold text-white uppercase tracking-widest drop-shadow-xs">
            Radiopharmaceutical
          </span>
        </div>
      </div>
    </CardFrame>
  );
}
