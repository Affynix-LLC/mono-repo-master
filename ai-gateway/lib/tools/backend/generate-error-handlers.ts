import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ErrorHandlerSpec {
  framework?: 'nextjs' | 'express' | 'generic';
  logging?: boolean;
  recovery?: boolean;
}

export async function generateErrorHandlers(spec: ErrorHandlerSpec): Promise<string> {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY is required for error handler generation');
  }

  const framework = spec.framework || 'nextjs';
  const logging = spec.logging !== false;
  const recovery = spec.recovery !== false;

  const prompt = `Generate standardized error handling code for ${framework} with the following requirements:

1. Consistent error response format
2. ${logging ? 'Error logging setup with proper context' : 'Basic error handling'}
3. ${recovery ? 'Error recovery patterns and retry logic' : 'Standard error handling'}
4. HTTP status code mapping
5. Error type classification
6. User-friendly error messages
7. Development vs production error details

Requirements:
- Use TypeScript
- Export error handler functions
- Include error types/interfaces
- Add JSDoc comments
- Make it production-ready

Generate ONLY the error handling code, no explanations.`;

  const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  const result = await generateText({
    model: openai(modelName),
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return result.text;
}

