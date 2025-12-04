import { routeWebhook, verifyWebhookSignature } from '../../../lib/webhooks/router';
import * as config from '../../../lib/webhooks/config';
import { v4 as uuidv4 } from 'uuid';

// POST /api/webhooks - Receive webhook
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const handlerType = url.searchParams.get('handler') || 'generic';
    const webhookId = url.searchParams.get('id');

    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const body = await req.json().catch(() => ({}));
    
    const payload = {
      headers,
      body,
      query: Object.fromEntries(url.searchParams.entries()),
    };

    // Verify signature if webhook ID is provided
    if (webhookId) {
      const webhook = await config.getWebhook(webhookId);
      if (webhook && webhook.secret) {
        const signature = headers['x-webhook-signature'] || headers['x-signature'] || '';
        const isValid = await verifyWebhookSignature(
          webhook.secret,
          JSON.stringify(body),
          signature
        );
        if (!isValid) {
          return new Response(
            JSON.stringify({ error: 'Invalid webhook signature' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    const result = await routeWebhook(handlerType, payload);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// GET /api/webhooks - List webhook configurations
export async function GET() {
  try {
    const webhooks = await config.loadWebhooks();
    return new Response(JSON.stringify({ webhooks }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

