"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Download, 
  Trash2, 
  ArrowLeft, 
  BookOpen, 
  Database, 
  CheckCircle, 
  Play, 
  Search,
  Key,
  Lock,
  Eye,
  EyeOff,
  UserX,
  UserCheck,
  RotateCcw,
  PlusCircle,
  Coins,
  History,
  AlertTriangle,
  X,
  LogOut,
  Sparkles
} from "lucide-react";
import { 
  ALL_CASE_CARDS, 
  ALL_RP_CARDS, 
  ALL_MECH_CARDS, 
  ALL_CLUE_CARDS,
  gradeAnswer,
  validateCaseClues,
  CaseCard
} from "@nucmed/shared";
import { 
  getNaAccounts, 
  saveNaAccounts, 
  adminUpdateCoins, 
  adminResetCoins, 
  adminToggleDisable,
  isAdminAuthenticated,
  setAdminAuthenticated,
  NaAccount
} from "@/lib/user";
import { sounds } from "@/lib/sound";
import { NucCoinIcon } from "@/components/ui/NucCoinIcon";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab: students vs sandbox
  const [activeTab, setActiveTab] = useState<"students" | "sandbox">("students");

  // Students list from na_accounts
  const [students, setStudents] = useState<NaAccount[]>([]);
  const [studentSearch, setStudentSearch] = useState("");

  // Coin Adjustment Modal
  const [selectedStudentForCoins, setSelectedStudentForCoins] = useState<NaAccount | null>(null);
  const [coinDeltaType, setCoinDeltaType] = useState<"add" | "deduct">("add");
  const [coinAmount, setCoinAmount] = useState<number>(10);
  const [coinReason, setCoinReason] = useState<string>("");
  const [coinModalError, setCoinModalError] = useState<string | null>(null);

  // History viewer modal
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<NaAccount | null>(null);

  // Sandbox testing
  const [selectedCase, setSelectedCase] = useState<CaseCard>(ALL_CASE_CARDS[0]);
  const [selectedRpId, setSelectedRpId] = useState<string>(ALL_RP_CARDS[0].id);
  const [selectedMechId, setSelectedMechId] = useState<string>(ALL_MECH_CARDS[0].id);
  const [useClueInSandbox, setUseClueInSandbox] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [caseSearchQuery, setCaseSearchQuery] = useState("");

  // Clue validation check
  const clueValidation = validateCaseClues(ALL_CASE_CARDS, ALL_CLUE_CARDS.map(c => c.id));

  // Sync authentication and accounts on mount
  useEffect(() => {
    if (isAdminAuthenticated()) {
      setIsAuthenticated(true);
      setStudents(getNaAccounts());
    }
  }, []);

  const refreshStudents = () => {
    setStudents(getNaAccounts());
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);

    if (username.trim().toLowerCase() === "admin" && password.trim() === "rtkmpht") {
      sounds.playWin();
      setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setStudents(getNaAccounts());
    } else {
      sounds.playWrong();
      setLoginError("ชื่อผู้ใช้หรือรหัสผ่านแอดมินไม่ถูกต้อง");
    }
  };

  const handleLogout = () => {
    sounds.playClick();
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setPassword("");
  };

  // Export student data as CSV with Thai UTF-8 BOM
  const handleExportCsv = () => {
    sounds.playClick();
    const currentList = getNaAccounts();

    const headers = [
      "รหัสนักศึกษา",
      "ชื่อ",
      "เหรียญ NucCoin",
      "จำนวนข้อที่ตอบถูก",
      "เวลาเล่นล่าสุด",
      "สถานะบัญชี",
      "วันที่ส่งออก"
    ];

    const rows = currentList.map((acc) => [
      `"${acc.studentId}"`,
      `"${acc.displayName}"`,
      acc.coins,
      acc.correctCount || 0,
      `"${acc.lastPlayedAt ? new Date(acc.lastPlayedAt).toLocaleString("th-TH") : acc.lastLoginAt ? new Date(acc.lastLoginAt).toLocaleString("th-TH") : "ยังไม่ได้เล่น"}"`,
      `"${acc.disabled ? "ระงับการใช้งาน" : "ปกติ"}"`,
      `"${new Date().toLocaleDateString("th-TH")}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nucmed_students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset student coins to 120
  const handleResetCoins = (student: NaAccount) => {
    if (confirm(`คุณต้องการรีเซ็ตเหรียญของ ${student.displayName} (${student.studentId}) กลับเป็น 120 NucCoin หรือไม่?`)) {
      sounds.playClick();
      const res = adminResetCoins(student.studentId);
      if (res.success) {
        refreshStudents();
      }
    }
  };

  // Toggle account disable
  const handleToggleDisable = (student: NaAccount) => {
    if (student.studentId.toLowerCase() === "admin") {
      alert("ไม่อนุญาตให้ระงับบัญชีผู้ดูแลระบบ (admin)");
      return;
    }
    const actionLabel = student.disabled ? "ยกเลิกระงับ" : "ระงับ";
    if (confirm(`คุณต้องการ${actionLabel}บัญชีของ ${student.displayName} (${student.studentId}) หรือไม่?`)) {
      sounds.playClick();
      const res = adminToggleDisable(student.studentId);
      if (res.success) {
        refreshStudents();
      } else if (res.error) {
        alert(res.error);
      }
    }
  };

  // Submit coin adjustment
  const handleSaveCoinAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForCoins) return;

    if (!coinReason.trim()) {
      setCoinModalError("กรุณาระบุเหตุผลในการปรับยอดเหรียญ (จำเป็น)");
      return;
    }

    if (coinAmount <= 0) {
      setCoinModalError("จำนวนเหรียญต้องมากกว่า 0");
      return;
    }

    const delta = coinDeltaType === "add" ? coinAmount : -coinAmount;
    const res = adminUpdateCoins(selectedStudentForCoins.studentId, delta, coinReason.trim());

    if (res.success) {
      sounds.playWin();
      refreshStudents();
      setSelectedStudentForCoins(null);
      setCoinReason("");
      setCoinAmount(10);
      setCoinModalError(null);
    } else {
      setCoinModalError(res.error || "เกิดข้อผิดพลาดในการปรับยอดเหรียญ");
    }
  };

  const handleRunSandbox = () => {
    sounds.playSelect();
    const result = gradeAnswer(selectedCase, selectedRpId, selectedMechId, useClueInSandbox);
    setSandboxResult(result);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return true;
    return s.studentId.toLowerCase().includes(q) || s.displayName.toLowerCase().includes(q);
  });

  // Filter cases for sandbox
  const filteredCases = ALL_CASE_CARDS.filter(
    (c) =>
      c.titleTh.includes(caseSearchQuery) ||
      c.titleEn.toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
      c.promptTh.includes(caseSearchQuery)
  );

  // -------------------------------------------------------------
  // LOGIN SCREEN (if not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-felt-table text-amber-50 flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-md wood-panel p-8 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl mb-4 shadow-lg">
            🔒
          </div>
          <h2 className="font-game font-black text-2xl text-amber-200 text-shadow-gold-title">
            แผงควบคุมอาจารย์ผู้สอน (ADMIN)
          </h2>
          <p className="text-xs text-amber-300/80 mt-1 mb-6">
            เข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบเพื่อจัดการข้อมูลนักศึกษา
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <label className="block text-left text-xs font-bold text-amber-200 mb-1">
                ชื่อผู้ใช้งาน (USERNAME)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 bg-amber-950/90 border-2 border-amber-600 rounded-xl font-bold text-white focus:outline-hidden focus:border-amber-300"
              />
            </div>

            <div>
              <label className="block text-left text-xs font-bold text-amber-200 mb-1">
                รหัสผ่าน (PASSWORD)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านอาจารย์"
                  autoFocus
                  className="w-full px-4 py-2.5 bg-amber-950/90 border-2 border-amber-600 rounded-xl font-bold text-white focus:outline-hidden focus:border-amber-300 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-amber-400/70 hover:text-amber-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-2.5 bg-rose-950/80 border border-rose-500 rounded-xl text-rose-200 text-xs font-bold text-left flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-play hover:bg-play-hover border-3 border-play-border rounded-2xl font-game font-black text-white text-base tracking-wider shadow-play-btn cursor-pointer transition-all active:scale-98"
            >
              เข้าสู่ระบบอาจารย์ (LOGIN)
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full py-2 bg-amber-900/50 hover:bg-amber-800/80 rounded-xl text-xs text-amber-200 font-bold cursor-pointer transition-colors"
            >
              กลับสู่หน้าหลัก
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-felt-table text-amber-50 flex flex-col justify-between select-none">
      {/* Header Bar */}
      <header className="w-full flex justify-between items-center px-4 md:px-8 py-3 bg-amber-950/90 border-b-4 border-amber-900 shadow-2xl z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 bg-amber-900/80 hover:bg-amber-800 rounded-xl text-amber-200 border-2 border-amber-600 cursor-pointer transition-transform hover:scale-105"
            title="กลับสู่หน้าหลัก"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <div>
              <h1 className="font-game font-black text-lg md:text-xl text-amber-200 text-shadow-sub">
                แผงบริหารจัดการรายวิชา (ADMIN DASHBOARD)
              </h1>
              <p className="text-[10.5px] text-amber-300/80">
                ระบบดูแลนักศึกษา ปรับยอด NucCoin ตรวจสอบสถิติ และจำลองผลการตรวจ
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md border border-emerald-400 cursor-pointer transition-all hover:scale-105 active:scale-95"
            title="ดาวน์โหลดข้อมูลนักศึกษาเป็น CSV"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1 border border-rose-600 shadow cursor-pointer transition-colors"
            title="ออกจากระบบแอดมิน"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 md:px-6 py-4 space-y-4">
        {/* Requirement Banner: Local browser storage notice */}
        <div className="p-3.5 rounded-2xl bg-amber-950/90 border-2 border-amber-500/80 text-amber-200 text-xs flex items-start space-x-2.5 shadow-xl">
          <span className="text-xl shrink-0">⚠️</span>
          <div className="leading-relaxed">
            <strong className="text-amber-300 font-bold block mb-0.5">
              ข้อควรทราบเกี่ยวกับการแสดงผลข้อมูลนักศึกษา:
            </strong>
            <span>
              แสดงข้อมูลนักศึกษาที่บันทึกในเบราว์เซอร์นี้เท่านั้น หากต้องการเห็นทั้งห้องเรียนต้องเชื่อมต่อฐานข้อมูลกลาง (Central Database)
            </span>
          </div>
        </div>

        {/* Navigation Tabs: Student Roster vs Question Sandbox */}
        <div className="flex space-x-2 bg-amber-950/80 p-1.5 rounded-2xl border-2 border-amber-900 w-full max-w-md shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`flex-1 py-2 px-3 rounded-xl font-game font-black text-xs md:text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === "students"
                ? "bg-amber-600 text-white shadow-md border border-amber-400"
                : "text-amber-300/80 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ดูแลนักศึกษา ({students.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sandbox")}
            className={`flex-1 py-2 px-3 rounded-xl font-game font-black text-xs md:text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === "sandbox"
                ? "bg-amber-600 text-white shadow-md border border-amber-400"
                : "text-amber-300/80 hover:text-white"
            }`}
          >
            <Play className="w-4 h-4" />
            <span>คลังโจทย์ & แซนด์บ็อกซ์</span>
          </button>
        </div>

        {/* --------------------------------------------------------
            TAB 1: STUDENTS MANAGEMENT TABLE
            -------------------------------------------------------- */}
        {activeTab === "students" && (
          <div className="wood-panel p-4 md:p-6 rounded-3xl border-3 border-amber-950 shadow-2xl space-y-4">
            {/* Top Toolbar: Search + Quick Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-game font-black text-base md:text-lg text-amber-200">
                  รายชื่อนักศึกษาในเครื่อง ({filteredStudents.length}/{students.length})
                </h3>
              </div>

              {/* Search by ID or Name */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-amber-400/60" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="ค้นหาตามรหัสนักศึกษา หรือชื่อ..."
                  className="w-full pl-9 pr-3 py-2 bg-amber-950/80 border border-amber-700/80 rounded-xl text-xs text-white placeholder-amber-400/40 focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-2xl border-2 border-amber-900 bg-black/40 shadow-inner">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-amber-950/90 text-amber-300 border-b border-amber-800/80 uppercase font-game text-[11px] tracking-wider">
                    <th className="py-3 px-3">รหัสนักศึกษา</th>
                    <th className="py-3 px-3">ชื่อ</th>
                    <th className="py-3 px-3 text-center">เหรียญ (NucCoin)</th>
                    <th className="py-3 px-3 text-center">ข้อที่ถูก</th>
                    <th className="py-3 px-3">เวลาเล่นล่าสุด</th>
                    <th className="py-3 px-3 text-center">สถานะบัญชี</th>
                    <th className="py-3 px-3 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/40">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-amber-300/70 font-medium">
                        ไม่พบข้อมูลนักศึกษาที่ค้นหา
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const isAdminAccount = student.studentId.toLowerCase() === "admin";
                      const lastPlayedStr = student.lastPlayedAt 
                        ? new Date(student.lastPlayedAt).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })
                        : student.lastLoginAt
                        ? new Date(student.lastLoginAt).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })
                        : "ยังไม่ได้เล่น";

                      return (
                        <tr 
                          key={student.studentId}
                          className={`hover:bg-amber-900/20 transition-colors ${
                            student.disabled ? "opacity-60 bg-red-950/20" : ""
                          }`}
                        >
                          {/* 1. Student ID */}
                          <td className="py-3 px-3 font-mono font-bold text-amber-200">
                            {student.studentId}
                          </td>

                          {/* 2. Name */}
                          <td className="py-3 px-3 font-semibold text-white">
                            <div className="flex items-center space-x-1.5">
                              <span>{student.displayName}</span>
                              {isAdminAccount && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500 text-black font-bold">
                                  ADMIN
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 3. Coins */}
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex items-center space-x-1 font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-600/40">
                              <NucCoinIcon size={16} />
                              <span>{student.coins}</span>
                            </div>
                          </td>

                          {/* 4. Correct Cases Count */}
                          <td className="py-3 px-3 text-center font-mono font-bold text-emerald-300">
                            {student.correctCount || 0} ข้อ
                          </td>

                          {/* 5. Last Played Time */}
                          <td className="py-3 px-3 text-[11px] text-amber-200/80 font-mono">
                            {lastPlayedStr}
                          </td>

                          {/* 6. Status */}
                          <td className="py-3 px-3 text-center">
                            {student.disabled ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-600">
                                ระงับบัญชี
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600">
                                ปกติ
                              </span>
                            )}
                          </td>

                          {/* 7. Action Controls */}
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center space-x-1.5">
                              {/* Adjust coins button */}
                              <button
                                type="button"
                                onClick={() => {
                                  sounds.playClick();
                                  setSelectedStudentForCoins(student);
                                  setCoinModalError(null);
                                  setCoinReason("");
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-700/80 hover:bg-amber-600 text-white font-bold text-[10.5px] border border-amber-400 shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95"
                                title="เพิ่มหรือลดเหรียญให้นักศึกษา"
                              >
                                เพิ่ม/ลดเหรียญ
                              </button>

                              {/* Reset to 120 button */}
                              <button
                                type="button"
                                onClick={() => handleResetCoins(student)}
                                className="px-2 py-1 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 font-bold text-[10.5px] border border-blue-500 shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center space-x-1"
                                title="รีเซ็ตยอดเหรียญกลับเป็น 120"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>รีเซ็ต 120</span>
                              </button>

                              {/* Toggle Disable Button (BLOCKED FOR ADMIN) */}
                              {!isAdminAccount ? (
                                <button
                                  type="button"
                                  onClick={() => handleToggleDisable(student)}
                                  className={`px-2 py-1 rounded-lg font-bold text-[10.5px] border shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center space-x-1 ${
                                    student.disabled
                                      ? "bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 border-emerald-500"
                                      : "bg-rose-900/80 hover:bg-rose-800 text-rose-200 border-rose-500"
                                  }`}
                                  title={student.disabled ? "ปลดระงับบัญชี" : "ระงับบัญชีนักศึกษา"}
                                >
                                  {student.disabled ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                  <span>{student.disabled ? "ปลดระงับ" : "ระงับ"}</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-amber-500/50 italic px-1">
                                  ห้ามระงับ
                                </span>
                              )}

                              {/* History View Button */}
                              {student.coinHistory && student.coinHistory.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    sounds.playClick();
                                    setSelectedStudentForHistory(student);
                                  }}
                                  className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-amber-300 border border-amber-700/60 cursor-pointer"
                                  title="ดูประวัติการปรับเหรียญ"
                                >
                                  <History className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------
            TAB 2: QUESTION LIBRARY & RULE SANDBOX
            -------------------------------------------------------- */}
        {activeTab === "sandbox" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Questions List */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="wood-panel p-5 rounded-3xl border-3 border-amber-950 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    <h3 className="font-game font-black text-base text-amber-200">
                      คลังโจทย์ทางคลินิก ({ALL_CASE_CARDS.length} ข้อ)
                    </h3>
                  </div>

                  <div className="relative w-48">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-amber-400/60" />
                    <input
                      type="text"
                      value={caseSearchQuery}
                      onChange={(e) => setCaseSearchQuery(e.target.value)}
                      placeholder="ค้นหาโจทย์..."
                      className="w-full pl-8 pr-3 py-1.5 bg-amber-950/80 border border-amber-700 rounded-xl text-xs text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredCases.map((c) => {
                    const mappedClue = ALL_CLUE_CARDS.find((clue) => clue.id === c.clueId);
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCase(c)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedCase.id === c.id
                            ? "bg-amber-900/80 border-amber-400 shadow-md"
                            : "bg-black/40 border-amber-800/50 hover:bg-black/60"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-mono font-bold text-xs text-amber-300">{c.id}</span>
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              c.difficulty === "CLINICAL" ? "bg-rose-900 text-rose-200" : "bg-emerald-900 text-emerald-200"
                            }`}>
                              {c.difficulty} ({c.points} แต้ม)
                            </span>
                            {c.clueId && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/60">
                                🔍 {c.clueId}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="font-bold text-sm text-white">{c.titleTh}</div>
                        <div className="text-[11px] text-amber-200/80 mt-1 line-clamp-2">{c.promptTh}</div>
                        {mappedClue && (
                          <div className="text-[10px] text-emerald-300/90 mt-1.5 font-medium truncate">
                            🎯 คำใบ้: [{mappedClue.id}] {mappedClue.titleTh}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Grading Sandbox */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <div className="wood-panel p-5 rounded-3xl border-3 border-amber-950 shadow-xl">
                <h3 className="font-game font-black text-base text-amber-200 mb-3 flex items-center space-x-2">
                  <Play className="w-5 h-5 text-emerald-400" />
                  <span>เครื่องมือจำลองผลการตรวจ (GRADING SANDBOX)</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-amber-300 font-bold block mb-1">เคสที่กำลังทดสอบ:</label>
                    <div className="bg-amber-950/80 p-2.5 rounded-xl border border-amber-700 text-white font-bold flex justify-between items-center">
                      <span>[{selectedCase.id}] {selectedCase.titleTh} ({selectedCase.points} คะแนน)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-amber-300 font-bold block mb-1">เลือกสารเภสัชรังสี (RP):</label>
                    <select
                      value={selectedRpId}
                      onChange={(e) => setSelectedRpId(e.target.value)}
                      className="w-full bg-amber-950/80 border border-amber-700 rounded-xl p-2.5 text-white text-xs font-mono"
                    >
                      {ALL_RP_CARDS.map((rp) => (
                        <option key={rp.id} value={rp.id}>
                          [{rp.id}] {rp.titleTh} ({rp.nuclide})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-amber-300 font-bold block mb-1">เลือกกลไกการจับสาร (MECH):</label>
                    <select
                      value={selectedMechId}
                      onChange={(e) => setSelectedMechId(e.target.value)}
                      className="w-full bg-amber-950/80 border border-amber-700 rounded-xl p-2.5 text-white text-xs font-mono"
                    >
                      {ALL_MECH_CARDS.map((m) => (
                        <option key={m.id} value={m.id}>
                          [{m.id}] {m.titleTh}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="sandboxClue"
                      checked={useClueInSandbox}
                      onChange={(e) => setUseClueInSandbox(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-amber-950 border-amber-600 cursor-pointer"
                    />
                    <label htmlFor="sandboxClue" className="text-emerald-300 font-bold cursor-pointer select-none">
                      จำลองการเปิดคำใบ้ (-1 คะแนนเมื่อตอบถูก)
                    </label>
                  </div>

                  <button
                    onClick={handleRunSandbox}
                    className="w-full mt-2 py-3 bg-play hover:bg-play-hover border-2 border-play-border rounded-xl font-game font-black text-white text-sm tracking-wider shadow-play-btn cursor-pointer transition-all active:scale-98"
                  >
                    ทดสอบตรวจคำตอบ (GRADE NOW)
                  </button>

                  {sandboxResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 p-3.5 rounded-2xl border-2 ${
                        sandboxResult.scoreAwarded > 0
                          ? "bg-emerald-950/80 border-emerald-500 text-emerald-100"
                          : "bg-rose-950/80 border-rose-500 text-rose-100"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5 font-game font-black text-sm">
                        <span>ผลการประเมิน:</span>
                        <span>{sandboxResult.scoreAwarded > 0 ? "✓ ถูกต้อง" : "✗ ไม่ถูกต้อง"}</span>
                      </div>
                      <div className="font-mono text-base font-bold mb-1">
                        คะแนนที่ได้: {sandboxResult.scoreAwarded} / {selectedCase.points} แต้ม
                      </div>
                      {sandboxResult.usedClue && (
                        <div className="text-[11px] text-amber-300">
                          (หักคำใบ้: -{sandboxResult.cluePenalty} แต้ม)
                        </div>
                      )}
                      <div className="text-[11px] mt-2 border-t border-white/20 pt-1.5 leading-relaxed">
                        {selectedCase.explanationTh}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --------------------------------------------------------
          MODAL 1: COIN ADJUSTMENT MODAL (ADD / DEDUCT WITH REASON)
          -------------------------------------------------------- */}
      <AnimatePresence>
        {selectedStudentForCoins && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-md wood-panel p-6 rounded-3xl border-4 border-amber-950 shadow-2xl text-white space-y-4"
            >
              <button
                onClick={() => setSelectedStudentForCoins(null)}
                className="absolute top-4 right-4 p-1 rounded-full bg-black/50 hover:bg-black/80 text-amber-200 border border-amber-600/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                <Coins className="w-6 h-6 text-amber-400" />
                <h3 className="font-game font-black text-lg text-amber-200">
                  ปรับยอดเหรียญ NucCoin
                </h3>
              </div>

              {/* Student Info Card */}
              <div className="p-3 bg-amber-950/80 rounded-2xl border border-amber-700/80 flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm text-white font-game">
                    {selectedStudentForCoins.displayName}
                  </div>
                  <div className="text-xs text-amber-300 font-mono">
                    ID: {selectedStudentForCoins.studentId}
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-500/40 font-mono font-bold text-amber-200">
                  <NucCoinIcon size={18} />
                  <span>{selectedStudentForCoins.coins}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveCoinAdjustment} className="space-y-3.5">
                {/* Add vs Deduct Toggle */}
                <div className="grid grid-cols-2 gap-2 bg-amber-950/80 p-1.5 rounded-xl border border-amber-800">
                  <button
                    type="button"
                    onClick={() => setCoinDeltaType("add")}
                    className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all ${
                      coinDeltaType === "add"
                        ? "bg-emerald-600 text-white shadow border border-emerald-400"
                        : "text-emerald-300/70 hover:text-white"
                    }`}
                  >
                    <span>➕ เพิ่มเหรียญ (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoinDeltaType("deduct")}
                    className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all ${
                      coinDeltaType === "deduct"
                        ? "bg-rose-700 text-white shadow border border-rose-400"
                        : "text-rose-300/70 hover:text-white"
                    }`}
                  >
                    <span>➖ ลดเหรียญ (-)</span>
                  </button>
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    จำนวนเหรียญ (NucCoin) *
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={coinAmount}
                      onChange={(e) => setCoinAmount(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full px-4 py-2 bg-amber-950/90 border-2 border-amber-600 rounded-xl font-mono font-bold text-base text-white focus:outline-hidden focus:border-amber-300"
                    />
                    <div className="flex space-x-1">
                      {[5, 10, 20, 50].map((quick) => (
                        <button
                          key={quick}
                          type="button"
                          onClick={() => setCoinAmount(quick)}
                          className="px-2 py-2 bg-amber-900/60 hover:bg-amber-800 rounded-lg text-xs font-mono text-amber-200 border border-amber-600/40 cursor-pointer"
                        >
                          +{quick}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reason field (Mandatory!) */}
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    เหตุผลในการปรับยอดเหรียญ * <span className="text-amber-400 font-normal">(จำเป็นต้องระบุ)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={coinReason}
                    onChange={(e) => {
                      setCoinReason(e.target.value);
                      setCoinModalError(null);
                    }}
                    placeholder="เช่น ช่วยตอบคำถามเคสไทรอยด์ในคาบ หรือ คะแนนพิเศษกิจกรรม..."
                    className="w-full px-3 py-2 bg-amber-950/90 border-2 border-amber-600 rounded-xl text-xs text-white placeholder-amber-400/40 focus:outline-hidden focus:border-amber-300 font-medium"
                  />
                </div>

                {coinModalError && (
                  <div className="p-2 bg-rose-950/80 border border-rose-500 rounded-lg text-rose-200 text-xs font-bold flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{coinModalError}</span>
                  </div>
                )}

                <div className="flex space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForCoins(null)}
                    className="flex-1 py-2.5 bg-black/40 hover:bg-black/60 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-play hover:bg-play-hover border-2 border-play-border rounded-xl font-game font-black text-sm text-white shadow-play-btn cursor-pointer"
                  >
                    ยืนยันการปรับเหรียญ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------
          MODAL 2: STUDENT COIN HISTORY MODAL
          -------------------------------------------------------- */}
      <AnimatePresence>
        {selectedStudentForHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-lg wood-panel p-6 rounded-3xl border-4 border-amber-950 shadow-2xl text-white space-y-4 max-h-[85vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedStudentForHistory(null)}
                className="absolute top-4 right-4 p-1 rounded-full bg-black/50 hover:bg-black/80 text-amber-200 border border-amber-600/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="font-game font-black text-base text-amber-200">
                  ประวัติการเปลี่ยนแปลงเหรียญ: {selectedStudentForHistory.displayName}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {selectedStudentForHistory.coinHistory && selectedStudentForHistory.coinHistory.length > 0 ? (
                  selectedStudentForHistory.coinHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-800/80 flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{item.reason}</div>
                        <div className="text-[10px] text-amber-400/70 font-mono">
                          {new Date(item.timestamp).toLocaleString("th-TH")}
                        </div>
                      </div>
                      <div className={`font-mono font-bold text-sm ${item.delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {item.delta >= 0 ? `+${item.delta}` : item.delta} NucCoin
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-amber-300/60 text-xs">
                    ยังไม่มีประวัติการปรับเหรียญ
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentForHistory(null)}
                className="w-full py-2 bg-amber-900/60 hover:bg-amber-800 rounded-xl text-xs font-bold text-amber-200 cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
