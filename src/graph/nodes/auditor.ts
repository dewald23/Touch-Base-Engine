import { TouchBaseGraphState } from "@/graph/state";
import crypto from "node:crypto";
import { logger } from "@/lib/logger";

export async function auditorNode(state: typeof TouchBaseGraphState.State) {
  logger.info({ sector: "Auditor", threadId: state.threadId }, "Executing Auditor Hero Node");
  try {
    const canonicalState = JSON.stringify({
      threadId: state.threadId,
      clientId: state.clientId,
      taskType: state.taskType,
      brandCopy: state.brandCopy,
      seoMap: state.seoMap,
      architecturePlan: state.architecturePlan,
      artifactRefs: state.artifactRefs
    });

    const stateHash = crypto.createHash("sha256").update(canonicalState, "utf8").digest("hex");
    logger.info({ sector: "Auditor", threadId: state.threadId, stateHash }, "State hash successfully computed");

    return {
      stateHash,
      requiresHitlApproval: true,
      currentSector: "HitlGate",
      auditTrail: [{ sector: "Auditor", action: "Computed cryptographic state hash: " + stateHash.substring(0, 12) + "...", timestamp: Date.now() }]
    };
  } catch (err: any) {
    logger.error({ sector: "Auditor", err }, "Auditor execution failed");
    return { error: err.message, currentSector: "Failed" };
  }
}