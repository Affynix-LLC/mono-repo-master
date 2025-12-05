# Security Architecture - Should the Site Be Accessible?

## Answer: YES, but with API Key Protection

The AI Gateway **should be accessible** at `ai.affynix.ai`, but it's **protected by API key authentication**.

## Security Layers

### Layer 1: Public Access (Required)
- ✅ Site must be publicly accessible
- ✅ Why: Webhooks from ClickBank, Airtable, etc. need to reach it
- ✅ Why: External services need to call your API
- ✅ Why: Scheduled tasks need to trigger endpoints

### Layer 2: API Key Authentication (Your Protection)
- ✅ All admin endpoints require API key
- ✅ Without API key: Returns 401 Unauthorized
- ✅ With valid API key: Access granted
- ✅ This is YOUR security layer

### Layer 3: Webhook Signature Verification
- ✅ Webhooks use signature verification (separate from API keys)
- ✅ Each webhook can have its own secret
- ✅ More secure than API keys for webhook endpoints

## What Should Be Accessible?

| Endpoint | Public Access | Protection |
|----------|--------------|------------|
| `/api/chat` | ✅ Yes | Optional API key (can be public) |
| `/api/tasks` | ✅ Yes | **API Key Required** |
| `/api/workflows` | ✅ Yes | **API Key Required** |
| `/api/agents` | ✅ Yes | **API Key Required** |
| `/api/webhooks` | ✅ Yes | **Signature Verification** |

## Current Setup

1. **Vercel Authentication**: Currently ON (blocks everything)
   - ❌ This prevents webhooks from reaching your API
   - ❌ This prevents external services from calling it
   - **Action Needed**: Disable this

2. **API Key Authentication**: ✅ Implemented
   - ✅ All endpoints check for API key
   - ✅ Returns 401 if missing/invalid
   - ✅ This is your security layer

3. **Domain**: `ai.affynix.ai`
   - Should point to: Vercel deployment
   - DNS: CNAME `ai` → Vercel deployment URL

## Recommended Configuration

### ✅ DO THIS:
1. **Disable Vercel Authentication** (so webhooks can reach it)
2. **Keep API Key Authentication** (your security layer)
3. **Point `ai.affynix.ai` to Vercel** (make it accessible)
4. **Use API keys for all admin operations**

### ❌ DON'T DO THIS:
1. ❌ Keep Vercel Authentication ON (blocks webhooks)
2. ❌ Make endpoints completely public without API keys
3. ❌ Point domain to a different service

## Security Model

```
Internet
   ↓
[Public Access] ← Anyone can reach the URL
   ↓
[Vercel Deployment] ← No Vercel Auth (disabled)
   ↓
[API Key Check] ← Your security layer
   ↓
[Endpoint Handler] ← Only if API key valid
```

## Why This Works

1. **Public URL**: Webhooks and external services can reach it
2. **API Key Protection**: Only requests with valid API key get through
3. **Fail Secure**: If no API key configured, all access denied
4. **Flexible**: Different endpoints can have different security levels

## Example Flow

### ✅ Valid Request (with API key):
```bash
curl -H "x-api-key: your-key" https://ai.affynix.ai/api/tasks
# → 200 OK (access granted)
```

### ❌ Invalid Request (no API key):
```bash
curl https://ai.affynix.ai/api/tasks
# → 401 Unauthorized (access denied)
```

### ✅ Webhook (with signature):
```bash
curl -X POST https://ai.affynix.ai/api/webhooks?handler=clickbank \
  -H "x-webhook-signature: valid-signature" \
  -d '{"data": "..."}'
# → 200 OK (signature verified)
```

## Summary

**The site SHOULD be accessible** at `ai.affynix.ai`, but it's **protected by API key authentication**. This allows:
- ✅ Webhooks to reach your API
- ✅ External services to integrate
- ✅ Your automation to work
- ✅ Security through API keys

**Think of it like a locked door with a keypad** - anyone can approach the door (public URL), but only those with the code (API key) can enter.

