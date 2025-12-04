import { agentManager } from '../../../lib/agents/manager';
import { Agent, AgentTask } from '../../../lib/agents/types';
import { v4 as uuidv4 } from 'uuid';

// Initialize agent manager
agentManager.loadAgents().catch(console.error);

// GET /api/agents - List all agents
export async function GET() {
  try {
    const agents = await agentManager.getAllAgents();
    return new Response(JSON.stringify({ agents }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST /api/agents - Create agent or execute agent task
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, agent, task } = body;

    if (action === 'execute' && task) {
      // Execute an agent task
      const agentTask: AgentTask = {
        agentId: task.agentId,
        task: task.task,
        parameters: task.parameters || {},
        priority: task.priority,
      };

      const result = await agentManager.executeAgent(agentTask);
      return new Response(JSON.stringify({ result }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create a new agent
    if (!agent || !agent.name || !agent.type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newAgent: Agent = {
      id: agent.id || uuidv4(),
      name: agent.name,
      type: agent.type,
      status: 'idle',
      config: agent.config || {},
      runCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await agentManager.createAgent(newAgent);

    return new Response(JSON.stringify({ agent: newAgent }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

