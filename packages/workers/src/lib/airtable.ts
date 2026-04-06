import type { Env } from '../index';
import type { Affiliate, AffiliateCard, QueryLog, ClickLog } from '@affynix/shared';

const AIRTABLE_API = 'https://api.airtable.com/v0';

// ─── Airtable base / table IDs ───────────────────────────────────────────────
const BASE_ID = (env: Env) => env.AIRTABLE_BASE_ID; // apprtDMPpjmYejxA3
const TABLE_AFFILIATES = 'Affiliates_Master';
const TABLE_QUERY_LOG  = 'QueryLog';
const TABLE_CLICK_LOG  = 'ClickLog';

// ─── Low-level helpers ───────────────────────────────────────────────────────

async function airtableFetch(
  env: Env,
  table: string,
  params: Record<string, string> = {}
): Promise<{ records: Array<{ id: string; fields: Record<string, unknown> }> }> {
  const url = new URL(`${AIRTABLE_API}/${BASE_ID(env)}/${encodeURIComponent(table)}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${env.AIRTABLE_API_KEY}` },
  });
  if (!res.ok) throw new Error(`Airtable ${table} fetch error: ${res.status} ${await res.text()}`);
  return res.json() as Promise<{ records: Array<{ id: string; fields: Record<string, unknown> }> }>;
}

async function airtableCreate(
  env: Env,
  table: string,
  fields: Record<string, unknown>
): Promise<void> {
  const res = await fetch(
    `${AIRTABLE_API}/${BASE_ID(env)}/${encodeURIComponent(table)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    }
  );
  if (!res.ok) throw new Error(`Airtable ${table} create error: ${res.status} ${await res.text()}`);
}

// ─── Field mappers ───────────────────────────────────────────────────────────
// Existing Affiliates_Master field names → our Affiliate type

function mapAffiliate(record: { id: string; fields: Record<string, unknown> }): Affiliate {
  const f = record.fields;

  // trial_type: "full" | "limited" | "none" | null → boolean | null
  const trialType = f.trial_type as string | null;
  const freeTrial = trialType === 'full' || trialType === 'limited'
    ? true
    : trialType === 'none'
    ? false
    : null;

  return {
    affiliate_id:             (f.product_id as string) ?? record.id,
    product_name:             (f.name as string) ?? '',
    vendor_name:              (f.vendor as string) ?? '',
    category:                 (f.category_primary as Affiliate['category']) ?? 'tools',
    status:                   (f.status as Affiliate['status']) ?? 'active',
    website_url:              (f.website_url as string) ?? '',
    affiliate_url:            (f.affiliate_link as string) ?? '',
    docs_url:                 (f.docs_url as string) ?? null,
    pricing_url:              (f.pricing_url as string) ?? null,
    logo_url:                 (f.logo_url as string) ?? null,
    og_image_url:             (f.og_image_url as string) ?? null,
    difficulty:               (f.difficulty as Affiliate['difficulty']) ?? null,
    setup_time:               (f.setup_time as string) ?? null,
    free_trial:               freeTrial,
    short_summary:            (f.short_summary as string) ?? '',
    primary_use_case:         (f.primary_use_case as string) ?? null,
    best_for:                 (f.best_for as string) ?? null,
    strengths:                f.strengths ? (f.strengths as string).split('\n').filter(Boolean) : null,
    limitations:              f.limitations ? (f.limitations as string).split('\n').filter(Boolean) : null,
    ideal_scenarios:          f.ideal_scenarios ? (f.ideal_scenarios as string).split('\n').filter(Boolean) : null,
    alternatives:             f.alternatives ? (f.alternatives as string).split(',').map((s) => s.trim()).filter(Boolean) : null,
    evidence_coverage_pct:    (f.evidence_coverage_pct as number) ?? null,
    evidence_gaps:            f.evidence_gaps ? (f.evidence_gaps as string).split('\n').filter(Boolean) : null,
    evidence_source_url:      (f.provenance_bundle_url as string) ?? null,
    evidence_captured_at_utc: (f.docs_last_updated_utc as string) ?? null,
    clickout_count:           (f.clickout_count as number) ?? 0,
    conversion_count:         (f.conversion_count as number) ?? 0,
    created_at_utc:           (f.created_at_utc as string) ?? new Date().toISOString(),
    updated_at_utc:           (f.updated_at_utc as string) ?? new Date().toISOString(),
  };
}

export function toCard(a: Affiliate): AffiliateCard {
  return {
    affiliate_id:          a.affiliate_id,
    product_name:          a.product_name,
    vendor_name:           a.vendor_name,
    category:              a.category,
    status:                a.status,
    short_summary:         a.short_summary,
    logo_url:              a.logo_url,
    difficulty:            a.difficulty,
    free_trial:            a.free_trial,
    setup_time:            a.setup_time,
    evidence_coverage_pct: a.evidence_coverage_pct,
    affiliate_url:         a.affiliate_url,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getAffiliates(
  env: Env,
  category?: string,
  search?: string
): Promise<Affiliate[]> {
  const filters: string[] = ["{status} = 'active'"];
  if (category) filters.push(`{category_primary} = '${category}'`);
  if (search) {
    const q = search.replace(/"/g, '');
    filters.push(`OR(SEARCH(LOWER("${q}"), LOWER({name})), SEARCH(LOWER("${q}"), LOWER({short_summary})))`);
  }

  const params: Record<string, string> = {
    filterByFormula: filters.length === 1 ? filters[0] : `AND(${filters.join(', ')})`,
    sort:            JSON.stringify([{ field: 'evidence_coverage_pct', direction: 'desc' }]),
  };

  // Fetch up to 100 records (one page; paginate later if needed)
  const data = await airtableFetch(env, TABLE_AFFILIATES, params);
  return data.records.map(mapAffiliate);
}

export async function logQueryToAirtable(
  env: Env,
  payload: Omit<QueryLog, 'event_id' | 'occurred_at_utc'>
): Promise<void> {
  await airtableCreate(env, TABLE_QUERY_LOG, {
    query_id:                  crypto.randomUUID(), // existing primary field name
    timestamp_utc:             new Date().toISOString(),
    query_text:                payload.query_text,
    session_id:                payload.session_id,
    detected_intent:           payload.detected_intent,
    detected_category:         payload.detected_category,
    recommended_affiliate_ids: payload.recommended_affiliate_ids.join(','),
    latency_ms:                payload.latency_ms,
    response_version:          payload.response_version,
  });
}

export async function logClickToAirtable(
  env: Env,
  payload: Omit<ClickLog, 'event_id' | 'occurred_at_utc'>
): Promise<void> {
  await airtableCreate(env, TABLE_CLICK_LOG, {
    event_id:       crypto.randomUUID(),
    occurred_at_utc: new Date().toISOString(),
    event_type:     payload.event_type,
    affiliate_id:   payload.affiliate_id,
    page_url:       payload.page_url,
    placement:      payload.placement,
    session_id:     payload.session_id,
  });
}
