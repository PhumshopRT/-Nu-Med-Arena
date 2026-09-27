"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
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
  Trash2
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { 
  PublicPlayer, 
  PublicRoomState, 
  DEFAULT_ROOM_SETTINGS, 
  BOTS, 
  StudentUser 
} from "@nucmed/shared";
import { getLocalUser } from "@/lib/user";
import { sounds } from "@/lib/sound";

export function LobbyClient() {
  const params = useParams();
  const router = useRouter();
  const roomCode = ((params?.code as string) || "ROOM01").toUpperCase();

  const [user, setUser] = useState<StudentUser | null>(null);
  const [room, setRoom] = useState<PublicRoomState | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string }[]>([]);
  const [customChat, setCustomChat] = useState("");

  // Initialize room state
  useEffect(() => {
    const localUser = getLocalUser();
    setUser(localUser);

    const savedRoomKey = `nucmed_room_${roomCode}`;
    const saved = localStorage.getItem(savedRoomKey);

    let currentRoom: PublicRoomState;
    if (saved) {
      try {
        currentRoom = JSON.parse(saved);
        // Ensure current user is in player list
        const existingPlayer = currentRoom.players.find((p) => p.studentId === localUser.studentId);
        if (!existingPlayer && currentRoom.players.length < currentRoom.settings.maxPlayers) {
          currentRoom.players.push({
            id: `p_${localUser.studentId}`,
            name: localUser.displayName,
            studentId: localUser.studentId,
            ready: true,
            locked: false,
            score: 0,
            handCount: 5,
            avatar: "☢️"
          });
        }
      } catch {
        currentRoom = createInitialRoom(roomCode, localUser);
      }
    } else {
      currentRoom = createInitialRoom(roomCode, localUser);
    }

    setRoom(currentRoom);
    saveRoom(currentRoom);
  }, [roomCode]);

  const createInitialRoom = (code: string, host: StudentUser): PublicRoomState => {
    return {
      code,
      hostId: `p_${host.studentId}`,
      phase: "LOBBY",
      roundIndex: 1,
      totalRounds: 10,
      caseCardId: null,
      clueCardId: null,
      sharedMechanisms: [],
      endsAt: 0,
      settings: { ...DEFAULT_ROOM_SETTINGS },
      players: [
        {
          id: `p_${host.studentId}`,
          name: host.displayName,
          studentId: host.studentId,
          ready: true,
          locked: false,
          score: 0,
          handCount: 5,
          avatar: "☢️"
        }
      ]
    };
  };

  const saveRoom = (updated: PublicRoomState) => {
    setRoom(updated);
    localStorage.setItem(`nucmed_room_${roomCode}`, JSON.stringify(updated));
  };

  const isHost = Boolean(user && room && room.hostId === `p_${user.studentId}`);
  const myPlayer = room?.players.find((p) => p.studentId === user?.studentId);

  const handleCopyCode = () => {
    sounds.playClick();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddBot = (botIndex: number) => {
    if (!room || room.players.length >= 6) return;
    sounds.playClick();
    const botTemplate = BOTS[botIndex % BOTS.length];
    const newBot: PublicPlayer = {
      id: `bot_${Date.now()}_${botIndex}`,
      name: `${botTemplate.name} #${room.players.length + 1}`,
      studentId: `BOT-${Math.floor(1000 + Math.random() * 9000)}`,
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
    saveRoom(updated);
  };

  const handleRemovePlayer = (playerId: string) => {
    if (!room) return;
    sounds.playClick();
    const updated = {
      ...room,
      players: room.players.filter((p) => p.id !== playerId)
    };
    saveRoom(updated);
  };

  const handleToggleReady = () => {
    if (!room || !myPlayer) return;
    sounds.playSelect();
    const updated = {
      ...room,
      players: room.players.map((p) =>
        p.id === myPlayer.id ? { ...p, ready: !p.ready } : p
      )
    };
    saveRoom(updated);
  };

  const handleStartGame = () => {
    if (!room) return;
    sounds.playWin();
    const updated: PublicRoomState = {
      ...room,
      phase: "DEAL"
    };
    saveRoom(updated);
    router.push(`/play/${roomCode}`);
  };

  const sendChat = (text: string) => {
    if (!text.trim() || !user) return;
    sounds.playSelect();
    const msg = {
      id: `msg_${Date.now()}`,
      sender: user.displayName,
      text: text.trim()
    };
    setChatMessages((prev) => [...prev.slice(-15), msg]);
    setCustomChat("");
  };

  const quickEmojis = ["พร้อมลุย! 🔥", "สวัสดีครับ 👋", "ข้อนี้ง่าย! ✨", "ขอเวลาคิดแป๊บ 🤔", "นิวเคลียร์สู้ๆ ☢️"];

  return (
    <div className="relative min-h-screen bg-felt-table text-amber-50 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Table Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-radial-vignette opacity-80" />

      {/* Top Header */}
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
            <span className="text-xs font-bold font-game">ออกห้อง</span>
          </button>
          <div>
            <h1 className="font-game font-black text-lg md:text-xl text-amber-200 tracking-wide">
              ห้องประลอง (MATCH LOBBY)
            </h1>
            <p className="text-[10px] text-amber-300/80">จัดโต๊ะ 6 ที่นั่ง เตรียมประลองสารเภสัชรังสีและกลไก</p>
          </div>
        </div>

        {/* Room Code Badge with Copy & QR */}
        <div className="flex items-center space-x-2">
          <div className="bg-amber-900/90 border-2 border-amber-500/80 px-4 py-1.5 rounded-xl flex items-center space-x-2 shadow-inner">
            <span className="text-[10px] text-amber-300 uppercase font-bold">รหัสห้อง:</span>
            <span className="font-mono font-black text-lg md:text-xl text-amber-200 tracking-widest">
              {roomCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="p-2 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-xl border border-amber-500 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="คัดลอกรหัสห้อง"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setShowQrModal(true);
            }}
            className="p-2 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-xl border border-amber-500 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="แสดง QR Code สำหรับมือถือ"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Table Area (6 Seats) */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 6-Seat Card Table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Circular Wooden Arena Table */}
          <div className="relative w-full max-w-2xl bg-[#0F2D24] border-8 border-wood-dark rounded-[40px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(0,0,0,0.6)] flex flex-col justify-between items-center min-h-[460px]">
            {/* Table center felt logo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-15 pointer-events-none select-none">
              <span className="text-8xl">☢️</span>
              <span className="font-game font-black text-3xl tracking-widest text-white mt-2">
                NUC-MED ARENA
              </span>
            </div>

            {/* 6 Seats Layout (3 top, 3 bottom) */}
            <div className="w-full grid grid-cols-3 gap-3 z-10">
              {[0, 1, 2].map((idx) => {
                const player = room?.players[idx];
                return (
                  <div key={idx} className="flex justify-center">
                    <SeatCard
                      seatNumber={idx + 1}
                      player={player}
                      isHost={isHost}
                      onRemove={() => player && handleRemovePlayer(player.id)}
                      onAddBot={() => handleAddBot(idx)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Table Center Controls */}
            <div className="z-10 my-6 flex flex-col items-center">
              <div className="bg-amber-950/90 border-2 border-amber-600/80 px-6 py-2 rounded-2xl shadow-xl flex items-center space-x-4">
                <div className="flex items-center space-x-1.5 text-xs text-amber-200">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>ผู้เล่น: <strong>{room?.players.length ?? 0}/6</strong></span>
                </div>
                <div className="w-0.5 h-4 bg-amber-700/60" />
                <div className="text-xs text-amber-200">
                  รอบแข่ง: <strong>{room?.totalRounds ?? 10} ข้อ</strong>
                </div>
              </div>

              {/* Start Match Button for Host */}
              {isHost ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4">
                  <button
                    onClick={handleStartGame}
                    disabled={(room?.players.length ?? 0) < 1}
                    className="px-10 py-3.5 bg-play hover:bg-play-hover border-3 border-play-border rounded-2xl text-white font-game font-black text-xl tracking-wider shadow-play-btn active:shadow-play-btn-pressed transition-all flex items-center space-x-3 cursor-pointer group disabled:opacity-50"
                  >
                    <Play className="w-6 h-6 fill-white text-white group-hover:translate-x-1 transition-transform" />
                    <span>เริ่มการประลอง</span>
                  </button>
                </motion.div>
              ) : (
                <div className="mt-4">
                  <button
                    onClick={handleToggleReady}
                    className={`px-8 py-3 rounded-2xl font-game font-black text-lg tracking-wider border-3 transition-all cursor-pointer shadow-lg ${
                      myPlayer?.ready
                        ? "bg-emerald-600 hover:bg-emerald-500 border-emerald-300 text-white"
                        : "bg-amber-700 hover:bg-amber-600 border-amber-400 text-white"
                    }`}
                  >
                    {myPlayer?.ready ? "✓ พร้อมแล้ว (READY)" : "กดเพื่อพร้อม (READY)"}
                  </button>
                </div>
              )}
            </div>

            {/* Bottom 3 Seats */}
            <div className="w-full grid grid-cols-3 gap-3 z-10">
              {[3, 4, 5].map((idx) => {
                const player = room?.players[idx];
                return (
                  <div key={idx} className="flex justify-center">
                    <SeatCard
                      seatNumber={idx + 1}
                      player={player}
                      isHost={isHost}
                      onRemove={() => player && handleRemovePlayer(player.id)}
                      onAddBot={() => handleAddBot(idx)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Chat Bubble Bar */}
          <div className="w-full max-w-2xl mt-4 flex flex-wrap items-center justify-center gap-2">
            {quickEmojis.map((msg, i) => (
              <button
                key={i}
                onClick={() => sendChat(msg)}
                className="wood-panel px-3 py-1.5 rounded-xl text-amber-200 hover:text-white text-xs font-bold border border-amber-700/60 shadow hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Room Settings & Live Room Chat (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Host Settings Plaque */}
          {isHost && (
            <div className="wood-panel p-4 rounded-3xl border-3 border-amber-950 shadow-xl">
              <div className="flex items-center space-x-2 mb-3">
                <Settings className="w-4 h-4 text-amber-400" />
                <h3 className="font-game font-bold text-amber-200 text-sm">
                  ตั้งค่าห้อง (HOST SETTINGS)
                </h3>
              </div>

              <div className="space-y-3 text-xs text-amber-200/90">
                <div className="flex justify-between items-center">
                  <span>จำนวนรอบแข่งขัน:</span>
                  <select
                    value={room?.totalRounds ?? 10}
                    onChange={(e) => {
                      sounds.playSelect();
                      if (room) saveRoom({ ...room, totalRounds: Number(e.target.value) });
                    }}
                    className="bg-amber-950 border border-amber-600 rounded-lg px-2 py-1 text-white font-bold"
                  >
                    <option value={5}>5 ข้อ (รอบเร็ว)</option>
                    <option value={10}>10 ข้อ (มาตรฐาน)</option>
                    <option value={15}>15 ข้อ (ประลองมาราธอน)</option>
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span>เวลาคิดต่อข้อ:</span>
                  <select
                    value={room?.settings.thinkSeconds ?? 45}
                    onChange={(e) => {
                      sounds.playSelect();
                      if (room) {
                        saveRoom({
                          ...room,
                          settings: { ...room.settings, thinkSeconds: Number(e.target.value) }
                        });
                      }
                    }}
                    className="bg-amber-950 border border-amber-600 rounded-lg px-2 py-1 text-white font-bold"
                  >
                    <option value={30}>30 วินาที</option>
                    <option value={45}>45 วินาที</option>
                    <option value={60}>60 วินาที</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-amber-900/60 flex justify-between items-center">
                  <span className="text-[11px] text-amber-300">บอท AI สำหรับซ้อม:</span>
                  <button
                    onClick={() => handleAddBot((room?.players.length ?? 0))}
                    disabled={(room?.players.length ?? 0) >= 6}
                    className="bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-purple-400 flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>+ เพิ่มบอท AI</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Chat Feed */}
          <div className="wood-panel p-4 rounded-3xl border-3 border-amber-950 shadow-xl flex flex-col h-[280px]">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="font-game font-bold text-amber-200 text-sm">
                ข้อความในห้อง (LOBBY CHAT)
              </h3>
            </div>

            <div className="flex-1 bg-black/40 rounded-xl p-2.5 overflow-y-auto space-y-2 border border-amber-900/40 text-xs">
              {chatMessages.length === 0 ? (
                <div className="text-center text-amber-300/40 py-6">
                  ยังไม่มีข้อความ ทักทายเพื่อนในห้องได้เลย!
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="bg-amber-950/60 p-1.5 rounded-lg border border-amber-800/40">
                    <span className="font-bold text-amber-300 mr-1.5">{msg.sender}:</span>
                    <span className="text-white">{msg.text}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex space-x-2 mt-2">
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
                className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 rounded-xl text-xs font-bold text-white cursor-pointer"
              >
                ส่ง
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative wood-panel p-6 rounded-3xl border-4 border-amber-950 shadow-2xl text-center max-w-xs w-full flex flex-col items-center">
            <h3 className="font-game font-bold text-lg text-amber-200 mb-2">
              สแกนเข้าร่วมห้อง
            </h3>
            <div className="p-3 bg-white rounded-2xl shadow-inner my-2">
              <QRCodeSVG
                value={typeof window !== "undefined" ? window.location.href : `https://masterphum07-web.github.io/RTGAME/lobby/${roomCode}/`}
                size={180}
              />
            </div>
            <div className="text-xs text-amber-300 font-mono font-bold mt-2">
              รหัสห้อง: {roomCode}
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="mt-4 w-full py-2 bg-amber-700 hover:bg-amber-600 rounded-xl text-xs font-bold text-white cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Seat Component
function SeatCard({
  seatNumber,
  player,
  isHost,
  onRemove,
  onAddBot
}: {
  seatNumber: number;
  player?: PublicPlayer;
  isHost: boolean;
  onRemove: () => void;
  onAddBot: () => void;
}) {
  if (!player) {
    return (
      <div className="w-24 md:w-28 h-28 md:h-32 rounded-2xl border-2 border-dashed border-amber-700/60 bg-amber-950/20 flex flex-col items-center justify-center p-2 text-center">
        <span className="text-xs text-amber-400/60 font-game font-bold mb-1">ที่นั่ง {seatNumber}</span>
        {isHost ? (
          <button
            onClick={onAddBot}
            className="px-2 py-1 bg-purple-900/60 hover:bg-purple-800 border border-purple-500/50 rounded-lg text-[10px] text-purple-200 font-bold transition-transform hover:scale-105"
          >
            + บอท AI
          </button>
        ) : (
          <span className="text-[10px] text-amber-400/40">ว่าง</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-24 md:w-28 h-28 md:h-32 wood-panel rounded-2xl border-2 border-amber-500/80 p-2 flex flex-col justify-between items-center text-center shadow-lg group">
      {/* Ready Badge */}
      <div className="w-full flex justify-between items-center">
        <span className="text-[9px] font-mono text-amber-300/80">#{seatNumber}</span>
        {player.ready ? (
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" title="พร้อมแล้ว" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-amber-400" title="กำลังรอ" />
        )}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-200 flex items-center justify-center text-lg shadow-inner my-1">
        {player.avatar || (player.isBot ? "🤖" : "👨‍🎓")}
      </div>

      {/* Name */}
      <div className="w-full">
        <div className="font-bold text-[11px] text-white truncate max-w-full">
          {player.name}
        </div>
        <div className="text-[9px] text-amber-300/70 font-mono">
          {player.studentId}
        </div>
      </div>

      {/* Remove button for Host */}
      {isHost && (
        <button
          onClick={onRemove}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
          title="เตะออกจากห้อง"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
