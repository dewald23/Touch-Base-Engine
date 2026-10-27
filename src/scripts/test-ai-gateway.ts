import "dotenv/config";
import { generateText } from "ai";

async function main() {
  console.log("Testing Vercel AI Gateway with key:", process.env.AI_GATEWAY_API_KEY ? "EXISTS (starts with " + process.env.AI_GATEWAY_API_KEY.substring(0, 7) + "...)" : "MISSING");
  
  try {
    const { text } = await generateText({
      model: "moonshotai/kimi-k3" as any,
      prompt: "Invent a new holiday and describe its traditions.",
    });

    console.log("\n--- AI Gateway Response ---");
    console.log(text);
    console.log("---------------------------\n");
  } catch (error: any) {
    console.error("AI Gateway invocation error:", error);
  }
}

main();
