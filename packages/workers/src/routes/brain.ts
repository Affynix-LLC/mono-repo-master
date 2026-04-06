import type { Env } from '../index';
import { getAffiliates, toCard, logQueryToAirtable } from '../lib/airtable';
import { corsHeaders } from '../lib/cors';
import type { AffiliateCard } from '@affynix/shared';

interface BrainResult {
  affiliate: AffiliateCard;
  rationale: string;
}

interface BrainResponse {
  results: BrainResult[];
  session_id: string;
  latency_ms: number;
}

export async function handleBrain(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders(request) });
  }

  let body: { query: string; session_id: string };
  try {
    body = await request.json() as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: corsHeaders(request),
    });
  }

  const { query, session_id } = body;
  if (!query?.trim()) {
    return new Response(JSON.stringify({ error: 'query is required' }), {
      status: 400,
      headers: corsHeaders(request),
    });
  }

  const start = Date.now();

  // Fetch all active affiliates
  const affiliates = await getAffiliates(env);
  const cards = affiliates.map(toCard);

  // Build the affiliate context for Haiku — compact to save tokens
  const context = cards
    .slice(0, 60) // cap at 60 to stay within context
    .map(
      (a) =>
        `ID:${a.affiliate_id} | ${a.product_name} (${a.category}) | evidence:${a.evidence_coverage_pct ?? '?'}% | trial:${a.free_trial === true ? 'Y' : a.free_trial === false ? 'N' : '?'} | setup:${a.setup_time ?? '?'} | ${a.short_summary}`
    )
    .join('\n');

  const systemPrompt = `You are the Affynix product recommendation engine. You match user queries to AI products from our catalog.

Rules:
- Return ONLY products that genuinely match the query. Do not hallucinate products.
- Select 3–5 products. Fewer is better if fewer truly match.
- Sort by evidence_coverage_pct descending.
- For each result write a one-sentence rationale starting with "Matches because".
- Do NOT use words like "best", "top", "leading", "most popular".
- If no products match, return an empty array.

Respond ONLY with valid JSON in this exact shape:
{"results":[{"affiliate_id":"...","rationale":"..."}]}`;

  const userPrompt = `User query: "${query}"\n\nProduct catalog:\n${context}`;

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    console.error('[Brain] Anthropic error:', err);
    return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
      status: 502,
      headers: corsHeaders(request),
    });
  }

  const anthropicData = await anthropicRes.json() as {
    content: Array<{ type: string; text: string }>;
  };

  const rawText = anthropicData.content.find((c) => c.type === 'text')?.text ?? '{"results":[]}';

  let parsed: { results: Array<{ affiliate_id: string; rationale: string }> };
  try {
    parsed = JSON.parse(rawText) as typeof parsed;
  } catch {
    parsed = { results: [] };
  }

  // Map affiliate_ids back to card objects
  const cardMap = new Map(cards.map((c) => [c.affiliate_id, c]));
  const results: BrainResult[] = parsed.results
    .filter((r) => cardMap.has(r.affiliate_id))
    .map((r) => ({
      affiliate: cardMap.get(r.affiliate_id)!,
      rationale: r.rationale,
    }));

  const latency_ms = Date.now() - start;
  const responseVersion = 'claude-haiku-4-5-20251001';

  // Log the query asynchronously — don't await
  const logPayload = {
    session_id,
    query_text: query,
    detected_intent: null,
    detected_category: null,
    recommended_affiliate_ids: results.map((r) => r.affiliate.affiliate_id),
    latency_ms,
    response_version: responseVersion,
  };
  // waitUntil keeps the Worker alive until logging completes
  // ctx is not available here; fire-and-forget
  logQueryToAirtable(env, logPayload as Parameters<typeof logQueryToAirtable>[1]).catch(console.error);

  const response: BrainResponse = { results, session_id, latency_ms };
  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders(request), 'X-Latency-Ms': String(latency_ms) },
  });
}
