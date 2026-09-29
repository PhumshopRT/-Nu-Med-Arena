import { jev } from "../apps/web/src/lib/jev-engine";

async function main() {
  const result = await jev.decideUiLayout("match speed bonus streak suspense audio", 1440);
  console.log("JEV_DECISION_RESULT=" + JSON.stringify(result));
}

main().catch(console.error);
