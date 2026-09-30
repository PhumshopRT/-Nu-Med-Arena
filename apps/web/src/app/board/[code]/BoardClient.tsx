"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Clock, Users, Play, SkipForward, XSquare, CheckCircle, XCircle, UserPlus 
} from "lucide-react";
import { 
  ALL_CASE_CARDS, CaseCard, PublicRoomState, PublicPlayer, ALL_RP_CARDS, ALL_MECH_CARDS, StudentUser,
  gradeAnswer, BOTS, simulateBotAnswer, upsertRoomPlayer
} from "@nucmed/shared";
import { getPlayableCaseCards, getPlayableRpCards } from "@/lib/cards";
import { CaseCard as CaseCardComponent } from "@/components/cards/CaseCard";
import { getRememberedUser, getLocalUser } from "@/lib/user";
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
  
  const [user, setUser] = useState<StudentUser | null>(null);
  const syncRef = useRef<RoomSyncHandle | null>(null);
  const roomRef = useRef<PublicRoomState | null>(null);
  const revealedRoundRef = useRef<number | null>(null);
  const advancingRoundRef = useRef<number | null>(null);
  const advanceRoundHandlerRef = useRef<() => void>(() => {});
  roomRef.current = room;

  const isHost = Boolean(
    (user && room && room.hostId === `p_${user.studentId}`) ||
    (room && (room.hostId === "host_board" || !room.hostId))
  );

  useEffect(() => {
    const localUser = getRememberedUser() || getLocalUser();
    setUser(localUser);

    // 1. Initially load room from local storage or create fallback if opening board directly
    let activeRoom: PublicRoomState;
    const hostId = localUser ? `p_${localUser.studentId}` : "host_board";
    try {
      const saved = localStorage.getItem(`nucmed_room_${roomCode}`);
      if (saved) {
        activeRoom = JSON.parse(saved);
        activeRoom.settings = {
          ...activeRoom.settings,
          maxPlayers: 55,
          spotlightMode: activeRoom.settings?.spotlightMode || "big-card",
        };
        if (!activeRoom.hostId) {
          activeRoom.hostId = hostId;
        }
        // CRITICAL: Teacher is the Host/Presenter, NOT a player. Remove host from players list!
        activeRoom.players = (activeRoom.players || []).filter(
          (p) => p.id !== activeRoom.hostId && p.id !== hostId && (!localUser || p.studentId !== localUser.studentId)
        );
      } else {
        activeRoom = {
          code: roomCode,
          hostId,
          phase: "LOBBY",
          roundIndex: 1,
          totalRounds: 10,
          caseCardId: ALL_CASE_CARDS[0]?.id || null,
          clueCardId: null,
          sharedMechanisms: [],
          endsAt: 0,
          players: [], // Teacher is presenter only, players are students
          settings: {
            totalRounds: 10,
            thinkSeconds: 30,
            basicCount: 5,
            clinicalCount: 5,
            hintAtPercent: 50,
            swapEvery: 3,
            maxPlayers: 55,
            minPlayersToStart: 1,
            allowBots: false,
            spotlightMode: "big-card"
          }
        };
      }
    } catch {
      activeRoom = {
        code: roomCode,
        hostId,
        phase: "LOBBY",
        roundIndex: 1,
        totalRounds: 10,
        caseCardId: ALL_CASE_CARDS[0]?.id || null,
        clueCardId: null,
        sharedMechanisms: [],
        endsAt: 0,
        players: [],
        settings: {
          totalRounds: 10,
          thinkSeconds: 30,
          basicCount: 5,
          clinicalCount: 5,
          hintAtPercent: 50,
          swapEvery: 3,
          maxPlayers: 55,
          minPlayersToStart: 1,
          allowBots: false,
          spotlightMode: "big-card"
        }
      };
    }

    setRoom(activeRoom);
    roomRef.current = activeRoom;
    setTimeLeft(activeRoom.settings?.thinkSeconds || 30);
    const cid = activeRoom.caseCardId;
    const foundCase = ALL_CASE_CARDS.find(c => c.id === cid);
    if (foundCase) setCurrentCase(foundCase);
    localStorage.setItem(`nucmed_room_${roomCode}`, JSON.stringify(activeRoom));
  }, [roomCode]);

  useEffect(() => {
    const handleSync = (msg: SyncMessage) => {
      const currentRoom = roomRef.current;
      
      switch (msg.type) {
        case "ROOM_STATE_SYNC":
          if (msg.room) {
            roomRef.current = msg.room;
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
        case "REQUEST_ROOM_STATE":
        case "PLAYER_JOIN":
          if (isHost && currentRoom) {
            // Teacher/Host must never be added as a player
            if (msg.player.id === currentRoom.hostId || (user && msg.player.studentId === user.studentId)) {
              break;
            }
            let updated = currentRoom;
            const nextPlayers = upsertRoomPlayer(
              currentRoom.players,
              msg.player,
              55
            );
            if (nextPlayers !== currentRoom.players) {
              updated = { ...currentRoom, players: nextPlayers };
              roomRef.current = updated;
              setRoom(updated);
              localStorage.setItem(`nucmed_room_${roomCode}`, JSON.stringify(updated));
            }
            // Authoritative response from Board/Host to newly connected student
            syncRef.current?.publish({ type: "ROOM_STATE_SYNC", room: updated });
          }
          break;
        case "PLAYER_LOCK":
          if (isHost && currentRoom) {
            const updatedPlayers = currentRoom.players.map(p => 
              (p.id === msg.playerId || p.studentId === msg.playerId.replace(/^p_/, ""))
                ? { 
                    ...p, 
                    locked: msg.locked,
                    selectedRpId: msg.answer?.rpId || p.selectedRpId,
                    selectedMechIds: msg.answer?.mechIds || (msg.answer?.mechId ? [msg.answer.mechId] : p.selectedMechIds),
                    selectedMechId: msg.answer?.mechIds?.[0] || msg.answer?.mechId || p.selectedMechId
                  }
                : p
            );
            const updated = { ...currentRoom, players: updatedPlayers };
            saveAndBroadcast(updated);
          }
          break;
        case "PLAYER_SCORE_UPDATE":
          if (isHost && currentRoom) {
            const updatedPlayers = currentRoom.players.map(p => 
              (p.id === msg.playerId || p.studentId === msg.playerId.replace(/^p_/, ""))
                ? { ...p, score: msg.score, streak: msg.streak }
                : p
            );
            const updated = { ...currentRoom, players: updatedPlayers };
            saveAndBroadcast(updated);
          }
          break;
      }
    };

    const sync = createRoomSync(roomCode, handleSync);
    syncRef.current = sync;
    
    // Request initial state if guest
    if (user && roomRef.current?.hostId !== `p_${user.studentId}` && roomRef.current?.hostId !== "host_board") {
      sync.publish({ type: "REQUEST_ROOM_STATE", player: { id: `p_${user.studentId}`, name: user.displayName, studentId: user.studentId, ready: true, locked: false, score: 0, handCount: 5, avatar: "👨‍🎓" } });
    }

    return () => sync.destroy();
  }, [roomCode, isHost, user]);

  const saveAndBroadcast = (updated: PublicRoomState) => {
    roomRef.current = updated;
    setRoom(updated);
    localStorage.setItem(`nucmed_room_${roomCode}`, JSON.stringify(updated));
    syncRef.current?.publish({ type: "ROOM_STATE_SYNC", room: updated });
  };

  // Timer loop for THINK phase
  useEffect(() => {
    if (!room || room.phase !== "THINK") return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 10 && prev > 1) {
          sounds.playUrgentTick(1 + (10 - prev) * 0.08);
        } else if (prev > 10 && prev % 2 === 0) {
          sounds.playTick();
        }

        // Simulate bots locking over time on the host board
        if (isHost && roomRef.current) {
          simulateBoardBots(prev);
        }

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

  // Simulate bots answering on the board
  const simulateBoardBots = (currentSeconds: number) => {
    const currentRoom = roomRef.current;
    if (!currentRoom || !isHost) return;

    let hasChanges = false;
    const updatedPlayers = currentRoom.players.map(p => {
      const isBot = p.id.startsWith("bot_") || p.studentId.startsWith("BOT-");
      if (isBot && !p.locked) {
        // Bots lock randomly around 10-25s remaining
        const shouldLock = Math.random() < 0.18 || currentSeconds < 10;
        if (shouldLock) {
          hasChanges = true;
          const botTemplate = BOTS.find(b => b.avatar === p.avatar) || BOTS[0];
          const botAns = simulateBotAnswer(botTemplate, currentCase, ALL_RP_CARDS);
          return {
            ...p,
            locked: true,
            selectedRpId: botAns.rpId,
            selectedMechId: botAns.mechId
          };
        }
      }
      return p;
    });

    if (hasChanges) {
      const updated = { ...currentRoom, players: updatedPlayers };
      saveAndBroadcast(updated);
    }
  };

  const handleAddBot = () => {
    if (!room || !isHost) return;
    sounds.playClick();
    const idx = room.players.length;
    const botTemplate = BOTS[idx % BOTS.length];
    const newBot: PublicPlayer = {
      id: `bot_${Date.now()}_${idx}`,
      name: `${botTemplate.name}`,
      studentId: `BOT-${Math.floor(100 + Math.random() * 900)}`,
      ready: true,
      locked: false,
      score: 0,
      handCount: 5,
      avatar: botTemplate.avatar,
      isBot: true
    };
    const updated = {
      ...room,
      players: [...room.players, newBot]
    };
    saveAndBroadcast(updated);
  };

  // Play fanfare when entering REVEAL phase (Podium)
  useEffect(() => {
    if (room?.phase === "REVEAL") {
      sounds.playPodiumFanfare();
    }
  }, [room?.phase]);

  // Host Controls
  const handleStartRound = () => {
    if (!room || !isHost) return;
    sounds.playWin();
    
    // Pick next case
    const playableCases = getPlayableCaseCards();
    const casePool = playableCases.length > 0 ? playableCases : ALL_CASE_CARDS;
    const nextCase = casePool[(room.roundIndex - 1) % casePool.length];
    setCurrentCase(nextCase);
    
    // Reset players lock status and previous selections
    const resetPlayers = room.players.map(p => ({ 
      ...p, 
      locked: false,
      selectedRpId: undefined,
      selectedMechId: undefined,
      selectedMechIds: undefined
    }));
    
    revealedRoundRef.current = null;
    advancingRoundRef.current = null;
    const updated: PublicRoomState = {
      ...room,
      phase: "THINK",
      caseCardId: nextCase.id,
      endsAt: Date.now() + (room.settings.thinkSeconds || 30) * 1000,
      players: resetPlayers
    };
    setTimeLeft(room.settings.thinkSeconds || 30);
    saveAndBroadcast(updated);
    syncRef.current?.publish({ type: "ROUND_ADVANCE", roundIndex: room.roundIndex, caseId: nextCase.id });
  };

  const handleReveal = () => {
    const activeRoom = roomRef.current;
    if (!activeRoom || !isHost || activeRoom.phase !== "THINK" || revealedRoundRef.current === activeRoom.roundIndex) return;
    revealedRoundRef.current = activeRoom.roundIndex;
    sounds.playSelect();
    
    // Ensure all bots lock & grade bots on the board
    const updatedPlayers = activeRoom.players.map(p => {
      const isBot = p.id.startsWith("bot_") || p.studentId.startsWith("BOT-");
      if (isBot) {
        let rpId = p.selectedRpId;
        let mechId: string | string[] = p.selectedMechIds?.length ? p.selectedMechIds : p.selectedMechId || "";
        if (!p.locked || !rpId || !mechId) {
          const botTemplate = BOTS.find(b => b.avatar === p.avatar) || BOTS[0];
          const botAns = simulateBotAnswer(botTemplate, currentCase, ALL_RP_CARDS);
          rpId = botAns.rpId;
          mechId = botAns.mechId;
        }
        const activeCase = ALL_CASE_CARDS.find((card) => card.id === activeRoom.caseCardId) || currentCase;
        const grading = gradeAnswer(activeCase, rpId || "", mechId || "", false);
        const pts = grading.scoreAwarded;
        const nextStreak = pts > 0 ? ((p.streak || 0) + 1) : 0;
        return {
          ...p,
          locked: true,
          score: p.score + pts,
          streak: nextStreak,
          selectedRpId: rpId,
          selectedMechId: Array.isArray(mechId) ? mechId[0] : mechId,
          selectedMechIds: Array.isArray(mechId) ? mechId : [mechId]
        };
      }
      return p;
    });

    const updated: PublicRoomState = {
      ...activeRoom,
      phase: "REVEAL",
      players: updatedPlayers
    };
    saveAndBroadcast(updated);
    syncRef.current?.publish({ type: "ROUND_REVEAL", roundIndex: activeRoom.roundIndex, caseId: activeRoom.caseCardId || currentCase.id });
  };
  
  const handleNextRound = () => {
    const activeRoom = roomRef.current;
    if (!activeRoom || !isHost || activeRoom.phase !== "REVEAL" || advancingRoundRef.current === activeRoom.roundIndex) return;
    advancingRoundRef.current = activeRoom.roundIndex;
    sounds.playClick();
    if (activeRoom.roundIndex >= activeRoom.totalRounds) {
      const finished = { ...activeRoom, phase: "RESULT" as const, endsAt: 0 };
      saveAndBroadcast(finished);
      syncRef.current?.publish({ type: "MATCH_FINISH", roundIndex: activeRoom.roundIndex });
      return;
    }

    const nextRoundIndex = activeRoom.roundIndex + 1;
    const playableCases = getPlayableCaseCards();
    const casePool = playableCases.length > 0 ? playableCases : ALL_CASE_CARDS;
    const nextCase = casePool[(nextRoundIndex - 1) % casePool.length];
    const nextPlayers = activeRoom.players.map((player) => ({
      ...player,
      locked: false,
      selectedRpId: undefined,
      selectedMechId: undefined,
      selectedMechIds: undefined,
      lastAnswerResult: undefined,
    }));
    const updated: PublicRoomState = {
      ...activeRoom,
      phase: "THINK",
      roundIndex: nextRoundIndex,
      caseCardId: nextCase.id,
      endsAt: Date.now() + (activeRoom.settings.thinkSeconds || 30) * 1000,
      players: nextPlayers,
    };
    setCurrentCase(nextCase);
    setTimeLeft(activeRoom.settings.thinkSeconds || 30);
    revealedRoundRef.current = null;
    advancingRoundRef.current = null;
    saveAndBroadcast(updated);
    syncRef.current?.publish({ type: "ROUND_ADVANCE", roundIndex: nextRoundIndex, caseId: nextCase.id });
  };

  advanceRoundHandlerRef.current = handleNextRound;

  // Keep the projector advancing like a quiz show without requiring two host clicks.
  useEffect(() => {
    if (!isHost || room?.phase !== "REVEAL") return;
    const timer = setTimeout(() => advanceRoundHandlerRef.current(), 5000);
    return () => clearTimeout(timer);
  }, [isHost, room?.phase, room?.roundIndex]);

  // Check if everyone locked
  useEffect(() => {
    if (!room || !isHost) return;
    const pList = room.players || [];
    const total = pList.length;
    const locked = pList.filter(p => p.locked).length;
    if (room.phase === "THINK" && total > 0 && locked >= total) {
      handleReveal();
    }
  }, [room?.players, room?.phase, isHost]);

  const handleCloseRoom = () => {
    if (!room || !isHost) return;
    sounds.playWrong();
    localStorage.removeItem(`nucmed_room_${roomCode}`);
    router.push("/");
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-200 font-game">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xl font-bold">กำลังเชื่อมต่อกระดานห้องเรียน...</p>
      </div>
    );
  }

  const players = room.players || [];
  const rankedPlayers = [...players].sort((a, b) => b.score - a.score);
  const lockedCount = players.filter(p => p.locked).length;
  const totalPlayers = players.length;
  const maxLimit = 55;
  const displayMode = room.settings.spotlightMode || "big-card";

  const correctRps = ALL_RP_CARDS.filter(r => currentCase.acceptedRpIds.includes(r.id));
  const correctRp = correctRps[0];
  const correctMechs = ALL_MECH_CARDS.filter(m => currentCase.acceptedMechIds.includes(m.id));
  const correctMech = correctMechs[0];

  return (
    <div className="relative isolate min-h-screen bg-[#07131f] text-[#f6f0de] flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden font-game">
      {/* Background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(32,77,86,0.48),transparent_55%),linear-gradient(135deg,#07131f_0%,#0a1d2a_52%,#07131f_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none opacity-[0.07] [background-image:linear-gradient(rgba(188,218,207,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(188,218,207,.3)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Header */}
      <header className="relative z-10 w-full flex flex-wrap justify-between items-center gap-4 overflow-hidden bg-[#132a35]/90 border border-[#d79b35]/40 p-4 sm:p-5 rounded-[1.75rem] shadow-[0_18px_60px_rgba(0,0,0,.28)] backdrop-blur-xl">
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[#f5b942]" />
        <div className="flex min-w-0 items-center space-x-4">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#f5b942] border border-[#ffe08a]/70 flex items-center justify-center text-2xl shadow-[0_0_28px_rgba(245,185,66,.23)]">
            ☢️
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-xl sm:text-2xl text-[#fff0bd] tracking-wide">NucMed Arena</h1>
            <p className="text-xs sm:text-sm font-bold tracking-[.12em] text-[#9db4b9] mt-0.5">จอฉายห้องเรียน</p>
          </div>
          <div className="hidden h-10 w-px bg-white/10 sm:block" />
          <div className="hidden sm:block">
            <div className="text-[11px] font-bold text-[#9db4b9]">รหัสเข้าร่วม</div>
            <div className="font-mono text-xl font-black tracking-[.18em] text-white">{roomCode}</div>
          </div>
        </div>

        {/* Big Timer */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="rounded-xl border border-[#58d6c6]/25 bg-[#071a24]/70 px-3 py-2 text-right sm:px-4">
            <div className="text-[10px] font-bold text-[#8fa9ae] sm:text-xs">ผู้เล่น</div>
            <div className="font-mono text-lg font-black leading-none text-[#58d6c6] sm:text-xl">{totalPlayers}<span className="text-[#82999e]">/{maxLimit}</span></div>
          </div>
          {room.phase === "THINK" && (
            <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 sm:px-4 ${timeLeft <= 10 ? "border-rose-400/60 bg-rose-950/60" : "border-[#f5b942]/40 bg-[#302719]/70"}`}>
              <Clock className={`w-5 h-5 ${timeLeft <= 10 ? "text-rose-300" : "text-[#f5b942]"}`} />
              <span className={`font-mono font-black text-2xl ${timeLeft <= 10 ? "text-rose-200" : "text-[#ffe08a]"}`}>
                {timeLeft}<span className="ml-0.5 text-xs">วิ</span>
              </span>
            </div>
          )}

          <div className="bg-[#071a24]/70 border border-white/10 px-3 sm:px-4 py-2 rounded-xl text-center">
            <div className="text-[10px] text-[#8fa9ae] font-bold">รอบ</div>
            <div className="font-mono font-black text-xl text-[#fff0bd]">
              {room.roundIndex}<span className="text-[#82999e]">/{room.totalRounds}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Center Arena */}
      
      <main className="relative z-10 flex-1 flex flex-col w-full min-h-0 p-2 sm:p-4 lg:p-6">
        {(room.phase === "LOBBY" || room.phase === "DEAL" || room.phase === "SHOW_CASE") ? (
          <div className="grid flex-1 items-stretch gap-5 lg:grid-cols-[1.12fr_.88fr] lg:gap-7">
            <section className="relative flex min-h-[340px] flex-col justify-center overflow-hidden rounded-[2rem] border border-[#f5b942]/45 bg-[#0b1b25]/90 p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,.3)] sm:p-10 lg:min-h-[500px] lg:p-14">
              <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#f5b942]/10 shadow-[0_0_0_28px_rgba(245,185,66,.025),0_0_0_60px_rgba(245,185,66,.02)]" />
              <div className="relative mx-auto mb-6 flex items-center gap-2 rounded-full border border-[#58d6c6]/25 bg-[#58d6c6]/[0.07] px-4 py-2 text-sm font-bold text-[#8ce6d9]">
                <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#58d6c6] opacity-50 motion-reduce:animate-none" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#58d6c6]" /></span>
                ห้องพร้อมรับผู้เล่น
              </div>
              <h2 className="relative text-xl font-bold text-[#b4c5c2] sm:text-2xl">เข้าร่วมเกมด้วยรหัสนี้</h2>
              <div className="relative mx-auto mt-5 flex max-w-full items-center justify-center gap-1.5 sm:gap-3" aria-label={`รหัสห้อง ${roomCode}`}>
                {roomCode.split("").map((digit, index) => (
                  <span key={`${digit}-${index}`} className="grid h-[clamp(3.6rem,11vw,7.8rem)] w-[clamp(2.5rem,9vw,6.4rem)] place-items-center rounded-xl border border-[#f5b942]/55 bg-[linear-gradient(160deg,rgba(245,185,66,.15),rgba(13,29,38,.92)_55%)] font-mono text-[clamp(2.2rem,8vw,5.8rem)] font-black leading-none text-white shadow-[inset_0_1px_rgba(255,255,255,.12),0_12px_30px_rgba(0,0,0,.2)] sm:rounded-2xl">{digit}</span>
                ))}
              </div>
              <div className="relative mt-5 text-sm font-semibold text-[#8fa9ae] sm:text-base">แชร์รหัสนี้กับนักศึกษา · รองรับสูงสุด 55 คน</div>
              {isHost && players.length < (room.settings?.maxPlayers || 55) && (
                <button onClick={handleAddBot} className="relative mx-auto mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#f5b942]/25 bg-[#172c35] px-4 py-2 text-sm font-bold text-[#d6c99f] transition-colors hover:border-[#f5b942]/60 hover:bg-[#203943] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58d6c6]">
                  <UserPlus className="h-4 w-4" /><span>เพิ่มบอททดสอบ</span>
                </button>
              )}
            </section>

            <section className="flex min-h-[280px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#10232e]/90 shadow-[0_24px_80px_rgba(0,0,0,.24)] lg:min-h-[500px]">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#58d6c6]/10 text-[#58d6c6]"><Users className="h-5 w-5" /></div>
                  <div><h3 className="text-lg font-black text-[#f6f0de] sm:text-xl">ผู้เล่นในห้อง</h3><p className="text-xs text-[#91a8ad] sm:text-sm">รายชื่อจะแสดงเมื่อเข้าร่วม</p></div>
                </div>
                <div className="font-mono text-2xl font-black text-[#58d6c6]">{totalPlayers}<span className="text-base text-[#789198]"> / 55</span></div>
              </div>
              {totalPlayers === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="mb-4 grid h-20 w-20 place-items-center rounded-full border border-[#58d6c6]/20 bg-[#58d6c6]/[0.06] text-4xl">🧑‍⚕️</div>
                  <p className="text-lg font-bold text-[#d4dfd9]">รอเพื่อนร่วมชั้นเข้ามา</p>
                  <p className="mt-1 text-sm text-[#82999e]">แชร์รหัสห้องเพื่อเริ่มรวมทีม</p>
                </div>
              ) : (
                <div className="grid max-h-[52vh] flex-1 content-start grid-cols-1 gap-2 overflow-y-auto p-4 custom-scrollbar sm:grid-cols-2 sm:p-5 lg:grid-cols-1 xl:grid-cols-2">
                  {players.map((p, index) => (
                    <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} key={p.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-[#071a24]/60 px-3 py-2.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-xl">{p.avatar || "👨‍🎓"}</span>
                      <span className="min-w-0 flex-1 truncate font-bold text-[#e8e8dc]">{p.name}</span>
                      <span className="font-mono text-xs text-[#6e8c92]">{String(index + 1).padStart(2, "0")}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : room.phase === "REVEAL" || room.phase === "RESULT" ? (
          <div className="flex flex-col w-full h-full items-center">
            <div className="w-full flex justify-between items-start mb-8">
               <div className="bg-emerald-950/90 border-4 border-emerald-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center max-w-2xl">
                  <div className="text-center mb-4">
                    <h3 className="text-emerald-300 text-2xl font-black uppercase tracking-widest">คำตอบที่ถูกต้อง</h3>
                    <p className="text-xs text-emerald-200/90 font-bold mt-1">ถูกทั้งคู่ (การ์ดฟ้า + กลไก) ได้คะแนนเต็ม • ถูกเฉพาะกลไก (การ์ดเหลือง) ได้ครึ่งคะแนน • กลไกผิดได้ 0 คะแนน</p>
                  </div>
                  <div className="flex items-center justify-center space-x-6 w-full">
                    <div className="flex-1 bg-black/50 rounded-2xl p-6 text-center border-2 border-emerald-800">
                      <div className="text-emerald-500 text-sm font-bold mb-2">สารเภสัชรังสี (การ์ดสีฟ้า)</div>
                      <div className="text-white font-black text-2xl">
                        {correctRps.length > 1
                          ? correctRps.map((r) => r.titleTh).join(" หรือ ")
                          : (correctRp?.titleTh || currentCase.acceptedRpIds[0])}
                      </div>
                    </div>
                    <div className="flex-1 bg-black/50 rounded-2xl p-6 text-center border-2 border-emerald-800">
                      <div className="text-emerald-500 text-sm font-bold mb-2">กลไกที่ยอมรับ (การ์ดสีส้ม)</div>
                      <div className="text-white font-black text-2xl">
                        {correctMechs.length > 1
                          ? correctMechs.map((m) => m.titleTh).join(" หรือ ")
                          : (correctMech?.titleTh || currentCase.acceptedMechIds[0])}
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Podium */}
            <div className="flex-1 flex flex-col items-center justify-end w-full max-w-5xl mt-auto pb-10">
              <h2 className="text-4xl text-amber-300 font-black mb-10 drop-shadow-lg">{room.phase === "RESULT" ? "จบการแข่งขัน • สรุปอันดับ" : "สรุปอันดับ (LEADERBOARD)"}</h2>
              <div className="flex items-end justify-center space-x-4 h-64 w-full">
                {/* 2nd Place */}
                {players.length > 1 && (
                  <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center justify-end w-1/3 max-w-[200px]">
                    <div className="text-4xl mb-2">{[...players].sort((a,b)=>b.score-a.score)[1].avatar || "👨‍🎓"}</div>
                    <div className="font-bold text-white text-xl truncate w-full text-center px-2">{[...players].sort((a,b)=>b.score-a.score)[1].name}</div>
                    <div className="font-mono text-amber-300 font-bold mb-4 flex items-center space-x-1">
                      <span>{[...players].sort((a,b)=>b.score-a.score)[1].score} PTS</span>
                      {Boolean(([...players].sort((a,b)=>b.score-a.score)[1].streak || 0) >= 2) && (
                        <span className="text-xs bg-rose-600 text-white px-1.5 py-0.5 rounded-full border border-rose-300 font-sans shadow-md animate-pulse">
                          🔥x{[...players].sort((a,b)=>b.score-a.score)[1].streak}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-40 bg-slate-300 rounded-t-xl border-t-8 border-slate-400 flex justify-center pt-4 shadow-2xl relative overflow-hidden">
                       <span className="text-5xl font-black text-slate-500">2</span>
                       <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                    </div>
                  </motion.div>
                )}

                {/* 1st Place */}
                {players.length > 0 && (
                  <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center justify-end w-1/3 max-w-[220px] z-10">
                    <div className="absolute -top-12 animate-bounce"><Trophy className="w-12 h-12 text-yellow-400" /></div>
                    <div className="text-5xl mb-2">{[...players].sort((a,b)=>b.score-a.score)[0].avatar || "👨‍🎓"}</div>
                    <div className="font-bold text-white text-2xl truncate w-full text-center px-2 drop-shadow-md">{[...players].sort((a,b)=>b.score-a.score)[0].name}</div>
                    <div className="font-mono text-yellow-300 font-black mb-4 text-lg flex items-center space-x-1.5">
                      <span>{[...players].sort((a,b)=>b.score-a.score)[0].score} PTS</span>
                      {Boolean(([...players].sort((a,b)=>b.score-a.score)[0].streak || 0) >= 2) && (
                        <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full border border-rose-300 font-sans shadow-md animate-pulse">
                          🔥x{[...players].sort((a,b)=>b.score-a.score)[0].streak}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-56 bg-yellow-400 rounded-t-xl border-t-8 border-yellow-200 flex justify-center pt-4 shadow-[0_0_40px_rgba(250,204,21,0.5)] relative overflow-hidden">
                       <span className="text-6xl font-black text-yellow-700">1</span>
                       <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
                    </div>
                  </motion.div>
                )}

                {/* 3rd Place */}
                {players.length > 2 && (
                  <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0 }} className="flex flex-col items-center justify-end w-1/3 max-w-[180px]">
                    <div className="text-4xl mb-2">{[...players].sort((a,b)=>b.score-a.score)[2].avatar || "👨‍🎓"}</div>
                    <div className="font-bold text-white text-lg truncate w-full text-center px-2">{[...players].sort((a,b)=>b.score-a.score)[2].name}</div>
                    <div className="font-mono text-orange-300 font-bold mb-4 flex items-center space-x-1">
                      <span>{[...players].sort((a,b)=>b.score-a.score)[2].score} PTS</span>
                      {Boolean(([...players].sort((a,b)=>b.score-a.score)[2].streak || 0) >= 2) && (
                        <span className="text-xs bg-rose-600 text-white px-1.5 py-0.5 rounded-full border border-rose-300 font-sans shadow-md animate-pulse">
                          🔥x{[...players].sort((a,b)=>b.score-a.score)[2].streak}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-32 bg-orange-600 rounded-t-xl border-t-8 border-orange-400 flex justify-center pt-4 shadow-2xl relative overflow-hidden">
                       <span className="text-5xl font-black text-orange-900">3</span>
                       <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-12 gap-8 items-center w-full h-full">
            {/* Left: Case Display */}
            <div className="col-span-12 lg:col-span-7 flex flex-col items-center justify-center h-full">
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

                {/* Status */}
                {room.phase === "THINK" && (
                  <div className="mt-8 bg-amber-950/80 border-2 border-amber-600 px-8 py-3 rounded-2xl flex items-center space-x-4 shadow-xl">
                    <Users className="w-6 h-6 text-emerald-400" />
                    <span className="font-black text-xl text-amber-100">
                      ส่งคำตอบแล้ว: <strong className="text-emerald-400">{lockedCount} / {Math.max(players.length, 1)}</strong> คน
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Leaderboard (THINK Phase) */}
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
                  {rankedPlayers
                    .slice(0, 55)
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
          </div>
        )}
      </main>


      {/* Host Controls Footer */}
      {isHost ? (
        <footer className="relative z-20 w-full py-4 bg-[#10232e]/95 border-t border-white/10 flex flex-wrap justify-center items-center px-4 sm:px-6 gap-3 sm:gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
          {(room.phase === "LOBBY" || room.phase === "DEAL" || room.phase === "SHOW_CASE" || room.phase === "NEXT_CASE") && (
            <button
              onClick={handleStartRound}
              className="px-7 py-3 bg-[#188f77] hover:bg-[#20a78a] text-white rounded-xl font-bold text-lg flex items-center space-x-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58d6c6]"
            >
              <Play className="w-5 h-5" />
              <span>เริ่มจับเวลาข้อ {room.roundIndex}</span>
            </button>
          )}

          {room.phase === "THINK" && (
            <button
              onClick={handleReveal}
              className="px-7 py-3 bg-[#1a3440] hover:bg-[#234653] text-[#ffe08a] rounded-xl font-bold text-lg flex items-center space-x-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58d6c6]"
            >
              <SkipForward className="w-5 h-5" />
              <span>ข้ามไปดูเฉลย</span>
            </button>
          )}

          {room.phase === "REVEAL" && (
            <button
              onClick={handleNextRound}
              className="px-7 py-3 bg-[#b88222] hover:bg-[#cf982f] text-white rounded-xl font-bold text-lg flex items-center space-x-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58d6c6]"
            >
              <SkipForward className="w-5 h-5" />
              <span>{room.roundIndex >= room.totalRounds ? "ดูผลการแข่งขัน" : "ไปข้อถัดไป"}</span>
            </button>
          )}

          <button
            onClick={handleCloseRoom}
            className="px-5 py-3 bg-rose-950/50 hover:bg-rose-900/70 border border-rose-300/20 text-rose-200 rounded-xl font-bold text-lg flex items-center space-x-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 sm:ml-auto"
          >
            <XSquare className="w-5 h-5" />
            <span>ปิดห้องเรียน</span>
          </button>
        </footer>
      ) : (
        <footer className="relative z-10 w-full py-2.5 bg-[#071a24]/70 border-t border-white/[0.08] flex justify-between items-center px-2 sm:px-4 text-[11px] sm:text-xs text-[#789198]">
          <span>NucMed Arena · จอฉายห้องเรียน</span>
          <span>กด F11 บนคีย์บอร์ดเพื่อเปิดโหมดเต็มหน้าจอ</span>
        </footer>
      )}
    </div>
  );
}
