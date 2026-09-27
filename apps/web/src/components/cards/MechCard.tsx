"use client";

import React from "react";
import { MechanismCard } from "@nucmed/shared";
import { CardFrame } from "./CardFrame";
import { 
  CapillaryBlockadeIllustration, 
  DiffusionIllustration, 
  CellularMigrationIllustration 
} from "./illustrations/OrganIllustrations";

interface MechCardProps {
  card: MechanismCard;
  className?: string;
  isHoverable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export function MechCard({
  card,
  className,
  isHoverable = true,
  isSelected = false,
  onClick,
  size = "md",
}: MechCardProps) {
  const renderIllustration = () => {
    switch (card.id) {
      case "M-03":
        return <CapillaryBlockadeIllustration />;
      case "M-05":
        return <DiffusionIllustration />;
      case "M-08":
        return <CellularMigrationIllustration />;
      default:
        return <CapillaryBlockadeIllustration />;
    }
  };

  return (
    <CardFrame
      type="MECH"
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
            <div className="bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs border border-amber-300">
              <span className="font-game font-bold text-[10px] md:text-[11px] tracking-wide">{card.id}</span>
            </div>

            {/* Right Cog/Gear Icon */}
            <div className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-xs shadow-xs border border-amber-300">
              ⚙️
            </div>
          </div>

          {/* 2. Title (Centered matching prototype) */}
          <div className="text-center mt-0.5 mb-1">
            <h3 className="text-sm md:text-base font-black text-slate-900 leading-tight tracking-tight">
              {card.titleEn}
            </h3>
          </div>
        </div>

        {/* 3. Illustration Area (Cross-section with callouts) */}
        <div className="my-auto w-full h-20 md:h-24 flex items-center justify-center py-1">
          {renderIllustration()}
        </div>

        {/* 4. Bullet Points List (Matching card-prototype.jpg) */}
        <div className="border-t border-slate-200/90 pt-1 space-y-1 text-[9px] md:text-[10px] leading-snug text-slate-800">
          {card.body.map((bullet, i) => (
            <div key={i} className="flex items-start space-x-1.5">
              <span className="text-slate-900 font-black mt-0.5">•</span>
              <span className="text-slate-700 font-medium leading-tight">{bullet}</span>
            </div>
          ))}
        </div>
      </div>
    </CardFrame>
  );
}
