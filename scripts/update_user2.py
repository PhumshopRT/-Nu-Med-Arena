import re

with open('apps/web/src/lib/user.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'// Check password: allow configured password.*?account\.studentId\.slice\(-4\);',
    r'// Check password strictly\n    const isMatch = account.password === cleanPass;',
    content,
    flags=re.DOTALL
)

with open('apps/web/src/lib/user.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
