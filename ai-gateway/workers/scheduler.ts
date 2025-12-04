import 'dotenv/config';
import { taskQueue } from '../lib/scheduler/queue';

async function main() {
  console.log('Starting scheduler worker...');
  
  // Load and schedule all tasks
  await taskQueue.loadAndSchedule();
  
  console.log('Scheduler worker started. Tasks loaded and scheduled.');
  
  // Keep the process alive
  process.on('SIGTERM', () => {
    console.log('Scheduler worker shutting down...');
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Scheduler worker error:', error);
  process.exit(1);
});

