import { jev } from "../apps/web/src/lib/jev-engine";

async function main() {
  const profileDecision = await jev.decideUiLayout("profile", 1440);
  console.log("JEV_PROFILE_DECISION=" + JSON.stringify(profileDecision));

  const spotlightDecision = await jev.decideUiLayout("class spotlight", 1440);
  console.log("JEV_SPOTLIGHT_DECISION=" + JSON.stringify(spotlightDecision));

  const kahootDecision = await jev.decideUiLayout("kahoot waiting room 55 players", 1440);
  console.log("JEV_KAHOOT_DECISION=" + JSON.stringify(kahootDecision));

  const generalDecision = await jev.decideUiLayout("general casino 6 seats room", 1440);
  console.log("JEV_GENERAL_DECISION=" + JSON.stringify(generalDecision));
}

main().catch(console.error);
