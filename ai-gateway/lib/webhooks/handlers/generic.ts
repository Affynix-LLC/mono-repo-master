import { WebhookPayload } from '../types';

export async function handle(payload: WebhookPayload): Promise<any> {
  // Generic webhook handler for custom integrations
  // Passes through the payload and allows custom processing
  
  const { body, headers, query } = payload;
  
  const result = {
    type: 'generic',
    receivedAt: new Date().toISOString(),
    headers: Object.keys(headers).reduce((acc, key) => {
      acc[key] = headers[key];
      return acc;
    }, {} as Record<string, string>),
    query: query || {},
    body: body,
  };

  // Generic handler - can be customized per integration
  console.log('Generic webhook processed:', result);

  return result;
}

