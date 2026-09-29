import { jev } from "../apps/web/src/lib/jev-engine";

async function main() {
  const result = await jev.decideUiLayout("board projector crash fix", 1440);
  console.log("JEV_DECISION_RESULT=" + JSON.stringify(result));
}

main().catch(console.error);
