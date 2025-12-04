# Quick Start Guide

## What's Been Built

A complete AI automation platform with:

✅ **Function Calling** - AI can use tools (file ops, HTTP, data processing, content generation)
✅ **Scheduled Tasks** - Cron-based automation with persistence
✅ **Webhooks** - Event-driven automation (ClickBank, Airtable, generic)
✅ **Workflows** - Multi-step automation with dependencies
✅ **Affynix Integration** - Platform-specific tools and APIs
✅ **Agent System** - Specialized agents for content, data, integration, workflows
✅ **Deployment Ready** - Configured for ai.affynix.ai

## Immediate Use Cases

### 1. Generate Content Automatically
```bash
curl -X POST https://ai.affynix.ai/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "action": "execute",
    "task": {
      "agentId": "content-agent-id",
      "task": "generate_subdomain_content",
      "parameters": {
        "subdomain": "business",
        "topic": "Digital Marketing Strategies",
        "keywords": ["SEO", "content marketing", "social media"]
      }
    }
  }'
```

### 2. Schedule Daily Tasks
```bash
curl -X POST https://ai.affynix.ai/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Product Updates",
    "cronExpression": "0 9 * * *",
    "action": {
      "type": "prompt",
      "config": {
        "prompt": "Check for new products and update descriptions"
      }
    }
  }'
```

### 3. Create a Workflow
```bash
curl -X POST https://ai.affynix.ai/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": {
      "name": "Product Content Pipeline",
      "steps": [
        {
          "id": "fetch",
          "name": "Fetch Product",
          "type": "tool",
          "config": {
            "tool": "get_affynix_products",
            "args": { "subdomain": "business" }
          }
        },
        {
          "id": "generate",
          "name": "Generate Description",
          "type": "tool",
          "config": {
            "tool": "generate_product_description",
            "args": {
              "productName": "{{fetch.name}}",
              "category": "{{fetch.category}}"
            }
          },
          "dependsOn": ["fetch"]
        }
      ]
    }
  }'
```

## Available Tools

- `read_file`, `write_file`, `list_directory` - File operations
- `http_get`, `http_post` - HTTP requests
- `transform_json`, `aggregate_data` - Data processing
- `generate_product_description`, `generate_seo_content` - Content generation
- `get_affynix_products`, `update_affynix_product`, `create_affynix_product` - Affynix platform
- `generate_subdomain_content`, `optimize_product_description` - Affynix content
- `get_affynix_analytics`, `generate_analytics_report` - Analytics

## Next Steps

1. **Set Environment Variables** - Configure API keys in Vercel dashboard
2. **Deploy** - Run `pnpm deploy` or push to Vercel-connected repo
3. **Configure Domain** - Add `ai.affynix.ai` in Vercel dashboard
4. **Test Endpoints** - Use health-check script or test API endpoints
5. **Create Agents** - Set up specialized agents for your use cases
6. **Schedule Tasks** - Create recurring automation tasks
7. **Set Up Webhooks** - Configure webhook endpoints for external services

## Deployment

```bash
# Install dependencies
pnpm install

# Deploy to Vercel
pnpm deploy

# Or use Vercel CLI directly
vercel --prod
```

## Environment Setup

Set these in Vercel dashboard under Project Settings > Environment Variables:

- `AI_GATEWAY_API_KEY` - Required
- `AFFYNIX_API_KEY` - For platform integration
- `WEBHOOK_SECRET` - For webhook security
- Other optional variables as needed

## Support

Check `README.md` for full API documentation and examples.

