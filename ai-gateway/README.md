# AI Gateway - Automation Platform

Full-featured AI automation platform deployed at `ai.affynix.ai` with agent capabilities, scheduled tasks, webhooks, and multi-step workflows.

## Features

### 🤖 Agent System
- **Content Agent**: Generate product descriptions, SEO content, subdomain-specific content
- **Data Agent**: Transform JSON, aggregate data, process datasets
- **Integration Agent**: HTTP requests, Affynix platform integration
- **Workflow Agent**: Execute multi-step workflows

### ⏰ Scheduled Tasks
- Cron-based task scheduling
- Support for prompts, webhooks, and workflows
- Task persistence and management via API

### 🔗 Webhooks
- ClickBank webhook handler
- Airtable webhook handler
- Generic webhook handler for custom integrations
- Signature verification support

### 🔄 Workflows
- Multi-step workflow engine with dependency management
- Pre-built workflows: Content Generation, Data Sync, Product Updates
- Context interpolation between steps
- Retry logic and error handling

### 🛠️ Tools Library
- File operations (read, write, list)
- HTTP client (GET, POST)
- Data processing (transform, aggregate)
- Content generation
- Affynix platform integration

## API Endpoints

### Chat
- `POST /api/chat` - AI chat with tool support

### Tasks
- `GET /api/tasks` - List all scheduled tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Webhooks
- `POST /api/webhooks?handler=clickbank|airtable|generic` - Receive webhook
- `GET /api/webhooks` - List webhook configurations

### Workflows
- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create or execute workflow
- `GET /api/workflows/:id` - Get workflow details
- `POST /api/workflows/:id` - Execute workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow

### Agents
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create agent or execute task
- `GET /api/agents/:id` - Get agent status
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

## Environment Variables

```env
# AI Gateway
AI_GATEWAY_API_KEY=your_api_key_here
VERCEL_KEY=your_vercel_key_here

# Task Queue (Optional)
REDIS_URL=redis://localhost:6379

# Security
WEBHOOK_SECRET=your_webhook_secret

# Integrations
AFFYNIX_API_KEY=your_affynix_api_key
AFFYNIX_API_BASE=https://affynix.com/api
CLICKBANK_API_KEY=your_clickbank_key
# Domain
NEXT_PUBLIC_DOMAIN=ai.affynix.ai
```

## Installation

```bash
pnpm install
```

## Development

```bash
# Run gateway
pnpm dev

# Run scheduler worker
pnpm scheduler

# Test
pnpm test
```

## Deployment

```bash
# Deploy to Vercel
pnpm deploy

# Health check
pnpm health-check
```

## Usage Examples

### Create a Scheduled Task

```bash
curl -X POST https://ai.affynix.ai/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Content Generation",
    "cronExpression": "0 9 * * *",
    "action": {
      "type": "prompt",
      "config": {
        "prompt": "Generate today's featured content"
      }
    }
  }'
```

### Execute a Workflow

```bash
curl -X POST https://ai.affynix.ai/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "action": "execute",
    "workflow": {
      "id": "workflow-id",
      "name": "Content Generation",
      "steps": [...]
    },
    "initialData": {
      "topic": "Digital Marketing",
      "keywords": ["SEO", "content marketing"]
    }
  }'
```

### Execute an Agent Task

```bash
curl -X POST https://ai.affynix.ai/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "action": "execute",
    "task": {
      "agentId": "agent-id",
      "task": "generate_product_description",
      "parameters": {
        "productName": "SEO Tool",
        "category": "Digital Marketing"
      }
    }
  }'
```

## Architecture

- **Tools**: Reusable automation functions
- **Agents**: Specialized automation handlers
- **Workflows**: Multi-step automation orchestration
- **Scheduler**: Cron-based task execution
- **Webhooks**: Event-driven automation triggers

## License

ISC
