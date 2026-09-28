"use client";

import React from "react";
import { getAssetPath } from "@/lib/assets";

interface NucCoinIconProps {
  size?: 18 | 20 | 22 | 28 | number;
  className?: string;
  alt?: string;
}

/**
 * Official NucMed Arena Game Coin Component
 * Renders the circular gold radioactive trefoil game coin from public/ui/nuccoin.webp
 * Strict sizes:
 * - 18px in buttons and card price tags
 * - 22px next to shop wallet balance
 * - 28px on Arena Hub top plaque
 */
export function NucCoinIcon({ size = 20, className = "", alt = "NucCoin" }: NucCoinIconProps) {
  const px = `${size}px`;

  return (
    <img
      src={getAssetPath("/ui/nuccoin.webp")}
      alt={alt}
      width={size}
      height={size}
      style={{ width: px, height: px, minWidth: px, minHeight: px }}
      className={`inline-block object-contain shrink-0 select-none pointer-events-none drop-shadow-sm ${className}`}
      onError={(e) => {
        // Fallback to png if webp ever has transparency issue in legacy browsers
        const target = e.currentTarget;
        if (!target.src.endsWith(".png")) {
          target.src = getAssetPath("/ui/nuccoin.png");
        }
      }}
    />
  );
}
