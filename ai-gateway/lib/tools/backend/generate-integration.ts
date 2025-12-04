import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface IntegrationSpec {
  service: 'airtable' | 'vercel' | 'cloudflare';
  operation: string;
  description?: string;
  config?: Record<string, any>;
}

export async function generateIntegrationCode(spec: IntegrationSpec): Promise<string> {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY is required for integration code generation');
  }

  let prompt = '';

  if (spec.service === 'airtable') {
    prompt = `Generate TypeScript code for Airtable integration that ${spec.description || spec.operation}.

Requirements:
1. Use the Airtable SDK (import Airtable from 'airtable')
2. Initialize base using environment variables (AIRTABLE_API_KEY, AIRTABLE_BASE_ID)
3. Include proper error handling with try-catch
4. Add TypeScript types for the data structures
5. Include JSDoc comments
6. Handle authentication properly
7. Export the main function

Generate ONLY the TypeScript code, no explanations. Make it production-ready.`;
  } else if (spec.service === 'vercel') {
    prompt = `Generate TypeScript code for Vercel API integration that ${spec.description || spec.operation}.

Requirements:
1. Use axios or fetch for HTTP requests
2. Use environment variables for VERCEL_API_TOKEN, VERCEL_PROJECT_ID
3. Include proper error handling
4. Add TypeScript types
5. Include authentication headers (Bearer token)
6. Handle API rate limits if applicable
7. Export the main function

Generate ONLY the TypeScript code, no explanations. Make it production-ready.`;
  } else if (spec.service === 'cloudflare') {
    prompt = `Generate TypeScript code for Cloudflare API integration that ${spec.description || spec.operation}.

Requirements:
1. Use axios or fetch for HTTP requests
2. Use environment variables for Cloudflare API credentials
3. Include proper error handling
4. Add TypeScript types
5. Include authentication headers
6. Handle API responses properly
7. Export the main function

Generate ONLY the TypeScript code, no explanations. Make it production-ready.`;
  } else {
    throw new Error(`Unsupported service: ${spec.service}`);
  }

  const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  const result = await generateText({
    model: openai(modelName),
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return result.text;
}

