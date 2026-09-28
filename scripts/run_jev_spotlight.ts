import { jev } from "../apps/web/src/lib/jev-engine";

async function run() {
  console.log("Asking JEV Engine for layout decisions...");
  
  const profileDecision = await jev.decideUiLayout("profile", 1440);
  console.log("--- PROFILE DECISION ---");
  console.log(JSON.stringify(profileDecision, null, 2));
  
  const classSpotlightDecision = await jev.decideUiLayout("class spotlight", 1440);
  console.log("--- CLASS SPOTLIGHT DECISION ---");
  console.log(JSON.stringify(classSpotlightDecision, null, 2));
}

run().catch(console.error);
