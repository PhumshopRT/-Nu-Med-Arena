"use client";

import React from "react";
import { MechanismCard } from "@nucmed/shared";
import { CardFrame } from "./CardFrame";
import { 
  CapillaryBlockadeIllustration, 
  DiffusionIllustration, 
  CellularMigrationIllustration 
} from "./illustrations/OrganIllustrations";
import { Settings } from "lucide-react";

interface MechCardProps {
  card: MechanismCard;
  className?: string;
  isHoverable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export function MechCard({
  card,
  className,
  isHoverable = true,
  isSelected = false,
  onClick,
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
    >
      <div className="flex flex-col h-full justify-between">
        {/* Top Header Capsule Bar */}
        <div>
          <div className="flex justify-between items-center px-1 mb-1">
            {/* Left ID Badge */}
            <div className="bg-[#D49200] text-white px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm border border-amber-300">
              <span className="text-[10px] font-bold font-mono">{card.id}</span>
            </div>

            {/* Right Gear Icon */}
            <div className="bg-[#B45309] text-white p-1 rounded-full shadow-sm">
              <Settings className="w-3.5 h-3.5 animate-[spin_10s_linear_infinite]" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center px-1">
            <h3 className="font-game font-black text-base md:text-lg text-amber-950 tracking-tight leading-tight drop-shadow-xs">
              {card.titleEn}
            </h3>
            {card.subtitle && (
              <p className="text-[10px] text-amber-900 font-medium">
                ({card.subtitle})
              </p>
            )}
          </div>
        </div>

        {/* Illustration Container Box */}
        <div className="bg-[#FFF6D9] rounded-xl border border-[#F2C14E] p-1 my-1.5 flex items-center justify-center h-28 md:h-32 shadow-inner overflow-hidden">
          {renderIllustration()}
        </div>

        {/* Bullet Points Information */}
        <div className="bg-white/95 rounded-xl p-2 text-amber-950 text-[10px] leading-relaxed space-y-1 shadow-sm border border-amber-200 flex-1">
          <ul className="list-disc pl-4 space-y-1">
            {card.body.map((bullet, idx) => (
              <li key={idx} className="font-medium text-slate-800">
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Strip Category Label */}
        <div className="mt-1 text-center">
          <span className="text-[9px] font-bold text-amber-950 uppercase tracking-widest drop-shadow-xs">
            Mechanism
          </span>
        </div>
      </div>
    </CardFrame>
  );
}
