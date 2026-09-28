import re
import glob

play_path = glob.glob('apps/web/src/app/play/*/PlayClient.tsx')[0]

with open(play_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add isClassMode
if 'const isClassMode = roomCode && roomCode !== "SOLO_PRACTICE" && roomCode !== "DEMO";' not in content:
    content = content.replace(
        'const [room, setRoom] = useState<PublicRoomState | null>(null);',
        'const [room, setRoom] = useState<PublicRoomState | null>(null);\n    const isClassMode = roomCode && roomCode !== "SOLO_PRACTICE" && roomCode !== "DEMO";'
    )

# Desktop Clue
desktop_clue = r'''            {/* Desktop Clue Slot (hidden on phone, shown on md+) */}
            <div className="hidden md:flex flex-col items-center">
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider mb-1 drop-shadow-md">
                คำใบ้ส่วนตัว (PRIVATE CLUE)
              </span>
              {isClueRevealed && currentClue ? (
                <motion.div initial={{ scale: 0.8, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }} transition={{ duration: 0.4 }}>
                  <ClueCardComponent card={currentClue} size="md" />
                </motion.div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playSelect();
                    setShowClueConfirm(true);
                  }}
                  className="w-38 md:w-44 h-54 md:h-62 rounded-2xl border-2 border-dashed border-emerald-500/60 bg-black/28 hover:bg-emerald-950/40 backdrop-blur-xs p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-102 shadow-lg group"
                >
                  <HelpCircle className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-emerald-200">«เปิดคำใบ้ -1 ถ้าตอบถูก»</span>
                  <span className="text-[9px] text-emerald-300/80 mt-1">(เปิดแล้วไม่สามารถปิดได้ในตานี้)</span>
                </button>
              )}
            </div>'''

desktop_replacement = r'''            {/* Desktop Clue Slot (hidden on phone, shown on md+) */}
            {!isClassMode && (
              <div className="hidden md:flex flex-col items-center">
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider mb-1 drop-shadow-md">
                  คำใบ้ส่วนตัว (PRIVATE CLUE)
                </span>
                {isClueRevealed && currentClue ? (
                  <motion.div initial={{ scale: 0.8, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }} transition={{ duration: 0.4 }}>
                    <ClueCardComponent card={currentClue} size="md" />
                  </motion.div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playSelect();
                      setShowClueConfirm(true);
                    }}
                    className="w-38 md:w-44 h-54 md:h-62 rounded-2xl border-2 border-dashed border-emerald-500/60 bg-black/28 hover:bg-emerald-950/40 backdrop-blur-xs p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-102 shadow-lg group"
                  >
                    <HelpCircle className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-emerald-200">«เปิดคำใบ้ -1 ถ้าตอบถูก»</span>
                    <span className="text-[9px] text-emerald-300/80 mt-1">(เปิดแล้วไม่สามารถปิดได้ในตานี้)</span>
                  </button>
                )}
              </div>
            )}'''

content = content.replace(desktop_clue, desktop_replacement)

# Mobile Clue
mobile_clue = r'''              {/* Mobile Clue Slot */}
              <div className="flex-1 flex flex-col items-center justify-between p-1.5 rounded-xl border border-emerald-500/50 bg-black/35 backdrop-blur-xs text-center shadow-lg">
                <span className="text-[8px] text-emerald-300 font-bold uppercase">
                  คำใบ้ส่วนตัว (CLUE)
                </span>
                {isClueRevealed && currentClue ? (
                  <div className="scale-[0.65] origin-center my-auto">
                    <ClueCardComponent card={currentClue} size="sm" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playSelect();
                      setShowClueConfirm(true);
                    }}
                    className="w-full flex-1 min-h-[46px] rounded-lg border border-dashed border-emerald-500/40 bg-emerald-950/25 hover:bg-emerald-950/45 flex flex-col items-center justify-center p-1 cursor-pointer mt-0.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
                    <span className="text-[8.5px] font-bold text-emerald-200 leading-tight">«เปิดคำใบ้ -1 ถ้าตอบถูก»</span>
                  </button>
                )}
              </div>'''

mobile_replacement = r'''              {/* Mobile Clue Slot */}
              {!isClassMode && (
                <div className="flex-1 flex flex-col items-center justify-between p-1.5 rounded-xl border border-emerald-500/50 bg-black/35 backdrop-blur-xs text-center shadow-lg">
                  <span className="text-[8px] text-emerald-300 font-bold uppercase">
                    คำใบ้ส่วนตัว (CLUE)
                  </span>
                  {isClueRevealed && currentClue ? (
                    <div className="scale-[0.65] origin-center my-auto">
                      <ClueCardComponent card={currentClue} size="sm" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playSelect();
                        setShowClueConfirm(true);
                      }}
                      className="w-full flex-1 min-h-[46px] rounded-lg border border-dashed border-emerald-500/40 bg-emerald-950/25 hover:bg-emerald-950/45 flex flex-col items-center justify-center p-1 cursor-pointer mt-0.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
                      <span className="text-[8.5px] font-bold text-emerald-200 leading-tight">«เปิดคำใบ้ -1 ถ้าตอบถูก»</span>
                    </button>
                  )}
                </div>
              )}'''

content = content.replace(mobile_clue, mobile_replacement)

with open(play_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Safe replacement complete")
