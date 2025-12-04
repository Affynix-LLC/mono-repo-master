export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'paused';

export interface Agent {
  id: string;
  name: string;
  type: 'content' | 'data' | 'integration' | 'workflow';
  status: AgentStatus;
  config: any;
  lastRun?: Date;
  runCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentTask {
  agentId: string;
  task: string;
  parameters: any;
  priority?: number;
}

export interface AgentExecutionResult {
  agentId: string;
  success: boolean;
  result?: any;
  error?: string;
  executedAt: Date;
  duration: number; // milliseconds
}

