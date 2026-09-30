"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Check, 
  Shield, 
  Layers, 
  Smile, 
  Award, 
  Zap,
  Eye,
  Sparkles,
  ShoppingBag,
  AlertCircle,
  Flame,
  Dice5
} from "lucide-react";
import { ShopItem } from "@nucmed/shared";
import { 
  SHOP_CATALOG, 
  getNaWallet, 
  setNaWallet, 
  getNaInventory, 
  setNaInventory, 
  getNaEquipped, 
  setNaEquipped, 
  getNaPreview, 
  setNaPreview, 
  clearNaPreview,
  isItemMatching,
  normalizeShopId,
  getEquippedSlot,
  setEquippedSlot,
  getPreviewSlot,
  setPreviewSlot,
  getNaShards,
  NaWallet,
  NaInventory,
  NaEquipped,
  NaPreview
} from "@/lib/user";
import { sounds } from "@/lib/sound";
import { NucCoinIcon } from "@/components/ui/NucCoinIcon";
import { LivePreviewPanel } from "@/components/shop/LivePreviewPanel";
import { HotCellGachaModal } from "@/components/shop/HotCellGachaModal";

type ShopTab = "frame" | "cardback" | "avatar" | "fx" | "title" | "table";

export default function ShopPage() {
  const router = useRouter();

  // Storage states
  const [wallet, setWallet] = useState<NaWallet>({ coins: 120 });
  const [inventory, setInventory] = useState<NaInventory>({ ownedIds: [] });
  const [shards, setShards] = useState<number>(0);
  const [isGachaOpen, setIsGachaOpen] = useState<boolean>(false);
  const [equipped, setEquipped] = useState<NaEquipped>({
    frame: "frame-graphite",
    back: "back-default",
    avatar: "avatar-default",
    fx: "fx-none",
    title: "title-none",
    table: "table-wood"
  });
  const [preview, setPreview] = useState<NaPreview>({
    frame: "frame-graphite",
    back: "back-default",
    avatar: "avatar-default",
    fx: "fx-none",
    title: "title-none",
    table: "table-wood"
  });

  const [activeTab, setActiveTab] = useState<ShopTab>("frame");
  const [faceUp, setFaceUp] = useState<boolean>(true);
  const [previewItemName, setPreviewItemName] = useState<string>("กรอบ Graphite ดั้งเดิม");
  const [isFxPlaying, setIsFxPlaying] = useState<boolean>(false);
  const [toastContent, setToastContent] = useState<React.ReactNode | null>(null);

  const refreshShopState = () => {
    setWallet(getNaWallet());
    setInventory(getNaInventory());
    setEquipped(getNaEquipped());
    setShards(getNaShards());
  };

  // Initialize storage states on mount
  useEffect(() => {
    const initialWallet = getNaWallet();
    const initialInventory = getNaInventory();
    const initialEquipped = getNaEquipped();
    const initialPreview = getNaPreview();

    setWallet(initialWallet);
    setInventory(initialInventory);
    setEquipped(initialEquipped);
    setShards(getNaShards());

    const activePreview = initialPreview || {
      frame: initialEquipped.frame,
      back: initialEquipped.back,
      avatar: initialEquipped.avatar,
      fx: initialEquipped.fx,
      title: initialEquipped.title,
      table: initialEquipped.table || "table-wood",
      faceUp: true
    };
    setPreview(activePreview);

    // Initial preview name based on equipped frame
    const curFrameItem = SHOP_CATALOG.find(i => isItemMatching(i.id, activePreview.frame));
    if (curFrameItem) {
      setPreviewItemName(curFrameItem.nameTh);
    }

    // Cleanup on leaving shop:
    // "na_preview แยกจากของที่สวมใส่ ปิดร้านแล้วล้าง preview ได้ ของที่ใส่ห้ามล้าง"
    return () => {
      clearNaPreview();
    };
  }, []);

  const showToast = (content: React.ReactNode) => {
    setToastContent(content);
    setTimeout(() => setToastContent(null), 3500);
  };

  const triggerFxBurst = () => {
    setIsFxPlaying(true);
    setTimeout(() => setIsFxPlaying(false), 2000);
  };

  // Switch Tab Handler
  const handleTabChange = (newTab: ShopTab) => {
    sounds.playClick();
    setActiveTab(newTab);

    // Contextual preview camera behavior
    if (newTab === "cardback") {
      setFaceUp(false);
    } else {
      setFaceUp(true);
    }

    if (newTab === "fx") {
      triggerFxBurst();
    }

    // Update previewItemName to the item equipped or previewed in this tab
    const curItemId = getPreviewSlot(preview, newTab) || getEquippedSlot(equipped, newTab);
    const curItem = SHOP_CATALOG.find(i => isItemMatching(i.id, curItemId));
    if (curItem) {
      setPreviewItemName(curItem.nameTh);
    }
  };

  // Preview Button Handler (works immediately without purchasing)
  const handlePreview = (item: ShopItem) => {
    sounds.playSelect();
    const updatedPreview = setPreviewSlot(preview, item.kind, item.id);

    if (item.kind === "cardback") {
      setFaceUp(false);
      updatedPreview.faceUp = false;
    } else if (item.kind === "frame") {
      setFaceUp(true);
      updatedPreview.faceUp = true;
    }

    if (item.kind === "fx") {
      triggerFxBurst();
    }

    setPreview(updatedPreview);
    setPreviewItemName(item.nameTh);
    setNaPreview(updatedPreview);
  };

  // Buy Button Handler
  const handleBuy = (item: ShopItem) => {
    // Check funds
    if (wallet.coins < item.price) {
      sounds.playWrong();
      showToast(
        <div className="flex items-center space-x-2 text-rose-300 font-bold">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>NucCoin ไม่พอ (ต้องการ {item.price} NucCoin แต่มีเพียง {wallet.coins})</span>
        </div>
      );
      return;
    }

    // Deduct coins immediately
    const remaining = wallet.coins - item.price;
    const nextWallet = { coins: remaining };
    setWallet(nextWallet);
    setNaWallet(nextWallet);

    // Add to inventory
    const nextOwned = Array.from(new Set([...inventory.ownedIds, item.id, normalizeShopId(item.id)]));
    const nextInventory = { ownedIds: nextOwned };
    setInventory(nextInventory);
    setNaInventory(nextInventory);

    // Update preview to this newly bought item
    handlePreview(item);

    sounds.playWin();

    // Required toast message: «ซื้อแล้ว เหลือ xx NucCoin»
    showToast(
      <div className="flex items-center space-x-2 text-amber-200 font-bold text-sm">
        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
        <span>ซื้อแล้ว เหลือ {remaining}</span>
        <NucCoinIcon size={18} />
        <span>NucCoin</span>
      </div>
    );
  };

  // Equip Button Handler
  const handleEquip = (item: ShopItem) => {
    sounds.playSelect();

    // Same category can only have 1 item equipped
    const nextEquipped = setEquippedSlot(equipped, item.kind, item.id);
    setEquipped(nextEquipped);
    setNaEquipped(nextEquipped);

    // Keep preview locked to equipped item
    handlePreview(item);

    showToast(
      <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
        <Check className="w-4 h-4 text-emerald-400" />
        <span>สวมใส่ "{item.nameTh}" เรียบร้อยแล้ว!</span>
      </div>
    );
  };

  // Filter items by category
  const filteredItems = SHOP_CATALOG.filter((i) => i.kind === activeTab);

  const tabs: { key: ShopTab; label: string; icon: React.ReactNode }[] = [
    { key: "frame", label: "กรอบการ์ด", icon: <Shield className="w-4 h-4" /> },
    { key: "cardback", label: "ลายหลังไพ่", icon: <Layers className="w-4 h-4" /> },
    { key: "avatar", label: "อวตาร", icon: <Smile className="w-4 h-4" /> },
    { key: "fx", label: "เอฟเฟกต์", icon: <Zap className="w-4 h-4" /> },
    { key: "title", label: "ฉายาเกียรติยศ", icon: <Award className="w-4 h-4" /> },
    { key: "table", label: "พื้นโต๊ะสังเวียน", icon: <Flame className="w-4 h-4 text-amber-400" /> },
  ];

  const getRarityBadge = (rarity?: string) => {
    switch (rarity) {
      case "legendary":
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 border border-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.6)]">
            ⭐ ตำนาน
          </span>
        );
      case "epic":
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white border border-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.5)]">
            ⚡ มหากาพย์
          </span>
        );
      case "rare":
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-600 to-blue-500 text-white border border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            🔷 หายาก
          </span>
        );
      case "common":
      default:
        return (
          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
            ทั่วไป
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-felt-table text-amber-50 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Table Felt Vignette & Grain */}
      <div className="fixed inset-0 pointer-events-none bg-radial-vignette opacity-80" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full flex flex-wrap justify-between items-center px-4 md:px-8 py-3 bg-amber-950/90 border-b-4 border-amber-900 shadow-2xl backdrop-blur-md gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              sounds.playClick();
              router.push("/");
            }}
            className="p-2 bg-amber-900/80 hover:bg-amber-800 rounded-xl text-amber-200 border-2 border-amber-600 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center space-x-1.5 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold font-game">หน้าหลัก</span>
          </button>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-900/90 border border-amber-500/60 flex items-center justify-center text-amber-300 shadow-inner">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="font-game font-black text-lg md:text-xl text-amber-200 tracking-wide">
                ร้านค้า NucCoin (COSMETIC SHOP)
              </h1>
              <p className="text-[10px] text-amber-300/80">ตกแต่งกรอบการ์ด ลายหลังไพ่ โต๊ะสังเวียน และฉายาประจำสังเวียน</p>
            </div>
          </div>
        </div>

        {/* User Balance & Hot Cell Mystery Gacha Launcher */}
        <div className="flex items-center space-x-2.5 md:space-x-3">
          {/* Hot Cell Gacha Launcher Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsGachaOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-yellow-400 hover:to-amber-300 text-slate-950 font-game font-black text-xs md:text-sm border-2 border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center space-x-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 animate-pulse"
          >
            <Dice5 className="w-4 h-4 text-slate-950" />
            <span>ตู้สล็อต Hot Cell (สุ่มรางวัล)</span>
          </button>

          {/* Shards Indicator */}
          <div className="hidden sm:flex bg-slate-900/90 border border-cyan-400/60 px-3 py-1.5 rounded-full items-center space-x-1.5 shadow-inner" title="เศษไอโซโทป (Isotope Shards) ได้รับเมื่อสุ่มได้ของซ้ำ">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-bold text-xs text-cyan-200">{shards}</span>
            <span className="text-[10px] text-cyan-300 font-bold uppercase">Shards</span>
          </div>

          {/* NucCoin Balance with 22px official game coin icon */}
          <div className="bg-amber-900/90 border-2 border-amber-500/80 px-3.5 py-1.5 rounded-full flex items-center space-x-2 shadow-inner">
            <NucCoinIcon size={22} className="animate-bounce" />
            <span className="font-mono font-bold text-sm md:text-base text-amber-200">
              {wallet.coins}
            </span>
            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">NucCoin</span>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastContent && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-950/95 text-amber-200 border-2 border-amber-400 px-6 py-2.5 rounded-2xl shadow-2xl backdrop-blur-sm"
          >
            {toastContent}
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
                  onClick={() => handleTabChange(tab.key)}
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
              const isOwned = inventory.ownedIds.some(id => isItemMatching(id, item.id)) || item.price === 0;
              const isEquipped = isItemMatching(getEquippedSlot(equipped, item.kind), item.id);
              const isCurrentlyPreviewed = isItemMatching(getPreviewSlot(preview, item.kind), item.id);

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  className={`relative wood-panel p-4 rounded-2xl border-3 transition-all flex flex-col justify-between ${
                    isCurrentlyPreviewed
                      ? "ring-3 ring-amber-400 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.55)] bg-amber-900/40"
                      : isEquipped
                      ? "border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] bg-emerald-950/30"
                      : "border-amber-950 hover:border-amber-500"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-game font-bold text-base text-amber-200">
                          {item.nameTh}
                        </span>
                        {getRarityBadge(item.rarity)}
                      </div>

                      {/* Status Badges */}
                      {isEquipped ? (
                        <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-300 shadow shrink-0">
                          <Check className="w-3 h-3" />
                          <span>สวมใส่อยู่</span>
                        </span>
                      ) : isOwned ? (
                        <span className="bg-blue-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400 shadow shrink-0">
                          มีแล้ว
                        </span>
                      ) : (
                        /* Price tag with 18px official coin icon */
                        <div className="flex items-center space-x-1 bg-amber-950/90 px-2 py-1 rounded-lg border border-amber-600/60 font-mono text-xs font-bold text-amber-300 shadow-inner shrink-0">
                          <NucCoinIcon size={18} />
                          <span>{item.price === 0 ? "ฟรี" : `${item.price}`}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-amber-200/80 leading-relaxed mb-4">
                      {item.descriptionTh}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-amber-900/50">
                    {/* Preview Button: works immediately without buying */}
                    <button
                      onClick={() => handlePreview(item)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95 ${
                        isCurrentlyPreviewed
                          ? "bg-amber-600 text-white border-amber-300 shadow-md"
                          : "bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border-amber-600/50"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isCurrentlyPreviewed ? "กำลังดู" : "ดูตัวอย่าง"}</span>
                    </button>

                    {/* Buy / Equip State Buttons */}
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
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border border-blue-400"
                      >
                        สวมใส่
                      </button>
                    ) : (
                      /* Buy button with 18px official coin icon */
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={wallet.coins < item.price}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 border flex items-center justify-center space-x-1.5 ${
                          wallet.coins < item.price
                            ? "bg-stone-800 text-stone-400 border-stone-600 cursor-not-allowed opacity-60"
                            : "bg-play hover:bg-play-hover text-white border-play-border cursor-pointer"
                        }`}
                      >
                        <span>ซื้อ {item.price}</span>
                        <NucCoinIcon size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Equipping Card Showcase (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center sticky top-24">
          <LivePreviewPanel
            frameId={preview.frame || equipped.frame}
            backId={preview.back || equipped.back}
            avatarId={preview.avatar || equipped.avatar}
            fxId={preview.fx || equipped.fx}
            titleId={preview.title || equipped.title}
            tableId={preview.table || equipped.table || "table-wood"}
            faceUp={faceUp}
            previewItemName={previewItemName}
            activeTab={activeTab}
            onToggleFlip={() => setFaceUp(prev => !prev)}
            isFxPlaying={isFxPlaying}
            onPlayFx={triggerFxBurst}
          />
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full py-3 bg-amber-950/90 border-t-2 border-amber-900 text-center text-xs text-amber-300/80">
        NucMed Arena • สะสม NucCoin จากการตอบคำถามถูกเพื่อแลกไอเทมตกแต่งโต๊ะแข่ง
      </footer>

      {/* Hot Cell Mystery Gacha Modal */}
      <HotCellGachaModal
        isOpen={isGachaOpen}
        onClose={() => {
          setIsGachaOpen(false);
          refreshShopState();
        }}
        onRewardReceived={() => {
          refreshShopState();
        }}
      />
    </div>
  );
}
