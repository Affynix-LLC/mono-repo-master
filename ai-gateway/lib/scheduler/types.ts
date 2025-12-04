export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  enabled: boolean;
  action: {
    type: 'prompt' | 'webhook' | 'workflow';
    config: any;
  };
  lastRun?: Date;
  nextRun?: Date;
  runCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskExecutionResult {
  taskId: string;
  success: boolean;
  executedAt: Date;
  result?: any;
  error?: string;
}

