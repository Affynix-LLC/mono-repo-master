# Disable Vercel Deployment Protection

The AI Gateway API endpoints are currently protected by Vercel Authentication. To make them publicly accessible:

## Option 1: Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/affynix/ai-gateway/settings/deployment-protection
2. Find "Vercel Authentication" section
3. **Disable** protection for Production deployments
4. Save changes
5. Redeploy: `vercel --prod`

## Option 2: Via Vercel CLI

```bash
# Check current protection settings
vercel project ls

# Note: Protection settings may need to be changed via dashboard
# CLI doesn't have direct command for this
```

## Option 3: Configure Custom Domain

Once `ai.affynix.ai` is configured:
- Custom domains may have different protection settings
- You can configure protection per domain

## After Disabling Protection

Test endpoints:
```bash
pnpm test-endpoints ai-gateway-m542i5ihu-affynix.vercel.app
```

Or test manually:
```bash
curl https://ai-gateway-m542i5ihu-affynix.vercel.app/api/tasks
```

## Current Status

- ✅ Deployment: Live
- ✅ Environment Variables: OPENAI_API_KEY set
- ⚠️ Protection: Active (blocking API access)
- ⚠️ Domain: ai.affynix.ai needs DNS configuration

