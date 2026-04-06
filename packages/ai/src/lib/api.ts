import type { AffiliateCard, QueryLogCreate } from '@affynix/shared';

const WORKER_BASE = import.meta.env.VITE_WORKER_URL ?? 'https://api.affynix.com';

export interface BrainResult {
  affiliate: AffiliateCard;
  rationale: string; // one-sentence reason this was recommended
}

export interface BrainResponse {
  results: BrainResult[];
  session_id: string;
  latency_ms: number;
}

export async function queryBrain(
  query: string,
  session_id: string
): Promise<BrainResponse> {
  const res = await fetch(`${WORKER_BASE}/api/brain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, session_id }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => 'Unknown error');
    throw new Error(err);
  }
  return res.json() as Promise<BrainResponse>;
}
