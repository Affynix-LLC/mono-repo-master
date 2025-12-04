// Production server for Docker deployment
import { createServer } from 'http';
import { parse } from 'url';
import 'dotenv/config';

// Import route handlers
import * as chatRoute from './app/api/chat/route';
import * as tasksRoute from './app/api/tasks/route';
import * as tasksIdRoute from './app/api/tasks/[id]/route';
import * as webhooksRoute from './app/api/webhooks/route';
import * as workflowsRoute from './app/api/workflows/route';
import * as workflowsIdRoute from './app/api/workflows/[id]/route';
import * as agentsRoute from './app/api/agents/route';
import * as agentsIdRoute from './app/api/agents/[id]/route';
import * as backendGenerateRoute from './app/api/backend/generate/route';
import * as backendDeployRoute from './app/api/backend/deploy/route';

const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  const parsedUrl = parse(req.url || '/', true);
  const pathname = parsedUrl.pathname || '/';
  const method = req.method || 'GET';

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  // Handle OPTIONS
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Convert Node.js request to Web API Request
  const body = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
  });

  // Create Request object with proper URL
  const url = `http://${req.headers.host || 'localhost'}${req.url || '/'}`;
  const requestInit: RequestInit = {
    method,
    headers,
  };
  
  // Only add body for methods that support it
  if (['POST', 'PUT', 'PATCH'].includes(method) && body.length > 0) {
    requestInit.body = body.toString();
  }

  const request = new Request(url, requestInit);

  try {
    let response: Response;

    // Route to appropriate handler
    if (pathname === '/api/chat' && method === 'POST') {
      response = await chatRoute.POST(request);
    } else if (pathname === '/api/tasks' && method === 'GET') {
      response = await tasksRoute.GET(request);
    } else if (pathname === '/api/tasks' && method === 'POST') {
      response = await tasksRoute.POST(request);
    } else if (pathname.startsWith('/api/tasks/') && method === 'GET') {
      const id = pathname.split('/')[3];
      response = await tasksIdRoute.GET(request, id);
    } else if (pathname.startsWith('/api/tasks/') && method === 'PUT') {
      const id = pathname.split('/')[3];
      response = await tasksIdRoute.PUT(request, id);
    } else if (pathname.startsWith('/api/tasks/') && method === 'DELETE') {
      const id = pathname.split('/')[3];
      response = await tasksIdRoute.DELETE(request, id);
    } else if (pathname === '/api/webhooks' && method === 'GET') {
      response = await webhooksRoute.GET(request);
    } else if (pathname === '/api/webhooks' && method === 'POST') {
      response = await webhooksRoute.POST(request);
    } else if (pathname === '/api/workflows' && method === 'GET') {
      response = await workflowsRoute.GET(request);
    } else if (pathname === '/api/workflows' && method === 'POST') {
      response = await workflowsRoute.POST(request);
    } else if (pathname.startsWith('/api/workflows/') && method === 'GET') {
      const id = pathname.split('/')[3];
      response = await workflowsIdRoute.GET(request, id);
    } else if (pathname.startsWith('/api/workflows/') && method === 'POST') {
      const id = pathname.split('/')[3];
      response = await workflowsIdRoute.POST(request, id);
    } else if (pathname.startsWith('/api/workflows/') && method === 'PUT') {
      const id = pathname.split('/')[3];
      response = await workflowsIdRoute.PUT(request, id);
    } else if (pathname.startsWith('/api/workflows/') && method === 'DELETE') {
      const id = pathname.split('/')[3];
      response = await workflowsIdRoute.DELETE(request, id);
    } else if (pathname === '/api/agents' && method === 'GET') {
      response = await agentsRoute.GET(request);
    } else if (pathname === '/api/agents' && method === 'POST') {
      response = await agentsRoute.POST(request);
    } else if (pathname.startsWith('/api/agents/') && method === 'GET') {
      const id = pathname.split('/')[3];
      response = await agentsIdRoute.GET(request, id);
    } else if (pathname.startsWith('/api/agents/') && method === 'PUT') {
      const id = pathname.split('/')[3];
      response = await agentsIdRoute.PUT(request, id);
    } else if (pathname.startsWith('/api/agents/') && method === 'DELETE') {
      const id = pathname.split('/')[3];
      response = await agentsIdRoute.DELETE(request, id);
    } else if (pathname === '/api/backend/generate' && method === 'POST') {
      response = await backendGenerateRoute.POST(request);
    } else if (pathname === '/api/backend/deploy' && method === 'GET') {
      response = await backendDeployRoute.GET(request);
    } else if (pathname === '/api/backend/deploy' && method === 'POST') {
      response = await backendDeployRoute.POST(request);
    } else if (pathname === '/health' || pathname === '/') {
      response = new Response(JSON.stringify({ status: 'ok', service: 'ai-gateway' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      response = new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send response
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    const responseBody = await response.text();
    res.end(responseBody);
  } catch (error: any) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 AI Gateway server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoints: http://localhost:${PORT}/api/*`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

