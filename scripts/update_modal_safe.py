import re

with open('apps/web/src/components/splash/StudentLoginModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State
content = content.replace('const [displayName, setDisplayName] = useState("");\n  ', '')

# 2. handleUseDisplayNameAsPassword
block_to_remove = """  // Quick helper to use displayName as password
  const handleUseDisplayNameAsPassword = () => {
    sounds.playClick();
    if (displayName.trim()) {
      setPassword(displayName.trim());
      setError(null);
    } else {
      setError("กรุณากรอกชื่อที่โชว์ด้านบนก่อนเพื่อนำมาตั้งเป็นรหัสผ่าน");
    }
  };"""
content = content.replace(block_to_remove, "")

# 3. Validation
val_block = """      if (!displayName.trim()) {
        setError("กรุณากรอกชื่อที่โชว์ด้านบน");
        return;
      }"""
content = content.replace(val_block, "")

# 4. registerNaAccount call
content = content.replace(
    'displayName: displayName.trim(),',
    'displayName: `นักศึกษา ${cleanId.slice(-4)}`,'
)

# 5. JSX Block
jsx_block = """                {/* Display Name */}
                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">
                    ชื่อที่โชว์ด้านบน (เช่น ภูมิ ภูวนาถ หรือ หมอนิว) *
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="เช่น ภูมิ หรือ หมอนิว"
                    maxLength={20}
                    className="w-full px-4 py-2 bg-amber-950/80 border-2 border-amber-600/80 rounded-xl text-white placeholder-amber-400/40 text-sm focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all font-bold"
                  />
                </div>"""
content = content.replace(jsx_block, "")

# 6. Button
btn_block = """                  <button
                    type="button"
                    onClick={handleUseDisplayNameAsPassword}
                    className="text-[10.5px] text-emerald-300 hover:text-emerald-100 underline font-bold cursor-pointer"
                    title="ใช้ชื่อที่โชว์ด้านบนเป็นรหัสผ่าน"
                  >
                    ใช้ชื่อด้านบน 👆
                  </button>"""
content = content.replace(btn_block, "")

# 7. Text
content = content.replace('* รหัสผ่านตั้งเองได้ และสามารถใช้ชื่อด้านบนเป็นรหัสผ่านได้', '* รหัสผ่านตั้งได้เอง ใช้อะไรก็ได้')


with open('apps/web/src/components/splash/StudentLoginModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
