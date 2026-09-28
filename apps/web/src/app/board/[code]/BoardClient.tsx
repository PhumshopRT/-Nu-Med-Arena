"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Clock, Users, Play, SkipForward, XSquare, CheckCircle, XCircle 
} from "lucide-react";
import { 
  ALL_CASE_CARDS, CaseCard, PublicRoomState, PublicPlayer, ALL_RP_CARDS, ALL_MECH_CARDS 
} from "@nucmed/shared";
import { CaseCard as CaseCardComponent } from "@/components/cards/CaseCard";
import { getRememberedUser } from "@/lib/user";
import { createRoomSync, RoomSyncHandle, SyncMessage } from "@/lib/sync";
import { sounds } from "@/lib/sound";

export function BoardClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCode = (searchParams?.get("code") || params?.code || "ROOM01") as string;
  const roomCode = rawCode.toUpperCase();

  const [room, setRoom] = useState<PublicRoomState | null>(null);
  const [currentCase, setCurrentCase] = useState<CaseCard>(ALL_CASE_CARDS[0]);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const [user] = useState(() => getRememberedUser());
  const syncRef = useRef<RoomSyncHandle | null>(null);
  const roomRef = useRef<PublicRoomState | null>(null);
  roomRef.current = room;

  const isHost = Boolean(user && room && room.hostId === `p_${user.studentId}`);

  useEffect(() => {
    // 1. Initially load room from local storage if host
    try {
      const saved = localStorage.getItem(`nucmed_room_${roomCode}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRoom(parsed);
        setTimeLeft(parsed.settings?.thinkSeconds || 30);
        const cid = parsed.caseCardId;
        const foundCase = ALL_CASE_CARDS.find(c => c.id === cid);
        if (foundCase) setCurrentCase(foundCase);
      }
    } catch {}

    const handleSync = (msg: SyncMessage) => {
      const currentRoom = roomRef.current;
      
      switch (msg.type) {
        case "ROOM_STATE_SYNC":
          if (msg.room) {
            setRoom(msg.room);
            const cid = msg.room.caseCardId;
            const foundCase = ALL_CASE_CARDS.find(c => c.id === cid);
            if (foundCase) setCurrentCase(foundCase);
            
            // If just transitioned to THINK, reset timer
            if (msg.room.phase === "THINK" && currentRoom?.phase !== "THINK") {
              setTimeLeft(msg.room.settings.thinkSeconds || 30);
            }
          }
          break;
        case "PLAYER_JOIN":
          if (isHost && currentRoom) {
            const exists = currentRoom.players.some(p => p.studentId === msg.player.studentId);
            if (!exists && currentRoom.players.length < (currentRoom.settings.maxPlayers || 55)) {
              const updated = { ...currentRoom, players: [...currentRoom.players, msg.player] };
              saveAndBroadcast(updated);
            }
          }
          break;
        case "PLAYER_LOCK":
          if (isHost && currentRoom) {
            const updatedPlayers = currentRoom.players.map(p => 
              p.id === msg.playerId ? { ...p, locked: msg.locked } : p
            );
            // Optionally save answer if it was sent, but student verifies on their end or we verify here.
            // For simplicity, we just mark locked.
            const updated = { ...currentRoom, players: updatedPlayers };
            saveAndBroadcast(updated);
          }
          break;
      }
    };

    const sync = createRoomSync(roomCode, handleSync);
    syncRef.current = sync;
    
    // Request initial state if guest
    if (user && roomRef.current?.hostId !== `p_${user.studentId}`) {
      sync.publish({ type: "REQUEST_ROOM_STATE", player: { id: `p_${user.studentId}`, name: user.displayName, studentId: user.studentId, ready: true, locked: false, score: 0, handCount: 5, avatar: "👨‍🎓" } });
    }

    return () => sync.destroy();
  }, [roomCode, isHost, user]);

  const saveAndBroadcast = (updated: PublicRoomState) => {
    setRoom(updated);
    localStorage.setItem(`nucmed_room_${roomCode}`, JSON.stringify(updated));
    syncRef.current?.publish({ type: "ROOM_STATE_SYNC", room: updated });
  };

  // Timer loop for THINK phase
  useEffect(() => {
    if (!room || room.phase !== "THINK") return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (isHost) {
            // Auto transition to REVEAL
            handleReveal();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [room?.phase, isHost]);

  // Host Controls
  const handleStartRound = () => {
    if (!room || !isHost) return;
    sounds.playWin();
    
    // Pick next case
    const nextCase = ALL_CASE_CARDS[(room.roundIndex - 1) % ALL_CASE_CARDS.length];
    setCurrentCase(nextCase);
    
    // Reset players lock status
    const resetPlayers = room.players.map(p => ({ ...p, locked: false }));
    
    const updated: PublicRoomState = {
      ...room,
      phase: "THINK",
      caseCardId: nextCase.id,
      players: resetPlayers
    };
    setTimeLeft(room.settings.thinkSeconds || 30);
    saveAndBroadcast(updated);
    syncRef.current?.publish({ type: "ROUND_ADVANCE", roundIndex: room.roundIndex, caseId: nextCase.id });
  };

  const handleReveal = () => {
    if (!room || !isHost) return;
    sounds.playSelect();
    
    // Grade the players?
    // In this mode, we let PlayClient calculate and send score, or we just reveal the correct answer.
    // We will broadcast ROUND_REVEAL so students show result.
    const updated: PublicRoomState = {
      ...room,
      phase: "REVEAL"
    };
    saveAndBroadcast(updated);
    syncRef.current?.publish({ type: "ROUND_REVEAL", roundIndex: room.roundIndex, caseId: currentCase.id });
  };
  
  const handleNextRound = () => {
    if (!room || !isHost) return;
    sounds.playClick();
    const updated: PublicRoomState = {
      ...room,
      phase: "SHOW_CASE",
      roundIndex: room.roundIndex + 1
    };
    saveAndBroadcast(updated);
  };

  const handleCloseRoom = () => {
    if (!room || !isHost) return;
    sounds.playWrong();
    localStorage.removeItem(`nucmed_room_${roomCode}`);
    router.push("/");
  };

  if (!room) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">กำลังโหลดข้อมูลห้อง...</div>;
  }

  const players = room.players || [];
  const lockedCount = players.filter(p => p.locked).length;
  const totalPlayers = players.length;
  const maxLimit = room.settings.maxPlayers || 55;
  const displayMode = room.settings.spotlightMode || "big-card";

  // Check if everyone locked
  useEffect(() => {
    if (isHost && room.phase === "THINK" && totalPlayers > 0 && lockedCount >= totalPlayers) {
      handleReveal();
    }
  }, [lockedCount, totalPlayers, room?.phase, isHost]);

  const correctRp = ALL_RP_CARDS.find(r => currentCase.acceptedRpIds.includes(r.id));
  const correctMech = ALL_MECH_CARDS.find(m => currentCase.acceptedMechIds.includes(m.id));

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 select-none overflow-hidden font-game">
      {/* Background */}
      <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full flex justify-between items-center bg-amber-950/80 border-3 border-amber-600/80 p-4 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-amber-200 flex items-center justify-center text-2xl shadow-lg">
            ☢️
          </div>
          <div>
            <h1 className="font-black text-2xl md:text-3xl text-amber-200 tracking-wide">
              NucMed Arena — จอภาพสำหรับห้องเรียน (PROJECTOR VIEW)
            </h1>
            <p className="text-sm text-amber-300/80 mt-1">
              รหัสห้องเรียน: <strong className="font-mono text-white text-lg tracking-widest bg-black/40 px-2 py-0.5 rounded">{roomCode}</strong>
              <span className="ml-4 opacity-70">
                ผู้เล่น: {totalPlayers}/{maxLimit}
              </span>
            </p>
          </div>
        </div>

        {/* Big Timer */}
        <div className="flex items-center space-x-6">
          {room.phase === "THINK" && (
            <div className="flex items-center space-x-2 bg-black/60 px-5 py-2.5 rounded-2xl border-2 border-amber-500/60">
              <Clock className={`w-6 h-6 ${timeLeft <= 10 ? "text-rose-400 animate-bounce" : "text-amber-400"}`} />
              <span className={`font-mono font-black text-3xl ${timeLeft <= 10 ? "text-rose-400" : "text-white"}`}>
                {timeLeft}s
              </span>
            </div>
          )}

          <div className="bg-amber-900/90 border-2 border-amber-400 px-5 py-2 rounded-2xl text-center">
            <div className="text-[10px] text-amber-300 font-bold uppercase">รอบแข่งขัน</div>
            <div className="font-black text-2xl text-white">
              {room.roundIndex} / {room.totalRounds}
            </div>
          </div>
        </div>
      </header>

      {/* Center Arena */}
      <main className="relative z-10 flex-1 grid grid-cols-12 gap-8 my-6 items-center">
        {/* Left: Case Display */}
        <div className="col-span-12 lg:col-span-7 flex flex-col items-center justify-center h-full">
          {room.phase === "LOBBY" || room.phase === "DEAL" || room.phase === "SHOW_CASE" ? (
            <div className="text-center bg-black/40 p-8 rounded-3xl border border-amber-900/50">
              <h2 className="text-3xl text-amber-300 mb-4">รอหัวหน้าห้องเริ่มรอบแข่งขัน...</h2>
              <p className="text-lg text-white/70">โปรดเตรียมนิ้วให้พร้อม!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              {displayMode === "big-card" ? (
                <div className="transform scale-110 md:scale-125 my-8">
                  <CaseCardComponent card={currentCase} size="lg" isHoverable={false} />
                </div>
              ) : (
                <div className="w-full max-w-3xl bg-red-950/80 border-4 border-red-600 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(220,38,38,0.3)] backdrop-blur-sm">
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-relaxed tracking-wide">
                    {currentCase.promptTh}
                  </h2>
                </div>
              )}

              {/* Status or Reveal */}
              {room.phase === "THINK" ? (
                <div className="mt-8 bg-amber-950/80 border-2 border-amber-600 px-8 py-3 rounded-2xl flex items-center space-x-4 shadow-xl">
                  <Users className="w-6 h-6 text-emerald-400" />
                  <span className="font-black text-xl text-amber-100">
                    ส่งคำตอบแล้ว: <strong className="text-emerald-400">{lockedCount} / {Math.max(players.length, 1)}</strong> คน
                  </span>
                </div>
              ) : room.phase === "REVEAL" ? (
                <div className="mt-8 w-full max-w-2xl bg-emerald-950/90 border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
                  <h3 className="text-emerald-300 text-xl font-bold mb-4">เฉลยที่ถูกต้อง</h3>
                  <div className="flex items-center justify-center space-x-6 w-full">
                    <div className="flex-1 bg-black/40 rounded-xl p-4 text-center border border-emerald-800">
                      <div className="text-emerald-500 text-xs mb-1">สารเภสัชรังสี (Radiopharmaceutical)</div>
                      <div className="text-white font-bold text-lg">{correctRp?.titleTh || currentCase.acceptedRpIds[0]}</div>
                    </div>
                    <div className="flex-1 bg-black/40 rounded-xl p-4 text-center border border-emerald-800">
                      <div className="text-emerald-500 text-xs mb-1">กลไก (Mechanism)</div>
                      <div className="text-white font-bold text-lg">{correctMech?.titleTh || currentCase.acceptedMechIds[0]}</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Right: Leaderboard */}
        <div className="col-span-12 lg:col-span-5 flex flex-col h-[600px]">
          <div className="wood-panel p-6 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col h-full bg-black/60 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4 border-b border-amber-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h3 className="font-black text-xl text-amber-200">
                  อันดับคะแนน (LEADERBOARD)
                </h3>
              </div>
              <span className="text-xs text-amber-300 font-bold">
                {players.length} ผู้เล่น
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {[...players]
                .sort((a, b) => b.score - a.score)
                .slice(0, 50) // Show top 50 to avoid lag
                .map((p, rank) => (
                  <div
                    key={p.id}
                    className={`flex justify-between items-center p-3 rounded-2xl border-2 ${
                      rank < 3 && room.phase === "REVEAL"
                        ? "bg-amber-900/90 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                        : "bg-black/50 border-amber-900/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`font-black text-lg w-8 text-center ${rank === 0 ? "text-yellow-400" : rank === 1 ? "text-slate-300" : rank === 2 ? "text-orange-400" : "text-amber-500/60"}`}>
                        #{rank + 1}
                      </span>
                      <span className="text-2xl">{p.avatar || "👨‍🎓"}</span>
                      <div>
                        <div className="font-bold text-sm text-white">{p.name}</div>
                        <div className="text-[10px] text-amber-300/60 font-mono">{p.studentId}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {room.phase === "THINK" && (
                        p.locked ? (
                          <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" /> <span>ล็อค</span>
                          </span>
                        ) : (
                          <span className="bg-amber-600 text-amber-100 text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                            คิด...
                          </span>
                        )
                      )}
                      <span className="font-mono font-black text-xl text-amber-200">
                        {p.score}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* Host Controls Footer */}
      {isHost ? (
        <footer className="relative z-20 w-full py-4 bg-amber-950/90 border-t-4 border-amber-600 flex justify-center items-center px-6 gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          {(room.phase === "LOBBY" || room.phase === "DEAL" || room.phase === "SHOW_CASE" || room.phase === "NEXT_CASE") && (
            <button
              onClick={handleStartRound}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg flex items-center space-x-2 border-b-4 border-emerald-800 active:translate-y-1 active:border-b-0"
            >
              <Play className="w-5 h-5" />
              <span>เริ่มจับเวลาข้อ {room.roundIndex}</span>
            </button>
          )}

          {room.phase === "THINK" && (
            <button
              onClick={handleReveal}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center space-x-2 border-b-4 border-blue-800 active:translate-y-1 active:border-b-0"
            >
              <SkipForward className="w-5 h-5" />
              <span>ข้ามไปดูเฉลย</span>
            </button>
          )}

          {room.phase === "REVEAL" && room.roundIndex < room.totalRounds && (
            <button
              onClick={handleNextRound}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-lg flex items-center space-x-2 border-b-4 border-amber-800 active:translate-y-1 active:border-b-0"
            >
              <SkipForward className="w-5 h-5" />
              <span>ไปยังข้อถัดไป</span>
            </button>
          )}

          <button
            onClick={handleCloseRoom}
            className="px-6 py-3 bg-rose-700 hover:bg-rose-600 text-white rounded-xl font-bold text-lg flex items-center space-x-2 border-b-4 border-rose-900 active:translate-y-1 active:border-b-0 ml-auto"
          >
            <XSquare className="w-5 h-5" />
            <span>ปิดห้องเรียน</span>
          </button>
        </footer>
      ) : (
        <footer className="relative z-10 w-full py-2.5 bg-black/60 border-t border-amber-900/60 flex justify-between items-center px-4 text-xs text-amber-300/70">
          <span>NucMed Arena • Classroom Spotlight View</span>
          <span>กด F11 บนคีย์บอร์ดเพื่อเปิดโหมดเต็มหน้าจอ</span>
        </footer>
      )}
    </div>
  );
}
