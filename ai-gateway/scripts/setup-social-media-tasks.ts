/**
 * Setup Social Media Scheduled Tasks
 * 
 * Creates scheduled tasks in ai-gateway for daily social media posts
 */

import axios from 'axios';

const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL || 'https://ai.affynix.ai';
const API_KEY = process.env.AI_GATEWAY_API_KEY;

if (!API_KEY) {
  console.error('AI_GATEWAY_API_KEY environment variable is required');
  process.exit(1);
}

const tasks = [
  {
    name: 'Morning Social Media Post',
    cronExpression: '0 9 * * *', // 9 AM daily
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
    cronExpression: '0 14 * * *', // 2 PM daily
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
    cronExpression: '0 18 * * *', // 6 PM daily
    enabled: true,
    action: {
      type: 'workflow',
      config: {
        workflowId: 'daily-social-media',
        step: 'generate_evening_post',
      },
    },
  },
];

async function setupSocialMediaTasks() {
  console.log('Setting up social media scheduled tasks...\n');

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

  console.log('Social media tasks setup complete!');
}

setupSocialMediaTasks();

