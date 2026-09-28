"use client";

import React from "react";
import clsx from "clsx";
import { TrefoilIcon } from "@/components/ui/TrefoilIcon";

export type CardBackTheme = "navy" | "hotcell" | "pet" | "cyclotron" | "nightlab";

export function resolveCardBackTheme(backId?: string): CardBackTheme {
  const norm = (backId || "").toLowerCase().replace(/_/g, "-");
  if (norm.includes("hotcell")) return "hotcell";
  if (norm.includes("pet")) return "pet";
  if (norm.includes("cyclotron")) return "cyclotron";
  if (norm.includes("nightlab") || norm.includes("night-lab")) return "nightlab";
  return "navy";
}

interface CardBackProps {
  className?: string;
  theme?: CardBackTheme;
  backId?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function CardBack({ className, theme = "navy", backId, size = "md", onClick }: CardBackProps) {
  const sizeClasses = {
    sm: "w-28 h-[156px]",
    md: "w-48 h-[268px]",
    lg: "w-64 h-[357px]",
  };

  const activeTheme = backId ? resolveCardBackTheme(backId) : theme;

  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative rounded-[18px] border-[3px] p-2 flex flex-col justify-between items-center select-none overflow-hidden shadow-card cursor-pointer transition-all hover:scale-[1.02]",
        sizeClasses[size],
        activeTheme === "navy" && "bg-gradient-to-br from-[#0B1F2A] via-[#0F2D3D] to-[#08151D] border-amber-400/80",
        activeTheme === "hotcell" && "bg-gradient-to-br from-[#4A1515] via-[#661E1E] to-[#2D0A0A] border-amber-400/80",
        activeTheme === "pet" && "bg-gradient-to-br from-[#2E1065] via-[#4C1D95] to-[#1E0B36] border-purple-400/80",
        activeTheme === "cyclotron" && "bg-gradient-to-br from-[#041d31] via-[#0369a1] to-[#082f49] border-cyan-400/90 shadow-[0_0_16px_rgba(6,182,212,0.5)]",
        activeTheme === "nightlab" && "bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#043427] border-emerald-400/90 shadow-[0_0_16px_rgba(52,211,153,0.5)]",
        className
      )}
      style={{
        aspectRatio: "63 / 88",
      }}
    >
      {/* Intricate Card Back Border Patterns */}
      <div className={clsx(
        "absolute inset-1.5 rounded-[14px] border pointer-events-none",
        activeTheme === "cyclotron" ? "border-cyan-300/40" : activeTheme === "nightlab" ? "border-emerald-300/40" : "border-amber-300/40"
      )} />
      <div className={clsx(
        "absolute inset-2.5 rounded-[10px] border border-dashed pointer-events-none",
        activeTheme === "cyclotron" ? "border-cyan-300/30" : activeTheme === "nightlab" ? "border-emerald-300/30" : "border-amber-300/30"
      )} />

      {/* Top Badge */}
      <div className={clsx(
        "text-[9px] font-bold uppercase tracking-widest pt-2",
        activeTheme === "cyclotron" ? "text-cyan-300" : activeTheme === "nightlab" ? "text-emerald-300" : "text-amber-300"
      )}>
        NucMed Arena
      </div>

      {/* Central Trefoil + Atom Icon */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Glowing rings */}
        <div className={clsx(
          "w-20 h-20 rounded-full border flex items-center justify-center animate-[spin_20s_linear_infinite]",
          activeTheme === "cyclotron" ? "border-cyan-400/40" : activeTheme === "nightlab" ? "border-emerald-400/40" : "border-amber-400/30"
        )}>
          <div className={clsx(
            "w-14 h-14 rounded-full border border-dashed",
            activeTheme === "cyclotron" ? "border-sky-300/60" : activeTheme === "nightlab" ? "border-teal-300/60" : "border-cyan-400/50"
          )} />
        </div>

        {/* Central Core Trefoil */}
        <div className={clsx(
          "absolute w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg",
          activeTheme === "cyclotron"
            ? "bg-gradient-to-br from-cyan-400 to-blue-600 border-cyan-200"
            : activeTheme === "nightlab"
            ? "bg-gradient-to-br from-emerald-400 to-teal-600 border-emerald-200"
            : "bg-gradient-to-br from-amber-400 to-amber-600 border-amber-200"
        )}>
          <TrefoilIcon size={size === "sm" ? 14 : size === "lg" ? 26 : 20} className="text-slate-950" />
        </div>
      </div>

      {/* Bottom Subtitle */}
      <div className={clsx(
        "text-[8px] font-semibold uppercase tracking-wider pb-2",
        activeTheme === "cyclotron" ? "text-cyan-200/80" : activeTheme === "nightlab" ? "text-emerald-200/80" : "text-amber-200/70"
      )}>
        {activeTheme === "cyclotron" ? "Cyclotron Isotope Lab" : activeTheme === "nightlab" ? "Hot Cell Shift" : "Localization Match"}
      </div>
    </div>
  );
}
