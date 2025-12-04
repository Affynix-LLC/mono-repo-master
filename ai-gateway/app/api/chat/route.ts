// app/api/chat/route.ts

import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import type { CoreMessage } from 'ai'
import { toolRegistry } from '../../lib/tools/registry'
import { registerAllTools } from '../../lib/tools/definitions'
import { tool } from 'ai'

// Register all tools on module load
registerAllTools();

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
})

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const body = await req.json() as { messages: CoreMessage[] };
  const { messages } = body;

  // Get a language model
  const model = openai('anthropic/claude-sonnet-4')

  // Convert tool definitions to AI SDK tool format
  const tools: Record<string, any> = {};
  for (const toolDef of toolRegistry.getAll()) {
    tools[toolDef.name] = tool({
      description: toolDef.description,
      parameters: toolDef.parameters as any,
      execute: async (args: any) => {
        const result = await toolRegistry.execute(toolDef.name, args);
        if (!result.success) {
          throw new Error(result.error || 'Tool execution failed');
        }
        return result.data;
      },
    });
  }

  // Call the language model with the prompt
  const result = streamText({
    model,
    messages,
    tools: Object.keys(tools).length > 0 ? tools : undefined,
    maxOutputTokens: 64000,
    temperature: 0.7,
    topP: 1,
  })

  // Respond with a streaming response
  return result.toTextStreamResponse()
}
