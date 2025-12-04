import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TypeGenerationSpec {
  source: 'airtable' | 'api' | 'json' | 'description';
  table?: string;
  schema?: any;
  description?: string;
  output?: string;
}

export async function generateTypeScriptTypes(spec: TypeGenerationSpec): Promise<string> {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY is required for type generation');
  }

  let prompt = '';

  if (spec.source === 'airtable' && spec.table) {
    prompt = `Generate TypeScript type definitions for an Airtable table named "${spec.table}".

Based on common Airtable patterns, create:
1. A main interface for the record fields
2. A type for the full Airtable record (with id, createdTime, fields)
3. Export both types

Use proper TypeScript conventions:
- Use PascalCase for type names
- Make fields optional if they might not always be present
- Use appropriate types (string, number, boolean, Date, etc.)
- Add JSDoc comments for clarity

Generate ONLY the TypeScript code, no explanations.`;
  } else if (spec.source === 'json' && spec.schema) {
    prompt = `Generate TypeScript type definitions from this JSON schema:

${JSON.stringify(spec.schema, null, 2)}

Requirements:
1. Create appropriate TypeScript interfaces/types
2. Handle nested objects
3. Handle arrays
4. Use proper TypeScript types (string, number, boolean, Date, etc.)
5. Make fields optional if they might not always be present
6. Add JSDoc comments

Generate ONLY the TypeScript code, no explanations.`;
  } else if (spec.source === 'description' && spec.description) {
    prompt = `Generate TypeScript type definitions based on this description:

${spec.description}

Requirements:
1. Create appropriate TypeScript interfaces/types
2. Use proper naming conventions (PascalCase for types)
3. Use appropriate TypeScript types
4. Add JSDoc comments
5. Export the types

Generate ONLY the TypeScript code, no explanations.`;
  } else if (spec.source === 'api' && spec.schema) {
    prompt = `Generate TypeScript type definitions for an API based on this schema:

${JSON.stringify(spec.schema, null, 2)}

Create types for:
1. Request body (if applicable)
2. Response body
3. Query parameters (if applicable)
4. Path parameters (if applicable)

Generate ONLY the TypeScript code, no explanations.`;
  } else {
    throw new Error('Invalid type generation specification');
  }

  const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  const result = await generateText({
    model: openai(modelName),
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return result.text;
}

