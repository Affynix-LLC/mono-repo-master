import { handleAffiliates } from './routes/affiliates';
import { handleEvents } from './routes/events';
import { handleBrain } from './routes/brain';
import { corsHeaders } from './lib/cors';

export interface Env {
  AIRTABLE_API_KEY: string;
  AIRTABLE_BASE_ID: string;  // set as var in wrangler.toml: apprtDMPpjmYejxA3
  ANTHROPIC_API_KEY: string;
  CACHE_TTL_SECONDS: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    try {
      // Route dispatch
      if (pathname.startsWith('/api/affiliates')) {
        return handleAffiliates(request, env, ctx);
      }
      if (pathname.startsWith('/api/events')) {
        return handleEvents(request, env);
      }
      if (pathname === '/api/brain') {
        return handleBrain(request, env);
      }

      return new Response('Not found', { status: 404, headers: corsHeaders(request) });
    } catch (err) {
      console.error('[Worker]', err);
      return new Response('Internal server error', {
        status: 500,
        headers: corsHeaders(request),
      });
    }
  },
};
