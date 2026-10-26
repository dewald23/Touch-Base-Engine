import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
);

/**
 * Generates a 768-dimensional embedding using Gemini's text-embedding-004 model.
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Ingests a document, brand guideline, or knowledge snippet into the Supabase vector store.
 */
export async function ingestDocument(content: string, metadata: Record<string, any> = {}) {
  try {
    const embedding = await generateEmbedding(content);

    const { data, error } = await supabase
      .from("agency_knowledge")
      .insert({
        content,
        metadata,
        embedding,
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`Failed to insert document into vector store: ${error.message}`);
    }

    logger.info({ id: data.id }, "Successfully ingested document into vector store");
    return data.id;
  } catch (err: any) {
    logger.error({ err }, "Vector ingestion failed");
    throw err;
  }
}

/**
 * Queries the vector store using semantic cosine similarity via the match_agency_knowledge RPC.
 */
export async function queryVectorStore(
  queryText: string,
  matchThreshold: number = 0.75,
  matchCount: number = 5
) {
  try {
    const queryEmbedding = await generateEmbedding(queryText);

    const { data, error } = await supabase.rpc("match_agency_knowledge", {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (error) {
      throw new Error(`Vector search RPC failed: ${error.message}`);
    }

    return data as Array<{
      id: string;
      content: string;
      metadata: Record<string, any>;
      similarity: number;
    }>;
  } catch (err: any) {
    logger.error({ err }, "Vector store query failed");
    throw err;
  }
}