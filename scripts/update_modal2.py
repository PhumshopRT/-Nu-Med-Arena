import re

with open('apps/web/src/components/splash/StudentLoginModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove state
content = re.sub(r'const \[displayName, setDisplayName\] = useState\(""\);\n', '', content)

# Remove handleUseDisplayNameAsPassword
content = re.sub(r'  // Quick helper to use displayName as password[\s\S]*?\}\n', '', content)

# Remove empty display name check in handleRegister
content = re.sub(r'      if \(!displayName\.trim\(\)\) \{\n        setError\("กรุณากรอกชื่อที่โชว์ด้านบน"\);\n        return;\n      \}\n', '', content)

# Replace displayName in registerNaAccount call
content = re.sub(r'displayName: displayName\.trim\(\),', r'displayName: `นักศึกษา ${cleanId.slice(-4)}`,', content)

# Remove input block for display name
content = re.sub(
    r'<div>\s*<label.*?ชื่อที่จะโชว์ให้เพื่อนเห็น[\s\S]*?placeholder="เช่น ภูมิ หรือ หมอนิว"[\s\S]*?</div>\s*</div>',
    '',
    content
)

# Remove "ใช้ชื่อด้านบน" texts
content = content.replace('* รหัสผ่านตั้งเองได้ และสามารถใช้ชื่อด้านบนเป็นรหัสผ่านได้', '* รหัสผ่านตั้งได้เอง ใช้อะไรก็ได้')
content = re.sub(r'<button.*?onClick=\{handleUseDisplayNameAsPassword\}.*?</button>', '', content, flags=re.DOTALL)

with open('apps/web/src/components/splash/StudentLoginModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
