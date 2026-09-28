import React from "react";
import { motion } from "framer-motion";
import { MechanismCard } from "@nucmed/shared";
import { MechCard } from "./MechCard";

interface ExpandedMechPopupProps {
  expandedMechId: string | null;
  setExpandedMechId: (id: string | null) => void;
  allCards: MechanismCard[];
}

export function ExpandedMechPopup({
  expandedMechId,
  setExpandedMechId,
  allCards,
}: ExpandedMechPopupProps) {
  if (!expandedMechId) return null;
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
        <div className="pointer-events-auto drop-shadow-2xl">
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
