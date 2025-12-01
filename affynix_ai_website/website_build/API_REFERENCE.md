# API Reference Guide

## API Type: **REST API** (RESTful)

Your backend uses a **REST API** built with Express.js.

### Base URLs
- **Development**: `http://localhost:3001`
- **Production**: `https://api.affynix.ai`

### API Architecture
- **Type**: REST (Representational State Transfer)
- **Format**: JSON (request & response)
- **Methods**: GET, POST, PUT, DELETE
- **Real-time**: WebSocket support (`ws://localhost:3001/ws`)

---

## 📋 Available Endpoints

### 🔐 Authentication

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "user"  # optional, defaults to "user"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Returns: { "user": {...}, "token": "jwt-token" }
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>  # optional for development
```

#### Logout
```bash
POST /api/auth/logout
```

---

### 💬 Conversations (Chat)

#### Create Conversation
```bash
POST /api/conversations
Content-Type: application/json

{
  "agent_name": "agent_zero",
  "metadata": {
    "name": "My Chat Session",
    "system_prompt": "You are a helpful assistant."
  }
}
```

#### Get Conversation
```bash
GET /api/conversations/:id
```

#### Send Message
```bash
POST /api/conversations/:id/messages
Content-Type: application/json

{
  "role": "user",
  "content": "Hello, how are you?"
}
```

**Note**: For real-time streaming responses, use WebSocket: `ws://localhost:3001/ws?conversation_id=<id>`

---

### 📦 Entities (CRUD Operations)

Available entities:
- `Client`
- `IntakeSubmission`
- `AppConfiguration`
- `Payment`
- `Agent`
- `ChatSession`
- `Product`
- `CommandLog`
- `ZeroXControl`
- `AICalculatorInputs`
- `ClientIntegrationDetails`
- `CallLog`
- `Testimonial`
- `Learning`

#### List Entities
```bash
GET /api/entities/:entityName?sort=field_name&limit=100
# Example: GET /api/entities/Client?sort=-created_date
```

#### Filter Entities
```bash
POST /api/entities/:entityName/filter
Content-Type: application/json

{
  "status": "active",
  "role": "admin"
}
```

#### Create Entity
```bash
POST /api/entities/:entityName
Content-Type: application/json

{
  "name": "New Client",
  "email": "client@example.com"
}
```

#### Update Entity
```bash
PUT /api/entities/:entityName/:id
Content-Type: application/json

{
  "name": "Updated Name"
}
```

#### Delete Entity
```bash
DELETE /api/entities/:entityName/:id
```

---

### 🤖 LLM Integration

#### Invoke LLM
```bash
POST /api/integrations/core/invoke-llm
Content-Type: application/json

{
  "prompt": "Hello, how are you?",
  "systemPrompt": "You are a helpful assistant.",
  "conversationId": "conv_123"  # optional
}

# Returns: { "success": true, "response": "..." }
```

---

### 🔧 Functions

#### Invoke Function
```bash
POST /api/functions/:functionName
Content-Type: application/json

{
  "param1": "value1",
  "param2": "value2"
}
```

---

### 📧 Integrations

#### Send Email
```bash
POST /api/integrations/core/send-email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Hello",
  "body": "Message content"
}
```

#### Upload File
```bash
POST /api/integrations/core/upload-file
Content-Type: application/json

{
  "filename": "document.pdf",
  "content": "base64-encoded-content"
}
```

---

### 🏥 Health Check

```bash
GET /health

# Returns: { "status": "ok", "timestamp": "..." }
```

---

## 🔌 WebSocket API

For real-time chat streaming:

```javascript
const ws = new WebSocket('ws://localhost:3001/ws?conversation_id=conv_123');

// Send message
ws.send(JSON.stringify({
  type: 'user_message',
  content: 'Hello!',
  role: 'user'
}));

// Receive messages
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // data.type can be:
  // - 'conversation_state'
  // - 'message'
  // - 'message_start'
  // - 'message_chunk'
  // - 'message_complete'
  // - 'error'
};
```

---

## 📝 Usage Examples

### Using the Frontend API Client

```javascript
import { api } from '@/api/apiClient';

// Auth
const user = await api.auth.me();

// Entities
const clients = await api.entities.Client.list();
const newClient = await api.entities.Client.create({ name: "Test" });

// Conversations
const conv = await api.agents.createConversation({
  agent_name: "agent_zero",
  metadata: {}
});

// LLM
const response = await api.integrations.Core.InvokeLLM({
  prompt: "Hello!",
  systemPrompt: "You are helpful."
});
```

### Using cURL

```bash
# Health check
curl http://localhost:3001/health

# Get user
curl http://localhost:3001/api/auth/me

# Create conversation
curl -X POST http://localhost:3001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"agent_name":"test","metadata":{}}'

# Test LLM
curl -X POST http://localhost:3001/api/integrations/core/invoke-llm \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello!","systemPrompt":"You are helpful."}'
```

---

## 🔒 Authentication

Most endpoints support optional authentication:
- **Development**: Works without auth (fallback user)
- **Production**: Requires JWT token in `Authorization: Bearer <token>` header

---

## 📊 Response Format

All responses are JSON:

**Success:**
```json
{
  "id": "123",
  "name": "Example",
  "created_at": "2025-12-01T00:00:00Z"
}
```

**Error:**
```json
{
  "error": "Error message here"
}
```

---

## 🌐 CORS

Allowed origins:
- `http://localhost:4173` (frontend)
- `http://localhost:3000`
- `https://affynix.ai`
- `https://admin.affynix.ai`
