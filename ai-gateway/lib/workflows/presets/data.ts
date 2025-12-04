import { Workflow } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function createDataSyncWorkflow(): Workflow {
  return {
    id: uuidv4(),
    name: 'Data Sync Workflow',
    description: 'Fetch → Transform → Store → Notify data workflow',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: 'fetch',
        name: 'Fetch Data',
        type: 'tool',
        config: {
          tool: 'http_get',
          args: {
            url: '{{sourceUrl}}',
          },
        },
      },
      {
        id: 'transform',
        name: 'Transform Data',
        type: 'tool',
        config: {
          tool: 'transform_json',
          args: {
            data: '{{fetch}}',
            transformation: '{{transformation}}',
          },
        },
        dependsOn: ['fetch'],
      },
      {
        id: 'store',
        name: 'Store Data',
        type: 'webhook',
        config: {
          url: '{{storageUrl}}',
          data: {
            data: '{{transform}}',
          },
        },
        dependsOn: ['transform'],
      },
      {
        id: 'notify',
        name: 'Send Notification',
        type: 'webhook',
        config: {
          url: '{{notificationUrl}}',
          data: {
            message: 'Data sync completed',
            recordCount: '{{transform.length}}',
          },
        },
        dependsOn: ['store'],
      },
    ],
  };
}

