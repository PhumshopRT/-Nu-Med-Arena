"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  UserCheck, 
  UserPlus, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  LogIn, 
  KeyRound,
  Check,
  Eye,
  EyeOff,
  Lock,
  ShieldAlert
} from "lucide-react";
import { StudentUser } from "@nucmed/shared";
import { jev } from "@/lib/jev-engine";
import { 
  getNaAccounts, 
  registerNaAccount, 
  loginNaAccount, 
  removeRegisteredAccount, 
  NaAccount,
  setAdminAuthenticated
} from "@/lib/user";
import { sounds } from "@/lib/sound";
import { NucCoinIcon } from "@/components/ui/NucCoinIcon";

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: StudentUser) => void;
  initialMode?: "login" | "register";
}

const SAMPLE_IDS = [
  { id: "68208307037", label: "ปี 68 (ภูมิ)" },
  { id: "67208307015", label: "ปี 67 (ธันวา)" },
  { id: "66208307052", label: "ปี 66 (นศ. 7052)" },
];

const AVATAR_OPTIONS = [
  { id: "avatar-default", icon: "☢️", label: "¹⁸F-FDG", color: "from-amber-400 to-amber-600" },
  { id: "avatar-thyroid", icon: "🦋", label: "ไทรอยด์", color: "from-amber-400 to-orange-500" },
  { id: "avatar-lung", icon: "🫁", label: "ปอด/เส้นเลือด", color: "from-cyan-400 to-blue-600" },
  { id: "av_bone", icon: "🦴", label: "ผลึกกระดูก", color: "from-slate-200 to-slate-400" },
];

export function StudentLoginModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialMode = "login"
}: StudentLoginModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [studentId, setStudentId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("avatar-default");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<NaAccount[]>([]);
  const [registeredSuccessUser, setRegisteredSuccessUser] = useState<StudentUser | null>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Sync saved accounts whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const accounts = getNaAccounts();
      setSavedAccounts(accounts);
      setError(null);
      setPassword("");
      setRegisteredSuccessUser(null);
    }
  }, [isOpen]);

  const isAdminInput = studentId.trim().toLowerCase() === "admin";

  // Live JEV validation
  const validation = useMemo(() => {
    if (!studentId.trim() || isAdminInput) return null;
    return jev.validateStudentId(studentId);
  }, [studentId, isAdminInput]);

  // Switch tab handler
  const handleTabSwitch = (newMode: "login" | "register") => {
    sounds.playSelect();
    setMode(newMode);
    setError(null);
    setPassword("");
  };

  // Quick select saved account
  const handleSelectSavedAccount = (account: NaAccount) => {
    sounds.playSelect();
    setStudentId(account.studentId);
    setPassword("");
    setError(null);
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 50);
  };

  // Delete saved account from device
  const handleDeleteAccount = (e: React.MouseEvent, idToDelete: string) => {
    e.stopPropagation();
    sounds.playClick();
    removeRegisteredAccount(idToDelete);
    setSavedAccounts(getNaAccounts());
    if (studentId === idToDelete) {
      setStudentId("");
      setPassword("");
    }
  };

  // Quick helper to use displayName as password
  const handleUseDisplayNameAsPassword = () => {
    sounds.playClick();
    if (displayName.trim()) {
      setPassword(displayName.trim());
      setError(null);
    } else {
      setError("กรุณากรอกชื่อที่โชว์ด้านบนก่อนเพื่อนำมาตั้งเป็นรหัสผ่าน");
    }
  };

  // Form submission (Login or Register)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = studentId.trim();
    const cleanPass = password.trim();

    // ---------------------------------------------------------
    // ADMIN LOGIN CHECK (username "admin" & password "rtkmpht")
    // ---------------------------------------------------------
    if (cleanId.toLowerCase() === "admin") {
      if (cleanPass === "rtkmpht") {
        sounds.playWin();
        setAdminAuthenticated(true);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          onClose();
          router.push("/admin");
        }, 300);
        return;
      } else {
        sounds.playWrong();
        setError("รหัสผ่านผู้ดูแลระบบ (Admin) ไม่ถูกต้อง");
        return;
      }
    }

    if (mode === "register") {
      // ---------------------------------------------------------
      // REGISTER FLOW
      // ---------------------------------------------------------
      const result = jev.validateStudentId(cleanId);
      if (!result.isValid) {
        setError(result.error || "รหัสนักศึกษาไม่ถูกต้อง");
        return;
      }

      if (!displayName.trim()) {
        setError("กรุณากรอกชื่อที่โชว์ด้านบน");
        return;
      }

      if (!cleanPass) {
        setError("กรุณาตั้งรหัสผ่านสำหรับเข้าสู่ระบบ");
        return;
      }

      setLoading(true);
      try {
        const res = registerNaAccount({
          studentId: cleanId,
          displayName: displayName.trim(),
          password: cleanPass,
          avatarId: selectedAvatar,
          rememberMe
        });

        if (!res.success) {
          setLoading(false);
          sounds.playWrong();
          setError(res.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
          return;
        }

        sounds.playWin();
        setRegisteredSuccessUser(res.user!);

        setTimeout(() => {
          setLoading(false);
          onLoginSuccess(res.user!);
        }, 1200);
      } catch (err) {
        setLoading(false);
        setError("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
      }
    } else {
      // ---------------------------------------------------------
      // LOGIN FLOW
      // ---------------------------------------------------------
      const result = jev.validateStudentId(cleanId);
      if (!result.isValid) {
        setError(result.error || "รหัสนักศึกษาไม่ถูกต้อง (หรือพิมพ์ admin สำหรับอาจารย์)");
        return;
      }

      if (!cleanPass) {
        setError("กรุณากรอกรหัสผ่าน");
        return;
      }

      setLoading(true);
      try {
        const res = loginNaAccount(cleanId, cleanPass, rememberMe);
        if (!res.success) {
          setLoading(false);
          sounds.playWrong();
          setError(res.error || "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
          return;
        }

        sounds.playSelect();
        setTimeout(() => {
          setLoading(false);
          onLoginSuccess(res.user!);
        }, 350);
      } catch (err) {
        setLoading(false);
        setError("ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/75 backdrop-blur-xs select-none">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            className="relative w-full max-w-lg wood-panel rounded-3xl p-5 md:p-6 text-white shadow-2xl border-4 border-amber-900 max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-amber-200 transition-colors cursor-pointer z-20 border border-amber-600/40"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Registration Success Overlay */}
            {registeredSuccessUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-amber-950/98 z-30 rounded-3xl flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-amber-400 border-4 border-amber-300 flex items-center justify-center mb-3 shadow-[0_0_24px_rgba(245,158,11,0.8)] animate-bounce">
                  <span className="text-4xl">🎉</span>
                </div>
                <h3 className="text-2xl font-black font-game text-amber-200 text-shadow-gold-title">
                  สมัครสมาชิกสำเร็จ!
                </h3>
                <p className="text-sm text-amber-100 font-bold mt-1">
                  ยินดีต้อนรับ {registeredSuccessUser.displayName} ({registeredSuccessUser.studentId})
                </p>
                <div className="mt-3 px-4 py-2 rounded-2xl bg-amber-900/90 border border-amber-500 flex items-center space-x-2 text-amber-200 font-bold text-sm shadow-inner">
                  <NucCoinIcon size={22} className="animate-spin" />
                  <span>รับฟรี 120 NucCoin เข้าสู่กระเป๋าเรียบร้อย!</span>
                </div>
                <p className="text-xs text-amber-300/80 mt-4 animate-pulse">
                  ระบบจำบัญชีของคุณแล้ว กำลังพาท่านเข้าสู่สังเวียน...
                </p>
              </motion.div>
            )}

            {/* Header Icon & Title */}
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-13 h-13 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-2 border-amber-800 flex items-center justify-center mb-1.5 shadow-lg">
                <span className="text-2xl filter drop-shadow">☢️</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black font-game text-amber-200 text-shadow-sub">
                {mode === "login" ? "เข้าสู่สังเวียนประลอง" : "สมัครสมาชิกนักศึกษาใหม่"}
              </h3>
              <p className="text-[11.5px] text-amber-100/80 mt-0.5">
                {mode === "login" 
                  ? "กรอกรหัสนักศึกษาและรหัสผ่านเพื่อเข้าเล่น (หรือ admin สำหรับอาจารย์)" 
                  : "ลงทะเบียนรหัสนักศึกษา ตั้งรหัสผ่าน และรับ 120 NucCoin เริ่มต้น"}
              </p>
            </div>

            {/* Tabs: LOGIN vs REGISTER */}
            <div className="grid grid-cols-2 gap-2 bg-amber-950/80 p-1.5 rounded-2xl border-2 border-amber-900 mb-4 shadow-inner">
              <button
                type="button"
                onClick={() => handleTabSwitch("login")}
                className={`py-2 px-3 rounded-xl font-game font-black text-xs md:text-sm tracking-wide flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-amber-600 text-white shadow-md border border-amber-400"
                    : "text-amber-300/80 hover:text-amber-100 hover:bg-amber-900/40"
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ (LOGIN)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch("register")}
                className={`py-2 px-3 rounded-xl font-game font-black text-xs md:text-sm tracking-wide flex items-center justify-center space-x-1.5 transition-all cursor-pointer relative ${
                  mode === "register"
                    ? "bg-emerald-600 text-white shadow-md border border-emerald-400"
                    : "text-emerald-300/90 hover:text-emerald-100 hover:bg-emerald-950/40"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>สมัครใหม่ (REGISTER)</span>
                <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-amber-400 text-black text-[9px] font-mono font-black rounded-full shadow">
                  ฟรี 120
                </span>
              </button>
            </div>

            {/* --------------------------------------------------------
                TAB 1: LOGIN MODE
                -------------------------------------------------------- */}
            {mode === "login" && (
              <div className="space-y-3.5">
                {/* Section A: Saved Accounts on this device */}
                {savedAccounts.length > 0 && (
                  <div className="bg-amber-950/60 p-3 rounded-2xl border border-amber-800/80 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>บัญชีในเครื่องนี้ (คลิกเพื่อเลือกรหัส):</span>
                      </span>
                      <span className="text-[10px] text-amber-400/80">
                        {savedAccounts.length} บัญชี
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                      {savedAccounts.map((acc) => {
                        const avatarMatch = AVATAR_OPTIONS.find(a => a.id === acc.avatarId) || AVATAR_OPTIONS[0];
                        const isSelected = studentId === acc.studentId;
                        return (
                          <div
                            key={acc.studentId}
                            onClick={() => handleSelectSavedAccount(acc)}
                            className={`group p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer shadow hover:scale-101 active:scale-98 ${
                              isSelected
                                ? "bg-amber-800/90 border-amber-300 ring-2 ring-amber-400"
                                : "bg-amber-900/60 hover:bg-amber-800/80 border-amber-600/60"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarMatch.color} border border-amber-300 flex items-center justify-center text-sm shadow shrink-0`}>
                                {avatarMatch.icon}
                              </div>
                              <div className="text-left truncate">
                                <div className="text-xs font-bold text-white group-hover:text-amber-200 truncate font-game">
                                  {acc.displayName}
                                </div>
                                <div className="text-[10px] text-amber-300 font-mono">
                                  {acc.studentId}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5 shrink-0 pl-1">
                              <div className="flex items-center space-x-1 text-[10.5px] font-mono font-bold text-amber-200 bg-black/40 px-1.5 py-0.5 rounded-md">
                                <NucCoinIcon size={14} />
                                <span>{acc.coins}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteAccount(e, acc.studentId)}
                                className="p-1 text-amber-400/60 hover:text-rose-400 hover:bg-black/40 rounded transition-colors"
                                title="ลบบัญชีนี้ออกจากเครื่อง"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Section B: Standard Student ID + Password Login Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Student ID / Username */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider">
                        รหัสนักศึกษา (11 หลัก) หรือ admin *
                      </label>
                      <span className="text-[10.5px] text-amber-400/90 font-mono">
                        {isAdminInput ? "โหมดอาจารย์ผู้สอน" : "[ปี] + 2083070 + [00-55]"}
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => {
                          setStudentId(e.target.value.trim());
                          setError(null);
                        }}
                        placeholder="เช่น 68208307037 หรือ admin"
                        maxLength={11}
                        autoFocus={savedAccounts.length === 0}
                        className="w-full px-4 py-2.5 bg-amber-950/80 border-2 border-amber-600/80 rounded-xl text-white placeholder-amber-400/40 font-mono tracking-wider font-bold text-base focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
                      />
                      <div className="absolute right-3 top-3">
                        {isAdminInput ? (
                          <ShieldAlert className="w-5 h-5 text-amber-400" />
                        ) : validation?.isValid ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-amber-400/60" />
                        )}
                      </div>
                    </div>

                    {/* Live JEV Structural Breakdown Badge */}
                    {!isAdminInput && studentId.length > 0 && (
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
                            sounds.playClick();
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

                  {/* Password Field */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>รหัสผ่าน (PASSWORD) *</span>
                      </label>
                      <span className="text-[10.5px] text-amber-300/80">
                        {isAdminInput ? "รหัสผ่านแอดมิน" : "รหัสผ่านที่ตั้งไว้"}
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        ref={passwordInputRef}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        placeholder={isAdminInput ? "กรอกรหัสผ่านผู้ดูแลระบบ" : "กรอกรหัสผ่านของคุณ"}
                        className="w-full px-4 py-2.5 bg-amber-950/80 border-2 border-amber-600/80 rounded-xl text-white placeholder-amber-400/40 font-mono tracking-wider font-bold text-base focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-amber-400/70 hover:text-amber-200 cursor-pointer"
                        title={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center space-x-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="rememberMeLogin"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-amber-950 border-amber-600 focus:ring-amber-400 focus:ring-offset-amber-950 cursor-pointer"
                    />
                    <label htmlFor="rememberMeLogin" className="text-xs text-amber-200 font-bold cursor-pointer select-none">
                      จดจำฉันไว้ในระบบเสมอ (Remember Me)
                    </label>
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-play hover:bg-play-hover border-4 border-play-border rounded-xl text-white font-game font-black text-lg tracking-wider shadow-play-btn active:shadow-play-btn-pressed active:translate-y-1 transition-all flex items-center justify-center space-x-2 mt-2 cursor-pointer"
                  >
                    {loading ? (
                      <span>กำลังตรวจสอบข้อมูล...</span>
                    ) : isAdminInput ? (
                      <>
                        <ShieldAlert className="w-5 h-5 text-amber-300" />
                        <span>เข้าสู่แผงควบคุมอาจารย์ (ADMIN PANEL)</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-5 h-5" />
                        <span>เข้าสู่เกม (ENTER GAME)</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="pt-2 border-t border-amber-800/60 text-center">
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("register")}
                    className="text-xs text-amber-300 hover:text-white underline font-bold cursor-pointer"
                  >
                    ยังไม่มีบัญชีนักศึกษา? คลิกสมัครสมาชิกใหม่ที่นี่ (รับฟรี 120 NucCoin)
                  </button>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------
                TAB 2: REGISTER MODE
                -------------------------------------------------------- */}
            {mode === "register" && (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Student ID */}
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
                      className="w-full px-4 py-2 bg-amber-950/80 border-2 border-amber-600/80 rounded-xl text-white placeholder-amber-400/40 font-mono tracking-widest font-bold text-base focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
                    />
                    <div className="absolute right-3 top-2.5">
                      {validation?.isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-amber-400/60" />
                      )}
                    </div>
                  </div>

                  {/* Structural Breakdown */}
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

                  {/* Sample chips */}
                  <div className="mt-1.5 flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span className="text-[10px] text-amber-300/80 font-medium">ตัวอย่างคลิกใส่:</span>
                    {SAMPLE_IDS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setStudentId(sample.id);
                          setError(null);
                        }}
                        className="px-2 py-0.5 rounded-md bg-amber-900/60 hover:bg-amber-800 text-[10px] font-mono text-amber-200 border border-amber-600/40 transition-colors cursor-pointer"
                      >
                        {sample.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">
                    ชื่อที่โชว์ด้านบน (เช่น ภูมิ ภูวนาถ หรือ หมอนิว) *
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="เช่น ภูมิ หรือ หมอนิว"
                    maxLength={20}
                    className="w-full px-4 py-2 bg-amber-950/80 border-2 border-amber-600/80 rounded-xl text-white placeholder-amber-400/40 text-sm focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all font-bold"
                  />
                </div>

                {/* Password Setting with Quick Autofill Button */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>ตั้งรหัสผ่าน (PASSWORD) *</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleUseDisplayNameAsPassword}
                      className="text-[10.5px] text-emerald-300 hover:text-emerald-100 underline font-bold cursor-pointer"
                      title="ใช้ชื่อที่โชว์ด้านบนเป็นรหัสผ่าน"
                    >
                      กดใช้ชื่อด้านบนเป็นรหัสผ่าน
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="ตั้งรหัสผ่าน (เช่น ใช้ชื่อด้านบน หรือรหัสที่จำง่าย)"
                      className="w-full px-4 py-2 bg-amber-950/80 border-2 border-amber-600/80 rounded-xl text-white placeholder-amber-400/40 font-mono tracking-wider font-bold text-sm focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-amber-400/70 hover:text-amber-200 cursor-pointer"
                      title={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-amber-300/70 mt-1 block">
                    * รหัสผ่านตั้งเองได้ และสามารถใช้ชื่อด้านบนเป็นรหัสผ่านได้
                  </span>
                </div>

                {/* Starting Avatar Selection */}
                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1.5">
                    เลือกอวตารเริ่มต้น (STARTING AVATAR)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATAR_OPTIONS.map((av) => {
                      const isSelected = selectedAvatar === av.id;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            sounds.playSelect();
                            setSelectedAvatar(av.id);
                          }}
                          className={`p-2 rounded-2xl flex flex-col items-center transition-all cursor-pointer relative ${
                            isSelected
                              ? "bg-amber-900/90 border-2 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-103"
                              : "bg-amber-950/60 border border-amber-800 hover:border-amber-500 opacity-80 hover:opacity-100"
                          }`}
                        >
                          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${av.color} border border-amber-200 flex items-center justify-center text-xl shadow mb-1`}>
                            {av.icon}
                          </div>
                          <span className="text-[10px] font-bold text-amber-200 truncate w-full text-center">
                            {av.label}
                          </span>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center shadow">
                              <Check className="w-3 h-3 stroke-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Welcome Perk Summary */}
                <div className="p-2.5 rounded-2xl bg-amber-900/40 border border-amber-600/50 flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center space-x-2">
                    <NucCoinIcon size={20} />
                    <span className="font-bold">โบนัสนักศึกษาใหม่: ฟรี 120 NucCoin</span>
                  </div>
                  <span className="text-[10.5px] text-emerald-300 font-mono font-bold">✓ อัตโนมัติ</span>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMeReg"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-amber-950 border-amber-600 focus:ring-amber-400 focus:ring-offset-amber-950 cursor-pointer"
                  />
                  <label htmlFor="rememberMeReg" className="text-xs text-amber-200 font-bold cursor-pointer select-none">
                    จดจำบัญชีนี้ไว้ในเครื่องนี้เสมอ (เปิดเว็บแล้วเล่นต่อได้เลย)
                  </label>
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

                {/* Register Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-4 border-emerald-300 rounded-xl text-white font-game font-black text-lg tracking-wider shadow-[0_6px_0_#065f46,0_12px_20px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_2px_0_#065f46] transition-all flex items-center justify-center space-x-2 mt-2 cursor-pointer"
                >
                  {loading ? (
                    <span>กำลังลงทะเบียนนักศึกษาใหม่...</span>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>สมัครสมาชิกและเริ่มเล่น (REGISTER & PLAY)</span>
                    </>
                  )}
                </button>

                {/* Footer Switcher */}
                <div className="pt-2 border-t border-amber-800/60 text-center">
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("login")}
                    className="text-xs text-amber-300 hover:text-white underline font-bold cursor-pointer"
                  >
                    มีบัญชีนักศึกษาอยู่แล้ว? คลิกเข้าสู่ระบบที่นี่
                  </button>
                </div>
              </form>
            )}

            {/* Quick Info */}
            <div className="mt-3.5 pt-2 border-t border-amber-800/60 flex items-center justify-center text-[11px] text-amber-300/70 space-x-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>บันทึกลงเบราว์เซอร์นี้ด้วยระบบคีย์ na_accounts ปลอดภัย</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
