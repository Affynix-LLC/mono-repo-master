import { agentManager } from '../../../../lib/agents/manager';

// GET /api/agents/[id] - Get agent status
export async function GET(req: Request, id: string) {
  try {
    const agent = await agentManager.getAgent(id);
    if (!agent) {
      return new Response(JSON.stringify({ error: 'Agent not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ agent }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT /api/agents/[id] - Update agent
export async function PUT(req: Request, id: string) {
  try {
    const body = await req.json();
    await agentManager.updateAgent(id, body);
    const agent = await agentManager.getAgent(id);
    return new Response(JSON.stringify({ agent }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE /api/agents/[id] - Delete agent
export async function DELETE(req: Request, id: string) {
  try {
    await agentManager.deleteAgent(id);
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

