const {
  simulateScript,
  decodeResult,
} = require("@chainlink/functions-toolkit");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

async function main() {
  // 1. check if the API Key is set
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Error: OPENAI_API_KEY is missing in contracts/.env");
    console.log("Please create contracts/.env and add: OPENAI_API_KEY=sk-...");
    return;
  }

  // 2. read the AI script
  const source = fs
    .readFileSync(path.resolve(__dirname, "functions-source.js"))
    .toString();

  // 3. prepare test data (simulate user input)
  const args = [
    "Check if the submission discusses 'DeFi' or 'Finance'. If yes, score 90-100. If no, score 0.", // args[0]: Prompt
    "This article explains how Decentralized Finance (DeFi) is revolutionizing banking.", // args[1]: Submission
  ];

  console.log("\n🤖 Simulating AI Judge execution...");
  console.log("------------------------------------------------");
  console.log(`Prompt: "${args[0]}"`);
  console.log(`Submission: "${args[1]}"`);
  console.log("------------------------------------------------");

  // 4. run simulation
  const response = await simulateScript({
    source: source,
    args: args,
    bytesArgs: [], // no bytes args
    secrets: { openaiKey: process.env.OPENAI_API_KEY }, // 注入本地的 API Key
  });

  // 5. handle the result
  if (response.error) {
    console.error("❌ Simulation Failed:", response.error);
  } else {
    // Chainlink returns a hex string (bytes), we need to decode it based on the return type
    // In functions-source.js, we used Functions.encodeUint256(score)
    // Here we can simply parse response.responseBytesHexstring

    // If the decodeResult tool is used (ReturnType.uint256 = 1)
    const resultString = response.capturedTerminalOutput;
    console.log("✅ Execution Successful!");

    // We mainly look at capturedTerminalOutput, because we console.log the result in the script
    if (resultString) {
      console.log("\n📜 Script Logs:");
      console.log(resultString);
    }

    console.log(
      "\n📦 Hex Output (for Contract):",
      response.responseBytesHexstring
    );
  }
}

main().catch((err) => {
  console.error(err);
});
