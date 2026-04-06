import type { Affiliate, AffiliateCard, Category, ClickLogCreate } from '@affynix/shared';

const WORKER_BASE = import.meta.env.VITE_WORKER_URL ?? 'https://api.affynix.com';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${WORKER_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchAffiliates(): Promise<AffiliateCard[]> {
  return get<AffiliateCard[]>('/api/affiliates');
}

export async function fetchAffiliatesByCategory(category: Category): Promise<AffiliateCard[]> {
  return get<AffiliateCard[]>(`/api/affiliates?category=${category}`);
}

export async function fetchAffiliateBySlug(slug: string): Promise<Affiliate> {
  return get<Affiliate>(`/api/affiliates/${slug}`);
}

export async function searchAffiliates(query: string): Promise<AffiliateCard[]> {
  return get<AffiliateCard[]>(`/api/affiliates?search=${encodeURIComponent(query)}`);
}

export async function logClick(payload: ClickLogCreate): Promise<void> {
  try {
    await fetch(`${WORKER_BASE}/api/events/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-critical — never throw on analytics failures
  }
}
