import React from "react";

export function LabWorldBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Sky Gradient */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(180deg, #6BBBDC 0%, #7EC8E3 45%, #BDE4F4 70%, #DCEFF8 85%)",
        }}
      />

      {/* Sun & Clouds */}
      <div className="absolute top-10 right-28 w-24 h-24 rounded-full bg-amber-200/80 blur-xs shadow-[0_0_50px_rgba(253,230,138,0.7)]" />
      <div className="absolute top-12 left-16 w-36 h-12 bg-white/70 rounded-full blur-[1px]" />
      <div className="absolute top-16 left-28 w-24 h-10 bg-white/80 rounded-full blur-[1px]" />
      <div className="absolute top-8 right-1/3 w-48 h-14 bg-white/60 rounded-full blur-[1px]" />

      {/* Distant Hills / Mountains */}
      <svg className="absolute bottom-40 w-full h-48 opacity-40" preserveAspectRatio="none" viewBox="0 0 1200 200">
        <path d="M0,200 L0,120 Q180,60 380,110 T780,80 T1200,100 L1200,200 Z" fill="#2E7D59" />
        <path d="M0,200 L0,140 Q250,90 550,130 T950,110 T1200,125 L1200,200 Z" fill="#26694A" />
      </svg>

      {/* Buildings & Lab Complex (Low-voxel / stylized science laboratory) */}
      <div className="absolute bottom-28 w-full flex justify-between items-end px-4 md:px-16">
        {/* Left Lab Building: Hot Cell & Radiopharmacy Lab */}
        <div className="relative flex flex-col items-center">
          {/* Exhaust Stack / Filter Unit */}
          <div className="w-10 h-28 bg-slate-300 border-2 border-slate-400 rounded-t-sm relative flex flex-col items-center">
            <div className="w-14 h-4 bg-slate-400 rounded-sm -mt-2" />
            <div className="absolute top-6 w-5 h-5 rounded-full bg-amber-400/80 flex items-center justify-center text-[8px] font-bold text-slate-800">
              ☢️
            </div>
            {/* Ventilation vents */}
            <div className="mt-14 space-y-1 w-6">
              <div className="h-1 bg-slate-400 rounded-full" />
              <div className="h-1 bg-slate-400 rounded-full" />
              <div className="h-1 bg-slate-400 rounded-full" />
            </div>
          </div>

          {/* Main Lab Building Left */}
          <div className="relative -mt-4">
            {/* Brick Roof */}
            <div className="w-48 md:w-64 h-12 bg-[#C15B4A] rounded-t-md shadow-md border-b-4 border-[#9E3E30] flex items-center justify-center">
              <span className="text-[11px] font-bold tracking-wider text-amber-100 uppercase px-3 py-0.5 bg-[#9E3E30] rounded">
                Hot Cell Facility
              </span>
            </div>
            {/* Cream Wall */}
            <div className="w-48 md:w-64 h-36 bg-[#F3E6C8] border-x-4 border-b-4 border-[#D8C7A5] p-3 flex flex-col justify-between shadow-lg">
              {/* Lab Windows with Blue Glow */}
              <div className="grid grid-cols-3 gap-2">
                <div className="h-10 bg-cyan-100 border-2 border-[#D8C7A5] rounded shadow-inner flex items-center justify-center text-[10px]">
                  🔬
                </div>
                <div className="h-10 bg-cyan-100 border-2 border-[#D8C7A5] rounded shadow-inner flex items-center justify-center text-[10px]">
                  🧪
                </div>
                <div className="h-10 bg-cyan-100 border-2 border-[#D8C7A5] rounded shadow-inner flex items-center justify-center text-[10px]">
                  ☢️
                </div>
              </div>
              {/* Lab Signboard */}
              <div className="bg-[#8B5A2B] text-amber-100 text-xs font-bold text-center py-1 rounded shadow">
                ห้องปฏิบัติการไอโซโทปรังสี
              </div>
            </div>
          </div>
        </div>

        {/* Center Backdrop: PET/CT & SPECT Scanning Pavilion */}
        <div className="hidden lg:flex flex-col items-center relative -mb-4 opacity-90">
          <div className="w-72 h-10 bg-[#C15B4A] rounded-t-xl border-b-4 border-[#9E3E30] flex items-center justify-center">
            <span className="text-xs font-bold text-white tracking-widest">NUCLEAR IMAGING DOME</span>
          </div>
          <div className="w-72 h-32 bg-[#F7EFE1] border-x-4 border-b-4 border-[#D8C7A5] flex items-center justify-around px-4">
            {/* Gantry Ring Silhouette */}
            <div className="w-20 h-20 rounded-full border-8 border-cyan-500 bg-white flex items-center justify-center shadow-md">
              <div className="w-8 h-8 rounded-full bg-cyan-200" />
            </div>
            <div className="text-left text-[11px] text-slate-700 font-medium">
              <div>• PET/CT Scanner</div>
              <div>• SPECT/CT Dual Head</div>
              <div>• Gamma Camera</div>
            </div>
          </div>
        </div>

        {/* Right Lab Building: Imaging Bay & Cyclotron Wing */}
        <div className="relative flex flex-col items-center">
          {/* Brick Roof */}
          <div className="w-48 md:w-64 h-12 bg-[#C15B4A] rounded-t-md shadow-md border-b-4 border-[#9E3E30] flex items-center justify-center">
            <span className="text-[11px] font-bold tracking-wider text-amber-100 uppercase px-3 py-0.5 bg-[#9E3E30] rounded">
              Cyclotron & PET Bay
            </span>
          </div>
          {/* Cream Wall */}
          <div className="w-48 md:w-64 h-36 bg-[#F3E6C8] border-x-4 border-b-4 border-[#D8C7A5] p-3 flex flex-col justify-between shadow-lg">
            {/* Windows */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-cyan-100 border-2 border-[#D8C7A5] rounded shadow-inner flex items-center justify-center text-[11px] font-bold text-blue-700">
                PET/CT
              </div>
              <div className="h-10 bg-cyan-100 border-2 border-[#D8C7A5] rounded shadow-inner flex items-center justify-center text-[11px] font-bold text-emerald-700">
                SPECT
              </div>
            </div>
            {/* Sign */}
            <div className="bg-[#8B5A2B] text-amber-100 text-xs font-bold text-center py-1 rounded shadow">
              ฝ่ายเวชศาสตร์นิวเคลียร์
            </div>
          </div>
        </div>
      </div>

      {/* Ground Grass / Courtyard `#3F8F6B` */}
      <div 
        className="absolute bottom-0 w-full h-32"
        style={{
          background: "linear-gradient(180deg, #489F77 0%, #3F8F6B 30%, #2A684C 100%)",
          borderTop: "6px solid #58B689",
          boxShadow: "inset 0 4px 12px rgba(0,0,0,0.25)",
        }}
      >
        {/* Stone Path in the center */}
        <div className="w-64 md:w-96 h-full mx-auto bg-stone-300/40 border-x-4 border-stone-400/40 transform perspective-[300px] rotateX-[45deg]" />
      </div>
    </div>
  );
}
