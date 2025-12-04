import cron from 'node-cron';
import cronParser from 'node-cron';
import { ScheduledTask, TaskExecutionResult } from './types';
import * as persistence from './persistence';
import { route } from '../../router';
import axios from 'axios';
import { workflowEngine } from '../workflows/engine';
import * as workflowPersistence from '../workflows/persistence';

class TaskQueue {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  async loadAndSchedule(): Promise<void> {
    const tasks = await persistence.loadTasks();
    for (const task of tasks) {
      if (task.enabled) {
        this.scheduleTask(task);
      }
    }
  }

  scheduleTask(task: ScheduledTask): void {
    // Remove existing job if present
    this.unscheduleTask(task.id);

    if (!task.enabled) {
      return;
    }

    const job = cron.schedule(task.cronExpression, async () => {
      await this.executeTask(task);
    });

    this.jobs.set(task.id, job);
  }

  unscheduleTask(taskId: string): void {
    const job = this.jobs.get(taskId);
    if (job) {
      job.stop();
      this.jobs.delete(taskId);
    }
  }

  async executeTask(task: ScheduledTask): Promise<TaskExecutionResult> {
    const result: TaskExecutionResult = {
      taskId: task.id,
      success: false,
      executedAt: new Date(),
    };

    try {
      let executionResult: any;

      switch (task.action.type) {
        case 'prompt':
          const promptResult = await route(task.action.config.prompt);
          executionResult = promptResult.text;
          break;

        case 'webhook':
          const webhookResult = await axios.post(
            task.action.config.url,
            task.action.config.data || {},
            {
              headers: task.action.config.headers || {},
            }
          );
          executionResult = webhookResult.data;
          break;

        case 'workflow':
          // Execute workflow
          const workflowId = task.action.config.workflowId;
          if (!workflowId) {
            throw new Error('workflowId is required for workflow action');
          }
          
          const workflow = await workflowPersistence.getWorkflow(workflowId);
          if (!workflow) {
            throw new Error(`Workflow ${workflowId} not found`);
          }
          
          const initialData = task.action.config.initialData || {};
          const workflowExecution = await workflowEngine.execute(workflow, initialData);
          executionResult = workflowExecution;
          break;

        default:
          throw new Error(`Unknown action type: ${task.action.type}`);
      }

      result.success = true;
      result.result = executionResult;

      // Update task last run
      await persistence.updateTask(task.id, {
        lastRun: new Date(),
        nextRun: this.getNextRunTime(task.cronExpression),
        runCount: task.runCount + 1,
      });
    } catch (error: any) {
      result.error = error.message;
    }

    return result;
  }

  private getNextRunTime(cronExpression: string): Date | null {
    const schedule = cronParser.parseExpression(cronExpression);
    return schedule.next().toDate();
  }
}

export const taskQueue = new TaskQueue();

