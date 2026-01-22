/**
 * Agent Types and Interfaces
 */

import { Lead, AgentCallSession } from '../types';

export interface AgentCapabilities {
  canQualify: boolean;
  canSchedule: boolean;
  canTransfer: boolean;
  maxCallDuration: number; // seconds
  supportedLanguages: string[];
}

export interface AgentPrompt {
  system: string;
  instructions: string[];
  constraints: string[];
  tools: string[];
}

export interface CallOutcome {
  success: boolean;
  qualified: boolean;
  qualificationScore: number; // 0-100
  sentimentScore: number; // -1 to 1
  summary: string;
  keyPoints: string[];
  nextSteps: string[];
  metadata: Record<string, any>;
}

export interface AgentInterface {
  name: string;
  type: 'agent01' | 'agent02';
  capabilities: AgentCapabilities;

  /**
   * Initialize the agent with configuration
   */
  initialize(config: any): Promise<void>;

  /**
   * Execute a call session with a lead
   */
  executeCall(lead: Lead, session: AgentCallSession): Promise<CallOutcome>;

  /**
   * Get the agent's prompt configuration
   */
  getPrompt(): AgentPrompt;

  /**
   * Validate if a lead is ready for this agent
   */
  validateLead(lead: Lead): { valid: boolean; reason?: string };
}
