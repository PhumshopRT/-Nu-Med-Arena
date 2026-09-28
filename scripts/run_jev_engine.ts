import { jev } from "../apps/web/src/lib/jev-engine";

async function run() {
  console.log("Asking JEV Engine for layout decision...");
  const decision = await jev.decideUiLayout("admin dashboard", 1440);
  console.log(JSON.stringify(decision, null, 2));
}

run().catch(console.error);
