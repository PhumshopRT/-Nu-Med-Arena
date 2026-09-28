import { TypeSafeClient, choice, score } from "@typesafe-ai/sdk";
import fs from "fs";
import path from "path";

const apiKey = "REVOKED_KEY_REMOVED";
const client = new TypeSafeClient({ apiKey });

async function runAudit() {
  console.log("🚀 Initializing JEV Code Audit...");

  // Read the modified files
  const adminPagePath = path.resolve("apps/web/src/app/admin/page.tsx");
  const playClientPath = path.resolve("apps/web/src/app/play/[code]/PlayClient.tsx");
  
  const adminCode = fs.readFileSync(adminPagePath, "utf-8");
  const playCode = fs.readFileSync(playClientPath, "utf-8");

  // Extract relevant snippets to avoid exceeding token limits
  const adminSnippet = adminCode.substring(adminCode.indexOf("handleRevealPassword"), adminCode.indexOf("handleRevealPassword") + 1000);
  const playModalSnippet = playCode.substring(playCode.indexOf("6. Match Result / Podium Modal"), playCode.indexOf("6. Match Result / Podium Modal") + 1500);
  const playMechPopupSnippet = playCode.substring(playCode.indexOf("Expanded Mechanism Card Popup"), playCode.indexOf("Expanded Mechanism Card Popup") + 2000);

  console.log("📤 Sending Code to JEV for Review...");
  
  const result = await client.systemOne({
    state: {
      adminCode: adminSnippet,
      playModalCode: playModalSnippet,
      playMechPopupCode: playMechPopupSnippet,
      constraints: {
        1: "Admin password viewer must check for 'rtkmpht' before revealing passwords.",
        2: "MATCH FINISHED modal must be scrollable using overflow-y-auto to prevent clipping.",
        3: "Expanded Mechanism Card on desktop must use absolute/fixed positioning to not overlap center elements."
      }
    },
    questions: {
      adminPasswordCheck: choice("Does the admin code enforce the 'rtkmpht' password check constraint?", {
        "passed": "Yes, the code properly checks the password.",
        "failed": "No, it is missing or incorrect."
      }),
      scrollFixCheck: choice("Does the MATCH FINISHED modal code implement overflow-y-auto?", {
        "passed": "Yes, scroll classes are present.",
        "failed": "No, it will still clip."
      }),
      layoutCheck: choice("Does the mechanism popup logic use floating/fixed positioning for desktop?", {
        "passed": "Yes, fixed/absolute positioning is used.",
        "failed": "No, it disrupts the flow."
      }),
      overallRating: choice("Overall, does this implementation pass all strict constraints?", {
        "yes": "All constraints passed successfully.",
        "no": "Some constraints failed."
      })
    }
  });

  console.log("✅ JEV Audit Complete!");
  console.log("📊 Results:");
  console.log(JSON.stringify(result.answers, null, 2));

  if (result.answers.overallRating.choice === "yes") {
    console.log("🎯 JEV APPROVED THE DEPLOYMENT.");
  } else {
    console.error("❌ JEV REJECTED THE CODE.");
    process.exit(1);
  }
}

runAudit().catch(console.error);
