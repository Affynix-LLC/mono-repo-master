export type AffiliateStatus = 'active' | 'inactive' | 'pending' | 'archived';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type Category =
  | 'tools'
  | 'apps'
  | 'services'
  | 'consultancies'
  | 'voice'
  | 'agents'
  | 'automation';

export interface Affiliate {
  // Identity
  affiliate_id: string;
  product_name: string;
  vendor_name: string;
  category: Category;
  status: AffiliateStatus;

  // URLs
  website_url: string;
  affiliate_url: string;
  docs_url: string | null;
  pricing_url: string | null;

  // Assets
  logo_url: string | null;
  og_image_url: string | null;

  // Metrics
  difficulty: DifficultyLevel | null;
  setup_time: string | null; // e.g. "< 1 hour", "1-3 days"
  free_trial: boolean | null; // null = unknown

  // Facts (vendor-declared or deterministically checked)
  short_summary: string;
  primary_use_case: string | null;
  best_for: string | null;
  strengths: string[] | null;
  limitations: string[] | null;
  ideal_scenarios: string[] | null;
  alternatives: string[] | null; // affiliate_ids of alternatives

  // Evidence
  evidence_coverage_pct: number | null; // 0–100
  evidence_gaps: string[] | null;
  evidence_source_url: string | null;
  evidence_captured_at_utc: string | null; // ISO 8601

  // Tracking
  clickout_count: number;
  conversion_count: number;

  // Meta
  created_at_utc: string;
  updated_at_utc: string;
}

// Lightweight card version used in grids/lists
export type AffiliateCard = Pick<
  Affiliate,
  | 'affiliate_id'
  | 'product_name'
  | 'vendor_name'
  | 'category'
  | 'status'
  | 'short_summary'
  | 'logo_url'
  | 'difficulty'
  | 'free_trial'
  | 'setup_time'
  | 'evidence_coverage_pct'
  | 'affiliate_url'
>;
