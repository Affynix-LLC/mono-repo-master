import { WebhookPayload } from '../types';

export async function handle(payload: WebhookPayload): Promise<any> {
  // Airtable webhook handler
  // Airtable sends webhooks when records are created, updated, or deleted
  
  const { body } = payload;
  
  // Process Airtable webhook data
  const result = {
    type: 'airtable',
    event: body.event || body.webhook?.event || 'unknown',
    baseId: body.base?.id || body.base_id,
    tableId: body.table?.id || body.table_id,
    recordId: body.record?.id || body.record_id,
    timestamp: new Date().toISOString(),
    data: body.record?.fields || body.fields || {},
  };

  // Here you could sync data, trigger workflows, etc.
  console.log('Airtable webhook processed:', result);

  return result;
}

