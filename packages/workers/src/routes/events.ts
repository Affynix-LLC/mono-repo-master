import type { Env } from '../index';
import { logClickToAirtable, logQueryToAirtable } from '../lib/airtable';
import { corsHeaders } from '../lib/cors';

export async function handleEvents(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders(request) });
  }

  const url = new URL(request.url);
  const eventType = url.pathname.split('/api/events/')[1]; // 'click' or 'query'

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: corsHeaders(request),
    });
  }

  if (eventType === 'click') {
    await logClickToAirtable(env, {
      event_type: body.event_type as string,
      affiliate_id: body.affiliate_id as string,
      page_url: body.page_url as string,
      placement: (body.placement as string) ?? null,
      session_id: (body.session_id as string) ?? null,
    } as Parameters<typeof logClickToAirtable>[1]);
  } else if (eventType === 'query') {
    await logQueryToAirtable(env, {
      session_id: (body.session_id as string) ?? '',
      query_text: body.query_text as string,
      detected_intent: (body.detected_intent as string) ?? null,
      detected_category: (body.detected_category as string) ?? null,
      recommended_affiliate_ids: (body.recommended_affiliate_ids as string[]) ?? [],
      latency_ms: (body.latency_ms as number) ?? null,
      response_version: (body.response_version as string) ?? null,
    } as Parameters<typeof logQueryToAirtable>[1]);
  }

  return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders(request) });
}
