/**
 * Setup All Automation Tasks
 * 
 * Creates all scheduled tasks for 24/7 automation:
 * - Daily scraper run
 * - Social media posts (3x daily)
 * - Weekly content generation
 */

import axios from 'axios';

const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL || 'https://ai.affynix.ai';
const API_KEY = process.env.AI_GATEWAY_API_KEY;

if (!API_KEY) {
  console.error('AI_GATEWAY_API_KEY environment variable is required');
  process.exit(1);
}

const SCRAPER_URL = process.env.SCRAPER_URL || 'http://localhost:3004/trigger';
const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

const tasks = [
  // Daily scraper run at 2 AM
  {
    name: 'Daily Scraper Run',
    cronExpression: '0 2 * * *',
    enabled: true,
    action: {
      type: 'webhook',
      config: {
        url: SCRAPER_URL,
        method: 'POST',
        headers: SCRAPER_API_KEY ? {
          'Content-Type': 'application/json',
          'X-API-Key': SCRAPER_API_KEY,
        } : {
          'Content-Type': 'application/json',
        },
        data: {},
      },
    },
  },
  // Social media posts
  {
    name: 'Morning Social Media Post',
    cronExpression: '0 9 * * *',
    enabled: true,
    action: {
      type: 'workflow',
      config: {
        workflowId: 'daily-social-media',
        step: 'generate_morning_post',
      },
    },
  },
  {
    name: 'Afternoon Social Media Post',
    cronExpression: '0 14 * * *',
    enabled: true,
    action: {
      type: 'workflow',
      config: {
        workflowId: 'daily-social-media',
        step: 'generate_afternoon_post',
      },
    },
  },
  {
    name: 'Evening Social Media Post',
    cronExpression: '0 18 * * *',
    enabled: true,
    action: {
      type: 'workflow',
      config: {
        workflowId: 'daily-social-media',
        step: 'generate_evening_post',
      },
    },
  },
  // Weekly content generation
  {
    name: 'Weekly Content Generation',
    cronExpression: '0 10 * * 1', // Monday at 10 AM
    enabled: true,
    action: {
      type: 'prompt',
      config: {
        prompt: 'Generate weekly content updates for all active subdomains',
      },
    },
  },
];

async function setupAllAutomation() {
  console.log('Setting up all automation tasks...\n');

  for (const task of tasks) {
    try {
      const response = await axios.post(
        `${AI_GATEWAY_URL}/api/tasks`,
        task,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
        }
      );

      console.log(`✅ Created task: ${task.name}`);
      console.log(`   Schedule: ${task.cronExpression}`);
      console.log(`   ID: ${response.data.task.id}\n`);
    } catch (error: any) {
      console.error(`❌ Failed to create task: ${task.name}`);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', error.response.data);
      } else {
        console.error('   Error:', error.message);
      }
      console.log('');
    }
  }

  console.log('All automation tasks setup complete!');
  console.log('\nNext steps:');
  console.log('1. Verify tasks are running in ai-gateway dashboard');
  console.log('2. Monitor logs for any errors');
  console.log('3. Adjust schedules as needed');
}

setupAllAutomation();

