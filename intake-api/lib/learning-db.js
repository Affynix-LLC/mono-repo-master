import Airtable from 'airtable';

/**
 * Learning Database for AI Routing and Agent Learning
 * 
 * Stores routing decisions, agent conversations, knowledge, and feedback
 * to improve AI routing accuracy and agent performance over time.
 */

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const routingTableName = process.env.AIRTABLE_TABLE_ROUTING_HISTORY || 'RoutingHistory';
const conversationsTableName = process.env.AIRTABLE_TABLE_AGENT_CONVERSATIONS || 'AgentConversations';
const knowledgeTableName = process.env.AIRTABLE_TABLE_AGENT_KNOWLEDGE || 'AgentKnowledge';
const feedbackTableName = process.env.AIRTABLE_TABLE_AGENT_FEEDBACK || 'AgentFeedback';

let base = null;
if (apiKey && baseId) {
  base = new Airtable({ apiKey }).base(baseId);
} else {
  console.warn('[Learning DB] Missing Airtable credentials - learning features disabled');
}

/**
 * Save a routing decision to the learning database
 */
export async function saveRoutingDecision(offer, subdomain, confidence) {
  if (!base) {
    console.log('[Learning DB] Test mode - skipping routing decision save');
    return null;
  }

  try {
    const recordData = {
      OfferName: offer.name || '',
      Category: offer.category || '',
      OriginalSubdomain: subdomain || '',
      Confidence: confidence || 0,
      Network: offer.network || '',
      Summary: offer.summary || '',
      Timestamp: new Date().toISOString(),
      Status: 'pending' // pending, confirmed, corrected
    };

    const created = await base(routingTableName).create(recordData);
    console.log(`[Learning DB] Saved routing decision: ${offer.name} → ${subdomain} (confidence: ${confidence})`);
    return created.id;
  } catch (error) {
    console.error('[Learning DB] Error saving routing decision:', error);
    return null;
  }
}

/**
 * Get similar past routing decisions for an offer
 */
export async function getSimilarRoutings(offer) {
  if (!base) return [];

  try {
    // Search by category and network
    const formula = `AND({Category} = "${offer.category || ''}", {Network} = "${offer.network || ''}")`;
    const records = await base(routingTableName)
      .select({ 
        filterByFormula: formula,
        sort: [{ field: 'Timestamp', direction: 'desc' }],
        maxRecords: 10
      })
      .firstPage();

    return records.map(record => ({
      id: record.id,
      offerName: record.fields.OfferName,
      category: record.fields.Category,
      subdomain: record.fields.OriginalSubdomain,
      correctSubdomain: record.fields.CorrectSubdomain,
      confidence: record.fields.Confidence,
      status: record.fields.Status
    }));
  } catch (error) {
    console.error('[Learning DB] Error getting similar routings:', error);
    return [];
  }
}

/**
 * Record feedback/correction for a routing decision
 */
export async function recordFeedback(offerId, correctSubdomain, reason = null) {
  if (!base) {
    console.log('[Learning DB] Test mode - skipping feedback save');
    return null;
  }

  try {
    const updates = {
      CorrectSubdomain: correctSubdomain,
      Status: 'corrected',
      Feedback: reason || ''
    };

    await base(routingTableName).update(offerId, updates);
    console.log(`[Learning DB] Recorded feedback: ${offerId} → ${correctSubdomain}`);
    return true;
  } catch (error) {
    console.error('[Learning DB] Error recording feedback:', error);
    return false;
  }
}

/**
 * Get routing accuracy statistics
 */
export async function getAccuracyStats() {
  if (!base) return null;

  try {
    const records = await base(routingTableName)
      .select({
        maxRecords: 1000,
        sort: [{ field: 'Timestamp', direction: 'desc' }]
      })
      .firstPage();

    const total = records.length;
    const corrected = records.filter(r => r.fields.Status === 'corrected').length;
    const confirmed = records.filter(r => r.fields.Status === 'confirmed').length;
    const pending = records.filter(r => r.fields.Status === 'pending').length;

    const avgConfidence = records.length > 0
      ? records.reduce((sum, r) => sum + (r.fields.Confidence || 0), 0) / records.length
      : 0;

    return {
      total,
      corrected,
      confirmed,
      pending,
      accuracy: total > 0 ? (confirmed / (confirmed + corrected)) * 100 : 0,
      avgConfidence
    };
  } catch (error) {
    console.error('[Learning DB] Error getting accuracy stats:', error);
    return null;
  }
}

/**
 * Find routing decision by offer name or ID
 */
export async function findRoutingDecision(offerName, offerId = null) {
  if (!base) return null;

  try {
    let formula = `{OfferName} = "${offerName}"`;
    if (offerId) {
      formula = `OR(${formula}, RECORD_ID() = "${offerId}")`;
    }

    const records = await base(routingTableName)
      .select({ filterByFormula: formula, maxRecords: 1 })
      .firstPage();

    if (records.length > 0) {
      const record = records[0];
      return {
        id: record.id,
        offerName: record.fields.OfferName,
        category: record.fields.Category,
        subdomain: record.fields.OriginalSubdomain,
        correctSubdomain: record.fields.CorrectSubdomain,
        confidence: record.fields.Confidence,
        status: record.fields.Status
      };
    }
    return null;
  } catch (error) {
    console.error('[Learning DB] Error finding routing decision:', error);
    return null;
  }
}

/**
 * Save agent conversation to learning database
 */
export async function saveAgentConversation(conversation) {
  if (!base) {
    console.log('[Learning DB] Test mode - skipping conversation save');
    return null;
  }

  try {
    const recordData = {
      ThreadId: conversation.threadId || '',
      AgentId: conversation.agentId || '',
      AgentName: conversation.agentName || '',
      UserMessage: conversation.userMessage || '',
      AssistantMessage: conversation.assistantMessage || '',
      Timestamp: new Date().toISOString(),
      Metadata: JSON.stringify(conversation.metadata || {}),
    };

    const created = await base(conversationsTableName).create(recordData);
    console.log(`[Learning DB] Saved agent conversation: ${conversation.agentName}`);
    return created.id;
  } catch (error) {
    console.error('[Learning DB] Error saving conversation:', error);
    return null;
  }
}

/**
 * Get agent conversations for learning
 */
export async function getAgentConversations(agentId = null, limit = 100) {
  if (!base) return [];

  try {
    let formula = '';
    if (agentId) {
      formula = `{AgentId} = "${agentId}"`;
    }

    const records = await base(conversationsTableName)
      .select({
        filterByFormula: formula || '',
        sort: [{ field: 'Timestamp', direction: 'desc' }],
        maxRecords: limit
      })
      .firstPage();

    return records.map(record => ({
      id: record.id,
      threadId: record.fields.ThreadId,
      agentId: record.fields.AgentId,
      agentName: record.fields.AgentName,
      userMessage: record.fields.UserMessage,
      assistantMessage: record.fields.AssistantMessage,
      timestamp: record.fields.Timestamp,
      metadata: JSON.parse(record.fields.Metadata || '{}'),
    }));
  } catch (error) {
    console.error('[Learning DB] Error getting conversations:', error);
    return [];
  }
}

/**
 * Save knowledge item to learning database
 */
export async function saveKnowledge(knowledge) {
  if (!base) {
    console.log('[Learning DB] Test mode - skipping knowledge save');
    return null;
  }

  try {
    const recordData = {
      Title: knowledge.title || '',
      Content: knowledge.content || '',
      Category: knowledge.category || '',
      Tags: (knowledge.tags || []).join(', '),
      Source: knowledge.source || '',
      Confidence: knowledge.confidence || 0,
      Timestamp: new Date().toISOString(),
      Verified: knowledge.verified || false,
    };

    const created = await base(knowledgeTableName).create(recordData);
    console.log(`[Learning DB] Saved knowledge: ${knowledge.title}`);
    return created.id;
  } catch (error) {
    console.error('[Learning DB] Error saving knowledge:', error);
    return null;
  }
}

/**
 * Get knowledge items
 */
export async function getKnowledge(category = null, limit = 50) {
  if (!base) return [];

  try {
    let formula = '';
    if (category) {
      formula = `{Category} = "${category}"`;
    }

    const records = await base(knowledgeTableName)
      .select({
        filterByFormula: formula || '',
        sort: [{ field: 'Timestamp', direction: 'desc' }],
        maxRecords: limit
      })
      .firstPage();

    return records.map(record => ({
      id: record.id,
      title: record.fields.Title,
      content: record.fields.Content,
      category: record.fields.Category,
      tags: (record.fields.Tags || '').split(', ').filter(Boolean),
      source: record.fields.Source,
      confidence: record.fields.Confidence || 0,
      timestamp: record.fields.Timestamp,
      verified: record.fields.Verified || false,
    }));
  } catch (error) {
    console.error('[Learning DB] Error getting knowledge:', error);
    return [];
  }
}

/**
 * Save user feedback for agent learning
 */
export async function saveAgentFeedback(feedback) {
  if (!base) {
    console.log('[Learning DB] Test mode - skipping feedback save');
    return null;
  }

  try {
    const recordData = {
      ConversationId: feedback.conversationId || '',
      AgentId: feedback.agentId || '',
      Rating: feedback.rating || 0,
      Comment: feedback.comment || '',
      Helpful: feedback.helpful || false,
      Timestamp: new Date().toISOString(),
    };

    const created = await base(feedbackTableName).create(recordData);
    console.log(`[Learning DB] Saved agent feedback: ${feedback.agentId}`);
    return created.id;
  } catch (error) {
    console.error('[Learning DB] Error saving feedback:', error);
    return null;
  }
}

/**
 * Get knowledge statistics
 */
export async function getKnowledgeStats() {
  if (!base) {
    return { conversations: 0, knowledge: 0, feedback: 0 };
  }

  try {
    // Note: Airtable doesn't have a direct count endpoint
    // In production, you'd want to use a formula or maintain a count field
    // For now, we'll return placeholder values
    return {
      conversations: 0, // Will be populated when conversations are saved
      knowledge: 0, // Will be populated when knowledge is saved
      feedback: 0, // Will be populated when feedback is saved
    };
  } catch (error) {
    console.error('[Learning DB] Error getting stats:', error);
    return { conversations: 0, knowledge: 0, feedback: 0 };
  }
}

