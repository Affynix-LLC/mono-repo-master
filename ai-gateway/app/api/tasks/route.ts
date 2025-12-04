import * as persistence from '../../../lib/scheduler/persistence';
import { taskQueue } from '../../../lib/scheduler/queue';
import { validateCronExpression, getNextRunTime } from '../../../lib/scheduler/cron';
import { ScheduledTask } from '../../../lib/scheduler/types';
import { v4 as uuidv4 } from 'uuid';

// GET /api/tasks - List all tasks
export async function GET() {
  try {
    const tasks = await persistence.loadTasks();
    return new Response(JSON.stringify({ tasks }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST /api/tasks - Create a new task
export async function POST(req: Request) {
  try {
    const body = await req.json();
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
      nextRun: getNextRunTime(cronExpression),
    };

    await persistence.createTask(task);
    
    // Schedule the task if enabled
    if (task.enabled) {
      taskQueue.scheduleTask(task);
    }

    return new Response(JSON.stringify({ task }), {
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

