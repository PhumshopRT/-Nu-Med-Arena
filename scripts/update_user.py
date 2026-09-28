import re

with open('apps/web/src/lib/user.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update registerNaAccount error message
content = content.replace(
    '"รหัสนักศึกษานี้ได้ลงทะเบียนไว้แล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านเดิม"',
    '"มีบัญชีแล้ว ให้เข้าสู่ระบบ"'
)

# Fix loginNaAccount password check
old_pwd_check = """    // Check password: allow configured password, or for existing accounts allow displayName, "1234", or last 4 digits
    const isMatch =
      account.password === cleanPass ||
      cleanPass === account.displayName ||
      cleanPass === "1234" ||
      cleanPass === account.studentId.slice(-4);"""

new_pwd_check = """    // Check password strictly
    const isMatch = account.password === cleanPass;"""

content = content.replace(old_pwd_check, new_pwd_check)

with open('apps/web/src/lib/user.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated user.ts")
