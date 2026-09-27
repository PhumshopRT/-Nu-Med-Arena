import React, { Suspense } from "react";
import { LobbyClient } from "./LobbyClient";

export function generateStaticParams() {
  return [
    { code: "ROOM01" },
    { code: "SOLO_PRACTICE" },
    { code: "DEMO" },
    { code: "7K3Q2P" }
  ];
}

export default function LobbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-felt-table" />}>
      <LobbyClient />
    </Suspense>
  );
}
