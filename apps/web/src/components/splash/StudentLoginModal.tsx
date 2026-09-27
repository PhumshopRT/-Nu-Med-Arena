"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCheck, ShieldCheck, Sparkles, BookOpen } from "lucide-react";
import { StudentUser } from "@nucmed/shared";

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: StudentUser) => void;
}

export function StudentLoginModal({ isOpen, onClose, onLoginSuccess }: StudentLoginModalProps) {
  const [studentId, setStudentId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = studentId.trim().toUpperCase();
    if (!cleanId) {
      setError("กรุณากรอกรหัสนักศึกษา");
      return;
    }
    if (cleanId.length < 6 || cleanId.length > 16) {
      setError("รหัสนักศึกษาต้องมีความยาว 6-16 ตัวอักษร");
      return;
    }

    setLoading(true);

    // Default student user profile
    const existingData = localStorage.getItem(`nucmed_user_${cleanId}`);
    let user: StudentUser;

    if (existingData) {
      try {
        user = JSON.parse(existingData);
        if (displayName.trim()) {
          user.displayName = displayName.trim();
        }
      } catch {
        user = createNewUser(cleanId, displayName);
      }
    } else {
      user = createNewUser(cleanId, displayName);
    }

    localStorage.setItem(`nucmed_user_${cleanId}`, JSON.stringify(user));
    localStorage.setItem("nucmed_current_user", JSON.stringify(user));

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(user);
    }, 400);
  };

  function createNewUser(id: string, name: string): StudentUser {
    return {
      studentId: id,
      displayName: name.trim() || `นักศึกษา ${id.slice(-4)}`,
      xp: 0,
      coins: 0,
      equipped: {
        frame: "frame_graphite",
        cardback: "back_navy",
        avatar: "av_fdg",
        fx: "fx_confetti",
        title: "title_blockader",
      },
    };
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md wood-panel rounded-2xl p-6 text-white shadow-2xl border-4 border-amber-900"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-amber-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Trefoil icon */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-amber-400 border-2 border-amber-600 flex items-center justify-center mb-2 shadow-lg">
                <span className="text-2xl">☢️</span>
              </div>
              <h3 className="text-2xl font-black font-game text-amber-200 text-shadow-sub">
                เข้าสู่สังเวียนไพ่นิวเคลียร์
              </h3>
              <p className="text-xs text-amber-100/80 mt-1 max-w-xs">
                เข้าสู่ระบบด้วยรหัสนักศึกษาโดยตรง <br />
                <span className="text-emerald-300 font-semibold">• ไม่ต้องจำรหัสผ่าน • เก็บแต้มสะสมเหรียญอัตโนมัติ</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">
                  รหัสนักศึกษา (Student ID) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                    placeholder="เช่น 651234567"
                    maxLength={16}
                    autoFocus
                    className="w-full px-4 py-3 bg-amber-950/80 border-2 border-amber-600/80 rounded-xl text-white placeholder-amber-400/40 font-mono tracking-widest font-bold text-lg focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all uppercase"
                  />
                  <ShieldCheck className="absolute right-3 top-3.5 w-5 h-5 text-amber-400/60" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">
                  ชื่อเล่น / Display Name (ถ้าต้องการระบุ)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="เช่น ภูมิ หรือ หมอนิว"
                  maxLength={20}
                  className="w-full px-4 py-2.5 bg-amber-950/80 border-2 border-amber-600/80 rounded-xl text-white placeholder-amber-400/40 text-sm focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-900/80 border border-red-500 text-red-200 text-xs px-3 py-2 rounded-lg text-center font-medium">
                  {error}
                </div>
              )}

              {/* Submit Play Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-play hover:bg-play-hover border-4 border-play-border rounded-xl text-white font-game font-black text-lg tracking-wider shadow-play-btn active:shadow-play-btn-pressed active:translate-y-1 transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer"
              >
                {loading ? (
                  <span>กำลังเชื่อมต่อห้องปฏิบัติการ...</span>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    <span>เข้าสู่เกม (ENTER GAME)</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Info */}
            <div className="mt-4 pt-3 border-t border-amber-800/60 flex items-center justify-center text-[11px] text-amber-300/70 space-x-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>รหัสจะถูกผูกกับสถิติคะแนนและเหรียญ NucCoin ประจำตัว</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
