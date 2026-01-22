/**
 * Call Limiter
 *
 * Enforces call duration limits (default 5 minutes)
 */

import { AgentCallSession } from '../types';

export interface CallLimitConfig {
  maxDurationSeconds: number;
  warningThresholdPercent: number; // e.g., 80 = warn at 80% of max duration
  gracePeriodSeconds: number; // Grace period after limit before force timeout
}

export interface CallLimitStatus {
  sessionId: string;
  startedAt: Date;
  maxDuration: number;
  elapsed: number;
  remaining: number;
  percentUsed: number;
  isWarning: boolean;
  isExpired: boolean;
  isGracePeriod: boolean;
}

export class CallLimiter {
  private activeSessions: Map<string, NodeJS.Timeout> = new Map();
  private config: CallLimitConfig;

  constructor(config?: Partial<CallLimitConfig>) {
    this.config = {
      maxDurationSeconds: config?.maxDurationSeconds ?? 300, // 5 minutes
      warningThresholdPercent: config?.warningThresholdPercent ?? 80,
      gracePeriodSeconds: config?.gracePeriodSeconds ?? 30,
    };
  }

  /**
   * Start monitoring a call session
   */
  startSession(
    session: AgentCallSession,
    onWarning?: (status: CallLimitStatus) => void,
    onTimeout?: (status: CallLimitStatus) => void
  ): void {
    if (this.activeSessions.has(session.id)) {
      throw new Error(`Session ${session.id} is already being monitored`);
    }

    const maxDuration = session.maxDuration || this.config.maxDurationSeconds;

    // Set warning timer
    const warningTime = maxDuration * (this.config.warningThresholdPercent / 100);
    const warningTimer = setTimeout(() => {
      if (onWarning) {
        const status = this.getStatus(session.id, session);
        onWarning(status);
      }
    }, warningTime * 1000);

    // Set timeout timer
    const timeoutTimer = setTimeout(() => {
      if (onTimeout) {
        const status = this.getStatus(session.id, session);
        onTimeout(status);
      }
      this.endSession(session.id);
    }, (maxDuration + this.config.gracePeriodSeconds) * 1000);

    // Store both timers
    this.activeSessions.set(session.id, timeoutTimer);
  }

  /**
   * End session monitoring
   */
  endSession(sessionId: string): void {
    const timer = this.activeSessions.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.activeSessions.delete(sessionId);
    }
  }

  /**
   * Get current status of a session
   */
  getStatus(sessionId: string, session: AgentCallSession): CallLimitStatus {
    if (!session.startedAt) {
      throw new Error('Session has not started yet');
    }

    const now = new Date();
    const elapsed = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);
    const maxDuration = session.maxDuration || this.config.maxDurationSeconds;
    const remaining = Math.max(0, maxDuration - elapsed);
    const percentUsed = Math.min(100, (elapsed / maxDuration) * 100);
    const isWarning = percentUsed >= this.config.warningThresholdPercent;
    const isExpired = elapsed >= maxDuration;
    const isGracePeriod =
      elapsed >= maxDuration && elapsed < maxDuration + this.config.gracePeriodSeconds;

    return {
      sessionId,
      startedAt: session.startedAt,
      maxDuration,
      elapsed,
      remaining,
      percentUsed,
      isWarning,
      isExpired,
      isGracePeriod,
    };
  }

  /**
   * Check if a session has exceeded its time limit
   */
  isExpired(sessionId: string, session: AgentCallSession): boolean {
    const status = this.getStatus(sessionId, session);
    return status.isExpired;
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): string[] {
    return Array.from(this.activeSessions.keys());
  }

  /**
   * Force timeout all active sessions
   */
  timeoutAll(): void {
    for (const sessionId of this.activeSessions.keys()) {
      this.endSession(sessionId);
    }
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<CallLimitConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Get current configuration
   */
  getConfig(): CallLimitConfig {
    return { ...this.config };
  }
}

export const callLimiter = new CallLimiter();
