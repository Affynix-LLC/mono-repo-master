import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import * as fs from 'fs/promises';
import 'dotenv/config';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CodeAnalysisSpec {
  filePath?: string;
  code?: string;
  analysisType: 'patterns' | 'issues' | 'refactoring' | 'security' | 'all';
}

export async function analyzeCode(spec: CodeAnalysisSpec): Promise<string> {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY is required for code analysis');
  }

  let codeContent = spec.code || '';
  if (spec.filePath && !codeContent) {
    try {
      codeContent = await fs.readFile(spec.filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read file: ${spec.filePath}`);
    }
  }

  if (!codeContent) {
    throw new Error('Either filePath or code must be provided');
  }

  const analysisTypes = {
    patterns: 'code patterns, design patterns, and architectural decisions',
    issues: 'bugs, potential errors, and code quality issues',
    refactoring: 'refactoring opportunities and code improvements',
    security: 'security vulnerabilities and best practices',
    all: 'all of the above: patterns, issues, refactoring opportunities, and security concerns',
  };

  const prompt = `Analyze the following code for ${analysisTypes[spec.analysisType]}:

\`\`\`typescript
${codeContent}
\`\`\`

Provide a comprehensive analysis with:
1. Specific findings with line numbers or code references
2. Severity/priority ratings
3. Recommendations for improvements
4. Examples of better patterns if applicable

Format the response as a structured analysis report.`;

  const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  const result = await generateText({
    model: openai(modelName),
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return result.text;
}

