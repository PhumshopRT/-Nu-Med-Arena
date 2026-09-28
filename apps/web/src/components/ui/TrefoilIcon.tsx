"use client";

import React from "react";

export function TrefoilIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  const px = `${size}px`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ width: px, height: px, minWidth: px, minHeight: px }}
      className={`inline-block shrink-0 select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central dot */}
      <circle cx="12" cy="12" r="2.2" />
      {/* Top blade */}
      <path d="M12 12L8.5 4.5C9.5 4.2 10.7 4 12 4C13.3 4 14.5 4.2 15.5 4.5L12 12Z" />
      {/* Bottom right blade */}
      <path d="M12 12L18.5 15.8C18.1 16.9 17.3 17.8 16.3 18.5C15.3 19.1 14.1 19.5 13 19.5L12 12Z" />
      {/* Bottom left blade */}
      <path d="M12 12L11 19.5C9.9 19.5 8.7 19.1 7.7 18.5C6.7 17.8 5.9 16.9 5.5 15.8L12 12Z" />
    </svg>
  );
}
