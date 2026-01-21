/**
 * Sentiment Analysis
 *
 * Analyzes agent call transcripts to extract sentiment, engagement, urgency, and readiness scores
 */

import { route } from '../../router';
import { AgentCallSession, Lead } from '../types';

export interface SentimentAnalysis {
  overall: number; // -1 to 1 (negative to positive)
  engagement: number; // 0-1 (how engaged the prospect was)
  urgency: number; // 0-1 (how urgent their need is)
  readiness: number; // 0-1 (how ready to buy they are)
  concerns: string[];
  positiveSignals: string[];
  confidence: number; // 0-1 (confidence in the analysis)
  explanation?: string;
}

export class SentimentAnalyzer {
  /**
   * Analyze sentiment from a single call session
   */
  async analyzeSession(session: AgentCallSession): Promise<SentimentAnalysis> {
    if (!session.transcript && !session.summary) {
      throw new Error('Session must have transcript or summary for sentiment analysis');
    }

    const text = session.transcript || session.summary || '';
    return await this.analyzeTtext(text);
  }

  /**
   * Analyze combined sentiment from multiple sessions
   */
  async analyzeCombined(
    lead: Lead,
    agent01Session?: AgentCallSession,
    agent02Session?: AgentCallSession
  ): Promise<SentimentAnalysis> {
    const texts: string[] = [];

    if (agent01Session?.transcript) {
      texts.push(`Agent01 Call:\n${agent01Session.transcript}`);
    } else if (agent01Session?.summary) {
      texts.push(`Agent01 Summary:\n${agent01Session.summary}`);
    }

    if (agent02Session?.transcript) {
      texts.push(`Agent02 Call:\n${agent02Session.transcript}`);
    } else if (agent02Session?.summary) {
      texts.push(`Agent02 Summary:\n${agent02Session.summary}`);
    }

    if (texts.length === 0) {
      throw new Error('No session data available for sentiment analysis');
    }

    const combinedText = texts.join('\n\n');
    return await this.analyzeText(combinedText);
  }

  /**
   * Analyze sentiment from text
   */
  private async analyzeText(text: string): Promise<SentimentAnalysis> {
    const prompt = `You are a sentiment analysis expert. Analyze the following conversation transcript and provide detailed sentiment metrics.

CONVERSATION TEXT:
${text}

Analyze the following aspects:

1. **Overall Sentiment** (-1 to 1):
   - -1 = Very negative, frustrated, disinterested
   - 0 = Neutral
   - 1 = Very positive, enthusiastic, interested

2. **Engagement** (0 to 1):
   - How actively engaged was the prospect in the conversation?
   - Did they ask questions, provide detailed answers, show interest?

3. **Urgency** (0 to 1):
   - How urgent is their need for a solution?
   - Are they looking to act quickly or just exploring?

4. **Readiness to Buy** (0 to 1):
   - How ready are they to make a purchasing decision?
   - Do they have budget, authority, and clear need?

5. **Concerns**: List specific concerns, objections, or hesitations they expressed

6. **Positive Signals**: List specific positive indicators (budget confirmed, decision authority, timeline, enthusiasm, etc.)

Provide your analysis in JSON format:
{
  "overall": -1 to 1,
  "engagement": 0 to 1,
  "urgency": 0 to 1,
  "readiness": 0 to 1,
  "concerns": ["concern 1", "concern 2", ...],
  "positiveSignals": ["signal 1", "signal 2", ...],
  "confidence": 0 to 1,
  "explanation": "Brief explanation of your analysis"
}`;

    try {
      const response = await route(prompt);
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No JSON found in sentiment analysis response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        overall: this.normalizeSentiment(parsed.overall),
        engagement: this.normalizeScore(parsed.engagement),
        urgency: this.normalizeScore(parsed.urgency),
        readiness: this.normalizeScore(parsed.readiness),
        concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
        positiveSignals: Array.isArray(parsed.positiveSignals) ? parsed.positiveSignals : [],
        confidence: this.normalizeScore(parsed.confidence),
        explanation: parsed.explanation,
      };
    } catch (error: any) {
      // Fallback to basic sentiment analysis
      return this.basicSentimentAnalysis(text);
    }
  }

  /**
   * Basic sentiment analysis fallback (keyword-based)
   */
  private basicSentimentAnalysis(text: string): SentimentAnalysis {
    const lowerText = text.toLowerCase();

    // Positive keywords
    const positiveKeywords = [
      'interested',
      'excited',
      'great',
      'perfect',
      'yes',
      'definitely',
      'absolutely',
      'love',
      'excellent',
    ];

    // Negative keywords
    const negativeKeywords = [
      'not interested',
      'no',
      'expensive',
      'concern',
      'worried',
      'problem',
      'difficult',
      'cant',
      "can't",
    ];

    // Engagement keywords
    const engagementKeywords = [
      'how',
      'what',
      'when',
      'why',
      'tell me more',
      'can you',
      'would you',
    ];

    // Urgency keywords
    const urgencyKeywords = [
      'urgent',
      'asap',
      'quickly',
      'soon',
      'immediately',
      'right away',
      'this week',
    ];

    // Readiness keywords
    const readinessKeywords = [
      'budget',
      'ready',
      'decision',
      'approved',
      'authorized',
      'next steps',
      'contract',
    ];

    // Count keyword occurrences
    const positiveCount = positiveKeywords.filter((kw) => lowerText.includes(kw)).length;
    const negativeCount = negativeKeywords.filter((kw) => lowerText.includes(kw)).length;
    const engagementCount = engagementKeywords.filter((kw) => lowerText.includes(kw)).length;
    const urgencyCount = urgencyKeywords.filter((kw) => lowerText.includes(kw)).length;
    const readinessCount = readinessKeywords.filter((kw) => lowerText.includes(kw)).length;

    // Calculate scores
    const overall = (positiveCount - negativeCount) / (positiveCount + negativeCount + 1);
    const engagement = Math.min(1, engagementCount / 5);
    const urgency = Math.min(1, urgencyCount / 3);
    const readiness = Math.min(1, readinessCount / 4);

    return {
      overall: this.normalizeSentiment(overall),
      engagement: this.normalizeScore(engagement),
      urgency: this.normalizeScore(urgency),
      readiness: this.normalizeScore(readiness),
      concerns: [],
      positiveSignals: [],
      confidence: 0.5, // Low confidence for basic analysis
      explanation: 'Basic keyword-based sentiment analysis (AI analysis failed)',
    };
  }

  /**
   * Normalize sentiment score to -1 to 1 range
   */
  private normalizeSentiment(value: number): number {
    return Math.max(-1, Math.min(1, value));
  }

  /**
   * Normalize score to 0 to 1 range
   */
  private normalizeScore(value: number): number {
    return Math.max(0, Math.min(1, value));
  }
}

export const sentimentAnalyzer = new SentimentAnalyzer();
