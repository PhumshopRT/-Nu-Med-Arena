import re

with open('apps/web/src/app/profile/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('maxLength={60}', 'maxLength={80}')
content = content.replace('(สูงสุด 60 ตัวอักษร)', '(สูงสุด 80 ตัวอักษร)')

with open('apps/web/src/app/profile/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
