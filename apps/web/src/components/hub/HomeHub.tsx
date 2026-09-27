"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LabWorldBackground } from "../splash/LabWorldBackground";
import { FloatingCardIcons } from "../splash/FloatingCardIcons";
import { MascotNew, MascotMed, MascotGamma } from "../splash/Mascots";
import { StudentUser } from "@nucmed/shared";
import { 
  Users, 
  PlusCircle, 
  LogIn, 
  Bot, 
  ShoppingBag, 
  Trophy, 
  BookOpen, 
  LogOut, 
  Coins, 
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";

interface HomeHubProps {
  user: StudentUser;
  onLogout: () => void;
  onOpenGallery: () => void;
}

export function HomeHub({ user, onLogout, onOpenGallery }: HomeHubProps) {
  const [joinCode, setJoinCode] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);

  // Level calculation
  const level = Math.floor(user.xp / 100) + 1;
  const currentXpInLevel = user.xp % 100;

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between items-center z-40 select-none">
      {/* Background world */}
      <LabWorldBackground />
      <FloatingCardIcons />

      {/* Top Bar: Profile Plaque + Coins + Logout */}
      <div className="w-full flex justify-between items-center px-4 md:px-8 pt-4 z-20">
        {/* Left: Player Profile Wood Plaque */}
        <div className="wood-panel px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-xl border-3 border-amber-950">
          <div className="w-11 h-11 rounded-full bg-amber-400 border-2 border-amber-600 flex items-center justify-center text-xl shadow-inner">
            ☢️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white font-game">{user.displayName}</span>
              <span className="bg-emerald-600/80 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                LV.{level}
              </span>
            </div>
            <div className="text-[11px] text-amber-200/90 font-mono">
              ID: {user.studentId}
            </div>
            {/* XP progress bar */}
            <div className="w-28 md:w-36 h-2 bg-black/40 rounded-full mt-1 overflow-hidden border border-amber-500/30">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-300"
                style={{ width: `${currentXpInLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center / Right: NucCoins Balance & Logout */}
        <div className="flex items-center space-x-3">
          {/* NucCoin Balance */}
          <div className="wood-panel px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-lg border-2 border-amber-950">
            <Coins className="w-5 h-5 text-amber-400 animate-bounce" />
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-300 uppercase font-bold">NucCoin</span>
              <span className="font-bold text-sm text-white font-mono">{user.coins} 🪙</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2.5 rounded-2xl bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-200 hover:text-white transition-all shadow-md"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Hub Area */}
      <div className="flex flex-col items-center text-center my-auto z-20 w-full max-w-4xl px-4">
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-black font-game text-amber-300 text-shadow-gold-title filter drop-shadow">
          ศูนย์รวมการประลอง (ARENA HUB)
        </h2>
        <div className="wood-panel px-4 py-1 rounded-lg mt-1 text-xs text-amber-200 font-bold border-2 border-amber-950">
          ยินดีต้อนรับสู่โต๊ะแข่งขันเวชศาสตร์นิวเคลียร์
        </div>

        {/* Mascots Cheering */}
        <div className="flex items-end justify-center my-2 space-x-4">
          <MascotNew className="w-20 md:w-24 h-28 md:h-32 opacity-95" />
          <MascotGamma className="w-16 md:w-20 h-20 md:h-24 opacity-95" />
          <MascotMed className="w-20 md:w-24 h-28 md:h-32 opacity-95" />
        </div>

        {/* Primary Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full max-w-2xl mt-2">
          {/* 1. Create Room */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="wood-panel p-4 rounded-2xl text-left border-3 border-amber-950 hover:border-amber-400/80 transition-all hover:scale-103 group shadow-xl cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white mb-2 group-hover:rotate-6 transition-transform">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div className="font-game font-black text-lg text-white group-hover:text-amber-200 transition-colors">
              สร้างห้องประลอง
            </div>
            <div className="text-xs text-amber-200/80 mt-1">
              เปิดโต๊ะไพ่ใหม่ รับรหัส 6 หลัก สำหรับอาจารย์หรือโฮสต์
            </div>
          </button>

          {/* 2. Join Room */}
          <button
            onClick={() => setShowJoinModal(true)}
            className="wood-panel p-4 rounded-2xl text-left border-3 border-amber-950 hover:border-amber-400/80 transition-all hover:scale-103 group shadow-xl cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 border border-blue-400 flex items-center justify-center text-white mb-2 group-hover:rotate-6 transition-transform">
              <LogIn className="w-6 h-6" />
            </div>
            <div className="font-game font-black text-lg text-white group-hover:text-amber-200 transition-colors">
              เข้าห้องด้วยรหัส
            </div>
            <div className="text-xs text-amber-200/80 mt-1">
              กรอกรหัส 6 หลักเพื่อเข้าร่วมโต๊ะเล่นพร้อมเพื่อน
            </div>
          </button>

          {/* 3. Solo Practice vs Bot */}
          <button
            onClick={() => {
              alert("โหมดซ้อมเดี่ยวกับบอท (บอท-เรซิน, บอท-คอลลอยด์) กำลังจะเปิดใน Phase 3-4!");
            }}
            className="wood-panel p-4 rounded-2xl text-left border-3 border-amber-950 hover:border-amber-400/80 transition-all hover:scale-103 group shadow-xl cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 border border-purple-400 flex items-center justify-center text-white mb-2 group-hover:rotate-6 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <div className="font-game font-black text-lg text-white group-hover:text-amber-200 transition-colors">
              ซ้อมเดี่ยว vs AI Bot
            </div>
            <div className="text-xs text-amber-200/80 mt-1">
              ประลองความแม่นยำกับบอทเพื่อเก็บแต้ม NucCoin
            </div>
          </button>
        </div>

        {/* Secondary Hub Actions: Gallery, Shop, How to play */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <button
            onClick={onOpenGallery}
            className="wood-panel px-4 py-2 rounded-xl text-white text-xs md:text-sm font-bold flex items-center space-x-2 hover:scale-105 transition-transform border border-amber-500/40"
          >
            <Layers className="w-4 h-4 text-blue-400" />
            <span>อัลบั้มการ์ด 4 สี (/gallery)</span>
          </button>

          <button
            onClick={() => alert("ร้านค้าไอเทม NucCoin กำลังจะเปิดใน Phase 6 (สวมกรอบทอง, หลังไพ่ PET Ring, อวาตาร์)")}
            className="wood-panel px-4 py-2 rounded-xl text-white text-xs md:text-sm font-bold flex items-center space-x-2 hover:scale-105 transition-transform border border-amber-500/40"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>ร้านค้า NucCoin</span>
          </button>

          <button
            onClick={() => setShowHowToModal(true)}
            className="wood-panel px-4 py-2 rounded-xl text-white text-xs md:text-sm font-bold flex items-center space-x-2 hover:scale-105 transition-transform border border-amber-500/40"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>กติกาการเล่น</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full flex justify-center pb-3 z-20">
        <div className="text-[11px] text-amber-950 font-bold bg-white/70 px-4 py-1 rounded-full shadow">
          NucMed Arena — Mode 1: Localization Match • พัฒนาสำหรับรายวิชานิวเคลียร์เมดิซีน
        </div>
      </div>

      {/* How to play Modal */}
      {showHowToModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg wood-panel rounded-2xl p-6 text-white border-4 border-amber-950 shadow-2xl">
            <h3 className="text-xl font-bold font-game text-amber-200 mb-3">
              📖 กติกาการแข่งขัน Localization Match
            </h3>
            <div className="space-y-2.5 text-xs text-amber-100/90 leading-relaxed max-h-96 overflow-y-auto pr-2">
              <div className="p-2.5 bg-black/30 rounded-xl border border-blue-500/30">
                <span className="font-bold text-blue-300">1. การแจกไพ่:</span> ผู้เล่นทุกคนได้รับไพ่สารเภสัชรังสี (RP Blue) คนละ 5 ใบในมือ
              </div>
              <div className="p-2.5 bg-black/30 rounded-xl border border-red-500/30">
                <span className="font-bold text-red-300">2. เปิดโจทย์:</span> ในแต่ละรอบ โต๊ะจะเปิดการ์ดโจทย์ทางคลินิก (Case Card) 1 ข้อ
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>🟢 BASIC (โจทย์ตรง): 2 คะแนน</li>
                  <li>🔴 CLINICAL (วิเคราะห์อาการ): 4 คะแนน</li>
                </ul>
              </div>
              <div className="p-2.5 bg-black/30 rounded-xl border border-amber-500/30">
                <span className="font-bold text-amber-300">3. ตอบคำถาม:</span> เลือกไพ่สาร 1 ใบจากมือ + เลือกกลไก 1 อย่างจากแถบกลไกกลางโต๊ะ แล้วกด LOCK
              </div>
              <div className="p-2.5 bg-black/30 rounded-xl border border-emerald-500/30">
                <span className="font-bold text-emerald-300">4. เฉลยคะแนน:</span> ตอบถูกทั้งสารและกลไกได้คะแนนเต็ม ตอบผิดอย่างใดอย่างหนึ่งได้ 0 คะแนน
              </div>
            </div>
            <button
              onClick={() => setShowHowToModal(false)}
              className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold text-sm"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm wood-panel rounded-2xl p-6 text-white border-4 border-amber-950 shadow-2xl">
            <h3 className="text-lg font-bold font-game text-amber-200 mb-2">
              🚪 เข้าสู่ห้องประลอง
            </h3>
            <p className="text-xs text-amber-200/80 mb-4">
              กรอกรหัสห้อง 6 ตัวอักษรที่ได้รับจากเพื่อนหรืออาจารย์
            </p>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="เช่น 7K3Q2P"
              maxLength={6}
              className="w-full px-4 py-3 bg-amber-950/90 border-2 border-amber-500 rounded-xl text-center text-2xl font-mono font-bold tracking-widest text-amber-100 uppercase focus:outline-hidden focus:border-amber-300"
            />
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-2.5 bg-black/40 hover:bg-black/60 rounded-xl font-bold text-xs"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (joinCode.length !== 6) {
                    alert("รหัสห้องต้องมี 6 ตัวอักษร");
                    return;
                  }
                  alert(`กำลังเชื่อมต่อห้อง ${joinCode} (ระบบห้อง Socket.IO จะเปิดใน Phase 3)`);
                  setShowJoinModal(false);
                }}
                className="flex-1 py-2.5 bg-play hover:bg-play-hover border-2 border-play-border rounded-xl font-bold text-xs shadow-md"
              >
                เข้าร่วมห้อง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm wood-panel rounded-2xl p-6 text-white border-4 border-amber-950 shadow-2xl">
            <h3 className="text-lg font-bold font-game text-amber-200 mb-2">
              🛠️ ตั้งค่าห้องประลอง
            </h3>
            <div className="space-y-3 text-xs text-amber-200/90 mb-4">
              <div className="flex justify-between items-center">
                <span>จำนวนรอบแข่งขัน:</span>
                <span className="font-bold text-white bg-black/40 px-2 py-1 rounded">10 ข้อ</span>
              </div>
              <div className="flex justify-between items-center">
                <span>เวลาคิดต่อข้อ:</span>
                <span className="font-bold text-white bg-black/40 px-2 py-1 rounded">45 วินาที</span>
              </div>
              <div className="flex justify-between items-center">
                <span>สัดส่วน Basic / Clinical:</span>
                <span className="font-bold text-white bg-black/40 px-2 py-1 rounded">6 : 4</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 bg-black/40 hover:bg-black/60 rounded-xl font-bold text-xs"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  alert("สร้างห้องเรียบร้อย! ระบบ Multiplayer Room จะเชื่อมต่อใน Phase 3");
                  setShowCreateModal(false);
                }}
                className="flex-1 py-2.5 bg-play hover:bg-play-hover border-2 border-play-border rounded-xl font-bold text-xs shadow-md"
              >
                สร้างห้องทันที
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
