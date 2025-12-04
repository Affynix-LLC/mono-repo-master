import * as persistence from '../../../lib/scheduler/persistence';
import { taskQueue } from '../../../lib/scheduler/queue';
import { validateCronExpression, getNextRunTime } from '../../../lib/scheduler/cron';
import { ScheduledTask } from '../../../lib/scheduler/types';
import { requireAuth } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

// GET /api/tasks - List all tasks
export async function GET(req: Request) {
  // Require authentication
  const authError = requireAuth(req);
  if (authError) return authError;
  try {
    const tasks = await persistence.loadTasks();
    return new Response(JSON.stringify({ tasks, count: tasks.length }), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Tasks GET error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST /api/tasks - Create a new task
export async function POST(req: Request) {
  // Require authentication
  const authError = requireAuth(req);
  if (authError) return authError;
  
  try {
    const body = await req.json() as { name?: string; cronExpression?: string; action?: any; enabled?: boolean };
    const { name, cronExpression, action, enabled = true } = body;

    if (!name || !cronExpression || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, cronExpression, action' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!validateCronExpression(cronExpression)) {
      return new Response(
        JSON.stringify({ error: 'Invalid cron expression' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const task: ScheduledTask = {
      id: uuidv4(),
      name,
      cronExpression,
      enabled,
      action,
      runCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      nextRun: getNextRunTime(cronExpression) || undefined,
    };

    await persistence.createTask(task);
    
    // Schedule the task if enabled
    if (task.enabled) {
      taskQueue.scheduleTask(task);
    }

    return new Response(JSON.stringify({ task }), {
      status: 201,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Tasks POST error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

