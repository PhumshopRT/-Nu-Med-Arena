"use client";

import React, { Suspense } from "react";
import { LobbyClient } from "./[code]/LobbyClient";

export default function LobbyIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-felt-table flex flex-col items-center justify-center text-amber-200 font-game">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
          <span className="text-lg font-bold">กำลังเชื่อมต่อห้องประลอง...</span>
        </div>
      }
    >
      <LobbyClient />
    </Suspense>
  );
}
