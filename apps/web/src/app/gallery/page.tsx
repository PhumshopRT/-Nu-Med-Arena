"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  RADIOPHARMACEUTICAL_DECK, 
  MECHANISM_DECK, 
  CASE_DECK, 
  CLUE_DECK, 
  ALL_CARDS,
  AnyCard,
  CardType
} from "@nucmed/shared";
import { RpCard } from "@/components/cards/RpCard";
import { MechCard } from "@/components/cards/MechCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { ClueCard } from "@/components/cards/ClueCard";
import { CardBack } from "@/components/cards/CardBack";
import { 
  ArrowLeft, 
  Search, 
  Sparkles, 
  Layers, 
  RotateCw, 
  Filter, 
  X,
  BookOpen
} from "lucide-react";

export default function GalleryPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CardType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [selectedCard, setSelectedCard] = useState<AnyCard | null>(null);

  const toggleFlip = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter cards
  const filteredCards = ALL_CARDS.filter((card) => {
    if (selectedCategory !== "ALL" && card.type !== selectedCategory) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      card.id.toLowerCase().includes(q) ||
      card.titleEn.toLowerCase().includes(q) ||
      card.titleTh.toLowerCase().includes(q) ||
      card.subtitle?.toLowerCase().includes(q) ||
      card.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const renderCard = (card: AnyCard, isInspect = false) => {
    const isFlipped = !isInspect && flippedCards[card.id];

    if (isFlipped) {
      return (
        <CardBack 
          onClick={() => toggleFlip(card.id)} 
          className="w-full h-full" 
        />
      );
    }

    switch (card.type) {
      case "RP":
        return <RpCard card={card} isHoverable={!isInspect} onClick={() => !isInspect && setSelectedCard(card)} />;
      case "MECH":
        return <MechCard card={card} isHoverable={!isInspect} onClick={() => !isInspect && setSelectedCard(card)} />;
      case "CASE":
        return <CaseCard card={card} isHoverable={!isInspect} onClick={() => !isInspect && setSelectedCard(card)} />;
      case "CLUE":
        return <ClueCard card={card} isHoverable={!isInspect} onClick={() => !isInspect && setSelectedCard(card)} />;
    }
  };

  return (
    <div className="min-h-screen bg-felt-deep text-white flex flex-col justify-between selection:bg-amber-400 selection:text-slate-900">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 wood-panel px-4 md:px-8 py-3.5 border-b-4 border-amber-950 shadow-xl flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/70 text-amber-200 transition-colors border border-amber-500/30 flex items-center space-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-bold font-game hidden sm:inline">กลับสู่ฮับ</span>
          </button>

          <div>
            <h1 className="text-xl md:text-2xl font-black font-game text-amber-200 tracking-wide flex items-center space-x-2">
              <Layers className="w-6 h-6 text-amber-400" />
              <span>อัลบั้มการ์ด 4 หมวด (CARD GALLERY)</span>
            </h1>
            <p className="text-[11px] text-amber-300/80 font-medium">
              สำรับทั้งหมด 72 ใบ (RP 24 • กลไก 12 • โจทย์คลินิก 20 • คำใบ้ 16)
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อสาร / นิวไคลด์ / อวัยวะ..."
            className="w-full px-3.5 py-2 pl-9 bg-black/50 border border-amber-500/50 rounded-xl text-white placeholder-amber-200/40 text-xs focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-amber-400/60" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-amber-400/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Prototype Highlight Banner (Comparison with original prototype) */}
        <section className="bg-felt/80 rounded-3xl p-5 border-2 border-emerald-500/30 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-3 border-b border-emerald-600/30 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                <h2 className="text-lg md:text-xl font-black font-game text-amber-300">
                  ชุดการ์ดต้นฉบับ 4 สี (Master Reference Prototype)
                </h2>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                เทียบเคียงตามสเปกภาพต้นฉบับ R-01, M-03, C-05, T-03 (กดเพื่อพลิกดูด้านหลัง)
              </p>
            </div>

            <div className="bg-black/40 text-amber-200 text-xs px-3 py-1 rounded-full border border-amber-400/30 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>4 Core Colors • 63mm x 88mm Poker Aspect</span>
            </div>
          </div>

          {/* 4 Prototype Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* 1. R-01 18F-FDG */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[260px]">
                {renderCard(RADIOPHARMACEUTICAL_DECK[0])}
              </div>
              <button
                onClick={(e) => toggleFlip("R-01", e)}
                className="mt-2 text-[11px] font-bold text-blue-200 hover:text-white flex items-center space-x-1 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/40"
              >
                <RotateCw className="w-3 h-3" />
                <span>พลิกไพ่</span>
              </button>
            </div>

            {/* 2. M-03 Capillary Blockade */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[260px]">
                {renderCard(MECHANISM_DECK[2])}
              </div>
              <button
                onClick={(e) => toggleFlip("M-03", e)}
                className="mt-2 text-[11px] font-bold text-amber-200 hover:text-white flex items-center space-x-1 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/40"
              >
                <RotateCw className="w-3 h-3" />
                <span>พลิกไพ่</span>
              </button>
            </div>

            {/* 3. C-05 Pulmonary Embolism */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[260px]">
                {renderCard(CASE_DECK.find((c) => c.id === "C-05")!)}
              </div>
              <button
                onClick={(e) => toggleFlip("C-05", e)}
                className="mt-2 text-[11px] font-bold text-red-200 hover:text-white flex items-center space-x-1 bg-red-950/60 px-3 py-1 rounded-full border border-red-500/40"
              >
                <RotateCw className="w-3 h-3" />
                <span>พลิกไพ่</span>
              </button>
            </div>

            {/* 4. T-03 Target Thyroid */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[260px]">
                {renderCard(CLUE_DECK.find((c) => c.id === "T-03")!)}
              </div>
              <button
                onClick={(e) => toggleFlip("T-03", e)}
                className="mt-2 text-[11px] font-bold text-emerald-200 hover:text-white flex items-center space-x-1 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40"
              >
                <RotateCw className="w-3 h-3" />
                <span>พลิกไพ่</span>
              </button>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-amber-300 flex items-center space-x-1 mr-2">
              <Filter className="w-3.5 h-3.5" />
              <span>หมวดการ์ด:</span>
            </span>

            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedCategory === "ALL"
                  ? "bg-amber-500 text-slate-950 shadow-md font-black"
                  : "bg-black/40 text-amber-200 hover:bg-black/60 border border-amber-500/30"
              }`}
            >
              ทั้งหมด ({ALL_CARDS.length})
            </button>

            <button
              onClick={() => setSelectedCategory("RP")}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedCategory === "RP"
                  ? "bg-rp text-white shadow-md font-black border border-blue-300"
                  : "bg-black/40 text-blue-200 hover:bg-black/60 border border-blue-500/30"
              }`}
            >
              🔵 สารเภสัชรังสี ({RADIOPHARMACEUTICAL_DECK.length})
            </button>

            <button
              onClick={() => setSelectedCategory("MECH")}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedCategory === "MECH"
                  ? "bg-mech text-amber-950 shadow-md font-black border border-amber-300"
                  : "bg-black/40 text-amber-200 hover:bg-black/60 border border-amber-500/30"
              }`}
            >
              🟡 กลไก ({MECHANISM_DECK.length})
            </button>

            <button
              onClick={() => setSelectedCategory("CASE")}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedCategory === "CASE"
                  ? "bg-case text-white shadow-md font-black border border-red-300"
                  : "bg-black/40 text-red-200 hover:bg-black/60 border border-red-500/30"
              }`}
            >
              🔴 โจทย์คลินิก ({CASE_DECK.length})
            </button>

            <button
              onClick={() => setSelectedCategory("CLUE")}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedCategory === "CLUE"
                  ? "bg-clue text-white shadow-md font-black border border-emerald-300"
                  : "bg-black/40 text-emerald-200 hover:bg-black/60 border border-emerald-500/30"
              }`}
            >
              🟢 คำใบ้/เป้าหมาย ({CLUE_DECK.length})
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <div key={card.id} className="flex flex-col items-center">
                <div className="w-full max-w-[260px]">
                  {renderCard(card)}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => toggleFlip(card.id)}
                    className="text-[10px] font-bold text-amber-200 hover:text-white flex items-center space-x-1 bg-black/40 px-2.5 py-1 rounded-full border border-amber-500/30"
                  >
                    <RotateCw className="w-2.5 h-2.5" />
                    <span>พลิก</span>
                  </button>
                  <button
                    onClick={() => setSelectedCard(card)}
                    className="text-[10px] font-bold text-amber-200 hover:text-white flex items-center space-x-1 bg-black/40 px-2.5 py-1 rounded-full border border-amber-500/30"
                  >
                    <span>ซูมดูรายละเอียด</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-16 text-amber-200/60 font-game">
              ไม่พบการ์ดที่ตรงกับคำค้นหา "{searchQuery}"
            </div>
          )}
        </section>
      </main>

      {/* Card Detail Modal (Zoom / Lens) */}
      {selectedCard && (
        <div 
          onClick={() => setSelectedCard(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm cursor-default animate-[zoomIn_0.2s_ease-out]"
          >
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute -top-3 -right-3 z-30 p-2 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full">
              {renderCard(selectedCard, true)}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="wood-panel py-3 px-4 text-center border-t-2 border-amber-950 mt-12 text-xs text-amber-200/80">
        NucMed Arena — Mode 1: Localization Match • คลังสำรับการ์ดการศึกษาแพทย์นิวเคลียร์
      </footer>
    </div>
  );
}
