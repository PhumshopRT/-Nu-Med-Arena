export function CopyrightFooter() {
  return (
    <footer
      aria-label="ข้อมูลลิขสิทธิ์"
      className="w-full max-w-md mx-auto px-3 py-1.5 text-center pointer-events-auto"
    >
      <div className="flex flex-col items-center gap-1.5 rounded-md border-t border-amber-400/55 bg-[#0B1F2A]/80 px-4 py-2 shadow-[0_4px_14px_rgba(0,0,0,0.28)] backdrop-blur-sm">
        <p className="font-game text-[10px] sm:text-[11px] font-bold tracking-wide text-amber-100/95">
          NuMedArena
        </p>
        <span aria-hidden="true" className="h-px w-12 bg-amber-400/45" />
        <p className="text-[9px] sm:text-[10px] leading-relaxed text-amber-100/75">
          © 2026 PhumshopRT. สงวนลิขสิทธิ์ทุกประการ
        </p>
      </div>
    </footer>
  );
}
