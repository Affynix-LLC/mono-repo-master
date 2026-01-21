/**
 * Audit Logger
 *
 * Comprehensive audit logging for the perpetual automation system
 */

import { AuditLog } from '../types';

export class AuditLogger {
  private logs: AuditLog[] = [];
  private storageProvider?: any; // e.g., Airtable, Postgres, MongoDB

  constructor(storageProvider?: any) {
    this.storageProvider = storageProvider;
  }

  /**
   * Log an event
   */
  async log(
    eventType: AuditLog['eventType'],
    entityType: AuditLog['entityType'],
    entityId: string,
    action: string,
    options?: {
      actor?: string;
      before?: any;
      after?: any;
      changes?: Record<string, { old: any; new: any }>;
      context?: Record<string, any>;
      correlationId?: string;
      ipAddress?: string;
      userAgent?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<AuditLog> {
    const auditLog: AuditLog = {
      id: this.generateLogId(),
      timestamp: new Date(),
      eventType,
      entityType,
      entityId,
      action,
      actor: options?.actor || 'system',
      before: options?.before,
      after: options?.after,
      changes: options?.changes,
      context: options?.context,
      correlationId: options?.correlationId,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      metadata: options?.metadata,
    };

    // Store in memory
    this.logs.push(auditLog);

    // Persist to storage if available
    if (this.storageProvider) {
      try {
        await this.storageProvider.store(auditLog);
      } catch (error: any) {
        console.error('Failed to persist audit log:', error.message);
      }
    }

    return auditLog;
  }

  /**
   * Log lead creation
   */
  async logLeadCreated(
    leadId: string,
    leadData: any,
    options?: { source?: string; correlationId?: string }
  ): Promise<AuditLog> {
    return await this.log('lead_created', 'lead', leadId, 'Lead created from ingestion', {
      after: leadData,
      context: { source: options?.source },
      correlationId: options?.correlationId,
    });
  }

  /**
   * Log call scheduled
   */
  async logCallScheduled(
    sessionId: string,
    leadId: string,
    agentType: string,
    scheduledTime: Date,
    options?: { correlationId?: string }
  ): Promise<AuditLog> {
    return await this.log('call_scheduled', 'call_session', sessionId, `${agentType} call scheduled`, {
      after: { leadId, agentType, scheduledTime },
      correlationId: options?.correlationId,
    });
  }

  /**
   * Log call started
   */
  async logCallStarted(
    sessionId: string,
    leadId: string,
    agentType: string,
    options?: { correlationId?: string }
  ): Promise<AuditLog> {
    return await this.log('call_started', 'call_session', sessionId, `${agentType} call started`, {
      after: { leadId, agentType, startedAt: new Date() },
      correlationId: options?.correlationId,
    });
  }

  /**
   * Log call completed
   */
  async logCallCompleted(
    sessionId: string,
    leadId: string,
    agentType: string,
    outcome: any,
    options?: { correlationId?: string }
  ): Promise<AuditLog> {
    return await this.log('call_completed', 'call_session', sessionId, `${agentType} call completed`, {
      after: { leadId, agentType, outcome, completedAt: new Date() },
      correlationId: options?.correlationId,
    });
  }

  /**
   * Log brief generated
   */
  async logBriefGenerated(
    briefId: string,
    leadId: string,
    briefData: any,
    options?: { correlationId?: string }
  ): Promise<AuditLog> {
    return await this.log('brief_generated', 'brief', briefId, 'Executive brief generated', {
      after: briefData,
      context: { leadId },
      correlationId: options?.correlationId,
    });
  }

  /**
   * Log handoff completed
   */
  async logHandoffCompleted(
    leadId: string,
    briefId: string,
    consultantId: string,
    options?: { correlationId?: string }
  ): Promise<AuditLog> {
    return await this.log('handoff_completed', 'lead', leadId, 'Lead handed off to human consultant', {
      after: { briefId, consultantId, handoffAt: new Date() },
      actor: consultantId,
      correlationId: options?.correlationId,
    });
  }

  /**
   * Log status change
   */
  async logStatusChange(
    leadId: string,
    oldStatus: string,
    newStatus: string,
    options?: { reason?: string; correlationId?: string }
  ): Promise<AuditLog> {
    return await this.log('status_changed', 'lead', leadId, 'Lead status changed', {
      before: { status: oldStatus },
      after: { status: newStatus },
      changes: {
        status: { old: oldStatus, new: newStatus },
      },
      context: { reason: options?.reason },
      correlationId: options?.correlationId,
    });
  }

  /**
   * Query logs by entity
   */
  async getLogsByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.logs.filter((log) => log.entityType === entityType && log.entityId === entityId);
  }

  /**
   * Query logs by event type
   */
  async getLogsByEventType(eventType: string): Promise<AuditLog[]> {
    return this.logs.filter((log) => log.eventType === eventType);
  }

  /**
   * Query logs by correlation ID (for tracing related events)
   */
  async getLogsByCorrelationId(correlationId: string): Promise<AuditLog[]> {
    return this.logs.filter((log) => log.correlationId === correlationId);
  }

  /**
   * Query logs by time range
   */
  async getLogsByTimeRange(start: Date, end: Date): Promise<AuditLog[]> {
    return this.logs.filter((log) => log.timestamp >= start && log.timestamp <= end);
  }

  /**
   * Get all logs (paginated)
   */
  async getAllLogs(offset: number = 0, limit: number = 100): Promise<AuditLog[]> {
    return this.logs.slice(offset, offset + limit);
  }

  /**
   * Clear logs (use with caution!)
   */
  async clearLogs(): Promise<void> {
    this.logs = [];
  }

  /**
   * Generate log ID
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get logs count
   */
  getLogsCount(): number {
    return this.logs.length;
  }
}

export const auditLogger = new AuditLogger();
