import { ingestDocument, queryVectorStore } from "@/lib/vectorStore";
import { logger } from "@/lib/logger";

async function runVectorPipelineTest() {
  console.log("🚀 Starting Supabase Vector Store & Gemini Embedding Pipeline Test...\n");

  try {
    // 1. Define a sample brand guideline or knowledge snippet
    const testContent = "Touch Base Consulting delivers AI-assisted website development, local search engine optimization, and automated agency workflows for businesses across the Overberg region.";
    const testMetadata = { category: "brand_guidelines", author: "system_test" };

    console.log("📥 Ingesting test document into Supabase pgvector...");
    const docId = await ingestDocument(testContent, testMetadata);
    console.log(`✅ Document successfully ingested! Assigned ID: ${docId}\n`);

    // 2. Perform a semantic similarity query
    const searchQuery = "What automated web and SEO services are offered in the Overberg?";
    console.log(`🔍 Querying vector store with semantic search: "${searchQuery}"...`);
    
    const results = await queryVectorStore(searchQuery, 0.6, 3);
    
    console.log(`\n📊 Query Results (${results.length} matches found):`);
    results.forEach((match, index) => {
      console.log(`  [Match ${index + 1}] Similarity: ${(match.similarity * 100).toFixed(2)}%`);
      console.log(`  Content: "${match.content}"`);
      console.log(`  Metadata:`, match.metadata);
      console.log("  --------------------------------------------------");
    });

    console.log("\n🎉 Vector store ingestion and retrieval pipeline test passed successfully!");
  } catch (err: any) {
    logger.error({ err }, "Vector pipeline test encountered an error");
    console.error("❌ Vector Pipeline Test Failed:", err.message);
    process.exit(1);
  }
}

runVectorPipelineTest();