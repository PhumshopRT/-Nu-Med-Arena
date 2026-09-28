"use client";

import React from "react";
import clsx from "clsx";

export interface AvatarBadgeProps {
  avatarId?: string;
  size?: number;
  className?: string;
}

export function AvatarBadge({ avatarId = "avatar-default", size = 32, className = "" }: AvatarBadgeProps) {
  const norm = (avatarId || "avatar-default").toLowerCase().replace(/_/g, "-");

  const px = `${size}px`;

  // Render pure SVG vector avatar based on normalized ID
  const renderSvg = () => {
    switch (norm) {
      case "avatar-niw":
      case "niw":
        // Niw - Young nuclear physicist with glasses & atom orbits
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="url(#niwBg)" stroke="#38BDF8" strokeWidth="3" />
            {/* Orbital Ellipses */}
            <ellipse cx="50" cy="50" rx="38" ry="14" stroke="#7DD3FC" strokeWidth="2" strokeDasharray="3 3" transform="rotate(30 50 50)" opacity="0.8" />
            <ellipse cx="50" cy="50" rx="38" ry="14" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" transform="rotate(-30 50 50)" opacity="0.8" />
            {/* Face & Hair */}
            <circle cx="50" cy="52" r="22" fill="#FED7AA" />
            <path d="M28 42C30 30 42 24 50 24C60 24 70 30 72 42C64 36 56 36 50 38C44 36 36 36 28 42Z" fill="#78350F" />
            {/* Glasses */}
            <circle cx="42" cy="52" r="7" stroke="#0284C7" strokeWidth="2.5" fill="#E0F2FE" fillOpacity="0.4" />
            <circle cx="58" cy="52" r="7" stroke="#0284C7" strokeWidth="2.5" fill="#E0F2FE" fillOpacity="0.4" />
            <path d="M49 52H51" stroke="#0284C7" strokeWidth="2.5" />
            {/* Smile */}
            <path d="M45 64Q50 68 55 64" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="niwBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0369A1" />
                <stop offset="1" stopColor="#082F49" />
              </linearGradient>
            </defs>
          </svg>
        );

      case "avatar-med":
      case "med":
        // Med - Nuclear medicine physician with scrub cap & stethoscope
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="url(#medBg)" stroke="#34D399" strokeWidth="3" />
            {/* Medical Cross Aura */}
            <path d="M47 18H53V26H61V32H53V40H47V32H39V26H47V18Z" fill="#A7F3D0" opacity="0.3" />
            {/* Face & Cap */}
            <circle cx="50" cy="54" r="22" fill="#FDE68A" />
            <path d="M28 46C28 32 38 24 50 24C62 24 72 32 72 46C65 44 58 44 50 44C42 44 35 44 28 46Z" fill="#059669" />
            {/* Eyes */}
            <circle cx="43" cy="52" r="2.5" fill="#064E3B" />
            <circle cx="57" cy="52" r="2.5" fill="#064E3B" />
            {/* Smile */}
            <path d="M45 63Q50 68 55 63" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
            {/* Stethoscope */}
            <path d="M36 62C36 74 44 80 50 80C56 80 64 74 64 62" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="80" r="5" fill="#94A3B8" stroke="#F8FAFC" strokeWidth="2" />
            <defs>
              <linearGradient id="medBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#047857" />
                <stop offset="1" stopColor="#022C22" />
              </linearGradient>
            </defs>
          </svg>
        );

      case "avatar-gamma":
      case "gamma":
        // Gamma - Pure radiant energy flare with Greek letter gamma (γ)
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="url(#gammaBg)" stroke="#FBBF24" strokeWidth="3" />
            {/* Energy rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="50"
                y1="14"
                x2="50"
                y2="24"
                stroke="#FDE047"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
                opacity="0.9"
              />
            ))}
            {/* Central Glow */}
            <circle cx="50" cy="50" r="24" fill="#FEF08A" opacity="0.4" />
            {/* Gamma Symbol (γ) */}
            <path
              d="M38 32C42 42 48 58 50 72M62 32C58 42 52 58 50 72M50 72C49 76 46 80 41 80"
              stroke="#FFFBEB"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="gammaBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D97706" />
                <stop offset="1" stopColor="#451A03" />
              </linearGradient>
            </defs>
          </svg>
        );

      case "avatar-thyroid":
        // Thyroid butterfly gland SVG
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="url(#thyroidBg)" stroke="#FB923C" strokeWidth="3" />
            {/* Trachea */}
            <rect x="44" y="20" width="12" height="60" rx="3" fill="#FED7AA" opacity="0.7" />
            {[26, 34, 42, 50, 58, 66, 74].map((y, idx) => (
              <line key={idx} x1="44" y1={y} x2="56" y2={y} stroke="#EA580C" strokeWidth="1.5" opacity="0.6" />
            ))}
            {/* Right Lobe */}
            <path
              d="M50 52C42 46 32 34 32 46C32 60 40 70 50 64Z"
              fill="#F97316"
              stroke="#FFEDD5"
              strokeWidth="2"
            />
            {/* Left Lobe */}
            <path
              d="M50 52C58 46 68 34 68 46C68 60 60 70 50 64Z"
              fill="#F97316"
              stroke="#FFEDD5"
              strokeWidth="2"
            />
            {/* Central Isthmus */}
            <ellipse cx="50" cy="57" rx="8" ry="4" fill="#EA580C" />
            <defs>
              <linearGradient id="thyroidBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C2410C" />
                <stop offset="1" stopColor="#431407" />
              </linearGradient>
            </defs>
          </svg>
        );

      case "avatar-lung":
        // Anatomical Lung pair with vascular tree
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="url(#lungBg)" stroke="#38BDF8" strokeWidth="3" />
            {/* Trachea & Bronchi */}
            <path d="M50 20V42M50 42L38 52M50 42L62 52" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" />
            {/* Left Lung */}
            <path
              d="M46 42C44 36 36 32 30 38C22 46 22 66 28 74C34 80 44 76 46 68C47 62 47 52 46 42Z"
              fill="#0284C7"
              stroke="#BAE6FD"
              strokeWidth="2"
            />
            {/* Right Lung */}
            <path
              d="M54 42C56 36 64 32 70 38C78 46 78 66 72 74C66 80 56 76 54 68C53 62 53 52 54 42Z"
              fill="#0284C7"
              stroke="#BAE6FD"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="lungBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0369A1" />
                <stop offset="1" stopColor="#082F49" />
              </linearGradient>
            </defs>
          </svg>
        );

      case "av-bone":
      case "avatar-bone":
        // Bone mineral crystal lattice
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="url(#boneBg)" stroke="#94A3B8" strokeWidth="3" />
            {/* Bone silhouette */}
            <path
              d="M34 32C30 32 26 35 26 40C26 43 28 46 31 47C28 48 26 51 26 54C26 59 30 62 34 62C38 62 42 59 44 56H56C58 59 62 62 66 62C70 62 74 59 74 54C74 51 72 48 69 47C72 46 74 43 74 40C74 35 70 32 66 32C62 32 58 35 56 38H44C42 35 38 32 34 32Z"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            {/* Sparkles */}
            <path d="M50 20L52 26L58 28L52 30L50 36L48 30L42 28L48 26Z" fill="#FDE047" />
            <defs>
              <linearGradient id="boneBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#334155" />
                <stop offset="1" stopColor="#0F172A" />
              </linearGradient>
            </defs>
          </svg>
        );

      case "avatar-default":
      default:
        // Default: Golden Trefoil / 18F-FDG
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="url(#trefoilBg)" stroke="#F59E0B" strokeWidth="3" />
            {/* Emoji Trefoil */}
            <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontSize="48" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}>
              ☢️
            </text>
            <defs>
              <linearGradient id="trefoilBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#92400E" />
                <stop offset="1" stopColor="#451A03" />
              </linearGradient>
            </defs>
          </svg>
        );
    }
  };

  return (
    <div
      style={{ width: px, height: px, minWidth: px, minHeight: px }}
      className={clsx(
        "rounded-full overflow-hidden shrink-0 inline-flex items-center justify-center select-none shadow-md",
        className
      )}
    >
      {renderSvg()}
    </div>
  );
}
