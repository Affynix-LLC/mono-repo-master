import { Workflow } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function createContentGenerationWorkflow(): Workflow {
  return {
    id: uuidv4(),
    name: 'Content Generation Workflow',
    description: 'Research → Write → Optimize → Publish content workflow',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: 'research',
        name: 'Research Topic',
        type: 'prompt',
        config: {
          prompt: 'Research the topic: {{topic}}. Provide key points, statistics, and insights.',
        },
      },
      {
        id: 'write',
        name: 'Write Content',
        type: 'prompt',
        config: {
          prompt: 'Write comprehensive content based on this research: {{research}}. Include keywords: {{keywords}}.',
        },
        dependsOn: ['research'],
      },
      {
        id: 'optimize',
        name: 'Optimize for SEO',
        type: 'prompt',
        config: {
          prompt: 'Optimize this content for SEO: {{write}}. Ensure keywords are naturally integrated.',
        },
        dependsOn: ['write'],
      },
      {
        id: 'publish',
        name: 'Publish Content',
        type: 'webhook',
        config: {
          url: '{{publishUrl}}',
          data: {
            title: '{{topic}}',
            content: '{{optimize}}',
          },
        },
        dependsOn: ['optimize'],
      },
    ],
  };
}

