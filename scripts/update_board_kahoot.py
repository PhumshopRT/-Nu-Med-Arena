import re
import glob

board_path = glob.glob('apps/web/src/app/board/*/BoardClient.tsx')[0]

with open(board_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace everything from <main ... to </main>
main_pattern = re.compile(r'<main className="relative z-10 flex-1 grid grid-cols-12 gap-8 my-6 items-center">.*?</main>', re.DOTALL)

new_main = r'''
      <main className="relative z-10 flex-1 flex flex-col w-full h-full p-6">
        {(room.phase === "LOBBY" || room.phase === "DEAL" || room.phase === "SHOW_CASE") ? (
          <div className="flex flex-col items-center justify-center w-full h-full space-y-8">
            <div className="bg-black/50 border-4 border-amber-500 rounded-3xl p-12 text-center shadow-[0_0_100px_rgba(245,158,11,0.2)]">
              <h2 className="text-4xl text-amber-300 font-bold mb-4">เข้าสู่ระบบด้วยรหัสห้อง</h2>
              <div className="text-8xl md:text-9xl font-black text-white tracking-widest font-mono drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                {roomCode}
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-amber-950/80 px-8 py-4 rounded-2xl border-2 border-amber-600">
              <Users className="w-8 h-8 text-amber-400" />
              <span className="text-2xl text-amber-100 font-bold">รอผู้เล่น... ({players.length} คน)</span>
            </div>
            <div className="w-full max-w-5xl flex flex-wrap justify-center gap-4 mt-8 max-h-[300px] overflow-y-auto custom-scrollbar p-4">
              {players.map(p => (
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={p.id} className="bg-amber-900/60 border-2 border-amber-500/50 px-6 py-3 rounded-2xl flex items-center space-x-3">
                  <span className="text-3xl">{p.avatar || "👨‍🎓"}</span>
                  <span className="text-xl font-bold text-white">{p.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ) : room.phase === "REVEAL" ? (
          <div className="flex flex-col w-full h-full items-center">
            <div className="w-full flex justify-between items-start mb-8">
               <div className="bg-emerald-950/90 border-4 border-emerald-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center max-w-2xl">
                  <h3 className="text-emerald-300 text-2xl font-black mb-4 uppercase tracking-widest">คำตอบที่ถูกต้อง</h3>
                  <div className="flex items-center justify-center space-x-6 w-full">
                    <div className="flex-1 bg-black/50 rounded-2xl p-6 text-center border-2 border-emerald-800">
                      <div className="text-emerald-500 text-sm font-bold mb-2">สารเภสัชรังสี (Radiopharmaceutical)</div>
                      <div className="text-white font-black text-2xl">{correctRp?.titleTh || currentCase.acceptedRpIds[0]}</div>
                    </div>
                    <div className="flex-1 bg-black/50 rounded-2xl p-6 text-center border-2 border-emerald-800">
                      <div className="text-emerald-500 text-sm font-bold mb-2">กลไก (Mechanism)</div>
                      <div className="text-white font-black text-2xl">{correctMech?.titleTh || currentCase.acceptedMechIds[0]}</div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Podium */}
            <div className="flex-1 flex flex-col items-center justify-end w-full max-w-5xl mt-auto pb-10">
              <h2 className="text-4xl text-amber-300 font-black mb-10 drop-shadow-lg">สรุปอันดับ (LEADERBOARD)</h2>
              <div className="flex items-end justify-center space-x-4 h-64 w-full">
                {/* 2nd Place */}
                {players.length > 1 && (
                  <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center justify-end w-1/3 max-w-[200px]">
                    <div className="text-4xl mb-2">{[...players].sort((a,b)=>b.score-a.score)[1].avatar || "👨‍🎓"}</div>
                    <div className="font-bold text-white text-xl truncate w-full text-center px-2">{[...players].sort((a,b)=>b.score-a.score)[1].name}</div>
                    <div className="font-mono text-amber-300 font-bold mb-4">{[...players].sort((a,b)=>b.score-a.score)[1].score} PTS</div>
                    <div className="w-full h-40 bg-slate-300 rounded-t-xl border-t-8 border-slate-400 flex justify-center pt-4 shadow-2xl relative overflow-hidden">
                       <span className="text-5xl font-black text-slate-500">2</span>
                       <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                    </div>
                  </motion.div>
                )}

                {/* 1st Place */}
                {players.length > 0 && (
                  <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center justify-end w-1/3 max-w-[220px] z-10">
                    <div className="absolute -top-12 animate-bounce"><Trophy className="w-12 h-12 text-yellow-400" /></div>
                    <div className="text-5xl mb-2">{[...players].sort((a,b)=>b.score-a.score)[0].avatar || "👨‍🎓"}</div>
                    <div className="font-bold text-white text-2xl truncate w-full text-center px-2 drop-shadow-md">{[...players].sort((a,b)=>b.score-a.score)[0].name}</div>
                    <div className="font-mono text-yellow-300 font-black mb-4 text-lg">{[...players].sort((a,b)=>b.score-a.score)[0].score} PTS</div>
                    <div className="w-full h-56 bg-yellow-400 rounded-t-xl border-t-8 border-yellow-200 flex justify-center pt-4 shadow-[0_0_40px_rgba(250,204,21,0.5)] relative overflow-hidden">
                       <span className="text-6xl font-black text-yellow-700">1</span>
                       <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
                    </div>
                  </motion.div>
                )}

                {/* 3rd Place */}
                {players.length > 2 && (
                  <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0 }} className="flex flex-col items-center justify-end w-1/3 max-w-[180px]">
                    <div className="text-4xl mb-2">{[...players].sort((a,b)=>b.score-a.score)[2].avatar || "👨‍🎓"}</div>
                    <div className="font-bold text-white text-lg truncate w-full text-center px-2">{[...players].sort((a,b)=>b.score-a.score)[2].name}</div>
                    <div className="font-mono text-orange-300 font-bold mb-4">{[...players].sort((a,b)=>b.score-a.score)[2].score} PTS</div>
                    <div className="w-full h-32 bg-orange-600 rounded-t-xl border-t-8 border-orange-400 flex justify-center pt-4 shadow-2xl relative overflow-hidden">
                       <span className="text-5xl font-black text-orange-900">3</span>
                       <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-12 gap-8 items-center w-full h-full">
            {/* Left: Case Display */}
            <div className="col-span-12 lg:col-span-7 flex flex-col items-center justify-center h-full">
              <div className="flex flex-col items-center justify-center w-full h-full">
                {displayMode === "big-card" ? (
                  <div className="transform scale-110 md:scale-125 my-8">
                    <CaseCardComponent card={currentCase} size="lg" isHoverable={false} />
                  </div>
                ) : (
                  <div className="w-full max-w-3xl bg-red-950/80 border-4 border-red-600 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(220,38,38,0.3)] backdrop-blur-sm">
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-relaxed tracking-wide">
                      {currentCase.promptTh}
                    </h2>
                  </div>
                )}

                {/* Status */}
                {room.phase === "THINK" && (
                  <div className="mt-8 bg-amber-950/80 border-2 border-amber-600 px-8 py-3 rounded-2xl flex items-center space-x-4 shadow-xl">
                    <Users className="w-6 h-6 text-emerald-400" />
                    <span className="font-black text-xl text-amber-100">
                      ส่งคำตอบแล้ว: <strong className="text-emerald-400">{lockedCount} / {Math.max(players.length, 1)}</strong> คน
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Leaderboard (THINK Phase) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col h-[600px]">
              <div className="wood-panel p-6 rounded-3xl border-4 border-amber-950 shadow-2xl flex flex-col h-full bg-black/60 backdrop-blur-md">
                <div className="flex justify-between items-center mb-4 border-b border-amber-800/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-amber-400" />
                    <h3 className="font-black text-xl text-amber-200">
                      อันดับคะแนน (LEADERBOARD)
                    </h3>
                  </div>
                  <span className="text-xs text-amber-300 font-bold">
                    {players.length} ผู้เล่น
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {[...players]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 50)
                    .map((p, rank) => (
                      <div
                        key={p.id}
                        className={`flex justify-between items-center p-3 rounded-2xl border-2 ${
                          rank < 3 && room.phase === "REVEAL"
                            ? "bg-amber-900/90 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                            : "bg-black/50 border-amber-900/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`font-black text-lg w-8 text-center ${rank === 0 ? "text-yellow-400" : rank === 1 ? "text-slate-300" : rank === 2 ? "text-orange-400" : "text-amber-500/60"}`}>
                            #{rank + 1}
                          </span>
                          <span className="text-2xl">{p.avatar || "👨‍🎓"}</span>
                          <div>
                            <div className="font-bold text-sm text-white">{p.name}</div>
                            <div className="text-[10px] text-amber-300/60 font-mono">{p.studentId}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {room.phase === "THINK" && (
                            p.locked ? (
                              <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3" /> <span>ล็อค</span>
                              </span>
                            ) : (
                              <span className="bg-amber-600 text-amber-100 text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                                คิด...
                              </span>
                            )
                          )}
                          <span className="font-mono font-black text-xl text-amber-200">
                            {p.score}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
'''

content = main_pattern.sub(new_main, content)

with open(board_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated BoardClient Main Area!")
