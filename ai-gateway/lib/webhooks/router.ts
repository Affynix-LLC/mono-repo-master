import { WebhookConfig, WebhookPayload, WebhookHandler } from './types';
import * as clickbankHandler from './handlers/clickbank';
import * as airtableHandler from './handlers/airtable';
import * as genericHandler from './handlers/generic';
import * as config from './config';

export async function routeWebhook(
  handlerType: string,
  payload: WebhookPayload
): Promise<any> {
  let handler: WebhookHandler;

  switch (handlerType) {
    case 'clickbank':
      handler = clickbankHandler.handle;
      break;
    case 'airtable':
      handler = airtableHandler.handle;
      break;
    case 'generic':
      handler = genericHandler.handle;
      break;
    default:
      throw new Error(`Unknown webhook handler type: ${handlerType}`);
  }

  return handler(payload);
}

export async function verifyWebhookSignature(
  secret: string,
  payload: string,
  signature: string
): Promise<boolean> {
  // Basic signature verification - can be enhanced with crypto
  // For now, simple comparison (implement proper HMAC verification in production)
  return secret === signature;
}

