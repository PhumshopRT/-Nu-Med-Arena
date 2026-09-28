import React from "react";

export function MascotNew({ className = "w-32 h-44" }: { className?: string }) {
  // นิว — นักศึกษาชาย ผมดำสั้น เสื้อกาวน์ทับเสื้อยืดน้ำเงิน ถือการ์ด R-01
  return (
    <svg viewBox="0 0 160 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="80" cy="210" rx="45" ry="8" fill="rgba(0,0,0,0.25)" />
      
      {/* Legs & Shoes */}
      <rect x="58" y="165" width="16" height="40" rx="6" fill="#1e293b" />
      <rect x="86" y="165" width="16" height="40" rx="6" fill="#1e293b" />
      <ellipse cx="64" cy="205" rx="12" ry="6" fill="#0f172a" />
      <ellipse cx="96" cy="205" rx="12" ry="6" fill="#0f172a" />

      {/* Blue Inner Shirt */}
      <rect x="66" y="98" width="28" height="70" rx="4" fill="#2563eb" />
      <polygon points="80,105 74,98 86,98" fill="#1d4ed8" />

      {/* White Lab Coat */}
      <path d="M46 95 L68 98 L68 175 L42 170 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M114 95 L92 98 L92 175 L118 170 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M50 95 C50 95 62 145 66 175 L94 175 C98 145 110 95 110 95 Z" fill="#ffffff" />
      {/* Coat Collars */}
      <polygon points="56,95 72,125 66,95" fill="#e2e8f0" stroke="#cbd5e1" />
      <polygon points="104,95 88,125 94,95" fill="#e2e8f0" stroke="#cbd5e1" />
      {/* Pocket & Pen */}
      <rect x="94" y="130" width="14" height="18" rx="2" fill="#e2e8f0" />
      <line x1="98" y1="126" x2="98" y2="135" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <line x1="102" y1="124" x2="102" y2="135" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />

      {/* Head & Neck */}
      <rect x="72" y="80" width="16" height="20" rx="4" fill="#fed7aa" />
      {/* Face */}
      <rect x="52" y="35" width="56" height="52" rx="16" fill="#fed7aa" stroke="#fcd34d" strokeWidth="1" />
      {/* Cheeks blush */}
      <ellipse cx="62" cy="68" rx="5" ry="3" fill="#fca5a5" opacity="0.6" />
      <ellipse cx="98" cy="68" rx="5" ry="3" fill="#fca5a5" opacity="0.6" />
      {/* Eyes with sparkle */}
      <circle cx="66" cy="58" r="4.5" fill="#0f172a" />
      <circle cx="68" cy="56" r="1.5" fill="#ffffff" />
      <circle cx="94" cy="58" r="4.5" fill="#0f172a" />
      <circle cx="96" cy="56" r="1.5" fill="#ffffff" />
      {/* Smile */}
      <path d="M74 68 Q80 75 86 68" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Short Black Hair */}
      <path d="M48 45 C48 20 62 18 80 18 C98 18 112 20 112 45 C112 48 108 42 104 38 C96 34 88 42 80 36 C72 42 64 34 56 38 C52 42 48 48 48 45 Z" fill="#1e293b" />
      <path d="M48 45 L52 62 L56 50 Z" fill="#1e293b" />
      <path d="M112 45 L108 62 L104 50 Z" fill="#1e293b" />

      {/* Left Arm holding R-01 Card */}
      <path d="M46 100 Q30 120 28 140" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
      <circle cx="28" cy="142" r="7" fill="#fed7aa" />
      
      {/* Miniature R-01 Card */}
      <g transform="translate(14, 125) rotate(-12)">
        <rect width="26" height="36" rx="4" fill="#2F6FED" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
        <rect x="2" y="2" width="22" height="8" rx="2" fill="#1E4FD7" />
        <text x="13" y="8" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">R-01</text>
        <rect x="3" y="12" width="20" height="16" rx="2" fill="#E8F1FF" />
        <text x="13" y="20" fill="#1E4FD7" fontSize="5" fontWeight="bold" textAnchor="middle">¹⁸F-FDG</text>
        <circle cx="13" cy="24" r="2" fill="#2F6FED" />
      </g>

      {/* Right Arm */}
      <path d="M114 100 Q128 115 130 135" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
      <circle cx="130" cy="136" r="7" fill="#fed7aa" />
    </svg>
  );
}

export function MascotMed({ className = "w-32 h-44" }: { className?: string }) {
  // เมด — นักศึกษาหญิงผมยาว มัดสูง หมวกแก๊ปแล็บขาว ถือการ์ด C-05
  return (
    <svg viewBox="0 0 160 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="80" cy="210" rx="45" ry="8" fill="rgba(0,0,0,0.25)" />

      {/* High Ponytail */}
      <path d="M96 28 C120 18 135 45 132 75 C125 70 120 50 102 42 Z" fill="#78350f" />
      <circle cx="98" cy="36" r="5" fill="#ef4444" /> {/* Hair tie */}

      {/* Legs & Skirt */}
      <rect x="60" y="170" width="14" height="35" rx="5" fill="#fed7aa" />
      <rect x="86" y="170" width="14" height="35" rx="5" fill="#fed7aa" />
      {/* White socks & shoes */}
      <rect x="59" y="195" width="16" height="12" rx="4" fill="#ffffff" />
      <rect x="85" y="195" width="16" height="12" rx="4" fill="#ffffff" />
      <ellipse cx="66" cy="206" rx="10" ry="5" fill="#dc2626" />
      <ellipse cx="94" cy="206" rx="10" ry="5" fill="#dc2626" />

      {/* Lab Coat / Dress */}
      <path d="M50 105 L66 100 L66 168 L44 165 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M110 105 L94 100 L94 168 L116 165 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M54 100 C54 100 60 145 62 170 L98 170 C100 145 106 100 106 100 Z" fill="#ffffff" />
      {/* Pink Inner Shirt */}
      <rect x="68" y="98" width="24" height="40" fill="#f43f5e" />

      {/* Head & Neck */}
      <rect x="73" y="78" width="14" height="20" rx="4" fill="#fed7aa" />
      {/* Face */}
      <rect x="54" y="38" width="52" height="48" rx="16" fill="#fed7aa" />
      {/* Long hair bangs */}
      <path d="M52 46 C52 35 64 35 75 42 C85 35 108 35 108 48 C108 58 104 68 104 68 C104 68 100 52 95 48 C85 52 75 46 65 48 C58 52 52 68 52 68 Z" fill="#78350f" />
      
      {/* White Lab Cap */}
      <path d="M50 38 C50 22 62 15 80 15 C98 15 110 22 110 38 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
      {/* Cap Visor */}
      <path d="M46 38 C46 36 60 32 80 32 C100 32 114 36 114 38 L110 42 C95 38 65 38 50 42 Z" fill="#e2e8f0" />
      {/* Cross or Trefoil on Cap */}
      <circle cx="80" cy="24" r="5" fill="#2EAD4B" />
      <path d="M80 21 L80 27 M77 24 L83 24" stroke="#ffffff" strokeWidth="1.5" />

      {/* Cheeks blush */}
      <ellipse cx="63" cy="68" rx="5" ry="3" fill="#fca5a5" opacity="0.7" />
      <ellipse cx="97" cy="68" rx="5" ry="3" fill="#fca5a5" opacity="0.7" />
      {/* Big Eyes with shine (winking or sparkle) */}
      <circle cx="67" cy="58" r="4.5" fill="#0f172a" />
      <circle cx="69" cy="56" r="1.5" fill="#ffffff" />
      <circle cx="93" cy="58" r="4.5" fill="#0f172a" />
      <circle cx="95" cy="56" r="1.5" fill="#ffffff" />
      {/* Cheerful Smile */}
      <path d="M74 68 Q80 76 86 68" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Right Arm holding C-05 Card */}
      <path d="M108 105 Q126 122 128 140" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" />
      <circle cx="128" cy="142" r="6" fill="#fed7aa" />

      {/* Miniature C-05 Card */}
      <g transform="translate(118, 120) rotate(15)">
        <rect width="26" height="36" rx="4" fill="#C81E33" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
        <rect x="2" y="2" width="22" height="8" rx="2" fill="#991B1B" />
        <text x="13" y="8" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">C-05</text>
        <rect x="3" y="12" width="20" height="16" rx="2" fill="#FFE8EA" />
        <text x="13" y="18" fill="#C81E33" fontSize="4" fontWeight="bold" textAnchor="middle">PE Case</text>
        <circle cx="13" cy="23" r="2.5" fill="#C81E33" />
      </g>

      {/* Left Arm waving */}
      <path d="M52 105 Q36 95 32 82" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" />
      <circle cx="31" cy="80" r="6" fill="#fed7aa" />
    </svg>
  );
}

export function MascotGamma({ className = "w-24 h-28" }: { className?: string }) {
  // แกมม่า — สุนัขแล็บสีขาวเทา มีปลอกคอรูป trefoil นั่งข้างปุ่ม PLAY
  return (
    <svg viewBox="0 0 120 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="60" cy="132" rx="35" ry="7" fill="rgba(0,0,0,0.25)" />

      {/* Tail wagging */}
      <path d="M25 105 C10 95 12 75 22 70" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />

      {/* Body sitting */}
      <ellipse cx="60" cy="100" rx="30" ry="26" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Paws */}
      <ellipse cx="45" cy="125" rx="10" ry="6" fill="#e2e8f0" stroke="#cbd5e1" />
      <ellipse cx="75" cy="125" rx="10" ry="6" fill="#e2e8f0" stroke="#cbd5e1" />

      {/* Green Collar with Radiation Trefoil */}
      <path d="M40 78 Q60 88 80 78" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
      <g transform="translate(60, 85)">
        <circle cx="0" cy="0" r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
        {/* Trefoil symbol */}
        <circle cx="0" cy="0" r="1.5" fill="#000000" />
        <path d="M-1 -2 L0 -4 L1 -2 Z" fill="#000000" />
        <path d="M-2 1 L-4 2 L-2 3 Z" fill="#000000" />
        <path d="M2 1 L4 2 L2 3 Z" fill="#000000" />
      </g>

      {/* Head */}
      <ellipse cx="60" cy="52" rx="26" ry="24" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Gray ears */}
      <path d="M38 35 C30 20 20 40 25 55 Z" fill="#94a3b8" />
      <path d="M82 35 C90 20 100 40 95 55 Z" fill="#94a3b8" />
      {/* Face muzzle */}
      <ellipse cx="60" cy="62" rx="14" ry="10" fill="#ffffff" />
      <ellipse cx="60" cy="57" rx="5" ry="3.5" fill="#1e293b" /> {/* Nose */}
      {/* Tongue panting happily */}
      <path d="M58 65 C58 72 62 72 62 65 Z" fill="#f43f5e" />

      {/* Cheerful Eyes */}
      <ellipse cx="48" cy="48" rx="4" ry="5" fill="#0f172a" />
      <circle cx="50" cy="46" r="1.5" fill="#ffffff" />
      <ellipse cx="72" cy="48" rx="4" ry="5" fill="#0f172a" />
      <circle cx="74" cy="46" r="1.5" fill="#ffffff" />
    </svg>
  );
}
