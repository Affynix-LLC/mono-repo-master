/**
 * Agent01 - Intake & Qualification Agent
 *
 * Responsibilities:
 * - Initial lead qualification
 * - Basic needs assessment
 * - Determine if Agent02 call is warranted
 * - Maximum 5-minute call duration
 */

import { Lead, AgentCallSession, Agent01Session } from '../types';
import { AgentInterface, AgentCapabilities, AgentPrompt, CallOutcome } from './types';
import { route } from '../../router';

export class Agent01Intake implements AgentInterface {
  name = 'Agent01 - Intake Agent';
  type: 'agent01' = 'agent01';

  capabilities: AgentCapabilities = {
    canQualify: true,
    canSchedule: true,
    canTransfer: false,
    maxCallDuration: 300, // 5 minutes
    supportedLanguages: ['en', 'es'],
  };

  private config: any;
  private callTimer: NodeJS.Timeout | null = null;

  async initialize(config: any): Promise<void> {
    this.config = config;
  }

  validateLead(lead: Lead): { valid: boolean; reason?: string } {
    if (!lead.email) {
      return { valid: false, reason: 'Email is required' };
    }

    if (!lead.name) {
      return { valid: false, reason: 'Name is required' };
    }

    if (lead.status !== 'new' && lead.status !== 'agent01_scheduled') {
      return {
        valid: false,
        reason: `Lead status must be 'new' or 'agent01_scheduled', got '${lead.status}'`,
      };
    }

    return { valid: true };
  }

  getPrompt(): AgentPrompt {
    return {
      system: `You are Agent01, Affynix's AI-powered intake specialist. Your role is to conduct a brief, professional initial qualification call with potential clients.`,

      instructions: [
        'Introduce yourself as an AI assistant from Affynix',
        'Quickly establish rapport and make the prospect comfortable',
        'Ask about their business and current challenges',
        'Identify if they have a genuine need for AI automation',
        'Determine budget range and decision-making authority',
        'Assess urgency and timeline',
        'Decide if they qualify for Agent02 (deep discovery)',
        'Schedule Agent02 call if qualified, or provide next steps',
        'Keep the call under 5 minutes',
      ],

      constraints: [
        'Maximum call duration: 5 minutes',
        'Do not discuss technical implementation details',
        'Do not make pricing commitments',
        'Do not handle objections beyond surface level',
        'Focus on qualification, not selling',
        'Be professional but conversational',
        'If prospect is clearly unqualified, politely end the call early',
      ],

      tools: ['check_availability', 'schedule_meeting', 'send_email', 'update_crm'],
    };
  }

  async executeCall(lead: Lead, session: AgentCallSession): Promise<CallOutcome> {
    // Validate lead
    const validation = this.validateLead(lead);
    if (!validation.valid) {
      throw new Error(`Lead validation failed: ${validation.reason}`);
    }

    // Set up call timer (5 minutes max)
    const callStartTime = Date.now();
    let timedOut = false;

    this.callTimer = setTimeout(() => {
      timedOut = true;
    }, this.capabilities.maxCallDuration * 1000);

    try {
      // Build conversation context
      const conversationPrompt = this.buildConversationPrompt(lead);

      // Execute the call using AI router
      const response = await route(conversationPrompt);

      // Clear timer
      if (this.callTimer) {
        clearTimeout(this.callTimer);
        this.callTimer = null;
      }

      // Calculate call duration
      const callDuration = Math.floor((Date.now() - callStartTime) / 1000);

      // Parse the agent's response
      const outcome = this.parseAgentResponse(response.text, lead, callDuration, timedOut);

      return outcome;
    } catch (error: any) {
      if (this.callTimer) {
        clearTimeout(this.callTimer);
      }

      throw new Error(`Agent01 call failed: ${error.message}`);
    }
  }

  private buildConversationPrompt(lead: Lead): string {
    const prompt = this.getPrompt();

    return `${prompt.system}

INSTRUCTIONS:
${prompt.instructions.map((i) => `- ${i}`).join('\n')}

CONSTRAINTS:
${prompt.constraints.map((c) => `- ${c}`).join('\n')}

LEAD INFORMATION:
- Name: ${lead.name}
- Email: ${lead.email}
- Company: ${lead.company || 'Unknown'}
- Phone: ${lead.phone || 'Not provided'}
- Source: ${lead.source}
${lead.challenges ? `- Challenges: ${lead.challenges.join(', ')}` : ''}
${lead.goals ? `- Goals: ${lead.goals.join(', ')}` : ''}

TASK:
Conduct an intake qualification call with this lead. Ask relevant questions to assess:
1. Business needs and pain points
2. Budget and authority
3. Timeline and urgency
4. Fit for our AI automation services

Based on the conversation, provide:
- A qualification decision (QUALIFIED/DISQUALIFIED/NEEDS_MORE_INFO)
- A qualification score (0-100)
- A sentiment score (-1 to 1)
- Key points from the conversation
- Recommended next steps

Format your response as JSON:
{
  "qualified": true/false,
  "qualificationScore": 0-100,
  "sentimentScore": -1 to 1,
  "summary": "Brief summary of the call",
  "keyPoints": ["point 1", "point 2", ...],
  "painPoints": ["pain 1", "pain 2", ...],
  "businessNeeds": ["need 1", "need 2", ...],
  "budgetRange": "estimated budget range",
  "timeline": "their timeline",
  "decisionMakers": ["person 1", "person 2", ...],
  "nextSteps": ["action 1", "action 2", ...],
  "recommendAgent02": true/false
}`;
  }

  private parseAgentResponse(
    responseText: string,
    lead: Lead,
    callDuration: number,
    timedOut: boolean
  ): CallOutcome {
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in agent response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Build outcome
      const outcome: CallOutcome = {
        success: !timedOut,
        qualified: parsed.qualified === true,
        qualificationScore: this.normalizeScore(parsed.qualificationScore),
        sentimentScore: this.normalizeSentiment(parsed.sentimentScore),
        summary: parsed.summary || '',
        keyPoints: parsed.keyPoints || [],
        nextSteps: parsed.nextSteps || [],
        metadata: {
          callDuration,
          timedOut,
          agent: 'agent01',
          painPoints: parsed.painPoints || [],
          businessNeeds: parsed.businessNeeds || [],
          budgetRange: parsed.budgetRange || 'unknown',
          timeline: parsed.timeline || 'unknown',
          decisionMakers: parsed.decisionMakers || [],
          recommendAgent02: parsed.recommendAgent02 === true,
        },
      };

      return outcome;
    } catch (error: any) {
      // Fallback outcome if parsing fails
      return {
        success: false,
        qualified: false,
        qualificationScore: 0,
        sentimentScore: 0,
        summary: 'Call completed but response parsing failed',
        keyPoints: [],
        nextSteps: ['Manual review required'],
        metadata: {
          callDuration,
          timedOut,
          agent: 'agent01',
          error: error.message,
        },
      };
    }
  }

  private normalizeScore(score: any): number {
    const num = typeof score === 'number' ? score : parseInt(score, 10);
    if (isNaN(num)) return 50;
    return Math.max(0, Math.min(100, num));
  }

  private normalizeSentiment(sentiment: any): number {
    const num = typeof sentiment === 'number' ? sentiment : parseFloat(sentiment);
    if (isNaN(num)) return 0;
    return Math.max(-1, Math.min(1, num));
  }
}

export const agent01 = new Agent01Intake();
