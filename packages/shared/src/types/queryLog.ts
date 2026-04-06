export interface QueryLog {
  event_id: string;
  occurred_at_utc: string; // ISO 8601
  session_id: string;
  query_text: string;
  detected_intent: string | null;
  detected_category: string | null;
  recommended_affiliate_ids: string[]; // affiliate_ids returned
  latency_ms: number | null;
  response_version: string | null; // e.g. "haiku-20240307"
}

export type QueryLogCreate = Omit<QueryLog, 'event_id' | 'occurred_at_utc'>;
