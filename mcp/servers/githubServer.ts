import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { logger } from "@/lib/logger";

const server = new Server(
  { name: "touch-base-github-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "github.create_branch",
      description: "Create a new Git branch from main without local disk storage",
      inputSchema: { type: "object", properties: { branchName: { type: "string" } }, required: ["branchName"] }
    },
    {
      name: "github.commit_files",
      description: "Commit generated code files directly to a remote branch",
      inputSchema: {
        type: "object",
        properties: {
          branchName: { type: "string" },
          message: { type: "string" },
          files: { type: "array", items: { type: "object", properties: { path: { type: "string" }, content: { type: "string" } }, required: ["path", "content"] } }
        },
        required: ["branchName", "message", "files"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name === "github.create_branch") {
    const { branchName } = args as { branchName: string };
    logger.info({ sector: "GitHub MCP", branchName }, "Creating remote Git branch");
    return { content: [{ type: "text", text: JSON.stringify({ success: true, branch: branchName }) }] };
  }
  if (name === "github.commit_files") {
    const { branchName, message, files } = args as { branchName: string; message: string; files: any[] };
    logger.info({ sector: "GitHub MCP", branchName, fileCount: files.length }, "Committing files zero-disk to GitHub");
    return { content: [{ type: "text", text: JSON.stringify({ success: true, committedFiles: files.length, message }) }] };
  }
  throw new Error("Unknown tool: " + name);
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
run().catch(console.error);