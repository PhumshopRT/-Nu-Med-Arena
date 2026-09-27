import React from "react";
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
  return <LobbyClient />;
}
