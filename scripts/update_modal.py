import re

with open('apps/web/src/components/splash/StudentLoginModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's verify what the display name input looks like
# We will just replace it with an empty string
content = re.sub(
    r'<div className="relative">[\s\S]*?placeholder="ชื่อเล่น / ชื่อที่ใช้ในเกม"[\s\S]*?</div>',
    '',
    content
)

content = re.sub(
    r'registerAccount\(\{\s*studentId,\s*displayName,\s*avatarId: selectedAvatar,\s*rememberMe\s*\}\)',
    'registerAccount({ studentId, password, avatarId: selectedAvatar, rememberMe })',
    content
)

with open('apps/web/src/components/splash/StudentLoginModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
