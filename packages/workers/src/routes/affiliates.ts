import type { Env } from '../index';
import { getAffiliates, toCard } from '../lib/airtable';
import { corsHeaders } from '../lib/cors';

// In-memory cache (lives for the duration of the isolate)
let cache: { data: unknown; expiresAt: number } | null = null;

export async function handleAffiliates(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') ?? undefined;
  const search = url.searchParams.get('search') ?? undefined;
  const slug = url.pathname.split('/api/affiliates/')[1]; // e.g. /api/affiliates/some-slug

  const ttl = parseInt(env.CACHE_TTL_SECONDS ?? '300', 10) * 1000;

  // Single product lookup by slug
  if (slug) {
    const affiliates = await getAffiliates(env);
    const match = affiliates.find(
      (a) => a.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    );
    if (!match) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: corsHeaders(request),
      });
    }
    return new Response(JSON.stringify(match), {
      headers: { ...corsHeaders(request), 'Cache-Control': `s-maxage=${ttl / 1000}` },
    });
  }

  // List — use cache only for unfiltered requests
  const useCache = !category && !search;
  if (useCache && cache && Date.now() < cache.expiresAt) {
    return new Response(JSON.stringify(cache.data), {
      headers: { ...corsHeaders(request), 'X-Cache': 'HIT' },
    });
  }

  const affiliates = await getAffiliates(env, category, search);
  const cards = affiliates.map(toCard);

  if (useCache) {
    cache = { data: cards, expiresAt: Date.now() + ttl };
  }

  return new Response(JSON.stringify(cards), {
    headers: { ...corsHeaders(request), 'Cache-Control': `s-maxage=${ttl / 1000}` },
  });
}
