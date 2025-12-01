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

// Get WebSocket URL
const getWsUrl = () => {
  const apiUrl = getApiUrl();
  if (apiUrl.startsWith('https://')) {
    return apiUrl.replace('https://', 'wss://');
  } else if (apiUrl.startsWith('http://')) {
    return apiUrl.replace('http://', 'ws://');
  }
  // Fallback: check if we're in production to avoid localhost in production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'wss://api.affynix.ai';
  }
  // Development fallback only
  return 'ws://localhost:3001';
};

// Agents (for chat interface with WebSocket)
const agents = {
  subscribers: {},
  wsConnections: {},

  async createConversation({ agent_name, metadata }) {
    const response = await apiCall('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ agent_name, metadata })
    });
    return response;
  },

  async addMessage(conversation, message) {
    // Send message via API
    await apiCall(`/api/conversations/${conversation.id}/messages`, {
      method: 'POST',
      body: JSON.stringify(message)
    });

    // Also send via WebSocket for real-time delivery
    const ws = this.getWebSocket(conversation.id);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'user_message',
        content: message.content,
        role: message.role || 'user'
      }));
    }

    return conversation;
  },

  getWebSocket(conversationId) {
    if (!this.wsConnections[conversationId]) {
      const wsUrl = `${getWsUrl()}/ws?conversation_id=${conversationId}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`[WebSocket] Connected to conversation ${conversationId}`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(conversationId, data);
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
      };

      ws.onclose = () => {
        console.log(`[WebSocket] Disconnected from conversation ${conversationId}`);
        delete this.wsConnections[conversationId];
      };

      this.wsConnections[conversationId] = ws;
    }
    return this.wsConnections[conversationId];
  },

  handleWebSocketMessage(conversationId, data) {
    const callbacks = this.subscribers[conversationId] || [];

    if (data.type === 'conversation_state') {
      // Initial state
      callbacks.forEach(callback => {
        callback(data.conversation);
      });
    } else if (data.type === 'message') {
      // New message received
      callbacks.forEach(callback => {
        // Fetch updated conversation
        apiCall(`/api/conversations/${conversationId}`).then(conv => {
          callback(conv);
        });
      });
    } else if (data.type === 'message_start') {
      // AI started responding
      callbacks.forEach(callback => {
        callback({ type: 'message_start', messageId: data.messageId });
      });
    } else if (data.type === 'message_chunk') {
      // Streaming chunk
      callbacks.forEach(callback => {
        callback({ 
          type: 'message_chunk', 
          messageId: data.messageId, 
          chunk: data.chunk 
        });
      });
    } else if (data.type === 'message_complete') {
      // AI finished responding
      callbacks.forEach(callback => {
        apiCall(`/api/conversations/${conversationId}`).then(conv => {
          callback(conv);
        });
      });
    } else if (data.type === 'error') {
      console.error('[WebSocket] Error:', data.error);
      callbacks.forEach(callback => {
        callback({ type: 'error', error: data.error });
      });
    }
  },

  subscribeToConversation(conversationId, callback) {
    if (!this.subscribers[conversationId]) {
      this.subscribers[conversationId] = [];
    }
    this.subscribers[conversationId].push(callback);

    // Connect WebSocket
    this.getWebSocket(conversationId);

    // Return unsubscribe function
    return () => {
      const index = this.subscribers[conversationId].indexOf(callback);
      if (index > -1) {
        this.subscribers[conversationId].splice(index, 1);
      }

      // Close WebSocket if no more subscribers
      if (this.subscribers[conversationId].length === 0) {
        const ws = this.wsConnections[conversationId];
        if (ws) {
          ws.close();
          delete this.wsConnections[conversationId];
        }
        delete this.subscribers[conversationId];
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
