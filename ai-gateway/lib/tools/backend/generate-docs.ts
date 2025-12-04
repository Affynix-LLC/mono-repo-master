import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import * as fs from 'fs/promises';
import * as path from 'path';
import 'dotenv/config';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface DocSpec {
  format: 'openapi' | 'markdown' | 'swagger';
  routes?: string[];
  routeFiles?: string[];
}

export async function generateApiDocumentation(spec: DocSpec): Promise<string> {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY is required for documentation generation');
  }

  let routeCode = '';
  if (spec.routeFiles && spec.routeFiles.length > 0) {
    // Read route files and include in prompt
    const codeSnippets: string[] = [];
    for (const filePath of spec.routeFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        codeSnippets.push(`File: ${filePath}\n\`\`\`typescript\n${content}\n\`\`\``);
      } catch (error) {
        // Skip files that can't be read
      }
    }
    routeCode = codeSnippets.join('\n\n');
  }

  const formatName = spec.format === 'openapi' ? 'OpenAPI 3.0' : spec.format === 'swagger' ? 'Swagger 2.0' : 'Markdown';

  const prompt = `Generate ${formatName} API documentation for the following routes:

${spec.routes ? `Routes: ${spec.routes.join(', ')}\n` : ''}
${routeCode ? `Route Code:\n${routeCode}\n` : ''}

Requirements:
${spec.format === 'openapi' || spec.format === 'swagger' ? 
  `1. Generate ${spec.format === 'openapi' ? 'OpenAPI 3.0' : 'Swagger 2.0'} specification
2. Include all endpoints with methods, paths, parameters, request/response schemas
3. Include authentication requirements
4. Include example requests and responses
5. Include error responses` :
  `1. Generate Markdown documentation
2. Include endpoint descriptions
3. Include request/response examples
4. Include authentication requirements
5. Include error codes and messages
6. Use proper Markdown formatting with code blocks`}

Extract information from JSDoc comments if present.
Generate ONLY the documentation, no explanations.`;

  const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  const result = await generateText({
    model: openai(modelName),
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return result.text;
}

