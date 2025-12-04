import { workflowEngine } from '../workflows/engine';
import * as workflowPersistence from '../workflows/persistence';

export class WorkflowAgent {
  async execute(task: string, parameters: any): Promise<any> {
    switch (task) {
      case 'execute_workflow':
        const workflowId = parameters.workflowId;
        if (!workflowId) {
          throw new Error('workflowId is required');
        }
        const workflow = await workflowPersistence.getWorkflow(workflowId);
        if (!workflow) {
          throw new Error(`Workflow ${workflowId} not found`);
        }
        return workflowEngine.execute(workflow, parameters.initialData);
      case 'create_workflow':
        // Create workflow from parameters
        const newWorkflow = {
          id: parameters.id,
          name: parameters.name,
          description: parameters.description,
          steps: parameters.steps,
          enabled: parameters.enabled !== undefined ? parameters.enabled : true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await workflowPersistence.createWorkflow(newWorkflow);
        return newWorkflow;
      default:
        throw new Error(`Unknown workflow task: ${task}`);
    }
  }
}

export const workflowAgent = new WorkflowAgent();

