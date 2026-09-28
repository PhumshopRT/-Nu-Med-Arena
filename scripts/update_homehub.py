import re

with open('apps/web/src/components/hub/HomeHub.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the exact block and replace the wrapping <div> with <button>
old_block = """        {/* Left: Player Profile Wood Plaque */}
        <div className="wood-panel px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-2xl border-3 border-amber-950 backdrop-blur-xs">
          <AvatarBadge avatarId={currentUser.equipped?.avatar || "avatar-default"} size={44} />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white font-game">{currentUser.displayName}</span>
              <span className="bg-emerald-600/90 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40">
                LV.{level}
              </span>
            </div>
            <div className="text-[11px] text-amber-200/90 font-mono font-semibold">
              ID: {currentUser.studentId}
            </div>
            {/* XP progress bar */}
            <div className="w-28 md:w-36 h-2 bg-black/50 rounded-full mt-1 overflow-hidden border border-amber-500/40">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all duration-300"
                style={{ width: `${currentXpInLevel}%` }}
              />
            </div>
          </div>
        </div>"""

new_block = """        {/* Left: Player Profile Wood Plaque */}
        <button 
          onClick={() => { sounds.playClick(); router.push("/profile"); }}
          title="คลิกเพื่อตั้งค่าโปรไฟล์"
          className="wood-panel px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-2xl border-3 border-amber-950 backdrop-blur-xs hover:scale-105 hover:border-amber-500 active:scale-95 transition-all cursor-pointer text-left group relative"
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-2xl transition-colors"></div>
          <AvatarBadge avatarId={currentUser.equipped?.avatar || "avatar-default"} size={44} />
          <div className="relative z-10">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white font-game group-hover:text-amber-300 transition-colors">{currentUser.displayName}</span>
              <span className="bg-emerald-600/90 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40">
                LV.{level}
              </span>
            </div>
            <div className="text-[11px] text-amber-200/90 font-mono font-semibold">
              ID: {currentUser.studentId}
            </div>
            {/* XP progress bar */}
            <div className="w-28 md:w-36 h-2 bg-black/50 rounded-full mt-1 overflow-hidden border border-amber-500/40">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all duration-300"
                style={{ width: `${currentXpInLevel}%` }}
              />
            </div>
          </div>
        </button>"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('apps/web/src/components/hub/HomeHub.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced perfectly.")
else:
    print("Block not found!")
