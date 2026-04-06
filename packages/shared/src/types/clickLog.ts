export type ClickEventType =
  | 'product_click'       // click on product card
  | 'affiliate_clickout'  // click on affiliate link (tracked exit)
  | 'modal_open'
  | 'compare_add'
  | 'search_result_click';

export interface ClickLog {
  event_id: string;
  occurred_at_utc: string; // ISO 8601
  event_type: ClickEventType;
  affiliate_id: string;
  page_url: string;
  placement: string | null; // e.g. "homepage_grid", "category_page", "brain_result"
  session_id: string | null;
}

export type ClickLogCreate = Omit<ClickLog, 'event_id' | 'occurred_at_utc'>;
