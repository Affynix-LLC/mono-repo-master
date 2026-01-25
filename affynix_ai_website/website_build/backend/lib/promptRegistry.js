// Prompt Template Registry
// Maps prompt IDs to their actual system prompt templates

const PROMPT_TEMPLATES = {
  // Default intake agent prompt
  'pmpt_697698bb3df08195b295e1a4009cbfab0a9b742494ff272d': {
    name: 'Intake Agent',
    version: '1.0',
    systemPrompt: `You are Affynix's intelligent intake assistant. Your role is to gather information from potential clients in a conversational, friendly manner.

Your objectives:
1. Warmly greet users and introduce yourself
2. Gather key business information: company name, industry, current challenges, goals
3. Understand their interest in AI automation and digital marketing services
4. Qualify leads by understanding their budget range and timeline
5. Capture contact information (email, phone) for follow-up

Guidelines:
- Be conversational and empathetic
- Ask one question at a time to avoid overwhelming users
- Listen actively and acknowledge their responses
- If they seem hesitant, explain how Affynix can help
- Keep responses concise (2-3 sentences max)
- Use a professional yet friendly tone
- When appropriate, explain Affynix's services: AI automation, lead generation, and digital marketing solutions

When you've gathered sufficient information, thank them and let them know the team will follow up soon.`
  },

  // Add more prompt templates here as needed
  'pmpt_default': {
    name: 'Default Assistant',
    version: '1.0',
    systemPrompt: 'You are a helpful AI assistant for Affynix.'
  }
};

/**
 * Resolve a prompt ID to its system prompt template
 * @param {string} promptId - The prompt ID to resolve
 * @returns {string|null} The resolved system prompt, or null if not found
 */
export const resolvePromptTemplate = (promptId) => {
  if (!promptId) {
    return null;
  }

  const template = PROMPT_TEMPLATES[promptId];
  if (!template) {
    console.warn(`⚠️  Prompt ID "${promptId}" not found in registry.`);
    return null;
  }

  return template.systemPrompt;
};

/**
 * Get prompt template metadata
 * @param {string} promptId - The prompt ID to look up
 * @returns {object|null} Template metadata or null if not found
 */
export const getPromptMetadata = (promptId) => {
  const template = PROMPT_TEMPLATES[promptId];
  if (!template) return null;

  return {
    name: template.name,
    version: template.version,
    promptId
  };
};

/**
 * List all available prompt templates
 * @returns {Array} Array of prompt IDs with metadata
 */
export const listPromptTemplates = () => {
  return Object.entries(PROMPT_TEMPLATES).map(([id, template]) => ({
    promptId: id,
    name: template.name,
    version: template.version
  }));
};

export default {
  resolvePromptTemplate,
  getPromptMetadata,
  listPromptTemplates
};
