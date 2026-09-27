"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Clock, 
  Users, 
  Sparkles, 
  Award, 
  CheckCircle, 
  HelpCircle,
  Maximize2
} from "lucide-react";
import { 
  ALL_CASE_CARDS, 
  CaseCard, 
  PublicRoomState, 
  PublicPlayer 
} from "@nucmed/shared";
import { CaseCard as CaseCardComponent } from "@/components/cards/CaseCard";

export function BoardClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawCode = (searchParams?.get("code") || params?.code || "ROOM01") as string;
  const roomCode = rawCode.toUpperCase();

  const [currentCase, setCurrentCase] = useState<CaseCard>(ALL_CASE_CARDS[0]);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(10);
  const [timeLeft, setTimeLeft] = useState(45);
  const [players, setPlayers] = useState<PublicPlayer[]>([]);

  useEffect(() => {
    // Read live room from storage or sync
    const checkRoom = () => {
      try {
        const saved = localStorage.getItem(`nucmed_room_${roomCode}`);
        if (saved) {
          const parsed: PublicRoomState = JSON.parse(saved);
          setRound(parsed.roundIndex || 1);
          setTotalRounds(parsed.totalRounds || 10);
          setPlayers(parsed.players || []);
        }
      } catch {
        // ignore
      }
    };

    checkRoom();
    const interval = setInterval(checkRoom, 2000);
    return () => clearInterval(interval);
  }, [roomCode]);

  // Timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const lockedCount = players.filter((p) => p.locked).length;

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 select-none overflow-hidden">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />

      {/* Top Projector Header */}
      <header className="relative z-10 w-full flex justify-between items-center bg-amber-950/80 border-3 border-amber-600/80 p-4 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-amber-200 flex items-center justify-center text-2xl shadow-lg">
            ☢️
          </div>
          <div>
            <h1 className="font-game font-black text-2xl md:text-3xl text-amber-200 tracking-wide">
              NucMed Arena — จอภาพสำหรับห้องเรียน (PROJECTOR VIEW)
            </h1>
            <p className="text-xs text-amber-300/80">
              รายวิชาเวชศาสตร์นิวเคลียร์ • รหัสห้องประลอง: <strong className="font-mono text-white text-base tracking-widest">{roomCode}</strong>
            </p>
          </div>
        </div>

        {/* Big Timer */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-black/60 px-5 py-2.5 rounded-2xl border-2 border-amber-500/60">
            <Clock className={`w-6 h-6 ${timeLeft <= 10 ? "text-rose-400 animate-bounce" : "text-amber-400"}`} />
            <span className={`font-mono font-black text-3xl ${timeLeft <= 10 ? "text-rose-400" : "text-white"}`}>
              {timeLeft}s
            </span>
          </div>

          <div className="bg-amber-900/90 border-2 border-amber-400 px-5 py-2 rounded-2xl text-center">
            <div className="text-[10px] text-amber-300 font-bold uppercase">รอบแข่งขัน</div>
            <div className="font-game font-black text-2xl text-white">
              {round} / {totalRounds}
            </div>
          </div>
        </div>
      </header>

      {/* Center Arena: Huge Case Card + Response Matrix + Live Leaderboard */}
      <main className="relative z-10 flex-1 grid grid-cols-12 gap-8 my-6 items-center">
        {/* Left: Case Display (7 cols) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col items-center justify-center">
          <div className="transform scale-110 md:scale-125 my-8">
            <CaseCardComponent card={currentCase} size="lg" isHoverable={false} />
          </div>

          {/* Response Counter */}
          <div className="mt-8 bg-amber-950/80 border-2 border-amber-600 px-8 py-3 rounded-2xl flex items-center space-x-4 shadow-xl">
            <Users className="w-6 h-6 text-emerald-400" />
            <span className="font-game font-black text-xl text-amber-100">
              สถานะการตอบ: <strong>{lockedCount} / {Math.max(players.length, 1)}</strong> คนล็อคคำตอบแล้ว
            </span>
          </div>
        </div>

        {/* Right: Classroom Leaderboard & Player Matrix (5 cols) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col space-y-4">
          <div className="wood-panel p-6 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col h-[520px]">
            <div className="flex justify-between items-center mb-4 border-b border-amber-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h3 className="font-game font-black text-xl text-amber-200">
                  อันดับคะแนน (LEADERBOARD)
                </h3>
              </div>
              <span className="text-xs text-amber-300 font-bold">
                {players.length} ผู้เล่น
              </span>
            </div>

            {/* Players Table */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {[...players]
                .sort((a, b) => b.score - a.score)
                .map((p, rank) => (
                  <div
                    key={p.id}
                    className={`flex justify-between items-center p-3 rounded-2xl border-2 ${
                      rank === 0
                        ? "bg-amber-900/90 border-amber-300 shadow-md"
                        : "bg-black/50 border-amber-800/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-game font-black text-lg text-amber-300 w-6 text-center">
                        #{rank + 1}
                      </span>
                      <span className="text-xl">{p.avatar || "👨‍🎓"}</span>
                      <div>
                        <div className="font-bold text-sm text-white">{p.name}</div>
                        <div className="text-[10px] text-amber-300/80 font-mono">{p.studentId}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {p.locked ? (
                        <span className="bg-emerald-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>ล็อคแล้ว</span>
                        </span>
                      ) : (
                        <span className="bg-amber-600/60 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                          กำลังคิด...
                        </span>
                      )}

                      <span className="font-mono font-black text-xl text-amber-200">
                        {p.score} PTS
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full py-2.5 bg-black/60 border-t border-amber-900/60 flex justify-between items-center px-4 text-xs text-amber-300/70">
        <span>NucMed Arena • Localization Match Teaching Assistant View</span>
        <span>กด F11 บนคีย์บอร์ดเพื่อเปิดโหมดเต็มหน้าจอ (Full Screen)</span>
      </footer>
    </div>
  );
}
