import { Agent, AgentStatus, AgentTask, AgentExecutionResult } from './types';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { contentAgent } from './content';
import { dataAgent } from './data';
import { integrationAgent } from './integration';
import { workflowAgent } from './workflow';

const AGENTS_FILE = join(process.cwd(), '.agents.json');

class AgentManager {
  private agents: Map<string, Agent> = new Map();

  async loadAgents(): Promise<void> {
    try {
      const content = await readFile(AGENTS_FILE, 'utf-8');
      const agents: Agent[] = JSON.parse(content);
      for (const agent of agents) {
        this.agents.set(agent.id, agent);
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async saveAgents(): Promise<void> {
    const agents = Array.from(this.agents.values());
    await writeFile(AGENTS_FILE, JSON.stringify(agents, null, 2), 'utf-8');
  }

  async createAgent(agent: Agent): Promise<void> {
    this.agents.set(agent.id, agent);
    await this.saveAgents();
  }

  async getAgent(id: string): Promise<Agent | null> {
    return this.agents.get(id) || null;
  }

  async getAllAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<void> {
    const agent = this.agents.get(id);
    if (!agent) {
      throw new Error(`Agent ${id} not found`);
    }
    this.agents.set(id, { ...agent, ...updates, updatedAt: new Date() });
    await this.saveAgents();
  }

  async deleteAgent(id: string): Promise<void> {
    this.agents.delete(id);
    await this.saveAgents();
  }

  async executeAgent(task: AgentTask): Promise<AgentExecutionResult> {
    const agent = this.agents.get(task.agentId);
    if (!agent) {
      throw new Error(`Agent ${task.agentId} not found`);
    }

    const startTime = Date.now();
    await this.updateAgent(task.agentId, { status: 'running' });

    try {
      let result: any;

      switch (agent.type) {
        case 'content':
          result = await contentAgent.execute(task.task, task.parameters);
          break;
        case 'data':
          result = await dataAgent.execute(task.task, task.parameters);
          break;
        case 'integration':
          result = await integrationAgent.execute(task.task, task.parameters);
          break;
        case 'workflow':
          result = await workflowAgent.execute(task.task, task.parameters);
          break;
        default:
          throw new Error(`Unknown agent type: ${agent.type}`);
      }

      const duration = Date.now() - startTime;
      await this.updateAgent(task.agentId, {
        status: 'completed',
        lastRun: new Date(),
        runCount: agent.runCount + 1,
      });

      return {
        agentId: task.agentId,
        success: true,
        result,
        executedAt: new Date(),
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      await this.updateAgent(task.agentId, {
        status: 'failed',
        lastRun: new Date(),
      });

      return {
        agentId: task.agentId,
        success: false,
        error: error.message,
        executedAt: new Date(),
        duration,
      };
    }
  }
}

export const agentManager = new AgentManager();

