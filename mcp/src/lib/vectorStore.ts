import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"
);

/**
 * Generates a 1536-dimensional embedding using Gemini's gemini-embedding-001 model.
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent({
    content: { role: "user", parts: [{ text }] },
    outputDimensionality: 1536,
  } as any);
  return result.embedding.values;
}

/**
 * Ingests a document, brand guideline, or knowledge snippet into the Supabase vector store.
 */
export async function ingestDocument(
  content: string,
  metadata: Record<string, any> = {},
  title?: string
) {
  try {
    const embedding = await generateEmbedding(content);
    const docTitle = title || metadata.title || content.slice(0, 80).trim();

    const { data, error } = await supabase
      .from("agency_knowledge_embeddings")
      .insert({
        title: docTitle,
        content,
        metadata,
        embedding,
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`Failed to insert document into vector store: ${error.message}`);
    }

    return data.id;
  } catch (err: any) {
    throw err;
  }
}

/**
 * Queries the vector store using semantic cosine similarity via the match_agency_knowledge RPC.
 */
export async function queryVectorStore(
  queryText: string,
  matchThreshold: number = 0.5,
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
      title: string;
      content: string;
      metadata: Record<string, any>;
      similarity: number;
    }>;
  } catch (err: any) {
    throw err;
  }
}
