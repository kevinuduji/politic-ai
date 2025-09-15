/**
 * Simple Cerebras API test
 */

require("dotenv").config();
const {
  DialogueGenerator,
} = require("./components/dialogue-generator/DialogueGenerator");

async function testCerebras() {
  const apiKey = process.env.CEREBRAS_API_KEY;

  if (!apiKey || apiKey === "your_cerebras_api_key_here") {
    console.log("❌ API KEY MISSING");
    return;
  }

  try {
    const generator = new DialogueGenerator();
    const response = await generator.callLLM("Test message", {
      topic: "Test",
      stance: "support",
      speakerName: "Test",
      subroundType: "opening",
    });

    if (response && response.length > 0) {
      console.log("✅ PASS");
    } else {
      console.log("❌ FAIL");
    }
  } catch (error) {
    console.log("❌ FAIL");
  }
}

// Run the test
testCerebras().catch(console.error);
