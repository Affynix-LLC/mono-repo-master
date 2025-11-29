import express from 'express';
import cors from 'cors';

const app = express();
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

// In-memory data stores (replace with database in production)
const dataStores = {
  Client: [],
  IntakeSubmission: [],
  AppConfiguration: [],
  Payment: [],
  Agent: [],
  CommandLog: [],
  ZeroXControl: [],
  AICalculatorInputs: [],
  ClientIntegrationDetails: [],
  CallLog: [],
  Testimonial: [],
  ChatSession: [],
  Learning: [],
  Product: []
};

// Helper function to get entity store
const getStore = (entityName) => {
  if (!dataStores[entityName]) {
    dataStores[entityName] = [];
  }
  return dataStores[entityName];
};

// Auth endpoints
app.get('/api/auth/me', (req, res) => {
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

// Entity endpoints
const createEntityRoutes = (entityName) => {
  // List entities
  app.get(`/api/entities/${entityName}`, (req, res) => {
    const store = getStore(entityName);
    const sort = req.query.sort || '';
    let results = [...store];
    
    // Simple sort implementation
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
  });

  // Filter entities
  app.post(`/api/entities/${entityName}/filter`, (req, res) => {
    const store = getStore(entityName);
    const filters = req.body || {};
    const results = store.filter(item => {
      return Object.keys(filters).every(key => item[key] === filters[key]);
    });
    res.json(results);
  });

  // Create entity
  app.post(`/api/entities/${entityName}`, (req, res) => {
    const store = getStore(entityName);
    const newItem = {
      id: Date.now().toString(),
      ...req.body,
      created_date: new Date().toISOString()
    };
    store.push(newItem);
    res.json(newItem);
  });

  // Update entity
  app.put(`/api/entities/${entityName}/:id`, (req, res) => {
    const store = getStore(entityName);
    const index = store.findIndex(item => item.id === req.params.id);
    if (index !== -1) {
      store[index] = { ...store[index], ...req.body };
      res.json(store[index]);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  // Delete entity
  app.delete(`/api/entities/${entityName}/:id`, (req, res) => {
    const store = getStore(entityName);
    const index = store.findIndex(item => item.id === req.params.id);
    if (index !== -1) {
      store.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Not found' });
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
app.post('/api/functions/:functionName', (req, res) => {
  const { functionName } = req.params;
  console.log(`[API] Function invoked: ${functionName}`, req.body);
  res.json({
    success: true,
    data: { message: `Function ${functionName} executed` }
  });
});

// Integrations endpoints
app.post('/api/integrations/core/invoke-llm', (req, res) => {
  console.log('[API] InvokeLLM', req.body);
  res.json({
    success: true,
    response: 'This is a mock LLM response. Replace with your local LLM implementation.'
  });
});

app.post('/api/integrations/core/send-email', (req, res) => {
  console.log('[API] SendEmail', req.body);
  res.json({ success: true, messageId: 'mock-email-id' });
});

app.post('/api/integrations/core/upload-file', (req, res) => {
  console.log('[API] UploadFile', req.body);
  res.json({ success: true, fileId: 'mock-file-id', url: 'https://example.com/mock-file' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend API server running on http://0.0.0.0:${PORT}`);
  console.log(`Production URL: https://api.affynix.ai`);
  console.log(`Admin URL: https://admin.affynix.ai`);
  console.log(`Allowed origins: affynix.ai, admin.affynix.ai, localhost`);
  console.log(`Available endpoints:`);
  console.log(`  GET  /health`);
  console.log(`  GET  /api/auth/me`);
  console.log(`  GET  /api/entities/:entityName`);
  console.log(`  POST /api/entities/:entityName`);
  console.log(`  POST /api/entities/:entityName/filter`);
  console.log(`  PUT  /api/entities/:entityName/:id`);
  console.log(`  DELETE /api/entities/:entityName/:id`);
  console.log(`  POST /api/functions/:functionName`);
  console.log(`  POST /api/integrations/core/invoke-llm`);
});

