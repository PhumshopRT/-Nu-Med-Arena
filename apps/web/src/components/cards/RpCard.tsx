"use client";

import React from "react";
import clsx from "clsx";
import { RadiopharmaceuticalCard, MECHANISM_DECK } from "@nucmed/shared";
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

export const RpCard = React.memo(function RpCard({
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

  // Resolve mechanism title (e.g. "Facilitated Diffusion" instead of "M-02")
  const mechObj = MECHANISM_DECK.find((m) => m.id === card.mechanismId);
  const mechName = mechObj ? mechObj.titleEn.split('/')[0].trim() : card.mechanismId;

  return (
    <CardFrame
      type="RP"
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
              "bg-[#E8F1FF] text-[#2F6FED] rounded-full flex items-center space-x-1 shadow-xs border border-blue-200",
              size === "sm" ? "px-1.5 py-0.5" : "px-2 py-0.5"
            )}>
              <span className={size === "sm" ? "text-[10px]" : "text-xs"}>☢️</span>
              <span className={clsx(
                "font-game font-bold tracking-wide",
                size === "sm" ? "text-[9.5px]" : "text-[10px] md:text-[11px]"
              )}>{card.id}</span>
            </div>

            {/* Right Modality Pill */}
            <div className={clsx(
              "bg-[#2EB8E6] text-white rounded-full font-bold uppercase shadow-xs tracking-wider",
              size === "sm" ? "px-1.5 py-0.5 text-[8.5px]" : "px-2 py-0.5 text-[9px] md:text-[10px]"
            )}>
              {card.modality}
            </div>
          </div>

          {/* 2. Title & Subtitle (Centered matching prototype) */}
          <div className="text-center mt-0.5 mb-0.5">
            <h3 className={clsx(
              "font-black font-nuclide text-slate-900 leading-tight tracking-tight",
              size === "sm" ? "text-[11.5px] md:text-[12.5px]" : "text-base md:text-lg"
            )}>
              {card.titleEn}
            </h3>
            <div className={clsx(
              "text-slate-600 font-medium font-nuclide line-clamp-1",
              size === "sm" ? "text-[8px] leading-tight mt-0.5" : "text-[9px] md:text-[10.5px]"
            )}>
              ({card.subtitle || card.titleTh})
            </div>
          </div>
        </div>

        {/* 3. Illustration Area (Chemical + Organ / PET scan) */}
        <div className={clsx(
          "my-auto w-full flex items-center justify-center",
          size === "sm" ? "h-[36px] py-0 scale-90" : "h-[62px] md:h-18 py-0.5"
        )}>
          {renderIllustration()}
        </div>

        {/* 4. Specification Table (4 Key-Value Rows matching prototype, no truncation) */}
        <div className={clsx(
          "border-t border-slate-200/90 leading-tight text-slate-800",
          size === "sm" ? "pt-1 space-y-[1px] text-[7.5px]" : "pt-0.5 space-y-[2px] text-[8px] md:text-[9.5px]"
        )}>
          {/* Target */}
          <div className={clsx(
            "grid items-baseline",
            size === "sm" ? "grid-cols-[46px_4px_1fr]" : "grid-cols-[56px_6px_1fr]"
          )}>
            <span className="font-bold text-slate-900">Target</span>
            <span className="text-slate-400 font-bold">:</span>
            <span className="text-slate-700 font-medium leading-tight">{card.target}</span>
          </div>

          {/* Transporter */}
          <div className={clsx(
            "grid items-baseline",
            size === "sm" ? "grid-cols-[46px_4px_1fr]" : "grid-cols-[56px_6px_1fr]"
          )}>
            <span className="font-bold text-slate-900">Transporter</span>
            <span className="text-slate-400 font-bold">:</span>
            <span className="text-slate-700 font-medium leading-tight">{card.transporter || "—"}</span>
          </div>

          {/* Mechanism */}
          <div className={clsx(
            "grid items-baseline",
            size === "sm" ? "grid-cols-[46px_4px_1fr]" : "grid-cols-[56px_6px_1fr]"
          )}>
            <span className="font-bold text-slate-900">Mechanism</span>
            <span className="text-slate-400 font-bold">:</span>
            <span className="text-slate-700 font-medium leading-tight">{mechName}</span>
          </div>

          {/* Application */}
          <div className={clsx(
            "grid items-baseline",
            size === "sm" ? "grid-cols-[46px_4px_1fr]" : "grid-cols-[56px_6px_1fr]"
          )}>
            <span className="font-bold text-slate-900">Application</span>
            <span className="text-slate-400 font-bold">:</span>
            <span className="text-slate-700 font-medium leading-tight">
              {card.id === "R-01" ? "Tumor imaging (whole body PET/CT)" : card.application}
            </span>
          </div>
        </div>
      </div>
    </CardFrame>
  );
});
