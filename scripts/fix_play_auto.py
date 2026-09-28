import re

with open('apps/web/src/app/play/[code]/PlayClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Do not setupRound on mount if isClassMode
pattern_mount = r'setPlayers\(matchPlayers\);\s*setupRound\(1, shuffledRp\.slice\(5\), initialHand\);'
repl_mount = r'''setPlayers(matchPlayers);
    if (!isClassMode) {
      setupRound(1, shuffledRp.slice(5), initialHand);
    }'''
content = re.sub(pattern_mount, repl_mount, content)

# 2. Do not auto-reveal after lockAnswer
pattern_lock = r'''if \(user\) \{\s*syncRef\.current\?\.publish\(\{\s*type: "PLAYER_LOCK",\s*playerId: `p_\$\{user\.studentId\}`,\s*locked: true,\s*answer: \{\s*rpId: selectedRp\?\.id \|\| "",\s*mechId: selectedMech\?\.id \|\| ""\s*\}\s*\}\);\s*\}\s*// Transition to REVEAL after 1\.2s delay\s*setTimeout\(\(\) => \{\s*revealAnswers\(\);\s*\}, 1200\);'''
repl_lock = r'''if (user) {
      syncRef.current?.publish({
        type: "PLAYER_LOCK",
        playerId: `p_${user.studentId}`,
        locked: true,
        answer: {
          rpId: selectedRp?.id || "",
          mechId: selectedMech?.id || ""
        }
      });
    }

    if (!isClassMode) {
      // Transition to REVEAL after 1.2s delay
      setTimeout(() => {
        revealAnswers();
      }, 1200);
    }'''
content = re.sub(pattern_lock, repl_lock, content)

# 3. Do not show Next Round button
pattern_next_btn = r'''<button\s*onClick=\{handleNextRound\}\s*className="w-full py-3\.5 bg-play hover:bg-play-hover border-3 border-play-border rounded-2xl font-game font-black text-lg text-white tracking-wider shadow-play-btn active:shadow-play-btn-pressed transition-all flex items-center justify-center space-x-2 cursor-pointer"\s*>\s*<span>ไปรอบถัดไป</span>\s*<ChevronRight className="w-5 h-5" />\s*</button>'''
repl_next_btn = r'''{isClassMode ? (
                  <div className="w-full py-3.5 bg-amber-950 border-3 border-amber-800 rounded-2xl font-game font-black text-lg text-amber-500 tracking-wider shadow-inner flex items-center justify-center space-x-2">
                    <Clock className="w-5 h-5 animate-pulse" />
                    <span>รอคุณครู...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleNextRound}
                    className="w-full py-3.5 bg-play hover:bg-play-hover border-3 border-play-border rounded-2xl font-game font-black text-lg text-white tracking-wider shadow-play-btn active:shadow-play-btn-pressed transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>ไปรอบถัดไป</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}'''
content = re.sub(pattern_next_btn, repl_next_btn, content)

with open('apps/web/src/app/play/[code]/PlayClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated PlayClient correctly")
