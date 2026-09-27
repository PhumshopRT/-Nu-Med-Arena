"use client";

import React, { Suspense } from "react";
import { BoardClient } from "./[code]/BoardClient";

export default function BoardIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-200 font-game">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
          <span className="text-lg font-bold">กำลังเชื่อมต่อจอฉายโปรเจกเตอร์...</span>
        </div>
      }
    >
      <BoardClient />
    </Suspense>
  );
}
