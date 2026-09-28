import { TypeSafeClient, choice } from "@typesafe-ai/sdk";

const apiKey = "REVOKED_KEY_REMOVED";
const client = new TypeSafeClient({ apiKey });

async function refineDirective() {
  console.log("🚀 [JEV-DIRECTOR] Asking JEV to refine directive based on static architecture...");
  
  try {
    const result = await client.systemOne({
      state: {
        architecture: "Pure client-side static site (gh-pages). No server, no API routes, no Next.js server actions. Admin password is a hardcoded frontend check ('rtkmpht') because there is no backend.",
        previous_directive: "security-review"
      },
      questions: {
        refinedDirective: choice("Given that there is no backend to secure, what should the agent focus on?", {
          "admin-obfuscation": "Command the agent to check if the admin passwords are at least somewhat obfuscated in the frontend code.",
          "mobile-layout-audit": "Command the agent to switch focus to mobile responsiveness.",
          "performance-cleanup": "Command the agent to clean up the UI performance."
        })
      }
    });

    console.log("✅ [JEV-DIRECTOR] Refined Command Received!");
    console.log(JSON.stringify(result.answers, null, 2));
  } catch (err) {
    console.error("❌ Failed to reach JEV API:", err);
  }
}

refineDirective().catch(console.error);
