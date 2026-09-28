"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AmbientMotes } from "./AmbientMotes";
import { StudentLoginModal } from "./StudentLoginModal";
import { Play, LogIn, ShoppingBag, BookOpen, Volume2, VolumeX, Image as ImageIcon } from "lucide-react";
import { StudentUser, PROTOTYPE_4_CARDS } from "@nucmed/shared";
import { RpCard } from "@/components/cards/RpCard";
import { MechCard } from "@/components/cards/MechCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { ClueCard } from "@/components/cards/ClueCard";
import { sounds } from "@/lib/sound";
import { getLocalUser, getRememberedUser } from "@/lib/user";
import { jev } from "@/lib/jev-engine";
import { getAssetPath } from "@/lib/assets";
import { NucCoinIcon } from "@/components/ui/NucCoinIcon";

interface TitleSplashProps {
  currentUser?: StudentUser | null;
  onLoginSuccess: (user: StudentUser) => void;
  onOpenGallery?: () => void;
  onOpenHowTo?: () => void;
  onOpenShop?: () => void;
  initialLoginOpen?: boolean;
}

const getAvatarIcon = (avatarId?: string) => {
  switch (avatarId) {
    case "avatar-thyroid": return "🦋";
    case "avatar-lung": return "🫁";
    case "av_bone": return "🦴";
    case "avatar-default":
    default: return "☢️";
  }
};

export function TitleSplash({ 
  currentUser, 
  onLoginSuccess, 
  onOpenGallery, 
  onOpenHowTo, 
  onOpenShop,
  initialLoginOpen = false
}: TitleSplashProps) {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(initialLoginOpen);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [rememberedUser, setRememberedUser] = useState<StudentUser | null>(currentUser || null);

  React.useEffect(() => {
    if (initialLoginOpen) {
      setIsLoginOpen(true);
    }
  }, [initialLoginOpen]);

  React.useEffect(() => {
    const user = currentUser || getRememberedUser();
    setRememberedUser(user);
  }, [currentUser]);

  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sounds.playClick();
    }
  };

  const handleOpenJoinRoom = () => {
    sounds.playClick();
    const user = rememberedUser || getLocalUser();
    if (user && user.studentId && jev.validateStudentId(user.studentId).isValid) {
      setShowJoinModal(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none z-0">
      {/* --------------------------------------------------------
          LAYER 1: splash-bg.webp เต็มจอ object-fit cover [z-0]
          -------------------------------------------------------- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <img
          src={getAssetPath("/scene/splash-bg.webp")}
          alt="NucMed Arena Laboratory Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Ambient Drifting Glowing Radiation Motes [z-5] */}
      <AmbientMotes />

      {/* --------------------------------------------------------
          LAYER 2: mascots.webp วางกึ่งกลาง ยืนบนเคาน์เตอร์ เหนือปุ่ม PLAY [z-10]
          Separate layer bottom-center, height <= 34vmin, shrunk if height < 700, never hidden in landscape
          -------------------------------------------------------- */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[20%] sm:bottom-[21%] md:bottom-[21.5%] lg:bottom-[22%] pointer-events-none z-10 flex flex-col items-center">
        <motion.img
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          src={getAssetPath("/scene/mascots.webp")}
          alt="NucMed Arena Mascots"
          className="h-[20vmin] sm:h-[24vmin] md:h-[28vmin] lg:h-[32vmin] max-h-[34vmin] [@media(max-height:700px)]:max-h-[24vmin] [@media(max-height:600px)]:max-h-[19vmin] w-auto max-w-[85vw] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
        />
      </div>

      {/* ========================================================
          3-ZONE CSS GRID FOREGROUND [z-20]
          Column 1: [ cards-left ]   (R-01 & M-03)
          Column 2: [ center stage ] (Logo on sky, PLAY on deck)
          Column 3: [ cards-right ]  (C-05 & T-03)
          Guaranteed zero overlap between cards, mascots, and buttons
          ======================================================== */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-[210px_1fr_210px] lg:grid-cols-[240px_1fr_240px] xl:grid-cols-[260px_1fr_260px] h-full w-full pointer-events-none z-20">
        {/* ------------------------------------------------------
            LAYER 5: ZONE 1 [ cards-left ] Left Column (R-01 & M-03) [z-25]
            ------------------------------------------------------ */}
        <div className="hidden md:flex flex-col justify-center items-center gap-3 lg:gap-4 h-full py-4 pointer-events-auto z-25 overflow-visible scale-[0.78] lg:scale-[0.85] xl:scale-[0.92] origin-center">
          {/* Upper Card: R-01 18F-FDG */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ rotate: -2 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            onHoverStart={() => sounds.playSelect()}
            className="cursor-pointer drop-shadow-[0_12px_22px_rgba(47,111,237,0.45)] overflow-visible shrink-0"
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
          >
            <MechCard card={PROTOTYPE_4_CARDS.mech} size="sm" isHoverable={false} />
          </motion.div>
        </div>

        {/* ------------------------------------------------------
            ZONE 2: Center Column
            ------------------------------------------------------ */}
        <div className="flex flex-col h-full w-full justify-between pointer-events-none z-20 pb-3">
          {/* LAYER 3: โลโก้ NucMed Arena และป้ายจับคู่สารเป็น HTML ทับฟ้า [z-20] */}
          <div className="w-full flex flex-col items-center px-4 md:px-8 pt-3 pointer-events-none">
            {/* Top Bar: Mode status & quick links [z-40] */}
            <div className="w-full flex justify-between items-center pointer-events-auto z-40 mb-1">
              {/* Left: Active User Plaque OR Mode Indicator */}
              {rememberedUser ? (
                <div className="wood-panel px-3.5 py-1.5 rounded-2xl border-2 border-amber-500/80 shadow-2xl flex items-center space-x-2.5 bg-amber-950/95 pointer-events-auto">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-200 flex items-center justify-center text-sm shadow shrink-0">
                    {getAvatarIcon(rememberedUser.equipped?.avatar)}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white font-game flex items-center space-x-1.5">
                      <span>{rememberedUser.displayName}</span>
                      <span className="text-[10px] text-amber-300 font-mono">({rememberedUser.studentId})</span>
                    </div>
                    <div className="text-[10.5px] text-amber-200 flex items-center space-x-1 font-mono">
                      <NucCoinIcon size={13} />
                      <span>{rememberedUser.coins ?? 120} NucCoin</span>
                      <span className="text-[8.5px] text-emerald-300 font-sans font-bold ml-1">● บัญชีปัจจุบัน</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setIsLoginOpen(true);
                    }}
                    className="ml-2 px-2.5 py-1 bg-amber-900/90 hover:bg-amber-800 text-amber-200 hover:text-white rounded-lg text-[10.5px] font-bold border border-amber-600/60 shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    title="สลับบัญชีหรือสมัครใหม่"
                  >
                    สลับบัญชี
                  </button>
                </div>
              ) : (
                <div className="bg-amber-950/85 backdrop-blur-md text-amber-200 text-xs px-4 py-1.5 rounded-full border-2 border-amber-500/60 flex items-center space-x-2.5 shadow-2xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold tracking-wider font-game">MODE 1: LOCALIZATION MATCH</span>
                </div>
              )}

              {/* Right Action Icons: Gallery & Sound Mute */}
              <div className="flex items-center space-x-2.5">
                {rememberedUser && (
                  <div className="hidden lg:flex bg-amber-950/85 backdrop-blur-md text-amber-200 text-xs px-3 py-1.5 rounded-full border border-amber-500/50 items-center space-x-2 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold tracking-wider font-game text-[11px]">LOCALIZATION MATCH</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onOpenGallery) onOpenGallery();
                    else router.push("/gallery");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg border-2 border-blue-300 flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>อัลบั้มการ์ด 4 สี</span>
                </button>

                <button
                  onClick={handleToggleMute}
                  className="bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-all border-2 border-amber-500/40 shadow-lg hover:scale-110 active:scale-90 cursor-pointer"
                  title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
                </button>
              </div>
            </div>

            {/* Central Logo & Wooden Subtitle Plaque [z-20] */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
              className="relative flex flex-col items-center text-center mt-0.5 pointer-events-auto"
            >
              {/* Radioactive Trefoil Badge on top */}
              <div className="relative mb-[-10px] z-30">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-2 md:border-3 border-amber-800 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <span className="text-lg md:text-xl filter drop-shadow">☢️</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-game text-amber-300 text-shadow-gold-title tracking-tight filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.7)] select-none">
                NucMed Arena
              </h1>

              {/* Wooden Subtitle Plaque */}
              <div className="wood-panel px-4 md:px-6 py-1 md:py-1.5 rounded-xl mt-0.5 text-center shadow-xl border-2 border-amber-950 flex flex-col items-center">
                <div className="text-amber-100 font-black text-xs md:text-sm font-game tracking-wider">
                  จับคู่สาร · จับคู่กลไก · รอบโต๊ะไพ่
                </div>
                <div className="text-amber-300/90 text-[8.5px] md:text-[10px] font-black tracking-widest uppercase mt-0.5">
                  LEARN • MATCH • PLAY • NUCLEAR MEDICINE
                </div>
              </div>
            </motion.div>
          </div>

          {/* Spacer pushing controls down to counter table area */}
          <div className="flex-1 pointer-events-none min-h-[40px]" />

          {/* ----------------------------------------------------
              LAYER 4 & 6: บนเคาน์เตอร์ไม้ (PLAY สี #2EAD4B + 3 ปุ่มใต้ PLAY) [z-30]
              ไม่มีแผงผู้เล่นมาทับบังตัวละคร mascots อีกต่อไป
              ---------------------------------------------------- */}
          <div className="w-full flex flex-col items-center pointer-events-none z-30 space-y-2">
            {/* 4) ปุ่ม PLAY สี #2EAD4B วางบนเคาน์เตอร์ไม้ [z-40] */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="pointer-events-auto z-40"
            >
              <button
                onClick={() => {
                  sounds.playClick();
                  if (rememberedUser) {
                    onLoginSuccess(rememberedUser);
                  } else {
                    setIsLoginOpen(true);
                  }
                }}
                onMouseEnter={() => sounds.playSelect()}
                className="px-14 md:px-24 py-3.5 md:py-4.5 bg-[#2EAD4B] hover:bg-[#25943f] border-4 border-[#86EFAC] rounded-2xl text-white font-game font-black text-2xl md:text-4xl tracking-widest shadow-[0_8px_0_#1b632c,0_14px_24px_rgba(0,0,0,0.65)] active:translate-y-2 active:shadow-[0_2px_0_#1b632c,0_6px_10px_rgba(0,0,0,0.4)] transition-all flex items-center space-x-3.5 cursor-pointer group"
              >
                <Play className="w-7 h-7 md:w-8 md:h-8 fill-white text-white group-hover:translate-x-1.5 transition-transform filter drop-shadow" />
                <span className="text-shadow-sub">PLAY</span>
              </button>
            </motion.div>

            {/* 6) ปุ่มเข้าห้อง / ร้านค้า / วิธีเล่น อยู่ใต้ PLAY [z-40] */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3 pointer-events-auto z-40">
              <button
                onClick={handleOpenJoinRoom}
                className="wood-panel px-4 py-2 rounded-xl text-amber-100 hover:text-white text-xs md:text-sm font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer border border-amber-600/50"
              >
                <LogIn className="w-4 h-4 text-emerald-300" />
                <span>เข้าห้องด้วยรหัส</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenShop) {
                    onOpenShop();
                  } else {
                    router.push("/shop");
                  }
                }}
                className="wood-panel px-4 py-2 rounded-xl text-amber-100 hover:text-white text-xs md:text-sm font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer border border-amber-600/50"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>ร้านค้า NucCoin</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setShowHowToModal(true);
                }}
                className="wood-panel px-4 py-2 rounded-xl text-amber-100 hover:text-white text-xs md:text-sm font-bold flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer border border-amber-600/50"
              >
                <BookOpen className="w-4 h-4 text-cyan-300" />
                <span>วิธีเล่น</span>
              </button>
            </div>

            {/* Bottom Credits Plaque [z-40] */}
            <div className="w-full flex justify-center pointer-events-auto z-40">
              <div className="wood-panel px-6 py-1 rounded-lg border border-amber-950 text-center shadow-lg">
                <span className="text-[11px] md:text-xs font-bold text-amber-200/90">
                  พัฒนาสำหรับรายวิชานิวเคลียร์เมดิซีน (Nuclear Medicine Educational Card Game)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------
            LAYER 5: ZONE 3 [ cards-right ] Right Column (C-05 & T-03) [z-25]
            ------------------------------------------------------ */}
        <div className="hidden md:flex flex-col justify-center items-center gap-3 lg:gap-4 h-full py-4 pointer-events-auto z-25 overflow-visible scale-[0.78] lg:scale-[0.85] xl:scale-[0.92] origin-center">
          {/* Upper Card: C-05 Suspected PE */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            style={{ rotate: 2 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            onHoverStart={() => sounds.playSelect()}
            className="cursor-pointer drop-shadow-[0_12px_22px_rgba(200,30,51,0.45)] overflow-visible shrink-0"
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
          >
            <ClueCard card={PROTOTYPE_4_CARDS.clue} size="sm" isHoverable={false} />
          </motion.div>
        </div>
      </div>

      {/* Student ID Login Modal [z-50] */}
      <StudentLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setRememberedUser(user);
          setIsLoginOpen(false);
          onLoginSuccess(user);
        }}
      />

      {/* Join Room Modal [z-50] */}
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
                onClick={() => {
                  sounds.playClick();
                  setShowJoinModal(false);
                }}
                className="flex-1 py-2.5 bg-black/40 hover:bg-black/60 rounded-xl font-bold text-xs cursor-pointer"
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
                className="flex-1 py-2.5 bg-play hover:bg-play-hover border-2 border-play-border rounded-xl font-bold text-xs shadow-md cursor-pointer"
              >
                เข้าร่วมห้อง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How to play Modal [z-50] */}
      {showHowToModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-xl wood-panel rounded-3xl p-5 sm:p-6 text-white border-4 border-amber-950 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
              <div className="flex items-center space-x-2">
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
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="mt-3 space-y-3 text-xs text-amber-100/90 leading-relaxed overflow-y-auto pr-1.5 scrollbar-thin">
              {/* Card 4 Types Grid */}
              <div className="bg-black/35 rounded-2xl p-3 border border-amber-500/30">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-2">
                  🃏 สำรับการ์ด 4 หมวดหลัก
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-400/50">
                    <span className="text-base block mb-0.5">🔵</span>
                    <strong className="text-blue-300 block">RP (น้ำเงิน)</strong>
                    <span className="text-slate-300 text-[9px]">สารเภสัชรังสี ในมือ 5 ใบ</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-400/50">
                    <span className="text-base block mb-0.5">🟡</span>
                    <strong className="text-amber-300 block">MECH (เหลือง)</strong>
                    <span className="text-amber-200/80 text-[9px]">12 กลไก แถบกลางโต๊ะ</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-400/50">
                    <span className="text-base block mb-0.5">🔴</span>
                    <strong className="text-rose-300 block">CASE (แดง)</strong>
                    <span className="text-rose-200/80 text-[9px]">โจทย์อาการ Basic / Clinical</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-400/50">
                    <span className="text-base block mb-0.5">🟢</span>
                    <strong className="text-emerald-300 block">CLUE (เขียว)</strong>
                    <span className="text-emerald-200/80 text-[9px]">คำใบ้อวัยวะ ปอด ไทรอยด์</span>
                  </div>
                </div>
              </div>

              {/* 4 Steps */}
              <div className="space-y-2">
                <div className="p-2.5 bg-black/30 rounded-xl border border-blue-500/30 flex items-start space-x-2.5">
                  <span className="px-2 py-0.5 bg-blue-600/80 rounded-md font-mono font-bold text-xs text-white shrink-0 mt-0.5">
                    STEP 1
                  </span>
                  <div>
                    <strong className="text-blue-200">รับไพ่สารรังสี 5 ใบในมือ:</strong>
                    <p className="text-[11px] text-blue-100/80 mt-0.5">
                      ดูไอโซโทป Modality (SPECT/PET) และคุณสมบัติของสารในมือแต่ละใบ
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-black/30 rounded-xl border border-rose-500/30 flex items-start space-x-2.5">
                  <span className="px-2 py-0.5 bg-rose-600/80 rounded-md font-mono font-bold text-xs text-white shrink-0 mt-0.5">
                    STEP 2
                  </span>
                  <div>
                    <strong className="text-rose-200">วิเคราะห์เคสกลางโต๊ะ (Case Card):</strong>
                    <p className="text-[11px] text-rose-100/80 mt-0.5">
                      อ่านอาการนำของผู้ป่วย เช่น ข้อบ่งชี้ตรวจกระดูก หรือสงสัยลิ่มเลือดอุดกั้นในปอด
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-950/40 rounded-xl border border-emerald-500/50 flex items-start space-x-2.5">
                  <span className="px-2 py-0.5 bg-emerald-600/80 rounded-md font-mono font-bold text-xs text-white shrink-0 mt-0.5">
                    CLUE
                  </span>
                  <div>
                    <strong className="text-emerald-300">ใบคำใบ้ส่วนตัว & กฎการหักแต้ม:</strong>
                    <p className="text-[11px] text-emerald-100/90 mt-0.5 leading-relaxed">
                      ผู้เล่นสามารถกดเปิดคำใบ้ส่วนตัวได้ คำใบ้จะแสดงเฉพาะบนจอคุณเท่านั้น (จอใหญ่และผู้เล่นอื่นมองไม่เห็น และเปิดแล้วห้ามปิดในตานั้น)
                    </p>
                    <div className="mt-1.5 p-2 bg-black/40 rounded-lg text-[10px] space-y-0.5 text-amber-200">
                      <div>• <strong>Basic (2 แต้ม):</strong> ไม่เปิดได้ 2 แต้ม | เปิดคำใบ้ได้ 1 แต้ม</div>
                      <div>• <strong>Clinical (4 แต้ม):</strong> ไม่เปิดได้ 4 แต้ม | เปิดคำใบ้ได้ 3 แต้ม</div>
                      <div className="text-rose-300">• <strong>ตอบผิด:</strong> ได้ 0 แต้มตามเดิม (หักแต้มเฉพาะคนเปิดเมื่อตอบถูก)</div>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-black/30 rounded-xl border border-amber-500/30 flex items-start space-x-2.5">
                  <span className="px-2 py-0.5 bg-amber-600/80 rounded-md font-mono font-bold text-xs text-white shrink-0 mt-0.5">
                    STEP 3
                  </span>
                  <div>
                    <strong className="text-amber-200">เลือกคู่สาร + กลไก แล้วกด LOCK:</strong>
                    <p className="text-[11px] text-amber-100/80 mt-0.5">
                      แตะ 1 การ์ด RP จากมือ + แตะ 1 กลไกจากแถบเลื่อน ◀ ▶ แล้วกดปุ่ม <strong>LOCK คำตอบ!</strong> ก่อนหมดเวลา 45 วินาที
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-black/30 rounded-xl border border-blue-500/30 flex items-start space-x-2.5">
                  <span className="px-2 py-0.5 bg-blue-600/80 rounded-md font-mono font-bold text-xs text-white shrink-0 mt-0.5">
                    STEP 4
                  </span>
                  <div>
                    <strong className="text-blue-200">เฉลยแต้มคะแนน & รับ NucCoin:</strong>
                    <p className="text-[11px] text-blue-100/80 mt-0.5">
                      เมื่อตอบถูกทั้งคู่ รับคะแนนเข้าสู่ตารางคะแนน พร้อมเหรียญ <strong>NucCoin</strong> และค่า <strong>XP</strong> ไปช้อปปิ้งในร้านค้า
                    </p>
                  </div>
                </div>
              </div>

              {/* Pro Tips Banner */}
              <div className="p-2.5 bg-amber-950/70 rounded-xl border border-amber-500/40 text-[11px] flex items-center space-x-2">
                <span className="text-base">💡</span>
                <span className="text-amber-200">
                  <strong>เคล็ดลับนักประลอง:</strong> เมื่อจบรอบจะมีช่วง <em>Hand Swap</em> ให้เลือกทิ้งการ์ดที่ไม่ถนัดเพื่อจั่วการ์ดใหม่ฟรี 1 ใบ!
                </span>
              </div>
            </div>

            {/* Bottom Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowHowToModal(false);
              }}
              className="w-full mt-3 py-2.5 bg-play hover:bg-play-hover border-2 border-play-border rounded-2xl font-game font-black text-sm text-white tracking-wider shadow-play-btn active:scale-98 transition-all cursor-pointer"
            >
              พร้อมแล้ว เข้าสู่สังเวียน!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
