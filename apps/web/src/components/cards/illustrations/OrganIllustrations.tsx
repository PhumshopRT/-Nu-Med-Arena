import React from "react";

// 1. Cell / Glucose Metabolism (for 18F-FDG & R-01)
export function CellMetabolismIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glucose / FDG Chemical Structure on Left */}
      <g transform="translate(10, 15)">
        {/* Benzene/Hexose ring representation */}
        <polygon points="40,25 60,15 80,25 80,48 60,58 40,48" stroke="#1E4FD7" strokeWidth="2.5" fill="none" />
        <line x1="60" y1="15" x2="60" y2="5" stroke="#1E4FD7" strokeWidth="2.5" />
        <text x="56" y="4" fill="#1E4FD7" fontSize="8" fontWeight="bold">OH</text>
        <line x1="80" y1="25" x2="90" y2="20" stroke="#1E4FD7" strokeWidth="2.5" />
        <circle cx="98" cy="18" r="8" fill="#2563EB" />
        <text x="98" y="21" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">¹⁸F</text>
        <line x1="40" y1="48" x2="30" y2="55" stroke="#1E4FD7" strokeWidth="2.5" />
        <text x="18" y="58" fill="#1E4FD7" fontSize="8" fontWeight="bold">HO</text>
        <circle cx="60" cy="36" r="3" fill="#93C5FD" />
      </g>

      {/* Whole Body / Cellular silhouette on Right - PET Scan with Highlighted Lungs */}
      <g transform="translate(125, 8)">
        <rect width="65" height="104" rx="10" fill="#0B2559" />
        {/* Human Silhouette outline */}
        {/* Head & Brain with metabolic activity */}
        <circle cx="32" cy="18" r="9" fill="#1D4ED8" />
        <circle cx="32" cy="18" r="4.5" fill="#FACC15" />
        {/* Neck */}
        <rect x="29" y="27" width="6" height="6" fill="#1D4ED8" />
        {/* Torso */}
        <path d="M18 33 C18 33 24 32 32 32 C40 32 46 33 46 33 L44 65 L20 65 Z" fill="#1D4ED8" />
        {/* Prominently Highlighted PET Lungs / Thoracic uptake */}
        <ellipse cx="26" cy="44" rx="5" ry="7" fill="#38BDF8" />
        <ellipse cx="26" cy="44" rx="2.5" ry="4" fill="#FACC15" />
        <ellipse cx="38" cy="44" rx="5" ry="7" fill="#38BDF8" />
        <ellipse cx="38" cy="44" rx="2.5" ry="4" fill="#FACC15" />
        {/* Heart / Mediastinal marker */}
        <circle cx="32" cy="45" r="2.5" fill="#EF4444" />
        {/* Bladder excretion glow */}
        <circle cx="32" cy="61" r="4.5" fill="#FACC15" />
        {/* Limbs */}
        <path d="M18 35 L12 60" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" />
        <path d="M46 35 L52 60" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" />
        <path d="M25 65 L23 98" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" />
        <path d="M39 65 L41 98" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// 2. Capillary Blockade (for M-03 & 99mTc-MAA)
export function CapillaryBlockadeIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blood vessel narrowing / capillary funnel */}
      <path 
        d="M10 20 C60 20 100 45 190 45 L190 75 C100 75 60 100 10 100 Z" 
        fill="#F87171" 
        stroke="#DC2626" 
        strokeWidth="3" 
      />
      {/* Vessel inner lumen lining */}
      <path 
        d="M15 28 C65 28 105 50 185 50" 
        stroke="#EF4444" 
        strokeWidth="2" 
        strokeDasharray="4 4" 
      />
      <path 
        d="M15 92 C65 92 105 70 185 70" 
        stroke="#EF4444" 
        strokeWidth="2" 
        strokeDasharray="4 4" 
      />

      {/* Trapped Large Particle (10-50 um) */}
      <g transform="translate(100, 60)">
        {/* Purple/Blue Macroaggregated Albumin microembolus */}
        <circle cx="0" cy="0" r="16" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
        <circle cx="-6" cy="-4" r="5" fill="#60A5FA" />
        <circle cx="5" cy="5" r="4" fill="#2563EB" />
        <circle cx="4" cy="-6" r="3" fill="#93C5FD" />
      </g>

      {/* Other small RBCs passing or stacking */}
      <ellipse cx="60" cy="45" rx="7" ry="4" fill="#B91C1C" transform="rotate(-15 60 45)" />
      <ellipse cx="45" cy="65" rx="8" ry="4.5" fill="#991B1B" />
      <ellipse cx="70" cy="75" rx="7" ry="4" fill="#B91C1C" transform="rotate(20 70 75)" />
      <ellipse cx="140" cy="60" rx="5" ry="3" fill="#DC2626" />
      <ellipse cx="165" cy="60" rx="4.5" ry="2.5" fill="#DC2626" />

      {/* Size indicator label */}
      <rect x="110" y="8" width="80" height="18" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
      <text x="150" y="20" fill="#92400E" fontSize="8" fontWeight="bold" textAnchor="middle">
        Particle size 10–50 μm
      </text>
    </svg>
  );
}

// 3. Pulmonary / Lungs (for C-05, R-07 99mTc-MAA)
export function LungIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trachea */}
      <path d="M80 10 L80 40" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />
      <line x1="75" y1="16" x2="85" y2="16" stroke="#BAE6FD" strokeWidth="1.5" />
      <line x1="75" y1="24" x2="85" y2="24" stroke="#BAE6FD" strokeWidth="1.5" />
      <line x1="75" y1="32" x2="85" y2="32" stroke="#BAE6FD" strokeWidth="1.5" />

      {/* Bronchi split */}
      <path d="M80 40 Q70 50 55 55" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
      <path d="M80 40 Q90 50 105 55" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />

      {/* Right Lung (Viewer's left) */}
      <path 
        d="M74 38 C58 35 32 45 28 65 C24 82 28 105 48 108 C65 110 74 95 74 80 Z" 
        fill="#38BDF8" 
        stroke="#0284C7" 
        strokeWidth="2.5" 
      />
      
      {/* Left Lung (Viewer's right - with cardiac notch) */}
      <path 
        d="M86 38 C102 35 128 45 132 65 C136 82 132 105 112 108 C96 110 92 90 92 80 C92 70 86 60 86 50 Z" 
        fill="#38BDF8" 
        stroke="#0284C7" 
        strokeWidth="2.5" 
      />

      {/* PE Defect Area (Red Wedge on Lower Right Lung) */}
      <path 
        d="M102 75 C108 72 122 76 128 85 C125 98 115 104 105 100 Z" 
        fill="#EF4444" 
        stroke="#B91C1C" 
        strokeWidth="1.5" 
      />
      <circle cx="115" cy="88" r="4" fill="#FEE2E2" />
      <text x="115" y="91" fill="#DC2626" fontSize="7" fontWeight="black" textAnchor="middle">!</text>
    </svg>
  );
}

// 4. Thyroid (for T-03 & 123I-NaI) - Authentic Butterfly Gland on Human Neck
export function ThyroidIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Glow */}
      <rect width="160" height="120" rx="8" fill="#F0FDF4" />

      {/* Human Neck & Shoulders Silhouette (Peach / Skin tone) */}
      <path 
        d="M48 5 L48 30 C48 58 32 80 18 105 L142 105 C128 80 112 58 112 30 L112 5 Z" 
        fill="#FFEDD5" 
        stroke="#FDBA74" 
        strokeWidth="1.5" 
      />

      {/* Jawline & Chin Contour at Top */}
      <path 
        d="M44 12 Q80 32 116 12" 
        stroke="#FB923C" 
        strokeWidth="2" 
        strokeLinecap="round" 
        fill="none" 
      />
      <ellipse cx="80" cy="18" rx="8" ry="3" fill="#FED7AA" />

      {/* Clavicle / Collarbone Base Lines */}
      <path d="M26 100 Q50 92 74 100" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M86 100 Q110 92 134 100" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Trachea (Windpipe) cartilage rings down midline */}
      <g>
        <rect x="71" y="32" width="18" height="58" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        <line x1="71" y1="38" x2="89" y2="38" stroke="#94A3B8" strokeWidth="1" />
        <line x1="71" y1="44" x2="89" y2="44" stroke="#94A3B8" strokeWidth="1" />
        <line x1="71" y1="50" x2="89" y2="50" stroke="#94A3B8" strokeWidth="1" />
        <line x1="71" y1="56" x2="89" y2="56" stroke="#94A3B8" strokeWidth="1" />
        <line x1="71" y1="62" x2="89" y2="62" stroke="#94A3B8" strokeWidth="1" />
        <line x1="71" y1="68" x2="89" y2="68" stroke="#94A3B8" strokeWidth="1" />
        <line x1="71" y1="74" x2="89" y2="74" stroke="#94A3B8" strokeWidth="1" />
        <line x1="71" y1="80" x2="89" y2="80" stroke="#94A3B8" strokeWidth="1" />
        <line x1="71" y1="86" x2="89" y2="86" stroke="#94A3B8" strokeWidth="1" />
      </g>

      {/* Butterfly-shaped Thyroid Gland wrapped over Trachea */}
      {/* Right Lobe (Viewer's left) */}
      <path 
        d="M73 54 C72 40 55 35 46 48 C37 62 39 84 49 92 C58 98 70 88 73 74 Z" 
        fill="#FB923C" 
        stroke="#C2410C" 
        strokeWidth="2" 
      />
      {/* Right Lobe inner soft shading */}
      <path 
        d="M68 57 C68 46 56 42 50 51 C43 62 44 78 52 85 C58 89 66 81 68 71 Z" 
        fill="#F97316" 
        opacity="0.5" 
      />

      {/* Left Lobe (Viewer's right) */}
      <path 
        d="M87 54 C88 40 105 35 114 48 C123 62 121 84 111 92 C102 98 90 88 87 74 Z" 
        fill="#FB923C" 
        stroke="#C2410C" 
        strokeWidth="2" 
      />
      {/* Left Lobe inner soft shading */}
      <path 
        d="M92 57 C92 46 104 42 110 51 C117 62 116 78 108 85 C102 89 94 81 92 71 Z" 
        fill="#F97316" 
        opacity="0.5" 
      />

      {/* Isthmus (Connecting Bridge across 2nd-4th tracheal rings) */}
      <path 
        d="M71 66 Q80 72 89 66 L89 74 Q80 80 71 74 Z" 
        fill="#EA580C" 
        stroke="#C2410C" 
        strokeWidth="1.5" 
      />

      {/* Iodide Trapping (I⁻ ions accumulating) */}
      <g>
        <circle cx="52" cy="62" r="3.5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
        <circle cx="108" cy="62" r="3.5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
        <circle cx="80" cy="71" r="2.5" fill="#FACC15" />
      </g>
    </svg>
  );
}

// 5. Bone (for 99mTc-MDP, 18F-NaF, T-09)
export function BoneIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Long Bone (Femur / Humerus) */}
      <g transform="translate(80, 60) rotate(-30)">
        {/* Left Epiphysis */}
        <ellipse cx="-45" cy="-8" rx="10" ry="12" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
        <ellipse cx="-45" cy="8" rx="10" ry="12" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
        {/* Diaphysis shaft */}
        <rect x="-42" y="-7" width="84" height="14" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
        {/* Right Epiphysis */}
        <ellipse cx="45" cy="-8" rx="10" ry="12" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
        <ellipse cx="45" cy="8" rx="10" ry="12" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
        
        {/* Active Bone Remodeling / Chemisorption Glow Points */}
        <circle cx="15" cy="0" r="5" fill="#F59E0B" />
        <circle cx="15" cy="0" r="8" fill="#FBBF24" opacity="0.4" />
      </g>
      <text x="80" y="110" fill="#0F766E" fontSize="8" fontWeight="bold" textAnchor="middle">
        Hydroxyapatite (Chemisorption)
      </text>
    </svg>
  );
}

// 6. Liver & Spleen (for 99mTc-SC, T-06)
export function LiverSpleenIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Large Right Liver Lobe */}
      <path 
        d="M25 45 C35 30 75 25 105 35 C108 55 105 78 95 85 C65 95 30 85 25 45 Z" 
        fill="#10B981" 
        stroke="#047857" 
        strokeWidth="2.5" 
      />
      {/* Left Spleen */}
      <ellipse 
        cx="130" 
        cy="55" 
        rx="16" 
        ry="24" 
        fill="#34D399" 
        stroke="#059669" 
        strokeWidth="2.5" 
        transform="rotate(-20 130 55)" 
      />
      {/* RES / Kupffer cell phagocytosis markers */}
      <circle cx="55" cy="55" r="3" fill="#FACC15" />
      <circle cx="75" cy="50" r="2.5" fill="#FACC15" />
      <circle cx="130" cy="55" r="2.5" fill="#FACC15" />
      <text x="80" y="110" fill="#065F46" fontSize="8" fontWeight="bold" textAnchor="middle">
        Reticuloendothelial System (RES)
      </text>
    </svg>
  );
}

// 7. Simple / Exchange Diffusion (for M-05)
export function DiffusionIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Phospholipid bilayer membrane representation */}
      <g transform="translate(20, 35)">
        {/* Top layer */}
        {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150].map((x) => (
          <g key={`top-${x}`}>
            <circle cx={x} cy={5} r="4" fill="#38BDF8" stroke="#0284C7" />
            <line x1={x - 1} y1={9} x2={x - 2} y2={18} stroke="#0284C7" strokeWidth="1.5" />
            <line x1={x + 1} y1={9} x2={x + 2} y2={18} stroke="#0284C7" strokeWidth="1.5" />
          </g>
        ))}
        {/* Bottom layer */}
        {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150].map((x) => (
          <g key={`bot-${x}`}>
            <circle cx={x} cy={45} r="4" fill="#38BDF8" stroke="#0284C7" />
            <line x1={x - 1} y1={41} x2={x - 2} y2={32} stroke="#0284C7" strokeWidth="1.5" />
            <line x1={x + 1} y1={41} x2={x + 2} y2={32} stroke="#0284C7" strokeWidth="1.5" />
          </g>
        ))}
        {/* Molecule diffusing through channel / concentration gradient */}
        <circle cx="75" cy="-8" r="4.5" fill="#F59E0B" />
        <path d="M75 -2 L75 52" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
        <polygon points="75,56 71,48 79,48" fill="#F59E0B" />
      </g>
      <text x="100" y="105" fill="#92400E" fontSize="9" fontWeight="bold" textAnchor="middle">
        ตามความต่างความเข้มข้น (ไม่ใช้พลังงาน ATP)
      </text>
    </svg>
  );
}

// 8. Cellular Migration / WBC (for M-08 & 111In-WBC)
export function CellularMigrationIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Amoeboid Leukocyte (WBC) migration */}
      <path 
        d="M60 30 C90 20 135 25 150 50 C160 70 145 95 120 100 C95 105 60 95 45 75 C35 55 45 35 60 30 Z" 
        fill="#93C5FD" 
        stroke="#2563EB" 
        strokeWidth="3" 
      />
      {/* Multi-lobed nucleus (Neutrophil) */}
      <circle cx="85" cy="55" r="10" fill="#1D4ED8" />
      <circle cx="108" cy="50" r="9" fill="#1D4ED8" />
      <circle cx="105" cy="72" r="11" fill="#1D4ED8" />
      <path d="M85 55 L108 50 L105 72 Z" stroke="#1D4ED8" strokeWidth="4" />

      {/* Migration pseudopodia arrows */}
      <path d="M150 50 Q170 52 185 55" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="3 3" />
      <polygon points="190,56 182,51 184,59" fill="#F59E0B" />
      <text x="100" y="112" fill="#1E3A8A" fontSize="8" fontWeight="bold" textAnchor="middle">
        เม็ดเลือดขาวเคลื่อนที่สู่ตำแหน่งติดเชื้อ / อักเสบ
      </text>
    </svg>
  );
}
