/**
 * Executive Brief Generator
 *
 * Generates comprehensive executive briefs for human consultants
 * Includes lead profile, sentiment analysis, opportunity assessment, and next steps
 */

import { route } from '../../../router';
import { Lead, Agent01Session, Agent02Session, ExecutiveBrief } from '../types';
import { sentimentAnalyzer, SentimentAnalysis } from './sentiment-analysis';

export class BriefGenerator {
  /**
   * Generate executive brief from lead and agent sessions
   */
  async generate(
    lead: Lead,
    agent01Session?: Agent01Session,
    agent02Session?: Agent02Session
  ): Promise<ExecutiveBrief> {
    // Perform sentiment analysis
    const sentiment = await sentimentAnalyzer.analyzeCombined(
      lead,
      agent01Session,
      agent02Session
    );

    // Generate comprehensive analysis
    const analysis = await this.generateAnalysis(lead, agent01Session, agent02Session, sentiment);

    // Build executive brief
    const brief: ExecutiveBrief = {
      id: this.generateBriefId(),
      leadId: lead.id,
      executiveSummary: analysis.executiveSummary,
      recommendedAction: analysis.recommendedAction,
      confidenceScore: analysis.confidenceScore,
      leadProfile: {
        company: lead.company || 'Unknown',
        contact: lead.name,
        industry: lead.industry || 'Unknown',
        size: lead.companySize || 'Unknown',
        revenue: lead.revenue,
      },
      opportunity: {
        estimatedValue: analysis.estimatedValue,
        timeline: analysis.timeline,
        probability: analysis.probability,
        dealSize: analysis.dealSize,
      },
      agent01Summary: agent01Session?.summary,
      agent02Summary: agent02Session?.summary,
      sentiment: {
        overall: sentiment.overall,
        engagement: sentiment.engagement,
        urgency: sentiment.urgency,
        readiness: sentiment.readiness,
        concerns: sentiment.concerns,
        positiveSignals: sentiment.positiveSignals,
      },
      keyFindings: {
        strengths: analysis.strengths,
        concerns: analysis.concerns,
        blockers: analysis.blockers,
        opportunities: analysis.opportunities,
      },
      nextSteps: {
        immediate: analysis.immediateSteps,
        shortTerm: analysis.shortTermSteps,
        longTerm: analysis.longTermSteps,
      },
      proposalOutline: analysis.proposalOutline,
      talkingPoints: analysis.talkingPoints,
      questionsToAsk: analysis.questionsToAsk,
      createdAt: new Date(),
      createdBy: 'system',
      version: 1,
    };

    return brief;
  }

  /**
   * Generate comprehensive analysis using AI
   */
  private async generateAnalysis(
    lead: Lead,
    agent01Session?: Agent01Session,
    agent02Session?: Agent02Session,
    sentiment?: SentimentAnalysis
  ): Promise<any> {
    const prompt = this.buildAnalysisPrompt(lead, agent01Session, agent02Session, sentiment);

    try {
      const response = await route(prompt);
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No JSON found in analysis response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return this.validateAndNormalizeAnalysis(parsed);
    } catch (error: any) {
      // Fallback to basic analysis
      return this.generateBasicAnalysis(lead, agent01Session, agent02Session, sentiment);
    }
  }

  /**
   * Build analysis prompt
   */
  private buildAnalysisPrompt(
    lead: Lead,
    agent01Session?: Agent01Session,
    agent02Session?: Agent02Session,
    sentiment?: SentimentAnalysis
  ): string {
    return `You are an expert sales analyst preparing an executive brief for a human consultant. Analyze the following lead and agent call data to create a comprehensive brief.

LEAD INFORMATION:
- Name: ${lead.name}
- Email: ${lead.email}
- Company: ${lead.company || 'Unknown'}
- Industry: ${lead.industry || 'Unknown'}
- Company Size: ${lead.companySize || 'Unknown'}
- Revenue: ${lead.revenue || 'Unknown'}
- Source: ${lead.source}
- Qualification Score: ${lead.qualificationScore || 'N/A'}

${
  lead.challenges
    ? `CHALLENGES:
${lead.challenges.map((c) => `- ${c}`).join('\n')}`
    : ''
}

${
  lead.goals
    ? `GOALS:
${lead.goals.map((g) => `- ${g}`).join('\n')}`
    : ''
}

${
  agent01Session
    ? `AGENT01 SESSION (Intake):
- Summary: ${agent01Session.summary || 'N/A'}
- Key Points: ${agent01Session.keyPoints?.join(', ') || 'N/A'}
- Duration: ${agent01Session.duration || 'N/A'} seconds
- Status: ${agent01Session.status}`
    : ''
}

${
  agent02Session
    ? `AGENT02 SESSION (Discovery):
- Summary: ${agent02Session.summary || 'N/A'}
- Key Points: ${agent02Session.keyPoints?.join(', ') || 'N/A'}
- Duration: ${agent02Session.duration || 'N/A'} seconds
- Status: ${agent02Session.status}`
    : ''
}

${
  sentiment
    ? `SENTIMENT ANALYSIS:
- Overall: ${sentiment.overall} (-1 to 1)
- Engagement: ${sentiment.engagement} (0 to 1)
- Urgency: ${sentiment.urgency} (0 to 1)
- Readiness: ${sentiment.readiness} (0 to 1)
- Concerns: ${sentiment.concerns.join(', ') || 'None identified'}
- Positive Signals: ${sentiment.positiveSignals.join(', ') || 'None identified'}`
    : ''
}

Based on this information, create a comprehensive executive brief with:

1. **Executive Summary** (2-3 sentences)
2. **Recommended Action** (proceed/nurture/disqualify)
3. **Confidence Score** (0-100)
4. **Opportunity Analysis**:
   - Estimated deal value
   - Timeline (e.g., "Q1 2026", "3-6 months")
   - Probability (0-100)
   - Deal size (small/medium/large/enterprise)
5. **Key Findings**:
   - Strengths (3-5 points)
   - Concerns (2-4 points)
   - Blockers (if any)
   - Opportunities (2-4 points)
6. **Next Steps**:
   - Immediate actions (1-3)
   - Short-term actions (2-4)
   - Long-term actions (1-2)
7. **Proposal Outline** (brief 3-5 point outline)
8. **Talking Points** (4-6 key points for consultant)
9. **Questions to Ask** (3-5 strategic questions)

Format as JSON:
{
  "executiveSummary": "...",
  "recommendedAction": "proceed|nurture|disqualify",
  "confidenceScore": 0-100,
  "estimatedValue": number,
  "timeline": "...",
  "probability": 0-100,
  "dealSize": "small|medium|large|enterprise",
  "strengths": ["...", "...", ...],
  "concerns": ["...", "...", ...],
  "blockers": ["...", ...],
  "opportunities": ["...", "...", ...],
  "immediateSteps": ["...", "...", ...],
  "shortTermSteps": ["...", "...", ...],
  "longTermSteps": ["...", ...],
  "proposalOutline": "...",
  "talkingPoints": ["...", "...", ...],
  "questionsToAsk": ["...", "...", ...]
}`;
  }

  /**
   * Validate and normalize analysis data
   */
  private validateAndNormalizeAnalysis(data: any): any {
    return {
      executiveSummary: data.executiveSummary || 'Analysis pending',
      recommendedAction: this.normalizeAction(data.recommendedAction),
      confidenceScore: this.normalizePercent(data.confidenceScore),
      estimatedValue: Math.max(0, parseInt(data.estimatedValue) || 0),
      timeline: data.timeline || 'Unknown',
      probability: this.normalizePercent(data.probability),
      dealSize: this.normalizeDealSize(data.dealSize),
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      concerns: Array.isArray(data.concerns) ? data.concerns : [],
      blockers: Array.isArray(data.blockers) ? data.blockers : [],
      opportunities: Array.isArray(data.opportunities) ? data.opportunities : [],
      immediateSteps: Array.isArray(data.immediateSteps) ? data.immediateSteps : [],
      shortTermSteps: Array.isArray(data.shortTermSteps) ? data.shortTermSteps : [],
      longTermSteps: Array.isArray(data.longTermSteps) ? data.longTermSteps : [],
      proposalOutline: data.proposalOutline || '',
      talkingPoints: Array.isArray(data.talkingPoints) ? data.talkingPoints : [],
      questionsToAsk: Array.isArray(data.questionsToAsk) ? data.questionsToAsk : [],
    };
  }

  /**
   * Generate basic analysis as fallback
   */
  private generateBasicAnalysis(
    lead: Lead,
    agent01Session?: Agent01Session,
    agent02Session?: Agent02Session,
    sentiment?: SentimentAnalysis
  ): any {
    const qualScore = lead.qualificationScore || 50;
    const sentimentScore = sentiment?.readiness || 0.5;

    return {
      executiveSummary: `${lead.company || 'Prospect'} has completed agent intake process. Qualification score: ${qualScore}/100. Readiness: ${Math.round(sentimentScore * 100)}%.`,
      recommendedAction: qualScore >= 70 ? 'proceed' : qualScore >= 50 ? 'nurture' : 'disqualify',
      confidenceScore: 60,
      estimatedValue: this.estimateDealValue(lead),
      timeline: '3-6 months',
      probability: qualScore,
      dealSize: this.estimateDealSize(lead),
      strengths: ['Completed agent intake', 'Expressed interest'],
      concerns: sentiment?.concerns || [],
      blockers: [],
      opportunities: ['Automation needs identified'],
      immediateSteps: ['Schedule human consultation', 'Send follow-up email'],
      shortTermSteps: ['Prepare custom proposal', 'Technical assessment'],
      longTermSteps: ['Implementation planning'],
      proposalOutline: 'Basic automation solution proposal',
      talkingPoints: ['Focus on ROI', 'Discuss timeline', 'Address concerns'],
      questionsToAsk: ['What is your current process?', 'What are your pain points?'],
    };
  }

  /**
   * Estimate deal value based on company size and industry
   */
  private estimateDealValue(lead: Lead): number {
    const sizeMultipliers: Record<string, number> = {
      Small: 5000,
      Medium: 25000,
      Large: 100000,
      Enterprise: 500000,
    };

    const baseValue = sizeMultipliers[lead.companySize || 'Medium'] || 25000;

    // Adjust based on qualification score
    const scoreMultiplier = (lead.qualificationScore || 50) / 100;

    return Math.round(baseValue * scoreMultiplier);
  }

  /**
   * Estimate deal size category
   */
  private estimateDealSize(lead: Lead): 'small' | 'medium' | 'large' | 'enterprise' {
    const size = lead.companySize?.toLowerCase() || 'medium';

    if (size.includes('enterprise') || size.includes('large')) return 'enterprise';
    if (size.includes('medium')) return 'large';
    if (size.includes('small')) return 'medium';
    return 'small';
  }

  /**
   * Generate brief ID
   */
  private generateBriefId(): string {
    return `brief_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Normalize action to valid values
   */
  private normalizeAction(action: string): 'proceed' | 'nurture' | 'disqualify' {
    const normalized = action?.toLowerCase();
    if (normalized === 'proceed' || normalized === 'nurture' || normalized === 'disqualify') {
      return normalized as 'proceed' | 'nurture' | 'disqualify';
    }
    return 'nurture';
  }

  /**
   * Normalize percentage to 0-100 range
   */
  private normalizePercent(value: any): number {
    const num = typeof value === 'number' ? value : parseInt(value, 10);
    if (isNaN(num)) return 50;
    return Math.max(0, Math.min(100, num));
  }

  /**
   * Normalize deal size to valid values
   */
  private normalizeDealSize(size: string): 'small' | 'medium' | 'large' | 'enterprise' {
    const normalized = size?.toLowerCase();
    if (
      normalized === 'small' ||
      normalized === 'medium' ||
      normalized === 'large' ||
      normalized === 'enterprise'
    ) {
      return normalized as 'small' | 'medium' | 'large' | 'enterprise';
    }
    return 'medium';
  }
}

export const briefGenerator = new BriefGenerator();
