/**
 * Agent02 - Discovery & Deep Dive Agent
 *
 * Responsibilities:
 * - Deep technical discovery
 * - Detailed needs assessment
 * - Integration requirements gathering
 * - Prepare comprehensive data for human handoff
 * - Maximum 5-minute call duration
 */

import { Lead, AgentCallSession, Agent02Session } from '../types';
import { AgentInterface, AgentCapabilities, AgentPrompt, CallOutcome } from './types';
import { route } from '../../router';

export class Agent02Discovery implements AgentInterface {
  name = 'Agent02 - Discovery Agent';
  type: 'agent02' = 'agent02';

  capabilities: AgentCapabilities = {
    canQualify: true,
    canSchedule: true,
    canTransfer: true,
    maxCallDuration: 300, // 5 minutes
    supportedLanguages: ['en', 'es'],
  };

  private config: any;
  private callTimer: NodeJS.Timeout | null = null;

  async initialize(config: any): Promise<void> {
    this.config = config;
  }

  validateLead(lead: Lead): { valid: boolean; reason?: string } {
    if (lead.status !== 'agent01_completed' && lead.status !== 'agent02_scheduled') {
      return {
        valid: false,
        reason: `Lead must complete Agent01 before Agent02. Current status: ${lead.status}`,
      };
    }

    if (!lead.qualificationScore || lead.qualificationScore < 50) {
      return {
        valid: false,
        reason: 'Lead qualification score too low for Agent02',
      };
    }

    return { valid: true };
  }

  getPrompt(): AgentPrompt {
    return {
      system: `You are Agent02, Affynix's AI-powered discovery specialist. Your role is to conduct a detailed technical and business discovery call with qualified prospects.`,

      instructions: [
        'Reference the Agent01 call to show continuity',
        'Dive deeper into technical requirements',
        'Understand current systems and tech stack',
        'Identify integration points and dependencies',
        'Assess technical complexity and feasibility',
        'Understand compliance and security requirements',
        'Define success metrics and KPIs',
        'Uncover potential blockers or concerns',
        'Gather information for executive brief',
        'Schedule human consultation if appropriate',
      ],

      constraints: [
        'Maximum call duration: 5 minutes',
        'Do not provide detailed technical solutions yet',
        'Do not commit to specific deliverables',
        'Focus on discovery, not solution design',
        'Be professional and technical but accessible',
        'Document everything for the human handoff',
        'Identify any red flags or deal breakers',
      ],

      tools: [
        'check_availability',
        'schedule_consultation',
        'send_followup',
        'update_crm',
        'generate_discovery_doc',
      ],
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

      throw new Error(`Agent02 call failed: ${error.message}`);
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
- Industry: ${lead.industry || 'Unknown'}
- Company Size: ${lead.companySize || 'Unknown'}
- Revenue: ${lead.revenue || 'Unknown'}
- Qualification Score: ${lead.qualificationScore || 'N/A'}

PREVIOUS CONTEXT (from Agent01):
${lead.challenges ? `- Challenges: ${lead.challenges.join(', ')}` : ''}
${lead.goals ? `- Goals: ${lead.goals.join(', ')}` : ''}

TASK:
Conduct a deep discovery call with this qualified lead. Focus on:
1. Technical requirements and current systems
2. Integration needs and dependencies
3. Compliance and security requirements
4. Success metrics and KPIs
5. Detailed pain points and use cases
6. Blockers, concerns, and objections
7. Readiness to proceed to human consultation

Based on the conversation, provide:
- Updated qualification score (0-100)
- Sentiment analysis (-1 to 1, plus engagement, urgency, readiness subscores)
- Detailed discovery findings
- Recommended next steps and talking points for human consultant

Format your response as JSON:
{
  "qualificationScore": 0-100,
  "sentiment": {
    "overall": -1 to 1,
    "engagement": 0-1,
    "urgency": 0-1,
    "readiness": 0-1,
    "concerns": ["concern 1", ...],
    "positiveSignals": ["signal 1", ...]
  },
  "summary": "Detailed summary of discovery findings",
  "keyPoints": ["point 1", "point 2", ...],
  "technicalRequirements": ["req 1", "req 2", ...],
  "currentSystems": ["system 1", "system 2", ...],
  "integrationNeeds": ["integration 1", ...],
  "complianceRequirements": ["requirement 1", ...],
  "successMetrics": ["metric 1", "metric 2", ...],
  "detailedPainPoints": {
    "pain1": "detailed description",
    "pain2": "detailed description"
  },
  "blockers": ["blocker 1", ...],
  "estimatedValue": 10000,
  "recommendedDealSize": "small|medium|large|enterprise",
  "readyForHuman": true/false,
  "nextSteps": ["action 1", "action 2", ...],
  "talkingPointsForConsultant": ["point 1", "point 2", ...],
  "questionsForConsultant": ["question 1", "question 2", ...]
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
        qualified: parsed.readyForHuman === true,
        qualificationScore: this.normalizeScore(parsed.qualificationScore),
        sentimentScore: this.normalizeSentiment(parsed.sentiment?.overall),
        summary: parsed.summary || '',
        keyPoints: parsed.keyPoints || [],
        nextSteps: parsed.nextSteps || [],
        metadata: {
          callDuration,
          timedOut,
          agent: 'agent02',
          sentiment: {
            overall: this.normalizeSentiment(parsed.sentiment?.overall),
            engagement: this.normalizeUnit(parsed.sentiment?.engagement),
            urgency: this.normalizeUnit(parsed.sentiment?.urgency),
            readiness: this.normalizeUnit(parsed.sentiment?.readiness),
            concerns: parsed.sentiment?.concerns || [],
            positiveSignals: parsed.sentiment?.positiveSignals || [],
          },
          technicalRequirements: parsed.technicalRequirements || [],
          currentSystems: parsed.currentSystems || [],
          integrationNeeds: parsed.integrationNeeds || [],
          complianceRequirements: parsed.complianceRequirements || [],
          successMetrics: parsed.successMetrics || [],
          detailedPainPoints: parsed.detailedPainPoints || {},
          blockers: parsed.blockers || [],
          estimatedValue: parsed.estimatedValue || 0,
          recommendedDealSize: parsed.recommendedDealSize || 'medium',
          readyForHuman: parsed.readyForHuman === true,
          talkingPointsForConsultant: parsed.talkingPointsForConsultant || [],
          questionsForConsultant: parsed.questionsForConsultant || [],
        },
      };

      return outcome;
    } catch (error: any) {
      // Fallback outcome if parsing fails
      return {
        success: false,
        qualified: false,
        qualificationScore: lead.qualificationScore || 50,
        sentimentScore: 0,
        summary: 'Discovery call completed but response parsing failed',
        keyPoints: [],
        nextSteps: ['Manual review required'],
        metadata: {
          callDuration,
          timedOut,
          agent: 'agent02',
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

  private normalizeUnit(value: any): number {
    const num = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num)) return 0.5;
    return Math.max(0, Math.min(1, num));
  }
}

export const agent02 = new Agent02Discovery();
