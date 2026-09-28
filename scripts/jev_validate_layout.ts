import { TypeSafeClient, choice, score } from "@typesafe-ai/sdk";

const apiKey = "REVOKED_KEY_REMOVED";
const client = new TypeSafeClient({ apiKey });

async function runJev() {
  console.log("🚀 Executing TypeSafe JEV System One...");
  
  const result = await client.systemOne({
    state: { 
      context: "User tapped a Mechanism Card ID (e.g. M-03) in the RTGAME match. The layout must handle both Desktop and Mobile gracefully. Also, the MATCH FINISHED podium is overflowing vertically.",
      desktop_constraint: "Place the large yellow card above hand cards, do NOT overlap the Clinical Case and LOCK button.",
      mobile_constraint: "Open as a bottom sheet (max 70% height) to allow the player to see the game board behind."
    },
    questions: {
      desktopLayout: choice("Which layout pattern is best for Desktop given the constraints?", {
        "floating-left": "Absolute positioned floating card anchored to the left, leaving center Case card visible.",
        "fullscreen-modal": "Full screen overlay that blocks everything until dismissed."
      }),
      scrollFix: choice("The MATCH FINISHED podium is overflowing vertically and cannot be scrolled. How to fix?", {
        "overflow-y-auto": "Add overflow-y-auto and max-h-[95vh] to the modal wrapper",
        "hide-players": "Hide players with low scores to save space"
      }),
      confidenceScore: choice("Is the layout safe?", {
        "yes": "Yes, it is safe",
        "no": "No, it overlaps elements"
      })
    }
  });

  console.log("✅ JEV API Decision Received!");
  console.log(JSON.stringify(result.answers, null, 2));
}

runJev().catch(console.error);
