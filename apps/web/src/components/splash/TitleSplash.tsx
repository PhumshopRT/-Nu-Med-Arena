"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LabWorldBackground } from "./LabWorldBackground";
import { AmbientMotes } from "./FloatingCardIcons";
import { CyclotronReactorStage } from "./CyclotronReactorStage";
import { StudentLoginModal } from "./StudentLoginModal";
import { Play, LogIn, ShoppingBag, BookOpen, Volume2, VolumeX, Image as ImageIcon } from "lucide-react";
import { StudentUser, PROTOTYPE_4_CARDS } from "@nucmed/shared";
import { RpCard } from "@/components/cards/RpCard";
import { MechCard } from "@/components/cards/MechCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { ClueCard } from "@/components/cards/ClueCard";
import { sounds } from "@/lib/sound";
import { getLocalUser } from "@/lib/user";
import { jev } from "@/lib/jev-engine";

interface TitleSplashProps {
  onLoginSuccess: (user: StudentUser) => void;
  onOpenGallery?: () => void;
  onOpenHowTo?: () => void;
  onOpenShop?: () => void;
}

export function TitleSplash({ onLoginSuccess, onOpenGallery, onOpenHowTo, onOpenShop }: TitleSplashProps) {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sounds.playClick();
    }
  };

  const handleOpenJoinRoom = () => {
    sounds.playClick();
    const user = getLocalUser();
    if (user && user.studentId && jev.validateStudentId(user.studentId).isValid) {
      setShowJoinModal(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none z-0">
      {/* 1. Background game world: Sky (0-58%) & Wooden Deck Table (58-100%) [z-0] */}
      <LabWorldBackground />

      {/* 2. Ambient Drifting Glowing Radiation Motes [z-10] */}
      <AmbientMotes />

      {/* ========================================================
          3-ZONE CSS GRID FOREGROUND [z-20]
          Column 1: [ cards-left ]   (R-01 & M-03)
          Column 2: [ center stage ] (Sky + Deck, Mascots, PLAY)
          Column 3: [ cards-right ]  (C-05 & T-03)
          Guaranteed zero overlap between cards, mascots, and buttons
          ======================================================== */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-[210px_1fr_210px] lg:grid-cols-[230px_1fr_230px] xl:grid-cols-[250px_1fr_250px] h-full w-full pointer-events-none z-20">
        {/* ======================================================
            ZONE 1: [ cards-left ] Left Column (R-01 & M-03)
            Strictly bounded inside left grid column
            ====================================================== */}
        <div className="hidden md:flex flex-col justify-center items-center gap-3 lg:gap-4 h-full py-4 pointer-events-auto z-20 overflow-visible scale-[0.78] lg:scale-[0.85] xl:scale-[0.92] origin-center">
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

        {/* ======================================================
            ZONE 2: Center Stage (Sky 0-58% + Deck 58-100%)
            Mascots sit strictly ABOVE 58% horizon & PLAY button
            ====================================================== */}
        <div className="flex flex-col h-full w-full pointer-events-none z-20">
          {/* ----------------------------------------------------
              ZONE: [ sky 0–58% ]
              - Top status & controls bar [z-40]
              - 3D Game title & wooden subtitle plaque [z-30]
              - Mascots with 22px pill name tags [z-30]
              ---------------------------------------------------- */}
          <div className="w-full h-[58%] flex flex-col justify-between items-center px-4 md:px-8 pt-3 pb-2 z-20 pointer-events-none">
            {/* Top Bar: Mode status & quick links [z-40] */}
            <div className="w-full flex justify-between items-center pointer-events-auto z-40">
              {/* Left Mode Indicator */}
              <div className="bg-amber-950/85 backdrop-blur-md text-amber-200 text-xs px-4 py-1.5 rounded-full border-2 border-amber-500/60 flex items-center space-x-2.5 shadow-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold tracking-wider font-game">MODE 1: LOCALIZATION MATCH</span>
              </div>

              {/* Right Action Icons: Gallery & Sound Mute */}
              <div className="flex items-center space-x-2.5">
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

            {/* Central Logo & Wooden Subtitle Plaque [z-30] */}
            <div className="flex flex-col items-center text-center my-auto pointer-events-auto z-30">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                className="relative flex flex-col items-center"
              >
                {/* Radioactive Badge on top */}
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

            {/* Cyclotron Reactor Stage Centerpiece (Zero mascots, high-tech particle accelerator dais) [z-30] */}
            <div className="w-full flex justify-center pointer-events-auto z-30 mb-2 md:mb-4">
              <CyclotronReactorStage />
            </div>
          </div>

          {/* ----------------------------------------------------
              ZONE: [ deck 58–100% ]
              - Green 3D PLAY button sitting on wooden horizon [z-40]
              - 3 Secondary action buttons [z-40]
              - Credits plaque at bottom [z-40]
              ---------------------------------------------------- */}
          <div className="w-full h-[42%] flex flex-col justify-between items-center pt-1 pb-3 z-30 pointer-events-none">
            {/* PLAY Button: Straddling deck horizon [z-40] */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="pointer-events-auto z-40 mt-3 md:mt-4"
            >
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsLoginOpen(true);
                }}
                onMouseEnter={() => sounds.playSelect()}
                className="px-14 md:px-24 py-3.5 md:py-4.5 bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#047857] hover:from-[#4ade80] hover:to-[#059669] border-4 border-[#A7F3D0] rounded-2xl text-white font-game font-black text-2xl md:text-4xl tracking-widest shadow-[0_8px_0_#064e3b,0_14px_24px_rgba(0,0,0,0.65)] active:translate-y-2 active:shadow-[0_2px_0_#064e3b,0_6px_10px_rgba(0,0,0,0.4)] transition-all flex items-center space-x-3.5 cursor-pointer group"
              >
                <Play className="w-7 h-7 md:w-8 md:h-8 fill-white text-white group-hover:translate-x-1.5 transition-transform filter drop-shadow" />
                <span className="text-shadow-sub">PLAY</span>
              </button>
            </motion.div>

            {/* 3 Secondary Action Buttons below PLAY [z-40] */}
            <div className="flex flex-wrap items-center justify-center gap-3 pointer-events-auto z-40 my-auto">
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
              <div className="wood-panel px-6 py-1.5 rounded-lg border-2 border-amber-950 text-center shadow-lg">
                <span className="text-xs md:text-sm font-bold text-amber-200">
                  พัฒนาสำหรับรายวิชานิวเคลียร์เมดิซีน (Nuclear Medicine Educational Card Game)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            ZONE 3: [ cards-right ] Right Column (C-05 & T-03)
            Strictly bounded inside right grid column
            ====================================================== */}
        <div className="hidden md:flex flex-col justify-center items-center gap-3 lg:gap-4 h-full py-4 pointer-events-auto z-20 overflow-visible scale-[0.78] lg:scale-[0.85] xl:scale-[0.92] origin-center">
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
              onClick={() => {
                sounds.playClick();
                setShowHowToModal(false);
              }}
              className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold text-sm cursor-pointer"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
