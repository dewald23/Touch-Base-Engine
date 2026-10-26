import { NextResponse } from "next/server";
import { ingestDocument } from "@/lib/vectorStore";
import { logger } from "@/lib/logger";
import { z } from "zod";

// Zod validation schema for document ingestion payloads
const ingestSchema = z.object({
  content: z.string().min(1, "Document content is required"),
  metadata: z.record(z.any()).optional().default({}),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = ingestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request payload", 
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    const { content, metadata } = validation.data;
    
    // Ingest into Supabase pgvector store via Gemini embeddings
    const documentId = await ingestDocument(content, metadata);

    logger.info({ documentId }, "Successfully processed document ingestion request");

    return NextResponse.json(
      { 
        success: true, 
        id: documentId, 
        message: "Document successfully ingested and indexed into vector memory" 
      },
      { status: 201 }
    );
  } catch (err: any) {
    logger.error({ err }, "API Ingestion Route Execution Error");
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal Server Error", 
        message: err.message 
      },
      { status: 500 }
    );
  }
}