/**
 * Email Lead Ingestion Handler
 *
 * Processes leads from email submissions (contact forms, direct emails, etc.)
 */

import { Lead } from '../types';
import { BaseIngestionHandler, IngestionResult } from './base-handler';

interface EmailData {
  from: string;
  subject?: string;
  body?: string;
  to?: string;
  cc?: string[];
  timestamp?: string;
  headers?: Record<string, string>;

  // Form data (if from a web form)
  formData?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    message?: string;
    [key: string]: any;
  };
}

export class EmailIngestionHandler extends BaseIngestionHandler {
  sourceName = 'Email';
  sourceType: 'email' = 'email';

  private config: {
    parseRules?: {
      nameFields?: string[];
      companyFields?: string[];
      phoneFields?: string[];
    };
  };

  constructor(config?: any) {
    super();
    this.config = config || {};
  }

  validate(data: EmailData): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    if (!data.from) {
      errors.push('Email "from" address is required');
    }

    // Validate email format
    if (data.from && !this.isValidEmail(data.from)) {
      errors.push('Invalid email format');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async process(data: EmailData): Promise<IngestionResult> {
    // Validate
    const validation = this.validate(data);
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors?.join(', ')}`,
      };
    }

    try {
      // Extract lead information
      const leadData = this.extractLeadData(data);

      // Create lead
      const lead: Lead = {
        ...this.mapToLead(data, { type: 'email', provider: 'email' }),
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        challenges: leadData.challenges,
        customFields: {
          emailSubject: data.subject,
          emailBody: data.body,
          emailTimestamp: data.timestamp,
          formData: data.formData,
        },
      } as Lead;

      return {
        success: true,
        lead,
        metadata: {
          source: 'email',
          subject: data.subject,
          timestamp: data.timestamp,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Processing failed: ${error.message}`,
      };
    }
  }

  private extractLeadData(data: EmailData): {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    challenges?: string[];
  } {
    let name = 'Unknown';
    let email = data.from;
    let phone: string | undefined;
    let company: string | undefined;
    let challenges: string[] = [];

    // If form data is provided, use it
    if (data.formData) {
      name = data.formData.name || this.extractNameFromEmail(data.from);
      email = this.normalizeEmail(data.formData.email || data.from) || data.from;
      phone = this.normalizePhone(data.formData.phone);
      company = data.formData.company;

      // Extract challenges from message
      if (data.formData.message) {
        challenges = this.extractChallenges(data.formData.message);
      }
    } else {
      // Parse from email body
      name = this.extractNameFromEmail(data.from);

      if (data.body) {
        const bodyData = this.parseEmailBody(data.body);
        name = bodyData.name || name;
        company = bodyData.company;
        phone = bodyData.phone;
        challenges = bodyData.challenges;
      }
    }

    return { name, email, phone, company, challenges };
  }

  private extractNameFromEmail(email: string): string {
    // Try to extract name from "Name <email@domain.com>" format
    const match = email.match(/^([^<]+)\s*</);
    if (match) {
      return match[1].trim();
    }

    // Extract from email username
    const username = email.split('@')[0];
    return username
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private parseEmailBody(body: string): {
    name?: string;
    company?: string;
    phone?: string;
    challenges: string[];
  } {
    const result: any = { challenges: [] };

    // Extract phone numbers
    const phoneMatch = body.match(/(?:phone|tel|mobile):\s*([+\d\s()-]+)/i);
    if (phoneMatch) {
      result.phone = this.normalizePhone(phoneMatch[1]);
    }

    // Extract company
    const companyMatch = body.match(/(?:company|organization):\s*([^\n]+)/i);
    if (companyMatch) {
      result.company = companyMatch[1].trim();
    }

    // Extract name
    const nameMatch = body.match(/(?:name|from):\s*([^\n]+)/i);
    if (nameMatch) {
      result.name = nameMatch[1].trim();
    }

    // Extract challenges/issues
    result.challenges = this.extractChallenges(body);

    return result;
  }

  private extractChallenges(text: string): string[] {
    const challenges: string[] = [];
    const keywords = [
      'need',
      'looking for',
      'problem',
      'issue',
      'challenge',
      'help with',
      'struggling',
      'difficult',
    ];

    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      for (const keyword of keywords) {
        if (sentence.toLowerCase().includes(keyword)) {
          challenges.push(sentence.trim());
          break;
        }
      }
    }

    return challenges.slice(0, 5); // Limit to top 5
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const emailHandler = new EmailIngestionHandler();
