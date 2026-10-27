import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "key"
);

const server = new Server(
  { name: "touch-base-supabase-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "supabase.vector_search",
      description: "Perform semantic vector similarity search via match_agency_knowledge",
      inputSchema: {
        type: "object",
        properties: {
          queryEmbedding: { type: "array", items: { type: "number" } },
          matchThreshold: { type: "number" },
          matchCount: { type: "number" }
        },
        required: ["queryEmbedding"]
      }
    },
    {
      name: "supabase.store_artifact",
      description: "Store campaign artifact content in Supabase Storage",
      inputSchema: {
        type: "object",
        properties: {
          bucket: { type: "string" },
          path: { type: "string" },
          content: { type: "string" },
          contentType: { type: "string" }
        },
        required: ["bucket", "path", "content"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name === "supabase.vector_search") {
    const { queryEmbedding, matchThreshold = 0.5, matchCount = 5 } = args as any;
    logger.info({ sector: "Supabase MCP", matchCount }, "Executing pgvector semantic search");
    const { data, error } = await supabase.rpc("match_agency_knowledge", {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount
    });
    if (error) throw new Error("Vector search failed: " + error.message);
    return { content: [{ type: "text", text: JSON.stringify({ success: true, results: data }) }] };
  }
  if (name === "supabase.store_artifact") {
    const { bucket, path: filePath, content, contentType = "text/plain" } = args as any;
    const { error } = await supabase.storage.from(bucket).upload(filePath, content, { contentType, upsert: true });
    if (error) throw new Error("Artifact storage failed: " + error.message);
    return { content: [{ type: "text", text: JSON.stringify({ success: true, uri: "supabase://" + bucket + "/" + filePath }) }] };
  }
  throw new Error("Unknown tool: " + name);
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((err) => {
  logger.error({ sector: "Supabase MCP", err }, "Supabase MCP server failed to start");
});

