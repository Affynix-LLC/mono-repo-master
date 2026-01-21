/**
 * Base Handler for Lead Ingestion
 */

import { Lead } from '../types';

export interface IngestionSource {
  type: 'email' | 'crm' | 'linkedin' | 'webhook' | 'form';
  provider?: string;
  metadata?: Record<string, any>;
}

export interface IngestionResult {
  success: boolean;
  lead?: Lead;
  error?: string;
  metadata?: Record<string, any>;
}

export abstract class BaseIngestionHandler {
  abstract sourceName: string;
  abstract sourceType: IngestionSource['type'];

  /**
   * Process incoming data and create a lead
   */
  abstract process(data: any): Promise<IngestionResult>;

  /**
   * Validate incoming data
   */
  abstract validate(data: any): { valid: boolean; errors?: string[] };

  /**
   * Map source-specific data to Lead format
   */
  protected mapToLead(data: any, source: IngestionSource): Partial<Lead> {
    return {
      id: this.generateLeadId(),
      source: source.type,
      sourceId: data.id || data.sourceId,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Generate a unique lead ID
   */
  protected generateLeadId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Extract phone number from various formats
   */
  protected normalizePhone(phone?: string): string | undefined {
    if (!phone) return undefined;
    // Remove non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return cleaned;
    }
    return undefined;
  }

  /**
   * Normalize email address
   */
  protected normalizeEmail(email?: string): string | undefined {
    if (!email) return undefined;
    return email.toLowerCase().trim();
  }
}
