import { GoogleGenerativeAI } from "@google/generative-ai";
import { TouchBaseGraphState } from "@/graph/state";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { logger } from "@/lib/logger";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder");

export async function architectNode(state: typeof TouchBaseGraphState.State) {
  logger.info({ sector: "Architect", threadId: state.threadId }, "Executing Architect Hero Node");
  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite" });
    const prompt = [
      "You are a principal staff software architect and front-end specialist.",
      "Task Type: " + state.taskType,
      "Instructions: " + state.instructions,
      "SEO Map Primary Keyword: " + (state.seoMap?.primaryKeyword || "N/A"),
      "",
      "Design a complete React/Tailwind component layout plan for this campaign landing page. Provide a structured JSON response containing:",
      "1. componentName (string)",
      "2. sections (array of strings)",
      "3. tailwindThemeConfig (object with primary and accent colors)",
      "4. estimatedFilesCount (number)",
      "",
      "Return ONLY valid JSON without markdown formatting."
    ].join("\n");

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();
    const jsonClean = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    const architecturePlan = JSON.parse(jsonClean);

    const jsonString = JSON.stringify(architecturePlan, null, 2);
    const sha256 = crypto.createHash("sha256").update(jsonString, "utf8").digest("hex");
    const storagePath = "campaigns/" + state.threadId + "/architecture-plan-" + Date.now() + ".json";

    const { error: uploadError } = await supabase.storage.from("campaigns").upload(storagePath, jsonString, { contentType: "application/json", upsert: true });
    if (uploadError) throw new Error("Failed to upload architecture plan artifact: " + uploadError.message);

    const artifactRef = { key: "architecturePlan", uri: "supabase://campaigns/" + storagePath, sha256, sizeBytes: Buffer.byteLength(jsonString, "utf8"), updatedAt: Date.now() };

    return { architecturePlan, currentSector: "Auditor", artifactRefs: { architecturePlan: artifactRef }, auditTrail: [{ sector: "Architect", action: "Synthesized component architecture plan", timestamp: Date.now() }] };
  } catch (err: any) {
    logger.error({ sector: "Architect", err }, "Architect execution failed");
    return { error: err.message, currentSector: "Failed" };
  }
}