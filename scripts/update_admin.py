import re

with open('apps/web/src/app/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = r'\{\/\* ====================================================\s+TAB 4: นักเรียน \(STUDENTS\)\s+==================================================== \*\/\}\s+\{activeTab === "students" && \('
end_marker = r'\s+\)\}\s+<\/main>\s+<\/div>\s+\{\/\* ----------------------------------------------------\s+MODAL: Reveal Student Password'

match_start = re.search(start_marker, content)
match_end = re.search(end_marker, content)

if match_start and match_end:
    start_idx = match_start.start()
    
    # We need to end right before `</main>`
    main_end_match = re.search(r'\s+<\/main>', content[match_end.start():])
    if main_end_match:
        end_idx = match_end.start() + main_end_match.start()
    else:
        end_idx = match_end.start()

    new_content = '''          {/* ====================================================
              TAB 4: นักเรียน (STUDENTS)
             ==================================================== */}
          {activeTab === "students" && (
            <div className="space-y-4 max-w-6xl mx-auto">
              
              {/* Leaderboard Section */}
              <div className="bg-black/35 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 shadow-xl">
                <h3 className="text-base font-black font-game text-white mb-3">Leaderboard ลำดับคะแนนเหรียญสูงสุด</h3>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-black/60 border-b border-amber-900/60 text-amber-300 font-game font-bold">
                        <th className="p-3 w-16 text-center">อันดับ</th>
                        <th className="p-3">ชื่อ</th>
                        <th className="p-3 w-32">รหัสนักศึกษา</th>
                        <th className="p-3 w-28 text-center">เหรียญ</th>
                        <th className="p-3 w-28 text-center">ข้อถูก</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {(() => {
                        const sorted = [...students].sort((a,b) => b.coins - a.coins);
                        if (sorted.length === 0) {
                          return <tr><td colSpan={5} className="p-8 text-center text-amber-300/60 italic">ยังไม่มีบัญชีในเบราว์เซอร์นี้</td></tr>;
                        }
                        return sorted.map((acc, idx) => {
                          let rankStyle = "text-slate-400";
                          let rankBg = "";
                          if (idx === 0) { rankStyle = "text-amber-900 font-black"; rankBg = "bg-yellow-400 shadow-[0_0_10px_#facc15]"; }
                          else if (idx === 1) { rankStyle = "text-slate-900 font-black"; rankBg = "bg-slate-300 shadow-[0_0_10px_#cbd5e1]"; }
                          else if (idx === 2) { rankStyle = "text-orange-950 font-black"; rankBg = "bg-orange-400 shadow-[0_0_10px_#fb923c]"; }

                          return (
                            <tr key={`lb-${acc.studentId}`} className="hover:bg-amber-500/10 transition-colors">
                              <td className="p-3 text-center">
                                <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${rankBg} ${rankStyle}`}>
                                  {idx + 1}
                                </div>
                              </td>
                              <td className="p-3 font-bold text-white">{acc.displayName}</td>
                              <td className="p-3 font-mono text-amber-200">{acc.studentId}</td>
                              <td className="p-3 text-center font-mono font-bold text-[#E6A100]">
                                <div className="flex items-center justify-center gap-1">
                                  <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full border border-yellow-600 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center">
                                    <span className="text-[8px] font-black text-yellow-900 leading-none">N</span>
                                  </div>
                                  {acc.coins}
                                </div>
                              </td>
                              <td className="p-3 text-center font-mono font-bold text-[#2EAD4B]">{acc.correctCount || 0}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Student Table Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-black/35 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-base font-black font-game text-white">รายชื่อนักศึกษาและบัญชีผู้เล่น</h3>
                    <p className="text-xs text-amber-300/80">คลิกที่แถวเพื่อปรับเหรียญ, รีเซ็ตยอด, หรือระงับบัญชี</p>
                  </div>
                  <button 
                    onClick={handleManualRefresh}
                    className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/50 rounded-lg text-amber-300 font-bold text-xs transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    รีเฟรชรายชื่อ
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/60" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="ค้นหารหัส หรือชื่อนักศึกษา..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/50 border border-amber-700/40 text-xs text-white placeholder-amber-400/40 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Table Container with Horizontal Scroll Protection (game-ui-ux) */}
              <div className="bg-black/35 backdrop-blur-md rounded-2xl border border-amber-500/30 overflow-hidden shadow-xl">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-black/60 border-b border-amber-900/60 text-amber-300 font-game font-bold">
                        <th className="p-3 w-32">รหัสนักศึกษา</th>
                        <th className="p-3">ชื่อ</th>
                        <th className="p-3 w-32 text-center">รหัสผ่าน</th>
                        <th className="p-3 w-28 text-center">เหรียญ</th>
                        <th className="p-3 w-28 text-center">ข้อถูก</th>
                        <th className="p-3 w-44">เล่นล่าสุด</th>
                        <th className="p-3 w-28 text-center">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-amber-300/60 italic">
                            ยังไม่มีบัญชีในเบราว์เซอร์นี้
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((acc) => {
                          const isAdmin = acc.studentId.toLowerCase() === "admin";
                          return (
                            <tr
                              key={acc.studentId}
                              onClick={() => setSelectedStudentForCoins(acc)}
                              className="hover:bg-amber-500/10 cursor-pointer transition-colors"
                            >
                              <td className="p-3 font-mono font-bold text-amber-200">
                                {acc.studentId}
                              </td>
                              <td className="p-3 font-bold text-white">
                                {acc.displayName}
                                {isAdmin && (
                                  <span className="ml-2 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/40">
                                    Admin
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex justify-center items-center space-x-1.5">
                                  {revealedPasswords[acc.studentId] ? (
                                    <span className="font-mono text-amber-200 text-xs bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 select-text">
                                      {revealedPasswords[acc.studentId]}
                                    </span>
                                  ) : (
                                    <span className="font-mono text-slate-500 text-xs">
                                      ••••••
                                    </span>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (revealedPasswords[acc.studentId]) {
                                        setRevealedPasswords(prev => {
                                          const next = { ...prev };
                                          delete next[acc.studentId];
                                          return next;
                                        });
                                      } else {
                                        setAdminPasswordInput("");
                                        setPasswordRevealError("");
                                        setShowPasswordModal({ isOpen: true, studentId: acc.studentId, studentName: acc.displayName });
                                      }
                                    }}
                                    className="px-2 py-1 bg-amber-900/40 hover:bg-amber-500/30 border border-amber-500/40 rounded text-[10px] font-bold text-amber-300 transition-colors"
                                  >
                                    {revealedPasswords[acc.studentId] ? "ซ่อน" : "ดูรหัส"}
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 text-center font-mono font-bold text-[#E6A100]">
                                <div className="flex items-center justify-center gap-1">
                                  <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full border border-yellow-600 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center">
                                    <span className="text-[8px] font-black text-yellow-900 leading-none">N</span>
                                  </div>
                                  {acc.coins}
                                </div>
                              </td>
                              <td className="p-3 text-center font-mono font-bold text-[#2EAD4B]">
                                {acc.correctCount || 0}
                              </td>
                              <td className="p-3 text-slate-400 text-[11px]">
                                {acc.lastPlayedAt ? new Date(acc.lastPlayedAt).toLocaleString("th-TH") : "ยังไม่ได้เล่น"}
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  acc.disabled
                                    ? "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                                    : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                                }`}>
                                  {acc.disabled ? "ระงับการใช้งาน" : "ปกติ"}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Footer loading info */}
                <div className="p-3 border-t border-amber-900/60 bg-black/40 flex justify-between items-center">
                  <div className="text-xs text-amber-300/60">
                    โหลดเมื่อ: {studentsLoadedAt ? studentsLoadedAt.toLocaleTimeString("th-TH") : "ยังไม่ได้โหลด"}
                  </div>
                  <div className="text-xs text-amber-300/60 font-bold">
                    จำนวนบัญชีทั้งหมด: {students.length} บัญชี
                  </div>
                </div>

              </div>
            </div>
          )}
'''

    final_content = content[:start_idx] + new_content + content[end_idx:]
    with open('apps/web/src/app/admin/page.tsx', 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("Success")
else:
    print("Not found", match_start, match_end)
