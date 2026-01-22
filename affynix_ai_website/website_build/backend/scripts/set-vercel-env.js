#!/usr/bin/env node

/**
 * Set Vercel Environment Variable using Vercel API
 * 
 * Usage:
 *   node scripts/set-vercel-env.js DATABASE_URL "postgresql://..."
 * 
 * Or with environment variable:
 *   VERCEL_TOKEN=xxx node scripts/set-vercel-env.js DATABASE_URL "postgresql://..."
 */

const https = require('https');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_ffSkbObQFzckEPWZSlpzwGMq';
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'prj_g21F5AyOmuDWqKLmYRZl5A5Fb5un'; // affynix.ai_backend
const PROJECT_NAME = process.env.VERCEL_PROJECT_NAME || 'affynix.ai_backend';

// Get command line arguments
const [key, value] = process.argv.slice(2);

if (!key || !value) {
  console.error('Usage: node set-vercel-env.js <KEY> <VALUE>');
  console.error('   Or: VERCEL_TOKEN=xxx node set-vercel-env.js <KEY> <VALUE>');
  process.exit(1);
}

if (!VERCEL_TOKEN) {
  console.error('Error: VERCEL_TOKEN or VERCEL_API_TOKEN environment variable is required');
  console.error('Get your token from: https://vercel.com/account/tokens');
  process.exit(1);
}

// Vercel API endpoint
const url = `https://api.vercel.com/v10/projects/${PROJECT_ID}/env?upsert=true`;

const data = JSON.stringify({
  key,
  value,
  type: 'encrypted', // Use 'encrypted' for sensitive data like connection strings
  target: ['production', 'preview', 'development'] // Set for all environments
});

const options = {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log(`Setting environment variable: ${key}`);
console.log(`Project: ${PROJECT_NAME} (${PROJECT_ID})`);
console.log(`Team: ${VERCEL_TEAM_ID}`);
console.log('');

const req = https.request(url, options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const result = JSON.parse(responseData);
      console.log('✅ Successfully set environment variable!');
      console.log(`   Key: ${result.key}`);
      console.log(`   ID: ${result.id}`);
      console.log(`   Targets: ${result.target.join(', ')}`);
      console.log('');
      console.log('🔄 Next step: Redeploy your project for changes to take effect');
      console.log(`   Visit: https://vercel.com/affynix/${PROJECT_NAME}/deployments`);
    } else {
      console.error(`❌ Error: ${res.statusCode} ${res.statusMessage}`);
      console.error('Response:', responseData);
      try {
        const error = JSON.parse(responseData);
        if (error.error) {
          console.error(`   ${error.error.message || error.error}`);
        }
      } catch (e) {
        console.error('   Raw response:', responseData);
      }
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
  process.exit(1);
});

req.write(data);
req.end();
