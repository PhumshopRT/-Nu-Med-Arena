"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCheck, ShieldCheck, Sparkles, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { StudentUser } from "@nucmed/shared";
import { jev } from "@/lib/jev-engine";

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: StudentUser) => void;
}

const SAMPLE_IDS = [
  { id: "68208307037", label: "ปี 68 (เลขที่ 37)" },
  { id: "67208307015", label: "ปี 67 (เลขที่ 15)" },
  { id: "66208307052", label: "ปี 66 (เลขที่ 52)" },
];

export function StudentLoginModal({ isOpen, onClose, onLoginSuccess }: StudentLoginModalProps) {
  const [studentId, setStudentId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Live JEV validation
  const validation = useMemo(() => {
    if (!studentId.trim()) return null;
    return jev.validateStudentId(studentId);
  }, [studentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = studentId.trim();
    const result = jev.validateStudentId(cleanId);

    if (!result.isValid) {
      setError(result.error || "รหัสนักศึกษาไม่ถูกต้อง");
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
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-amber-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Trefoil icon */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-amber-400 border-2 border-amber-600 flex items-center justify-center mb-2 shadow-lg">
                <span className="text-2xl">☢️</span>
              </div>
              <h3 className="text-2xl font-black font-game text-amber-200 text-shadow-sub">
                เข้าสู่สังเวียนไพ่นิวเคลียร์
              </h3>
              <p className="text-xs text-amber-100/80 mt-1 max-w-xs">
                เข้าสู่ระบบด้วยรหัสนักศึกษาตามรูปแบบสาขาวิชา <br />
                <span className="text-emerald-300 font-semibold">• ไม่ต้องจำรหัสผ่าน • ตรวจสอบความถูกต้องด้วย JEV Engine</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider">
                    รหัสนักศึกษา (11 หลัก) *
                  </label>
                  <span className="text-[10.5px] text-amber-400/90 font-mono">
                    [ปี 2 หลัก] + 2083070 + [00-55]
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value.replace(/\D/g, ""));
                      setError(null);
                    }}
                    placeholder="เช่น 68208307037"
                    maxLength={11}
                    autoFocus
                    className="w-full px-4 py-2.5 bg-amber-950/80 border-2 border-amber-600/80 rounded-xl text-white placeholder-amber-400/40 font-mono tracking-widest font-bold text-lg focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
                  />
                  <div className="absolute right-3 top-3">
                    {validation?.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-amber-400/60" />
                    )}
                  </div>
                </div>

                {/* Live JEV Structural Breakdown Badge */}
                {studentId.length > 0 && (
                  <div className="mt-1.5 p-2 rounded-lg bg-black/40 border border-amber-500/30 text-[11px] font-mono grid grid-cols-3 gap-1 text-center">
                    <div className={`p-1 rounded ${studentId.length >= 2 ? "bg-amber-900/60 text-amber-200" : "text-amber-500/50"}`}>
                      <div className="text-[9px] uppercase text-amber-400/80">ปี (2 หลัก)</div>
                      <div className="font-bold">{studentId.slice(0, 2) || "--"}</div>
                    </div>
                    <div className={`p-1 rounded ${studentId.length >= 9 ? (studentId.slice(2, 9) === "2083070" ? "bg-emerald-950/70 text-emerald-300 border border-emerald-500/40" : "bg-rose-950/70 text-rose-300 border border-rose-500/40") : "text-amber-500/50"}`}>
                      <div className="text-[9px] uppercase text-amber-400/80">สาขา (2083070)</div>
                      <div className="font-bold">{studentId.slice(2, 9) || "-------"}</div>
                    </div>
                    <div className={`p-1 rounded ${studentId.length === 11 ? (parseInt(studentId.slice(9, 11), 10) <= 55 ? "bg-emerald-950/70 text-emerald-300 border border-emerald-500/40" : "bg-rose-950/70 text-rose-300 border border-rose-500/40") : "text-amber-500/50"}`}>
                      <div className="text-[9px] uppercase text-amber-400/80">เลขที่ (00-55)</div>
                      <div className="font-bold">{studentId.slice(9, 11) || "--"}</div>
                    </div>
                  </div>
                )}

                {/* Quick Sample ID Chips */}
                <div className="mt-2 flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <span className="text-[10px] text-amber-300/80 font-medium">ตัวอย่างคลิกใส่:</span>
                  {SAMPLE_IDS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        setStudentId(sample.id);
                        setError(null);
                      }}
                      className="px-2 py-0.5 rounded-md bg-amber-900/60 hover:bg-amber-800 text-[10.5px] font-mono text-amber-200 border border-amber-600/40 hover:border-amber-400 transition-colors cursor-pointer"
                    >
                      {sample.id} ({sample.label})
                    </button>
                  ))}
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
                  className="w-full px-4 py-2 bg-amber-950/80 border-2 border-amber-600/80 rounded-xl text-white placeholder-amber-400/40 text-sm focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-950/90 border border-red-500 text-red-200 text-xs px-3 py-2 rounded-lg text-left font-medium flex items-start space-x-1.5"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit Play Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-play hover:bg-play-hover border-4 border-play-border rounded-xl text-white font-game font-black text-lg tracking-wider shadow-play-btn active:shadow-play-btn-pressed active:translate-y-1 transition-all flex items-center justify-center space-x-2 mt-3 cursor-pointer"
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
            <div className="mt-3.5 pt-2.5 border-t border-amber-800/60 flex items-center justify-center text-[11px] text-amber-300/70 space-x-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>รหัสจะถูกผูกกับสถิติคะแนนและเหรียญ NucCoin ประจำตัว</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
