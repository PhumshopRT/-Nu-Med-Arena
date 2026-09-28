import re

with open('apps/web/src/components/splash/StudentLoginModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove state
content = re.sub(r'const \[displayName, setDisplayName\] = useState\(""\);\n', '', content)

# Remove handleUseDisplayNameAsPassword block (which spans multiple lines properly)
content = re.sub(r'  // Quick helper to use displayName as password[\s\S]*?\}\n', '', content)

# Remove empty display name check in handleRegister
content = re.sub(r'      if \(!displayName\.trim\(\)\) \{\n        setError\("กรุณากรอกชื่อที่โชว์ด้านบน"\);\n        return;\n      \}\n', '', content)

# Replace displayName in registerNaAccount call
content = re.sub(r'displayName: displayName\.trim\(\),', r'displayName: `นักศึกษา ${cleanId.slice(-4)}`,', content)

# Remove input block for display name
content = re.sub(
    r'\{/\* Display Name \*/\}[\s\S]*?</div>',
    '',
    content,
    count=1
)

# Remove "ใช้ชื่อด้านบน" texts
content = content.replace('* รหัสผ่านตั้งเองได้ และสามารถใช้ชื่อด้านบนเป็นรหัสผ่านได้', '* รหัสผ่านตั้งได้เอง ใช้อะไรก็ได้')

# Remove the button that fills password
content = re.sub(r'<button[\s\S]*?onClick=\{handleUseDisplayNameAsPassword\}[\s\S]*?</button>', '', content)

with open('apps/web/src/components/splash/StudentLoginModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
