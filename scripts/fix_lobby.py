import re

with open('apps/web/src/app/lobby/[code]/LobbyClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'syncRef\.current\?\.publish\(\{ type: "MATCH_START", roomCode \}\);\s*router\.push\(`\/play\/\?code=\$\{roomCode\}`\);'
repl = r'''syncRef.current?.publish({ type: "MATCH_START", roomCode });
    if (room.settings.spotlightMode) {
      router.push(`/board/?code=${roomCode}`);
    } else {
      router.push(`/play/?code=${roomCode}`);
    }'''
content = re.sub(pattern, repl, content)

with open('apps/web/src/app/lobby/[code]/LobbyClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated LobbyClient correctly")
