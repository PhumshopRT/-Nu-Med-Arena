import re

with open('apps/web/src/components/splash/StudentLoginModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the button block
content = re.sub(
    r'<button\s+type="button"\s+onClick=\{handleUseDisplayNameAsPassword\}[\s\S]*?</button>',
    '',
    content
)

with open('apps/web/src/components/splash/StudentLoginModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
