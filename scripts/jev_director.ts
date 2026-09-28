import { TypeSafeClient, choice } from "@typesafe-ai/sdk";

const apiKey = "REVOKED_KEY_REMOVED";
const client = new TypeSafeClient({ apiKey });

async function runDirector() {
  console.log("🚀 [JEV-DIRECTOR] Analyzing project state to issue the next command...");
  
  try {
    const result = await client.systemOne({
      state: {
        current_status: "The ExpandedMechPopup has been extracted. Admin password reveal is implemented. The user requested a full project health check to identify the next critical fix.",
        files: ["apps/web/src/app/play/[code]/PlayClient.tsx", "apps/web/src/app/admin/page.tsx", "apps/web/src/components/cards/"]
      },
      questions: {
        directive: choice("As the Chief Engineer JEV, what is the most critical area the agent must fix right now?", {
          "mobile-layout-audit": "Command the agent to audit all mobile layouts (z-index, clipping, overflowing) in the Play page.",
          "accessibility-aria": "Command the agent to add ARIA labels and keyboard accessibility to all clickable cards.",
          "performance-cleanup": "Command the agent to remove unused imports and console.logs across the web app.",
          "security-review": "Command the agent to check if the Next.js API routes or server actions are secure."
        })
      }
    });

    console.log("✅ [JEV-DIRECTOR] Command Received!");
    console.log(JSON.stringify(result.answers, null, 2));
  } catch (err) {
    console.error("❌ Failed to reach JEV API:", err);
  }
}

runDirector().catch(console.error);
