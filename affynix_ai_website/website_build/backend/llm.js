import OpenAI from 'openai';
import { resolvePromptTemplate } from './lib/promptRegistry.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const LLM_MODEL = process.env.LLM_MODEL || 'gpt-4-turbo-preview';

if (!OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY not set. LLM features will not work.');
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

// Get conversation history from database
export const getConversationHistory = async (conversationId, dbHelpers) => {
  const messages = dbHelpers.getMessagesByConversation(conversationId);
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
};

// Invoke LLM with streaming support
export const invokeLLM = async (prompt, options = {}) => {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const {
    conversationId = null,
    systemPrompt = 'You are a helpful AI assistant.',
    promptId = null,
    temperature = 0.7,
    maxTokens = 2000,
    stream = false,
    dbHelpers = null
  } = options;

  // Build messages array
  const messages = [];
  
  // Resolve prompt template if promptId is provided
  // Priority: resolved template > explicitly provided systemPrompt > default
  let resolvedSystemPrompt = systemPrompt;
  if (promptId) {
    const template = resolvePromptTemplate(promptId);
    if (template) {
      resolvedSystemPrompt = template;
    }
    // If promptId provided but not found, fall back to systemPrompt
  }

  // Add system message
  messages.push({ role: 'system', content: resolvedSystemPrompt });

  // Add conversation history if conversationId provided
  if (conversationId && dbHelpers) {
    const history = await getConversationHistory(conversationId, dbHelpers);
    // Add history (excluding the system message)
    messages.push(...history);
  }

  // Add current user prompt
  messages.push({ role: 'user', content: prompt });

  try {
    if (stream) {
      // Return stream for real-time responses
      const stream = await openai.chat.completions.create({
        model: LLM_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true
      });

      return stream;
    } else {
      // Return complete response
      const completion = await openai.chat.completions.create({
        model: LLM_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens
      });

      return completion.choices[0].message.content;
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`LLM error: ${error.message}`);
  }
};

// Simple LLM call (non-streaming)
export const simpleLLMCall = async (prompt, systemPrompt = null) => {
  return invokeLLM(prompt, {
    systemPrompt: systemPrompt || 'You are a helpful AI assistant.',
    stream: false
  });
};
