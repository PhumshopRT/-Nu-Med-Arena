import { TypeSafeClient, choice, score } from "@typesafe-ai/sdk";
import fs from "fs";
import path from "path";

// Exact key provided by user
const apiKey = "REVOKED_KEY_REMOVED";
const client = new TypeSafeClient({ apiKey });

async function runFullAudit() {
  console.log("🚀 Initializing Full JEV System Audit...");

  // Read the core files
  const playClientPath = path.resolve("apps/web/src/app/play/[code]/PlayClient.tsx");
  const adminPagePath = path.resolve("apps/web/src/app/admin/page.tsx");
  const mechCardPath = path.resolve("apps/web/src/components/cards/MechCard.tsx");
  
  const playCode = fs.existsSync(playClientPath) ? fs.readFileSync(playClientPath, "utf-8") : "";
  const adminCode = fs.existsSync(adminPagePath) ? fs.readFileSync(adminPagePath, "utf-8") : "";
  const mechCode = fs.existsSync(mechCardPath) ? fs.readFileSync(mechCardPath, "utf-8") : "";

  // Extract key sections to avoid token limits
  const playUiState = playCode.substring(playCode.indexOf("const [expandedMechId"), playCode.indexOf("const [expandedMechId") + 500);
  const playMechPopup = playCode.substring(playCode.indexOf("Expanded Mechanism Card Popup"), playCode.indexOf("Expanded Mechanism Card Popup") + 2000);
  const adminPasswordSystem = adminCode.substring(adminCode.indexOf("handleRevealPassword"), adminCode.indexOf("handleRevealPassword") + 1000);
  const adminTable = adminCode.substring(adminCode.indexOf("TAB 4: นักเรียน"), adminCode.indexOf("TAB 4: นักเรียน") + 2000);

  console.log("📤 Sending full system state to JEV for Review...");
  
  try {
    const result = await client.systemOne({
      state: {
        playUiState,
        playMechPopup,
        adminPasswordSystem,
        adminTable,
        projectRules: "1. No hardcoding data, use TS files. 2. Mobile first, Desktop floating. 3. Admin passwords must require re-auth with 'rtkmpht'. 4. Match Finished scroll must not be locked."
      },
      questions: {
        adminSecurityCheck: choice("Is the admin password reveal system secure according to the rules?", {
          "passed": "Yes, it properly requires the 'rtkmpht' password before setting the revealed passwords state.",
          "failed": "No, it reveals it directly without a prompt or uses the wrong password."
        }),
        playPopupArchitecture: choice("Is the Mechanism Popup architecture correct?", {
          "passed": "Yes, it toggles properly with expandedMechId and uses floating UI on desktop and bottom sheet on mobile.",
          "failed": "No, it overlaps critical UI or uses full-screen blocking modals incorrectly."
        }),
        codeCleanliness: choice("Is the code clean and well-structured?", {
          "passed": "Code is clean, uses proper React state, and avoids unnecessary re-renders.",
          "failed": "Code is messy, hardcoded, or tightly coupled."
        }),
        overallApproval: choice("Does the system pass the JEV core review?", {
          "yes": "Yes, all systems are robust.",
          "no": "No, needs immediate fixes."
        })
      }
    });

    console.log("✅ JEV Audit Complete!");
    console.log("📊 Results:");
    console.log(JSON.stringify(result.answers, null, 2));

  } catch (err) {
    console.error("❌ Error hitting TypeSafe API:", err);
  }
}

runFullAudit().catch(console.error);
