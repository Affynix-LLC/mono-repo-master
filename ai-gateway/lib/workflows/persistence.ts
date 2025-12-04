import { readFile, writeFile } from 'fs/promises';
import { Workflow } from './types';
import { join } from 'path';

const WORKFLOWS_FILE = join(process.cwd(), '.workflows.json');

export async function loadWorkflows(): Promise<Workflow[]> {
  try {
    const content = await readFile(WORKFLOWS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function saveWorkflows(workflows: Workflow[]): Promise<void> {
  await writeFile(WORKFLOWS_FILE, JSON.stringify(workflows, null, 2), 'utf-8');
}

export async function getWorkflow(id: string): Promise<Workflow | null> {
  const workflows = await loadWorkflows();
  return workflows.find((w) => w.id === id) || null;
}

export async function createWorkflow(workflow: Workflow): Promise<void> {
  const workflows = await loadWorkflows();
  workflows.push(workflow);
  await saveWorkflows(workflows);
}

export async function updateWorkflow(
  id: string,
  updates: Partial<Workflow>
): Promise<void> {
  const workflows = await loadWorkflows();
  const index = workflows.findIndex((w) => w.id === id);
  if (index === -1) {
    throw new Error(`Workflow ${id} not found`);
  }
  workflows[index] = { ...workflows[index], ...updates, updatedAt: new Date() };
  await saveWorkflows(workflows);
}

export async function deleteWorkflow(id: string): Promise<void> {
  const workflows = await loadWorkflows();
  const filtered = workflows.filter((w) => w.id !== id);
  await saveWorkflows(filtered);
}

