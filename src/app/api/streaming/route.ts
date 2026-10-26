import { NextRequest } from "next/server";
import { ReplayableTelemetryMatrix } from "@/lib/telemetryStream";
import { redis } from "@/lib/redis";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const campaignId = url.searchParams.get("campaignId");
  const lastEventId = url.searchParams.get("lastEventId") || "0-0";

  if (!campaignId) {
    return new Response("Missing campaignId parameter", { status: 400 });
  }

  const encoder = new TextEncoder();
  const telemetryMatrix = new ReplayableTelemetryMatrix(redis);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let cursor = lastEventId;
        const historical = await telemetryMatrix.readStreamSince(campaignId, cursor, 100);
        for (const item of historical) {
          cursor = item.id;
          const data = "id: " + item.id + "\ndata: " + JSON.stringify(item.event) + "\n\n";
          controller.enqueue(encoder.encode(data));
        }

        const interval = setInterval(async () => {
          try {
            const nextEvents = await telemetryMatrix.readStreamSince(campaignId, cursor, 50);
            for (const item of nextEvents) {
              cursor = item.id;
              const data = "id: " + item.id + "\ndata: " + JSON.stringify(item.event) + "\n\n";
              controller.enqueue(encoder.encode(data));
            }
          } catch (pollErr) {
            logger.error({ sector: "Streaming Gateway", pollErr }, "Error polling telemetry stream");
          }
        }, 2000);

        req.signal.addEventListener("abort", () => {
          clearInterval(interval);
          controller.close();
        });
      } catch (err: any) {
        logger.error({ sector: "Streaming Gateway", err }, "SSE stream failed");
        controller.error(err);
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}