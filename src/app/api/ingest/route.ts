import { NextRequest, NextResponse } from "next/server";
import { IngestWebhookSchema } from "@/lib/schemas";
import { campaignQueue, redis } from "@/lib/redis";
import { ReplayableTelemetryMatrix } from "@/lib/telemetryStream";
import { logger } from "@/lib/logger";

const telemetryMatrix = new ReplayableTelemetryMatrix(redis);

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const parsed = IngestWebhookSchema.safeParse(JSON.parse(rawBody));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid webhook payload", issues: parsed.error.issues }, { status: 422 });
    }

    const event = parsed.data;
    const threadId = event.threadId || ("thread_" + Date.now());

    await telemetryMatrix.appendEvent(threadId, {
      sector: "Perimeter",
      event: "WebhookIngested",
      payload: { eventId: event.eventId, clientId: event.clientId, taskType: event.taskType }
    });

    await campaignQueue.add(
      "execute-graph",
      {
        mode: "start",
        threadId,
        payload: {
          eventId: event.eventId,
          campaignId: event.campaignId,
          clientId: event.clientId,
          taskType: event.taskType,
          instructions: event.instructions
        }
      },
      {
        jobId: "ingest_" + threadId + "_" + Date.now(),
        attempts: 3
      }
    );

    return NextResponse.json({ ok: true, status: "accepted", threadId }, { status: 202 });
  } catch (err: any) {
    logger.error({ sector: "Ingest API", err }, "Webhook ingestion gateway failed");
    return NextResponse.json({ error: "Internal Gateway Error" }, { status: 500 });
  }
}