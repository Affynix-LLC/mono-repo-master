# Prompt Template Registry

## Overview

The Prompt Registry is a centralized system for managing AI agent prompt templates. Instead of hardcoding prompts or passing them as arbitrary strings, the registry provides a structured way to define, version, and reuse prompts across the application.

## Why Use the Prompt Registry?

**Before (the problem):**
```javascript
// ❌ Prompt ID was just appended as text - the LLM couldn't use it
const systemPrompt = `You are a helpful assistant.\n\n[Prompt ID: ${promptId}]`;
```

**After (the solution):**
```javascript
// ✅ Prompt ID resolves to actual template content
const systemPrompt = resolvePromptTemplate(promptId);
```

## Benefits

1. **Separation of Concerns**: Prompts are defined separately from business logic
2. **Reusability**: One prompt template can be used across multiple conversations
3. **Versioning**: Track which version of a prompt was used for analytics/debugging
4. **Maintainability**: Update prompts in one place without touching application code
5. **Type Safety**: Centralized registry prevents typos and missing prompts

## File Location

```
affynix_ai_website/website_build/backend/lib/promptRegistry.js
```

## Usage

### 1. Basic Usage (Resolve Prompt Template)

```javascript
import { resolvePromptTemplate } from './lib/promptRegistry.js';

// Resolve a prompt ID to get the full system prompt
const promptId = 'pmpt_697698bb3df08195b295e1a4009cbfab0a9b742494ff272d';
const systemPrompt = resolvePromptTemplate(promptId);

// Use it in your LLM call
await invokeLLM(userMessage, {
  promptId,  // The function will resolve this internally
  stream: true
});
```

### 2. Get Prompt Metadata

```javascript
import { getPromptMetadata } from './lib/promptRegistry.js';

const metadata = getPromptMetadata('pmpt_697698bb3df08195b295e1a4009cbfab0a9b742494ff272d');
console.log(metadata);
// Output: { name: 'Intake Agent', version: '1.0', promptId: '...' }
```

### 3. List All Available Prompts

```javascript
import { listPromptTemplates } from './lib/promptRegistry.js';

const allPrompts = listPromptTemplates();
console.log(allPrompts);
// Output: Array of { promptId, name, version }
```

## Adding New Prompt Templates

To add a new prompt template, edit `promptRegistry.js` and add an entry to the `PROMPT_TEMPLATES` object:

```javascript
const PROMPT_TEMPLATES = {
  'pmpt_your_unique_id': {
    name: 'Your Prompt Name',
    version: '1.0',
    systemPrompt: `Your detailed system prompt here.
    
    Can span multiple lines.
    Include instructions, guidelines, and examples.`
  },
  
  // ... other templates
};
```

### Prompt ID Naming Convention

Use the format: `pmpt_<hash>`
- Prefix: `pmpt_` (stands for "prompt")
- Hash: A unique identifier (can be generated or sequential)

Example: `pmpt_697698bb3df08195b295e1a4009cbfab0a9b742494ff272d`

## Current Prompts

### 1. Intake Agent (`pmpt_697698bb3df08195b295e1a4009cbfab0a9b742494ff272d`)

**Purpose**: Conversational lead capture and qualification  
**Version**: 1.0  
**Used By**: Frontend chat widget on affynix.ai

This prompt guides the AI to:
- Greet users warmly
- Gather business information (company, industry, challenges)
- Qualify leads (budget, timeline)
- Capture contact details
- Maintain a professional yet friendly tone

### 2. Default Assistant (`pmpt_default`)

**Purpose**: Fallback prompt when no specific prompt is provided  
**Version**: 1.0  
**Behavior**: Simple helpful assistant

## Integration with LLM Module

The `llm.js` module automatically uses the prompt registry:

```javascript
// In llm.js
import { resolvePromptTemplate } from './lib/promptRegistry.js';

export const invokeLLM = async (prompt, options = {}) => {
  const { promptId, systemPrompt } = options;
  
  // If promptId is provided, resolve it to the full template
  const resolvedSystemPrompt = promptId
    ? resolvePromptTemplate(promptId)
    : systemPrompt;
  
  // ... rest of LLM invocation
};
```

## Environment Variables

Set a default prompt ID in your `.env` file:

```bash
# Default prompt ID when none is specified
AFFYNIX_AGENT_PROMPT_ID=pmpt_697698bb3df08195b295e1a4009cbfab0a9b742494ff272d
```

This is used in `websocket.js` when creating conversations:

```javascript
const promptId = conv?.metadata?.prompt?.id ||
  process.env.AFFYNIX_AGENT_PROMPT_ID ||
  'pmpt_697698bb3df08195b295e1a4009cbfab0a9b742494ff272d';
```

## Best Practices

1. **Versioning**: Increment version numbers when making significant changes
2. **Documentation**: Add comments explaining what each prompt does
3. **Testing**: Test new prompts thoroughly before deploying
4. **Backup**: Keep old versions in comments if you need to roll back
5. **Naming**: Use descriptive names that indicate the prompt's purpose

## Future Enhancements

Potential improvements to consider:

- Database-backed prompt storage for dynamic updates
- A/B testing framework for prompt variations
- Analytics to track which prompts perform best
- Web UI for non-technical users to edit prompts
- Multi-language support with locale-based prompts

## Troubleshooting

### Warning: Prompt ID not found

```
⚠️  Prompt ID "pmpt_xyz" not found in registry. Using default.
```

**Solution**: Add the missing prompt ID to `PROMPT_TEMPLATES` in `promptRegistry.js`

### Import Error

```
Error: Cannot find module './lib/promptRegistry.js'
```

**Solution**: Ensure the file exists at `backend/lib/promptRegistry.js` and the path is correct

## Related Files

- `llm.js` - Uses the prompt registry to resolve prompts
- `websocket.js` - Passes prompt IDs when creating conversations
- `frontend/src/pages/Index.jsx` - Sets prompt ID in conversation metadata
- `.env.example` - Documents the `AFFYNIX_AGENT_PROMPT_ID` variable
