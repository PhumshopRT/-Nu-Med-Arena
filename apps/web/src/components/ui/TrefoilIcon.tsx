"use client";

import React from "react";

export function TrefoilIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  const px = `${size}px`;
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 select-none filter drop-shadow ${className}`}
      style={{ fontSize: px, width: px, height: px, lineHeight: 1 }}
    >
      ☢️
    </span>
  );
}
