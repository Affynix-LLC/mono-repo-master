/**
 * Complete Sales Funnel Workflow
 *
 * Orchestrates the entire lead lifecycle from ingestion to human handoff
 */

import { Workflow } from '../../workflows/types';

/**
 * Main perpetual automation sales funnel workflow
 */
export const salesFunnelWorkflow: Workflow = {
  id: 'perpetual-sales-funnel',
  name: 'Perpetual Automation Sales Funnel',
  description: 'Multi-agent sales funnel with Agent01, Agent02, and human handoff',
  version: '1.0',
  steps: [
    {
      id: 'ingest_lead',
      type: 'tool',
      name: 'Ingest Lead',
      description: 'Ingest lead from any source (email/CRM/LinkedIn/webhook)',
      config: {
        tool: 'ingest_lead',
        args: {
          sourceType: '{{input.sourceType}}',
          data: '{{input.leadData}}',
        },
      },
    },
    {
      id: 'schedule_agent01',
      type: 'tool',
      name: 'Schedule Agent01 Call',
      description: 'Schedule intake call with Agent01',
      dependsOn: ['ingest_lead'],
      config: {
        tool: 'schedule_agent01',
        args: {
          leadId: '{{ingest_lead.lead.id}}',
        },
      },
    },
    {
      id: 'wait_for_agent01_time',
      type: 'tool',
      name: 'Wait for Agent01 Scheduled Time',
      description: 'Wait until the scheduled time for Agent01 call',
      dependsOn: ['schedule_agent01'],
      config: {
        tool: 'wait_until',
        args: {
          timestamp: '{{schedule_agent01.session.scheduledAt}}',
        },
      },
    },
    {
      id: 'execute_agent01',
      type: 'tool',
      name: 'Execute Agent01 Call',
      description: 'Execute intake call with 5-minute limit',
      dependsOn: ['wait_for_agent01_time'],
      config: {
        tool: 'execute_agent01',
        args: {
          sessionId: '{{schedule_agent01.session.id}}',
        },
      },
      retry: {
        maxAttempts: 2,
        delay: 3600000, // 1 hour
      },
    },
    {
      id: 'check_agent01_outcome',
      type: 'tool',
      name: 'Check Agent01 Qualification',
      description: 'Check if lead is qualified for Agent02',
      dependsOn: ['execute_agent01'],
      config: {
        tool: 'evaluate_condition',
        args: {
          condition: '{{execute_agent01.outcome.qualified}} === true',
        },
      },
    },
    {
      id: 'schedule_agent02',
      type: 'tool',
      name: 'Schedule Agent02 Call',
      description: 'Schedule discovery call with Agent02 (24-48hr buffer)',
      dependsOn: ['check_agent01_outcome'],
      config: {
        tool: 'schedule_agent02',
        args: {
          leadId: '{{ingest_lead.lead.id}}',
          agent01SessionId: '{{schedule_agent01.session.id}}',
        },
      },
    },
    {
      id: 'wait_for_agent02_time',
      type: 'tool',
      name: 'Wait for Agent02 Scheduled Time',
      description: 'Wait for 24-48hr buffer period',
      dependsOn: ['schedule_agent02'],
      config: {
        tool: 'wait_until',
        args: {
          timestamp: '{{schedule_agent02.session.scheduledAt}}',
        },
      },
    },
    {
      id: 'execute_agent02',
      type: 'tool',
      name: 'Execute Agent02 Call',
      description: 'Execute discovery call with 5-minute limit',
      dependsOn: ['wait_for_agent02_time'],
      config: {
        tool: 'execute_agent02',
        args: {
          sessionId: '{{schedule_agent02.session.id}}',
        },
      },
      retry: {
        maxAttempts: 2,
        delay: 3600000, // 1 hour
      },
    },
    {
      id: 'check_agent02_outcome',
      type: 'tool',
      name: 'Check Agent02 Qualification',
      description: 'Check if lead is ready for human consultation',
      dependsOn: ['execute_agent02'],
      config: {
        tool: 'evaluate_condition',
        args: {
          condition: '{{execute_agent02.outcome.qualified}} === true',
        },
      },
    },
    {
      id: 'generate_executive_brief',
      type: 'tool',
      name: 'Generate Executive Brief',
      description: 'Generate comprehensive brief with sentiment analysis',
      dependsOn: ['check_agent02_outcome'],
      config: {
        tool: 'generate_brief',
        args: {
          leadId: '{{ingest_lead.lead.id}}',
        },
      },
    },
    {
      id: 'notify_human_consultant',
      type: 'webhook',
      name: 'Notify Human Consultant',
      description: 'Send notification with executive brief to human consultant',
      dependsOn: ['generate_executive_brief'],
      config: {
        url: '{{config.humanConsultantWebhook}}',
        method: 'POST',
        data: {
          leadId: '{{ingest_lead.lead.id}}',
          briefId: '{{generate_executive_brief.brief.id}}',
          executiveSummary: '{{generate_executive_brief.brief.executiveSummary}}',
          recommendedAction: '{{generate_executive_brief.brief.recommendedAction}}',
          confidence: '{{generate_executive_brief.brief.confidenceScore}}',
          estimatedValue: '{{generate_executive_brief.brief.opportunity.estimatedValue}}',
          timeline: '{{generate_executive_brief.brief.opportunity.timeline}}',
          talkingPoints: '{{generate_executive_brief.brief.talkingPoints}}',
          questionsToAsk: '{{generate_executive_brief.brief.questionsToAsk}}',
        },
        headers: {
          'Content-Type': 'application/json',
          'X-Automation-Source': 'perpetual-sales-funnel',
        },
      },
    },
    {
      id: 'schedule_human_consultation',
      type: 'tool',
      name: 'Schedule Human Consultation',
      description: 'Schedule human consultation with 24-48hr buffer',
      dependsOn: ['notify_human_consultant'],
      config: {
        tool: 'schedule_consultation',
        args: {
          leadId: '{{ingest_lead.lead.id}}',
          briefId: '{{generate_executive_brief.brief.id}}',
          bufferHours: 24,
        },
      },
    },
  ],
};

/**
 * Simplified workflow for disqualified leads
 */
export const disqualifiedLeadWorkflow: Workflow = {
  id: 'disqualified-lead-nurture',
  name: 'Disqualified Lead Nurture Workflow',
  description: 'Handle and nurture disqualified leads',
  version: '1.0',
  steps: [
    {
      id: 'update_status',
      type: 'tool',
      name: 'Update Lead Status',
      description: 'Mark lead as disqualified',
      config: {
        tool: 'update_lead_status',
        args: {
          leadId: '{{input.leadId}}',
          status: 'disqualified',
          reason: '{{input.reason}}',
        },
      },
    },
    {
      id: 'send_nurture_email',
      type: 'webhook',
      name: 'Send Nurture Email',
      description: 'Send educational content for nurturing',
      dependsOn: ['update_status'],
      config: {
        url: '{{config.emailServiceUrl}}',
        method: 'POST',
        data: {
          to: '{{input.leadEmail}}',
          template: 'nurture_campaign',
          subject: 'Resources for Your Automation Journey',
          data: {
            name: '{{input.leadName}}',
            reason: '{{input.reason}}',
          },
        },
      },
    },
    {
      id: 'add_to_crm_nurture_list',
      type: 'webhook',
      name: 'Add to CRM Nurture List',
      description: 'Add to long-term nurture campaign',
      dependsOn: ['send_nurture_email'],
      config: {
        url: '{{config.crmWebhookUrl}}',
        method: 'POST',
        data: {
          contactId: '{{input.leadId}}',
          action: 'add_to_list',
          listName: 'nurture_campaign',
          tags: ['disqualified', 'nurture'],
        },
      },
    },
  ],
};

/**
 * Emergency escalation workflow
 */
export const emergencyEscalationWorkflow: Workflow = {
  id: 'emergency-escalation',
  name: 'Emergency Escalation Workflow',
  description: 'Immediate escalation for high-value or urgent leads',
  version: '1.0',
  steps: [
    {
      id: 'flag_as_urgent',
      type: 'tool',
      name: 'Flag as Urgent',
      description: 'Mark lead with urgent flag',
      config: {
        tool: 'update_lead_metadata',
        args: {
          leadId: '{{input.leadId}}',
          metadata: {
            urgent: true,
            escalated: true,
            escalatedAt: '{{now}}',
          },
        },
      },
    },
    {
      id: 'generate_quick_brief',
      type: 'tool',
      name: 'Generate Quick Brief',
      description: 'Generate abbreviated executive brief',
      dependsOn: ['flag_as_urgent'],
      config: {
        tool: 'generate_brief',
        args: {
          leadId: '{{input.leadId}}',
          mode: 'quick',
        },
      },
    },
    {
      id: 'notify_senior_consultant',
      type: 'webhook',
      name: 'Notify Senior Consultant',
      description: 'Immediately notify senior consultant',
      dependsOn: ['generate_quick_brief'],
      config: {
        url: '{{config.emergencyNotificationUrl}}',
        method: 'POST',
        data: {
          priority: 'URGENT',
          leadId: '{{input.leadId}}',
          briefId: '{{generate_quick_brief.brief.id}}',
          reason: '{{input.escalationReason}}',
          estimatedValue: '{{generate_quick_brief.brief.opportunity.estimatedValue}}',
        },
        headers: {
          'X-Priority': 'urgent',
          'X-Notification-Type': 'escalation',
        },
      },
    },
  ],
};

export default salesFunnelWorkflow;
