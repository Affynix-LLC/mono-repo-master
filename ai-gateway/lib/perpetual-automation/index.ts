/**
 * Affynix Perpetual Automation System
 *
 * Export all components
 */

// Main orchestrator
export { PerpetualAutomationOrchestrator, default as Orchestrator } from './orchestrator';

// Types
export * from './types';

// Agents
export { agent01 } from './agents/agent01-intake';
export { agent02 } from './agents/agent02-discovery';
export type { AgentInterface, CallOutcome } from './agents/types';

// Ingestion
export { ingestionRouter } from './ingestion/router';
export { emailHandler } from './ingestion/email-handler';
export { crmHandler } from './ingestion/crm-handler';
export { linkedinHandler } from './ingestion/linkedin-handler';
export { webhookHandler } from './ingestion/webhook-handler';

// Scheduling
export { bufferScheduler } from './scheduling/buffer-scheduler';
export { callLimiter } from './scheduling/call-limiter';
export type { SchedulingWindow, SchedulingResult } from './scheduling/buffer-scheduler';
export type { CallLimitStatus } from './scheduling/call-limiter';

// Brief Generation
export { briefGenerator } from './brief-generator/generator';
export { sentimentAnalyzer } from './brief-generator/sentiment-analysis';
export type { SentimentAnalysis } from './brief-generator/sentiment-analysis';

// Monitoring
export { auditLogger } from './monitoring/audit-logger';
export { metricsTracker } from './monitoring/metrics';

// Workflows
export {
  salesFunnelWorkflow,
  disqualifiedLeadWorkflow,
  emergencyEscalationWorkflow,
} from './workflows/sales-funnel';

/**
 * Quick-start function to create and initialize orchestrator
 */
import PerpetualAutomationOrchestrator from './orchestrator';
import { OrchestratorConfig } from './types';

export async function createOrchestrator(
  config: OrchestratorConfig
): Promise<PerpetualAutomationOrchestrator> {
  const orchestrator = new PerpetualAutomationOrchestrator(config);
  await orchestrator.initialize();
  return orchestrator;
}

/**
 * Default configuration
 */
export const defaultConfig: OrchestratorConfig = {
  scheduling: {
    minBufferHours: 24,
    maxBufferHours: 48,
    maxCallDurationMinutes: 5,
    businessHoursStart: 9,
    businessHoursEnd: 17,
    allowedDays: [1, 2, 3, 4, 5], // Monday-Friday
    timezone: 'America/New_York',
    maxRescheduleAttempts: 3,
    rescheduleDelayHours: 24,
  },
  integrations: {
    email: {
      enabled: false,
      provider: 'sendgrid',
      config: {},
    },
    crm: {
      enabled: false,
      provider: 'hubspot',
      config: {},
    },
    linkedin: {
      enabled: false,
      config: {},
    },
    zapier: {
      enabled: false,
    },
  },
  ai: {
    provider: 'openai',
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
  },
  storage: {
    provider: 'airtable',
    config: {},
  },
  monitoring: {
    enabled: true,
    metricsInterval: 3600, // 1 hour
    alertThresholds: {
      noShowRate: 20, // 20%
      timeoutRate: 10, // 10%
      minQualificationScore: 50,
    },
  },
};
