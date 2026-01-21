/**
 * Basic Usage Examples for Affynix Perpetual Automation System
 */

import {
  createOrchestrator,
  defaultConfig,
  OrchestratorConfig,
} from '../index';

/**
 * Example 1: Initialize orchestrator
 */
async function example1_InitializeOrchestrator() {
  console.log('=== Example 1: Initialize Orchestrator ===\n');

  const config: OrchestratorConfig = {
    ...defaultConfig,
    scheduling: {
      ...defaultConfig.scheduling,
      minBufferHours: 24,
      maxBufferHours: 48,
      maxCallDurationMinutes: 5,
    },
  };

  const orchestrator = await createOrchestrator(config);
  console.log('✓ Orchestrator initialized successfully\n');

  return orchestrator;
}

/**
 * Example 2: Ingest lead from email
 */
async function example2_IngestEmailLead() {
  console.log('=== Example 2: Ingest Email Lead ===\n');

  const orchestrator = await example1_InitializeOrchestrator();

  const result = await orchestrator.ingestLead('email', {
    from: 'john.doe@acmecorp.com',
    subject: 'Interested in AI Automation',
    formData: {
      name: 'John Doe',
      email: 'john.doe@acmecorp.com',
      phone: '+1-555-0123',
      company: 'Acme Corporation',
      message:
        'We are interested in automating our customer support and sales processes. Looking for AI solutions.',
    },
  });

  if (result.success && result.lead) {
    console.log('✓ Lead ingested successfully');
    console.log('  Lead ID:', result.lead.id);
    console.log('  Name:', result.lead.name);
    console.log('  Company:', result.lead.company);
    console.log('  Status:', result.lead.status);
    console.log('  Source:', result.lead.source);
    console.log('\n');
  } else {
    console.error('✗ Lead ingestion failed:', result.error);
  }

  return result;
}

/**
 * Example 3: Ingest lead from CRM
 */
async function example3_IngestCRMLead() {
  console.log('=== Example 3: Ingest CRM Lead ===\n');

  const orchestrator = await example1_InitializeOrchestrator();

  const result = await orchestrator.ingestLead('crm', {
    id: 'sf_lead_12345',
    provider: 'salesforce',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techstartup.io',
    phone: '+1-555-0456',
    company: 'TechStartup Inc',
    companySize: 'Medium',
    industry: 'Technology',
    annualRevenue: 5000000,
    leadScore: 75,
    description:
      'Looking for AI-powered automation to scale customer operations.',
  });

  if (result.success && result.lead) {
    console.log('✓ CRM lead ingested successfully');
    console.log('  Lead ID:', result.lead.id);
    console.log('  Name:', result.lead.name);
    console.log('  Company:', result.lead.company);
    console.log('  Industry:', result.lead.industry);
    console.log('  Qualification Score:', result.lead.qualificationScore);
    console.log('\n');
  } else {
    console.error('✗ CRM lead ingestion failed:', result.error);
  }

  return result;
}

/**
 * Example 4: Ingest lead from LinkedIn
 */
async function example4_IngestLinkedInLead() {
  console.log('=== Example 4: Ingest LinkedIn Lead ===\n');

  const orchestrator = await example1_InitializeOrchestrator();

  const result = await orchestrator.ingestLead('linkedin', {
    id: 'li_12345',
    source: 'lead_gen_form',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@enterprise.com',
    phone: '+1-555-0789',
    company: 'Enterprise Solutions Corp',
    jobTitle: 'VP of Operations',
    seniority: 'VP',
    function: 'Operations',
    industry: 'Enterprise Software',
    companySize: 'Enterprise',
    campaignId: 'campaign_abc123',
    formResponses: {
      'What are your biggest challenges?':
        'Scaling customer support without increasing headcount',
      'What is your timeline?': 'Looking to implement in Q1 2026',
    },
  });

  if (result.success && result.lead) {
    console.log('✓ LinkedIn lead ingested successfully');
    console.log('  Lead ID:', result.lead.id);
    console.log('  Name:', result.lead.name);
    console.log('  Company:', result.lead.company);
    console.log('  LinkedIn Source:', result.lead.customFields?.linkedinSource);
    console.log('  Qualification Score:', result.lead.qualificationScore);
    console.log('\n');
  } else {
    console.error('✗ LinkedIn lead ingestion failed:', result.error);
  }

  return result;
}

/**
 * Example 5: Get pipeline metrics
 */
async function example5_GetMetrics() {
  console.log('=== Example 5: Get Pipeline Metrics ===\n');

  const orchestrator = await example1_InitializeOrchestrator();

  // Ingest a few test leads first
  await orchestrator.ingestLead('email', {
    from: 'test1@example.com',
    formData: { name: 'Test User 1', email: 'test1@example.com' },
  });

  await orchestrator.ingestLead('crm', {
    id: 'test2',
    provider: 'hubspot',
    email: 'test2@example.com',
    fullName: 'Test User 2',
  });

  // Get metrics
  const metrics = orchestrator.getMetrics();

  console.log('Pipeline Metrics:');
  console.log('  Total New Leads:', metrics.leads.new);
  console.log('  Agent01 Scheduled:', metrics.leads.agent01_scheduled);
  console.log('  Agent01 Completed:', metrics.leads.agent01_completed);
  console.log('  Agent02 Scheduled:', metrics.leads.agent02_scheduled);
  console.log('  Agent02 Completed:', metrics.leads.agent02_completed);
  console.log('  Ready for Human:', metrics.leads.human_ready);
  console.log('  Converted:', metrics.leads.converted);
  console.log('  Disqualified:', metrics.leads.disqualified);
  console.log('\n');

  console.log('Conversion Rates:');
  console.log(
    '  Agent01 → Agent02:',
    metrics.conversionRates.agent01_to_agent02.toFixed(1) + '%'
  );
  console.log(
    '  Agent02 → Human:',
    metrics.conversionRates.agent02_to_human.toFixed(1) + '%'
  );
  console.log(
    '  Human → Converted:',
    metrics.conversionRates.human_to_converted.toFixed(1) + '%'
  );
  console.log(
    '  Overall Conversion:',
    metrics.conversionRates.overall.toFixed(1) + '%'
  );
  console.log('\n');

  return metrics;
}

/**
 * Example 6: Get audit logs
 */
async function example6_GetAuditLogs() {
  console.log('=== Example 6: Get Audit Logs ===\n');

  const orchestrator = await example1_InitializeOrchestrator();

  // Ingest a lead to generate logs
  const result = await orchestrator.ingestLead('email', {
    from: 'audit@example.com',
    formData: { name: 'Audit Test', email: 'audit@example.com' },
  });

  if (result.success && result.lead) {
    // Get all logs for this lead
    const logs = orchestrator.getAuditLogs({ entityId: result.lead.id });

    console.log(`Found ${logs.length} audit log entries for lead ${result.lead.id}:`);
    logs.forEach((log, index) => {
      console.log(`\n  Log ${index + 1}:`);
      console.log('    Event Type:', log.eventType);
      console.log('    Action:', log.action);
      console.log('    Actor:', log.actor);
      console.log('    Timestamp:', log.timestamp.toISOString());
    });
    console.log('\n');
  }
}

/**
 * Example 7: Complete workflow simulation
 */
async function example7_CompleteWorkflow() {
  console.log('=== Example 7: Complete Workflow Simulation ===\n');

  const orchestrator = await example1_InitializeOrchestrator();

  // Step 1: Ingest lead
  console.log('Step 1: Ingesting lead...');
  const ingestResult = await orchestrator.ingestLead('email', {
    from: 'workflow@example.com',
    formData: {
      name: 'Workflow Test',
      email: 'workflow@example.com',
      company: 'Test Corp',
      message: 'Interested in automation solutions',
    },
  });

  if (!ingestResult.success || !ingestResult.lead) {
    console.error('Failed to ingest lead');
    return;
  }

  console.log('✓ Lead ingested:', ingestResult.lead.id);
  console.log('✓ Lead status:', ingestResult.lead.status);
  console.log('✓ Agent01 automatically scheduled\n');

  // Note: In production, Agent01 and Agent02 calls would be executed at their scheduled times
  // This is a simulation of what would happen

  console.log('Next steps (automated):');
  console.log('  1. Agent01 call executes at scheduled time');
  console.log('  2. If qualified: Agent02 scheduled (24-48hr buffer)');
  console.log('  3. Agent02 call executes at scheduled time');
  console.log('  4. Executive brief generated');
  console.log('  5. Human consultant notified');
  console.log('\n');

  // Get metrics
  const metrics = orchestrator.getMetrics();
  console.log('Current Pipeline Status:');
  console.log('  New Leads:', metrics.leads.new);
  console.log('  Agent01 Scheduled:', metrics.leads.agent01_scheduled);
  console.log('\n');
}

/**
 * Run all examples
 */
async function runAllExamples() {
  try {
    await example1_InitializeOrchestrator();
    await example2_IngestEmailLead();
    await example3_IngestCRMLead();
    await example4_IngestLinkedInLead();
    await example5_GetMetrics();
    await example6_GetAuditLogs();
    await example7_CompleteWorkflow();

    console.log('=== All Examples Completed Successfully ===\n');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Export examples
export {
  example1_InitializeOrchestrator,
  example2_IngestEmailLead,
  example3_IngestCRMLead,
  example4_IngestLinkedInLead,
  example5_GetMetrics,
  example6_GetAuditLogs,
  example7_CompleteWorkflow,
  runAllExamples,
};

// Run if executed directly
if (require.main === module) {
  runAllExamples();
}
