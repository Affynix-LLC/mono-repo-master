export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  secret?: string;
  handler: string; // Handler type: 'clickbank', 'airtable', 'generic'
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookPayload {
  headers: Record<string, string>;
  body: any;
  query?: Record<string, string>;
}

export interface WebhookHandler {
  (payload: WebhookPayload): Promise<any>;
}

