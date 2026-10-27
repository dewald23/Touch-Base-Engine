import "dotenv/config";
import crypto from "node:crypto";
import { campaignQueue, redis } from "@/lib/redis";
import { startWorker } from "@/queue/worker";
import { agencyGraph } from "@/graph/index";
import { ReplayableTelemetryMatrix, assertHitlResumeAuthorized } from "@/lib/telemetryStream";

async function testNexusE2E() {
  console.log("=================================================");
  console.log("   🚀 TBC NEXUS FULL END-TO-END WORKFLOW TEST    ");
  console.log("=================================================\n");

  const telemetryMatrix = new ReplayableTelemetryMatrix(redis);
  const secret = process.env.HITL_OPERATOR_SECRET || "nexus_test_operator_secret";
  process.env.HITL_OPERATOR_SECRET = secret;

  const testCampaignId = "campaign_" + Date.now();
  const testThreadId = "thread_" + Date.now();
  const approverEmail = "operator@touchbase.co.za";

  console.log(`[1] Starting BullMQ Worker & Initializing Checkpointer...`);
  const worker = await startWorker();
  console.log(`  ✅ Worker active and listening on queue 'campaign-execution'\n`);

  console.log(`[2] Simulating Webhook Ingest for Client 'Hermanus Vineyards'...`);
  await telemetryMatrix.appendEvent(testCampaignId, {
    sector: "Perimeter",
    event: "WebhookIngested",
    payload: { clientId: "hermanus-vineyards-01", taskType: "full_audit" }
  });

  const job = await campaignQueue.add(
    "execute-graph",
    {
      mode: "start",
      threadId: testThreadId,
      payload: {
        campaignId: testCampaignId,
        clientId: "hermanus-vineyards-01",
        eventId: "evt_" + Date.now(),
        taskType: "full_audit",
        instructions: "Create high-converting landing page copy and local SEO plan for Hermanus cool-climate wine tastings."
      }
    },
    { jobId: "job_" + testThreadId }
  );
  console.log(`  ✅ Job enqueued to BullMQ (Job ID: ${job.id})\n`);

  console.log(`[3] Monitoring execution until Human-In-The-Loop gate...`);
  const startTime = Date.now();
  let pausedState: any = null;

  while (Date.now() - startTime < 60000) {
    const config: any = { configurable: { thread_id: testThreadId } };
    const state = await agencyGraph.getState(config);

    if (state && state.values && state.values.requiresHitlApproval) {
      pausedState = state.values;
      console.log(`\n  🛑 Graph safely reached HITL gate!`);
      console.log(`     - Current Sector: ${pausedState.currentSector}`);
      console.log(`     - State Hash: ${pausedState.stateHash}`);
      console.log(`     - Generated Artifacts: ${Object.keys(pausedState.artifactRefs || {}).join(", ")}`);
      console.log(`     - Audit Trail entries: ${pausedState.auditTrail.length}`);
      break;
    }

    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 2000));
  }

  if (!pausedState) {
    throw new Error("Timeout waiting for graph to reach HITL gate");
  }

  console.log(`\n[4] Authorizing HITL Approval with Cryptographic Signature...`);
  const checkpointStateHash = pausedState.stateHash;
  const operatorSignature = crypto
    .createHmac("sha256", secret)
    .update(checkpointStateHash + ":" + approverEmail, "utf8")
    .digest("hex");

  assertHitlResumeAuthorized({
    checkpointStateHash,
    approvedStateHash: checkpointStateHash,
    operatorSignature,
    approverEmail,
    secret
  });
  console.log(`  ✅ Cryptographic operator signature verified: ${operatorSignature.slice(0, 16)}...`);

  console.log(`\n[5] Enqueuing Resume Action to BullMQ...`);
  await campaignQueue.add(
    "execute-graph",
    {
      mode: "resume",
      threadId: testThreadId,
      payload: { approverId: approverEmail, action: "approve" }
    },
    { jobId: "resume_" + testThreadId }
  );

  console.log(`[6] Waiting for finalization past HitlGate...`);
  const resumeStartTime = Date.now();
  let finalizedState: any = null;

  while (Date.now() - resumeStartTime < 30000) {
    const config: any = { configurable: { thread_id: testThreadId } };
    const state = await agencyGraph.getState(config);

    if (state && state.values && state.values.currentSector === "Completed") {
      finalizedState = state.values;
      console.log(`\n  🎉 Graph successfully resumed and finalized!`);
      console.log(`     - Status: ${finalizedState.currentSector}`);
      console.log(`     - requiresHitlApproval: ${finalizedState.requiresHitlApproval}`);
      break;
    }

    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 1500));
  }

  if (!finalizedState) {
    throw new Error("Timeout waiting for graph finalization");
  }

  console.log(`\n[7] Replaying Telemetry Event Stream from Redis...`);
  const historicalEvents = await telemetryMatrix.readStreamSince(testThreadId, "0-0", 20);
  console.log(`  ✅ Telemetry Stream records (${historicalEvents.length} events):`);
  historicalEvents.forEach((ev) => {
    console.log(`     [${new Date(ev.event.timestamp).toLocaleTimeString()}] Sector: ${ev.event.sector} -> Event: ${ev.event.event}`);
  });

  console.log("\n=================================================");
  console.log("  🏆 FULL NEXUS END-TO-END PIPELINE: 100% PASS   ");
  console.log("=================================================\n");

  await worker.close();
  await redis.quit();
  process.exit(0);
}

testNexusE2E().catch(async (e) => {
  console.error("\n❌ End-to-end test encountered an error:", e);
  await redis.quit();
  process.exit(1);
});
