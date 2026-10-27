import { GoogleGenerativeAI } from "@google/generative-ai";
import { TouchBaseGraphState } from "@/graph/state";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { logger } from "@/lib/logger";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder");

export async function growthHackerNode(state: typeof TouchBaseGraphState.State) {
  logger.info({ sector: "GrowthHacker", threadId: state.threadId }, "Executing Growth Hacker Hero Node");
  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite" });
    const prompt = [
      "You are an expert growth hacker and local SEO strategist.",
      "Task Type: " + state.taskType,
      "Instructions: " + state.instructions,
      "Brand Copy Context: " + (state.brandCopy || "").substring(0, 500) + "...",
      "",
      "Generate a structured JSON response containing:",
      "1. primaryKeyword (string)",
      "2. secondaryKeywords (array of strings)",
      "3. metaTitle (string, max 60 chars)",
      "4. metaDescription (string, max 160 chars)",
      "5. localPackStrategy (string)",
      "",
      "Return ONLY valid JSON without markdown formatting."
    ].join("\n");

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();
    const jsonClean = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    const seoMap = JSON.parse(jsonClean);

    const jsonString = JSON.stringify(seoMap, null, 2);
    const sha256 = crypto.createHash("sha256").update(jsonString, "utf8").digest("hex");
    const storagePath = "campaigns/" + state.threadId + "/seo-map-" + Date.now() + ".json";

    const { error: uploadError } = await supabase.storage.from("campaigns").upload(storagePath, jsonString, { contentType: "application/json", upsert: true });
    if (uploadError) throw new Error("Failed to upload SEO map artifact: " + uploadError.message);

    const artifactRef = { key: "seoMap", uri: "supabase://campaigns/" + storagePath, sha256, sizeBytes: Buffer.byteLength(jsonString, "utf8"), updatedAt: Date.now() };

    return { seoMap, currentSector: "Architect", artifactRefs: { seoMap: artifactRef }, auditTrail: [{ sector: "GrowthHacker", action: "Synthesized localized SEO JSON map", timestamp: Date.now() }] };
  } catch (err: any) {
    logger.error({ sector: "GrowthHacker", err }, "GrowthHacker execution failed");
    return { error: err.message, currentSector: "Failed" };
  }
}