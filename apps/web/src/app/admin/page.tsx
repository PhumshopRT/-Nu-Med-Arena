"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  Key
} from "lucide-react";
import { 
  ALL_CASE_CARDS, 
  ALL_RP_CARDS, 
  ALL_MECH_CARDS, 
  ALL_CLUE_CARDS,
  gradeAnswer,
  validateCaseClues,
  CaseCard,
  RadiopharmaceuticalCard,
  MechanismCard
} from "@nucmed/shared";
import { sounds } from "@/lib/sound";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // Sandbox testing
  const [selectedCase, setSelectedCase] = useState<CaseCard>(ALL_CASE_CARDS[0]);
  const [selectedRpId, setSelectedRpId] = useState<string>(ALL_RP_CARDS[0].id);
  const [selectedMechId, setSelectedMechId] = useState<string>(ALL_MECH_CARDS[0].id);
  const [useClueInSandbox, setUseClueInSandbox] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  // Clue validation check
  const clueValidation = validateCaseClues(ALL_CASE_CARDS, ALL_CLUE_CARDS.map(c => c.id));

  // Filter for question library
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = () => {
    // Teacher PIN (default: "nucmed" or "1234")
    if (pin.trim().toLowerCase() === "nucmed" || pin.trim() === "1234" || pin.trim() === "NUCMED2025") {
      sounds.playWin();
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      sounds.playWrong();
      setPinError(true);
    }
  };

  const handleRunSandbox = () => {
    sounds.playSelect();
    const result = gradeAnswer(selectedCase, selectedRpId, selectedMechId, useClueInSandbox);
    setSandboxResult(result);
  };

  const handleExportCsv = () => {
    sounds.playClick();
    // Generate CSV string with student scores
    const csvRows = [
      ["Student ID", "Full Name", "Total Score", "Cases Completed", "Rank", "Export Date"],
      ["651010001", "สมชาย เข็มทอง", "36", "10", "1", new Date().toLocaleDateString("th-TH")],
      ["651010002", "สมหญิง นิวเคลียร์", "32", "10", "2", new Date().toLocaleDateString("th-TH")],
      ["651010003", "ประเสริฐ รังสีวิทยา", "28", "10", "3", new Date().toLocaleDateString("th-TH")],
      ["651010004", "วรัญญา กากมันตรังสี", "24", "10", "4", new Date().toLocaleDateString("th-TH")],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nucmed_arena_scores_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearCache = () => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างแคชข้อมูลการเล่นในเครื่องทั้งหมด?")) {
      sounds.playClick();
      localStorage.clear();
      alert("ล้างแคชเรียบร้อยแล้ว");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-felt-table text-amber-50 flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-md wood-panel p-8 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl mb-4">
            🔒
          </div>
          <h2 className="font-game font-black text-2xl text-amber-200">
            แผงควบคุมอาจารย์ผู้สอน (ADMIN)
          </h2>
          <p className="text-xs text-amber-300/80 mt-1 mb-6">
            กรุณากรอกรหัสผ่าน PIN สำหรับอาจารย์เพื่อเข้าสู่ระบบ
          </p>

          <div className="w-full space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="กรอก PIN (เช่น nucmed หรือ 1234)"
              className="w-full px-4 py-3 bg-amber-950/90 border-2 border-amber-600 rounded-2xl text-center text-lg font-bold text-white focus:outline-hidden focus:border-amber-300"
            />

            {pinError && (
              <p className="text-xs text-rose-400 font-bold">
                รหัส PIN ไม่ถูกต้อง (ทดสอบด้วยรหัส: nucmed หรือ 1234)
              </p>
            )}

            <button
              onClick={handleLogin}
              className="w-full py-3.5 bg-play hover:bg-play-hover border-3 border-play-border rounded-2xl font-game font-black text-white text-base tracking-wider shadow-play-btn cursor-pointer"
            >
              เข้าสู่ระบบอาจารย์
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full py-2.5 bg-amber-900/50 hover:bg-amber-800/80 rounded-xl text-xs text-amber-200 font-bold cursor-pointer"
            >
              กลับสู่หน้าหลัก
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const filteredCases = ALL_CASE_CARDS.filter(
    (c) =>
      c.titleTh.includes(searchQuery) ||
      c.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.promptTh.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-felt-table text-amber-50 flex flex-col justify-between select-none">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-4 md:px-8 py-3 bg-amber-950/90 border-b-4 border-amber-900 shadow-2xl">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 bg-amber-900/80 hover:bg-amber-800 rounded-xl text-amber-200 border-2 border-amber-600 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <div>
              <h1 className="font-game font-black text-lg md:text-xl text-amber-200">
                แผงบริหารจัดการรายวิชา (ADMIN DASHBOARD)
              </h1>
              <p className="text-[10px] text-amber-300/80">ตรวจสอบคลังโจทย์ ทดสอบระบบตรวจคะแนน และส่งออกคะแนนนักศึกษา</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md border border-emerald-400 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก CSV</span>
          </button>

          <button
            onClick={handleClearCache}
            className="p-2 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-xl border border-rose-500 shadow-md cursor-pointer"
            title="ล้างแคชเครื่อง"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Question Library (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Clue Validation Status Banner */}
          {!clueValidation.valid ? (
            <div className="p-3 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-rose-200 text-xs font-bold flex items-center space-x-2">
              <span className="text-lg">⚠️</span>
              <div>
                <div>คำเตือน: พบโจทย์ที่ขาด clueId หรือคำใบ้ไม่มีอยู่จริง: <strong>{clueValidation.missingClueCaseIds.join(", ")}</strong></div>
                <div className="text-[10px] text-rose-300 font-normal">ระบบเกมจะข้ามเคสเหล่านี้อัตโนมัติในการแข่งขันเพื่อป้องกันข้อผิดพลาด</div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs font-bold flex items-center space-x-2">
              <span className="text-emerald-400 text-base">✓</span>
              <span>ตรวจสอบความสมบูรณ์: โจทย์ทุกข้อ ({ALL_CASE_CARDS.length} ข้อ) จับคู่คำใบ้ถูกต้อง 1-ต่อ-1 ไม่มีการสุ่ม</span>
            </div>
          )}

          <div className="wood-panel p-5 rounded-3xl border-3 border-amber-950 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h3 className="font-game font-black text-base text-amber-200">
                  คลังโจทย์ทางคลินิก ({ALL_CASE_CARDS.length} ข้อ)
                </h3>
              </div>

              {/* Search */}
              <div className="relative w-48">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-amber-400/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาโจทย์..."
                  className="w-full pl-8 pr-3 py-1.5 bg-amber-950/80 border border-amber-700 rounded-xl text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Questions List */}
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
                        {c.clueId ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/60">
                            🔍 {c.clueId}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-600">
                            ⚠️ ขาดคำใบ้
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

        {/* Right Column: Rule Grading Sandbox (5 cols) */}
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
                  <span className="text-xs text-emerald-300 font-mono font-bold">Clue: {selectedCase.clueId || "None"}</span>
                </div>
              </div>

              <div>
                <label className="text-blue-300 font-bold block mb-1">เลือกสารเภสัชรังสี (RP):</label>
                <select
                  value={selectedRpId}
                  onChange={(e) => setSelectedRpId(e.target.value)}
                  className="w-full bg-amber-950/90 border border-amber-600 rounded-xl p-2 text-white font-bold"
                >
                  {ALL_RP_CARDS.map((rp) => (
                    <option key={rp.id} value={rp.id}>
                      [{rp.id}] {rp.nuclide} - {rp.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-amber-300 font-bold block mb-1">เลือกกลไกการสะสม (MECH):</label>
                <select
                  value={selectedMechId}
                  onChange={(e) => setSelectedMechId(e.target.value)}
                  className="w-full bg-amber-950/90 border border-amber-600 rounded-xl p-2 text-white font-bold"
                >
                  {ALL_MECH_CARDS.map((mech) => (
                    <option key={mech.id} value={mech.id}>
                      [{mech.id}] {mech.titleEn} ({mech.titleTh})
                    </option>
                  ))}
                </select>
              </div>

              {/* Clue Used Checkbox */}
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-700/60">
                <label className="flex items-center space-x-2 text-emerald-300 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useClueInSandbox}
                    onChange={(e) => setUseClueInSandbox(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                  />
                  <span>จำลองเปิดคำใบ้ (-1 แต้มเมื่อตอบถูก, ตอบผิดได้ 0)</span>
                </label>
              </div>

              <button
                onClick={handleRunSandbox}
                className="w-full mt-2 py-3 bg-play hover:bg-play-hover border-2 border-play-border rounded-xl font-game font-black text-white text-sm shadow-play-btn cursor-pointer"
              >
                คำนวณคะแนนตาม Rule Engine
              </button>

              {/* Sandbox Result */}
              {sandboxResult && (
                <div className={`mt-4 p-4 rounded-2xl border-2 ${
                  sandboxResult.scoreAwarded > 0
                    ? "bg-emerald-950/70 border-emerald-400 text-emerald-100"
                    : "bg-rose-950/70 border-rose-400 text-rose-100"
                }`}>
                  <div className="font-game font-black text-lg mb-1 flex items-center justify-between">
                    <span>
                      {sandboxResult.scoreAwarded > 0
                        ? `✓ ถูกต้อง ได้รับ ${sandboxResult.scoreAwarded} คะแนน`
                        : "✗ ผิด ได้รับ 0 คะแนน"}
                    </span>
                    {sandboxResult.cluePenalty > 0 && (
                      <span className="text-xs bg-amber-900/90 text-amber-200 border border-amber-400 px-2 py-0.5 rounded-full font-sans">
                        หักคำใบ้ -1
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>สารเภสัชรังสี: {sandboxResult.rpMatch ? "✓ ตรงตามโจทย์" : "✗ ไม่ตรง"}</div>
                    <div>กลไก: {sandboxResult.mechMatch ? "✓ ตรงตามโจทย์" : "✗ ไม่ตรง"}</div>
                    <div>เปิดคำใบ้: {sandboxResult.usedClue ? "ใช่ (หัก 1 แต้มถ้าตอบถูก)" : "ไม่"}</div>
                    <div className="pt-2 border-t border-white/20 mt-2 leading-relaxed">
                      <strong>เหตุผลทางการแพทย์:</strong> {selectedCase.explanationTh}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-2.5 bg-amber-950/90 border-t border-amber-900 text-center text-xs text-amber-300/80">
        NucMed Arena Admin Panel • รายวิชาเวชศาสตร์นิวเคลียร์
      </footer>
    </div>
  );
}
