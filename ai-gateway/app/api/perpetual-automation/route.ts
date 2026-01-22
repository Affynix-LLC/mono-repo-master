/**
 * Perpetual Automation API
 *
 * API endpoints for the Affynix Perpetual Automation System
 */

import {
  createOrchestrator,
  defaultConfig,
  PerpetualAutomationOrchestrator,
} from '@/lib/perpetual-automation';
import { OrchestratorConfig } from '@/lib/perpetual-automation/types';

// Singleton orchestrator instance
let orchestrator: PerpetualAutomationOrchestrator | null = null;

/**
 * Get or create orchestrator instance
 */
async function getOrchestrator(): Promise<PerpetualAutomationOrchestrator> {
  if (!orchestrator) {
    const config: OrchestratorConfig = {
      ...defaultConfig,
      // Override with environment-specific config
      ai: {
        provider: 'openai',
        model: process.env.AI_MODEL || 'gpt-4',
        maxTokens: 2000,
        temperature: 0.7,
      },
      integrations: {
        email: {
          enabled: !!process.env.EMAIL_PROVIDER,
          provider: (process.env.EMAIL_PROVIDER as any) || 'sendgrid',
          config: {
            apiKey: process.env.EMAIL_API_KEY,
          },
        },
        crm: {
          enabled: !!process.env.CRM_PROVIDER,
          provider: (process.env.CRM_PROVIDER as any) || 'hubspot',
          config: {
            apiKey: process.env.CRM_API_KEY,
          },
        },
        linkedin: {
          enabled: !!process.env.LINKEDIN_API_KEY,
          apiKey: process.env.LINKEDIN_API_KEY,
          config: {},
        },
        zapier: {
          enabled: !!process.env.ZAPIER_WEBHOOK_URL,
          webhookUrl: process.env.ZAPIER_WEBHOOK_URL,
        },
      },
    };

    orchestrator = await createOrchestrator(config);
  }

  return orchestrator;
}

/**
 * POST /api/perpetual-automation
 *
 * Handles various actions for the perpetual automation system
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    const orch = await getOrchestrator();

    switch (action) {
      case 'ingest_lead': {
        const { sourceType, data } = params;
        const result = await orch.ingestLead(sourceType, data);
        return Response.json(result, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'execute_agent01': {
        const { sessionId } = params;
        const result = await orch.executeAgent01Call(sessionId);
        return Response.json(result, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'execute_agent02': {
        const { sessionId } = params;
        const result = await orch.executeAgent02Call(sessionId);
        return Response.json(result, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'get_metrics': {
        const metrics = orch.getMetrics();
        return Response.json({ success: true, metrics }, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'get_lead': {
        const { leadId } = params;
        const lead = orch.getLead(leadId);
        if (!lead) {
          return Response.json(
            { success: false, error: 'Lead not found' },
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return Response.json({ success: true, lead }, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'get_session': {
        const { sessionId } = params;
        const session = orch.getSession(sessionId);
        if (!session) {
          return Response.json(
            { success: false, error: 'Session not found' },
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return Response.json({ success: true, session }, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'get_audit_logs': {
        const { entityId, eventType, correlationId } = params;
        const logs = orch.getAuditLogs({ entityId, eventType, correlationId });
        return Response.json({ success: true, logs }, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      default:
        return Response.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: any) {
    console.error('Perpetual automation API error:', error);
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /api/perpetual-automation
 *
 * Get system status and metrics
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const orch = await getOrchestrator();

    if (action === 'metrics') {
      const metrics = orch.getMetrics();
      return Response.json({ success: true, metrics }, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'status') {
      return Response.json({
        success: true,
        status: 'operational',
        timestamp: new Date().toISOString(),
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Default: return system info
    return Response.json({
      success: true,
      system: 'Affynix Perpetual Automation',
      version: '1.0.0',
      endpoints: {
        ingest_lead: 'POST /api/perpetual-automation { action: "ingest_lead", sourceType, data }',
        execute_agent01: 'POST /api/perpetual-automation { action: "execute_agent01", sessionId }',
        execute_agent02: 'POST /api/perpetual-automation { action: "execute_agent02", sessionId }',
        get_metrics: 'GET /api/perpetual-automation?action=metrics',
        get_status: 'GET /api/perpetual-automation?action=status',
      },
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Perpetual automation API error:', error);
    return Response.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
