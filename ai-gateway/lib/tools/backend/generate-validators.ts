import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ValidatorSpec {
  types: string;
  framework?: 'zod' | 'yup' | 'joi';
}

export async function generateValidators(spec: ValidatorSpec): Promise<string> {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY is required for validator generation');
  }

  const framework = spec.framework || 'zod';

  const prompt = `Generate ${framework} validation schemas from the following TypeScript types:

\`\`\`typescript
${spec.types}
\`\`\`

Requirements:
1. Create ${framework} schemas that match the TypeScript types
2. Handle nested objects and arrays
3. Make fields optional if they are optional in the types
4. Add appropriate validation rules (min/max length, email format, etc.)
5. Export the schemas
6. Include JSDoc comments

Generate ONLY the ${framework} schema code, no explanations. Make it production-ready.`;

  const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  const result = await generateText({
    model: openai(modelName),
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return result.text;
}

