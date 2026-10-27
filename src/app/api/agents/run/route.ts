import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role for secure server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Google GenAI SDK (Gemini API)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, thread_id } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const threadId = thread_id || `thread-${Date.now()}`;

    // 1. Execute Multi-Agent Orchestration (Brand Strategist, Growth Hacker, Architect)
    // Generating response using Gemini model configuration with intelligent fallback
    const preferredModel = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
    const promptText = `You are the Lead Orchestrator for Touch Base Consulting Agency OS. 
Execute a multi-agent analysis for the following client objective: "${query}". 
Provide actionable, data-driven outputs covering SEO, content strategy, and technical architecture.`;

    let agentOutput = '';

    try {
      const response = await ai.models.generateContent({
        model: preferredModel,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: promptText
              }
            ]
          }
        ]
      });
      agentOutput = response.text || '';
    } catch (modelErr: any) {
      console.warn(`Primary model '${preferredModel}' failed: ${modelErr.message}. Falling back to gemini-3.5-flash-lite.`);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: promptText
              }
            ]
          }
        ]
      });
      agentOutput = fallbackResponse.text || '';
    }

    // 2. Persist execution thread state and audit log in Supabase
    const { error: dbError } = await supabase
      .from('agent_execution_logs')
      .insert({
        thread_id: threadId,
        query,
        output: agentOutput,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Supabase persistence warning:', dbError.message);
    }

    return NextResponse.json({
      success: true,
      thread_id: threadId,
      result: agentOutput
    });

  } catch (error: any) {
    console.error('Agent execution error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

