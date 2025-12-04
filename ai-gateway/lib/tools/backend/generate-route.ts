import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RouteSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  auth?: boolean;
  body?: Record<string, string>;
  query?: Record<string, string>;
  response?: Record<string, string>;
}

export async function generateApiRoute(spec: RouteSpec): Promise<string> {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY is required for route generation');
  }

  const method = spec.method.toUpperCase();
  const pathParts = spec.path.split('/').filter(Boolean);
  const routePath = pathParts.join('/');
  const fileName = pathParts[pathParts.length - 1] || 'route';
  
  // Build the prompt for route generation
  const bodySchema = spec.body ? Object.entries(spec.body).map(([key, type]) => 
    `  ${key}: ${type};`
  ).join('\n') : null;

  const querySchema = spec.query ? Object.entries(spec.query).map(([key, type]) => 
    `  ${key}: ${type};`
  ).join('\n') : null;

  const responseSchema = spec.response ? Object.entries(spec.response).map(([key, type]) => 
    `  ${key}: ${type};`
  ).join('\n') : null;

  const prompt = `Generate a complete Next.js 14 App Router API route file for the following specification:

Method: ${method}
Path: ${spec.path}
Description: ${spec.description}
Authentication Required: ${spec.auth ? 'Yes' : 'No'}
${bodySchema ? `Request Body Schema:\n${bodySchema}` : ''}
${querySchema ? `Query Parameters:\n${querySchema}` : ''}
${responseSchema ? `Response Schema:\n${responseSchema}` : ''}

Requirements:
1. Use Next.js 14 App Router format (export async function ${method})
2. Include proper TypeScript types for request and response
3. Add Zod validation schema for request body (if POST/PUT/PATCH)
4. Include error handling with try-catch
5. Return proper HTTP status codes
6. Include authentication check if auth is required (use requireAuth from lib/auth)
7. Add JSDoc comments explaining the endpoint
8. Use NextRequest and NextResponse from 'next/server'
9. Handle CORS if needed
10. Include proper Content-Type headers

Generate ONLY the route file code, no explanations. The file should be production-ready.`;

  const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  const result = await generateText({
    model: openai(modelName),
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3, // Lower temperature for more consistent code generation
  });

  return result.text;
}

