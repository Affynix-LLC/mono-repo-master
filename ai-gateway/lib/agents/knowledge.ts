/**
 * Knowledge Retrieval Module for AI Gateway Agents
 * 
 * Retrieves stored knowledge from Airtable to improve agent responses
 */

import axios from 'axios';

const API_URL = process.env.AFFYNIX_API_URL || 'https://api.affynix.ai';

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  source: string;
  confidence: number;
  timestamp: string;
  verified: boolean;
}

export interface Conversation {
  id: string;
  threadId: string;
  agentId: string;
  agentName: string;
  userMessage: string;
  assistantMessage: string;
  timestamp: string;
  metadata: Record<string, any>;
}

/**
 * Retrieve relevant knowledge for a query
 */
export async function retrieveKnowledge(query: string, category?: string, limit = 10): Promise<KnowledgeItem[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());

    const response = await axios.get(`${API_URL}/api/knowledge/items?${params.toString()}`);
    const items = response.data.items || [];

    // Simple keyword matching (in production, use vector search)
    const queryLower = query.toLowerCase();
    const relevant = items.filter(item => 
      item.title?.toLowerCase().includes(queryLower) ||
      item.content?.toLowerCase().includes(queryLower) ||
      item.tags?.some(tag => tag.toLowerCase().includes(queryLower))
    );

    return relevant.slice(0, limit);
  } catch (error) {
    console.error('[Knowledge] Error retrieving knowledge:', error);
    return [];
  }
}

/**
 * Get similar past conversations
 */
export async function getSimilarConversations(agentId: string, query: string, limit = 5): Promise<Conversation[]> {
  try {
    const response = await axios.get(
      `${API_URL}/api/knowledge/conversations?agentId=${agentId}&limit=${limit}`
    );
    const conversations = response.data.conversations || [];

    // Simple keyword matching
    const queryLower = query.toLowerCase();
    const relevant = conversations.filter(conv =>
      conv.userMessage?.toLowerCase().includes(queryLower) ||
      conv.assistantMessage?.toLowerCase().includes(queryLower)
    );

    return relevant.slice(0, limit);
  } catch (error) {
    console.error('[Knowledge] Error getting conversations:', error);
    return [];
  }
}

/**
 * Save conversation for learning
 */
export async function saveConversation(conversation: {
  threadId: string;
  agentId: string;
  agentName: string;
  userMessage: string;
  assistantMessage: string;
  metadata?: Record<string, any>;
}): Promise<string | null> {
  try {
    const response = await axios.post(`${API_URL}/api/knowledge/conversations`, conversation);
    return response.data.id || null;
  } catch (error) {
    console.error('[Knowledge] Error saving conversation:', error);
    return null;
  }
}

/**
 * Extract and save knowledge from conversation
 */
export async function extractKnowledge(conversation: Conversation): Promise<string | null> {
  try {
    // Extract key information from conversation
    const knowledge = {
      title: `Knowledge from ${conversation.agentName} conversation`,
      content: conversation.assistantMessage,
      category: conversation.metadata?.category || 'general',
      tags: extractTags(conversation.userMessage, conversation.assistantMessage),
      source: `conversation:${conversation.id}`,
      confidence: 0.7,
      verified: false,
    };

    const response = await axios.post(`${API_URL}/api/knowledge/items`, knowledge);
    return response.data.id || null;
  } catch (error) {
    console.error('[Knowledge] Error extracting knowledge:', error);
    return null;
  }
}

/**
 * Extract tags from text
 */
function extractTags(userMessage: string, assistantMessage: string): string[] {
  const text = `${userMessage} ${assistantMessage}`.toLowerCase();
  const commonTags = ['product', 'pricing', 'feature', 'support', 'integration', 'api', 'setup', 'troubleshooting'];
  return commonTags.filter(tag => text.includes(tag));
}

