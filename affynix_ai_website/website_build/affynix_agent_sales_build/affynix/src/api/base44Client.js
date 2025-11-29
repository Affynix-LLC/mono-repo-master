// Local mock implementation - no base44 dependency

// Mock entity class
class MockEntity {
  constructor(name) {
    this.name = name;
    this.data = [];
  }

  async list(sort = '', limit = 100) {
    console.log(`[Mock] ${this.name}.list(${sort}, ${limit})`);
    return this.data;
  }

  async filter(filters = {}) {
    console.log(`[Mock] ${this.name}.filter(${JSON.stringify(filters)})`);
    return this.data.filter(item => {
      return Object.keys(filters).every(key => item[key] === filters[key]);
    });
  }

  async create(data) {
    console.log(`[Mock] ${this.name}.create(${JSON.stringify(data)})`);
    const newItem = { id: Date.now().toString(), ...data, created_date: new Date().toISOString() };
    this.data.push(newItem);
    return newItem;
  }

  async update(id, data) {
    console.log(`[Mock] ${this.name}.update(${id}, ${JSON.stringify(data)})`);
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...data };
      return this.data[index];
    }
    return null;
  }

  async delete(id) {
    console.log(`[Mock] ${this.name}.delete(${id})`);
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  }
}

// Mock auth
const mockAuth = {
  async me() {
    console.log('[Mock] auth.me()');
    return {
      id: 'local-user-1',
      email: 'local@affynix.com',
      role: 'admin',
      name: 'Local User'
    };
  },

  async logout(redirectPath = '/') {
    console.log(`[Mock] auth.logout(${redirectPath})`);
    window.location.href = redirectPath;
  },

  redirectToLogin(path) {
    console.log(`[Mock] auth.redirectToLogin(${path})`);
    // In a real app, you'd redirect to login
    // For local build, we'll just log it
  }
};

// Mock functions
const mockFunctions = {
  async invoke(functionName, payload = {}) {
    console.log(`[Mock] functions.invoke(${functionName}, ${JSON.stringify(payload)})`);
    return { success: true, data: { message: `Mock ${functionName} executed` } };
  },

  intake: {
    async invoke(payload) {
      return mockFunctions.invoke('intake', payload);
    }
  },

  stripeWebhook: {
    async invoke(payload) {
      return mockFunctions.invoke('stripeWebhook', payload);
    }
  },

  ai: {
    async invoke(payload) {
      return mockFunctions.invoke('ai', payload);
    }
  },

  payments: {
    async invoke(payload) {
      return mockFunctions.invoke('payments', payload);
    }
  },

  clients: {
    async invoke(payload) {
      return mockFunctions.invoke('clients', payload);
    }
  },

  hubspot: {
    async invoke(payload) {
      return mockFunctions.invoke('hubspot', payload);
    }
  },

  intakeSyncAgent: {
    async invoke(payload) {
      return mockFunctions.invoke('intakeSyncAgent', payload);
    }
  },

  billingMonitorAgent: {
    async invoke(payload) {
      return mockFunctions.invoke('billingMonitorAgent', payload);
    }
  },

  aiAssistantAgent: {
    async invoke(payload) {
      return mockFunctions.invoke('aiAssistantAgent', payload);
    }
  },

  zeroXOrchestrator: {
    async invoke(payload) {
      return mockFunctions.invoke('zeroXOrchestrator', payload);
    }
  },

  onboardingAutomation: {
    async invoke(payload) {
      return mockFunctions.invoke('onboardingAutomation', payload);
    }
  },

  createCheckout: {
    async invoke(payload) {
      return mockFunctions.invoke('createCheckout', payload);
    }
  },

  sendToZapier: {
    async invoke(payload) {
      return mockFunctions.invoke('sendToZapier', payload);
    }
  },

  emailAutomation: {
    async invoke(payload) {
      return mockFunctions.invoke('emailAutomation', payload);
    }
  },

  leadScoring: {
    async invoke(payload) {
      return mockFunctions.invoke('leadScoring', payload);
    }
  }
};

// Mock integrations
const mockIntegrations = {
  Core: {
    async InvokeLLM(payload) {
      console.log(`[Mock] integrations.Core.InvokeLLM(${JSON.stringify(payload)})`);
      return { 
        success: true, 
        response: 'This is a mock LLM response. Replace with your local LLM implementation.' 
      };
    },

    async SendEmail(payload) {
      console.log(`[Mock] integrations.Core.SendEmail(${JSON.stringify(payload)})`);
      return { success: true, messageId: 'mock-email-id' };
    },

    async UploadFile(payload) {
      console.log(`[Mock] integrations.Core.UploadFile(${JSON.stringify(payload)})`);
      return { success: true, fileId: 'mock-file-id', url: 'https://example.com/mock-file' };
    },

    async GenerateImage(payload) {
      console.log(`[Mock] integrations.Core.GenerateImage(${JSON.stringify(payload)})`);
      return { success: true, imageUrl: 'https://example.com/mock-image.png' };
    },

    async ExtractDataFromUploadedFile(payload) {
      console.log(`[Mock] integrations.Core.ExtractDataFromUploadedFile(${JSON.stringify(payload)})`);
      return { success: true, data: {} };
    },

    async CreateFileSignedUrl(payload) {
      console.log(`[Mock] integrations.Core.CreateFileSignedUrl(${JSON.stringify(payload)})`);
      return { success: true, signedUrl: 'https://example.com/mock-signed-url' };
    },

    async UploadPrivateFile(payload) {
      console.log(`[Mock] integrations.Core.UploadPrivateFile(${JSON.stringify(payload)})`);
      return { success: true, fileId: 'mock-private-file-id' };
    }
  }
};

// Create mock base44 client
export const base44 = {
  entities: {
    Client: new MockEntity('Client'),
    IntakeSubmission: new MockEntity('IntakeSubmission'),
    AppConfiguration: new MockEntity('AppConfiguration'),
    Payment: new MockEntity('Payment'),
    Agent: new MockEntity('Agent'),
    CommandLog: new MockEntity('CommandLog'),
    ZeroXControl: new MockEntity('ZeroXControl'),
    AICalculatorInputs: new MockEntity('AICalculatorInputs'),
    ClientIntegrationDetails: new MockEntity('ClientIntegrationDetails'),
    CallLog: new MockEntity('CallLog'),
    Testimonial: new MockEntity('Testimonial')
  },
  auth: mockAuth,
  functions: mockFunctions,
  integrations: mockIntegrations
};
