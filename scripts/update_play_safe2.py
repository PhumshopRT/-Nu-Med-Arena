import re
import glob

files = glob.glob('apps/web/src/app/play/*/PlayClient.tsx')
play_path = files[0]

with open(play_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add isClassMode
if 'const isClassMode = roomCode && roomCode !== "SOLO_PRACTICE";' not in content:
    content = content.replace(
        'const [room, setRoom] = useState<PublicRoomState | null>(null);',
        'const [room, setRoom] = useState<PublicRoomState | null>(null);\n  const isClassMode = roomCode && roomCode !== "SOLO_PRACTICE" && roomCode !== "DEMO";'
    )

# 2. Desktop Clue Slot
desktop_target = r'''{/* Desktop Clue Slot (hidden on phone, shown on md+) */}
            <div className="hidden md:flex flex-col items-center">'''
desktop_replacement = r'''{/* Desktop Clue Slot (hidden on phone, shown on md+) */}
            {!isClassMode && (
            <div className="hidden md:flex flex-col items-center">'''
content = content.replace(desktop_target, desktop_replacement)

desktop_end_target = r'''                </button>
              )}
            </div>

            {/* Clinical Case Card (Hero in Center on both Phone, iPad & Desktop) */}'''
desktop_end_replacement = r'''                </button>
              )}
            </div>
            )}

            {/* Clinical Case Card (Hero in Center on both Phone, iPad & Desktop) */}'''
content = content.replace(desktop_end_target, desktop_end_replacement)

# 3. Mobile Clue Slot
mobile_target = r'''{/* Mobile Clue Slot */}
            <div className="flex-1 flex flex-col items-center justify-between p-1.5 rounded-xl border border-emerald-500/50 bg-black/35 backdrop-blur-xs text-center shadow-lg">'''
mobile_replacement = r'''{/* Mobile Clue Slot */}
            {!isClassMode && (
            <div className="flex-1 flex flex-col items-center justify-between p-1.5 rounded-xl border border-emerald-500/50 bg-black/35 backdrop-blur-xs text-center shadow-lg">'''
content = content.replace(mobile_target, mobile_replacement)

mobile_end_target = r'''                )}
              </div>

              {/* Mobile YOUR MATCH Slot */}'''
mobile_end_replacement = r'''                )}
              </div>
            )}

              {/* Mobile YOUR MATCH Slot */}'''
content = content.replace(mobile_end_target, mobile_end_replacement)

with open(play_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated precise wrapping.")
