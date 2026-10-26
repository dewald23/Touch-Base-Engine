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

export async function growthHackerNode(state: typeof TouchBaseGraphState.State) {
  logger.info({ sector: "GrowthHacker", threadId: state.threadId }, "Executing Growth Hacker & SEO Audit Node");
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = [
      "You are an expert growth hacker, local SEO specialist, and conversion rate optimization strategist.",
      "Task Type: " + state.taskType,
      "Client Instructions: " + state.instructions,
      "Previous Brand Strategy & Copy Context:",
      state.brandCopy || "No preliminary copy provided.",
      "",
      "Perform a rigorous SEO and growth audit. Provide:",
      "1. Optimized meta title and meta description tags.",
      "2. Primary and secondary local keyword targets.",
      "3. Conversion Rate Optimization (CRO) recommendations for deployment.",
      "4. Distribution channels (e.g., local search, social, automated email touchpoints)."
    ].join("\n");

    const result = await model.generateContent(prompt);
    const growthReport = result.response.text();
    
    const sha256 = crypto.createHash("sha256").update(growthReport, "utf8").digest("hex");
    const storagePath = "campaigns/" + state.threadId + "/growth-report-" + Date.now() + ".md";

    const { error: uploadError } = await supabase.storage
      .from("campaigns")
      .upload(storagePath, growthReport, { contentType: "text/markdown", upsert: true });

    if (uploadError) {
      throw new Error("Failed to upload growth report artifact: " + uploadError.message);
    }

    const artifactRef = { 
      key: "growthReport", 
      uri: "supabase://campaigns/" + storagePath, 
      sha256, 
      sizeBytes: Buffer.byteLength(growthReport, "utf8"), 
      updatedAt: Date.now() 
    };

    return {
      growthReport,
      currentSector: "HumanInTheLoopApproval", // Routes to supervisor checkpoint
      artifactRefs: {
        ...state.artifactRefs,
        growthReport: artifactRef,
      },
      auditTrail: [
        ...(state.auditTrail || []),
        { sector: "GrowthHacker", action: "Generated SEO & growth report artifact", timestamp: Date.now() }
      ]
    };
  } catch (err: any) {
    logger.error({ sector: "GrowthHacker", err }, "GrowthHacker execution failed");
    return { error: err.message, currentSector: "Failed" };
  }
}