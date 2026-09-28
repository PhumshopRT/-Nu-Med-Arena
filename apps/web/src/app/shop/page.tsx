"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Coins, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Shield, 
  Layers, 
  Smile, 
  Award, 
  Zap,
  Volume2,
  VolumeX
} from "lucide-react";
import { StudentUser, ShopItem } from "@nucmed/shared";
import { SHOP_CATALOG, getLocalUser, saveLocalUser } from "@/lib/user";
import { sounds } from "@/lib/sound";
import { jev } from "@/lib/jev-engine";
import { CardFrame } from "@/components/cards/CardFrame";
import { CardBack } from "@/components/cards/CardBack";
import { RpCard } from "@/components/cards/RpCard";
import { ALL_RP_CARDS } from "@nucmed/shared";

type ShopTab = "frame" | "cardback" | "avatar" | "fx" | "title";

const DEFAULT_OWNED = [
  "frame_graphite",
  "back_navy",
  "av_fdg",
  "fx_confetti",
  "title_blockader"
];

export default function ShopPage() {
  const router = useRouter();
  const [user, setUser] = useState<StudentUser | null>(null);
  const [activeTab, setActiveTab] = useState<ShopTab>("frame");
  const [previewItem, setPreviewItem] = useState<ShopItem | null>(null);
  const [ownedItems, setOwnedItems] = useState<string[]>(DEFAULT_OWNED);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getLocalUser();
    // Ensure new player has at least 120 initial coins
    if (loaded && (typeof loaded.coins !== "number" || (loaded.coins === 0 && !localStorage.getItem(`nucmed_inventory_${loaded.studentId}`)))) {
      loaded.coins = 120;
      saveLocalUser(loaded);
    }
    setUser(loaded);

    // Retrieve owned items from storage if available
    try {
      const savedOwned = localStorage.getItem(`nucmed_inventory_${loaded.studentId}`);
      if (savedOwned) {
        const parsed = JSON.parse(savedOwned);
        const merged = Array.from(new Set([...DEFAULT_OWNED, ...parsed]));
        setOwnedItems(merged);
        localStorage.setItem(`nucmed_inventory_${loaded.studentId}`, JSON.stringify(merged));
      } else {
        setOwnedItems(DEFAULT_OWNED);
        localStorage.setItem(`nucmed_inventory_${loaded.studentId}`, JSON.stringify(DEFAULT_OWNED));
      }
    } catch {
      setOwnedItems(DEFAULT_OWNED);
    }
  }, []);

  const sampleCard = ALL_RP_CARDS[0]; // R-01 18F-FDG

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuy = (item: ShopItem) => {
    if (!user) return;
    const check = jev.validateShopPurchase(user.coins, item.price);
    if (!check.canAfford) {
      sounds.playWrong();
      showToast(`❌ ${check.reason}`);
      return;
    }

    sounds.playWin();
    const updatedUser: StudentUser = {
      ...user,
      coins: check.remainingCoins,
      equipped: {
        ...user.equipped,
        [item.kind]: item.id
      }
    };
    const nextOwned = [...ownedItems, item.id];

    setUser(updatedUser);
    setOwnedItems(nextOwned);
    saveLocalUser(updatedUser);
    localStorage.setItem(`nucmed_inventory_${user.studentId}`, JSON.stringify(nextOwned));
    showToast(`🎉 ปลดล็อกและสวมใส่ "${item.nameTh}" เรียบร้อยแล้ว! (คงเหลือ ${check.remainingCoins} 🪙)`);
  };

  const handleEquip = (item: ShopItem) => {
    if (!user) return;
    sounds.playSelect();
    const updatedUser: StudentUser = {
      ...user,
      equipped: {
        ...user.equipped,
        [item.kind]: item.id
      }
    };
    setUser(updatedUser);
    saveLocalUser(updatedUser);
    showToast(`✨ สวมใส่ "${item.nameTh}" เรียบร้อยแล้ว!`);
  };

  const filteredItems = SHOP_CATALOG.filter((i) => i.kind === activeTab);

  const tabs: { key: ShopTab; label: string; icon: React.ReactNode }[] = [
    { key: "frame", label: "กรอบการ์ด", icon: <Shield className="w-4 h-4" /> },
    { key: "cardback", label: "ลายหลังไพ่", icon: <Layers className="w-4 h-4" /> },
    { key: "avatar", label: "อวาตาร์", icon: <Smile className="w-4 h-4" /> },
    { key: "fx", label: "เอฟเฟกต์", icon: <Zap className="w-4 h-4" /> },
    { key: "title", label: "ฉายาเกียรติยศ", icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="relative min-h-screen bg-felt-table text-amber-50 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Table Felt Vignette & Grain */}
      <div className="fixed inset-0 pointer-events-none bg-radial-vignette opacity-80" />

      {/* Top Header Bar */}
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
            <span className="text-xs font-bold font-game">หน้าหลัก</span>
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🛍️</span>
            <div>
              <h1 className="font-game font-black text-lg md:text-xl text-amber-200 tracking-wide">
                ร้านค้า NucCoin (COSMETIC SHOP)
              </h1>
              <p className="text-[10px] text-amber-300/80">ตกแต่งกรอบการ์ด ลายหลังไพ่ และฉายาประจำสังเวียน</p>
            </div>
          </div>
        </div>

        {/* User Balance */}
        <div className="flex items-center space-x-3">
          <div className="bg-amber-900/90 border-2 border-amber-500/80 px-3.5 py-1.5 rounded-full flex items-center space-x-2 shadow-inner">
            <Coins className="w-5 h-5 text-amber-400 animate-bounce" />
            <span className="font-mono font-bold text-sm md:text-base text-amber-200">
              {user?.coins ?? 0}
            </span>
            <span className="text-xs text-amber-300 font-bold">🪙 NucCoin</span>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-950 text-amber-200 border-2 border-amber-400 px-6 py-2.5 rounded-2xl shadow-2xl font-bold text-sm"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Category Tabs & Item Grid (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-5">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 bg-amber-950/70 p-2 rounded-2xl border-2 border-amber-900/80 shadow-lg">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab(tab.key);
                  }}
                  className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg border-2 border-amber-300 scale-102"
                      : "text-amber-200/80 hover:text-white hover:bg-amber-900/50"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Item Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isOwned = ownedItems.includes(item.id);
              const isEquipped = user?.equipped[item.kind] === item.id;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  className={`relative wood-panel p-4 rounded-2xl border-3 transition-all flex flex-col justify-between ${
                    isEquipped
                      ? "border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] bg-emerald-950/30"
                      : "border-amber-950 hover:border-amber-500"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-game font-bold text-base text-amber-200">
                        {item.nameTh}
                      </div>
                      {isEquipped ? (
                        <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-300">
                          <Check className="w-3 h-3" />
                          <span>สวมใส่อยู่</span>
                        </span>
                      ) : isOwned ? (
                        <span className="bg-blue-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400">
                          มีแล้ว
                        </span>
                      ) : (
                        <div className="flex items-center space-x-1 bg-amber-950/90 px-2 py-1 rounded-lg border border-amber-600/60 font-mono text-xs font-bold text-amber-300">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          <span>{item.price === 0 ? "ฟรี" : `${item.price} 🪙`}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-amber-200/80 leading-relaxed mb-4">
                      {item.descriptionTh}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-amber-900/50">
                    <button
                      onClick={() => {
                        sounds.playSelect();
                        setPreviewItem(item);
                      }}
                      className="flex-1 py-2 bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 text-xs font-bold rounded-xl border border-amber-600/50 transition-colors"
                    >
                      ดูตัวอย่าง
                    </button>

                    {isEquipped ? (
                      <button
                        disabled
                        className="flex-1 py-2 bg-emerald-800/60 text-emerald-200 text-xs font-bold rounded-xl cursor-default border border-emerald-600/40"
                      >
                        ใช้งานอยู่
                      </button>
                    ) : isOwned ? (
                      <button
                        onClick={() => handleEquip(item)}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                      >
                        สวมใส่ทันที
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        className="flex-1 py-2 bg-play hover:bg-play-hover text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 border border-play-border"
                      >
                        ซื้อ {item.price} 🪙
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Equipping Card Showcase (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full wood-panel p-5 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col items-center">
            <h3 className="font-game font-black text-amber-200 text-sm md:text-base mb-1 tracking-wide">
              🎨 ตัวอย่างสด (LIVE PREVIEW)
            </h3>
            <p className="text-[11px] text-amber-300/80 text-center mb-4">
              การ์ดและหลังไพ่ที่จะแสดงบนโต๊ะแข่ง
            </p>

            {/* Card & Back Display */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 my-2">
              {/* Front with Equipped Frame */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-amber-300 mb-1">หน้าการ์ด (FACE)</span>
                <div className={`p-1.5 rounded-2xl transition-all ${
                  user?.equipped.frame === "frame_gold" 
                    ? "bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                    : user?.equipped.frame === "frame_reactor"
                    ? "bg-gradient-to-r from-emerald-400 via-green-200 to-teal-400 shadow-[0_0_20px_rgba(52,211,153,0.7)] animate-pulse"
                    : "bg-slate-700/60 shadow-lg"
                }`}>
                  <RpCard card={sampleCard} size="md" />
                </div>
              </div>

              {/* Back Card Preview */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-amber-300 mb-1">หลังไพ่ (BACK)</span>
                <CardBack 
                  size="md" 
                  theme={
                    user?.equipped.cardback === "back_hotcell"
                      ? "hotcell"
                      : user?.equipped.cardback === "back_pet"
                      ? "pet"
                      : "navy"
                  } 
                />
              </div>
            </div>

            {/* Equipped Title & Avatar Info */}
            <div className="w-full mt-4 p-3 bg-amber-950/80 rounded-xl border border-amber-700/60 text-center">
              <div className="text-[10px] text-amber-300 uppercase font-bold">ฉายาปัจจุบัน:</div>
              <div className="text-xs font-black text-white font-game mt-0.5">
                {SHOP_CATALOG.find((i) => i.id === user?.equipped.title)?.nameTh || "Capillary Blockader"}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full py-3 bg-amber-950/90 border-t-2 border-amber-900 text-center text-xs text-amber-300/80">
        NucMed Arena • สะสม NucCoin จากการตอบคำถามถูกเพื่อแลกไอเทมตกแต่งโต๊ะแข่ง
      </footer>
    </div>
  );
}
