// app/api/chat/route.ts

import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import type { CoreMessage } from 'ai'
import { toolRegistry } from '../../../lib/tools/registry'
import { registerAllTools } from '../../../lib/tools/definitions'
import { tool } from 'ai'

// Register all tools on module load
registerAllTools();

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
})

// Cache tool definitions to avoid rebuilding on every request
let cachedTools: Record<string, any> | null = null;

function getTools(): Record<string, any> | undefined {
  if (cachedTools === null) {
    cachedTools = {};
  for (const toolDef of toolRegistry.getAll()) {
      cachedTools[toolDef.name] = tool({
      description: toolDef.description,
      parameters: toolDef.parameters as any,
      execute: async (args: any): Promise<any> => {
        const result = await toolRegistry.execute(toolDef.name, args);
        if (!result.success) {
          throw new Error(result.error || 'Tool execution failed');
        }
        return result.data;
      },
    } as any);
  }
  }
  return Object.keys(cachedTools).length > 0 ? cachedTools : undefined;
}

export async function POST(req: Request) {
  try {
    // Extract the `messages` and optional config from the body of the request
    const body = await req.json() as { 
      messages: CoreMessage[];
      maxOutputTokens?: number;
      temperature?: number;
      topP?: number;
    };
    const { 
      messages, 
      maxOutputTokens = 200000, // Claude Sonnet 4 maximum (increased from 64k)
      temperature = 0.7,
      topP = 1,
    } = body;

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required and cannot be empty' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get a language model
    const model = openai('anthropic/claude-sonnet-4')

    // Get tools (cached for performance)
    const tools = getTools();

    // Call the language model with maximized configuration
  const result = streamText({
    model,
    messages,
      tools,
      maxOutputTokens: Math.min(maxOutputTokens, 200000), // Cap at Claude Sonnet 4 maximum
      temperature: Math.max(0, Math.min(2, temperature)), // Clamp between 0-2
      topP: Math.max(0, Math.min(1, topP)), // Clamp between 0-1
      // Note: maxSteps and maxRetries are handled by the model provider
      // Timeout is handled by the deployment platform (Vercel)
  })

    // Respond with a streaming response and performance headers
    const response = result.toTextStreamResponse();
    
    // Add performance and caching headers
    const headers = new Headers(response.headers);
    headers.set('X-Max-Tokens', '200000');
    headers.set('X-Max-Output-Tokens', maxOutputTokens.toString());
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('X-Content-Type-Options', 'nosniff');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        type: error.name || 'Error'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
