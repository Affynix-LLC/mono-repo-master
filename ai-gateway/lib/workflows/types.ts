export type WorkflowStepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  type: 'prompt' | 'tool' | 'webhook' | 'workflow';
  config: any;
  dependsOn?: string[]; // IDs of steps that must complete before this step
  retry?: {
    maxAttempts: number;
    delay: number; // milliseconds
  };
}

export interface Workflow {
  id: string;
  name: string;
  version?: string;
  description?: string;
  steps: WorkflowStep[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  stepStatuses: Map<string, WorkflowStepStatus>;
  results: Map<string, any>;
  errors: Map<string, string>;
  startedAt: Date;
  completedAt?: Date;
}

