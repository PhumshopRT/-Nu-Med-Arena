import re

with open('apps/web/src/lib/user.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'try { decoded = atob(decoded.substring(4)); } catch {}',
    'try { const b64 = decoded.substring(4); try { decoded = decodeURIComponent(atob(b64)); } catch { decoded = atob(b64); } } catch {}'
)

content = content.replace(
    '`b64:${btoa(acc.password)}`',
    '`b64:${btoa(encodeURIComponent(acc.password))}`'
)

with open('apps/web/src/lib/user.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
