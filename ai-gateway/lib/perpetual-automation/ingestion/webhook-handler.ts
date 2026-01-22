/**
 * Generic Webhook Lead Ingestion Handler
 *
 * Processes leads from custom webhook integrations (Zapier, Make, custom apps)
 */

import { Lead } from '../types';
import { BaseIngestionHandler, IngestionResult } from './base-handler';

interface WebhookData {
  // Standard fields
  name?: string;
  email?: string;
  phone?: string;
  company?: string;

  // Optional fields
  firstName?: string;
  lastName?: string;
  industry?: string;
  companySize?: string;
  revenue?: string;
  website?: string;
  jobTitle?: string;

  // Lead context
  source?: string;
  sourceUrl?: string;
  referrer?: string;
  campaign?: string;
  utmParams?: Record<string, string>;

  // Engagement data
  message?: string;
  subject?: string;
  interests?: string[];
  tags?: string[];

  // Custom fields (anything not mapped above)
  [key: string]: any;
}

interface WebhookConfig {
  fieldMappings?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    [key: string]: string | undefined;
  };
  requiredFields?: string[];
  transformations?: {
    field: string;
    type: 'uppercase' | 'lowercase' | 'trim' | 'normalize_phone';
  }[];
}

export class WebhookIngestionHandler extends BaseIngestionHandler {
  sourceName = 'Webhook';
  sourceType: 'webhook' = 'webhook';

  private config: WebhookConfig;

  constructor(config?: WebhookConfig) {
    super();
    this.config = config || {};
  }

  validate(data: WebhookData): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Apply field mappings
    const mappedData = this.applyFieldMappings(data);

    // Check required fields
    const requiredFields = this.config.requiredFields || ['email'];
    for (const field of requiredFields) {
      if (!mappedData[field]) {
        errors.push(`Required field "${field}" is missing`);
      }
    }

    // Validate email if provided
    if (mappedData.email && !this.isValidEmail(mappedData.email)) {
      errors.push('Invalid email format');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async process(data: WebhookData): Promise<IngestionResult> {
    // Apply field mappings
    const mappedData = this.applyFieldMappings(data);

    // Apply transformations
    const transformedData = this.applyTransformations(mappedData);

    // Validate
    const validation = this.validate(transformedData);
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors?.join(', ')}`,
      };
    }

    try {
      // Extract name (handle firstName/lastName or full name)
      const name = this.extractName(transformedData);

      // Extract challenges and goals from message
      const { challenges, goals } = this.extractInsights(transformedData);

      // Separate known fields from custom fields
      const knownFields = [
        'name',
        'firstName',
        'lastName',
        'email',
        'phone',
        'company',
        'industry',
        'companySize',
        'revenue',
        'website',
        'jobTitle',
        'source',
        'sourceUrl',
        'referrer',
        'campaign',
        'utmParams',
        'message',
        'subject',
        'interests',
        'tags',
      ];

      const customFields: Record<string, any> = {};
      for (const [key, value] of Object.entries(transformedData)) {
        if (!knownFields.includes(key)) {
          customFields[key] = value;
        }
      }

      // Map webhook data to Lead
      const lead: Lead = {
        ...this.mapToLead(transformedData, {
          type: 'webhook',
          provider: transformedData.source || 'custom',
          metadata: {
            source: transformedData.source,
            sourceUrl: transformedData.sourceUrl,
            referrer: transformedData.referrer,
            campaign: transformedData.campaign,
            utmParams: transformedData.utmParams,
          },
        }),
        name,
        email: this.normalizeEmail(transformedData.email)!,
        phone: this.normalizePhone(transformedData.phone),
        company: transformedData.company,
        industry: transformedData.industry,
        companySize: transformedData.companySize,
        revenue: transformedData.revenue,
        challenges,
        goals,
        tags: this.generateTags(transformedData),
        customFields: {
          ...customFields,
          website: transformedData.website,
          jobTitle: transformedData.jobTitle,
          message: transformedData.message,
          subject: transformedData.subject,
          interests: transformedData.interests,
        },
      } as Lead;

      return {
        success: true,
        lead,
        metadata: {
          source: 'webhook',
          webhookSource: transformedData.source,
          campaign: transformedData.campaign,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Processing failed: ${error.message}`,
      };
    }
  }

  private applyFieldMappings(data: WebhookData): WebhookData {
    if (!this.config.fieldMappings) {
      return data;
    }

    const mapped: any = { ...data };

    for (const [targetField, sourceField] of Object.entries(this.config.fieldMappings)) {
      if (sourceField && data[sourceField] !== undefined) {
        mapped[targetField] = data[sourceField];
      }
    }

    return mapped;
  }

  private applyTransformations(data: WebhookData): WebhookData {
    if (!this.config.transformations) {
      return data;
    }

    const transformed: any = { ...data };

    for (const transform of this.config.transformations) {
      const value = transformed[transform.field];
      if (value === undefined) continue;

      switch (transform.type) {
        case 'uppercase':
          transformed[transform.field] = String(value).toUpperCase();
          break;
        case 'lowercase':
          transformed[transform.field] = String(value).toLowerCase();
          break;
        case 'trim':
          transformed[transform.field] = String(value).trim();
          break;
        case 'normalize_phone':
          transformed[transform.field] = this.normalizePhone(String(value));
          break;
      }
    }

    return transformed;
  }

  private extractName(data: WebhookData): string {
    if (data.name) {
      return data.name;
    }

    const parts: string[] = [];
    if (data.firstName) parts.push(data.firstName);
    if (data.lastName) parts.push(data.lastName);

    if (parts.length > 0) {
      return parts.join(' ');
    }

    // Fallback to email username
    if (data.email) {
      return data.email.split('@')[0];
    }

    return 'Unknown Contact';
  }

  private extractInsights(data: WebhookData): {
    challenges?: string[];
    goals?: string[];
  } {
    const text = [data.message, data.subject].filter(Boolean).join(' ');

    if (!text) return {};

    const challenges: string[] = [];
    const goals: string[] = [];

    const challengeKeywords = ['challenge', 'problem', 'issue', 'struggle', 'pain', 'difficulty'];
    const goalKeywords = ['goal', 'want', 'need', 'looking for', 'interested in', 'achieve'];

    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();

      if (challengeKeywords.some((kw) => lowerSentence.includes(kw))) {
        challenges.push(sentence.trim());
      }

      if (goalKeywords.some((kw) => lowerSentence.includes(kw))) {
        goals.push(sentence.trim());
      }
    }

    return {
      challenges: challenges.length > 0 ? challenges.slice(0, 5) : undefined,
      goals: goals.length > 0 ? goals.slice(0, 5) : undefined,
    };
  }

  private generateTags(data: WebhookData): string[] {
    const tags: string[] = ['webhook'];

    if (data.source) tags.push(data.source.toLowerCase());
    if (data.campaign) tags.push(data.campaign.toLowerCase());
    if (data.tags) tags.push(...data.tags.map((t) => t.toLowerCase()));
    if (data.interests) tags.push(...data.interests.map((i) => i.toLowerCase()));

    // Add UTM params as tags
    if (data.utmParams) {
      if (data.utmParams.utm_source) tags.push(`utm:${data.utmParams.utm_source}`);
      if (data.utmParams.utm_campaign) tags.push(`campaign:${data.utmParams.utm_campaign}`);
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const webhookHandler = new WebhookIngestionHandler();
