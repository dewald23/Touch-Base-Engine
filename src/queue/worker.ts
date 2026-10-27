import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redis } from "@/lib/redis";
import { agencyGraph } from "@/graph/index";
import { initializeCheckpointer } from "@/graph/checkpointer";
import { ReplayableTelemetryMatrix } from "@/lib/telemetryStream";
import { CampaignJobPayload } from "@/queue/jobs";
import { logger } from "@/lib/logger";

const telemetryMatrix = new ReplayableTelemetryMatrix(redis);
let workerInstance: Worker<CampaignJobPayload> | undefined;

export async function startWorker() {
  if (workerInstance) {
    return workerInstance;
  }

  await initializeCheckpointer();

  workerInstance = new Worker<CampaignJobPayload>(
    "campaign-execution",
    async (job: Job<CampaignJobPayload>) => {
      const data = job.data ?? {};
      const mode = data.mode ?? "start";
      const threadId = data.threadId ?? `thread_${job.id ?? Date.now()}`;
      const payload = data.payload ?? {};

      logger.info({ sector: "Worker", threadId, mode }, "Processing campaign execution job");

      const config = { configurable: { thread_id: threadId } };

      if (mode === "start") {
        // Initialize graph run with inbound webhook payload
        await agencyGraph.invoke(
          {
            threadId,
            clientId: payload.clientId || "default-client",
            eventId: payload.eventId || "default-event",
            taskType: payload.taskType || "full_audit",
            instructions: payload.instructions || "Execute standard audit and synthesis."
          },
          config
        );
      } else if (mode === "resume") {
        // Resume graph execution past the HITL interrupt gate
        await agencyGraph.invoke(null, config);
      } else {
        throw new Error(`Unsupported queue mode: ${String(mode)}`);
      }

      // Check current state after execution step
      const state = await agencyGraph.getState(config);
      await telemetryMatrix.appendEvent(threadId, {
        sector: state.values.currentSector || "Supervisor",
        event: "SectorCompleted",
        payload: { nextSector: state.next, requiresHitl: state.values.requiresHitlApproval }
      });

      logger.info({ sector: "Worker", threadId, next: state.next }, "Job execution step completed successfully");
    },
    {
      connection: redis,
      concurrency: 5
    }
  );

  workerInstance.on("completed", (job) => {
    logger.info({ sector: "Worker", jobId: job.id }, "Job completed successfully");
  });

  workerInstance.on("failed", (job, err) => {
    logger.error({ sector: "Worker", jobId: job?.id, err: err.message }, "Job execution failed");
  });

  logger.info({ sector: "Worker" }, "BullMQ worker runner started and listening for jobs.");
  return workerInstance;
}

if (process.env.NODE_ENV !== "test") {
  startWorker().catch((err) => {
    logger.error({ sector: "Worker", err }, "Fatal error starting BullMQ worker");
    process.exit(1);
  });
}


