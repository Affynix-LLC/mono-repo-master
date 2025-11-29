// API client - connects to backend server
// Production: api.affynix.ai, Development: localhost:3001
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In production, use api.affynix.ai
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `https://api.affynix.ai`;
  }
  // Development fallback
  return 'http://localhost:3001';
};

const API_URL = getApiUrl();

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return response.json();
};

// Mock entity class that uses backend API
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
    await apiCall('/api/auth/logout', { method: 'POST' });
    window.location.href = redirectPath;
  },

  redirectToLogin(path) {
    // In a real app, redirect to login
    console.log(`[Auth] Redirect to login: ${path}`);
  }
};

// Functions
const functions = {
  async invoke(functionName, payload = {}) {
    return apiCall(`/api/functions/${functionName}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

// Integrations
const integrations = {
  Core: {
    async InvokeLLM(payload) {
      return apiCall('/api/integrations/core/invoke-llm', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
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

// Agents (for chat interface)
const agents = {
  async createConversation({ agent_name, metadata }) {
    // Mock conversation creation
    const conversation = {
      id: `conv_${Date.now()}`,
      agent_name,
      metadata,
      messages: []
    };
    return conversation;
  },

  async addMessage(conversation, message) {
    if (!conversation.messages) {
      conversation.messages = [];
    }
    conversation.messages.push({
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
    
    // Simulate AI response
    setTimeout(() => {
      conversation.messages.push({
        role: 'assistant',
        content: 'This is a mock AI response. Connect to your LLM service to get real responses.',
        id: `msg_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
      
      // Trigger any subscribers
      if (this.subscribers && this.subscribers[conversation.id]) {
        this.subscribers[conversation.id].forEach(callback => {
          callback(conversation);
        });
      }
    }, 1000);
    
    return conversation;
  },

  subscribeToConversation(conversationId, callback) {
    if (!this.subscribers) {
      this.subscribers = {};
    }
    if (!this.subscribers[conversationId]) {
      this.subscribers[conversationId] = [];
    }
    this.subscribers[conversationId].push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers[conversationId].indexOf(callback);
      if (index > -1) {
        this.subscribers[conversationId].splice(index, 1);
      }
    };
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
    Testimonial: new Entity('Testimonial')
  },
  auth,
  functions,
  integrations,
  agents
};
