import re
import glob

lobby_path = glob.glob('apps/web/src/app/lobby/*/LobbyClient.tsx')[0]

with open(lobby_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find the table div
table_pattern = re.compile(r'\{\/\* The Casino Felt Oval Table \*\/\}\s*<div className="relative w-full rounded-\[40px\] md:rounded-\[60px\] bg-gradient-to-b from-\[#0A3D36\] via-\[#072824\] to-\[#041D1A\].*?\{\/\* Quick Reaction Emoji Wheel \*\/\}', re.DOTALL)

kahoot_lobby = r'''
            {room?.settings.spotlightMode ? (
              <div className="relative w-full rounded-[40px] md:rounded-[60px] bg-black/50 border-4 border-emerald-500/80 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(16,185,129,0.2)] p-6 md:p-10 flex flex-col items-center justify-start min-h-[460px] md:min-h-[520px]">
                
                {/* Header */}
                <div className="w-full flex justify-between items-center mb-6 border-b border-emerald-500/30 pb-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-emerald-400" />
                    <h2 className="text-2xl md:text-3xl font-black text-emerald-300 tracking-wider">ห้องรอผู้เล่น (CLASS MODE)</h2>
                  </div>
                  <div className="bg-emerald-950/80 px-4 py-2 rounded-xl border border-emerald-700 text-emerald-300 font-bold">
                    {room.players.length} / {room.settings.maxPlayers || 55} คน
                  </div>
                </div>

                {/* Player Grid */}
                <div className="flex-1 w-full max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                  {room.players.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-emerald-300/50 text-xl font-bold">
                      รอผู้เล่นเข้าห้อง...
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                      {room.players.map((p) => (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          key={p.id}
                          className="bg-emerald-900/40 border-2 border-emerald-500/40 px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-lg hover:border-emerald-400 transition-colors"
                        >
                          <span className="text-2xl">{p.avatar || "👨‍🎓"}</span>
                          <span className="text-white font-bold">{p.name}</span>
                          {p.id === room.hostId && <span className="text-amber-400 text-xs ml-1">👑</span>}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="w-full flex justify-center mt-auto">
                  {isHost ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStartGame}
                      disabled={!room || room.players.length < 1}
                      className="px-10 md:px-16 py-4 bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#047857] hover:from-[#4ade80] hover:to-[#059669] border-4 border-[#A7F3D0] rounded-2xl text-white font-game font-black text-xl md:text-3xl tracking-wider shadow-[0_8px_0_#064e3b,0_14px_25px_rgba(0,0,0,0.6)] active:translate-y-2 active:shadow-[0_2px_0_#064e3b] transition-all flex items-center space-x-3 cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-7 h-7 fill-white text-white filter drop-shadow" />
                      <span>เปิดจอโปรเจกเตอร์เพื่อรอผู้เล่น</span>
                    </motion.button>
                  ) : (
                    <div className="px-10 py-4 rounded-2xl font-game font-black text-xl tracking-wider border-3 bg-amber-950/80 border-amber-600 text-amber-300 shadow-xl flex items-center space-x-3">
                       <Clock className="w-6 h-6 animate-pulse" />
                       <span>รอหัวหน้าห้องเปิดหน้าจอ...</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              {/* The Casino Felt Oval Table */}
'''

# We need to extract the exact table HTML block first so we can wrap it
match = table_pattern.search(content)
if match:
    table_block = match.group(0)
    # Remove the Emoji Wheel comment from the end of table_block
    table_block = table_block.replace('{/* Quick Reaction Emoji Wheel */}', '')
    
    new_html = kahoot_lobby + table_block + '''
            )}

            {/* Quick Reaction Emoji Wheel */}'''
    
    content = content[:match.start()] + new_html + content[match.end():]
    
    with open(lobby_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated LobbyClient to support Kahoot waiting room!")
else:
    print("Could not find table pattern!")
