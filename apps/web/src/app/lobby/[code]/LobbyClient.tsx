"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Clock,
  Play, 
  Copy, 
  Check, 
  QrCode, 
  Bot, 
  Settings, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  MessageSquare,
  Shield,
  Sparkles,
  Trash2,
  Share2,
  Crown,
  Wifi,
  WifiOff
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { 
  PublicPlayer, 
  PublicRoomState, 
  DEFAULT_ROOM_SETTINGS, 
  BOTS, 
  StudentUser 
} from "@nucmed/shared";
import { 
  getLocalUser, 
  getNaEquipped, 
  getAvatarIcon, 
  getTitleBadge, 
  getFrameStyle 
} from "@/lib/user";
import { sounds } from "@/lib/sound";
import { createRoomSync, RoomSyncHandle, SyncMessage } from "@/lib/sync";

export function LobbyClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Support both /lobby/?code=XYZ and /lobby/XYZ
  const modeParam = searchParams?.get("mode");
  const isExplicitTable = modeParam === "table";
  const rawCode = (searchParams?.get("code") || params?.code || (isExplicitTable ? "TABLE1" : "582914")) as string;
  const roomCode = rawCode.toUpperCase();

  const [user, setUser] = useState<StudentUser | null>(null);
  const [room, setRoom] = useState<PublicRoomState | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeReactions, setActiveReactions] = useState<{ id: string; playerId: string; emoji: string }[]>([]);
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; avatar?: string }[]>([]);
  const [customChat, setCustomChat] = useState("");
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  const syncRef = useRef<RoomSyncHandle | null>(null);
  const roomRef = useRef<PublicRoomState | null>(null);
  roomRef.current = room;

  const isKahootMode = !isExplicitTable && (
    Boolean(room?.settings?.spotlightMode) ||
    (Boolean(room?.settings?.maxPlayers) && (room?.settings?.maxPlayers ?? 0) > 6) ||
    modeParam === "kahoot" ||
    /^\d{5,8}$/.test(roomCode) ||
    roomCode.startsWith("ROOM")
  );

  const isHost = Boolean(user && room && room.hostId === `p_${user.studentId}`);
  const myPlayer = room?.players.find((p) => p.studentId === user?.studentId);

  // Computed invite URL
  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname.startsWith("/RTGAME") ? "/RTGAME" : ""}/lobby/?code=${roomCode}${isKahootMode ? "&mode=kahoot" : "&mode=table"}`
    : `https://masterphum07-web.github.io/RTGAME/lobby/?code=${roomCode}${isKahootMode ? "&mode=kahoot" : "&mode=table"}`;

  // 1. Initialize user & initial room
  useEffect(() => {
    const localUser = getLocalUser();
    setUser(localUser);

    const isCreateIntent = searchParams?.get("create") === "true";
    const isKahootInit = !isExplicitTable && (modeParam === "kahoot" || roomCode.startsWith("ROOM"));
    const equipped = getNaEquipped();
    const myAvatar = getAvatarIcon(localUser.equipped?.avatar || equipped.avatar);
    const myTitle = getTitleBadge(localUser.equipped?.title || equipped.title);
    const myFrame = localUser.equipped?.frame || equipped.frame;

    const myPlayerInfo: PublicPlayer = {
      id: `p_${localUser.studentId}`,
      name: localUser.displayName,
      studentId: localUser.studentId,
      ready: true,
      locked: false,
      score: 0,
      handCount: 5,
      avatar: myAvatar,
      title: myTitle || undefined,
      frame: myFrame
    };

    const savedRoomKey = `nucmed_room_${roomCode}`;
    const saved = localStorage.getItem(savedRoomKey);

    let currentRoom: PublicRoomState;
    if (saved) {
      try {
        currentRoom = JSON.parse(saved);
        if (isKahootInit) {
          currentRoom.settings = {
            ...currentRoom.settings,
            maxPlayers: Math.max(currentRoom.settings?.maxPlayers || 0, 55),
            spotlightMode: currentRoom.settings?.spotlightMode || "big-card"
          };
        } else if (isExplicitTable) {
          currentRoom.settings = {
            ...currentRoom.settings,
            maxPlayers: 6,
            spotlightMode: undefined
          };
        }
        currentRoom.players = (currentRoom.players || []).map((p) => {
          if (p.studentId === localUser.studentId) {
            return {
              ...p,
              avatar: myAvatar,
              title: myTitle || p.title,
              frame: myFrame || p.frame
            };
          }
          return p;
        });
        const existingPlayer = currentRoom.players.find((p) => p.studentId === localUser.studentId);
        const maxCapacity = (currentRoom.settings.spotlightMode || (currentRoom.settings.maxPlayers && currentRoom.settings.maxPlayers > 6) || isKahootInit) ? 55 : (currentRoom.settings.maxPlayers || 6);
        if (!existingPlayer && currentRoom.players.length < maxCapacity) {
          currentRoom.players.push(myPlayerInfo);
        }
      } catch {
        currentRoom = createInitialRoom(roomCode, localUser, isCreateIntent, myAvatar, myTitle || undefined, myFrame, isKahootInit);
      }
    } else {
      currentRoom = createInitialRoom(roomCode, localUser, isCreateIntent, myAvatar, myTitle || undefined, myFrame, isKahootInit);
    }

    setRoom(currentRoom);
    localStorage.setItem(savedRoomKey, JSON.stringify(currentRoom));

    // 2. Setup Real-time Multi-device Synchronizer
    const handleSyncMessage = (msg: SyncMessage) => {
      switch (msg.type) {
        case "REQUEST_ROOM_STATE":
        case "PLAYER_JOIN": {
          const hostRoom = roomRef.current;
          if (!hostRoom) return;
          // Only host manages and broadcasts state updates to avoid conflicts
          const hostIsMe = hostRoom.hostId === `p_${localUser.studentId}`;
          if (hostIsMe) {
            const playerExists = hostRoom.players.some((p) => p.studentId === msg.player.studentId);
            let updatedRoom = hostRoom;
            const maxCapacity = (hostRoom.settings.spotlightMode || (hostRoom.settings.maxPlayers && hostRoom.settings.maxPlayers > 6) || isKahootInit) ? 55 : (hostRoom.settings.maxPlayers || 6);
            if (!playerExists && hostRoom.players.length < maxCapacity) {
              sounds.playClick();
              updatedRoom = {
                ...hostRoom,
                players: [...hostRoom.players, msg.player]
              };
              setRoom(updatedRoom);
              localStorage.setItem(`nucmed_room_${roomCode}`, JSON.stringify(updatedRoom));
            }
            // Always respond with current room state to keep newcomer synced
            syncRef.current?.publish({ type: "ROOM_STATE_SYNC", room: updatedRoom });
          }
          break;
        }

        case "ROOM_STATE_SYNC": {
          // If we receive authoritative room state from host, sync with it
          if (msg.room && msg.room.hostId) {
            setRoom((prev) => {
              // Ensure myself is retained in players if already present
              const hasMe = msg.room.players.some((p) => p.studentId === localUser.studentId);
              let finalRoom = msg.room;
              const maxCapacity = (msg.room.settings.spotlightMode || (msg.room.settings.maxPlayers && msg.room.settings.maxPlayers > 6) || isKahootInit) ? 55 : (msg.room.settings.maxPlayers || 6);
              if (!hasMe && msg.room.players.length < maxCapacity) {
                finalRoom = {
                  ...msg.room,
                  players: [...msg.room.players, myPlayerInfo]
                };
              }
              localStorage.setItem(`nucmed_room_${roomCode}`, JSON.stringify(finalRoom));
              return finalRoom;
            });
          }
          break;
        }

        case "PLAYER_READY": {
          setRoom((prev) => {
            if (!prev) return prev;
            const updated = {
              ...prev,
              players: prev.players.map((p) =>
                p.id === msg.playerId ? { ...p, ready: msg.ready } : p
              )
            };
            localStorage.setItem(`nucmed_room_${roomCode}`, JSON.stringify(updated));
            return updated;
          });
          break;
        }

        case "MATCH_START": {
          sounds.playWin();
          const targetMode = (roomRef.current?.settings.spotlightMode || (roomRef.current?.settings.maxPlayers && roomRef.current.settings.maxPlayers > 6) || isKahootInit) ? "kahoot" : "table";
          router.push(`/play/?code=${roomCode}&mode=${targetMode}`);
          break;
        }

        case "CHAT_MESSAGE": {
          sounds.playSelect();
          setChatMessages((prev) => [...prev.slice(-20), msg.message]);
          break;
        }

        case "EMOJI_REACTION": {
          sounds.playSelect();
          const reactionId = `rx_${Date.now()}_${Math.random()}`;
          setActiveReactions((prev) => [...prev, { id: reactionId, playerId: msg.playerId, emoji: msg.emoji }]);
          setTimeout(() => {
            setActiveReactions((prev) => prev.filter((r) => r.id !== reactionId));
          }, 3000);
          break;
        }
      }
    };

    const syncHandle = createRoomSync(roomCode, handleSyncMessage, (connected) => {
      setIsConnected(connected);
      if (connected) {
        // Send join and request room state once connected
        syncHandle.publish({ type: "PLAYER_JOIN", player: myPlayerInfo });
        syncHandle.publish({ type: "REQUEST_ROOM_STATE", player: myPlayerInfo });
      }
    });
    syncRef.current = syncHandle;

    // Immediately queue initial broadcast
    syncHandle.publish({ type: "PLAYER_JOIN", player: myPlayerInfo });
    syncHandle.publish({ type: "REQUEST_ROOM_STATE", player: myPlayerInfo });

    // Periodic Heartbeat: Host broadcasts state, Guest requests state
    const syncInterval = setInterval(() => {
      const activeRoom = roomRef.current;
      if (!activeRoom) return;
      const hostIsMe = activeRoom.hostId === `p_${localUser.studentId}`;
      if (hostIsMe) {
        syncHandle.publish({ type: "ROOM_STATE_SYNC", room: activeRoom });
      } else {
        syncHandle.publish({ type: "REQUEST_ROOM_STATE", player: myPlayerInfo });
      }
    }, 3500);

    return () => {
      clearInterval(syncInterval);
      syncHandle.destroy();
    };
  }, [roomCode, router]);

  const createInitialRoom = (
    code: string,
    host: StudentUser,
    isHostRole: boolean = true,
    avatar: string = "☢️",
    title?: string,
    frame?: string,
    isKahoot: boolean = false
  ): PublicRoomState => {
    return {
      code,
      hostId: isHostRole ? `p_${host.studentId}` : "",
      phase: "LOBBY",
      roundIndex: 1,
      totalRounds: 10,
      caseCardId: null,
      clueCardId: null,
      sharedMechanisms: [],
      endsAt: 0,
      settings: {
        ...DEFAULT_ROOM_SETTINGS,
        maxPlayers: isKahoot ? 55 : 6,
        spotlightMode: isKahoot ? "big-card" : undefined,
        thinkSeconds: isKahoot ? 30 : 45
      },
      players: [
        {
          id: `p_${host.studentId}`,
          name: host.displayName,
          studentId: host.studentId,
          ready: true,
          locked: false,
          score: 0,
          handCount: 5,
          avatar,
          title,
          frame
        }
      ]
    };
  };

  const saveAndBroadcastRoom = (updated: PublicRoomState) => {
    setRoom(updated);
    localStorage.setItem(`nucmed_room_${roomCode}`, JSON.stringify(updated));
    syncRef.current?.publish({ type: "ROOM_STATE_SYNC", room: updated });
  };

  const handleCopyCode = () => {
    sounds.playClick();
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    sounds.playClick();
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddBot = (seatIdx: number) => {
    const maxCapacity = isKahootMode ? 55 : 6;
    if (!room || room.players.length >= maxCapacity) return;
    sounds.playClick();
    const botTemplate = BOTS[seatIdx % BOTS.length];
    const newBot: PublicPlayer = {
      id: `bot_${Date.now()}_${seatIdx}`,
      name: `${botTemplate.name}`,
      studentId: `BOT-${Math.floor(100 + Math.random() * 900)}`,
      ready: true,
      locked: false,
      score: 0,
      handCount: 5,
      isBot: true,
      avatar: botTemplate.avatar
    };
    const updated = {
      ...room,
      players: [...room.players, newBot]
    };
    saveAndBroadcastRoom(updated);
  };

  const handleRemovePlayer = (playerId: string) => {
    if (!room) return;
    sounds.playClick();
    const updated = {
      ...room,
      players: room.players.filter((p) => p.id !== playerId)
    };
    saveAndBroadcastRoom(updated);
  };

  const handleToggleReady = () => {
    if (!room || !myPlayer) return;
    sounds.playSelect();
    const nextReady = !myPlayer.ready;
    if (isHost) {
      const updated = {
        ...room,
        players: room.players.map((p) => (p.id === myPlayer.id ? { ...p, ready: nextReady } : p))
      };
      saveAndBroadcastRoom(updated);
    } else {
      syncRef.current?.publish({ type: "PLAYER_READY", playerId: myPlayer.id, ready: nextReady });
      setRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.map((p) => (p.id === myPlayer.id ? { ...p, ready: nextReady } : p))
        };
      });
    }
  };

  const handleStartGame = () => {
    if (!room) return;
    sounds.playWin();
    const updated: PublicRoomState = {
      ...room,
      phase: "DEAL"
    };
    saveAndBroadcastRoom(updated);
    syncRef.current?.publish({ type: "MATCH_START", roomCode });
    if (isKahootMode) {
      router.push(`/board/?code=${roomCode}`);
    } else {
      router.push(`/play/?code=${roomCode}&mode=table`);
    }
  };

  const sendReaction = (emoji: string) => {
    if (!myPlayer) return;
    sounds.playSelect();
    syncRef.current?.publish({ type: "EMOJI_REACTION", playerId: myPlayer.id, emoji });
    const reactionId = `rx_${Date.now()}_${Math.random()}`;
    setActiveReactions((prev) => [...prev, { id: reactionId, playerId: myPlayer.id, emoji }]);
    setTimeout(() => {
      setActiveReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 3000);
  };

  const sendChat = (text: string) => {
    if (!text.trim() || !user) return;
    sounds.playSelect();
    const msg = {
      id: `msg_${Date.now()}`,
      sender: user.displayName,
      text: text.trim(),
      avatar: "☢️"
    };
    syncRef.current?.publish({ type: "CHAT_MESSAGE", message: msg });
    setChatMessages((prev) => [...prev.slice(-20), msg]);
    setCustomChat("");
  };

  const quickReactions = ["👍", "🔥", "☢️", "🎯", "🤔", "👏"];
  const quickPhrases = ["พร้อมลุยแล้ว! 🔥", "สวัสดีเพื่อนๆ 👋", "ข้อนี้สนุกแน่ ✨", "รอแป๊บนึงนะ ⏳"];

  return (
    <div className="relative min-h-screen bg-felt-table text-amber-50 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Table Felt Vignette & Grain */}
      <div className="fixed inset-0 pointer-events-none bg-radial-vignette opacity-80" />

      {/* Top Header Navigation Bar */}
      <header className="relative z-20 w-full flex justify-between items-center px-4 md:px-8 py-3 bg-amber-950/90 border-b-4 border-amber-900 shadow-2xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              sounds.playClick();
              router.push("/");
            }}
            className="p-2 bg-amber-900/80 hover:bg-amber-800 rounded-xl text-amber-200 border-2 border-amber-600 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold font-game">ออกจากห้อง</span>
          </button>
          <div>
            <h1 className="font-game font-black text-lg md:text-xl text-amber-200 tracking-wide flex items-center space-x-2">
              <span>{isKahootMode ? "ห้องรอประลองโหมดห้องเรียน (KAHOOT CLASS 55 คน)" : "โต๊ะแข่งขัน 6 ที่นั่ง (MATCH LOBBY)"}</span>
            </h1>
            <p className="text-[10px] text-amber-300/80">
              {isHost ? "คุณคือหัวหน้าห้อง (Host) — สามารถตั้งค่าและกดเริ่มเกมได้" : "รอหัวหน้าห้องเริ่มการแข่งขัน"}
            </p>
          </div>
        </div>

        {/* Real-time Status + Quick Share Controls */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Live Sync Status Indicator */}
          <div
            className={`px-3 py-1.5 rounded-full flex items-center space-x-1.5 border text-xs font-bold shadow-md ${
              isConnected
                ? "bg-emerald-950/80 border-emerald-500/80 text-emerald-300"
                : "bg-amber-950/80 border-amber-500/80 text-amber-300"
            }`}
          >
            {isConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">เรียลไทม์ออนไลน์ (LIVE)</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">เชื่อมต่อในเครื่อง</span>
              </>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const muted = sounds.toggleMute();
              setIsMuted(muted);
              if (!muted) sounds.playClick();
            }}
            className="p-2 bg-amber-900/80 hover:bg-amber-800 text-amber-200 rounded-xl border border-amber-600 shadow cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          </button>
        </div>
      </header>

      {/* Main Tabletop Arena Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-3 md:px-8 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Table (8 cols): 3D Felt Oval Arena with 6 Seats OR 55-Player Kahoot Stage */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
            {isKahootMode ? (
              <div className="relative w-full rounded-[32px] md:rounded-[48px] bg-gradient-to-b from-[#0e2a22] via-[#091e18] to-[#04120f] border-4 md:border-6 border-amber-500/90 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_0_80px_rgba(245,158,11,0.2)] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-between min-h-[480px] md:min-h-[540px]">
                
                {/* Header with Title and Player Count */}
                <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-4 pb-3 border-b border-amber-500/30">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-amber-300 tracking-wider">
                        ห้องรอผู้เรียน (KAHOOT CLASS MODE)
                      </h2>
                      <p className="text-[11px] text-amber-300/80">
                        {isHost ? "กดเริ่มเกมได้ทันทีเมื่อทุกคนพร้อม (ไม่ต้องรอเวลานับถอยหลัง)" : "รอหัวหน้าห้อง/อาจารย์ผู้สอนกดเริ่มการแข่งขัน"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-950/90 px-3.5 py-1.5 rounded-2xl border-2 border-amber-500 text-amber-200 font-bold text-xs sm:text-sm shadow">
                    👥 ผู้เล่น: <span className="text-emerald-400 font-black text-base">{room?.players.length ?? 0}</span> / {room?.settings.maxPlayers || 55} คน
                  </div>
                </div>

                {/* Kahoot Prominent PIN Plaque */}
                <div className="w-full max-w-xl wood-panel px-6 py-3 rounded-2xl border-3 border-amber-950 shadow-xl flex flex-col items-center mb-4 text-center">
                  <span className="text-[10px] md:text-xs text-amber-300 font-bold uppercase tracking-wider">
                    รหัส PIN สำหรับเข้าร่วมห้อง (GAME PIN)
                  </span>
                  <div className="font-mono font-black text-3xl md:text-5xl text-amber-100 tracking-[0.2em] text-shadow-gold-title filter drop-shadow my-0.5">
                    {roomCode}
                  </div>

                  <div className="flex items-center space-x-2 mt-1.5">
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-1 bg-amber-900/80 hover:bg-amber-800 text-amber-200 rounded-xl text-xs font-bold border border-amber-600 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer shadow"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "คัดลอก PIN แล้ว!" : "คัดลอก PIN"}</span>
                    </button>

                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1 bg-blue-900/80 hover:bg-blue-800 text-blue-200 rounded-xl text-xs font-bold border border-blue-500 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer shadow"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? "คัดลอกลิงก์แล้ว!" : "คัดลอกลิงก์"}</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setShowQrModal(true);
                      }}
                      className="p-1 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded-xl border border-emerald-500 shadow transition-all active:scale-95 cursor-pointer"
                      title="แสดง QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 55-Player Grid Display */}
                <div className="flex-1 w-full max-h-[260px] md:max-h-[300px] overflow-y-auto custom-scrollbar px-2 py-2 mb-4">
                  {(!room || room.players.length === 0) ? (
                    <div className="flex items-center justify-center h-full text-amber-300/60 text-lg font-bold">
                      รอผู้เรียนเข้าร่วมห้อง...
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
                      {room.players.map((p) => {
                        const isMe = p.studentId === user?.studentId;
                        const isRoomHost = p.id === room.hostId;
                        return (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={p.id}
                            className={`group relative px-3.5 py-1.5 rounded-2xl flex items-center space-x-2 border-2 shadow-md transition-all ${
                              isMe 
                                ? "bg-amber-900/90 border-amber-300 text-white ring-2 ring-amber-400/50" 
                                : "bg-black/50 border-amber-600/50 hover:border-amber-400 text-amber-100"
                            }`}
                          >
                            <span className="text-xl md:text-2xl">{p.avatar || (p.isBot ? "🤖" : "👨‍🎓")}</span>
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-xs md:text-sm text-white flex items-center space-x-1">
                                <span className="truncate max-w-[120px]">{p.name}</span>
                                {isRoomHost && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 inline" />}
                                {isMe && <span className="text-[9px] bg-blue-600 text-white font-black px-1 rounded ml-1">YOU</span>}
                              </span>
                              <span className="text-[9px] text-amber-300/70 font-mono">
                                {p.studentId}
                              </span>
                            </div>

                            {/* Host remove button */}
                            {isHost && !isMe && (
                              <button
                                onClick={() => handleRemovePlayer(p.id)}
                                className="w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ml-1 cursor-pointer"
                                title="เตะผู้เล่นออก"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom Start Controls */}
                <div className="w-full flex flex-col items-center justify-center pt-2 border-t border-amber-500/20">
                  {isHost ? (
                    <div className="flex flex-col items-center space-y-1">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleStartGame}
                        disabled={!room || room.players.length < 1}
                        className="px-8 md:px-14 py-3 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 border-3 border-amber-200 rounded-2xl text-amber-950 font-game font-black text-lg md:text-2xl tracking-wider shadow-[0_8px_0_#78350f,0_14px_25px_rgba(0,0,0,0.6)] active:translate-y-2 active:shadow-[0_2px_0_#78350f] transition-all flex items-center space-x-3 cursor-pointer disabled:opacity-50"
                      >
                        <Play className="w-6 h-6 fill-amber-950 text-amber-950" />
                        <span>เริ่มการแข่งขัน (START GAME)</span>
                      </motion.button>
                      <span className="text-[11px] text-amber-300/80">
                        กดเริ่มได้เองทันทีเมื่อทุกคนเข้าห้องครบ (ไม่ต้องรอเวลานับถอยหลัง)
                      </span>
                    </div>
                  ) : (
                    <div className="px-8 py-3 rounded-2xl font-game font-bold text-sm md:text-base tracking-wider border-2 bg-amber-950/80 border-amber-600 text-amber-300 shadow-xl flex items-center space-x-2">
                      <Clock className="w-5 h-5 animate-pulse text-amber-400" />
                      <span>รอหัวหน้าห้อง/อาจารย์กดเริ่มเกม...</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative w-full rounded-[40px] md:rounded-[60px] bg-gradient-to-b from-[#0A3D36] via-[#072824] to-[#041D1A] border-8 md:border-12 border-[#4A281D] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(0,0,0,0.7)] p-4 md:p-8 flex flex-col justify-between items-center min-h-[460px] md:min-h-[520px]">
                {/* Brass / Gold Table Rivet Highlights */}
            <div className="absolute top-2 left-6 w-3 h-3 rounded-full bg-amber-400/80 shadow-[0_0_8px_#f59e0b]" />
            <div className="absolute top-2 right-6 w-3 h-3 rounded-full bg-amber-400/80 shadow-[0_0_8px_#f59e0b]" />
            <div className="absolute bottom-2 left-6 w-3 h-3 rounded-full bg-amber-400/80 shadow-[0_0_8px_#f59e0b]" />
            <div className="absolute bottom-2 right-6 w-3 h-3 rounded-full bg-amber-400/80 shadow-[0_0_8px_#f59e0b]" />

            {/* Top 3 Player Seats */}
            <div className="w-full grid grid-cols-3 gap-2 md:gap-4 z-10">
              {[0, 1, 2].map((idx) => {
                const player = room?.players[idx];
                const activeReaction = activeReactions.find((r) => r.playerId === player?.id);
                return (
                  <div key={idx} className="flex justify-center relative">
                    <SeatPedestal
                      seatNumber={idx + 1}
                      player={player}
                      isHost={isHost}
                      isCurrentPlayer={player?.studentId === user?.studentId}
                      isRoomHost={player?.id === room?.hostId}
                      reaction={activeReaction?.emoji}
                      onRemove={() => player && handleRemovePlayer(player.id)}
                      onAddBot={() => handleAddBot(idx)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Table Center Stage: Room Code Plaque + Start / Ready Button */}
            <div className="my-auto flex flex-col items-center text-center z-10 py-3">
              {/* Wooden Engraved Room Code Plaque */}
              <div className="wood-panel px-6 md:px-10 py-3 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col items-center">
                <span className="text-[10px] md:text-xs text-amber-300 font-bold uppercase tracking-wider mb-0.5">
                  รหัสห้องเข้าประลอง (ROOM CODE)
                </span>
                <span className="font-mono font-black text-3xl md:text-5xl text-amber-100 tracking-[0.2em] text-shadow-gold-title filter drop-shadow">
                  {roomCode}
                </span>

                {/* Quick Copy & Share Buttons */}
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-amber-900/80 hover:bg-amber-800 text-amber-200 rounded-xl text-xs font-bold border border-amber-600 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer shadow"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "คัดลอกรหัสแล้ว!" : "คัดลอกรหัส"}</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-blue-900/80 hover:bg-blue-800 text-blue-200 rounded-xl text-xs font-bold border border-blue-500 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer shadow"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "คัดลอกลิงก์แล้ว!" : "คัดลอกลิงก์เชิญ"}</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setShowQrModal(true);
                    }}
                    className="p-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded-xl border border-emerald-500 shadow transition-all active:scale-95 cursor-pointer"
                    title="แสดง QR Code สำหรับสแกนด้วยมือถือ"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Giant 3D Action Button: START GAME (for Host) or READY TOGGLE (for Guest) */}
              <div className="mt-4">
                {isHost ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartGame}
                    disabled={!room || room.players.length < 1}
                    className="px-8 md:px-14 py-3.5 md:py-4 bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#047857] hover:from-[#4ade80] hover:to-[#059669] border-4 border-[#A7F3D0] rounded-2xl text-white font-game font-black text-lg md:text-2xl tracking-wider shadow-[0_8px_0_#064e3b,0_14px_25px_rgba(0,0,0,0.6)] active:translate-y-2 active:shadow-[0_2px_0_#064e3b] transition-all flex items-center space-x-3 cursor-pointer group disabled:opacity-50"
                  >
                    <Play className="w-6 h-6 fill-white text-white group-hover:translate-x-1 transition-transform filter drop-shadow" />
                    <span>เริ่มการแข่งขัน (START GAME)</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleReady}
                    className={`px-8 md:px-12 py-3.5 rounded-2xl font-game font-black text-base md:text-xl tracking-wider border-3 transition-all cursor-pointer shadow-xl ${
                      myPlayer?.ready
                        ? "bg-gradient-to-b from-emerald-500 to-emerald-700 border-emerald-300 text-white shadow-[0_6px_0_#064e3b]"
                        : "bg-gradient-to-b from-amber-500 to-amber-700 border-amber-300 text-white shadow-[0_6px_0_#78350f]"
                    }`}
                  >
                    {myPlayer?.ready ? "✓ พร้อมแล้ว (READY)" : "แตะเพื่อกดพร้อม (READY)"}
                  </motion.button>
                )}
              </div>

              {/* Player count alert hint */}
              <div className="text-[11px] text-amber-200/80 font-bold mt-2">
                ผู้เล่นในห้อง: {room?.players.length ?? 1} / 6 คน (เพิ่มบอทเพื่อเริ่มเล่นได้)
              </div>
            </div>

            {/* Bottom 3 Player Seats */}
            <div className="w-full grid grid-cols-3 gap-2 md:gap-4 z-10">
              {[3, 4, 5].map((idx) => {
                const player = room?.players[idx];
                const activeReaction = activeReactions.find((r) => r.playerId === player?.id);
                return (
                  <div key={idx} className="flex justify-center relative">
                    <SeatPedestal
                      seatNumber={idx + 1}
                      player={player}
                      isHost={isHost}
                      isCurrentPlayer={player?.studentId === user?.studentId}
                      isRoomHost={player?.id === room?.hostId}
                      reaction={activeReaction?.emoji}
                      onRemove={() => player && handleRemovePlayer(player.id)}
                      onAddBot={() => handleAddBot(idx)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          
            )}

            {/* Quick Reaction Emoji Wheel */}
          <div className="w-full max-w-xl mt-3 flex items-center justify-center space-x-2 bg-amber-950/70 p-2 rounded-2xl border border-amber-700/60 shadow-lg">
            <span className="text-[11px] text-amber-300 font-bold mr-1">ส่งอิโมจิ:</span>
            {quickReactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                className="w-9 h-9 text-lg rounded-xl bg-amber-900/80 hover:bg-amber-800 hover:scale-120 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow border border-amber-600/50"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Host Match Settings & Live Lobby Chat (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Host Settings Panel */}
          {isHost && (
            <div className="wood-panel p-4 rounded-3xl border-3 border-amber-950 shadow-xl">
              <div className="flex items-center space-x-2 mb-2 pb-1.5 border-b border-amber-900/60">
                <Settings className="w-4 h-4 text-amber-400" />
                <h3 className="font-game font-bold text-amber-200 text-sm">
                  ตั้งค่าการประลอง (HOST SETTINGS)
                </h3>
              </div>

              <div className="space-y-3 text-xs text-amber-200/90">
                {/* Room Mode Toggle */}
                <div>
                  <span className="text-[11px] text-amber-300 font-bold block mb-1">รูปแบบห้องแข่งขัน:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playSelect();
                        if (room) {
                          saveAndBroadcastRoom({
                            ...room,
                            settings: {
                              ...room.settings,
                              maxPlayers: 55,
                              spotlightMode: "big-card"
                            }
                          });
                        }
                      }}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer font-bold text-[11px] ${
                        isKahootMode
                          ? "bg-amber-900/90 border-amber-300 text-white shadow ring-1 ring-amber-400"
                          : "bg-black/40 border-amber-800/40 text-amber-300/60 hover:bg-black/60"
                      }`}
                    >
                      🎓 ห้องเรียน (55 คน)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playSelect();
                        if (room) {
                          saveAndBroadcastRoom({
                            ...room,
                            settings: {
                              ...room.settings,
                              maxPlayers: 6,
                              spotlightMode: undefined
                            }
                          });
                        }
                      }}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer font-bold text-[11px] ${
                        !isKahootMode
                          ? "bg-amber-900/90 border-amber-300 text-white shadow ring-1 ring-amber-400"
                          : "bg-black/40 border-amber-800/40 text-amber-300/60 hover:bg-black/60"
                      }`}
                    >
                      🎴 โต๊ะคาสิโน (6 ที่)
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>จำนวนรอบแข่งขัน:</span>
                  <select
                    value={room?.totalRounds ?? 10}
                    onChange={(e) => {
                      sounds.playSelect();
                      if (room) saveAndBroadcastRoom({ ...room, totalRounds: Number(e.target.value) });
                    }}
                    className="bg-amber-950 border border-amber-600 rounded-lg px-2.5 py-1 text-white font-bold"
                  >
                    <option value={5}>5 ข้อ (โหมดเร็ว)</option>
                    <option value={10}>10 ข้อ (มาตรฐาน)</option>
                    <option value={15}>15 ข้อ (แข่งขันมาราธอน)</option>
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span>เวลาต่อข้อ:</span>
                  <select
                    value={room?.settings.thinkSeconds ?? 30}
                    onChange={(e) => {
                      sounds.playSelect();
                      if (room) {
                        const newSettings = { ...room.settings, thinkSeconds: Number(e.target.value) };
                        saveAndBroadcastRoom({ ...room, settings: newSettings });
                      }
                    }}
                    className="bg-amber-950 border border-amber-600 rounded-lg px-2.5 py-1 text-white font-bold outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value={15}>15 วินาที</option>
                    <option value={20}>20 วินาที</option>
                    <option value={30}>30 วินาที</option>
                    <option value={45}>45 วินาที</option>
                    <option value={60}>60 วินาที</option>
                  </select>
                </div>

                {isKahootMode && (
                  <div className="flex justify-between items-center">
                    <span>รูปแบบจอสปอตไลต์:</span>
                    <select
                      value={room?.settings.spotlightMode ?? "big-card"}
                      onChange={(e) => {
                        sounds.playSelect();
                        if (room) {
                          const newSettings = { ...room.settings, spotlightMode: e.target.value as any };
                          saveAndBroadcastRoom({ ...room, settings: newSettings });
                        }
                      }}
                      className="bg-amber-950 border border-amber-600 rounded-lg px-2.5 py-1 text-white font-bold outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      <option value="big-card">แบบการ์ดใหญ่ (Big Card)</option>
                      <option value="text">แบบข้อความ (Text Mode)</option>
                    </select>
                  </div>
                )}

                <div className="pt-2 border-t border-amber-900/60 flex justify-between items-center">
                  <span className="text-[11px] text-amber-300">บอท AI อัตโนมัติ:</span>
                  <button
                    onClick={() => handleAddBot((room?.players.length ?? 0))}
                    disabled={(room?.players.length ?? 0) >= (isKahootMode ? 55 : 6)}
                    className="bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg border border-purple-400 flex items-center space-x-1 disabled:opacity-50 cursor-pointer shadow active:scale-95"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>+ เพิ่มบอท AI</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Chat & Messages Feed */}
          <div className="wood-panel p-4 rounded-3xl border-3 border-amber-950 shadow-xl flex flex-col h-[320px]">
            <div className="flex items-center space-x-2 mb-2 pb-1.5 border-b border-amber-900/60">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="font-game font-bold text-amber-200 text-sm">
                แชทในห้อง (LOBBY CHAT)
              </h3>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 bg-black/40 rounded-xl p-2.5 overflow-y-auto space-y-2 border border-amber-900/40 text-xs scrollbar-thin">
              {chatMessages.length === 0 ? (
                <div className="text-center text-amber-300/40 py-8">
                  ยังไม่มีข้อความ ทักทายเพื่อนๆ ในห้องได้เลย!
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="bg-amber-950/70 p-2 rounded-xl border border-amber-800/40">
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <span className="text-xs">☢️</span>
                      <span className="font-bold text-amber-300">{msg.sender}</span>
                    </div>
                    <div className="text-white pl-4">{msg.text}</div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Phrases */}
            <div className="flex flex-wrap gap-1.5 my-2">
              {quickPhrases.map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => sendChat(phrase)}
                  className="bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-700/50 cursor-pointer transition-all active:scale-95"
                >
                  {phrase}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={customChat}
                onChange={(e) => setCustomChat(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat(customChat)}
                placeholder="พิมพ์ข้อความ..."
                className="flex-1 px-3 py-1.5 bg-amber-950/90 border border-amber-600 rounded-xl text-xs text-white focus:outline-hidden"
              />
              <button
                onClick={() => sendChat(customChat)}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 rounded-xl text-xs font-bold text-white cursor-pointer active:scale-95"
              >
                ส่ง
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative wood-panel p-6 rounded-3xl border-4 border-amber-950 shadow-2xl text-center max-w-sm w-full flex flex-col items-center">
            <h3 className="font-game font-bold text-xl text-amber-200 mb-1">
              สแกนเข้าร่วมห้อง
            </h3>
            <p className="text-xs text-amber-300/80 mb-3">
              ใช้กล้องมือถือสแกนเพื่อเข้าโต๊ะประลองได้ทันที
            </p>

            <div className="p-4 bg-white rounded-2xl shadow-2xl my-2 border-4 border-amber-500">
              <QRCodeSVG value={inviteUrl} size={200} />
            </div>

            <div className="text-xs text-amber-300 font-mono font-bold mt-2">
              รหัสห้อง: {roomCode}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-4 w-full py-2.5 bg-amber-700 hover:bg-amber-600 rounded-xl text-xs font-bold text-white cursor-pointer shadow active:scale-95"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Seat Pedestal Component with 3D Ring & Floating Emoji
function SeatPedestal({
  seatNumber,
  player,
  isHost,
  isCurrentPlayer,
  isRoomHost,
  reaction,
  onRemove,
  onAddBot
}: {
  seatNumber: number;
  player?: PublicPlayer;
  isHost: boolean;
  isCurrentPlayer: boolean;
  isRoomHost: boolean;
  reaction?: string;
  onRemove: () => void;
  onAddBot: () => void;
}) {
  if (!player) {
    return (
      <div className="w-24 md:w-32 h-32 md:h-36 rounded-3xl border-2 border-dashed border-amber-700/50 bg-black/20 flex flex-col items-center justify-center p-2 text-center shadow-inner">
        <span className="text-[11px] text-amber-400/60 font-game font-bold mb-2">ที่นั่ง {seatNumber}</span>
        {isHost ? (
          <button
            onClick={onAddBot}
            className="px-2.5 py-1.5 bg-purple-900/80 hover:bg-purple-800 border border-purple-500/60 rounded-xl text-[10px] text-purple-200 font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow"
          >
            + เพิ่มบอท
          </button>
        ) : (
          <span className="text-[10px] text-amber-400/40">ว่าง</span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-24 md:w-32 h-32 md:h-36 wood-panel rounded-3xl border-2 p-2 flex flex-col justify-between items-center text-center shadow-2xl transition-all group ${
      isCurrentPlayer
        ? "border-amber-400 ring-2 ring-amber-400/50"
        : "border-amber-600/80"
    }`}>
      {/* Floating Emoji Reaction Bubble */}
      <AnimatePresence>
        {reaction && (
          <motion.div
            initial={{ scale: 0, y: 10, opacity: 0 }}
            animate={{ scale: 1.4, y: -25, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-4 z-40 bg-amber-950 border-2 border-amber-400 rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-2xl"
          >
            {reaction}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Status: Host Crown or Seat Number & Ready Dot */}
      <div className="w-full flex justify-between items-center px-1">
        <div className="flex items-center space-x-1">
          {isRoomHost && <Crown className="w-3.5 h-3.5 text-amber-400 filter drop-shadow" />}
          <span className="text-[9px] font-mono text-amber-300/80">#{seatNumber}</span>
        </div>

        {player.ready ? (
          <span className="bg-emerald-500/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_8px_#10b981]">
            READY
          </span>
        ) : (
          <span className="bg-amber-800/80 text-amber-200 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
            WAIT
          </span>
        )}
      </div>

      {/* Circular Avatar with Glowing Ring */}
      <div className="relative my-0.5">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 border-2 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.5)] ${
          player.frame ? getFrameStyle(player.frame) : "border-amber-200"
        }`}>
          {player.avatar || (player.isBot ? "🤖" : "👨‍🎓")}
        </div>
        {isCurrentPlayer && (
          <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[7px] font-black px-1 rounded-full border border-white">
            YOU
          </span>
        )}
      </div>

      {/* Player Name & Student ID */}
      <div className="w-full">
        <div className="font-bold text-[11px] md:text-xs text-white truncate max-w-full leading-tight">
          {player.name}
        </div>
        {player.title && (
          <div className="text-[8px] text-amber-300 font-bold bg-amber-950/70 rounded px-1.5 py-0.2 mt-0.5 inline-block border border-amber-500/40 truncate max-w-[120px]">
            {player.title}
          </div>
        )}
        <div className="text-[8.5px] md:text-[9.5px] text-amber-300/80 font-mono truncate">
          {player.studentId}
        </div>
      </div>

      {/* Remove button for Host (Only for bots or other players) */}
      {isHost && !isCurrentPlayer && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
          title="เตะออกจากห้อง"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
