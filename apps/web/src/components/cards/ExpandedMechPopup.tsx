import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MechanismCard } from "@nucmed/shared";
import { MechCard } from "./MechCard";

interface ExpandedMechPopupProps {
  expandedMechId: string | null;
  setExpandedMechId: (id: string | null) => void;
  isCollapsed: boolean;
  onCollapse: () => void;
  allCards: MechanismCard[];
}

export function ExpandedMechPopup({
  expandedMechId,
  setExpandedMechId,
  isCollapsed,
  onCollapse,
  allCards,
}: ExpandedMechPopupProps) {
  if (!expandedMechId || isCollapsed) return null;
  const card = allCards.find((m) => m.id === expandedMechId);
  if (!card) return null;

  return (
    <>
      {/* Mobile / iPad Portrait: Bottom Sheet */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="md:hidden fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center justify-end pointer-events-none"
      >
        <div className="w-full max-h-[70vh] bg-black/95 backdrop-blur-xl border-t-2 border-amber-500/50 rounded-t-3xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pointer-events-auto flex flex-col items-center pb-8 overflow-y-auto scrollbar-none">
          <div className="w-full max-w-[420px] flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold text-amber-200">รายละเอียดกลไก {card.id}</span>
            <button
              type="button"
              onClick={onCollapse}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-amber-300/50 bg-amber-900/90 px-3 py-2 text-xs font-black text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
              aria-label={`ย่อการ์ดกลไก ${card.id}`}
            >
              <ChevronDown className="h-4 w-4" /> ย่อการ์ด
            </button>
          </div>
          <div
            className="w-12 h-1.5 bg-slate-600 rounded-full mb-4 cursor-pointer hover:bg-slate-500 transition-colors"
            onClick={() => setExpandedMechId(null)}
          />
          <MechCard card={card} size="md" isHoverable={false} />
        </div>
      </motion.div>

      {/* Desktop / iPad Landscape: Floating Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="hidden md:flex fixed z-[60] bottom-[260px] lg:bottom-[280px] left-4 lg:left-12 pointer-events-none"
      >
        <div className="pointer-events-auto flex flex-col items-start gap-2 drop-shadow-2xl">
          <button
            type="button"
            onClick={onCollapse}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-amber-200/60 bg-black/90 px-3 py-2 text-xs font-black text-amber-100 shadow-lg hover:bg-amber-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
            aria-label={`ย่อการ์ดกลไก ${card.id}`}
          >
            <ChevronDown className="h-4 w-4" /> ย่อการ์ด {card.id}
          </button>
          <MechCard
            card={card}
            size="md"
            isHoverable={false}
            className="shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2 border-amber-400"
          />
        </div>
      </motion.div>
    </>
  );
}
