# Affynix Perpetual Automation System - Deployment Guide

This guide covers deploying the Affynix Perpetual Automation System to production.

---

## Prerequisites

- Node.js 20.x
- AI Gateway deployed and running
- Environment variables configured
- API keys for integrations (OpenAI, CRM, Email, etc.)

---

## Deployment Steps

### 1. Install Dependencies

```bash
cd ai-gateway
npm install
```

### 2. Configure Environment Variables

Create or update `.env` file:

```env
# Core Configuration
NODE_ENV=production
AI_GATEWAY_API_KEY=your_api_key_here

# AI Configuration
AI_MODEL=gpt-4
OPENAI_API_KEY=your_openai_key

# Email Integration (Optional)
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=your_sendgrid_key

# CRM Integration (Optional)
CRM_PROVIDER=hubspot
CRM_API_KEY=your_hubspot_key

# LinkedIn Integration (Optional)
LINKEDIN_API_KEY=your_linkedin_key

# Zapier Integration (Optional)
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/...

# Storage (Airtable)
AIRTABLE_API_KEY=your_airtable_key
AIRTABLE_BASE_ID=your_base_id

# Monitoring
ENABLE_MONITORING=true
METRICS_INTERVAL=3600
```

### 3. Build the Application

```bash
npm run build
```

### 4. Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add AI_MODEL
vercel env add OPENAI_API_KEY
vercel env add EMAIL_API_KEY
vercel env add CRM_API_KEY
# ... add all required env vars
```

### 5. Verify Deployment

```bash
# Check system status
curl https://your-domain.vercel.app/api/perpetual-automation?action=status

# Get metrics
curl https://your-domain.vercel.app/api/perpetual-automation?action=metrics
```

---

## API Endpoints

Once deployed, the following endpoints are available:

### Status Check
```
GET https://your-domain.vercel.app/api/perpetual-automation?action=status
```

### Ingest Lead
```
POST https://your-domain.vercel.app/api/perpetual-automation
Content-Type: application/json

{
  "action": "ingest_lead",
  "sourceType": "email",
  "data": {
    "from": "john@example.com",
    "formData": {
      "name": "John Doe",
      "company": "Acme Corp",
      "message": "Interested in automation"
    }
  }
}
```

### Get Metrics
```
GET https://your-domain.vercel.app/api/perpetual-automation?action=metrics
```

---

## Integration Setup

### Email Integration (Contact Forms)

Configure your contact form to POST to:
```
https://your-domain.vercel.app/api/perpetual-automation
```

With payload:
```json
{
  "action": "ingest_lead",
  "sourceType": "email",
  "data": {
    "from": "{{email}}",
    "formData": {
      "name": "{{name}}",
      "company": "{{company}}",
      "phone": "{{phone}}",
      "message": "{{message}}"
    }
  }
}
```

### CRM Integration (HubSpot Example)

1. Create HubSpot Workflow
2. Add webhook action:
   - URL: `https://your-domain.vercel.app/api/perpetual-automation`
   - Method: POST
   - Body:
   ```json
   {
     "action": "ingest_lead",
     "sourceType": "crm",
     "data": {
       "id": "{{contact.id}}",
       "provider": "hubspot",
       "firstName": "{{contact.firstname}}",
       "lastName": "{{contact.lastname}}",
       "email": "{{contact.email}}",
       "phone": "{{contact.phone}}",
       "company": "{{contact.company}}",
       "leadScore": "{{contact.score}}"
     }
   }
   ```

### LinkedIn Lead Gen Forms

1. Set up LinkedIn Campaign
2. Configure Lead Gen Form
3. Create Zapier Zap:
   - Trigger: New LinkedIn Lead
   - Action: Webhook POST to perpetual automation API

### Zapier Integration

1. Create Zap with trigger of your choice
2. Add Webhook POST action:
   - URL: `https://your-domain.vercel.app/api/perpetual-automation`
   - Payload Type: JSON
   - Data:
   ```json
   {
     "action": "ingest_lead",
     "sourceType": "webhook",
     "data": {
       "name": "{{name}}",
       "email": "{{email}}",
       "phone": "{{phone}}",
       "company": "{{company}}",
       "message": "{{message}}",
       "source": "zapier",
       "campaign": "{{utm_campaign}}"
     }
   }
   ```

---

## Scheduled Jobs Setup

The perpetual automation system requires scheduled execution of agent calls. Set up cron jobs or use a service like Vercel Cron Jobs.

### Example: Vercel Cron Configuration

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/perpetual-automation/cron/execute-scheduled-calls",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

Create cron handler at `app/api/perpetual-automation/cron/execute-scheduled-calls/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
// Import orchestrator and execute scheduled calls

export async function GET(request: NextRequest) {
  // Check authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Execute scheduled calls logic here
  // ... implementation

  return NextResponse.json({ success: true });
}
```

---

## Monitoring Setup

### Health Checks

Set up health check monitoring:
```bash
# Add to your monitoring service (e.g., UptimeRobot, Pingdom)
https://your-domain.vercel.app/api/perpetual-automation?action=status
```

Expected response:
```json
{
  "success": true,
  "status": "operational",
  "timestamp": "2026-01-21T10:00:00Z"
}
```

### Metrics Dashboard

Query metrics endpoint regularly:
```bash
curl https://your-domain.vercel.app/api/perpetual-automation?action=metrics
```

Set up alerts based on:
- No-show rate > 20%
- Timeout rate > 10%
- Avg qualification score < 50
- Conversion rate drops

### Audit Log Monitoring

Periodically review audit logs:
```bash
curl -X POST https://your-domain.vercel.app/api/perpetual-automation \
  -H "Content-Type: application/json" \
  -d '{"action": "get_audit_logs", "eventType": "call_completed"}'
```

---

## Testing in Production

### 1. Test Lead Ingestion

```bash
curl -X POST https://your-domain.vercel.app/api/perpetual-automation \
  -H "Content-Type: application/json" \
  -d '{
    "action": "ingest_lead",
    "sourceType": "email",
    "data": {
      "from": "test@example.com",
      "formData": {
        "name": "Test User",
        "company": "Test Corp",
        "email": "test@example.com",
        "message": "This is a test lead"
      }
    }
  }'
```

### 2. Verify Lead Created

```bash
# Use leadId from previous response
curl "https://your-domain.vercel.app/api/perpetual-automation?action=lead&leadId=lead_123"
```

### 3. Check Metrics

```bash
curl https://your-domain.vercel.app/api/perpetual-automation?action=metrics
```

---

## Scaling Considerations

### Concurrent Call Handling

The system can handle multiple agent calls concurrently. Monitor:
- API response times
- OpenAI API rate limits
- Database connection pool size

### Storage Scaling

As the system processes more leads:
- Monitor Airtable record limits (50,000 per base)
- Consider migrating to PostgreSQL for large-scale operations
- Implement data archiving for old leads

### Cost Optimization

- Use GPT-3.5-turbo for Agent01 (intake) calls
- Reserve GPT-4 for Agent02 (discovery) and brief generation
- Implement caching for repeated queries
- Monitor OpenAI token usage

---

## Backup and Recovery

### Data Backup

Set up regular backups of:
- Lead data
- Agent call sessions
- Executive briefs
- Audit logs

### Disaster Recovery

1. Export configuration to version control
2. Document integration setup
3. Test restore procedure monthly
4. Keep offline copies of critical data

---

## Security Best Practices

1. **API Authentication**: Require API keys for all endpoints
2. **Rate Limiting**: Implement rate limiting on ingestion endpoints
3. **Data Encryption**: Encrypt sensitive lead data at rest
4. **Access Control**: Restrict admin endpoints to authorized users
5. **Audit Logging**: Enable comprehensive audit logging
6. **Regular Updates**: Keep dependencies up to date

---

## Troubleshooting

### Lead ingestion fails
- Check API endpoint availability
- Verify authentication headers
- Review error logs

### Agent calls not executing
- Check scheduled job is running
- Verify OpenAI API key is valid
- Review call session status

### Metrics not updating
- Verify orchestrator is initialized
- Check metrics tracker registration
- Review console logs

---

## Support

For deployment issues:
- Check logs: `vercel logs`
- Review documentation: `/ai-gateway/lib/perpetual-automation/README.md`
- Contact: team@affynix.ai

---

## Rollback Procedure

If issues arise:

1. Revert to previous deployment:
   ```bash
   vercel rollback
   ```

2. Restore environment variables from backup

3. Notify affected integrations

4. Monitor system health

---

**System Ready for Production** ✓

The Affynix Perpetual Automation System is now deployed and ready to process leads through the multi-agent sales funnel.
