"use client";

import React from "react";
import clsx from "clsx";
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

export const MechCard = React.memo(function MechCard({
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
            <div className={clsx(
              "bg-[#FFF6D9] text-[#B45309] rounded-full flex items-center space-x-1 shadow-xs border border-amber-300",
              size === "sm" ? "px-1.5 py-0.5" : "px-2 py-0.5"
            )}>
              <span className={clsx(
                "font-game font-bold tracking-wide",
                size === "sm" ? "text-[9.5px]" : "text-[10px] md:text-[11px]"
              )}>{card.id}</span>
            </div>

            {/* Right Cog/Gear Icon */}
            <div className={clsx(
              "rounded-full bg-[#FFF6D9] text-[#B45309] flex items-center justify-center shadow-xs border border-amber-300",
              size === "sm" ? "w-4 h-4 text-[10px]" : "w-5 h-5 text-xs"
            )}>
              ⚙️
            </div>
          </div>

          {/* 2. Title (Centered matching prototype) */}
          <div className="text-center mt-0.5 mb-1">
            <h3 className={clsx(
              "font-black text-slate-900 leading-tight tracking-tight",
              size === "sm" ? "text-xs md:text-[13px]" : "text-sm md:text-base"
            )}>
              {card.titleEn}
            </h3>
          </div>
        </div>

        {/* 3. Illustration Area (Cross-section with callouts) */}
        <div className={clsx(
          "my-auto w-full flex items-center justify-center",
          size === "sm" ? "h-[36px] py-0 scale-90" : "h-[60px] md:h-18 py-0.5"
        )}>
          {renderIllustration()}
        </div>

        {/* 4. Bullet Points List (Matching card-prototype.jpg) */}
        <div className={clsx(
          "border-t border-slate-200/90 leading-tight text-slate-800",
          size === "sm" ? "pt-1 space-y-[1.5px] text-[7.5px]" : "pt-0.5 space-y-[2px] text-[8px] md:text-[9.5px]"
        )}>
          {card.body.map((bullet, i) => (
            <div key={i} className="flex items-start space-x-1">
              <span className="text-amber-800 font-black mt-0.5">•</span>
              <span className="text-slate-700 font-medium leading-tight">{bullet}</span>
            </div>
          ))}
        </div>
      </div>
    </CardFrame>
  );
});
