"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, User as UserIcon, Loader2, CheckCircle2 } from "lucide-react";
import { getNaAccounts, saveNaAccounts, getLocalUser, saveLocalUser } from "@/lib/user";
import { sounds } from "@/lib/sound";
import { NucCoinIcon } from "@/components/ui/NucCoinIcon";

export default function ProfilePage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [studentId, setStudentId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [caption, setCaption] = useState("");
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    // Load current user
    const u = getLocalUser();
    if (!u) {
      router.push("/");
      return;
    }
    setStudentId(u.studentId);
    setDisplayName(u.displayName);
    setCoins(u.coins || 0);
    
    // Load extra fields like caption from na_accounts
    const accounts = getNaAccounts();
    const acc = accounts.find(a => a.studentId === u.studentId);
    if (acc && (acc as any).caption) {
      setCaption((acc as any).caption);
    }
    
    setLoading(false);
  }, [router]);

  const handleSave = () => {
    sounds.playClick();
    if (!displayName.trim()) return;
    
    setSaving(true);
    setTimeout(() => {
      // 1. Update na_accounts
      const accounts = getNaAccounts();
      const idx = accounts.findIndex(a => a.studentId === studentId);
      if (idx >= 0) {
        accounts[idx].displayName = displayName.trim();
        (accounts[idx] as any).caption = caption.trim();
        saveNaAccounts(accounts);
      }
      
      // 2. Update local current user (so hub sees it)
      const u = getLocalUser();
      u.displayName = displayName.trim();
      saveLocalUser(u);
      
      setSaving(false);
      setSuccess(true);
      sounds.playCorrect();
      
      setTimeout(() => setSuccess(false), 3000);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06211C] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06211C] text-slate-200 font-sans selection:bg-amber-500/30">
      {/* Topbar Navigation (JEV navSlot: topbar) */}
      <header className="sticky top-0 z-40 bg-[#0B3B36] border-b-2 border-amber-900/60 shadow-lg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { sounds.playClick(); router.push("/"); }}
            className="w-10 h-10 rounded-full bg-black/40 border border-amber-700/50 flex items-center justify-center hover:bg-black/60 hover:border-amber-400 text-amber-500 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-game font-black text-amber-400 tracking-wider">PROFILE <span className="text-amber-100/50">|</span> โปรไฟล์นักศึกษา</h1>
        </div>
      </header>

      {/* Main Content (JEV contentSlot: with-aside) */}
      <main className="max-w-6xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        
        {/* ASIDE: ID Card View */}
        <aside className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full aspect-[2.5/3.5] max-w-sm mx-auto bg-gradient-to-br from-amber-900 via-[#1A1A1A] to-[#0A0A0A] rounded-2xl border-4 border-amber-600 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden flex flex-col"
          >
            {/* Card Header */}
            <div className="h-16 bg-amber-950/80 border-b-2 border-amber-700 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
              <h2 className="font-game font-black text-amber-500 tracking-[0.2em] text-lg z-10 drop-shadow-md">NUC MED ARENA</h2>
            </div>
            
            {/* Card Body */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6 relative">
              <div className="w-32 h-32 rounded-full bg-black/60 border-4 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center">
                <UserIcon className="w-16 h-16 text-amber-400/50" />
              </div>
              
              <div className="text-center w-full">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">STUDENT ID</div>
                <div className="font-mono text-2xl text-amber-100 font-bold tracking-widest">{studentId}</div>
              </div>

              <div className="text-center w-full">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">DISPLAY NAME</div>
                <div className="font-game text-xl text-emerald-400 font-black truncate px-2">{displayName || "..."}</div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="h-14 bg-black/80 border-t-2 border-amber-800 flex items-center justify-between px-6">
              <span className="text-[10px] text-amber-500/50 font-mono">RTGAME LICENSE</span>
              <div className="flex items-center space-x-1.5">
                <NucCoinIcon size={16} />
                <span className="font-mono font-bold text-yellow-500 text-sm">{coins}</span>
              </div>
            </div>
          </motion.div>
        </aside>

        {/* MAIN: Edit Form */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0B3B36] border-2 border-amber-900/60 rounded-3xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-game font-black text-white mb-6 flex items-center">
              <span className="bg-amber-500 w-2 h-6 mr-3 rounded-sm"></span>
              แก้ไขข้อมูล (EDIT PROFILE)
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  รหัสนักศึกษา (Student ID)
                </label>
                <div className="w-full px-5 py-3 bg-black/40 border border-amber-900/50 rounded-xl text-amber-100/50 font-mono text-lg select-none cursor-not-allowed">
                  {studentId}
                </div>
                <p className="text-[10px] text-amber-500/50 mt-1.5">* รหัสนักศึกษาไม่สามารถเปลี่ยนแปลงได้</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  ชื่อเล่น / ชื่อในเกม (Display Name) *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={20}
                  className="w-full px-5 py-3 bg-black/60 border-2 border-amber-700/80 rounded-xl text-white font-bold text-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder-white/20"
                  placeholder="ตั้งชื่อที่เพื่อนๆ จำได้..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  แคปชั่นส่วนตัว (Personal Caption)
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={80}
                  rows={2}
                  className="w-full px-5 py-3 bg-black/60 border-2 border-amber-700/80 rounded-xl text-amber-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder-white/20 resize-none"
                  placeholder="เขียนอะไรสั้นๆ แนะนำตัวเอง (สูงสุด 80 ตัวอักษร)..."
                />
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-amber-900/50 flex items-center justify-between">
              <AnimatePresence>
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2 text-emerald-400 font-bold text-sm bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>บันทึกสำเร็จ!</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className={!success ? "w-full flex justify-end" : ""}>
                <button
                  onClick={handleSave}
                  disabled={saving || !displayName.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 border-2 border-amber-300 rounded-xl text-amber-950 font-black tracking-widest shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_20px_rgba(245,158,11,0.5)] active:translate-y-0.5 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>บันทึกข้อมูล (SAVE)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}
