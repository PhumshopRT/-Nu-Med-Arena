import { jev } from "../apps/web/src/lib/jev-engine"

async function run() {
  const layout = await jev.decideUiLayout("kahoot waiting room 55 players", 1920)
  console.log("JEV Layout Decision:", layout)
}

run()
