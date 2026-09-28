import re
import glob

files = glob.glob('apps/web/src/app/play/*/PlayClient.tsx')
play_path = files[0]

with open(play_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add isClassMode
if 'const isClassMode = roomCode && roomCode !== "SOLO_PRACTICE";' not in content:
    content = content.replace(
        'const [room, setRoom] = useState<PublicRoomState | null>(null);',
        'const [room, setRoom] = useState<PublicRoomState | null>(null);\n  const isClassMode = roomCode && roomCode !== "SOLO_PRACTICE" && roomCode !== "DEMO";'
    )

desktop_str = r'{/\* Desktop Clue Slot \(hidden on phone, shown on md\+\) \*/\}'
content = content.replace(desktop_str, '{!isClassMode && (\n            <>\n' + desktop_str)

mobile_str = r'{/\* Mobile YOUR MATCH Slot \*/\}'
content = content.replace(mobile_str, '</>\n          )}\n' + mobile_str)

with open(play_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated properly.")
