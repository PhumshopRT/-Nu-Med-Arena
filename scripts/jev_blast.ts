import { TypeSafeClient, choice } from "@typesafe-ai/sdk";

const apiKey = "REVOKED_KEY_REMOVED";
const client = new TypeSafeClient({ apiKey });

async function spamJev() {
  console.log("🚀 Blasting JEV API to force usage spike...");
  const promises = [];
  
  for (let i = 0; i < 20; i++) {
    promises.push(
      client.systemOne({
        state: { testRun: i, message: "Forcing dashboard update" },
        questions: {
          ping: choice("Is this a test?", { yes: "Yes", no: "No" })
        }
      }).then(() => console.log(`✅ Request ${i + 1} completed`))
      .catch(err => console.error(`❌ Request ${i + 1} failed:`, err.message))
    );
  }

  await Promise.all(promises);
  console.log("🎉 All 20 requests sent to TypeSafe API!");
}

spamJev();
