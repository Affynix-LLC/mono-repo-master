/**
 * Metrics Tracker
 *
 * Tracks and calculates pipeline performance metrics
 */

import { Lead, AgentCallSession, PipelineMetrics } from '../types';

export class MetricsTracker {
  private leads: Map<string, Lead> = new Map();
  private sessions: Map<string, AgentCallSession> = new Map();

  /**
   * Register a lead
   */
  registerLead(lead: Lead): void {
    this.leads.set(lead.id, lead);
  }

  /**
   * Register a call session
   */
  registerSession(session: AgentCallSession): void {
    this.sessions.set(session.id, session);
  }

  /**
   * Update lead status
   */
  updateLeadStatus(leadId: string, newStatus: Lead['status']): void {
    const lead = this.leads.get(leadId);
    if (lead) {
      lead.status = newStatus;
      lead.updatedAt = new Date();
    }
  }

  /**
   * Calculate current pipeline metrics
   */
  calculateMetrics(): PipelineMetrics {
    const allLeads = Array.from(this.leads.values());
    const allSessions = Array.from(this.sessions.values());

    // Count leads by status
    const leadCounts = {
      new: 0,
      agent01_scheduled: 0,
      agent01_completed: 0,
      agent02_scheduled: 0,
      agent02_completed: 0,
      human_ready: 0,
      converted: 0,
      disqualified: 0,
    };

    for (const lead of allLeads) {
      if (leadCounts[lead.status] !== undefined) {
        leadCounts[lead.status]++;
      }
    }

    // Calculate conversion rates
    const agent01Completed = leadCounts.agent01_completed + leadCounts.agent02_scheduled + leadCounts.agent02_completed + leadCounts.human_ready + leadCounts.converted;
    const agent02Completed = leadCounts.agent02_completed + leadCounts.human_ready + leadCounts.converted;
    const humanReady = leadCounts.human_ready + leadCounts.converted;
    const totalLeads = allLeads.length;

    const conversionRates = {
      agent01_to_agent02: agent01Completed > 0 ? (leadCounts.agent02_scheduled + agent02Completed) / agent01Completed * 100 : 0,
      agent02_to_human: agent02Completed > 0 ? humanReady / agent02Completed * 100 : 0,
      human_to_converted: humanReady > 0 ? leadCounts.converted / humanReady * 100 : 0,
      overall: totalLeads > 0 ? (leadCounts.converted / totalLeads) * 100 : 0,
    };

    // Calculate performance metrics
    const completedSessions = allSessions.filter((s) => s.status === 'completed');
    const agent01Sessions = completedSessions.filter((s) => s.agentType === 'agent01');
    const agent02Sessions = completedSessions.filter((s) => s.agentType === 'agent02');

    const avgAgent01Duration =
      agent01Sessions.length > 0
        ? agent01Sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / agent01Sessions.length
        : 0;

    const avgAgent02Duration =
      agent02Sessions.length > 0
        ? agent02Sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / agent02Sessions.length
        : 0;

    // Calculate average buffer time between sessions
    const avgBufferTime = this.calculateAverageBufferTime(allLeads, allSessions);

    // Calculate average time to conversion
    const avgTimeToConversion = this.calculateAverageTimeToConversion(
      allLeads.filter((l) => l.status === 'converted')
    );

    // Calculate quality metrics
    const avgQualificationScore =
      allLeads.filter((l) => l.qualificationScore !== undefined).length > 0
        ? allLeads.reduce((sum, l) => sum + (l.qualificationScore || 0), 0) /
          allLeads.filter((l) => l.qualificationScore !== undefined).length
        : 0;

    const avgSentimentScore = this.calculateAverageSentiment(allSessions);

    const noShowRate =
      allSessions.length > 0
        ? (allSessions.filter((s) => s.status === 'no_show').length / allSessions.length) * 100
        : 0;

    const timeoutRate =
      allSessions.length > 0
        ? (allSessions.filter((s) => s.status === 'timeout').length / allSessions.length) * 100
        : 0;

    return {
      timestamp: new Date(),
      leads: leadCounts,
      conversionRates,
      performance: {
        avgAgent01Duration,
        avgAgent02Duration,
        avgBufferTime,
        avgTimeToConversion,
      },
      quality: {
        avgQualificationScore,
        avgSentimentScore,
        noShowRate,
        timeoutRate,
      },
    };
  }

  /**
   * Calculate average buffer time between agent sessions
   */
  private calculateAverageBufferTime(
    leads: Lead[],
    sessions: AgentCallSession[]
  ): number {
    const bufferTimes: number[] = [];

    for (const lead of leads) {
      const leadSessions = sessions
        .filter((s) => s.leadId === lead.id)
        .sort((a, b) => (a.scheduledAt?.getTime() || 0) - (b.scheduledAt?.getTime() || 0));

      if (leadSessions.length >= 2) {
        for (let i = 1; i < leadSessions.length; i++) {
          const prev = leadSessions[i - 1];
          const current = leadSessions[i];

          if (prev.completedAt && current.scheduledAt) {
            const bufferHours =
              (current.scheduledAt.getTime() - prev.completedAt.getTime()) / (1000 * 60 * 60);
            bufferTimes.push(bufferHours);
          }
        }
      }
    }

    return bufferTimes.length > 0
      ? bufferTimes.reduce((sum, time) => sum + time, 0) / bufferTimes.length
      : 0;
  }

  /**
   * Calculate average time to conversion
   */
  private calculateAverageTimeToConversion(convertedLeads: Lead[]): number {
    if (convertedLeads.length === 0) return 0;

    const conversionTimes = convertedLeads.map((lead) => {
      const days =
        (lead.updatedAt.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return days;
    });

    return conversionTimes.reduce((sum, days) => sum + days, 0) / conversionTimes.length;
  }

  /**
   * Calculate average sentiment score from sessions
   */
  private calculateAverageSentiment(sessions: AgentCallSession[]): number {
    const sessionsWithSentiment = sessions.filter((s) => s.sentimentScore !== undefined);

    if (sessionsWithSentiment.length === 0) return 0;

    const sum = sessionsWithSentiment.reduce((acc, s) => acc + (s.sentimentScore || 0), 0);
    return sum / sessionsWithSentiment.length;
  }

  /**
   * Get metrics for a specific time period
   */
  getMetricsForPeriod(startDate: Date, endDate: Date): PipelineMetrics {
    const periodLeads = Array.from(this.leads.values()).filter(
      (l) => l.createdAt >= startDate && l.createdAt <= endDate
    );

    const periodSessions = Array.from(this.sessions.values()).filter(
      (s) => s.scheduledAt && s.scheduledAt >= startDate && s.scheduledAt <= endDate
    );

    // Temporarily filter the data
    const originalLeads = this.leads;
    const originalSessions = this.sessions;

    this.leads = new Map(periodLeads.map((l) => [l.id, l]));
    this.sessions = new Map(periodSessions.map((s) => [s.id, s]));

    const metrics = this.calculateMetrics();

    // Restore original data
    this.leads = originalLeads;
    this.sessions = originalSessions;

    return metrics;
  }

  /**
   * Get lead by ID
   */
  getLead(leadId: string): Lead | undefined {
    return this.leads.get(leadId);
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): AgentCallSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all sessions for a lead
   */
  getLeadSessions(leadId: string): AgentCallSession[] {
    return Array.from(this.sessions.values()).filter((s) => s.leadId === leadId);
  }

  /**
   * Clear all data (use with caution!)
   */
  clearAll(): void {
    this.leads.clear();
    this.sessions.clear();
  }

  /**
   * Get counts
   */
  getCounts(): { leads: number; sessions: number } {
    return {
      leads: this.leads.size,
      sessions: this.sessions.size,
    };
  }
}

export const metricsTracker = new MetricsTracker();
