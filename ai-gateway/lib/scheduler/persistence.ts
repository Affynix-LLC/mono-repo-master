import { readFile, writeFile } from 'fs/promises';
import { ScheduledTask } from './types';
import { join } from 'path';

const TASKS_FILE = join(process.cwd(), '.tasks.json');

export async function loadTasks(): Promise<ScheduledTask[]> {
  try {
    const content = await readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function saveTasks(tasks: ScheduledTask[]): Promise<void> {
  await writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

export async function getTask(id: string): Promise<ScheduledTask | null> {
  const tasks = await loadTasks();
  return tasks.find((t) => t.id === id) || null;
}

export async function createTask(task: ScheduledTask): Promise<void> {
  const tasks = await loadTasks();
  tasks.push(task);
  await saveTasks(tasks);
}

export async function updateTask(id: string, updates: Partial<ScheduledTask>): Promise<void> {
  const tasks = await loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Task ${id} not found`);
  }
  tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
  await saveTasks(tasks);
}

export async function deleteTask(id: string): Promise<void> {
  const tasks = await loadTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  await saveTasks(filtered);
}

