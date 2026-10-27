import { GoogleGenerativeAI } from "@google/generative-ai";
import { TouchBaseGraphState } from "@/graph/state";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { logger } from "@/lib/logger";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co", 
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
);

export async function brandStrategistNode(state: typeof TouchBaseGraphState.State) {
  logger.info({ sector: "BrandStrategist", threadId: state.threadId }, "Executing Brand Strategist Hero Node");
  
  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite" });
    
    const prompt = [
      "You are an elite brand strategist, creative director, and master copywriter.",
      "Task Type: " + state.taskType,
      "Client ID: " + state.clientId,
      "Client Instructions: " + state.instructions,
      "",
      "Develop a high-impact brand strategy and marketing copy suite. Provide:",
      "1. Core Brand Positioning & Unique Value Proposition (UVP).",
      "2. Brand Voice, Tone, and Messaging Pillars.",
      "3. Compelling Hero Headline, Sub-headline, and Primary Call-to-Action (CTA).",
      "4. Core Value Propositions & Service Features.",
      "5. Elevator Pitch for local market resonance."
    ].join("\n");

    const result = await model.generateContent(prompt);
    const brandCopy = result.response.text();
    
    const sha256 = crypto.createHash("sha256").update(brandCopy, "utf8").digest("hex");
    const storagePath = "campaigns/" + state.threadId + "/brand-copy-" + Date.now() + ".md";

    const { error: uploadError } = await supabase.storage
      .from("campaigns")
      .upload(storagePath, brandCopy, { contentType: "text/markdown", upsert: true });

    if (uploadError) {
      throw new Error("Failed to upload brand copy artifact: " + uploadError.message);
    }

    const artifactRef = { 
      key: "brandCopy", 
      uri: "supabase://campaigns/" + storagePath, 
      sha256, 
      sizeBytes: Buffer.byteLength(brandCopy, "utf8"), 
      updatedAt: Date.now() 
    };

    return {
      brandCopy,
      currentSector: "GrowthHacker",
      artifactRefs: {
        brandCopy: artifactRef,
      },
      auditTrail: [
        { sector: "BrandStrategist", action: "Synthesized brand strategy and conversion copy", timestamp: Date.now() }
      ]
    };
  } catch (err: any) {
    logger.error({ sector: "BrandStrategist", err }, "BrandStrategist execution failed");
    return { error: err.message, currentSector: "Failed" };
  }
}