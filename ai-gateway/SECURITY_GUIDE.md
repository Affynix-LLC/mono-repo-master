# Security Guide - Safest Configuration

## Recommended Security Setup

### 1. Disable Vercel Authentication
**Why:** Vercel Authentication blocks all unauthenticated requests, preventing webhooks and external services from accessing your API.

**How:**
1. Go to: https://vercel.com/affynix/ai-gateway/settings/deployment-protection
2. Disable "Vercel Authentication" for Production
3. Save and redeploy

### 2. Add API Key Authentication
**Why:** Provides your own security layer that you control, allowing webhooks while protecting admin endpoints.

**Implementation:**
- All endpoints now require API key authentication
- Webhooks use signature verification (separate security)
- Chat endpoint can be public or protected (configurable)

### 3. Set Environment Variables

**Required:**
```bash
# Set a secure API key for your endpoints
API_KEY=your-secure-random-api-key-here

# Or use existing key
AI_GATEWAY_API_KEY=your-key-here
```

**Set in Vercel:**
```bash
vercel env add API_KEY production
# Enter your secure API key when prompted
```

### 4. Using the API

**With API Key:**
```bash
# Method 1: x-api-key header
curl -H "x-api-key: your-api-key" https://ai.affynix.ai/api/tasks

# Method 2: Authorization header
curl -H "Authorization: Bearer your-api-key" https://ai.affynix.ai/api/tasks
```

**Webhooks (No API Key Required):**
Webhooks use signature verification instead:
```bash
# Webhooks verify signatures automatically
curl -X POST https://ai.affynix.ai/api/webhooks?handler=clickbank \
  -H "x-webhook-signature: signature-here" \
  -d '{"data": "..."}'
```

## Security Features

✅ **API Key Authentication** - All admin endpoints protected
✅ **Webhook Signature Verification** - Webhooks verified by signature
✅ **Fail-Secure** - If no API key configured, all access denied
✅ **Multiple Auth Methods** - Supports x-api-key and Authorization headers
✅ **CORS Protection** - Configurable origin whitelist

## Endpoint Security

| Endpoint | Auth Required | Notes |
|----------|--------------|-------|
| `/api/chat` | Optional | Can be public or protected |
| `/api/tasks` | ✅ Yes | Admin endpoint |
| `/api/workflows` | ✅ Yes | Admin endpoint |
| `/api/agents` | ✅ Yes | Admin endpoint |
| `/api/webhooks` | Signature | Uses webhook signature verification |

## Best Practices

1. **Generate Strong API Keys**
   ```bash
   # Generate a secure random key
   openssl rand -hex 32
   ```

2. **Rotate Keys Regularly**
   - Change API keys every 90 days
   - Update in Vercel environment variables

3. **Use Different Keys for Different Services**
   - Admin operations: Strong key
   - Webhooks: Signature-based (no key needed)
   - Public endpoints: Optional or separate key

4. **Monitor Access**
   - Check Vercel logs for unauthorized attempts
   - Set up alerts for 401 errors

5. **Rate Limiting** (Future Enhancement)
   - Add rate limiting middleware
   - Prevent abuse

## Current Security Status

- ✅ API Key Authentication: Implemented
- ⚠️ Vercel Authentication: Still active (needs disabling)
- ✅ Webhook Signatures: Implemented
- ⚠️ Rate Limiting: Not yet implemented
- ⚠️ CORS: Basic implementation

## Next Steps

1. **Disable Vercel Authentication** (Required)
2. **Set API_KEY environment variable** (Required)
3. **Redeploy** after changes
4. **Test endpoints** with API key
5. **Configure DNS** for ai.affynix.ai

