import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY not set. Assistants API features will not work.');
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

/**
 * Create a new OpenAI thread and run the assistant with a hidden system cue
 * Used for bootstrap "start" messages
 */
export const createThreadWithBootstrap = async (assistantId) => {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('[Assistants] Creating thread with bootstrap for assistant:', assistantId);

  // Create an EMPTY thread - the assistant's system prompt says:
  // "You automatically begin the conversation by delivering the opening greeting 
  // and starting intake when a new chat session begins."
  // So we let the assistant speak first with no user message
  const thread = await openai.beta.threads.create();

  console.log('[Assistants] Thread created:', thread.id);

  // Create a run to start the assistant
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId
  });

  console.log('[Assistants] Run created:', run.id, 'Status:', run.status);

  return { thread, run };
};

/**
 * Create a run on an existing thread without adding a new user message.
 */
export const createRunOnThread = async (threadId, assistantId) => {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  return openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId
  });
};

/**
 * Add a message to an existing thread and run the assistant
 */
export const addMessageAndRun = async (threadId, content, assistantId) => {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  // Add user message to thread
  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: content
  });

  // Create a run
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId
  });

  return run;
};

/**
 * Wait for a run to complete and stream the response
 */
export const waitForRunAndStream = async function* (threadId, runId) {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  // Poll for run completion
  let run = await openai.beta.threads.runs.retrieve(threadId, runId);
  
  while (run.status === 'queued' || run.status === 'in_progress') {
    await new Promise(resolve => setTimeout(resolve, 500));
    run = await openai.beta.threads.runs.retrieve(threadId, runId);
  }

  if (run.status === 'completed' || run.status === 'requires_action') {
    // Get the latest messages from the thread
    const messages = await openai.beta.threads.messages.list(threadId, {
      limit: 10,
      order: 'desc'
    });

    console.log('[Assistants] Run finished with status:', run.status, 'Total messages:', messages.data.length);
    messages.data.forEach((msg, idx) => {
      console.log(`[Assistants] Message ${idx}: role=${msg.role}, content type=${msg.content[0]?.type}`);
      if (msg.content[0]?.type === 'text') {
        console.log(`[Assistants] Message ${idx} text preview:`, msg.content[0].text.value.substring(0, 100));
      }
    });

    // Find the first assistant message (skip any user messages)
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
    
    if (assistantMessage) {
      const content = assistantMessage.content[0];
      if (content.type === 'text') {
        // Stream the text content character by character for smooth streaming
        const text = content.text.value;
        console.log('[Assistants] Found assistant message, streaming response, length:', text.length);
        console.log('[Assistants] Full message text:', text);
        for (let i = 0; i < text.length; i++) {
          yield {
            choices: [{
              delta: {
                content: text[i]
              }
            }]
          };
        }
      } else {
        console.warn('[Assistants] Assistant message content is not text type:', content.type);
      }
    } else {
      console.warn('[Assistants] No assistant message found in thread after run finished');
      console.warn('[Assistants] Available messages:', messages.data.map(m => ({ role: m.role, hasContent: m.content.length > 0 })));
      // Yield empty response if no message found
      yield {
        choices: [{
          delta: {
            content: ''
          }
        }]
      };
    }
  } else if (run.status === 'failed') {
    console.error('[Assistants] Run failed:', run.last_error);
    throw new Error(`Run failed: ${run.last_error?.message || 'Unknown error'}`);
  } else {
    console.warn('[Assistants] Run ended with unexpected status:', run.status);
    throw new Error(`Run ended with status: ${run.status}`);
  }
};

/**
 * Get the latest assistant message from a thread
 */
export const getLatestAssistantMessage = async (threadId) => {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const messages = await openai.beta.threads.messages.list(threadId, {
    limit: 1,
    order: 'desc'
  });

  const assistantMessage = messages.data[0];
  if (assistantMessage && assistantMessage.role === 'assistant') {
    const content = assistantMessage.content[0];
    if (content.type === 'text') {
      return content.text.value;
    }
  }

  return null;
};
