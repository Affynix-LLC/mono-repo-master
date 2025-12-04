import { generateText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';
import { toolRegistry } from './lib/tools/registry';
import { registerAllTools } from './lib/tools/definitions';

// Register all tools on module load
registerAllTools();

// Determine which API to use
const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-');

// For generateText, always use standard OpenAI endpoint (Vercel Gateway doesn't support /responses endpoint)
// For streamText (used in chat route), Vercel Gateway works fine
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AI_GATEWAY_API_KEY,
  // Don't set baseURL for generateText - it needs standard OpenAI endpoint
});

export async function route(prompt: string, options?: { useTools?: boolean }) {
  const useTools = options?.useTools ?? true;
  
  // generateText requires a standard OpenAI API key (starts with 'sk-')
  // Vercel AI Gateway key (vck_) only works with streamText (used in chat route)
  if (!hasOpenAIKey) {
    throw new Error(
      'Router requires OPENAI_API_KEY (starts with sk-). ' +
      'AI_GATEWAY_API_KEY (vck_) only works with streamText in chat routes. ' +
      'Please set OPENAI_API_KEY in your .env file.'
    );
  }
  
  // Use standard OpenAI model
  const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  
  const model = openai(modelName);
  
  // Convert tool definitions to AI SDK tool format
  const tools: Record<string, any> = {};
  if (useTools) {
    for (const toolDef of toolRegistry.getAll()) {
      tools[toolDef.name] = tool({
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

  // Use generateText with messages format
  return generateText({
    model,
    messages: [{ role: 'user', content: prompt }],
    tools: Object.keys(tools).length > 0 ? tools : undefined,
  });
}
