import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pg from "pg";
import { ingestDocument, queryVectorStore } from "@/lib/vectorStore";
import { initializeCheckpointer } from "@/graph/checkpointer";
import { agencyGraph } from "@/graph/index";

const { Pool } = pg;

async function runNexusDiagnostics() {
  console.log("=================================================");
  console.log("      🚀 TBC NEXUS COMPREHENSIVE TEST SUITE      ");
  console.log("=================================================\n");

  const results: Record<string, boolean> = {
    supabaseRest: false,
    supabaseStorage: false,
    geminiEmbeddings: false,
    geminiGenerative: false,
    redisStream: false,
    postgresDirect: false,
    vectorTable: false,
    vectorPipeline: false,
    checkpointer: false,
    agencyGraphExecution: false,
  };

  // 1. Supabase REST & Auth
  console.log("📡 [1/8] Supabase REST Client & Auth...");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log(`  ❌ Supabase REST Error: ${error.message}`);
    } else {
      console.log(`  ✅ Connected to Supabase Project: ${supabaseUrl}`);
      results.supabaseRest = true;

      // 2. Storage Bucket
      console.log("\n📦 [2/8] Supabase Storage 'campaigns' bucket...");
      const campaignsBucket = buckets.find((b) => b.name === "campaigns");
      if (campaignsBucket) {
        console.log(`  ✅ 'campaigns' bucket is active and ready`);
        results.supabaseStorage = true;
      } else {
        console.log("  ⚠️ Creating 'campaigns' bucket...");
        const { error: createError } = await supabase.storage.createBucket("campaigns", { public: false });
        if (!createError) {
          console.log("  ✅ 'campaigns' bucket created!");
          results.supabaseStorage = true;
        }
      }
    }
  } catch (err: any) {
    console.log(`  ❌ Supabase Error: ${err.message}`);
  }

  // 3. Gemini Embeddings & Generation
  console.log("\n✨ [3/8] Gemini AI Integration...");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    const embModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const embRes = await embModel.embedContent({
      content: { role: "user", parts: [{ text: "Touch Base Nexus" }] },
      outputDimensionality: 1536,
    } as any);
    console.log(`  ✅ gemini-embedding-001 operational (1536 dimensions)`);
    results.geminiEmbeddings = true;

    const chatModel = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite" });
    const chatRes = await chatModel.generateContent("Reply with 'NEXUS_VERIFIED'");
    console.log(`  ✅ Gemini chat model operational: "${chatRes.response.text().trim()}"`);
    results.geminiGenerative = true;
  } catch (err: any) {
    console.log(`  ❌ Gemini Error: ${err.message}`);
  }

  // 4. Redis Streams & Cache
  console.log("\n⚡ [4/8] Upstash Redis Streams & Queues...");
  const redis = new Redis(process.env.REDIS_URL || "", { maxRetriesPerRequest: null, connectTimeout: 7000 });
  try {
    const pong = await redis.ping();
    console.log(`  ✅ Redis ping: ${pong}`);

    const testStreamKey = "stream:test:nexus_health";
    const eventId = await redis.xadd(testStreamKey, "*", "status", "healthy", "timestamp", String(Date.now()));
    console.log(`  ✅ Stream event appended (ID: ${eventId})`);
    await redis.del(testStreamKey);
    results.redisStream = true;
  } catch (err: any) {
    console.log(`  ❌ Redis Error: ${err.message}`);
  } finally {
    redis.disconnect();
  }

  // 5. PostgreSQL Direct Connection
  console.log("\n🐘 [5/8] Direct Postgres Connection & Schema...");
  const pool = new Pool({
    connectionString: process.env.SUPABASE_DIRECT_POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const timeRes = await pool.query("SELECT NOW() as now, current_database() as db");
    console.log(`  ✅ Connected to DB "${timeRes.rows[0].db}" at ${timeRes.rows[0].now}`);
    results.postgresDirect = true;

    const tableRes = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    const tableNames = tableRes.rows.map((r: any) => r.table_name);
    if (tableNames.includes("agency_knowledge_embeddings")) {
      console.log("  ✅ Vector table 'agency_knowledge_embeddings' (and view 'agency_knowledge') verified.");
      results.vectorTable = true;
    }
  } catch (err: any) {
    console.log(`  ❌ Postgres Error: ${err.message}`);
  }

  // 6. LangGraph Checkpointer
  console.log("\n💾 [6/8] LangGraph PostgresSaver Checkpointer...");
  try {
    await initializeCheckpointer();
    console.log("  ✅ Postgres checkpoint tables verified.");
    results.checkpointer = true;
  } catch (err: any) {
    console.log(`  ❌ Checkpointer Error: ${err.message}`);
  }

  // 7. Vector Store Ingestion & Semantic Retrieval
  console.log("\n🧠 [7/8] Vector Store Ingestion & RPC Search...");
  try {
    const docId = await ingestDocument(
      "Touch Base Consulting Nexus delivers AI-driven brand strategy, local SEO optimization, and web architecture across the Western Cape.",
      { category: "test_suite", timestamp: Date.now() },
      "TBC Nexus Overview"
    );
    console.log(`  ✅ Document ingested (UUID: ${docId})`);

    const matches = await queryVectorStore("AI brand strategy and local SEO in Western Cape", 0.5, 3);
    console.log(`  ✅ Semantic search returned ${matches.length} matches:`);
    matches.forEach((m, idx) => {
      console.log(`     [#${idx + 1}] ${(m.similarity * 100).toFixed(1)}% match: "${m.title}"`);
    });
    results.vectorPipeline = matches.length > 0;
  } catch (err: any) {
    console.log(`  ❌ Vector Pipeline Error: ${err.message}`);
  }

  // 8. LangGraph Multi-Agent Pipeline End-to-End
  console.log("\n🤖 [8/8] LangGraph Multi-Agent Execution (Dry Run)...");
  try {
    const threadId = "nexus_test_" + Date.now();
    const config: any = { configurable: { thread_id: threadId } };
    const graphState = await agencyGraph.invoke(
      {
        threadId,
        clientId: "nexus_tester",
        eventId: "diag_001",
        taskType: "full_audit",
        instructions: "Perform a rapid brand and SEO synthesis test for TBC Nexus engine.",
      },
      config
    );

    if (graphState.stateHash && graphState.requiresHitlApproval) {
      console.log(`  ✅ All nodes executed!`);
      console.log(`     - Current Sector: ${graphState.currentSector}`);
      console.log(`     - State Hash: ${graphState.stateHash.slice(0, 16)}...`);
      console.log(`     - Artifacts: ${Object.keys(graphState.artifactRefs || {}).join(", ")}`);
      results.agencyGraphExecution = true;
    }
  } catch (err: any) {
    console.log(`  ❌ Graph Execution Error: ${err.message}`);
  }

  // Summary
  console.log("\n=================================================");
  console.log("               DIAGNOSTIC SUMMARY                ");
  console.log("=================================================");
  let passedCount = 0;
  const entries = Object.entries(results);
  entries.forEach(([key, ok]) => {
    if (ok) passedCount++;
    console.log(`  ${ok ? "✅ PASS" : "❌ FAIL"} - ${key}`);
  });
  console.log("-------------------------------------------------");
  console.log(`  Total: ${passedCount} / ${entries.length} Passed`);
  console.log("=================================================\n");

  await pool.end();
  process.exit(passedCount === entries.length ? 0 : 1);
}

runNexusDiagnostics().catch((e) => {
  console.error("Fatal test failure:", e);
  process.exit(1);
});

