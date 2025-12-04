import { Workflow, WorkflowExecution, WorkflowStep, WorkflowStepStatus } from './types';
import { route } from '../../router';
import { toolRegistry } from '../tools/registry';
import axios from 'axios';

export class WorkflowEngine {
  async execute(workflow: Workflow, initialData?: any): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      id: `${workflow.id}-${Date.now()}`,
      workflowId: workflow.id,
      status: 'running',
      stepStatuses: new Map(),
      results: new Map(),
      errors: new Map(),
      startedAt: new Date(),
    };

    // Initialize all steps as pending
    for (const step of workflow.steps) {
      execution.stepStatuses.set(step.id, 'pending');
    }

    try {
      const executedSteps = new Set<string>();
      let context: any = initialData || {};

      // Execute steps in dependency order
      while (executedSteps.size < workflow.steps.length) {
        let progressMade = false;

        for (const step of workflow.steps) {
          // Skip if already executed
          if (executedSteps.has(step.id)) {
            continue;
          }

          // Check if dependencies are met
          if (step.dependsOn && step.dependsOn.length > 0) {
            const allDepsMet = step.dependsOn.every((depId) => {
              const status = execution.stepStatuses.get(depId);
              return status === 'completed';
            });

            if (!allDepsMet) {
              continue; // Skip this step, dependencies not met
            }
          }

          // Execute step
          execution.stepStatuses.set(step.id, 'running');
          progressMade = true;

          try {
            const result = await this.executeStep(step, context);
            execution.results.set(step.id, result);
            execution.stepStatuses.set(step.id, 'completed');
            context[step.id] = result;
            executedSteps.add(step.id);
          } catch (error: any) {
            // Handle retries
            const retryCount = (execution.errors.get(`${step.id}_retries`) || 0) as number;
            const maxRetries = step.retry?.maxAttempts || 0;

            if (retryCount < maxRetries) {
              execution.errors.set(`${step.id}_retries`, String(retryCount + 1));
              execution.stepStatuses.set(step.id, 'pending');
              
              // Wait before retry
              if (step.retry?.delay) {
                await new Promise((resolve) => setTimeout(resolve, step.retry.delay));
              }
              continue; // Retry this step
            } else {
              execution.stepStatuses.set(step.id, 'failed');
              execution.errors.set(step.id, error.message);
              executedSteps.add(step.id); // Mark as executed (failed)
            }
          }
        }

        // Check for deadlock (no progress made but steps remaining)
        if (!progressMade && executedSteps.size < workflow.steps.length) {
          const pendingSteps = workflow.steps.filter(
            (s) => !executedSteps.has(s.id)
          );
          for (const step of pendingSteps) {
            execution.stepStatuses.set(step.id, 'failed');
            execution.errors.set(
              step.id,
              'Step dependencies could not be satisfied'
            );
          }
          break;
        }
      }

      // Determine final status
      const hasFailures = Array.from(execution.stepStatuses.values()).some(
        (status) => status === 'failed'
      );
      execution.status = hasFailures ? 'failed' : 'completed';
      execution.completedAt = new Date();

      return execution;
    } catch (error: any) {
      execution.status = 'failed';
      execution.completedAt = new Date();
      execution.errors.set('workflow', error.message);
      return execution;
    }
  }

  private async executeStep(step: WorkflowStep, context: any): Promise<any> {
    switch (step.type) {
      case 'prompt':
        const prompt = this.interpolateContext(step.config.prompt, context);
        const result = await route(prompt);
        return result.text;

      case 'tool':
        const toolName = step.config.tool;
        const toolArgs = this.interpolateContext(step.config.args || {}, context);
        const toolResult = await toolRegistry.execute(toolName, toolArgs);
        if (!toolResult.success) {
          throw new Error(toolResult.error || 'Tool execution failed');
        }
        return toolResult.data;

      case 'webhook':
        const webhookUrl = step.config.url;
        const webhookData = this.interpolateContext(step.config.data || {}, context);
        const webhookHeaders = step.config.headers || {};
        const webhookResult = await axios.post(webhookUrl, webhookData, {
          headers: webhookHeaders,
        });
        return webhookResult.data;

      case 'workflow':
        // Nested workflow execution - would need workflow registry
        throw new Error('Nested workflows not yet implemented');

      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  private interpolateContext(template: any, context: any): any {
    if (typeof template === 'string') {
      // Simple template interpolation: {{stepId.field}}
      return template.replace(/\{\{(\w+)(?:\.(\w+))?\}\}/g, (match, stepId, field) => {
        const stepData = context[stepId];
        if (!stepData) {
          return match; // Return original if not found
        }
        return field ? stepData[field] : stepData;
      });
    } else if (Array.isArray(template)) {
      return template.map((item) => this.interpolateContext(item, context));
    } else if (typeof template === 'object' && template !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(template)) {
        result[key] = this.interpolateContext(value, context);
      }
      return result;
    }
    return template;
  }
}

export const workflowEngine = new WorkflowEngine();

