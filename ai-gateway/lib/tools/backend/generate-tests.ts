import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TestSpec {
  routePath: string;
  routeCode?: string;
  testFramework?: 'jest' | 'vitest';
  description?: string;
}

export async function generateTestFile(spec: TestSpec): Promise<string> {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY is required for test generation');
  }

  const testFramework = spec.testFramework || 'jest';
  const frameworkImports = testFramework === 'jest' 
    ? "import { describe, it, expect, beforeEach, jest } from '@jest/globals';"
    : "import { describe, it, expect, beforeEach, vi } from 'vitest';";

  const prompt = `Generate a complete test file for the Next.js API route at: ${spec.routePath}

${spec.routeCode ? `Route code:\n\`\`\`typescript\n${spec.routeCode}\n\`\`\`` : ''}
${spec.description ? `Description: ${spec.description}` : ''}

Requirements:
1. Use ${testFramework} testing framework
2. Test all HTTP methods supported by the route
3. Test success cases with valid input
4. Test error cases (invalid input, missing fields, etc.)
5. Test authentication if the route requires it
6. Test validation errors
7. Mock external dependencies (databases, APIs, etc.)
8. Use proper test structure (describe, it, expect)
9. Include setup and teardown if needed
10. Test response status codes
11. Test response body structure
12. Use proper TypeScript types

Generate ONLY the test file code, no explanations. Make it production-ready.`;

  const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  const result = await generateText({
    model: openai(modelName),
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return result.text;
}

