/**
 * Setup Scraper Scheduled Task
 * 
 * Creates a scheduled task in ai-gateway to trigger the scraper daily at 2 AM
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

async function setupScraperTask() {
  const task = {
    name: 'Daily Scraper Run',
    cronExpression: '0 2 * * *', // 2 AM daily
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
  };

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

    console.log('✅ Scraper task created successfully:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('❌ Failed to create scraper task:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

setupScraperTask();

