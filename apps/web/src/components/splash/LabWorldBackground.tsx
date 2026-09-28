import React from "react";

export function LabWorldBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Sky Zone (0% to 58%) - Deep Vibrant Anime Game Sky */}
      <div 
        className="absolute top-0 left-0 right-0 h-[58%] w-full"
        style={{
          background: "linear-gradient(180deg, #3B82F6 0%, #60A5FA 35%, #93C5FD 70%, #E0F2FE 100%)",
        }}
      />

      {/* 2. Sunbeams / Rays from Top Right */}
      <div className="absolute -top-20 right-16 w-80 h-80 bg-amber-200/35 rounded-full blur-3xl pointer-events-none" />
      <div 
        className="absolute top-0 left-0 right-0 h-[58%] opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 80% 20%, rgba(254, 240, 138, 0.6) 0%, transparent 65%)",
        }}
      />

      {/* 3. Voxel Blocky Clouds */}
      <div className="absolute top-8 left-16 flex space-x-1.5 opacity-85 pointer-events-none">
        <div className="w-16 h-7 bg-white/90 rounded-sm shadow-sm" />
        <div className="w-24 h-10 bg-white rounded-sm -mt-2 shadow-md" />
        <div className="w-14 h-7 bg-white/90 rounded-sm shadow-sm" />
      </div>
      <div className="absolute top-12 right-1/4 flex space-x-1.5 opacity-80 pointer-events-none">
        <div className="w-20 h-8 bg-white/85 rounded-sm shadow-sm" />
        <div className="w-28 h-12 bg-white/95 rounded-sm -mt-2 shadow-md" />
        <div className="w-16 h-8 bg-white/85 rounded-sm shadow-sm" />
      </div>

      {/* 4. Distant Blocky Hills / Mountain Range just above Deck Horizon */}
      <div className="absolute top-[38%] left-0 right-0 h-[20%] pointer-events-none overflow-hidden opacity-55">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 200">
          <path d="M0,200 L0,110 L150,70 L300,120 L500,60 L750,115 L950,75 L1100,105 L1200,85 L1200,200 Z" fill="#2D6A4F" />
          <path d="M0,200 L0,140 L200,100 L450,135 L680,95 L880,140 L1050,110 L1200,135 L1200,200 Z" fill="#1B4332" />
        </svg>
      </div>

      {/* 5. Deck Zone (58% to 100%) - Authentic Wooden Table / Counter Arena */}
      <div 
        className="absolute top-[58%] bottom-0 left-0 right-0 w-full z-1"
        style={{
          background: "linear-gradient(180deg, #8B5A2B 0%, #6B3E2E 20%, #4A281D 65%, #2D140C 100%)",
          borderTop: "6px solid #A8713D",
          boxShadow: "0 -8px 28px rgba(0,0,0,0.55), inset 0 3px 6px rgba(255,255,255,0.22)",
        }}
      >
        {/* Wood grain vertical plank seams */}
        <div className="w-full h-full flex justify-between px-12 md:px-24 opacity-20 pointer-events-none">
          <div className="w-0.5 h-full bg-black shadow-[1px_0_0_rgba(255,255,255,0.15)]" />
          <div className="w-0.5 h-full bg-black shadow-[1px_0_0_rgba(255,255,255,0.15)]" />
          <div className="w-0.5 h-full bg-black shadow-[1px_0_0_rgba(255,255,255,0.15)]" />
          <div className="w-0.5 h-full bg-black shadow-[1px_0_0_rgba(255,255,255,0.15)]" />
          <div className="w-0.5 h-full bg-black shadow-[1px_0_0_rgba(255,255,255,0.15)]" />
        </div>
      </div>
    </div>
  );
}
