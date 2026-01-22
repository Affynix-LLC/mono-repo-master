import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { dbHelpers } from './db.js';
import { login, register, authMiddleware, optionalAuth } from './auth.js';
import { invokeLLM, simpleLLMCall } from './llm.js';
import { setupWebSocket } from './websocket.js';
import { sendAgentConversationUpdate } from './zapier.js';
import { saveOfferToAirtable } from './lib/airtable.js';
import { ensureSubdomainForCategory } from './lib/cloudflare.js';
import { bindSubdomainToVercel } from './lib/vercel.js';
import { classifyCategoryToSubdomain } from './utils/subdomainRouter.js';
import { formatOffer } from './utils/formatOffer.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'https://affynix.ai',
      'https://www.affynix.ai',
      'https://admin.affynix.ai',
      'https://www.admin.affynix.ai',
      'http://localhost:4173',
      'http://localhost:3000',
      'http://127.0.0.1:4173',
      'http://127.0.0.1:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path} - Origin: ${req.get('origin') || 'none'}`);
  next();
});

// Map entity names to database table names
const entityTableMap = {
  'Client': 'clients',
  'IntakeSubmission': 'intake_submissions',
  'AppConfiguration': 'app_configurations',
  'Payment': 'payments',
  'Agent': 'agents',
  'ChatSession': 'chat_sessions',
  'Product': 'products',
  // Legacy entities (keep for compatibility, store in JSON or separate tables)
  'CommandLog': 'clients', // Store as JSON in notes or create separate table
  'ZeroXControl': 'app_configurations',
  'AICalculatorInputs': 'app_configurations',
  'ClientIntegrationDetails': 'clients',
  'CallLog': 'clients',
  'Testimonial': 'clients',
  'Learning': 'clients'
};

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const result = await register(email, password, full_name, role || 'user');
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/api/auth/me', optionalAuth, async (req, res) => {
  if (req.user) {
    const user = await dbHelpers.getUserById(req.user.id);
    if (user) {
      const { password_hash, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    }
  }
  // Fallback for development (no auth required)
  res.json({
    id: 'local-user-1',
    email: 'local@affynix.com',
    role: 'admin',
    name: 'Local User'
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

// Conversation endpoints
app.post('/api/conversations', optionalAuth, async (req, res) => {
  try {
    const { agent_name, metadata } = req.body;
    if (!agent_name) {
      return res.status(400).json({ error: 'agent_name required' });
    }

    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userId = req.user?.id || null;

    await dbHelpers.createConversation({
      id: conversationId,
      user_id: userId,
      agent_name,
      metadata: metadata || {}
    });

    const conversation = await dbHelpers.getConversation(conversationId);
    res.json({
      ...conversation,
      messages: []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/conversations/:id', optionalAuth, async (req, res) => {
  try {
    const conversation = await dbHelpers.getConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await dbHelpers.getMessagesByConversation(req.params.id);
    res.json({
      ...conversation,
      messages: messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.created_at
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/conversations/:id/messages', optionalAuth, async (req, res) => {
  try {
    const { role = 'user', content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'content required' });
    }

    const conversationId = req.params.id;
    const conversation = await dbHelpers.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    await dbHelpers.createMessage({
      id: messageId,
      conversation_id: conversationId,
      role,
      content
    });

    const responseMessage = {
      id: messageId,
      role,
      content,
      timestamp
    };

    res.json(responseMessage);

    if (role === 'user') {
      const messages = await dbHelpers.getMessagesByConversation(conversationId);
      sendAgentConversationUpdate({
        conversation,
        messages,
        latestMessage: responseMessage
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Entity endpoints (using database)
const createEntityRoutes = (entityName) => {
  const tableName = entityTableMap[entityName] || entityName.toLowerCase();
  
  // List entities
  app.get(`/api/entities/${entityName}`, optionalAuth, async (req, res) => {
    try {
      let results = await dbHelpers.getAll(tableName);
      
      // Sort implementation
      const sort = req.query.sort || '';
      if (sort.startsWith('-')) {
        const field = sort.substring(1);
        results.sort((a, b) => {
          const aVal = a[field] || '';
          const bVal = b[field] || '';
          return bVal.localeCompare(aVal);
        });
      } else if (sort) {
        results.sort((a, b) => {
          const aVal = a[sort] || '';
          const bVal = b[sort] || '';
          return aVal.localeCompare(bVal);
        });
      }
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Filter entities
  app.post(`/api/entities/${entityName}/filter`, optionalAuth, async (req, res) => {
    try {
      const filters = req.body || {};
      const results = await dbHelpers.filter(tableName, filters);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create entity
  app.post(`/api/entities/${entityName}`, optionalAuth, async (req, res) => {
    try {
      const newItem = await dbHelpers.create(tableName, req.body);
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update entity
  app.put(`/api/entities/${entityName}/:id`, optionalAuth, async (req, res) => {
    try {
      const updated = await dbHelpers.update(tableName, req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete entity
  app.delete(`/api/entities/${entityName}/:id`, optionalAuth, async (req, res) => {
    try {
      const result = await dbHelpers.delete(tableName, req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Create routes for all entities
const entities = [
  'Client',
  'IntakeSubmission',
  'AppConfiguration',
  'Payment',
  'Agent',
  'CommandLog',
  'ZeroXControl',
  'AICalculatorInputs',
  'ClientIntegrationDetails',
  'CallLog',
  'Testimonial',
  'ChatSession',
  'Learning',
  'Product'
];

entities.forEach(createEntityRoutes);

// Function invoke endpoint
app.post('/api/functions/:functionName', optionalAuth, (req, res) => {
  const { functionName } = req.params;
  console.log(`[API] Function invoked: ${functionName}`, req.body);
  res.json({
    success: true,
    data: { message: `Function ${functionName} executed` }
  });
});

// Integrations endpoints
app.post('/api/integrations/core/invoke-llm', optionalAuth, async (req, res) => {
  try {
    const { prompt, conversationId, systemPrompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'prompt required' });
    }

    const response = await simpleLLMCall(prompt, systemPrompt);
    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('[API] LLM error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

app.post('/api/integrations/core/send-email', optionalAuth, (req, res) => {
  console.log('[API] SendEmail', req.body);
  res.json({ success: true, messageId: 'mock-email-id' });
});

app.post('/api/integrations/core/upload-file', optionalAuth, (req, res) => {
  console.log('[API] UploadFile', req.body);
  res.json({ success: true, fileId: 'mock-file-id', url: 'https://example.com/mock-file' });
});

// Admin routes - serve admin UI
// Note: Admin pages are React components that need to be built separately
// For now, these routes return API info. Admin UI should be built and served as static files
app.get('/admin', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Admin interface',
    note: 'Admin UI should be built as React app and served as static files',
    routes: {
      dashboard: '/admin',
      clients: '/admin/clients',
      agents: '/admin/agents',
      payments: '/admin/payments',
      intakes: '/admin/intakes',
      aiEditor: '/admin/ai-editor',
      settings: '/admin/settings'
    }
  });
});

app.get('/admin/*', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Admin route',
    path: req.path,
    note: 'Admin UI should be built as React app and served as static files'
  });
});

// Simple in-memory rate limiter for scraper intake
const scraperRateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // Max 100 requests per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean old entries
  for (const [key, timestamps] of scraperRateLimit.entries()) {
    const filtered = timestamps.filter(ts => ts > windowStart);
    if (filtered.length === 0) {
      scraperRateLimit.delete(key);
    } else {
      scraperRateLimit.set(key, filtered);
    }
  }
  
  // Check current IP
  const timestamps = scraperRateLimit.get(ip) || [];
  const recentRequests = timestamps.filter(ts => ts > windowStart);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limited
  }
  
  recentRequests.push(now);
  scraperRateLimit.set(ip, recentRequests);
  return true; // OK
}

// Scraper Intake Endpoint
app.post('/api/scraper-intake', async (req, res) => {
  try {
    // Validate scraper authentication header
    const authHeader = req.headers['x-affynix-scraper'];
    const expectedKey = process.env.AFFYNIX_SCRAPER_KEY;
    
    if (expectedKey && authHeader !== expectedKey) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Rate limiting (by IP)
    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        message: 'Rate limit exceeded. Please slow down requests.' 
      });
    }

    const payload = req.body;

    if (!payload) {
      return res.status(400).json({ message: 'Missing body.' });
    }

    // Basic required fields
    const required = ['network', 'name', 'category', 'affiliate_link', 'raw_url'];
    for (const field of required) {
      if (!payload[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Normalize + validate the offer object
    const offer = formatOffer(payload);

    // Determine subdomain based on category taxonomy
    const subdomain = classifyCategoryToSubdomain(offer.category);

    // If subdomain does not exist → create it (Cloudflare)
    // Wrap in try-catch to prevent Cloudflare failures from blocking the response
    let ensuredSubdomain = { fqdn: `${subdomain}.affynix.com`, created: false };
    try {
      ensuredSubdomain = await ensureSubdomainForCategory(subdomain);
    } catch (err) {
      console.error('[Affynix Intake] Cloudflare error (non-blocking):', err);
    }

    // Bind new subdomain to Vercel project (if new)
    // Also wrapped to prevent blocking
    if (ensuredSubdomain.created) {
      try {
        await bindSubdomainToVercel(ensuredSubdomain.fqdn);
        console.log(`[Affynix Intake] Created + bound new subdomain: ${ensuredSubdomain.fqdn}`);
      } catch (err) {
        console.error('[Affynix Intake] Vercel binding error (non-blocking):', err);
      }
    }

    // Attach subdomain to offer
    offer.subdomain = ensuredSubdomain.fqdn;

    // Save to Airtable (critical operation - let this fail if needed)
    const airtableRecordId = await saveOfferToAirtable(offer);

    return res.status(200).json({
      status: 'ok',
      airtableRecordId,
      subdomain: offer.subdomain,
      offer
    });

  } catch (error) {
    console.error('[Affynix Intake] Error:', error);
    return res.status(500).json({
      message: 'Internal error',
      error: String(error)
    });
  }
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, business, industry, website, email, message, submittedAt } = req.body;

    // Validate required fields
    if (!email || !message) {
      return res.status(400).json({ 
        error: 'Email and message are required fields' 
      });
    }

    // Generate unique ID for intake submission
    const submissionId = `intake_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Map contact form fields to intake_submissions table schema
    const intakeData = {
      id: submissionId,
      client_name: name || 'Anonymous',
      client_email: email,
      company: business || '',
      phone: '',
      service_type: industry || '',
      business_challenges: message,
      current_revenue: '',
      team_size: '',
      notes: website ? `Website: ${website}` : '',
      status: 'New'
    };

    // Save to database using existing dbHelpers
    const savedIntake = await dbHelpers.create('intake_submissions', intakeData);
    
    if (!savedIntake) {
      throw new Error('Failed to save contact submission to database');
    }

    // If Zapier webhook is configured, send notification
    const webhookUrl = process.env.VITE_CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            business,
            industry,
            website,
            email,
            message,
            submittedAt: submittedAt || new Date().toISOString()
          })
        });
      } catch (webhookError) {
        // Log but don't fail the request if webhook fails
        console.error('[Contact] Webhook notification failed:', webhookError);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId
    });

  } catch (error) {
    console.error('[Contact] Error processing submission:', error);
    return res.status(500).json({
      error: 'Failed to process contact form submission',
      message: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Setup WebSocket
setupWebSocket(server);

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Backend API server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Production URL: https://api.affynix.ai`);
  console.log(`🔧 Admin URL: https://admin.affynix.ai`);
  console.log(`🌐 WebSocket: ws://localhost:${PORT}/ws`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST /api/auth/register`);
  console.log(`  POST /api/auth/login`);
  console.log(`  GET  /api/auth/me`);
  console.log(`  POST /api/conversations`);
  console.log(`  GET  /api/conversations/:id`);
  console.log(`  POST /api/conversations/:id/messages`);
  console.log(`  GET  /api/entities/:entityName`);
  console.log(`  POST /api/entities/:entityName`);
  console.log(`  POST /api/entities/:entityName/filter`);
  console.log(`  PUT  /api/entities/:entityName/:id`);
  console.log(`  DELETE /api/entities/:entityName/:id`);
  console.log(`  POST /api/integrations/core/invoke-llm`);
  console.log(`  POST /api/scraper-intake`);
  console.log(`  POST /api/contact`);
  console.log(`  GET  /health\n`);
});
