import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import 'dotenv/config';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface DeploymentSpec {
  environment: 'development' | 'staging' | 'production';
  platform: 'vercel' | 'docker' | 'custom';
  project?: string;
  validation?: boolean;
  rollback?: boolean;
}

export async function generateDeploymentScript(spec: DeploymentSpec): Promise<string> {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY is required for deployment script generation');
  }

  const prompt = `Generate a complete deployment script for:
- Environment: ${spec.environment}
- Platform: ${spec.platform}
- Project: ${spec.project || 'default'}
- Validation: ${spec.validation !== false ? 'Yes' : 'No'}
- Rollback support: ${spec.rollback !== false ? 'Yes' : 'No'}

Requirements:
1. ${spec.platform === 'vercel' ? 'Use Vercel CLI (vercel --prod)' : spec.platform === 'docker' ? 'Use Docker and docker-compose' : 'Use custom deployment commands'}
2. Validate environment variables before deployment
3. Run tests before deployment (if validation is enabled)
4. Check dependencies are installed
5. ${spec.rollback !== false ? 'Include rollback procedure' : ''}
6. Include health checks after deployment
7. Add proper error handling
8. Include logging for deployment steps
9. Use proper exit codes
10. Make it executable (bash/zsh script)

Generate ONLY the deployment script code, no explanations. Make it production-ready.`;

  const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  const result = await generateText({
    model: openai(modelName),
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return result.text;
}

