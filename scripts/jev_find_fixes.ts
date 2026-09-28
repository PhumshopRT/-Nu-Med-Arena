import { TypeSafeClient, choice } from "@typesafe-ai/sdk";
import fs from "fs";
import path from "path";

const apiKey = "REVOKED_KEY_REMOVED";
const client = new TypeSafeClient({ apiKey });

async function findFixes() {
  console.log("🚀 Asking JEV for Code Improvements...");

  const adminPagePath = path.resolve("apps/web/src/app/admin/page.tsx");
  const playClientPath = path.resolve("apps/web/src/app/play/[code]/PlayClient.tsx");
  
  const adminCode = fs.readFileSync(adminPagePath, "utf-8");
  const playCode = fs.readFileSync(playClientPath, "utf-8");

  const adminTable = adminCode.substring(adminCode.indexOf("TAB 4: นักเรียน"), adminCode.indexOf("TAB 4: นักเรียน") + 2500);

  const result = await client.systemOne({
    state: {
      adminTableCode: adminTable,
      playUiState: playCode.substring(0, 1500)
    },
    questions: {
      refactorTarget: choice("Which part of the code needs the most urgent refactoring for cleanliness?", {
        "admin-table": "The admin table is too deeply nested and complex. Extract the table row into a separate component.",
        "play-client-state": "The PlayClient has too many useState declarations at the top. Group them into a reducer or context.",
        "inline-styles": "Too many inline Tailwind classes. Extract them to clsx variables.",
        "none": "Code is fine, it was a false positive."
      })
    }
  });

  console.log("✅ JEV Improvement Suggestions:");
  console.log(JSON.stringify(result.answers, null, 2));
}

findFixes().catch(console.error);
