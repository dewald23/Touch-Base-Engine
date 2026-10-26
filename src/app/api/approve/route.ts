import { NextRequest, NextResponse } from "next/server";
import { HitlApprovalSchema } from "@/lib/schemas";
import { assertHitlResumeAuthorized } from "@/lib/telemetryStream";
import { campaignQueue } from "@/lib/redis";
import { agencyGraph } from "@/graph/index";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.HITL_OPERATOR_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const body = await req.json();
    const parsed = HitlApprovalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid schema", issues: parsed.error.issues }, { status: 422 });
    }

    const { threadId, approverId, expectedStateHash, action, operatorSignature } = parsed.data;

    if (action === "reject") {
      logger.warn({ sector: "HITL Gate", threadId, approverId }, "Campaign rejected by operator");
      return NextResponse.json({ ok: true, status: "rejected" }, { status: 200 });
    }

    const currentState = await agencyGraph.getState({ configurable: { thread_id: threadId } });
    if (!currentState || !currentState.values) {
      return NextResponse.json({ error: "Graph checkpoint not found for thread ID" }, { status: 404 });
    }

    const checkpointStateHash = (currentState.values as any).stateHash;

    try {
      assertHitlResumeAuthorized({
        checkpointStateHash,
        approvedStateHash: expectedStateHash,
        operatorSignature,
        approverEmail: approverId,
        secret
      });
    } catch (secErr: any) {
      logger.error({ sector: "HITL Gate", threadId, err: secErr.message }, "Security violation during HITL resume");
      return NextResponse.json({ error: secErr.message }, { status: 403 });
    }

    await campaignQueue.add(
      "execute-graph",
      {
        mode: "resume",
        threadId,
        payload: { approverId, action }
      },
      {
        jobId: "resume_" + threadId + "_" + Date.now(),
        attempts: 3
      }
    );

    logger.info({ sector: "HITL Gate", threadId, approverId }, "HITL approval verified. Graph resume enqueued.");

    return NextResponse.json({ ok: true, status: "resuming", threadId }, { status: 202 });
  } catch (err: any) {
    logger.error({ sector: "HITL Gate", err }, "Approval gateway failed");
    return NextResponse.json({ error: "Internal Gateway Error" }, { status: 500 });
  }
}