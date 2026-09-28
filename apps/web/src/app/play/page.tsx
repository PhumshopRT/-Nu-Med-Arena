"use client";

import React, { Suspense } from "react";
import { PlayClient } from "./[code]/PlayClient";

export default function PlayIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-200 font-game">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
          <span className="text-lg font-bold">กำลังเตรียมโต๊ะประลองไพ่...</span>
        </div>
      }
    >
      <PlayClient />
    </Suspense>
  );
}
