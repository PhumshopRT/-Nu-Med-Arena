import re
import glob

files = glob.glob('apps/web/src/app/lobby/*/LobbyClient.tsx')
file_path = files[0]

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We replace the select block
pattern = r'(<div className="flex justify-between items-center">\s*<span>จำนวนรอบแข่งขัน:</span>[\s\S]*?</div>)'
new_text = r'''\1

                  <div className="flex justify-between items-center">
                    <span>เวลาต่อข้อ:</span>
                    <select
                      value={room?.settings.thinkSeconds ?? 30}
                      onChange={(e) => {
                        sounds.playSelect();
                        if (room) {
                          const newSettings = { ...room.settings, thinkSeconds: Number(e.target.value) };
                          saveAndBroadcastRoom({ ...room, settings: newSettings });
                        }
                      }}
                      className="bg-amber-950 border border-amber-600 rounded-lg px-2.5 py-1 text-white font-bold outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      <option value={15}>15 วินาที</option>
                      <option value={20}>20 วินาที</option>
                      <option value={30}>30 วินาที</option>
                      <option value={45}>45 วินาที</option>
                      <option value={60}>60 วินาที</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>รูปแบบจอสปอตไลต์:</span>
                    <select
                      value={room?.settings.spotlightMode ?? "big-card"}
                      onChange={(e) => {
                        sounds.playSelect();
                        if (room) {
                          const newSettings = { ...room.settings, spotlightMode: e.target.value as any };
                          saveAndBroadcastRoom({ ...room, settings: newSettings });
                        }
                      }}
                      className="bg-amber-950 border border-amber-600 rounded-lg px-2.5 py-1 text-white font-bold outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      <option value="big-card">แบบการ์ดใหญ่ (Big Card)</option>
                      <option value="text">แบบข้อความ (Text Mode)</option>
                    </select>
                  </div>'''

content = re.sub(pattern, new_text, content, count=1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Regex replaced settings.")
