/**
 * LinkedIn Lead Ingestion Handler
 *
 * Processes leads from LinkedIn Lead Gen Forms, InMail, or connection requests
 */

import { Lead } from '../types';
import { BaseIngestionHandler, IngestionResult } from './base-handler';

interface LinkedInData {
  id: string;
  source: 'lead_gen_form' | 'inmail' | 'connection_request' | 'message';

  // Profile information
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;

  // Professional information
  company?: string;
  jobTitle?: string;
  seniority?: string; // Entry, Mid, Senior, Director, VP, C-Level
  function?: string; // IT, Marketing, Sales, etc.
  industry?: string;
  companySize?: string;

  // Lead Gen Form data
  formResponses?: Record<string, string>;
  campaignId?: string;
  adId?: string;

  // Message data
  messageText?: string;
  subject?: string;

  // Metadata
  timestamp?: string;
}

export class LinkedInIngestionHandler extends BaseIngestionHandler {
  sourceName = 'LinkedIn';
  sourceType: 'linkedin' = 'linkedin';

  private config: {
    requiredFields?: string[];
    scoringRules?: {
      seniorityWeights?: Record<string, number>;
      companySizeWeights?: Record<string, number>;
    };
  };

  constructor(config?: any) {
    super();
    this.config = config || {
      scoringRules: {
        seniorityWeights: {
          'C-Level': 100,
          'VP': 90,
          'Director': 80,
          'Senior': 70,
          'Mid': 60,
          'Entry': 50,
        },
        companySizeWeights: {
          'Enterprise': 100,
          'Large': 80,
          'Medium': 60,
          'Small': 40,
        },
      },
    };
  }

  validate(data: LinkedInData): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    if (!data.id) {
      errors.push('LinkedIn ID is required');
    }

    if (!data.email && !data.linkedinUrl) {
      errors.push('Either email or LinkedIn URL is required');
    }

    if (!data.firstName && !data.lastName) {
      errors.push('At least first name or last name is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async process(data: LinkedInData): Promise<IngestionResult> {
    // Validate
    const validation = this.validate(data);
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors?.join(', ')}`,
      };
    }

    try {
      // Calculate initial qualification score based on seniority and company size
      const qualificationScore = this.calculateQualificationScore(data);

      // Extract challenges and goals from message or form responses
      const { challenges, goals } = this.extractInsights(data);

      // Map LinkedIn data to Lead
      const lead: Lead = {
        ...this.mapToLead(data, {
          type: 'linkedin',
          provider: 'linkedin',
          metadata: {
            linkedinId: data.id,
            source: data.source,
            campaignId: data.campaignId,
            adId: data.adId,
          },
        }),
        name: this.extractName(data),
        email: this.normalizeEmail(data.email) || `temp_${data.id}@linkedin.placeholder`,
        phone: this.normalizePhone(data.phone),
        company: data.company,
        industry: data.industry,
        companySize: this.normalizeCompanySize(data.companySize),
        linkedinUrl: data.linkedinUrl,
        qualificationScore,
        challenges,
        goals,
        customFields: {
          linkedinId: data.id,
          linkedinSource: data.source,
          jobTitle: data.jobTitle,
          seniority: data.seniority,
          function: data.function,
          campaignId: data.campaignId,
          adId: data.adId,
          formResponses: data.formResponses,
          messageText: data.messageText,
          subject: data.subject,
        },
        tags: this.generateTags(data),
      } as Lead;

      return {
        success: true,
        lead,
        metadata: {
          source: 'linkedin',
          linkedinSource: data.source,
          qualificationScore,
          seniority: data.seniority,
          companySize: data.companySize,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Processing failed: ${error.message}`,
      };
    }
  }

  private extractName(data: LinkedInData): string {
    const parts: string[] = [];
    if (data.firstName) parts.push(data.firstName);
    if (data.lastName) parts.push(data.lastName);

    if (parts.length > 0) {
      return parts.join(' ');
    }

    return 'LinkedIn Contact';
  }

  private calculateQualificationScore(data: LinkedInData): number {
    let score = 50; // Base score

    // Seniority scoring
    if (data.seniority && this.config.scoringRules?.seniorityWeights) {
      const seniorityScore = this.config.scoringRules.seniorityWeights[data.seniority];
      if (seniorityScore) {
        score = Math.max(score, seniorityScore);
      }
    }

    // Company size boost
    if (data.companySize && this.config.scoringRules?.companySizeWeights) {
      const sizeScore = this.config.scoringRules.companySizeWeights[data.companySize];
      if (sizeScore) {
        score = Math.round((score + sizeScore) / 2);
      }
    }

    // Lead gen form responses boost (indicates higher intent)
    if (data.formResponses && Object.keys(data.formResponses).length > 0) {
      score += 10;
    }

    // Message/InMail indicates direct engagement
    if (data.messageText || data.source === 'inmail') {
      score += 5;
    }

    return Math.min(100, score);
  }

  private extractInsights(data: LinkedInData): {
    challenges?: string[];
    goals?: string[];
  } {
    const text = [data.messageText, data.subject].filter(Boolean).join(' ');

    // Also include form responses
    if (data.formResponses) {
      const formText = Object.entries(data.formResponses)
        .map(([q, a]) => `${q}: ${a}`)
        .join(' ');
      Object.assign(text, ' ' + formText);
    }

    if (!text) return {};

    const challenges: string[] = [];
    const goals: string[] = [];

    const challengeKeywords = ['challenge', 'problem', 'issue', 'struggle', 'pain', 'difficulty'];
    const goalKeywords = ['goal', 'want', 'need', 'looking for', 'interested in', 'hoping to'];

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
      challenges: challenges.length > 0 ? challenges.slice(0, 3) : undefined,
      goals: goals.length > 0 ? goals.slice(0, 3) : undefined,
    };
  }

  private normalizeCompanySize(size?: string): string | undefined {
    if (!size) return undefined;

    const normalized = size.toLowerCase();
    if (normalized.includes('1-10') || normalized.includes('self')) return 'Small';
    if (normalized.includes('11-50')) return 'Small';
    if (normalized.includes('51-200')) return 'Medium';
    if (normalized.includes('201-500')) return 'Medium';
    if (normalized.includes('501-1000')) return 'Large';
    if (normalized.includes('1001-5000')) return 'Large';
    if (normalized.includes('5001') || normalized.includes('10000')) return 'Enterprise';

    return size;
  }

  private generateTags(data: LinkedInData): string[] {
    const tags: string[] = ['linkedin'];

    if (data.seniority) tags.push(data.seniority.toLowerCase());
    if (data.function) tags.push(data.function.toLowerCase());
    if (data.source) tags.push(data.source);
    if (data.industry) tags.push(data.industry.toLowerCase());

    return tags;
  }
}

export const linkedinHandler = new LinkedInIngestionHandler();
