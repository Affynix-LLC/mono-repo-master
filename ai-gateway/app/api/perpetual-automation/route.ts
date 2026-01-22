/**
 * Perpetual Automation API
 *
 * API endpoints for the Affynix Perpetual Automation System
 */

import { NextRequest, NextResponse } from 'next/server';
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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    const orch = await getOrchestrator();

    switch (action) {
      case 'ingest_lead': {
        const { sourceType, data } = params;
        const result = await orch.ingestLead(sourceType, data);
        return NextResponse.json(result);
      }

      case 'execute_agent01': {
        const { sessionId } = params;
        const result = await orch.executeAgent01Call(sessionId);
        return NextResponse.json(result);
      }

      case 'execute_agent02': {
        const { sessionId } = params;
        const result = await orch.executeAgent02Call(sessionId);
        return NextResponse.json(result);
      }

      case 'get_metrics': {
        const metrics = orch.getMetrics();
        return NextResponse.json({ success: true, metrics });
      }

      case 'get_lead': {
        const { leadId } = params;
        const lead = orch.getLead(leadId);
        if (!lead) {
          return NextResponse.json(
            { success: false, error: 'Lead not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, lead });
      }

      case 'get_session': {
        const { sessionId } = params;
        const session = orch.getSession(sessionId);
        if (!session) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, session });
      }

      case 'get_audit_logs': {
        const { entityId, eventType, correlationId } = params;
        const logs = orch.getAuditLogs({ entityId, eventType, correlationId });
        return NextResponse.json({ success: true, logs });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Perpetual automation API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/perpetual-automation
 *
 * Get system status and metrics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const orch = await getOrchestrator();

    if (action === 'metrics') {
      const metrics = orch.getMetrics();
      return NextResponse.json({ success: true, metrics });
    }

    if (action === 'status') {
      return NextResponse.json({
        success: true,
        status: 'operational',
        timestamp: new Date().toISOString(),
      });
    }

    // Default: return system info
    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error('Perpetual automation API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
