/**
 * HTTP Server for Affynix Scraper
 * 
 * Provides an HTTP endpoint to trigger scraper runs on demand.
 * Used by ai-gateway for scheduled automation.
 */

import http from 'http';
import { runAll } from './scripts/run.js';

const PORT = process.env.SCRAPER_PORT || 3004;
const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY || null;

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'affynix-scraper' }));
    return;
  }

  // Trigger scraper endpoint
  if (req.method === 'POST' && req.url === '/trigger') {
    // Optional API key authentication
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    if (SCRAPER_API_KEY && apiKey !== SCRAPER_API_KEY) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'triggered', 
      message: 'Scraper run started',
      timestamp: new Date().toISOString()
    }));

    // Run scraper asynchronously (don't block response)
    runAll().catch(err => {
      console.error('[SERVER] Scraper run failed:', err);
    });

    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`[SCRAPER SERVER] Listening on port ${PORT}`);
  console.log(`[SCRAPER SERVER] Health check: http://localhost:${PORT}/health`);
  console.log(`[SCRAPER SERVER] Trigger endpoint: POST http://localhost:${PORT}/trigger`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SCRAPER SERVER] SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('[SCRAPER SERVER] Server closed');
    process.exit(0);
  });
});

