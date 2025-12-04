import * as persistence from '../../../../lib/scheduler/persistence';
import { taskQueue } from '../../../../lib/scheduler/queue';
import { validateCronExpression, getNextRunTime } from '../../../../lib/scheduler/cron';

// GET /api/tasks/[id] - Get a specific task
export async function GET(req: Request, id: string) {
  try {
    const task = await persistence.getTask(id);
    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ task }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(req: Request, id: string) {
  try {
    const body = await req.json();
    const task = await persistence.getTask(id);

    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updates: any = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.cronExpression !== undefined) {
      if (!validateCronExpression(body.cronExpression)) {
        return new Response(
          JSON.stringify({ error: 'Invalid cron expression' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      updates.cronExpression = body.cronExpression;
      updates.nextRun = getNextRunTime(body.cronExpression);
    }
    if (body.enabled !== undefined) updates.enabled = body.enabled;
    if (body.action !== undefined) updates.action = body.action;

    await persistence.updateTask(id, updates);

    // Reschedule the task
    const updatedTask = await persistence.getTask(id);
    if (updatedTask) {
      taskQueue.unscheduleTask(id);
      if (updatedTask.enabled) {
        taskQueue.scheduleTask(updatedTask);
      }
    }

    return new Response(JSON.stringify({ task: updatedTask }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(req: Request, id: string) {
  try {
    const task = await persistence.getTask(id);
    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    taskQueue.unscheduleTask(id);
    await persistence.deleteTask(id);

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

