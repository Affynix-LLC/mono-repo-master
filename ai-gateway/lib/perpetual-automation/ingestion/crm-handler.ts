/**
 * CRM Lead Ingestion Handler
 *
 * Processes leads from CRM systems (Salesforce, HubSpot, Pipedrive, etc.)
 */

import { Lead } from '../types';
import { BaseIngestionHandler, IngestionResult } from './base-handler';

interface CRMData {
  id: string;
  provider: 'salesforce' | 'hubspot' | 'pipedrive' | 'custom';

  // Contact fields
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  phone?: string;
  mobile?: string;

  // Company fields
  company?: string;
  companySize?: string;
  industry?: string;
  annualRevenue?: number;
  website?: string;

  // Lead fields
  leadSource?: string;
  leadStatus?: string;
  leadScore?: number;
  description?: string;
  notes?: string;

  // Custom fields
  customFields?: Record<string, any>;

  // Metadata
  createdDate?: string;
  modifiedDate?: string;
  ownerId?: string;
  ownerName?: string;
}

export class CRMIngestionHandler extends BaseIngestionHandler {
  sourceName = 'CRM';
  sourceType: 'crm' = 'crm';

  private config: {
    provider?: string;
    fieldMappings?: Record<string, string>;
  };

  constructor(config?: any) {
    super();
    this.config = config || {};
  }

  validate(data: CRMData): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    if (!data.id) {
      errors.push('CRM record ID is required');
    }

    if (!data.email) {
      errors.push('Email is required');
    }

    if (!data.provider) {
      errors.push('CRM provider is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async process(data: CRMData): Promise<IngestionResult> {
    // Validate
    const validation = this.validate(data);
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors?.join(', ')}`,
      };
    }

    try {
      // Map CRM data to Lead
      const lead: Lead = {
        ...this.mapToLead(data, {
          type: 'crm',
          provider: data.provider,
          metadata: { crmId: data.id },
        }),
        name: this.extractName(data),
        email: this.normalizeEmail(data.email)!,
        phone: this.normalizePhone(data.phone || data.mobile),
        company: data.company,
        industry: data.industry,
        companySize: data.companySize,
        revenue: data.annualRevenue?.toString(),
        qualificationScore: data.leadScore,
        challenges: this.extractChallenges(data),
        goals: this.extractGoals(data),
        customFields: {
          crmProvider: data.provider,
          crmId: data.id,
          leadSource: data.leadSource,
          leadStatus: data.leadStatus,
          website: data.website,
          ownerId: data.ownerId,
          ownerName: data.ownerName,
          ...data.customFields,
        },
      } as Lead;

      return {
        success: true,
        lead,
        metadata: {
          source: 'crm',
          provider: data.provider,
          crmId: data.id,
          leadStatus: data.leadStatus,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Processing failed: ${error.message}`,
      };
    }
  }

  private extractName(data: CRMData): string {
    if (data.fullName) {
      return data.fullName;
    }

    const parts = [];
    if (data.firstName) parts.push(data.firstName);
    if (data.lastName) parts.push(data.lastName);

    if (parts.length > 0) {
      return parts.join(' ');
    }

    // Fallback to email username
    return data.email.split('@')[0];
  }

  private extractChallenges(data: CRMData): string[] | undefined {
    const challenges: string[] = [];
    const text = [data.description, data.notes].filter(Boolean).join(' ');

    if (!text) return undefined;

    // Look for challenge keywords
    const keywords = ['challenge', 'problem', 'issue', 'pain point', 'struggle', 'difficulty'];

    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if (keywords.some((keyword) => lowerSentence.includes(keyword))) {
        challenges.push(sentence.trim());
      }
    }

    return challenges.length > 0 ? challenges.slice(0, 5) : undefined;
  }

  private extractGoals(data: CRMData): string[] | undefined {
    const goals: string[] = [];
    const text = [data.description, data.notes].filter(Boolean).join(' ');

    if (!text) return undefined;

    // Look for goal keywords
    const keywords = ['goal', 'want to', 'looking for', 'need to', 'objective', 'target'];

    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if (keywords.some((keyword) => lowerSentence.includes(keyword))) {
        goals.push(sentence.trim());
      }
    }

    return goals.length > 0 ? goals.slice(0, 5) : undefined;
  }
}

export const crmHandler = new CRMIngestionHandler();
