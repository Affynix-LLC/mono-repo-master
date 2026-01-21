/**
 * Affynix Perpetual Automation System - Core Types
 *
 * Multi-agent sales funnel with timing constraints and executive brief generation
 */

export interface Lead {
  id: string;
  source: 'email' | 'crm' | 'linkedin' | 'webhook' | 'form';
  sourceId?: string;

  // Contact Information
  name: string;
  email: string;
  phone?: string;
  company?: string;
  linkedinUrl?: string;

  // Business Context
  industry?: string;
  companySize?: string;
  revenue?: string;
  challenges?: string[];
  goals?: string[];

  // Lead Status
  status: 'new' | 'agent01_scheduled' | 'agent01_completed' | 'agent02_scheduled' | 'agent02_completed' | 'human_ready' | 'converted' | 'disqualified';
  qualificationScore?: number; // 0-100

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface AgentCallSession {
  id: string;
  leadId: string;
  agentType: 'agent01' | 'agent02';

  // Call Details
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // seconds
  maxDuration: number; // seconds (default 300 = 5 minutes)

  // Call Content
  transcript?: string;
  summary?: string;
  keyPoints?: string[];
  nextSteps?: string[];

  // Outcomes
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'timeout' | 'no_show';
  qualificationDecision?: 'qualified' | 'disqualified' | 'needs_more_info';
  sentimentScore?: number; // -1 to 1 (negative to positive)

  // Metadata
  recording?: string; // URL to call recording
  notes?: string;
  metadata?: Record<string, any>;
}

export interface Agent01Session extends AgentCallSession {
  agentType: 'agent01';

  // Intake-specific fields
  businessNeeds?: string[];
  budgetRange?: string;
  timeline?: string;
  decisionMakers?: string[];
  painPoints?: string[];
}

export interface Agent02Session extends AgentCallSession {
  agentType: 'agent02';

  // Discovery-specific fields
  technicalRequirements?: string[];
  currentSystems?: string[];
  integrationNeeds?: string[];
  complianceRequirements?: string[];
  successMetrics?: string[];
  detailedPainPoints?: Record<string, any>;
}

export interface ExecutiveBrief {
  id: string;
  leadId: string;

  // Summary
  executiveSummary: string;
  recommendedAction: 'proceed' | 'nurture' | 'disqualify';
  confidenceScore: number; // 0-100

  // Lead Profile
  leadProfile: {
    company: string;
    contact: string;
    industry: string;
    size: string;
    revenue?: string;
  };

  // Opportunity Analysis
  opportunity: {
    estimatedValue: number;
    timeline: string;
    probability: number; // 0-100
    dealSize: 'small' | 'medium' | 'large' | 'enterprise';
  };

  // Insights from Agent Calls
  agent01Summary?: string;
  agent02Summary?: string;

  // Sentiment Analysis
  sentiment: {
    overall: number; // -1 to 1
    engagement: number; // 0-1 (how engaged they were)
    urgency: number; // 0-1 (how urgent is their need)
    readiness: number; // 0-1 (how ready to buy)
    concerns: string[];
    positiveSignals: string[];
  };

  // Key Findings
  keyFindings: {
    strengths: string[];
    concerns: string[];
    blockers: string[];
    opportunities: string[];
  };

  // Next Steps
  nextSteps: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };

  // Prepared Materials
  proposalOutline?: string;
  talkingPoints?: string[];
  questionsToAsk?: string[];

  // Metadata
  createdAt: Date;
  createdBy: 'system';
  version: number;
}

export interface SchedulingConstraints {
  // Buffer between agent calls
  minBufferHours: number; // default 24
  maxBufferHours: number; // default 48

  // Call duration limits
  maxCallDurationMinutes: number; // default 5

  // Business hours
  businessHoursStart: number; // hour (0-23)
  businessHoursEnd: number; // hour (0-23)
  allowedDays: number[]; // 0-6 (Sunday-Saturday)
  timezone: string; // IANA timezone

  // Retry logic
  maxRescheduleAttempts: number;
  rescheduleDelayHours: number;
}

export interface PipelineMetrics {
  timestamp: Date;

  // Lead counts by status
  leads: {
    new: number;
    agent01_scheduled: number;
    agent01_completed: number;
    agent02_scheduled: number;
    agent02_completed: number;
    human_ready: number;
    converted: number;
    disqualified: number;
  };

  // Conversion rates
  conversionRates: {
    agent01_to_agent02: number; // percentage
    agent02_to_human: number;
    human_to_converted: number;
    overall: number;
  };

  // Performance metrics
  performance: {
    avgAgent01Duration: number; // seconds
    avgAgent02Duration: number;
    avgBufferTime: number; // hours
    avgTimeToConversion: number; // days
  };

  // Quality metrics
  quality: {
    avgQualificationScore: number;
    avgSentimentScore: number;
    noShowRate: number; // percentage
    timeoutRate: number;
  };
}

export interface AuditLog {
  id: string;
  timestamp: Date;

  // Event details
  eventType: 'lead_created' | 'call_scheduled' | 'call_started' | 'call_completed' | 'brief_generated' | 'handoff_completed' | 'status_changed';
  entityType: 'lead' | 'call_session' | 'brief';
  entityId: string;

  // Action details
  action: string;
  actor: 'system' | 'agent01' | 'agent02' | 'human' | string;

  // Changes
  before?: any;
  after?: any;
  changes?: Record<string, { old: any; new: any }>;

  // Context
  context?: Record<string, any>;
  correlationId?: string; // For tracing related events

  // Metadata
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface OrchestratorConfig {
  scheduling: SchedulingConstraints;

  // Integration endpoints
  integrations: {
    email?: {
      enabled: boolean;
      provider: 'sendgrid' | 'ses' | 'smtp';
      config: Record<string, any>;
    };
    crm?: {
      enabled: boolean;
      provider: 'salesforce' | 'hubspot' | 'pipedrive' | 'custom';
      config: Record<string, any>;
    };
    linkedin?: {
      enabled: boolean;
      apiKey?: string;
      config: Record<string, any>;
    };
    zapier?: {
      enabled: boolean;
      webhookUrl?: string;
    };
  };

  // AI Configuration
  ai: {
    provider: 'openai' | 'anthropic';
    model: string;
    maxTokens: number;
    temperature: number;
  };

  // Storage
  storage: {
    provider: 'airtable' | 'postgres' | 'mongodb';
    config: Record<string, any>;
  };

  // Monitoring
  monitoring: {
    enabled: boolean;
    metricsInterval: number; // seconds
    alertThresholds: {
      noShowRate: number; // percentage
      timeoutRate: number;
      minQualificationScore: number;
    };
  };
}
