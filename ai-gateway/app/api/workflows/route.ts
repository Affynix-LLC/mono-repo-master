import { workflowEngine } from '../../../lib/workflows/engine';
import * as persistence from '../../../lib/workflows/persistence';
import { Workflow } from '../../../lib/workflows/types';
import { requireAuth } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

// GET /api/workflows - List all workflows
export async function GET(req: Request) {
  const authError = requireAuth(req);
  if (authError) return authError;
  try {
    const workflows = await persistence.loadWorkflows();
    return new Response(JSON.stringify({ workflows, count: workflows.length }), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Workflows GET error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST /api/workflows - Create or execute a workflow
export async function POST(req: Request) {
  const authError = requireAuth(req);
  if (authError) return authError;
  
  try {
    const body = await req.json() as { action?: string; workflow?: any; initialData?: any };
    const { action, workflow, initialData } = body;

    if (action === 'execute' && workflow) {
      // Execute an existing workflow
      const execution = await workflowEngine.execute(workflow, initialData);
      return new Response(JSON.stringify({ execution }), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // Create a new workflow
    if (!workflow || !workflow.name || !workflow.steps) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, steps' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newWorkflow: Workflow = {
      id: workflow.id || uuidv4(),
      name: workflow.name,
      description: workflow.description,
      steps: workflow.steps,
      enabled: workflow.enabled !== undefined ? workflow.enabled : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await persistence.createWorkflow(newWorkflow);

    return new Response(JSON.stringify({ workflow: newWorkflow }), {
      status: 201,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Workflows POST error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

