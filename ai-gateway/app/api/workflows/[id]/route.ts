import { workflowEngine } from '../../../../lib/workflows/engine';
import * as persistence from '../../../../lib/workflows/persistence';
import { requireAuth } from '../../../../lib/auth';
import { Workflow } from '../../../../lib/workflows/types';

// GET /api/workflows/[id] - Get workflow or execution status
export async function GET(req: Request, id: string) {
  const authError = requireAuth(req);
  if (authError) return authError;
  try {
    const url = new URL(req.url);
    const executionId = url.searchParams.get('execution');

    if (executionId) {
      // Get execution status (would need execution persistence)
      return new Response(
        JSON.stringify({ error: 'Execution status not yet implemented' }),
        { status: 501, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const workflow = await persistence.getWorkflow(id);
    if (!workflow) {
      return new Response(JSON.stringify({ error: 'Workflow not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ workflow }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST /api/workflows/[id] - Execute a workflow
export async function POST(req: Request, id: string) {
  const authError = requireAuth(req);
  if (authError) return authError;
  try {
    const body = await req.json() as { initialData?: any };
    const workflow = await persistence.getWorkflow(id);

    if (!workflow) {
      return new Response(JSON.stringify({ error: 'Workflow not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const execution = await workflowEngine.execute(workflow, body.initialData);

    return new Response(JSON.stringify({ execution }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT /api/workflows/[id] - Update a workflow
export async function PUT(req: Request, id: string) {
  const authError = requireAuth(req);
  if (authError) return authError;
  try {
    const body = await req.json() as Partial<Workflow>;
    const workflow = await persistence.getWorkflow(id);

    if (!workflow) {
      return new Response(JSON.stringify({ error: 'Workflow not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await persistence.updateWorkflow(id, body);

    const updatedWorkflow = await persistence.getWorkflow(id);
    return new Response(JSON.stringify({ workflow: updatedWorkflow }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE /api/workflows/[id] - Delete a workflow
export async function DELETE(req: Request, id: string) {
  const authError = requireAuth(req);
  if (authError) return authError;
  try {
    const workflow = await persistence.getWorkflow(id);
    if (!workflow) {
      return new Response(JSON.stringify({ error: 'Workflow not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await persistence.deleteWorkflow(id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

