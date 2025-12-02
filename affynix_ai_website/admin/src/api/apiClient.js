// API client for admin pages - same as frontend but can be used in admin context
// Production: api.affynix.ai, Development: localhost:3001
const getApiUrl = () => {
  // Vite replaces import.meta.env.VITE_API_URL at build time
  // If set during build, use that value (this is the primary method)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Runtime fallback: check if we're in production based on hostname
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `https://api.affynix.ai`;
  }
  // Development fallback
  return 'http://localhost:3001';
};

const API_URL = getApiUrl();

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers,
    ...options
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Redirect to login on unauthorized
      window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return response.json();
};

// Entity class that uses backend API
class Entity {
  constructor(name) {
    this.name = name;
  }

  async list(sort = '', limit = 100) {
    return apiCall(`/api/entities/${this.name}?sort=${sort}&limit=${limit}`);
  }

  async filter(filters = {}) {
    return apiCall(`/api/entities/${this.name}/filter`, {
      method: 'POST',
      body: JSON.stringify(filters)
    });
  }

  async create(data) {
    return apiCall(`/api/entities/${this.name}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async update(id, data) {
    return apiCall(`/api/entities/${this.name}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(id) {
    return apiCall(`/api/entities/${this.name}/${id}`, {
      method: 'DELETE'
    });
  }
}

// Auth
const auth = {
  async me() {
    return apiCall('/api/auth/me');
  },

  async logout(redirectPath = '/') {
    localStorage.removeItem('auth_token');
    await apiCall('/api/auth/logout', { method: 'POST' });
    window.location.href = redirectPath;
  },

  redirectToLogin(path) {
    window.location.href = `/admin/login?redirect=${encodeURIComponent(path)}`;
  }
};

// Functions
const functions = {
  async invoke(functionName, payload = {}) {
    const result = await apiCall(`/api/functions/${functionName}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return result;
  }
};

// Integrations
const integrations = {
  Core: {
    async InvokeLLM(payload) {
      const result = await apiCall('/api/integrations/core/invoke-llm', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return result.response || result;
    },

    async SendEmail(payload) {
      return apiCall('/api/integrations/core/send-email', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },

    async UploadFile(payload) {
      return apiCall('/api/integrations/core/upload-file', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }
  }
};

export const api = {
  entities: {
    Client: new Entity('Client'),
    IntakeSubmission: new Entity('IntakeSubmission'),
    AppConfiguration: new Entity('AppConfiguration'),
    Payment: new Entity('Payment'),
    Agent: new Entity('Agent'),
    CommandLog: new Entity('CommandLog'),
    ZeroXControl: new Entity('ZeroXControl'),
    AICalculatorInputs: new Entity('AICalculatorInputs'),
    ClientIntegrationDetails: new Entity('ClientIntegrationDetails'),
    CallLog: new Entity('CallLog'),
    Testimonial: new Entity('Testimonial'),
    ChatSession: new Entity('ChatSession'),
    Learning: new Entity('Learning'),
    Product: new Entity('Product')
  },
  auth,
  functions,
  integrations
};
