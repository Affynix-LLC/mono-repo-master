/**
 * Perpetual Automation Orchestrator
 *
 * Main orchestrator for the Affynix multi-agent sales funnel
 * Manages the complete lead lifecycle from ingestion to human handoff
 */

import {
  Lead,
  AgentCallSession,
  Agent01Session,
  Agent02Session,
  ExecutiveBrief,
  OrchestratorConfig,
} from './types';

// Import components
import { ingestionRouter } from './ingestion/router';
import { agent01 } from './agents/agent01-intake';
import { agent02 } from './agents/agent02-discovery';
import { bufferScheduler } from './scheduling/buffer-scheduler';
import { callLimiter } from './scheduling/call-limiter';
import { briefGenerator } from './brief-generator/generator';
import { auditLogger } from './monitoring/audit-logger';
import { metricsTracker } from './monitoring/metrics';

export class PerpetualAutomationOrchestrator {
  private config: OrchestratorConfig;
  private initialized: boolean = false;

  constructor(config: OrchestratorConfig) {
    this.config = config;
  }

  /**
   * Initialize the orchestrator
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      throw new Error('Orchestrator already initialized');
    }

    // Initialize agents
    await agent01.initialize(this.config.ai);
    await agent02.initialize(this.config.ai);

    // Configure scheduler
    bufferScheduler.updateConfig(this.config.scheduling);

    // Configure call limiter
    callLimiter.updateConfig({
      maxDurationSeconds: this.config.scheduling.maxCallDurationMinutes * 60,
    });

    this.initialized = true;

    await auditLogger.log('status_changed', 'lead', 'system', 'Orchestrator initialized', {
      after: { initialized: true, timestamp: new Date() },
    });
  }

  /**
   * Ingest a new lead
   */
  async ingestLead(
    sourceType: 'email' | 'crm' | 'linkedin' | 'webhook',
    data: any
  ): Promise<{ success: boolean; lead?: Lead; error?: string }> {
    this.ensureInitialized();

    const correlationId = this.generateCorrelationId();

    try {
      // Ingest lead through appropriate handler
      const result = await ingestionRouter.ingest(sourceType, data);

      if (!result.success || !result.lead) {
        return {
          success: false,
          error: result.error || 'Lead ingestion failed',
        };
      }

      const lead = result.lead;

      // Register with metrics tracker
      metricsTracker.registerLead(lead);

      // Log lead creation
      await auditLogger.logLeadCreated(lead.id, lead, {
        source: sourceType,
        correlationId,
      });

      // Automatically schedule Agent01 call
      await this.scheduleAgent01Call(lead, correlationId);

      return {
        success: true,
        lead,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Lead ingestion failed: ${error.message}`,
      };
    }
  }

  /**
   * Schedule Agent01 (intake) call
   */
  async scheduleAgent01Call(
    lead: Lead,
    correlationId?: string
  ): Promise<{ success: boolean; session?: Agent01Session; error?: string }> {
    this.ensureInitialized();

    try {
      // Create session
      const session: Agent01Session = {
        id: this.generateSessionId(),
        leadId: lead.id,
        agentType: 'agent01',
        scheduledAt: this.getNextAvailableSlot(),
        maxDuration: this.config.scheduling.maxCallDurationMinutes * 60,
        status: 'scheduled',
      };

      // Register session
      metricsTracker.registerSession(session);

      // Log scheduling
      await auditLogger.logCallScheduled(
        session.id,
        lead.id,
        'agent01',
        session.scheduledAt,
        { correlationId }
      );

      // Update lead status
      lead.status = 'agent01_scheduled';
      metricsTracker.updateLeadStatus(lead.id, 'agent01_scheduled');

      await auditLogger.logStatusChange(lead.id, 'new', 'agent01_scheduled', {
        reason: 'Agent01 call scheduled',
        correlationId,
      });

      return {
        success: true,
        session,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to schedule Agent01 call: ${error.message}`,
      };
    }
  }

  /**
   * Execute Agent01 call
   */
  async executeAgent01Call(
    sessionId: string
  ): Promise<{ success: boolean; outcome?: any; error?: string }> {
    this.ensureInitialized();

    const correlationId = this.generateCorrelationId();

    try {
      const session = metricsTracker.getSession(sessionId) as Agent01Session;
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const lead = metricsTracker.getLead(session.leadId);
      if (!lead) {
        throw new Error(`Lead ${session.leadId} not found`);
      }

      // Update session status
      session.status = 'in_progress';
      session.startedAt = new Date();

      await auditLogger.logCallStarted(sessionId, lead.id, 'agent01', { correlationId });

      // Start call limiter
      callLimiter.startSession(session, undefined, async (status) => {
        session.status = 'timeout';
        await auditLogger.log('call_completed', 'call_session', sessionId, 'Agent01 call timed out', {
          after: { status: 'timeout', duration: status.elapsed },
          correlationId,
        });
      });

      // Execute call
      const outcome = await agent01.executeCall(lead, session);

      // Stop call limiter
      callLimiter.endSession(sessionId);

      // Update session with outcome
      session.status = 'completed';
      session.completedAt = new Date();
      session.duration = Math.floor(
        (session.completedAt.getTime() - session.startedAt.getTime()) / 1000
      );
      session.summary = outcome.summary;
      session.keyPoints = outcome.keyPoints;
      session.qualificationDecision = outcome.qualified ? 'qualified' : 'disqualified';
      session.sentimentScore = outcome.sentimentScore;

      // Update lead
      lead.qualificationScore = outcome.qualificationScore;
      lead.status = 'agent01_completed';
      metricsTracker.updateLeadStatus(lead.id, 'agent01_completed');

      await auditLogger.logCallCompleted(sessionId, lead.id, 'agent01', outcome, { correlationId });
      await auditLogger.logStatusChange(lead.id, 'agent01_scheduled', 'agent01_completed', {
        reason: 'Agent01 call completed',
        correlationId,
      });

      // Schedule Agent02 if qualified
      if (outcome.qualified && outcome.metadata.recommendAgent02) {
        await this.scheduleAgent02Call(lead, session, correlationId);
      }

      return {
        success: true,
        outcome,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Agent01 call failed: ${error.message}`,
      };
    }
  }

  /**
   * Schedule Agent02 (discovery) call with 24-48hr buffer
   */
  async scheduleAgent02Call(
    lead: Lead,
    agent01Session: Agent01Session,
    correlationId?: string
  ): Promise<{ success: boolean; session?: Agent02Session; error?: string }> {
    this.ensureInitialized();

    try {
      // Calculate scheduling window (24-48hr after Agent01)
      const schedulingResult = await bufferScheduler.scheduleNext(
        lead,
        agent01Session,
        'agent02'
      );

      if (!schedulingResult.success || !schedulingResult.scheduledTime) {
        return {
          success: false,
          error: schedulingResult.error || 'Failed to find available slot',
        };
      }

      // Create session
      const session: Agent02Session = {
        id: this.generateSessionId(),
        leadId: lead.id,
        agentType: 'agent02',
        scheduledAt: schedulingResult.scheduledTime,
        maxDuration: this.config.scheduling.maxCallDurationMinutes * 60,
        status: 'scheduled',
      };

      // Register session
      metricsTracker.registerSession(session);

      // Log scheduling
      await auditLogger.logCallScheduled(
        session.id,
        lead.id,
        'agent02',
        session.scheduledAt,
        { correlationId }
      );

      // Update lead status
      lead.status = 'agent02_scheduled';
      metricsTracker.updateLeadStatus(lead.id, 'agent02_scheduled');

      await auditLogger.logStatusChange(lead.id, 'agent01_completed', 'agent02_scheduled', {
        reason: 'Agent02 call scheduled with 24-48hr buffer',
        correlationId,
      });

      return {
        success: true,
        session,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to schedule Agent02 call: ${error.message}`,
      };
    }
  }

  /**
   * Execute Agent02 call
   */
  async executeAgent02Call(
    sessionId: string
  ): Promise<{ success: boolean; outcome?: any; error?: string }> {
    this.ensureInitialized();

    const correlationId = this.generateCorrelationId();

    try {
      const session = metricsTracker.getSession(sessionId) as Agent02Session;
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const lead = metricsTracker.getLead(session.leadId);
      if (!lead) {
        throw new Error(`Lead ${session.leadId} not found`);
      }

      // Update session status
      session.status = 'in_progress';
      session.startedAt = new Date();

      await auditLogger.logCallStarted(sessionId, lead.id, 'agent02', { correlationId });

      // Start call limiter
      callLimiter.startSession(session, undefined, async (status) => {
        session.status = 'timeout';
        await auditLogger.log('call_completed', 'call_session', sessionId, 'Agent02 call timed out', {
          after: { status: 'timeout', duration: status.elapsed },
          correlationId,
        });
      });

      // Execute call
      const outcome = await agent02.executeCall(lead, session);

      // Stop call limiter
      callLimiter.endSession(sessionId);

      // Update session with outcome
      session.status = 'completed';
      session.completedAt = new Date();
      session.duration = Math.floor(
        (session.completedAt.getTime() - session.startedAt.getTime()) / 1000
      );
      session.summary = outcome.summary;
      session.keyPoints = outcome.keyPoints;
      session.qualificationDecision = outcome.qualified ? 'qualified' : 'disqualified';
      session.sentimentScore = outcome.sentimentScore;

      // Update lead
      lead.qualificationScore = outcome.qualificationScore;
      lead.status = 'agent02_completed';
      metricsTracker.updateLeadStatus(lead.id, 'agent02_completed');

      await auditLogger.logCallCompleted(sessionId, lead.id, 'agent02', outcome, { correlationId });
      await auditLogger.logStatusChange(lead.id, 'agent02_scheduled', 'agent02_completed', {
        reason: 'Agent02 call completed',
        correlationId,
      });

      // Generate executive brief and prepare for human handoff
      if (outcome.qualified && outcome.metadata.readyForHuman) {
        await this.prepareHumanHandoff(lead, correlationId);
      }

      return {
        success: true,
        outcome,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Agent02 call failed: ${error.message}`,
      };
    }
  }

  /**
   * Prepare lead for human handoff
   */
  async prepareHumanHandoff(
    lead: Lead,
    correlationId?: string
  ): Promise<{ success: boolean; brief?: ExecutiveBrief; error?: string }> {
    this.ensureInitialized();

    try {
      // Get agent sessions
      const sessions = metricsTracker.getLeadSessions(lead.id);
      const agent01Session = sessions.find((s) => s.agentType === 'agent01') as Agent01Session;
      const agent02Session = sessions.find((s) => s.agentType === 'agent02') as Agent02Session;

      // Generate executive brief
      const brief = await briefGenerator.generate(lead, agent01Session, agent02Session);

      // Log brief generation
      await auditLogger.logBriefGenerated(brief.id, lead.id, brief, { correlationId });

      // Update lead status
      lead.status = 'human_ready';
      metricsTracker.updateLeadStatus(lead.id, 'human_ready');

      await auditLogger.logStatusChange(lead.id, 'agent02_completed', 'human_ready', {
        reason: 'Executive brief generated, ready for human consultation',
        correlationId,
      });

      return {
        success: true,
        brief,
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to prepare human handoff: ${error.message}`,
      };
    }
  }

  /**
   * Get pipeline metrics
   */
  getMetrics() {
    return metricsTracker.calculateMetrics();
  }

  /**
   * Get audit logs
   */
  getAuditLogs(options?: { entityId?: string; eventType?: string; correlationId?: string }) {
    if (options?.correlationId) {
      return auditLogger.getLogsByCorrelationId(options.correlationId);
    }
    if (options?.entityId) {
      return auditLogger.getLogsByEntity('lead', options.entityId);
    }
    if (options?.eventType) {
      return auditLogger.getLogsByEventType(options.eventType);
    }
    return auditLogger.getAllLogs();
  }

  /**
   * Get lead by ID
   */
  getLead(leadId: string): Lead | undefined {
    return metricsTracker.getLead(leadId);
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): AgentCallSession | undefined {
    return metricsTracker.getSession(sessionId);
  }

  /**
   * Helper: Ensure orchestrator is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Orchestrator not initialized. Call initialize() first.');
    }
  }

  /**
   * Helper: Generate correlation ID for tracing
   */
  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Helper: Generate session ID
   */
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Helper: Get next available slot (simplified - can be enhanced)
   */
  private getNextAvailableSlot(): Date {
    const now = new Date();
    // Schedule for next business hour
    now.setHours(now.getHours() + 1);
    return now;
  }
}

export default PerpetualAutomationOrchestrator;
