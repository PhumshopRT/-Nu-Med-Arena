import React from "react";

export function LabWorldBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Deep Vibrant Anime Game Sky */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(180deg, #4EA8DE 0%, #72EFDD 45%, #B4F8C8 70%, #E0FBFC 88%)",
        }}
      />

      {/* 2. Sunbeams / Rays from Top Right */}
      <div className="absolute -top-24 right-12 w-96 h-96 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: "radial-gradient(circle at 80% 15%, rgba(254, 240, 138, 0.6) 0%, transparent 60%)",
        }}
      />

      {/* 3. Voxel Blocky Clouds */}
      <div className="absolute top-10 left-12 flex space-x-1 opacity-85">
        <div className="w-16 h-8 bg-white/90 rounded-sm shadow-sm" />
        <div className="w-24 h-12 bg-white rounded-sm -mt-2 shadow-md" />
        <div className="w-14 h-8 bg-white/90 rounded-sm shadow-sm" />
      </div>
      <div className="absolute top-16 right-1/4 flex space-x-1 opacity-75">
        <div className="w-20 h-10 bg-white/80 rounded-sm shadow-sm" />
        <div className="w-28 h-14 bg-white/90 rounded-sm -mt-2 shadow-md" />
        <div className="w-16 h-10 bg-white/80 rounded-sm shadow-sm" />
      </div>

      {/* 4. Distant Blocky Hills / Mountain Range */}
      <svg className="absolute bottom-44 w-full h-44 opacity-50" preserveAspectRatio="none" viewBox="0 0 1200 200">
        <path d="M0,200 L0,110 L150,70 L300,120 L500,60 L750,115 L950,75 L1100,105 L1200,85 L1200,200 Z" fill="#2D6A4F" />
        <path d="M0,200 L0,140 L200,100 L450,135 L680,95 L880,140 L1050,110 L1200,135 L1200,200 Z" fill="#1B4332" />
      </svg>

      {/* 5. Left Side: Wooden Category Signpost (like in Minecraft reference image) */}
      <div className="hidden lg:flex absolute bottom-28 left-6 flex-col items-center z-10">
        {/* Support Post */}
        <div className="w-5 h-80 bg-wood-dark border-2 border-amber-950 shadow-2xl relative flex flex-col items-center">
          {/* Wood signboards stacked */}
          <div className="absolute top-4 -left-16 flex flex-col space-y-2 w-44">
            {/* Title Board */}
            <div className="wood-panel px-3 py-1.5 rounded-lg text-center shadow-lg border-2 border-amber-950 flex items-center justify-center space-x-1.5">
              <span className="text-amber-400 font-bold text-xs">☢️</span>
              <span className="text-amber-100 font-game font-bold text-[11px] tracking-wider">หมวดการ์ด</span>
            </div>

            {/* Blue: RP */}
            <div className="bg-[#1B70BF] border-2 border-[#60A5FA] text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-md flex items-center space-x-1.5 hover:translate-x-1 transition-transform">
              <span className="w-2 h-2 rounded-full bg-blue-200" />
              <span>สารเภสัชรังสี (RP)</span>
            </div>

            {/* Gold: MECH */}
            <div className="bg-[#EFA316] border-2 border-[#FCD34D] text-amber-950 px-2 py-1 rounded-md text-[10px] font-black shadow-md flex items-center space-x-1.5 hover:translate-x-1 transition-transform">
              <span className="w-2 h-2 rounded-full bg-amber-800" />
              <span>กลไกการสะสม</span>
            </div>

            {/* Red: CASE */}
            <div className="bg-[#E03E3E] border-2 border-[#FCA5A5] text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-md flex items-center space-x-1.5 hover:translate-x-1 transition-transform">
              <span className="w-2 h-2 rounded-full bg-red-200" />
              <span>โจทย์คลินิก</span>
            </div>

            {/* Green: CLUE */}
            <div className="bg-[#00A86B] border-2 border-[#6EE7B7] text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-md flex items-center space-x-1.5 hover:translate-x-1 transition-transform">
              <span className="w-2 h-2 rounded-full bg-emerald-200" />
              <span>เป้าหมาย / คำใบ้</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Right Side: Lab Vendor Stall / Hot Cell Facility (like Eve Pizza stall) */}
      <div className="hidden lg:flex absolute bottom-28 right-6 flex-col items-center z-10">
        {/* Striped Canopy Awning (Red & White or Teal & White) */}
        <div className="relative flex flex-col items-center">
          {/* Signboard above awning */}
          <div className="wood-panel px-4 py-1.5 rounded-lg border-2 border-amber-950 shadow-xl mb-1 flex items-center space-x-1.5">
            <span className="text-emerald-400 font-bold text-sm">⚛️</span>
            <span className="text-amber-200 font-game font-black text-xs tracking-wider">
              HOT CELL & NUC LAB
            </span>
          </div>

          {/* Striped Awning */}
          <div className="w-60 h-10 flex rounded-t-md shadow-lg overflow-hidden border-x-2 border-t-2 border-red-900">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className={`flex-1 h-full ${i % 2 === 0 ? "bg-red-600" : "bg-white"}`}
              />
            ))}
          </div>

          {/* Counter Stall Desk with Lab Equipment */}
          <div className="w-60 h-36 bg-[#E8DCC4] border-x-4 border-b-4 border-[#C4B296] p-2.5 shadow-2xl flex flex-col justify-between">
            {/* Shelf with Isotopes and Vials */}
            <div className="flex justify-around items-end bg-[#5C3D2E] p-1.5 rounded border border-amber-950">
              {/* Lead vial pot */}
              <div className="w-7 h-10 bg-slate-700 rounded-t border border-slate-900 flex flex-col items-center justify-center">
                <span className="text-[7px] text-amber-300 font-bold">⁹⁹ᵐTc</span>
                <span className="text-[7px]">☢️</span>
              </div>
              {/* FDG Glowing Flask */}
              <div className="w-7 h-11 bg-cyan-400/80 rounded-t-full border border-cyan-600 flex flex-col items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.7)] animate-pulse">
                <span className="text-[7px] text-slate-900 font-bold">¹⁸F</span>
                <span className="text-[8px]">🧪</span>
              </div>
              {/* Iodine Flask */}
              <div className="w-7 h-9 bg-purple-500/80 rounded-t border border-purple-700 flex flex-col items-center justify-center">
                <span className="text-[7px] text-white font-bold">¹³¹I</span>
                <span className="text-[7px]">⚗️</span>
              </div>
            </div>

            {/* Motivational chalkboard (like in reference image) */}
            <div className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center shadow-inner">
              <div className="text-[8px] font-bold text-amber-200 tracking-wider">
                GOOD MEDICINE
              </div>
              <div className="text-[8px] font-bold text-emerald-300">
                BRIGHTER HEALTH! ❤️
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Foreground Wooden Counter / Table Rail (where mascots and PLAY button sit) */}
      <div 
        className="absolute bottom-0 w-full h-28 z-0"
        style={{
          background: "linear-gradient(180deg, #8B5A2B 0%, #6B3E2E 25%, #4A281D 70%, #2D140C 100%)",
          borderTop: "6px solid #A8713D",
          boxShadow: "0 -8px 24px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.2)",
        }}
      >
        {/* Wood grain plank dividers */}
        <div className="w-full h-full flex justify-between px-16 opacity-15 pointer-events-none">
          <div className="w-0.5 h-full bg-black" />
          <div className="w-0.5 h-full bg-black" />
          <div className="w-0.5 h-full bg-black" />
          <div className="w-0.5 h-full bg-black" />
        </div>
      </div>
    </div>
  );
}
