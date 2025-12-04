import { Workflow } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function createProductUpdateWorkflow(): Workflow {
  return {
    id: uuidv4(),
    name: 'Product Update Workflow',
    description: 'Scrape → Validate → Update → Notify product workflow',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: 'scrape',
        name: 'Scrape Product Data',
        type: 'tool',
        config: {
          tool: 'http_get',
          args: {
            url: '{{productUrl}}',
          },
        },
      },
      {
        id: 'validate',
        name: 'Validate Product Data',
        type: 'prompt',
        config: {
          prompt: 'Validate this product data: {{scrape}}. Check for required fields: name, price, description, category.',
        },
        dependsOn: ['scrape'],
      },
      {
        id: 'update',
        name: 'Update Product',
        type: 'webhook',
        config: {
          url: '{{updateUrl}}',
          data: {
            productId: '{{productId}}',
            data: '{{validate}}',
          },
        },
        dependsOn: ['validate'],
        retry: {
          maxAttempts: 3,
          delay: 1000,
        },
      },
      {
        id: 'notify',
        name: 'Send Update Notification',
        type: 'webhook',
        config: {
          url: '{{notificationUrl}}',
          data: {
            productId: '{{productId}}',
            status: 'updated',
          },
        },
        dependsOn: ['update'],
      },
    ],
  };
}

