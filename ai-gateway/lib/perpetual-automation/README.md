# Affynix Perpetual Automation System

**Multi-agent sales funnel with AI-powered lead qualification, discovery, and human handoff**

---

## Overview

The Affynix Perpetual Automation System is a comprehensive, automated sales funnel that processes leads through a multi-stage qualification process using AI agents, culminating in a prepared handoff to human consultants.

### Key Features

- ✅ **Multi-Agent Sales Funnel**: Agent01 (intake) → Agent02 (discovery) → Human consultation
- ✅ **Multi-Source Lead Ingestion**: Email, CRM, LinkedIn, Webhooks
- ✅ **Timing Constraints**: 5-minute max call duration, 24-48hr buffer between stages
- ✅ **Executive Brief Generation**: Comprehensive briefs with sentiment analysis
- ✅ **Comprehensive Monitoring**: Audit logs, performance metrics, alerts
- ✅ **Production-Ready**: Error handling, retries, graceful degradation

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Lead Ingestion Layer                      │
│  Email │ CRM │ LinkedIn │ Webhooks  →  Ingestion Router    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Agent01 (Intake)                        │
│  • 5-minute call limit                                       │
│  • Basic qualification                                       │
│  • Needs assessment                                          │
│  • Qualification score (0-100)                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    24-48 Hour Buffer
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Agent02 (Discovery)                       │
│  • 5-minute call limit                                       │
│  • Technical discovery                                       │
│  • Integration assessment                                    │
│  • Sentiment analysis                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Executive Brief Generator                   │
│  • Sentiment analysis (overall, engagement, urgency)        │
│  • Opportunity assessment                                    │
│  • Key findings & recommendations                            │
│  • Talking points for consultant                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    24-48 Hour Buffer
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Human Consultation                        │
│  • Pre-prepared executive brief                              │
│  • Complete lead history                                     │
│  • Strategic talking points                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Installation

```bash
cd ai-gateway/lib/perpetual-automation
npm install
```

### Basic Usage

```typescript
import { createOrchestrator, defaultConfig } from '@/lib/perpetual-automation';

// Create and initialize orchestrator
const orchestrator = await createOrchestrator(defaultConfig);

// Ingest a lead
const result = await orchestrator.ingestLead('email', {
  from: 'john@example.com',
  formData: {
    name: 'John Doe',
    company: 'Acme Corp',
    phone: '+1-555-0123',
    message: 'Interested in AI automation solutions',
  },
});

// Lead automatically flows through the pipeline:
// 1. Agent01 call scheduled
// 2. Agent01 executed (5-min limit)
// 3. If qualified: Agent02 scheduled (24-48hr buffer)
// 4. Agent02 executed (5-min limit)
// 5. Executive brief generated
// 6. Human consultant notified
```

---

## Components

### 1. Lead Ingestion

Processes leads from multiple sources:

```typescript
// Email
await orchestrator.ingestLead('email', emailData);

// CRM (Salesforce, HubSpot, etc.)
await orchestrator.ingestLead('crm', crmData);

// LinkedIn Lead Gen Forms
await orchestrator.ingestLead('linkedin', linkedinData);

// Generic Webhook
await orchestrator.ingestLead('webhook', webhookData);
```

### 2. Agent01 - Intake Agent

**Purpose**: Quick qualification and needs assessment

**Responsibilities**:
- Introduce Affynix and establish rapport
- Identify business challenges
- Assess budget range and decision authority
- Determine urgency and timeline
- Qualify for Agent02 call

**Constraints**:
- Maximum 5-minute call duration
- Qualification score output (0-100)
- Focus on qualification, not selling

### 3. Agent02 - Discovery Agent

**Purpose**: Deep technical and business discovery

**Responsibilities**:
- Technical requirements gathering
- Current systems assessment
- Integration needs identification
- Compliance/security requirements
- Success metrics definition
- Prepare data for executive brief

**Constraints**:
- Maximum 5-minute call duration
- Detailed sentiment analysis
- Comprehensive discovery documentation

### 4. Scheduling System

**Buffer Scheduler**:
- Enforces 24-48 hour buffer between agent calls
- Respects business hours and timezone
- Handles rescheduling with exponential backoff

**Call Limiter**:
- Enforces 5-minute maximum call duration
- Warning at 80% of time limit
- 30-second grace period before force timeout

### 5. Executive Brief Generator

Generates comprehensive briefs including:

- **Executive Summary**: 2-3 sentence overview
- **Lead Profile**: Company, industry, size, revenue
- **Opportunity Analysis**: Estimated value, timeline, probability
- **Sentiment Analysis**:
  - Overall sentiment (-1 to 1)
  - Engagement score (0-1)
  - Urgency score (0-1)
  - Readiness to buy (0-1)
  - Concerns and positive signals
- **Key Findings**: Strengths, concerns, blockers, opportunities
- **Next Steps**: Immediate, short-term, long-term actions
- **Consultant Materials**: Talking points, questions to ask

### 6. Monitoring & Audit Logging

**Audit Logger**:
- Comprehensive event logging
- Correlation IDs for tracing
- Change tracking (before/after)

**Metrics Tracker**:
- Lead counts by status
- Conversion rates (Agent01→Agent02, Agent02→Human)
- Performance metrics (avg call duration, buffer time)
- Quality metrics (qualification scores, sentiment, no-show rate)

---

## API Endpoints

### Ingest Lead

```bash
POST /api/perpetual-automation
Content-Type: application/json

{
  "action": "ingest_lead",
  "sourceType": "email",
  "data": {
    "from": "john@example.com",
    "formData": {
      "name": "John Doe",
      "company": "Acme Corp",
      "message": "Need automation help"
    }
  }
}
```

### Execute Agent Call

```bash
POST /api/perpetual-automation
Content-Type: application/json

{
  "action": "execute_agent01",
  "sessionId": "sess_1234567890_abc123"
}
```

### Get Metrics

```bash
GET /api/perpetual-automation?action=metrics
```

Response:
```json
{
  "success": true,
  "metrics": {
    "timestamp": "2026-01-21T10:00:00Z",
    "leads": {
      "new": 10,
      "agent01_scheduled": 5,
      "agent01_completed": 8,
      "agent02_scheduled": 3,
      "agent02_completed": 5,
      "human_ready": 4,
      "converted": 2,
      "disqualified": 3
    },
    "conversionRates": {
      "agent01_to_agent02": 62.5,
      "agent02_to_human": 80.0,
      "human_to_converted": 50.0,
      "overall": 6.7
    },
    "performance": {
      "avgAgent01Duration": 245,
      "avgAgent02Duration": 280,
      "avgBufferTime": 36.5,
      "avgTimeToConversion": 5.2
    },
    "quality": {
      "avgQualificationScore": 68,
      "avgSentimentScore": 0.65,
      "noShowRate": 5.0,
      "timeoutRate": 2.0
    }
  }
}
```

### Get Lead

```bash
GET /api/perpetual-automation?action=lead&leadId=lead_123
```

### Get Audit Logs

```bash
POST /api/perpetual-automation
Content-Type: application/json

{
  "action": "get_audit_logs",
  "correlationId": "corr_1234567890_abc123"
}
```

---

## Configuration

### Environment Variables

```env
# AI Configuration
AI_MODEL=gpt-4
OPENAI_API_KEY=your_key_here

# Email Integration
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=your_key_here

# CRM Integration
CRM_PROVIDER=hubspot
CRM_API_KEY=your_key_here

# LinkedIn Integration
LINKEDIN_API_KEY=your_key_here

# Zapier Integration
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/...

# Storage
AIRTABLE_API_KEY=your_key_here
AIRTABLE_BASE_ID=your_base_id
```

### Orchestrator Configuration

```typescript
const config: OrchestratorConfig = {
  scheduling: {
    minBufferHours: 24,
    maxBufferHours: 48,
    maxCallDurationMinutes: 5,
    businessHoursStart: 9,
    businessHoursEnd: 17,
    allowedDays: [1, 2, 3, 4, 5], // Mon-Fri
    timezone: 'America/New_York',
    maxRescheduleAttempts: 3,
    rescheduleDelayHours: 24,
  },
  integrations: { /* ... */ },
  ai: { /* ... */ },
  storage: { /* ... */ },
  monitoring: {
    enabled: true,
    metricsInterval: 3600,
    alertThresholds: {
      noShowRate: 20,
      timeoutRate: 10,
      minQualificationScore: 50,
    },
  },
};
```

---

## Workflows

### Complete Sales Funnel Workflow

```typescript
import { salesFunnelWorkflow } from '@/lib/perpetual-automation';
import { workflowEngine } from '@/lib/workflows/engine';

// Execute complete funnel
const execution = await workflowEngine.execute(salesFunnelWorkflow, {
  sourceType: 'email',
  leadData: { /* ... */ },
});
```

### Disqualified Lead Nurture

```typescript
import { disqualifiedLeadWorkflow } from '@/lib/perpetual-automation';

await workflowEngine.execute(disqualifiedLeadWorkflow, {
  leadId: 'lead_123',
  leadEmail: 'john@example.com',
  leadName: 'John Doe',
  reason: 'Budget constraints',
});
```

### Emergency Escalation

```typescript
import { emergencyEscalationWorkflow } from '@/lib/perpetual-automation';

await workflowEngine.execute(emergencyEscalationWorkflow, {
  leadId: 'lead_123',
  escalationReason: 'Enterprise opportunity - $500K+ potential',
});
```

---

## Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

---

## Monitoring & Debugging

### View Audit Logs

```typescript
// Get all logs for a lead
const logs = orchestrator.getAuditLogs({ entityId: 'lead_123' });

// Get logs by correlation ID (trace entire funnel)
const trace = orchestrator.getAuditLogs({
  correlationId: 'corr_1234567890_abc123'
});

// Get specific event types
const callLogs = orchestrator.getAuditLogs({
  eventType: 'call_completed'
});
```

### View Performance Metrics

```typescript
const metrics = orchestrator.getMetrics();

console.log('Conversion Rate:', metrics.conversionRates.overall);
console.log('Avg Agent01 Duration:', metrics.performance.avgAgent01Duration);
console.log('No-Show Rate:', metrics.quality.noShowRate);
```

---

## Best Practices

1. **Correlation IDs**: Use correlation IDs to trace leads through the entire funnel
2. **Error Handling**: All operations return `{ success: boolean, error?: string }`
3. **Idempotency**: Lead ingestion is idempotent (use sourceId for deduplication)
4. **Monitoring**: Regularly check metrics and set up alerts
5. **Testing**: Test with sample leads before production deployment

---

## Troubleshooting

### Lead not progressing
- Check qualification scores (must be ≥50 for Agent02)
- Review audit logs for errors
- Verify scheduling constraints

### Calls timing out
- Check AI response times
- Verify network connectivity
- Review call transcripts for issues

### Low conversion rates
- Review agent prompts and instructions
- Analyze sentiment scores
- Check executive brief quality

---

## Support

- **Documentation**: See inline code comments
- **Issues**: Create GitHub issue
- **Contact**: team@affynix.ai

---

## License

Proprietary - Affynix LLC

---

**Built with ❤️ by the Affynix Team**
