import React from "react";
import { PlayClient } from "./PlayClient";

export function generateStaticParams() {
  return [
    { code: "ROOM01" },
    { code: "SOLO_PRACTICE" },
    { code: "DEMO" },
    { code: "7K3Q2P" }
  ];
}

export default function PlayPage() {
  return <PlayClient />;
}
