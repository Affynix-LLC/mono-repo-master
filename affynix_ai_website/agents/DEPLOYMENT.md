# Agents.Affynix.ai Deployment Guide

This is the agent sales and marketing site for Affynix, hosted at `agents.affynix.ai`.

## Structure

- **Home** (`/`) - Main landing page with hero, agent previews, and contact form
- **Agents** (`/Agents`) - Detailed agent information and pricing
- **Pricing** (`/Pricing`) - Pricing plans and checkout
- **Consulting** (`/Consulting`) - Consulting intake form
- **Calculator** (`/Calculator`) - ROI calculator
- **Onboarding** (`/Onboarding`) - Client onboarding flow

## Deployment to Vercel

### Prerequisites
- Vercel account connected to your GitHub repo
- Environment variables configured

### Steps

1. **Navigate to the agents directory:**
   ```bash
   cd affynix_ai_website/agents
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

   Or connect via Vercel dashboard:
   - Root Directory: `affynix_ai_website/agents`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configure Domain:**
   - In Vercel dashboard, add `agents.affynix.ai` as a custom domain
   - Update DNS records as needed

## Environment Variables

Set these in Vercel dashboard or `.env` file:

```bash
# Backend API URL
VITE_API_URL=https://api.affynix.ai

# OpenAI Assistant ID (optional - for chat widget)
VITE_OPENAI_ASSISTANT_ID=your_assistant_id_here
```

## Features

✅ **API Integration** - All forms connect to `api.affynix.ai`
✅ **Intake Forms** - Consulting and contact forms save to database
✅ **OpenAI Assistant** - Chat widget (if assistant ID is configured)
✅ **Responsive Design** - Mobile-friendly UI
✅ **SEO Optimized** - Meta tags and structured content

## API Endpoints Used

- `POST /api/entities/IntakeSubmission` - Save intake forms
- `POST /api/functions/:functionName` - Invoke backend functions
- `POST /api/assistant` - OpenAI Assistant API (if configured)

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` (or the port Vite assigns)

## Build

```bash
npm run build
```

Output will be in `dist/` directory.

