# API Key Setup Guide

## What is the API Key?

The API key is a **secret token** you create to secure your AI Gateway endpoints. It's like a password that allows access to your automation platform.

## Generate Your API Key

You need to **create your own secure API key**. Here are options:

### Option 1: Generate with OpenSSL (Recommended)
```bash
openssl rand -hex 32
```

This generates a secure 64-character random key like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Option 2: Generate Online
- Use a secure random generator
- Make it at least 32 characters long
- Use letters, numbers, and symbols

### Option 3: Use Existing Key
If you have an `AI_GATEWAY_API_KEY` already set, you can use that.

## Set the API Key in Vercel

### Method 1: Via Vercel CLI
```bash
vercel env add API_KEY production
# When prompted, paste your generated API key
```

### Method 2: Via Vercel Dashboard
1. Go to: https://vercel.com/affynix/ai-gateway/settings/environment-variables
2. Click "Add New"
3. Name: `API_KEY`
4. Value: [paste your generated key]
5. Environment: Select "Production"
6. Click "Save"

## Using the API Key

Once set, include it in API requests:

### Method 1: x-api-key Header
```bash
curl -H "x-api-key: your-api-key-here" \
  https://ai.affynix.ai/api/tasks
```

### Method 2: Authorization Header
```bash
curl -H "Authorization: Bearer your-api-key-here" \
  https://ai.affynix.ai/api/tasks
```

## Which Environment Variable?

The auth system checks for these (in order):
1. `API_KEY` - Your custom API key (recommended)
2. `AI_GATEWAY_API_KEY` - Vercel AI Gateway key (if you want to reuse it)
3. `VERCEL_PROTECTION_BYPASS` - Vercel bypass token (if using protection)

**Recommendation:** Use `API_KEY` for clarity and separation of concerns.

## Security Notes

- ✅ **Keep it secret** - Never commit API keys to git
- ✅ **Use different keys** - Different keys for dev/prod
- ✅ **Rotate regularly** - Change keys every 90 days
- ✅ **Use strong keys** - At least 32 characters, random

## Current Status

Check if API key is set:
```bash
vercel env ls
```

Look for `API_KEY` in the list. If not set, you'll get 401 errors when calling endpoints.

