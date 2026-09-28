import re

with open('apps/web/src/lib/user.ts', 'r', encoding='utf-8') as f:
    content = f.read()

target = """export function registerAccount(params: {
  studentId: string;
  displayName?: string;
  avatarId?: string;
  rememberMe?: boolean;
}): StudentUser {
  const name = params.displayName?.trim() || `นักศึกษา ${params.studentId.slice(-4)}`;
  const res = registerNaAccount({
    studentId: params.studentId,
    displayName: name,
    password: name, // default password to display name
    avatarId: params.avatarId,
    rememberMe: params.rememberMe
  });
  if (res.user) return res.user;
  return createDefaultUser(params.studentId, params.displayName);
}"""

# Actually, whitespace might differ. Let's use regex
content = re.sub(
    r'export function registerAccount\(params: \{.*?return createDefaultUser.*?\}',
    r'''export function registerAccount(params: {
  studentId: string;
  password?: string;
  displayName?: string;
  avatarId?: string;
  rememberMe?: boolean;
}): StudentUser {
  const name = params.displayName?.trim() || `นักศึกษา ${params.studentId.slice(-4)}`;
  const pass = params.password?.trim() || name;
  const res = registerNaAccount({
    studentId: params.studentId,
    displayName: name,
    password: pass,
    avatarId: params.avatarId,
    rememberMe: params.rememberMe
  });
  if (res.user) return res.user;
  return createDefaultUser(params.studentId, params.displayName);
}''',
    content,
    flags=re.DOTALL
)

with open('apps/web/src/lib/user.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
