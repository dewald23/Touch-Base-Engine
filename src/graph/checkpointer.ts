import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import pg from "pg";
import { logger } from "@/lib/logger";

const { Pool } = pg;

const connectionString = process.env.SUPABASE_DB_POOLER_URL || process.env.SUPABASE_DIRECT_POSTGRES_URL || "postgres://postgres:postgres@localhost:5432/postgres";

export const pgPool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000
});

export const checkpointer = new PostgresSaver(pgPool as any);

export async function initializeCheckpointer(): Promise<void> {
  try {
    await checkpointer.setup();
    logger.info({ sector: "Checkpointer" }, "PostgresSaver checkpoint tables verified");
  } catch (err: any) {
    logger.error({ sector: "Checkpointer", err: err.message }, "Failed to initialize PostgresSaver");
    throw err;
  }
}