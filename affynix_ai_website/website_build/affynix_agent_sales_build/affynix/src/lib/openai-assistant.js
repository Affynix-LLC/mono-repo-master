// Client-side utility for OpenAI Assistant API

export class OpenAIAssistant {
  constructor(assistantId, options = {}) {
    this.assistantId = assistantId;
    this.threadId = null;
    // Use the backend API URL for assistant endpoint
    const getApiUrl = () => {
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
      }
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return `https://api.affynix.ai`;
      }
      return 'http://localhost:3001';
    };
    this.apiUrl = options.apiUrl || `${getApiUrl()}/api/assistant`;
    this.onMessage = options.onMessage || (() => {});
    this.onStatus = options.onStatus || (() => {});
    this.onError = options.onError || (() => {});
  }

  // Create a new conversation thread
  async createThread() {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-thread',
          assistantId: this.assistantId,
        }),
      });

      const data = await response.json();
      if (data.threadId) {
        this.threadId = data.threadId;
        return data.threadId;
      }
      throw new Error(data.error || 'Failed to create thread');
    } catch (error) {
      this.onError(error);
      throw error;
    }
  }

  // Send a message to the assistant
  async sendMessage(message, instructions) {
    if (!this.threadId) {
      await this.createThread();
    }

    try {
      // Add the message to the thread
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-message',
          threadId: this.threadId,
          message,
        }),
      });

      // Run the assistant and stream the response
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run',
          threadId: this.threadId,
          assistantId: this.assistantId,
          instructions,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'status') {
                this.onStatus(data.status);
              } else if (data.type === 'message') {
                this.onMessage(data.content);
              } else if (data.type === 'error') {
                this.onError(new Error(data.error));
              } else if (data.type === 'done') {
                // Stream complete
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      this.onError(error);
      throw error;
    }
  }

  // Get all messages from the thread
  async getMessages() {
    if (!this.threadId) {
      return [];
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get-messages',
          threadId: this.threadId,
        }),
      });

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      this.onError(error);
      return [];
    }
  }

  // Reset the conversation
  reset() {
    this.threadId = null;
  }
}

