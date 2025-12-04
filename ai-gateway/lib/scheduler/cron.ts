import cronParser from 'node-cron';

export function validateCronExpression(expression: string): boolean {
  return cronParser.validate(expression);
}

export function getNextRunTime(expression: string): Date | null {
  if (!validateCronExpression(expression)) {
    return null;
  }
  
  const schedule = cronParser.parseExpression(expression);
  return schedule.next().toDate();
}

export function shouldRun(task: { cronExpression: string; lastRun?: Date }): boolean {
  if (!validateCronExpression(task.cronExpression)) {
    return false;
  }
  
  const now = new Date();
  const nextRun = getNextRunTime(task.cronExpression);
  
  if (!nextRun) {
    return false;
  }
  
  if (!task.lastRun) {
    return true;
  }
  
  return now >= nextRun;
}

