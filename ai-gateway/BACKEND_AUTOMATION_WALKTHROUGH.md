# Backend Development Automation - Complete Walkthrough

## What This Does

This system automates repetitive backend development tasks. Instead of manually writing boilerplate code, you can ask the AI to generate it, or call APIs to get ready-to-use code.

---

## How to Use: Three Methods

### Method 1: Chat Interface (Easiest)
Talk to the AI in natural language via `/api/chat`

### Method 2: Direct API Calls
Call specific endpoints to generate code

### Method 3: Via Integration Agent
Use the agent system to execute backend tasks

---

## Walkthrough: All 12 Tools

### Tool 1: Generate API Route

**What it does:** Creates a complete Next.js API route file with validation, error handling, and TypeScript types.

#### Example 1: Via Chat
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Create an API route at /api/products that accepts POST requests. It should validate a product name (string), price (number), and category (string). It requires authentication and should save to Airtable."
    }]
  }'
```

**What you get back:** Complete route file code ready to copy/paste

#### Example 2: Via Direct API
```bash
curl -X POST https://ai.affynix.ai/api/backend/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "type": "route",
    "spec": {
      "method": "POST",
      "path": "/api/products",
      "description": "Create a new product and save to Airtable",
      "auth": true,
      "body": {
        "name": "string",
        "price": "number",
        "category": "string"
      },
      "response": {
        "id": "string",
        "success": "boolean"
      }
    }
  }'
```

**Response:**
```json
{
  "code": "import { NextRequest, NextResponse } from 'next/server';\nimport { requireAuth } from '../../../../lib/auth';\nimport { z } from 'zod';\n\nconst productSchema = z.object({\n  name: z.string(),\n  price: z.number(),\n  category: z.string()\n});\n\nexport async function POST(req: NextRequest) {\n  // ... complete route code ...\n}",
  "type": "route"
}
```

**Real-world use case:** You need a new API endpoint. Instead of writing 50+ lines of boilerplate, you get it in seconds.

---

### Tool 2: Generate TypeScript Types

**What it does:** Creates TypeScript type definitions from Airtable tables, JSON schemas, or descriptions.

#### Example 1: Generate Types from Airtable Table
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Generate TypeScript types for the Airtable Offers table"
    }]
  }'
```

#### Example 2: Generate Types from JSON Schema
```bash
curl -X POST https://ai.affynix.ai/api/backend/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "type": "types",
    "spec": {
      "source": "json",
      "schema": {
        "product": {
          "id": "string",
          "name": "string",
          "price": "number",
          "tags": ["string"]
        }
      }
    }
  }'
```

**Response:**
```json
{
  "types": "export interface Product {\n  id: string;\n  name: string;\n  price: number;\n  tags: string[];\n}\n\nexport interface AirtableProductRecord {\n  id: string;\n  createdTime: string;\n  fields: Product;\n}",
  "source": "json"
}
```

**Real-world use case:** Your Airtable schema changed. Instead of manually updating types, generate them automatically.

---

### Tool 3: Generate Integration Code

**What it does:** Creates integration code for Airtable, Vercel, or Cloudflare APIs.

#### Example: Generate Airtable Integration
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Generate code to fetch all records from the Offers table in Airtable and return them as an array"
    }]
  }'
```

**What you get:** Complete integration function with error handling, authentication, and TypeScript types.

**Real-world use case:** You need to integrate with a new service. Get production-ready integration code instantly.

---

### Tool 4: Generate Test Files

**What it does:** Creates complete test files for your API routes.

#### Example:
```bash
curl -X POST https://ai.affynix.ai/api/backend/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "type": "tests",
    "spec": {
      "routePath": "/api/products",
      "testFramework": "jest",
      "description": "Test the products API endpoint"
    }
  }'
```

**Response:** Complete test file with:
- Success case tests
- Error case tests
- Validation tests
- Mock setup

**Real-world use case:** You wrote a new route. Instead of manually writing 20+ test cases, get them generated automatically.

---

### Tool 5: Generate Deployment Script

**What it does:** Creates deployment scripts with validation and rollback.

#### Example:
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Create a deployment script for production that validates environment variables, runs tests, deploys to Vercel, and includes rollback if something goes wrong"
    }]
  }'
```

**What you get:** Complete bash script that:
- Validates env vars before deploy
- Runs tests
- Deploys to Vercel
- Includes rollback procedure
- Has health checks

**Real-world use case:** You need a safe deployment process. Get a complete script instead of writing it manually.

---

### Tool 6: Validate Environment Variables

**What it does:** Checks if all required environment variables are present.

#### Example:
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Validate that the project at /path/to/project has all required environment variables: OPENAI_API_KEY, AIRTABLE_API_KEY, VERCEL_API_TOKEN"
    }]
  }'
```

**Response:**
```json
{
  "valid": false,
  "missing": ["VERCEL_API_TOKEN"],
  "present": ["OPENAI_API_KEY", "AIRTABLE_API_KEY"]
}
```

**Real-world use case:** Before deploying, check if all env vars are set. Prevents deployment failures.

---

### Tool 7: Generate .env.example

**What it does:** Creates a `.env.example` file from your environment variable definitions.

#### Example:
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Generate a .env.example file for my project with these variables: OPENAI_API_KEY (required), AIRTABLE_API_KEY (required), VERCEL_API_TOKEN (optional)"
    }]
  }'
```

**What you get:** A properly formatted `.env.example` file with comments.

**Real-world use case:** New developers joining the project need to know what env vars to set. Auto-generate the example file.

---

### Tool 8: Sync Environment Variables

**What it does:** Copies environment variables from one project to another.

#### Example:
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Sync these environment variables from /path/to/source to /path/to/target: OPENAI_API_KEY, AIRTABLE_API_KEY"
    }]
  }'
```

**Real-world use case:** You have staging and production environments. Sync env vars between them automatically.

---

### Tool 9: Generate API Documentation

**What it does:** Creates API documentation in OpenAPI, Swagger, or Markdown format.

#### Example:
```bash
curl -X POST https://ai.affynix.ai/api/backend/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "type": "docs",
    "spec": {
      "format": "openapi",
      "routes": ["/api/products", "/api/users"],
      "routeFiles": ["app/api/products/route.ts", "app/api/users/route.ts"]
    }
  }'
```

**Response:** Complete OpenAPI 3.0 specification with all endpoints documented.

**Real-world use case:** You need to document your API. Instead of manually writing docs, generate them from your code.

---

### Tool 10: Analyze Code

**What it does:** Analyzes your code for patterns, issues, refactoring opportunities, and security concerns.

#### Example:
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Analyze the code in app/api/products/route.ts for security vulnerabilities and refactoring opportunities"
    }]
  }'
```

**Response:** Detailed analysis report with:
- Security issues found
- Refactoring suggestions
- Code quality improvements
- Specific line references

**Real-world use case:** Code review. Get AI-powered analysis of your code before merging.

---

### Tool 11: Generate Validators

**What it does:** Creates Zod/Yup/Joi validation schemas from TypeScript types.

#### Example:
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Generate Zod validation schemas from these TypeScript types: interface Product { name: string; price: number; category: string; }"
    }]
  }'
```

**Response:**
```typescript
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1)
});
```

**Real-world use case:** You have TypeScript types. Generate matching validation schemas automatically to keep them in sync.

---

### Tool 12: Generate Error Handlers

**What it does:** Creates standardized error handling code with logging and recovery.

#### Example:
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Generate error handling code for Next.js with logging and recovery patterns"
    }]
  }'
```

**Response:** Complete error handling system with:
- Standardized error response format
- Error logging
- Error recovery patterns
- HTTP status code mapping

**Real-world use case:** Consistent error handling across your API. Generate it once, use everywhere.

---

## Complete Workflow Examples

### Workflow 1: Create a New API Endpoint (Start to Finish)

**Step 1:** Generate the route
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Create a POST /api/orders endpoint that validates order data and saves to Airtable"
    }]
  }'
```
→ Get route code, copy to `app/api/orders/route.ts`

**Step 2:** Generate TypeScript types
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Generate TypeScript types for an Order with fields: id, customerEmail, items (array), total (number), status"
    }]
  }'
```
→ Get types, save to `types/order.ts`

**Step 3:** Generate validators
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Generate Zod schemas for the Order types I just created"
    }]
  }'
```
→ Get validators, add to route

**Step 4:** Generate tests
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Generate Jest tests for the /api/orders endpoint"
    }]
  }'
```
→ Get test file, save to `__tests__/api/orders.test.ts`

**Result:** Complete API endpoint with types, validation, and tests in minutes instead of hours.

---

### Workflow 2: Set Up a New Project

**Step 1:** Validate environment variables
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Check if my project has these required env vars: DATABASE_URL, API_KEY, SECRET_KEY"
    }]
  }'
```

**Step 2:** Generate .env.example
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Generate a .env.example file for my project"
    }]
  }'
```

**Step 3:** Generate deployment script
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Create a deployment script for Vercel that validates env vars before deploying"
    }]
  }'
```

**Result:** Project setup automated.

---

### Workflow 3: Code Review & Improvement

**Step 1:** Analyze code
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Analyze app/api/products/route.ts for security issues and refactoring opportunities"
    }]
  }'
```

**Step 2:** Generate improved error handling
```bash
curl -X POST https://ai.affynix.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Generate standardized error handling for this route"
    }]
  }'
```

**Result:** Code improved with security fixes and better error handling.

---

## Quick Reference: All Tools

| Tool | Chat Example | Use Case |
|------|-------------|----------|
| **Generate API Route** | "Create a POST /api/users endpoint" | New API endpoints |
| **Generate Types** | "Generate types for Airtable Offers table" | Type definitions |
| **Generate Integration** | "Create Airtable integration code" | Service integrations |
| **Generate Tests** | "Generate tests for /api/products" | Test files |
| **Generate Deployment** | "Create deployment script for production" | Deployment automation |
| **Validate Env Vars** | "Check if required env vars are set" | Pre-deployment checks |
| **Generate .env.example** | "Create .env.example file" | Project documentation |
| **Sync Env Vars** | "Sync env vars from staging to production" | Environment management |
| **Generate Docs** | "Generate OpenAPI docs for my API" | API documentation |
| **Analyze Code** | "Analyze this file for security issues" | Code review |
| **Generate Validators** | "Create Zod schemas from my types" | Request validation |
| **Generate Error Handlers** | "Generate error handling code" | Error management |

---

## Tips for Best Results

1. **Be specific in chat:** Instead of "create a route", say "create a POST /api/products route that validates name, price, and category, requires auth, and saves to Airtable"

2. **Use the API for automation:** If you're building a script, use the direct API endpoints instead of chat

3. **Combine tools:** Use multiple tools in sequence (route → types → validators → tests)

4. **Review generated code:** Always review the generated code before using it in production

5. **Iterate:** If the first result isn't perfect, ask for improvements

---

## Common Patterns

### Pattern 1: Full CRUD API
1. Generate route for CREATE
2. Generate route for READ
3. Generate route for UPDATE
4. Generate route for DELETE
5. Generate types once
6. Generate tests for all routes

### Pattern 2: New Integration
1. Generate integration code
2. Generate types for the service
3. Generate tests
4. Add to your project

### Pattern 3: Deployment Pipeline
1. Validate env vars
2. Generate deployment script
3. Generate health check
4. Set up scheduled deployment

---

## Need Help?

All tools are accessible via:
- **Chat:** `/api/chat` (natural language)
- **API:** `/api/backend/generate` and `/api/backend/deploy` (programmatic)
- **Agent:** `/api/agents` (automated workflows)

Just ask in natural language what you need, and the AI will use the right tools!

