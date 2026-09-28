"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StudentUser, PROTOTYPE_4_CARDS, generateRoomCode } from "@nucmed/shared";
import { sounds } from "@/lib/sound";
import { getAssetPath } from "@/lib/assets";
import { AmbientMotes } from "../splash/AmbientMotes";
import { RpCard } from "../cards/RpCard";
import { MechCard } from "../cards/MechCard";
import { CaseCard } from "../cards/CaseCard";
import { ClueCard } from "../cards/ClueCard";
import { NucCoinIcon } from "@/components/ui/NucCoinIcon";
import { getNaWallet } from "@/lib/user";
import { 
  PlusCircle, 
  LogIn, 
  Bot, 
  ShoppingBag, 
  BookOpen, 
  LogOut, 
  Coins, 
  Sparkles,
  Layers,
  Tv,
  ShieldCheck,
  Zap,
  Activity,
  Volume2,
  VolumeX,
  X,
  ArrowRight
} from "lucide-react";

interface HomeHubProps {
  user: StudentUser;
  onLogout: () => void;
  onOpenGallery: () => void;
}

export function HomeHub({ user, onLogout, onOpenGallery }: HomeHubProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StudentUser>(user);
  const [joinCode, setJoinCode] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Synchronize student data from localStorage on mount and window focus
  // Ensures coin deductions from /shop persist and reflect immediately on return
  useEffect(() => {
    const syncUser = () => {
      try {
        const wallet = getNaWallet();
        const saved = localStorage.getItem("nucmed_current_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.coins = wallet.coins;
          setCurrentUser(parsed);
          return;
        }
        const studentSaved = localStorage.getItem(`nucmed_user_${user.studentId}`);
        if (studentSaved) {
          const parsed = JSON.parse(studentSaved);
          parsed.coins = wallet.coins;
          setCurrentUser(parsed);
          return;
        }
        setCurrentUser({ ...user, coins: wallet.coins });
      } catch {
        setCurrentUser(user);
      }
    };

    syncUser();
    window.addEventListener("focus", syncUser);
    return () => window.removeEventListener("focus", syncUser);
  }, [user]);

  // Level calculation
  const level = Math.floor((currentUser.xp || 0) / 100) + 1;
  const currentXpInLevel = (currentUser.xp || 0) % 100;

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between items-center select-none">
      {/* --------------------------------------------------------
          LAYER 1: splash-bg.webp เต็มจอ object-fit cover (ใช้พื้นหลังเดียวกับหน้าปก)
          ลบกล่องขาว 3 อันบนฟ้าเรียบร้อย ไม่มีบล็อกเมฆทึบบนฟ้า
          -------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={getAssetPath("/scene/splash-bg.webp")}
          alt="NucMed Arena Laboratory Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Ambient Drifting Glowing Radiation Motes [z-5] */}
      <AmbientMotes />

      {/* --------------------------------------------------------
          LAYER 2: Top Bar Header [z-30]
          Left: Player Profile Wood Plaque (นักศึกษา 7052)
          Right: NucCoins Balance with official 28px game coin + Sound + Logout
          วางชั้นบนสุด ห้ามการ์ดทับ
          -------------------------------------------------------- */}
      <header className="w-full flex justify-between items-center px-4 md:px-8 py-3.5 z-30 pointer-events-auto">
        {/* Left: Player Profile Wood Plaque */}
        <div className="wood-panel px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-2xl border-3 border-amber-950 backdrop-blur-xs">
          <div className="w-11 h-11 rounded-full bg-amber-400 border-2 border-amber-600 flex items-center justify-center text-xl shadow-inner">
            ☢️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white font-game">{currentUser.displayName}</span>
              <span className="bg-emerald-600/90 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40">
                LV.{level}
              </span>
            </div>
            <div className="text-[11px] text-amber-200/90 font-mono font-semibold">
              ID: {currentUser.studentId}
            </div>
            {/* XP progress bar */}
            <div className="w-28 md:w-36 h-2 bg-black/50 rounded-full mt-1 overflow-hidden border border-amber-500/40">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all duration-300"
                style={{ width: `${currentXpInLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: NucCoins Balance with 28px game coin + Sound + Logout */}
        <div className="flex items-center space-x-2.5">
          {/* NucCoin Balance Plaque */}
          <div className="wood-panel px-4 py-2 rounded-2xl flex items-center space-x-2.5 shadow-2xl border-2 border-amber-950 backdrop-blur-xs">
            <NucCoinIcon size={28} className="animate-bounce" />
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-300 uppercase font-black tracking-wider">NucCoin</span>
              <span className="font-bold text-sm text-white font-mono">{currentUser.coins}</span>
            </div>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={handleToggleMute}
            className="p-2.5 rounded-2xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2.5 rounded-2xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* --------------------------------------------------------
          LAYER 3: 3-ZONE MAIN ARENA [z-20]
          Column 1: [ cards-left ]  ริมจอซ้าย ต่ำกว่าแผงโปรนักศึกษา 7052 (R-01 & M-03)
          Column 2: [ center-hub ]  ปุ่มสร้างห้อง เข้าห้อง ซ้อมบอท อัลบั้ม ร้าน จอฉาย แอดมิน กติกา
          Column 3: [ cards-right ] ริมจอขวา ต่ำกว่าแผง NucCoin 120 (C-05 & T-03)
          รับประกันศูนย์เปอร์เซ็นต์การทับซ้อน (Zero Overlap Guaranteed)
          -------------------------------------------------------- */}
      <main className="flex-1 w-full grid grid-cols-1 md:grid-cols-[210px_1fr_210px] lg:grid-cols-[240px_1fr_240px] xl:grid-cols-[265px_1fr_265px] items-center px-3 md:px-6 z-20 overflow-hidden pointer-events-none">
        {/* ------------------------------------------------------
            ZONE 1: Left Column (R-01 บน, M-03 ล่าง)
            อยู่ต่ำกว่าแผงนักศึกษา 7052 ไม่มีการทับซ้อน
            ------------------------------------------------------ */}
        <div className="hidden md:flex flex-col justify-center items-center gap-3 lg:gap-4 h-full pointer-events-auto z-20 scale-[0.76] lg:scale-[0.84] xl:scale-[0.90] origin-left">
          {/* Upper Card: R-01 18F-FDG */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ rotate: -2 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            onHoverStart={() => sounds.playSelect()}
            className="cursor-pointer drop-shadow-[0_12px_22px_rgba(47,111,237,0.45)] overflow-visible shrink-0"
            title="R-01: 18F-FDG (Radiopharmaceutical)"
          >
            <RpCard card={PROTOTYPE_4_CARDS.rp} size="sm" isHoverable={false} />
          </motion.div>

          {/* Lower Card: M-03 Capillary Blockade */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            style={{ rotate: 2 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            onHoverStart={() => sounds.playSelect()}
            className="cursor-pointer drop-shadow-[0_12px_22px_rgba(230,161,0,0.45)] overflow-visible shrink-0"
            title="M-03: Capillary Blockade (Mechanism)"
          >
            <MechCard card={PROTOTYPE_4_CARDS.mech} size="sm" isHoverable={false} />
          </motion.div>
        </div>

        {/* ------------------------------------------------------
            ZONE 2: Center Column (ศูนย์รวมการประลอง ARENA HUB)
            ------------------------------------------------------ */}
        <div className="flex flex-col items-center justify-center text-center px-2 lg:px-4 pointer-events-auto z-20 w-full max-w-2xl mx-auto">
          {/* Arena Title Badge & Trefoil */}
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
            className="flex flex-col items-center mb-1"
          >
            <div className="relative mb-[-8px] z-30">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-2 md:border-3 border-amber-800 flex items-center justify-center shadow-lg">
                <span className="text-base md:text-lg">☢️</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-game text-amber-300 text-shadow-gold-title filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] tracking-tight">
              ศูนย์รวมการประลอง
            </h1>

            <div className="wood-panel px-4 md:px-6 py-1 rounded-xl mt-1 text-center shadow-xl border-2 border-amber-950 flex flex-col items-center">
              <div className="text-amber-100 font-black text-xs md:text-sm font-game tracking-wider">
                ยินดีต้อนรับสู่โต๊ะแข่งขันเวชศาสตร์นิวเคลียร์ • ARENA HUB
              </div>
            </div>
          </motion.div>

          {/* High-Tech Arena Status HUD */}
          <div className="flex items-center justify-center my-2.5 space-x-2.5 pointer-events-auto">
            <div className="px-3.5 py-1 rounded-xl bg-slate-950/85 border-2 border-amber-400/60 shadow-lg backdrop-blur-md flex items-center space-x-2.5 text-[11px] font-mono">
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold">SYSTEM ACTIVE</span>
              </div>
              <div className="w-[1px] h-3.5 bg-amber-600/40" />
              <div className="flex items-center space-x-1 text-cyan-300">
                <Activity className="w-3 h-3" />
                <span>CYCLOTRON 511 keV</span>
              </div>
              <div className="w-[1px] h-3.5 bg-amber-600/40" />
              <div className="flex items-center space-x-1 text-amber-300 font-bold">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>JEV DECISION ENGINE READY</span>
              </div>
            </div>
          </div>

          {/* 3 Primary Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mt-1">
            {/* 1. สร้างห้องประลอง */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                sounds.playClick();
                setShowCreateModal(true);
              }}
              className="wood-panel p-3.5 rounded-2xl text-left border-3 border-amber-950 hover:border-emerald-400/80 transition-all group shadow-xl cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white mb-2 group-hover:rotate-6 transition-transform shadow-md">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div className="font-game font-black text-base text-white group-hover:text-emerald-200 transition-colors">
                สร้างห้องประลอง
              </div>
              <div className="text-[11px] text-amber-200/80 mt-0.5 leading-snug line-clamp-2">
                เปิดโต๊ะไพ่ใหม่ รับรหัส 6 หลัก สำหรับอาจารย์หรือโฮสต์
              </div>
            </motion.button>

            {/* 2. เข้าห้องด้วยรหัส */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                sounds.playClick();
                setShowJoinModal(true);
              }}
              className="wood-panel p-3.5 rounded-2xl text-left border-3 border-amber-950 hover:border-blue-400/80 transition-all group shadow-xl cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 border border-blue-400 flex items-center justify-center text-white mb-2 group-hover:rotate-6 transition-transform shadow-md">
                <LogIn className="w-5 h-5" />
              </div>
              <div className="font-game font-black text-base text-white group-hover:text-blue-200 transition-colors">
                เข้าห้องด้วยรหัส
              </div>
              <div className="text-[11px] text-amber-200/80 mt-0.5 leading-snug line-clamp-2">
                กรอกรหัส 6 หลักเพื่อเข้าร่วมโต๊ะเล่นพร้อมเพื่อน
              </div>
            </motion.button>

            {/* 3. ซ้อมเดี่ยว vs AI Bot */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                sounds.playClick();
                router.push("/play/SOLO_PRACTICE");
              }}
              className="wood-panel p-3.5 rounded-2xl text-left border-3 border-amber-950 hover:border-purple-400/80 transition-all group shadow-xl cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600 border border-purple-400 flex items-center justify-center text-white mb-2 group-hover:rotate-6 transition-transform shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div className="font-game font-black text-base text-white group-hover:text-purple-200 transition-colors">
                ซ้อมเดี่ยว vs AI
              </div>
              <div className="text-[11px] text-amber-200/80 mt-0.5 leading-snug line-clamp-2">
                ประลองความแม่นยำกับบอทเพื่อเก็บแต้ม NucCoin
              </div>
            </motion.button>
          </div>

          {/* 5 Secondary Action Buttons: อัลบั้ม, ร้าน, จอฉาย, แอดมิน, กติกา */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
            {/* 4. อัลบั้มการ์ด 4 สี */}
            <button
              onClick={() => {
                sounds.playClick();
                if (onOpenGallery) onOpenGallery();
                else router.push("/gallery");
              }}
              className="wood-panel px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all border border-blue-400/50 shadow-md cursor-pointer hover:border-blue-300"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>อัลบั้มการ์ด 4 สี</span>
            </button>

            {/* 5. ร้านค้า NucCoin */}
            <button
              onClick={() => {
                sounds.playClick();
                router.push("/shop");
              }}
              className="wood-panel px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all border border-amber-400/50 shadow-md cursor-pointer hover:border-amber-300"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>ร้านค้า NucCoin</span>
            </button>

            {/* 6. จอฉายห้องเรียน (Projector) */}
            <button
              onClick={() => {
                sounds.playClick();
                router.push("/board/ROOM01");
              }}
              className="wood-panel px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all border border-purple-400/50 shadow-md cursor-pointer hover:border-purple-300"
            >
              <Tv className="w-3.5 h-3.5 text-purple-400" />
              <span>จอฉาย (Projector)</span>
            </button>

            {/* 7. แผงอาจารย์ (Admin) */}
            <button
              onClick={() => {
                sounds.playClick();
                router.push("/admin");
              }}
              className="wood-panel px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all border border-emerald-400/50 shadow-md cursor-pointer hover:border-emerald-300"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>แผงอาจารย์ (Admin)</span>
            </button>

            {/* 8. กติกาการเล่น */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowHowToModal(true);
              }}
              className="wood-panel px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all border border-cyan-400/50 shadow-md cursor-pointer hover:border-cyan-300"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
              <span>กติกาการเล่น</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------
            ZONE 3: Right Column (C-05 บน, T-03 ล่าง)
            อยู่ต่ำกว่าแผง NucCoin 120 ไม่มีการทับซ้อน
            ------------------------------------------------------ */}
        <div className="hidden md:flex flex-col justify-center items-center gap-3 lg:gap-4 h-full pointer-events-auto z-20 scale-[0.76] lg:scale-[0.84] xl:scale-[0.90] origin-right">
          {/* Upper Card: C-05 Suspected PE */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            style={{ rotate: 2 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            onHoverStart={() => sounds.playSelect()}
            className="cursor-pointer drop-shadow-[0_12px_22px_rgba(200,30,51,0.45)] overflow-visible shrink-0"
            title="C-05: Suspected PE (Case Card)"
          >
            <CaseCard card={PROTOTYPE_4_CARDS.caseCard} size="sm" isHoverable={false} />
          </motion.div>

          {/* Lower Card: T-03 Target: Thyroid */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            style={{ rotate: -2 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            onHoverStart={() => sounds.playSelect()}
            className="cursor-pointer drop-shadow-[0_12px_22px_rgba(14,138,88,0.45)] overflow-visible shrink-0"
            title="T-03: Target Thyroid (Clue Card)"
          >
            <ClueCard card={PROTOTYPE_4_CARDS.clue} size="sm" isHoverable={false} />
          </motion.div>
        </div>
      </main>

      {/* --------------------------------------------------------
          LAYER 4: Footer Info [z-20]
          -------------------------------------------------------- */}
      <footer className="w-full flex justify-center pb-2.5 z-20 pointer-events-auto">
        <div className="text-[11px] text-amber-200/90 font-bold wood-panel px-5 py-1 rounded-full border border-amber-950/80 shadow-md">
          NucMed Arena — Mode 1: Localization Match • พัฒนาสำหรับรายวิชานิวเคลียร์เมดิซีน
        </div>
      </footer>

      {/* --------------------------------------------------------
          MODAL: กติกาการเล่น (How to play Modal) [z-50]
          -------------------------------------------------------- */}
      <AnimatePresence>
        {showHowToModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="relative w-full max-w-xl wood-panel rounded-3xl p-5 sm:p-6 text-white border-4 border-amber-950 shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl">📖</span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black font-game text-amber-200">
                      คู่มือกติกา NucMed Arena
                    </h3>
                    <p className="text-[10px] sm:text-xs text-amber-300/80">
                      Mode 1: Localization Match · ประลองจับคู่สารและกลไก
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowHowToModal(false);
                  }}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 border border-amber-500/40 text-amber-200 flex items-center justify-center font-bold text-sm cursor-pointer transition-transform hover:scale-110 active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="mt-3 space-y-2.5 text-xs text-amber-100/90 leading-relaxed overflow-y-auto pr-2 scrollbar-thin">
                <div className="p-3 bg-black/35 rounded-xl border border-blue-500/30">
                  <span className="font-bold text-blue-300 text-sm">1. การแจกไพ่ในมือ:</span>
                  <p className="mt-1">
                    ผู้เล่นทุกคนจะได้รับไพ่สารเภสัชรังสี (RP Card) คนละ 5 ใบในมือ สำหรับเลือกตอบในแต่ละรอบ
                  </p>
                </div>
                <div className="p-3 bg-black/35 rounded-xl border border-rose-500/30">
                  <span className="font-bold text-rose-300 text-sm">2. เปิดการ์ดโจทย์ (Case Card):</span>
                  <p className="mt-1">
                    ระบบจะเปิดโจทย์ทางคลินิก 1 ข้อต่อรอบ แบ่งเป็น 2 ระดับ:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5">
                    <li>🟢 <span className="font-bold text-emerald-300">BASIC (โจทย์ตรง):</span> 2 คะแนน</li>
                    <li>🔴 <span className="font-bold text-rose-300">CLINICAL (วิเคราะห์อาการ/โรค):</span> 4 คะแนน</li>
                  </ul>
                </div>
                <div className="p-3 bg-black/35 rounded-xl border border-amber-500/30">
                  <span className="font-bold text-amber-300 text-sm">3. ตอบคำถามภายในเวลา:</span>
                  <p className="mt-1">
                    เลือกไพ่สาร 1 ใบจากมือ + เลือกกลไก 1 อย่างจากแถบกลไกกลางโต๊ะ แล้วกด <span className="text-emerald-400 font-bold">LOCK</span> ยืนยันคำตอบ
                  </p>
                </div>
                <div className="p-3 bg-black/35 rounded-xl border border-emerald-500/30">
                  <span className="font-bold text-emerald-300 text-sm">4. การคิดคะแนนและรางวัล:</span>
                  <p className="mt-1">
                    ตอบถูกทั้งสารและกลไกรับคะแนนเต็ม + เหรียญ NucCoin สำหรับนำไปซื้อกรอบการ์ดและฉายาในร้านค้า!
                  </p>
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowHowToModal(false);
                }}
                className="w-full mt-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-xl font-bold font-game text-sm text-white shadow-lg cursor-pointer transition-all active:scale-98"
              >
                เข้าใจแล้ว เข้าสู่การประลอง
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------
          MODAL: เข้าห้องด้วยรหัส (Join Room Modal) [z-50]
          -------------------------------------------------------- */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="relative w-full max-w-sm wood-panel rounded-2xl p-6 text-white border-4 border-amber-950 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold font-game text-amber-200 flex items-center space-x-2">
                  <span>🚪</span>
                  <span>เข้าสู่ห้องประลอง</span>
                </h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="p-1 rounded-full hover:bg-black/30 text-amber-300/80 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-amber-200/80 mb-4">
                กรอกรหัสห้อง 6 ตัวอักษรที่ได้รับจากเพื่อนหรืออาจารย์
              </p>

              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="เช่น ROOM01 หรือ 7K3Q2P"
                maxLength={8}
                className="w-full px-4 py-3 bg-amber-950/90 border-2 border-amber-500 rounded-xl text-center text-xl font-mono font-bold tracking-widest text-amber-100 uppercase focus:outline-hidden focus:border-amber-300 shadow-inner"
              />

              <div className="flex space-x-2 mt-5">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowJoinModal(false);
                  }}
                  className="flex-1 py-2.5 bg-black/40 hover:bg-black/60 rounded-xl font-bold text-xs cursor-pointer border border-amber-900/50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    if (joinCode.trim().length === 0) {
                      alert("กรุณากรอกรหัสห้อง");
                      return;
                    }
                    sounds.playClick();
                    setShowJoinModal(false);
                    router.push(`/lobby/?code=${joinCode.trim().toUpperCase()}`);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-400 rounded-xl font-bold text-xs shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <span>เข้าร่วมห้อง</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------
          MODAL: ตั้งค่าสร้างห้องประลอง (Create Room Modal) [z-50]
          -------------------------------------------------------- */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="relative w-full max-w-sm wood-panel rounded-2xl p-6 text-white border-4 border-amber-950 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold font-game text-amber-200 flex items-center space-x-2">
                  <span>🛠️</span>
                  <span>ตั้งค่าห้องประลอง</span>
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-full hover:bg-black/30 text-amber-300/80 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-amber-200/90 mb-4 bg-black/35 p-3 rounded-xl border border-amber-600/30">
                <div className="flex justify-between items-center">
                  <span>จำนวนรอบแข่งขัน:</span>
                  <span className="font-bold text-white bg-black/50 px-2 py-0.5 rounded border border-amber-500/30">10 ข้อ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>เวลาคิดต่อข้อ:</span>
                  <span className="font-bold text-white bg-black/50 px-2 py-0.5 rounded border border-amber-500/30">45 วินาที</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>สัดส่วน Basic / Clinical:</span>
                  <span className="font-bold text-white bg-black/50 px-2 py-0.5 rounded border border-amber-500/30">6 : 4</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowCreateModal(false);
                  }}
                  className="flex-1 py-2.5 bg-black/40 hover:bg-black/60 rounded-xl font-bold text-xs cursor-pointer border border-amber-900/50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowCreateModal(false);
                    const generated = generateRoomCode();
                    router.push(`/lobby/?code=${generated}&create=true`);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-400 rounded-xl font-bold text-xs shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <span>สร้างห้องทันที</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
